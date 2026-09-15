import React, { useState } from 'react';
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

  if (!isSurveyActive() || status || isSnoozed) return null;

  const finish = (nextStatus: SurveyStatus) => {
    writeStatus(nextStatus);
    setStatus(nextStatus);
  };

  return (
    <Card variant="info" className="animate-slide-in">
      <CardHeader icon="📝" title="1분 설문에 참여해 주세요" />
      <CardContent>
        {!isOpen ? (
          <>
            <p className="text-sm text-text-secondary">
              로켓그로스 셀러에게 꼭 필요한 도구로 만들기 위해 실제 사용자 의견을 듣고 있어요.
              모든 문항은 선택이에요.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(true)}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:opacity-90 transition-opacity"
              >
                설문 참여하기
              </button>
              <button
                onClick={() => setIsSnoozed(true)}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-border bg-bg-card text-text-secondary hover:text-text-primary transition-colors"
              >
                나중에
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
              style={{ height: 640 }}
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
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-border bg-bg-card text-text-secondary hover:text-text-primary transition-colors"
              >
                접기
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
