import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from './ui';
import { SURVEY_EMBED_URL, SURVEY_ID, isSurveyActive } from '../constants/survey';

type SurveyStatus = 'dismissed' | 'completed';

const STORAGE_KEY = `survey:${SURVEY_ID}`;

function readStatus(): SurveyStatus | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'dismissed' || saved === 'completed' ? saved : null;
  } catch {
    return null;
  }
}

function writeStatus(status: SurveyStatus) {
  try {
    localStorage.setItem(STORAGE_KEY, status);
  } catch {
    // 저장소 접근이 막힌 경우 이번 세션에서만 숨긴다
  }
}

export const SurveyCard: React.FC = () => {
  const [status, setStatus] = useState<SurveyStatus | null>(readStatus);
  const [isSnoozed, setIsSnoozed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isVisible = isSurveyActive() && !status && !isSnoozed;

  // 모달이 떠 있는 동안 Esc 로도 닫는다 (이번에만 숨김)
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSnoozed(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  const finish = (nextStatus: SurveyStatus) => {
    writeStatus(nextStatus);
    setStatus(nextStatus);
  };

  return (
    // 사이드바 전체를 덮는 알림형 모달. 계산 결과 사이에 끼면 눈에 띄지 않아 가운데에 띄운다.
    <div
      role="dialog"
      aria-modal="true"
      aria-label="사용자 설문"
      onClick={() => setIsSnoozed(true)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px] animate-slide-in"
    >
      <div className="w-full max-w-[320px]" onClick={(event) => event.stopPropagation()}>
        <Card variant="info" className="max-h-[88vh] overflow-y-auto bg-bg-card shadow-lg">
          <CardHeader icon="📝" title="셀러님, 정말 잠깐만 도와주세요." />
          <CardContent>
            {!isOpen ? (
              <>
                <p className="text-sm text-text-secondary">
                  저희가 혼자 짐작하며 만들고 싶지 않습니다.<br />
                  실제로 판매하시는 셀러님이 어떤 순간에 막히고, 무엇이 가장 아쉬운지 듣고 싶어요.<br />
                  딱 1분만 들려주시면 다음 개선에 꼭 반영하겠습니다.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:opacity-90 transition-opacity"
                  >
                    1분만 참여하기
                  </button>
                  <button
                    onClick={() => setIsSnoozed(true)}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border border-border bg-bg-card text-text-secondary hover:text-text-primary transition-colors"
                  >
                    나중에 할게요
                  </button>
                </div>
                <button
                  onClick={() => finish('dismissed')}
                  className="text-xs text-text-secondary underline hover:text-text-primary"
                >
                  다시 보지 않기
                </button>
              </>
            ) : (
              <>
                <iframe
                  src={SURVEY_EMBED_URL}
                  title="Sellgent AI 사용자 설문"
                  className="w-full rounded-lg border border-border bg-white"
                  style={{ height: 'min(640px, 62vh)' }}
                >
                  설문을 불러오는 중이에요…
                </iframe>
                <p className="text-xs text-text-secondary">
                  응답은 Google Forms로 바로 제출돼요. 확장 프로그램은 응답 내용을 저장하거나 전송하지 않아요.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => finish('completed')}
                    className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:opacity-90 transition-opacity"
                  >
                    제출했어요
                  </button>
                  <button
                    onClick={() => setIsSnoozed(true)}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border border-border bg-bg-card text-text-secondary hover:text-text-primary transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
