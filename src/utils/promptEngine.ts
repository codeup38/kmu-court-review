import { CASE_FULL_TEXT, CASE_PROMPT_QUESTION } from '../data/caseData';
import { QUESTIONS_DATA } from '../data/questionsData';
import { CORE_PRECEDENTS } from '../data/schemaData';
import { CoachPresetId, QuestionItem, StudyState } from '../types';

function formatUserChoice(q: QuestionItem, selected: number | 'O' | 'X'): string {
  if (q.type === 'ox') {
    return `${selected}`;
  }
  const idx = Number(selected) - 1;
  const text = q.choices?.[idx] ?? '';
  return `선지 ${selected}번 ("${text}")`;
}

function formatCorrectChoice(q: QuestionItem): string {
  if (q.type === 'ox') {
    return `${q.answer}`;
  }
  const idx = Number(q.answer) - 1;
  const text = q.choices?.[idx] ?? '';
  return `선지 ${q.answer}번 ("${text}")`;
}

export function buildQuestionExplainPrompt(
  q: QuestionItem,
  selected?: number | 'O' | 'X'
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
        selected === q.answer ? '정답이지만 함정 구조 재확인 희망' : '오답 선택'
      })`
    : `- 현재 상태: 이 문항의 함정 구조와 선지별 경계를 확실히 구분하고 싶음`;

  return `대학교 법학과 『헌법원리와제도』 수업의 '사법부' 파트를 복습 중입니다.
아래 문제에서 내가 헷갈린 지점을 정확히 짚어 비교 설명해 주세요.

[문제 정보: ${q.sourceTitle}]
질문: ${q.stem}
${choicesBlock}

[채점 및 핵심 법리 기준]
${userPickLine}
- 실제 정답: ${formatCorrectChoice(q)}
- 핵심 근거: ${q.referenceBasis}
- 출제 함정 X-Ray:
${xraySummary}
- 기본 해설: ${q.explanation}

[요청사항]
1. 내가 고른 선지(또는 가장 헷갈리기 쉬운 함정 구절)가 왜 그럴듯해 보이는지 출제자의 함정 설계 의도를 먼저 짚어 주세요.
2. 헌법·법원조직법 조문 원문과 헌법재판소 결정례(다수의견 기준)의 정확한 경계선을 짧은 대비표로 정리해 주세요. (판례 사실관계나 조문 숫자는 절대 임의로 변형하지 마세요.)
3. 마지막에 내가 이 경계를 완전히 이해했는지 바로 점검할 수 있는 짧은 확인 O/X 퀴즈 1문제를 내고 내 답변을 기다려 주세요.`;
}

export function buildQuestionVariantPrompt(q: QuestionItem): string {
  const xraySummary = q.xrayPoints
    .map((x) => `- ${x.trapType}: "${x.wrongSpan}" vs "${x.rightSpan}" (${x.basis})`)
    .join('\n');

  return `대학교 법학과 『헌법원리와제도』 수업 복습을 위해 아래 기출·연습 문항과 동일한 법리 경계를 묻는 실전 변형문제를 풀어보고 싶습니다.

[기준 문항: ${q.sourceTitle}]
- 질문: ${q.stem}
- 핵심 근거 조문·판례: ${q.referenceBasis}
- 핵심 함정 포인트:
${xraySummary}

[출제 및 진행 규칙 — 반드시 준수]
1. 기초 법학 학습에 혼란이 생기지 않도록 헌법재판소 결정례의 사실관계나 결론을 임의로 지어내거나 왜곡하지 마세요.
2. 반드시 실제 헌법(제60조, 제101조~제110조)·법원조직법 조문 및 위 판례의 '주체 바꾸기, 정족수 바꾸기, 원칙·예외 역전, 청구인 주장·소수 반대의견 위장' 방식을 활용해 국가직 7급 수준의 깔끔한 변형문제(4지선다 또는 고난도 O/X)를 출제해 주세요.
3. 한꺼번에 여러 문제를 정답까지 다 보여주지 말고, 1문제씩 출제한 뒤 내가 답을 입력하면 정답 여부와 함정 포인트를 해설하고 다음 문제로 넘어가는 대화형 모드로 진행해 주세요. 지금 첫 번째 문제를 출제해 주세요.`;
}

export const FALLBACK_TUTOR_TOPICS = [
  {
    id: 'rule108',
    label: '대법원규칙과 위임(제108조)',
    detail: '헌법 제108조 직접 제정 vs 법률 위임(비열거 사항 포함) · 법률우위 · 2013헌바370 구체성 완화',
  },
  {
    id: 'courtorg',
    label: '법원조직법 3기구·정족수',
    detail: '법관인사위원회(대법원·11명·심의) vs 대법관회의(대법원장 부의·2/3 출석·과반수 찬성) vs 대법원 심판합의체(전원 2/3 이상 합의체 원칙·3명 소부 예외) 및 대법관 증원 부칙(14→26명)',
  },
  {
    id: 'indep4',
    label: '사법권 독립 합헌 4판례',
    detail: '99헌바43·96헌바16(최소 형량과 집행유예 제한 합헌), 2015헌바331(근무평정 위임·연임 제외 합헌), 2001헌가1(파산관재인 예금보험공사 지정 합헌 vs 반대의견 함정)',
  },
  {
    id: 'dispatch60',
    label: '통치행위와 권한쟁의(제60조)',
    detail: '헌법 제60조 제1항(조약 비준동의) vs 제2항(국군 파견 사전동의), 2003헌마814 절차 준수 전제, 국회 본회의 청구 적법 vs 개별 의원 청구 각하(2011헌라2)',
  },
];

export function buildCoachPresetPrompt(
  presetId: CoachPresetId,
  state: StudyState,
  selectedFallbackTopics: string[] = []
): string {
  const wrongEntries = Object.entries(state.answers)
    .filter(([, rec]) => !rec.isCorrect)
    .map(([idStr, rec]) => {
      const q = QUESTIONS_DATA.find((item) => item.id === Number(idStr));
      return q ? { q, rec } : null;
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  const bookmarkedQuestions = QUESTIONS_DATA.filter((q) =>
    state.bookmarkedQuestions.includes(q.id)
  );
  const bookmarkedPrecedents = CORE_PRECEDENTS.filter((c) =>
    state.bookmarkedCases.includes(c.id)
  );

  const memoSuffix = state.coachCustomMemo.trim()
    ? `\n\n[추가로 궁금한 점]\n- ${state.coachCustomMemo.trim()}`
    : '';

  if (presetId === 'wrong-traps') {
    if (wrongEntries.length === 0) {
      return `대학교 법학과 『헌법원리와제도』 '사법부 기출·사례 문제풀이' 복습 중입니다.
현재 아직 오답으로 기록된 문항이 없어, 오늘 수업의 **빈출 출제 함정 Top 4**를 한 번에 정리하고 점검받고 싶습니다.

[사법부 파트 빈출 함정 Top 4 기준]
1. 법률우위 및 위임한계 함정: 대법원규칙도 법률 저촉 불가(헌법 제108조), 법률 위임 시 구체성 요구만 완화될 뿐 포괄위임금지원칙은 준수(2013헌바370).
2. 법원조직법 주체·정족수·관할 함정: 법관인사위원회(대법원 설치·위원장 포함 11명·심의), 대법관회의(대법원장 부의·전원 2/3 이상 출석·출석 과반수 찬성), 명령·규칙 위헌·위법 인정 시 소부 재판 불가(대법관 전원 2/3 이상 합의체 심판, 법원조직법 제7조①).
3. 헌재 결정례 청구인 주장·반대의견 위장 함정: 최소 형량 상향(99헌바43, 96헌바16), 판사 근무평정·연임 제외(2015헌바331), 파산관재인 선임(2001헌가1 — 소수 재판관 3인 반대의견 위장 주의) 모두 합헌.
4. 통치행위 절차 전제 및 권한쟁의 당사자적격 함정: 이라크 파병 결정(2003헌마814)의 사법자제는 국회 동의 등 절차 준수가 전제이므로 동의 없는 파병은 심사 가능. 단, 개별 의원은 제3자 소송담당 불허·심의표결권 대내성으로 부적법 각하(2011헌라2).

[요청사항]
1. 위 4가지 함정이 실제 시험 선지에서 어떤 문장으로 둔갑하는지 '틀린 함정 문구 vs 올바른 조문·판례 문구' 비교표로 깔끔하게 압축해 주세요.
2. 이어서 내가 가장 속기 쉬운 고난도 확인 O/X 퀴즈 1문제를 내고, 내가 답을 말할 때까지 정답을 숨긴 채 기다려 주세요.${memoSuffix}`;
    }

    const wrongDetails = wrongEntries
      .map(({ q, rec }, idx) => {
        const xrayLines = q.xrayPoints
          .map((x) => `   · [${x.trapType}] "${x.wrongSpan}" → "${x.rightSpan}" (${x.basis})`)
          .join('\n');
        return `${idx + 1}) [${q.sourceTitle}] ${q.stem}
   - 내가 잘못 고른 답: ${formatUserChoice(q, rec.selected)}
   - 실제 정답: ${formatCorrectChoice(q)}
   - 핵심 함정 포인트:
${xrayLines}`;
      })
      .join('\n\n');

    return `대학교 법학과 『헌법원리와제도』 '사법부' 문제풀이 훈련에서 내가 실제로 틀린 문항들입니다.
내가 왜 이 선지에 속았는지 함정 패턴을 집중 해부해 주세요.

[내가 틀린 문항 기록 (총 ${wrongEntries.length}문항)]
${wrongDetails}

[요청사항]
1. 내가 틀린 문항들을 관통하는 공통적인 혼동 원인(주체·정족수 혼동, 원칙·예외 역전, 반대의견·청구인 주장 착각 등)을 먼저 진단해 주세요.
2. 문항별로 '내가 고른 선지가 틀린 정확한 이유'와 '기억해야 할 헌법·법원조직법·판례 기준선'을 한눈에 비교해 쉽게 설명해 주세요. (조문 번호와 판례 결론은 절대 변형하지 마세요.)
3. 설명 끝에 내가 방금 틀린 함정을 변형한 확인 퀴즈 1개만 먼저 출제하고 내 답변을 기다려 주세요.${memoSuffix}`;
  }

  if (presetId === 'tutor-table') {
    const hasBookmarks =
      bookmarkedPrecedents.length > 0 || bookmarkedQuestions.length > 0;

    let targetSection = '';
    if (hasBookmarks) {
      const caseLines = bookmarkedPrecedents.map(
        (c) => `- [판례 ${c.caseNumber} (${c.verdict})] ${c.title}: ${c.summary}`
      );
      const qLines = bookmarkedQuestions.map(
        (q) => `- [${q.sourceTitle}] ${q.stem} (핵심 근거: ${q.referenceBasis})`
      );
      targetSection = [...caseLines, ...qLines].join('\n');
    } else {
      const chosen = FALLBACK_TUTOR_TOPICS.filter((t) =>
        selectedFallbackTopics.includes(t.id)
      );
      const effective = chosen.length > 0 ? chosen : FALLBACK_TUTOR_TOPICS;
      targetSection = effective
        .map((t) => `- [${t.label}] ${t.detail}`)
        .join('\n');
    }

    return `대학교 법학과 『헌법원리와제도』 '사법부' 파트를 1:1 과외처럼 복습하고 싶습니다.

[내가 집중 점검할 헷갈리는 판례·조문 목록]
${targetSection}

[튜터링 진행 방식 — 반드시 지켜 주세요]
1. 처음부터 아무 설명 없이 스무고개 질문만 던지지 말고, 먼저 위 쟁점들의 핵심 구별 기준(주체·정족수·원칙과 예외·합헌 이유)을 **한눈에 보는 깔끔한 비교 기준표**로 정리해 주세요.
2. 조문 번호(헌법 제60조, 제101~110조, 법원조직법 제7조·제16조·제17조·제25조의2 및 법률 제21451호 부칙)와 헌재 결정례 법리를 정확히 유지해 주세요.
3. 기준표를 제시한 뒤에는 내가 수동적으로 읽기만 하지 않도록, 핵심 경계를 묻는 짧은 질문을 **한 번에 하나씩** 던지며 차근차근 문답을 이어가 주세요.${memoSuffix}`;
  }

  if (presetId === 'variant-quiz') {
    const focusItems: string[] = [];
    wrongEntries.forEach(({ q }) => {
      focusItems.push(`- [오답 약점] ${q.sourceTitle} (${q.trapTag} · ${q.referenceBasis})`);
    });
    bookmarkedPrecedents.forEach((c) => {
      focusItems.push(`- [북마크 판례] ${c.caseNumber} ${c.title}`);
    });
    bookmarkedQuestions.forEach((q) => {
      if (!wrongEntries.some((w) => w.q.id === q.id)) {
        focusItems.push(`- [북마크 문항] ${q.sourceTitle} (${q.trapTag} · ${q.referenceBasis})`);
      }
    });

    const focusBlock =
      focusItems.length > 0
        ? focusItems.join('\n')
        : `- 헌법 제108조 대법원규칙(법률우위·2013헌바370 위임 구체성 완화)
- 법원조직법 3기구(법관인사위원회 11명·대법관회의 2/3 출석·전원 2/3 이상 합의체 vs 3명 소부) 및 대법관 단계적 증원(14→26명)
- 헌법 제105~110조(임기·신분보장·심리 비공개와 판결 공개·군사법원 단심 제한)
- 사법권 독립 결정례(99헌바43·96헌바16, 2015헌바331, 2001헌가1 다수의견 vs 반대의견)
- 통치행위와 국회 동의권(헌법 제60조 제1·2항, 2003헌마814 절차 준수 전제, 2011헌라2 개별 의원 각하)`;

    return `대학교 법학과 『헌법원리와제도』 시험 대비를 위해 내 약점 쟁점을 바탕으로 실전 변형문제를 풀고 싶습니다.

[집중 출제 범위]
${focusBlock}

[출제 원칙 — 엄격 준수]
1. 기초 법학 학습에 혼란을 주지 않도록 **헌법재판소 결정례의 사실관계를 임의로 왜곡하거나 가상의 판례를 창작하지 마세요.**
2. 실제 국가직 7급 헌법 기출 방식 그대로, 조문의 **주체 바꾸기(대법원장 vs 과반수, 대법원 vs 법무부), 정족수 바꾸기(2/3 vs 과반수), 원칙과 예외 역전(위헌 인정 vs 합헌 일치, 심리 vs 판결), 청구인 주장·소수 반대의견 위장** 기법을 활용해 출제해 주세요.
3. **반드시 1문제씩 출제**하고 정답과 해설은 숨긴 채 내 답을 먼저 받아 주세요. 내가 답을 말하면 채점 + 함정 X-Ray 해설을 해준 뒤 다음 문제(4지선다와 O/X 혼합)로 넘어가 주세요. 지금 1번 문제를 내주세요.${memoSuffix}`;
  }

  // presetId === 'case-feedback'
  const hasDraft = state.essayDraft.trim().length > 0;

  if (!hasDraft) {
    return `대학교 법학과 『헌법원리와제도』 수업의 '해외파병 결정과 사법심사·권한쟁의심판' 사례형 문제를 백지 상태에서 단계별 문답으로 연습하고 싶습니다.

[사례 원문]
${CASE_FULL_TEXT}
${CASE_PROMPT_QUESTION}

[수업 핵심 채점 기준 (이 범위 안에서만 지도할 것)]
1. 행위와 동의권 분리: 5. 20. 파병협정 체결·비준 동의(헌법 제60조 제1항 — 비준 예정 서명 단계라면 서명 전 미동의만으로 즉시 무효 단정 불가)과 8. 30. 실제 전투병력 파병 동의(헌법 제60조 제2항 — 별개의 사전동의 필수) 구별. 비준동의안 제출·표결 무산은 동의가 아니며 시간 부족·실력 저지로 사전동의 생략 불가.
2. 통치행위와 헌재 심사 범위: 파병의 외교·군사적 유불리는 사법자제하되, 이라크 파병 결정(2003헌마814)의 자제는 '국회 동의 등 헌법 절차를 지킨 것이 명백한 경우'가 전제였으므로 국회 동의를 결여한 절차 위반은 헌재 심사 가능.
3. 청구 주체별 적법성 분기: 권한 주체인 '국회(본회의 의결)'가 청구기간 내 권한쟁의심판을 청구하면 동의권 침해의 현저한 위험이 인정되어 본안 판단 가능 / 반면 야당 의원 '丙·丁 개인'이 청구하면 제3자 소송담당 불허 및 심의·표결권의 대내성 한계(2011헌라2)로 부적법 각하.
*(주의: 일반 국민이나 파병 장병의 기본권 침해 헌법소원은 논외로 하고, 위 국가기관 간 권한 배분·통치행위·권한쟁의 적법요건에만 집중해 주세요.)*

[진행 요청]
모범답안을 한 번에 다 알려주지 말고, 내가 스스로 4단 목차(Ⅰ. 권한 나누기 → Ⅱ. 절차 위반 → Ⅲ. 헌재 심사 범위 → Ⅳ. 청구 자격과 결론)를 완성할 수 있도록 1단계 질문부터 하나씩 던져 이끌어 주세요.${memoSuffix}`;
  }

  return `대학교 법학과 『헌법원리와제도』 수업의 '해외파병 결정 사례형 문항'에 대해 내가 직접 작성한 답안 초안입니다. 수업 채점 기준에 맞춰 1:1 첨삭해 주세요.

[사례 원문]
${CASE_FULL_TEXT}
${CASE_PROMPT_QUESTION}

[내가 작성한 답안 초안]
"""
${state.essayDraft.trim()}
"""

[수업 핵심 채점 기준]
1. 헌법 제60조 제1항(조약 체결·비준 동의 — 비준 예정 서명 단계 구별)과 제60조 제2항(국군 해외파견 사전동의)의 분리 검토
2. 비준동의안 제출·표결 무산 ≠ 국회의 동의, 시간 부족·실력 저지에 의한 사전동의 생략 예외 불인정 및 파병 강행 확정 시 동의권 침해의 현저한 위험
3. 이라크 파병 결정(2003헌마814)과의 구별: 정책적 유불리는 사법자제하되, 2003헌마814는 헌법 절차 준수가 전제였으므로 국회 동의를 건너뛴 절차 위반은 헌재 심사 가능
4. 청구인 적격 분기: '국회(본회의 의결)' 청구 시 적법·본안 판단 가능 vs 개별 의원 '丙·丁' 청구 시 제3자 소송담당 불허 및 심의·표결권의 대내성(2011헌라2)으로 부적법 각하
*(주의: 일반 국민·장병의 헌법소원은 논외로 하고, 위 수업 기준에만 집중해 평가해 주세요.)*

[피드백 출력 순서 — 반드시 이 3단계 순서로 답변해 주세요]
1. **맞힌 점**: 내 초안에서 정확하게 짚어낸 핵심 법리와 논리적 강점 칭찬
2. **빠진 법리 경계 설명**: 위 4가지 채점 기준 중 내 초안에서 누락되었거나 표현이 부정확해 감점될 수 있는 경계선을 명쾌하게 보완 설명
3. **스스로 한 문장 보완해 볼 역질문**: 완성된 답안을 대신 다 써주지 말고, 내가 빠뜨린 핵심 논점을 직접 한두 문장으로 써볼 수 있도록 유도하는 구체적인 역질문 1개 제시${memoSuffix}`;
}
