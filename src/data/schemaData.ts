import {
  BoundaryItem,
  CorePrecedent,
  QuotaMilestone,
  RouterSituation,
} from '../types';

export const OVERARCHING_QUESTION =
  '오늘 다룬 네 문제는 모두 “사법부(법원과 헌법재판소)는 어디까지 판단할 수 있고, 어디서 멈춰야 하는가?”를 묻는다.';

export const BOUNDARY_ITEMS: BoundaryItem[] = [
  {
    id: 'b1',
    code: '경계 01',
    title: '대법원규칙의 한계',
    summary: '법원 스스로 만드는 규칙이라도 국회가 만든 법률을 넘을 수 없음',
    detail:
      '헌법 제108조가 사법의 자주성을 위해 규칙제정권을 부여했더라도, 규범 서열상 대법원규칙은 법률 아래에 위치하므로 법률에 저촉되는 규칙은 제정할 수 없다.',
    highlightedNodes: ['legislative', 'courts'],
    links: [
      { label: '기출 1번 바로가기', targetView: 'trainer', questionId: 1 },
      { label: '핵심 O/X 06 확인', targetView: 'trainer', questionId: 12 },
    ],
  },
  {
    id: 'b2',
    code: '경계 02',
    title: '입법과 재판의 경계',
    summary: '최소 형량 기준이나 판사 인사 틀을 법률로 정해도 재판 개입이 아님',
    detail:
      '법관은 헌법과 법률에 의하여 심판하므로(제103조), 국회가 중범죄의 법정형 하한을 높이거나 법원조직법으로 인사·관재인 기준을 정한 것은 재판 본질 침해가 아니다.',
    highlightedNodes: ['legislative', 'courts', 'constCourt'],
    links: [
      { label: '기출 2번 바로가기', targetView: 'trainer', questionId: 2 },
      { label: '기출 3번 바로가기', targetView: 'trainer', questionId: 3 },
    ],
  },
  {
    id: 'b3',
    code: '경계 03',
    title: '통치행위와 절차 통제',
    summary: '외교·군사 선택의 유불리는 따지지 않아도 국회 동의를 건너뛴 절차 위반은 심사함',
    detail:
      '고도의 정치적 결단이라도 사법자제는 헌법과 법률이 정한 절차를 지킨 것이 전제이므로(2003헌마814), 국회의 사전동의를 결여한 파병결정은 헌법재판소가 심사할 수 있다.',
    highlightedNodes: ['legislative', 'executive', 'constCourt'],
    links: [
      { label: '사례형 시뮬레이터 연결', targetView: 'case' },
      { label: '변형 3번 바로가기', targetView: 'trainer', questionId: 6 },
    ],
  },
];

export const ROUTER_SITUATIONS: RouterSituation[] = [
  {
    id: 's1',
    num: '상황 01',
    question: '재판에 적용할 ‘법률’이 위헌인지 문제 될 때',
    shortTag: '법률 위헌 심사',
    organTitle: '헌법재판소',
    organSubtitle: '법원이 위헌법률심판 제청 → 헌재 결정에 따라 재판',
    organCategory: 'const-court',
    quorumOrRule: '법원은 직접 법률 위헌 선언 불가 · 헌법재판소에 제청 필수',
    legalBasis: '헌법 제107조 제1항',
    keyWarning:
      '재판의 전제가 된 ‘법률’의 위헌 여부는 대법원이 최종 심사하지 않고 반드시 헌법재판소에 제청해야 한다.',
    flowSteps: [
      { stepLabel: '전제 발생', actor: '각급 법원 · 대법원', detail: '재판에 적용할 법률의 위헌 여부 문제', accent: 'slate' },
      { stepLabel: '위헌 제청', actor: '법원 → 헌법재판소', detail: '직권 또는 당사자 신청에 의한 위헌법률심판 제청', accent: 'navy' },
      { stepLabel: '최종 심판', actor: '헌법재판소', detail: '위헌 여부 결정 후 법원은 그 결정에 따라 재판', accent: 'navy' },
    ],
    relatedQuestionIds: [5],
  },
  {
    id: 's2',
    num: '상황 02',
    question: '‘명령·규칙’이 헌법이나 법률에 위반된다고 인정할 때',
    shortTag: '명령·규칙 위헌·위법 인정',
    organTitle: '대법원 (반드시 대법관 전원의 2/3 이상 합의체)',
    organSubtitle: '의견이 일치해도 3명 이상 부(소부)에서 재판 불가!',
    organCategory: 'sc-grand',
    quorumOrRule: '대법관 전원의 3분의 2 이상의 합의체에서 심판 (소부 재판 절대 불가)',
    legalBasis: '헌법 제107조 제2항, 법원조직법 제7조 제1항 단서 제1·2호',
    keyWarning:
      '3명 이상 부에서 먼저 심리하여 위헌·위법이라고 의견이 일치하더라도 그 부(소부)에서 재판할 수 없다.',
    examCaution:
      '대법원 홈페이지 등 실무에서는 흔히 ‘전원합의체’라 부르지만, 법원조직법 제7조 제1항 조문 원문 표현은 정확히 ‘대법관 전원의 3분의 2 이상의 합의체’임',
    flowSteps: [
      { stepLabel: '사건 심리', actor: '대법원 부 (3명 이상)', detail: '명령·규칙의 헌법 또는 법률 위반 여부 심리', accent: 'slate' },
      { stepLabel: '소부 제한', actor: '위헌·위법 인정', detail: '의견이 일치해도 부(소부) 재판 제외 사유 해당', accent: 'crimson' },
      { stepLabel: '최종 재판', actor: '전원 2/3 이상 합의체', detail: '대법관 전원의 3분의 2 이상의 합의체에서 심판', accent: 'navy' },
    ],
    relatedQuestionIds: [2, 4, 5],
  },
  {
    id: 's3',
    num: '상황 03',
    question: '‘명령·규칙’이 합헌·적법하다고 의견이 일치할 때',
    shortTag: '명령·규칙 합헌·적법 일치',
    organTitle: '대법원 3명 이상으로 구성된 부(소부)',
    organSubtitle: '판례 변경 등 다른 제외 사유가 없는 한 부(소부)에서 재판 가능',
    organCategory: 'sc-petty',
    quorumOrRule: '대법관 3명 이상으로 구성된 부에서 선심리 후 의견 일치 시 재판 가능',
    legalBasis: '법원조직법 제7조 제1항 단서',
    keyWarning:
      '당사자가 위헌 주장을 했더라도 재판부가 합헌·적법으로 보아 주장을 배척하는 데 의견이 일치하면 소부에서 끝낼 수 있다(단, 원칙 합의체 기준을 과반수로 바꾸는 함정 주의!).',
    flowSteps: [
      { stepLabel: '사건 심리', actor: '대법원 부 (3명 이상)', detail: '당사자의 명령·규칙 위헌·위법 주장 검토', accent: 'slate' },
      { stepLabel: '요건 충족', actor: '합헌·적법 의견 일치', detail: '위헌·위법 인정이 아니며 판례 변경 등 제외사유 없음', accent: 'navy' },
      { stepLabel: '최종 재판', actor: '대법원 3명 이상 부(소부)', detail: '합의체에 회부하지 않고 그 부에서 직접 재판 가능', accent: 'navy' },
    ],
    relatedQuestionIds: [9],
  },
  {
    id: 's4',
    num: '상황 04',
    question: '구체적인 ‘행정처분’이 위헌·위법인지 심사할 때',
    shortTag: '개별 행정처분 위법 심사',
    organTitle: '대법원이 최종 심사권 보유 (3명 이상 부 재판 가능)',
    organSubtitle: '명령·규칙과 달리 개별 ‘처분’의 위법 인정은 3명 이상 부(소부)에서도 의견 일치 시 재판 가능!',
    organCategory: 'sc-petty',
    quorumOrRule: '최종 심사권은 대법원(제107조②) · 개별 처분 위법 인정은 소부 의견 일치 시 재판 가능',
    legalBasis: '헌법 제107조 제2항, 법원조직법 제7조 제1항 단서 제1·2호 반대해석',
    keyWarning:
      '헌법 제107조 제2항은 ‘명령·규칙 또는 처분’을 함께 묶어 대법원 최종 심사 대상으로 두지만, 법원조직법 제7조 제1항 단서 제1·2호의 소부 재판 제외 대상은 ‘명령 또는 규칙’의 위헌·위법 인정뿐이다.',
    flowSteps: [
      { stepLabel: '최종 심사권', actor: '대법원 (제107조②)', detail: '명령·규칙·처분 모두 대법원이 최종 심사권 보유', accent: 'slate' },
      { stepLabel: '대상 구별', actor: '일반 규범 vs 개별 처분', detail: '소부 제외 사유(제7조① 제1·2호)는 명령·규칙만 해당', accent: 'navy' },
      { stepLabel: '최종 재판', actor: '3명 이상 부(소부) 가능', detail: '개별 처분의 위법 인정은 의견 일치 시 부에서 재판 가능', accent: 'navy' },
    ],
    relatedQuestionIds: [2, 5],
  },
  {
    id: 's5',
    num: '상황 05',
    question: '대법원규칙 제·개정 및 중요 사법행정 운영을 의결할 때',
    shortTag: '사법행정 의결 (재판 X)',
    organTitle: '대법관회의',
    organSubtitle: '재판부가 아닌 사법행정 의결기구 · 안건 부의권자: 대법원장 (과반수 부의 X)',
    organCategory: 'sc-council',
    quorumOrRule: '대법관 전원 2/3 이상 출석 + 출석인원 과반수 찬성',
    proposerOrNote: '안건 부의권자: 대법원장 (대법관 전원 과반수 부의 X)',
    legalBasis: '법원조직법 제16조 제2항, 제17조 제2·6호',
    keyWarning:
      '출석 정족수는 ‘과반수 출석’이 아니라 ‘전원 2/3 이상 출석’이며, 중요 안건을 회의에 부치는 주체도 ‘대법원장’이다.',
    flowSteps: [
      { stepLabel: '안건 부의', actor: '대법원장', detail: '규칙 제·개정, 판사 임명·연임 동의, 중요 사법행정 부의', accent: 'navy' },
      { stepLabel: '출석 요건', actor: '전원 2/3 이상 출석', detail: '과반수 출석 함정 주의 (현행 14명 기준 최소 10명 출석)', accent: 'crimson' },
      { stepLabel: '의결 성립', actor: '대법관회의 의결', detail: '출석인원 과반수 찬성으로 의결 (대법원장 의장·표결권 보유)', accent: 'navy' },
    ],
    relatedQuestionIds: [1, 2, 10],
  },
  {
    id: 's6',
    num: '상황 06',
    question: '판사의 임명·연임 등 인사 중요 사항을 심의할 때',
    shortTag: '법관 인사 심의 (의결 X)',
    organTitle: '법관인사위원회',
    organSubtitle: '대법원에 설치 (법무부 X) · 의결이 아닌 심의기구',
    organCategory: 'sc-personnel',
    quorumOrRule: '구성: 위원장 1명을 포함한 11명의 위원',
    legalBasis: '법원조직법 제25조의2 제1항·제3항',
    keyWarning:
      '설치 기관을 ‘법무부’로 바꾸거나(대법원에 설치), 위원 수를 ‘위원장 제외 11명’으로 비트는 함정 및 ‘의결기구’로 바꾸는 함정을 주의해야 한다.',
    flowSteps: [
      { stepLabel: '설치 기관', actor: '대법원 소속 (법무부 X)', detail: '사법부 인사 독립 보장을 위해 대법원에 설치', accent: 'navy' },
      { stepLabel: '위원회 구성', actor: '위원장 1명 포함 11명', detail: '법관·법조인·학식과 덕망 있는 외부 위원 등 총 11명', accent: 'slate' },
      { stepLabel: '기능 성격', actor: '중요 인사 사항 심의', detail: '임명·연임 등 인사에 관한 중요 사항 심의 (의결기구 아님)', accent: 'navy' },
    ],
    relatedQuestionIds: [2, 11],
  },
];

export const QUOTA_MILESTONES: QuotaMilestone[] = [
  {
    id: 'y2026',
    periodLabel: '2026 현행',
    badge: '현행 기준',
    totalJustices: 14,
    addedNote: '대법원장 포함 14명',
    twoThirdsMin: 10,
    formulaNote: '14 × 2/3 = 9.33… → 최소 10명',
    councilPassAtMinQuorum: 6,
  },
  {
    id: 'y2028',
    periodLabel: '2028. 3.~',
    badge: '+4명 증원',
    totalJustices: 18,
    addedNote: '대법원장 포함 18명 (+4명 증원)',
    twoThirdsMin: 12,
    formulaNote: '18 × 2/3 = 12.0 → 최소 12명',
    councilPassAtMinQuorum: 7,
  },
  {
    id: 'y2029',
    periodLabel: '2029. 3.~',
    badge: '+4명 증원',
    totalJustices: 22,
    addedNote: '대법원장 포함 22명 (+4명 증원)',
    twoThirdsMin: 15,
    formulaNote: '22 × 2/3 = 14.66… → 최소 15명',
    councilPassAtMinQuorum: 8,
  },
  {
    id: 'y2030',
    periodLabel: '2030. 3.~',
    badge: '+4명 최종 증원',
    totalJustices: 26,
    addedNote: '대법원장 포함 26명 (+4명 최종 증원)',
    twoThirdsMin: 18,
    formulaNote: '26 × 2/3 = 17.33… → 최소 18명',
    councilPassAtMinQuorum: 10,
  },
];

export const QUICK_REF_STRIP = [
  {
    title: '임기·연임',
    provision: '헌법 제105조',
    body: '대법원장(6년, 중임 불가) · 대법관(6년, 연임 가능) · 일반법관(10년, 연임 가능)',
  },
  {
    title: '신분보장',
    provision: '헌법 제106조①',
    body: '탄핵 또는 금고 이상의 형 선고 없이는 파면 불가 (징계처분 없이는 정직·감봉 등 불가)',
  },
  {
    title: '재판 공개',
    provision: '헌법 제109조',
    body: '심리(과정)는 안보 등 이유로 결정 비공개 가능 / 판결(선고)은 무조건 공개',
  },
  {
    title: '군사법원',
    provision: '헌법 제110조',
    body: '상고심은 항상 대법원 관할 / 비상계엄 아래라도 사형 선고 시 단심 불가',
  },
];

export const CORE_PRECEDENTS: CorePrecedent[] = [
  {
    id: '2013hunba370',
    caseNumber: '2013헌바370',
    verdict: '합헌',
    title: '대법원규칙 위임 기준 완화와 범위',
    summary:
      '제108조에 적힌 일(소송절차·내부규율·사무처리)은 법률이 따로 시키지 않아도 법률에 어긋나지 않는 선에서 규칙 제정 가능. 적혀 있지 않은 일도 국회가 법률로 맡기면 가능하며, 소송비용 같은 기술적 실무는 법원이 제일 잘 알기 때문에 포괄위임금지원칙은 지키되 구체성 요구는 완화됨.',
    bridgeTitle: '앞 주차 수업 연결 브릿지',
    bridgeText:
      '중간고사 KBS 수신료 감면 단서에서 수익적·기술적 사항 위임 기준이 완화되던 논리와 연결',
    trapWarning:
      '구체성 요구만 완화될 뿐 포괄위임금지원칙 자체를 지킬 필요가 없다고 서술하면 오답!',
    relatedQuestionIds: [1, 5, 12],
  },
  {
    id: '99hunba43',
    caseNumber: '99헌바43 · 96헌바16',
    verdict: '합헌',
    title: '최소 형량 상향과 판사의 양형재량',
    summary:
      '강도상해죄(최소 징역 7년 → 작량감경 절반 시 3년 6개월 > 집행유예 기준 3년)나 특가법 제12조(최소 징역 10년)처럼 법정형 하한을 높여 집행유예를 줄 수 없게 해도 합헌. 판사도 국회가 정한 법 안에서 형을 매기는 것이기 때문.',
    bridgeTitle: '앞 주차 수업 연결 브릿지',
    bridgeText:
      '2주차 보호감호 사건은 판사에게 재범 위험성 판단 여지를 아예 주지 않고 무조건 선고하게 해 위헌이었으나, 최소 형량 기준선 설정은 입법재량이라 합헌',
    visualScale: {
      step1: '최소 징역 7년',
      step2: '작량감경(÷2) 3년 6개월',
      step3: '집행유예 기준 3년 초과',
      verdictLabel: '양형재량 침해 아님 (합헌)',
    },
    relatedQuestionIds: [2, 3, 13],
  },
  {
    id: '2015hunba331',
    caseNumber: '2015헌바331',
    verdict: '합헌',
    title: '판사 근무평정 규칙 위임과 연임 탈락',
    summary:
      '근무평정을 대법원규칙에 맡긴 것은 평가 항목을 예상할 수 있어 합헌이고, ‘근무성적이 현저히 불량한 경우’ 연임 제외 조항도 뜻이 통하며 10년 치 누적 평가와 불복 소송 기회가 열려 있어 합헌.',
    bridgeTitle: '기출 함정 패턴',
    bridgeText: '연임 탈락한 청구인의 주장을 헌재 결론처럼 서술',
    relatedQuestionIds: [3, 5],
  },
  {
    id: '2001hunga1',
    caseNumber: '2001헌가1',
    verdict: '합헌',
    title: '부실 금융회사 파산관재인 지정',
    summary:
      '망한 금융회사를 정리할 청산 관리인(파산관재인)으로 예금보험공사를 뽑게 한 법은 합헌. 관리인 뽑는 일은 ‘누가 옳고 그른지 가리는 재판의 핵심 본질’이 아니기 때문.',
    bridgeTitle: '기출 함정 패턴',
    bridgeText:
      '결정문 맨 뒤에 실린 재판관 3인의 소수 반대의견 문구를 다수의견처럼 그대로 베껴 출제',
    relatedQuestionIds: [3, 5],
  },
];
