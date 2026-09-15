// 사용자 설문 설정
// SURVEY_EMBED_URL 또는 SURVEY_END_DATE 가 비어 있으면 설문 카드는 표시되지 않는다.

// 설문 회차 식별자. 새 설문을 시작할 때 바꾸면 이전 참여 기록과 무관하게 다시 노출된다.
export const SURVEY_ID = '2026-09-user-survey';

// 구글폼 → 보내기 → 삽입 HTML 의 src 값 (…/viewform?embedded=true)
export const SURVEY_EMBED_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScsDaeYFrAMItAGE47FsjZC6KR7rara9oIhf70Ib_1UP5s2Mw/viewform?embedded=true';

// 설문 종료일 (YYYY-MM-DD, 한국 시간 기준 해당 날짜 23:59:59까지 노출)
export const SURVEY_END_DATE = '2026-10-15';

const GOOGLE_FORMS_PREFIX = 'https://docs.google.com/forms/';

export function isSurveyActive(now: Date = new Date()): boolean {
  if (!SURVEY_EMBED_URL.startsWith(GOOGLE_FORMS_PREFIX)) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(SURVEY_END_DATE)) return false;
  const endAt = new Date(`${SURVEY_END_DATE}T23:59:59+09:00`);
  return now.getTime() <= endAt.getTime();
}
