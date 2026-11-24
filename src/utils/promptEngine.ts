import { CASE_FULL_TEXT, CASE_PROMPT_QUESTION } from '../data/caseData';
import { QUESTIONS_DATA } from '../data/questionsData';
import { CoachPresetId, QuestionItem, StudyState } from '../types';

export const TOP_DOWN_TEACHING_RULES = `단순히 완성된 모범답안을 자판기처럼 통째로 출력해 주면 읽히지도 않고 머릿속에 구조가 남지 않으며, 반대로 전체 큰 그림을 숨긴 채 스무고개처럼 질문만 던지면 맥락을 잡기 힘듭니다. 다음 [탑다운(Top-down) 티칭 방식]에 따라 도와주세요:
1. [내부 정답 확정]: 관련 헌법 조문과 헌법재판소 결정례 원문을 기준으로 누락 없는 법학적 정답 구조를 내부적으로 먼저 확정할 것(임의의 가정적 사실관계 변형 금지).
2. [1단계 - 최상위 전체 지도(뼈대) 제시]: 긴 줄글 해설 대신, 초심자가 전체 판을 한눈에 내려다볼 수 있도록 단계별 관문(문턱 적법요건/각하 문제 vs 본안 판단 문제, 각 행위와 인물들의 법적 의미, 기본 개념의 정의)을 10~15줄 이내의 직관적인 탑다운 구조도(개조식 지도)로 먼저 제시할 것(내가 이미 초안을 적었다면 이 전체 지도 위에서 내가 맞힌 관문과 빠뜨린 관문을 짚어줄 것).
3. [2단계 - 호기심 기반 분해 & 재구성]: 설명 끝에는 내가 가장 궁금해할 핵심 갈림길 1~2가지를 짚어 질문이나 생각을 유도하고, 이후 내가 내 언어로 논리를 요약해 보면 법학 답안 기준으로 피드백해 줄 것.`;

function formatUserChoice(q: QuestionItem, selected: number | 'O' | 'X'): string {
  if (q.type === 'ox') return `${selected}`;
  const idx = Number(selected) - 1;
  const text = q.choices?.[idx] ?? '';
  return `선지 ${selected}번 ("${text}")`;
}

function formatCorrectChoice(q: QuestionItem): string {
  if (q.type === 'ox') return `${q.answer}`;
  const idx = Number(q.answer) - 1;
  const text = q.choices?.[idx] ?? '';
  return `선지 ${q.answer}번 ("${text}")`;
}

export function buildQuestionExplainPrompt(
  q: QuestionItem,
  selected?: number | 'O' | 'X',
  userNote?: string
): string {
  const choicesBlock =
    q.type === 'mcq' && q.choices
      ? q.choices.map((c, i) => `${i + 1}. ${c}`).join('\n')
      : '(O / X 판별 문항)';

  const xraySummary = q.xrayPoints
    .map(
      (x) =>
        `- [${x.trapType}] 틀린 구절: "${x.wrongSpan}" → 올바른 법리: "${x.rightSpan}" (${x.basis})`
    )
    .join('\n');

  const userPickLine = selected
    ? `- 내가 고른 답: ${formatUserChoice(q, selected)} (${
        selected === q.answer ? '정답이지만 법리 경계 재확인 희망' : '오답 선택'
      })`
    : `- 현재 상태: 이 문항의 선지별 판단 기준을 확실히 이해하고 싶음`;

  const noteBlock = userNote?.trim()
    ? `\n[내가 풀면서 생각한 점 · 특히 헷갈리는 부분]\n${userNote.trim()}\n`
    : '';

  return `대학교 법학과 『헌법원리와제도』 수업의 '사법부' 파트를 복습 중입니다.
아래 문제에서 내가 헷갈린 부분을 알기 쉽게 비교 설명해 주세요.

[문제 정보: ${q.sourceTitle}]
질문: ${q.stem}
${choicesBlock}

[풀이 현황 및 핵심 법리 기준]
${userPickLine}
- 실제 정답: ${formatCorrectChoice(q)}
- 핵심 근거: ${q.referenceBasis}
- 출제 함정 포인트:
${xraySummary}
- 기본 해설: ${q.explanation}
${noteBlock}
[티칭 지시사항]
${TOP_DOWN_TEACHING_RULES}
*(보충 기준: 조문 숫자나 판례 결론을 임의로 변형하지 말고 다수의견 기준으로 설명하되, 법원조직법 제7조 제1항은 '대법관 전원의 3분의 2 이상의 합의체' 원문 표현을 유지해 주세요.)*`;
}

export function buildQuestionVariantPrompt(
  q: QuestionItem,
  userNote?: string
): string {
  const xraySummary = q.xrayPoints
    .map((x) => `- ${x.trapType}: "${x.wrongSpan}" vs "${x.rightSpan}" (${x.basis})`)
    .join('\n');

  const noteBlock = userNote?.trim()
    ? `\n[내가 추가로 연습하고 싶은 방향]\n${userNote.trim()}\n`
    : '';

  return `대학교 법학과 『헌법원리와제도』 사법부 복습을 위해 아래 문항과 같은 쟁점을 다루는 실전 변형문제를 풀어보고 싶습니다.

[기준 문항: ${q.sourceTitle}]
- 질문: ${q.stem}
- 핵심 근거 조문·판례: ${q.referenceBasis}
- 핵심 함정 포인트:
${xraySummary}
${noteBlock}
[출제 및 진행 규칙]
1. 기초 법학 학습에 혼란이 생기지 않도록 헌법재판소 결정례의 사실관계나 결론을 임의로 지어내거나 왜곡하지 마세요.
2. 실제 헌법(제60조, 제101조~제110조)·법원조직법 조문 및 위 판례의 '주체 바꾸기, 정족수 바꾸기, 원칙·예외 역전, 청구인 주장·소수 반대의견 위장' 방식으로 국가직 7급 수준의 변형문제(4지선다 또는 O/X)를 출제해 주세요.
3. 정답을 미리 보여주지 말고 반드시 1문제씩 출제한 뒤, 내가 답을 입력하면 긴 줄글 대신 직관적인 탑다운 구조도로 핵심 기준선을 정리해 채점하고 다음 문제로 넘어가는 대화형으로 진행해 주세요. 지금 1번 문제를 출제해 주세요.`;
}

export function buildCaseGuidedPrompt(userNote?: string): string {
  const noteBlock = userNote?.trim()
    ? `\n[내가 특히 궁금하거나 헷갈리는 점]\n${userNote.trim()}\n`
    : '';

  return `대학교 법학과 『헌법원리와제도』 수업의 '해외파병 결정과 사법심사·권한쟁의심판' 사례형 문제를 공부 중입니다.

[사례 원문]
${CASE_FULL_TEXT}
${CASE_PROMPT_QUESTION}

[수업 핵심 채점 기준 (이 범위 안에서만 지도할 것)]
1. 행위와 동의권 분리: 5. 20. 파병협정 체결·비준 동의(헌법 제60조 제1항 — 비준 예정 서명 단계라면 서명 전 미동의만으로 즉시 무효 단정 불가)와 8. 30. 실제 전투병력 파병 동의(헌법 제60조 제2항 — 별개의 사전동의 필수) 구별. 비준동의안 제출·표결 무산은 동의가 아니며 시간 부족·실력 저지로 사전동의 생략 불가.
2. 통치행위와 헌재 심사 범위: 파병의 외교·군사적 유불리는 사법자제하되, 이라크 파병 결정(2003헌마814)의 자제는 '국회 동의 등 헌법 절차를 지킨 것이 명백한 경우'가 전제였으므로 국회 동의를 결여한 절차 위반은 헌재 심사 가능.
3. 청구 주체별 적법성 분기: 권한 주체인 '국회(본회의 의결)'가 청구기간 내 권한쟁의심판을 청구하면 동의권 침해의 현저한 위험이 인정되어 본안 판단 가능 / 반면 야당 의원 '丙·丁 개인'이 청구하면 제3자 소송담당 불허 및 심의·표결권의 대내성 한계(2011헌라2)로 부적법 각하.
*(주의: 일반 국민이나 파병 장병의 헌법소원은 논외로 하고, 위 국가기관 간 권한 배분·통치행위·권한쟁의 적법요건에만 집중해 주세요.)*
${noteBlock}
[티칭 및 진행 규칙]
${TOP_DOWN_TEACHING_RULES}`;
}

export function buildCaseDraftFeedbackPrompt(
  draft: string,
  userNote?: string
): string {
  const noteBlock = userNote?.trim()
    ? `\n[추가로 궁금한 점]\n${userNote.trim()}\n`
    : '';

  return `대학교 법학과 『헌법원리와제도』 수업의 '해외파병 결정 사례형 문항'에 대해 내가 직접 작성한 답안 초안입니다. 수업 채점 기준에 맞춰 1:1 피드백해 주세요.

[사례 원문]
${CASE_FULL_TEXT}
${CASE_PROMPT_QUESTION}

[내가 작성한 답안 초안]
"""
${draft.trim()}
"""

[수업 핵심 채점 기준]
1. 헌법 제60조 제1항(조약 체결·비준 동의 — 비준 예정 서명 단계 구별)과 제60조 제2항(국군 해외파견 사전동의)의 분리 검토
2. 비준동의안 제출·표결 무산 ≠ 국회의 동의, 시간 부족·실력 저지에 의한 사전동의 생략 예외 불인정 및 파병 강행 확정 시 동의권 침해의 현저한 위험
3. 이라크 파병 결정(2003헌마814)과의 구별: 정책적 유불리는 사법자제하되, 2003헌마814는 헌법 절차 준수가 전제였으므로 국회 동의를 건너뛴 절차 위반은 헌재 심사 가능
4. 청구인 적격 분기: '국회(본회의 의결)' 청구 시 적법·본안 판단 가능 vs 개별 의원 '丙·丁' 청구 시 제3자 소송담당 불허 및 심의·표결권의 대내성(2011헌라2)으로 부적법 각하
*(주의: 일반 국민·장병의 헌법소원은 논외로 하고, 위 수업 기준에만 집중해 평가해 주세요.)*
${noteBlock}
[티칭 및 피드백 규칙]
${TOP_DOWN_TEACHING_RULES}`;
}

export function buildGeneralTopDownPrompt(customMemo?: string): string {
  const memoBlock = customMemo?.trim()
    ? `\n[내가 공부하려는 주제 · 궁금한 점]\n- ${customMemo.trim()}\n`
    : '';

  return `대학교 법학과 헌법 수업의 사례형 문제 또는 헌법재판소 결정례를 공부 중입니다.
내가 보내는 헌법 사례형 문제(또는 판례 지문·답안 초안)에 대해 아래 규칙에 맞춰 1:1 학습을 도와주세요.

[티칭 및 진행 규칙]
${TOP_DOWN_TEACHING_RULES}
*(보충 원칙: 다수의견과 소수 반대의견·청구인 주장을 엄격히 구분하고, 조문 번호와 판례 법리를 임의로 창작하지 마세요.)*
${memoBlock}
[학습할 헌법 문제 / 판례 지문 / 내 답안 초안]
"""
(여기에 기말고사 대비 헌법 사례 문제나 판례 원문을 붙여넣으세요. 만약 아직 문제가 비어 있다면, 위 [탑다운 티칭 방식]을 확인했다고 짧게 답한 뒤 공부할 문제나 판례를 보내달라고 안내해 주세요.)
"""`;
}

export function buildCoachPresetPrompt(
  presetId: CoachPresetId,
  state: StudyState
): string {
  const wrongEntries = Object.entries(state.answers)
    .filter(([, rec]) => !rec.isCorrect)
    .map(([idStr, rec]) => {
      const q = QUESTIONS_DATA.find((item) => item.id === Number(idStr));
      return q ? { q, rec } : null;
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  const memoSuffix = state.coachCustomMemo.trim()
    ? `\n\n[추가로 궁금한 점]\n- ${state.coachCustomMemo.trim()}`
    : '';

  if (presetId === 'general-topdown') {
    return buildGeneralTopDownPrompt(state.coachCustomMemo);
  }

  if (presetId === 'wrong-traps') {
    if (wrongEntries.length === 0) {
      return `대학교 법학과 『헌법원리와제도』 '사법부 기출·사례 문제풀이' 복습 중입니다.
아직 오답 기록이 없어, 사법부 파트의 **빈출 출제 함정 Top 4**를 한눈에 정리하고 점검받고 싶습니다.

[사법부 파트 빈출 함정 Top 4 기준]
1. 법률우위 및 위임한계 함정: 대법원규칙도 법률 저촉 불가(헌법 제108조), 법률 위임 시 구체성 요구만 완화될 뿐 포괄위임금지원칙은 준수(2013헌바370).
2. 법원조직법 주체·정족수·관할 함정: 법관인사위원회(대법원 설치·위원장 포함 11명·심의), 대법관회의(대법원장 부의·전원 2/3 이상 출석·출석 과반수 찬성), 명령·규칙 위헌·위법 인정 시 부(소부) 재판 불가(대법관 전원의 3분의 2 이상의 합의체 심판, 법원조직법 제7조①), 개정 법원조직법 부칙(2030년 총 26명 증원).
3. 헌재 결정례 청구인 주장·반대의견 위장 함정: 최소 형량 상향(99헌바43, 96헌바16), 판사 근무평정·연임 제외(2015헌바331), 파산관재인 선임(2001헌가1 — 소수 재판관 3인 반대의견 위장 주의) 모두 합헌.
4. 통치행위 절차 전제 및 권한쟁의 당사자적격 함정: 이라크 파병 결정(2003헌마814)의 사법자제는 국회 동의 등 절차 준수가 전제이므로 동의 없는 파병은 심사 가능. 단, 개별 의원은 제3자 소송담당 불허·심의표결권 대내성으로 부적법 각하(2011헌라2).

[티칭 및 진행 규칙]
${TOP_DOWN_TEACHING_RULES}${memoSuffix}`;
    }

    const wrongDetails = wrongEntries
      .map(({ q, rec }, idx) => {
        const xrayLines = q.xrayPoints
          .map(
            (x) =>
              `   · [${x.trapType}] "${x.wrongSpan}" → "${x.rightSpan}" (${x.basis})`
          )
          .join('\n');
        return `${idx + 1}) [${q.sourceTitle}] ${q.stem}
   - 내가 고른 오답: ${formatUserChoice(q, rec.selected)}
   - 실제 정답: ${formatCorrectChoice(q)}
   - 핵심 함정 포인트:
${xrayLines}`;
      })
      .join('\n\n');

    return `대학교 법학과 『헌법원리와제도』 '사법부' 문제풀이에서 내가 실제로 틀린 문항들입니다.
내가 왜 이 선지에 헷갈렸는지 알기 쉽게 교정받고 싶습니다.

[내가 틀린 문항 기록 (총 ${wrongEntries.length}문항)]
${wrongDetails}

[티칭 및 진행 규칙]
${TOP_DOWN_TEACHING_RULES}${memoSuffix}`;
  }

  if (presetId === 'variant-quiz') {
    const focusItems = wrongEntries.map(
      ({ q }) => `- [오답 쟁점] ${q.sourceTitle} (${q.trapTag} · ${q.referenceBasis})`
    );

    const focusBlock =
      focusItems.length > 0
        ? focusItems.join('\n')
        : `- 헌법 제108조 대법원규칙(법률우위 · 2013헌바370 위임 구체성 완화)
- 법원조직법 3기구(법관인사위원회 11명 · 대법관회의 2/3 출석 · 대법관 전원의 3분의 2 이상의 합의체 vs 3명 이상 부) 및 대법관 증원(현행 14명 → 2030년 26명)
- 헌법 제105~110조(임기 · 신분보장 · 심리 비공개와 판결 공개 · 군사법원 단심 제한)
- 사법권 독립 결정례(99헌바43 · 96헌바16, 2015헌바331, 2001헌가1 다수의견 vs 반대의견)
- 통치행위와 국회 동의권(헌법 제60조 제1·2항, 2003헌마814 절차 준수 전제, 2011헌라2 개별 의원 각하)`;

    return `대학교 법학과 『헌법원리와제도』 사법부 시험 대비를 위해 실전 변형문제를 풀어보고 싶습니다.

[집중 출제 범위]
${focusBlock}

[출제 및 해설 원칙]
1. [내부 정답 확정]: 헌법재판소 결정례의 사실관계를 임의로 왜곡하거나 가상의 판례를 창작하지 말고, 실제 조문과 다수의견 법리를 기준으로 먼저 정답 구조를 확정할 것.
2. 실제 국가직 7급 헌법 기출 방식 그대로, 조문의 주체 바꾸기(대법원장 vs 과반수, 대법원 vs 법무부), 정족수 바꾸기(2/3 vs 과반수), 원칙과 예외 역전(위헌 인정 vs 합헌 일치, 심리 vs 판결), 청구인 주장·소수 반대의견 위장 기법을 활용해 반드시 1문제씩 출제하고 내 답을 먼저 받을 것.
3. 내가 답을 말하면 아래 [탑다운(Top-down) 티칭 방식]에 따라 긴 줄글 대신 핵심 기준선 구조도로 채점·해설하고 다음 문제로 넘어갈 것. 지금 1번 문제를 출제해 주세요.

${TOP_DOWN_TEACHING_RULES}${memoSuffix}`;
  }

  // presetId === 'case-feedback'
  if (state.essayDraft.trim().length > 0) {
    return buildCaseDraftFeedbackPrompt(state.essayDraft, state.coachCustomMemo);
  }
  return buildCaseGuidedPrompt(state.coachCustomMemo);
}
