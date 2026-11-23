import {
  BoundaryItem,
  CorePrecedent,
  QuotaMilestone,
  RouterSituation,
} from '../types';

export const OVERARCHING_QUESTION =
  '오늘 풀 문제들은 모두 “사법부(법원과 헌법재판소)는 어디까지 판단할 수 있고, 어디서 멈춰야 하는가?”를 묻는다.';

export const BOUNDARY_ITEMS: BoundaryItem[] = [
  {
    id: 'b1',
    code: '경계 01 · 대법원규칙',
    title: '대법원은 어디까지 규칙을 만들 수 있나?',
    summary: '법원 스스로 만드는 규칙이라도 국회가 만든 법률을 넘을 수는 없다',
    detail:
      '헌법 제108조가 사법의 자주성을 위해 규칙제정권을 인정했더라도, 대법원규칙은 법률보다 아래 단계이므로 법률에 어긋나는 규칙은 만들 수 없다.',
    highlightedNodes: ['legislative', 'courts'],
    links: [
      { label: '객관식 기출 1번 풀기', targetView: 'trainer', questionId: 1 },
    ],
  },
  {
    id: 'b2',
    code: '경계 02 · 입법과 재판',
    title: '국회는 어디까지 재판 기준을 정할 수 있나?',
    summary: '형량 기준이나 판사 인사 틀을 법률로 정해도 재판 개입은 아니다',
    detail:
      '판사는 헌법과 법률에 따라 심판하므로(제103조), 국회가 중범죄의 최소 형량을 높이거나 법원조직법으로 인사·관재인 기준을 정한 것은 재판 본질 침해가 아니다.',
    highlightedNodes: ['legislative', 'courts', 'constCourt'],
    links: [
      { label: '객관식 기출 2번 풀기', targetView: 'trainer', questionId: 2 },
      { label: '객관식 기출 3번 풀기', targetView: 'trainer', questionId: 3 },
    ],
  },
  {
    id: 'b3',
    code: '경계 03 · 통치행위와 통제',
    title: '헌법재판소는 대통령 결정을 어디까지 심사하나?',
    summary: '외교·군사 선택의 유불리는 따지지 않아도, 국회 동의를 건너뛴 절차 위반은 심사한다',
    detail:
      '고도의 정치적 결단이라도 사법자제는 헌법과 법률이 정한 절차를 지킨 것이 전제이므로(2003헌마814), 국회의 사전동의를 건너뛴 파병결정은 헌법재판소가 심사할 수 있다.',
    highlightedNodes: ['legislative', 'executive', 'constCourt'],
    links: [
      { label: '해외파병 사례형 보기', targetView: 'case' },
    ],
  },
];

export interface NormTierItem {
  id: string;
  rankLabel: string;
  name: string;
  sub: string;
  reviewOrgan?: string;
  reviewRule?: string;
  description: string;
}

export const NORM_HIERARCHY_TIERS: NormTierItem[] = [
  {
    id: 'constitution',
    rankLabel: '최고규범',
    name: '헌법',
    sub: '국가 최고규범 · 모든 국가권력의 근거와 한계',
    description:
      '입법·행정·사법 모든 국가기관이 준수해야 하는 최고규범이다. 아래 단계의 법률이나 명령·규칙은 상위 규범인 헌법에 어긋날 수 없다.',
  },
  {
    id: 'statute',
    rankLabel: '국회 제정',
    name: '법률',
    sub: '법원조직법 · 형법 · 민사소송법 등',
    reviewOrgan: '헌법재판소 심판',
    reviewRule: '법원이 위헌법률심판 제청 (헌법 제107조 제1항)',
    description:
      '재판의 전제가 된 ‘법률’이 헌법에 위반되는지 문제 될 때에는 법원이 직접 위헌 결정을 내릴 수 없고, 헌법재판소에 제청하여 그 결정에 따라 재판한다.',
  },
  {
    id: 'decree-rule',
    rankLabel: '행정입법 · 자율규칙',
    name: '명령 · 규칙',
    sub: '대통령령(제75조) · 총리령·부령(제95조) · 대법원규칙(제108조) 등 — 법률 위반 불가',
    reviewOrgan: '대법원 최종 심사',
    reviewRule: '위헌·위법 인정 시 대법관 전원의 2/3 이상 합의체 (제107조② · 법원조직법 제7조①)',
    description:
      '법원의 심사 대상은 대법원규칙에 한정되지 않고 대통령령·부령 등 ‘명령·규칙’ 전반을 포함한다. 재판의 전제가 된 명령·규칙·처분은 대법원이 최종 심사권을 가지며, 명령·규칙을 위헌·위법으로 인정할 때에는 반드시 대법관 전원의 3분의 2 이상의 합의체에서 심판해야 한다.',
  },
  {
    id: 'ordinance',
    rankLabel: '자치법규',
    name: '조례 · 지자체 규칙',
    sub: '법령의 범위 안에서 제정 (헌법 제117조 제1항)',
    description:
      '지방자치단체가 법령의 범위 안에서 제정하는 자치법규로, 상위 법률 및 명령에 위반될 수 없으며 재판의 전제가 될 경우 대법원이 최종 심사한다.',
  },
];

export const CONSTITUTION_ARTICLES_SUMMARY = [
  {
    articles: '제101조 · 제102조',
    title: '법원 조직 법정주의',
    desc: '재판은 법관이 모인 법원이 맡고, 구체적인 인원수와 조직은 「법원조직법」으로 정함',
  },
  {
    articles: '제103조 (재판 독립)',
    title: '양심과 법률에 따른 심판',
    desc: '판사는 외부 눈치 보지 않고 헌법과 법률에 따라 양심껏 심판함 (법률을 무시할 자유가 아님)',
  },
  {
    articles: '제104조 ~ 제106조',
    title: '임기 · 연임 · 신분보장',
    desc: '대법원장(6년, 중임 불가) · 대법관(6년, 연임 가능) · 일반법관(10년, 연임 가능) / 탄핵이나 금고 이상의 형 선고 없이는 파면 불가',
  },
  {
    articles: '제107조 (위헌 심사)',
    title: '위헌·위법 심사권의 분담',
    desc: '법률이 위헌인지는 헌법재판소에 제청하고, 명령·규칙·처분이 위헌·위법인지는 대법원이 최종 심사함',
  },
  {
    articles: '제108조 ~ 제110조',
    title: '규칙제정 · 공개 · 군사법원',
    desc: '법률에 저촉되지 않는 범위 안에서 대법원규칙 제정 / 심리는 결정으로 비공개 가능해도 판결(선고)은 무조건 공개 / 군사법원 상고심은 항상 대법원, 비상계엄하 사형은 단심 불가',
  },
];

export const ROUTER_SITUATIONS: RouterSituation[] = [
  {
    id: 's1',
    num: '01',
    question: '재판에 적용할 ‘법률’이 위헌인지 문제 될 때',
    shortTag: '법률 위헌 심사',
    organTitle: '헌법재판소',
    organSubtitle: '법원이 위헌법률심판 제청 → 헌재 결정에 따라 재판',
    organCategory: 'const-court',
    quorumOrRule: '법원이 직접 법률을 위헌 선언할 수 없고 헌법재판소에 제청',
    legalBasis: '헌법 제107조 제1항',
    keyWarning:
      '법률(헌재 제청)과 명령·규칙·처분(대법원 최종 심사)의 심사 기관을 서로 바꾸는 함정을 주의해야 합니다.',
    flowSteps: [],
    relatedQuestionIds: [5],
  },
  {
    id: 's2',
    num: '02',
    question: '‘명령·규칙’이 헌법이나 법률에 위반된다고 인정할 때',
    shortTag: '명령·규칙 위헌·위법 인정',
    organTitle: '대법원 (대법관 전원의 3분의 2 이상의 합의체)',
    organSubtitle: '의견이 일치해도 3명 이상 부(소부)에서 재판할 수 없음',
    organCategory: 'sc-grand',
    quorumOrRule: '반드시 대법관 전원의 3분의 2 이상의 합의체에서 심판',
    legalBasis: '헌법 제107조 제2항 · 법원조직법 제7조 제1항 단서 제1·2호',
    keyWarning:
      '대법관 3명 이상 부에서 먼저 심리하여 위헌·위법이라고 의견이 일치하더라도 그 부(소부)에서 재판할 수 없습니다.',
    examCaution:
      '실무나 홈페이지에서 흔히 ‘전원합의체’라는 통칭을 쓰지만, 법원조직법 제7조 제1항의 실제 조문 표현은 정확히 ‘대법관 전원의 3분의 2 이상의 합의체’입니다.',
    flowSteps: [],
    relatedQuestionIds: [2, 4],
  },
  {
    id: 's3',
    num: '03',
    question: '‘명령·규칙’이 합헌·적법하다고 의견이 일치할 때',
    shortTag: '명령·규칙 합헌·적법 일치',
    organTitle: '대법원 3명 이상으로 구성된 부(소부)',
    organSubtitle: '판례 변경 등 다른 제외 사유가 없는 한 그 부(소부)에서 재판 가능',
    organCategory: 'sc-petty',
    quorumOrRule: '대법관 3명 이상으로 구성된 부에서 의견 일치 시 재판 가능',
    legalBasis: '법원조직법 제7조 제1항 단서',
    keyWarning:
      '당사자가 위헌 주장을 했더라도 재판부가 합헌·적법으로 보아 배척하는 데 의견이 일치하면 부(소부)에서 재판할 수 있습니다.',
    flowSteps: [],
    relatedQuestionIds: [9],
  },
  {
    id: 's4',
    num: '04',
    question: '구체적인 ‘행정처분’이 위헌·위법인지 심사할 때',
    shortTag: '개별 처분 심사',
    organTitle: '대법원 최종 심사 (3명 이상 부에서도 재판 가능)',
    organSubtitle: '명령·규칙과 달리 개별 ‘처분’의 위법 인정은 의견 일치 시 부(소부) 재판 가능',
    organCategory: 'sc-petty',
    quorumOrRule: '최종 심사권은 대법원 보유 · 부(소부) 제외 사유(제7조① 제1·2호)는 명령·규칙만 해당',
    legalBasis: '헌법 제107조 제2항 · 법원조직법 제7조 제1항 단서',
    keyWarning:
      '헌법 제107조 제2항은 명령·규칙·처분을 함께 대법원 최종 심사 대상으로 규정하지만, 부(소부) 재판이 금지되는 위헌·위법 인정 대상은 ‘명령 또는 규칙’뿐입니다.',
    flowSteps: [],
    relatedQuestionIds: [5],
  },
  {
    id: 's5',
    num: '05',
    question: '대법원규칙 제·개정 및 중요 사법행정 운영을 의결할 때',
    shortTag: '사법행정 의결',
    organTitle: '대법관회의',
    organSubtitle: '재판부가 아닌 사법행정 의결기구 · 안건 부의권자: 대법원장',
    organCategory: 'sc-council',
    quorumOrRule: '대법관 전원의 3분의 2 이상 출석 + 출석인원 과반수 찬성',
    proposerOrNote: '안건 부의권자: 대법원장 (대법관 전원 과반수 부의 X)',
    legalBasis: '법원조직법 제16조 제2항 · 제17조 제2·6호',
    keyWarning:
      '‘대법관 과반수가 부친 사항’이나 ‘전원 과반수 출석’으로 바꾸는 기출 함정(2026 7급 25번)을 정확히 구별해야 합니다.',
    flowSteps: [],
    relatedQuestionIds: [1, 2, 10],
  },
  {
    id: 's6',
    num: '06',
    question: '판사의 임명·연임 등 인사 중요 사항을 심의할 때',
    shortTag: '법관 인사 심의',
    organTitle: '법관인사위원회',
    organSubtitle: '대법원에 설치(법무부 X) · 의결이 아닌 심의기구',
    organCategory: 'sc-personnel',
    quorumOrRule: '위원장 1명을 포함한 11명의 위원으로 구성',
    legalBasis: '법원조직법 제25조의2 제1항·제3항',
    keyWarning:
      '설치 기관을 ‘법무부’로 바꾸거나, 위원 수를 ‘위원장 제외 11명’으로 바꾸는 함정을 주의해야 합니다.',
    flowSteps: [],
    relatedQuestionIds: [2, 11],
  },
];

export const QUOTA_MILESTONES: QuotaMilestone[] = [
  {
    id: 'y2026',
    periodLabel: '2026 현행',
    badge: '현행',
    totalJustices: 14,
    addedNote: '대법원장 포함 14명',
    twoThirdsMin: 10,
    formulaNote: '14명의 2/3 이상 → 최소 10명',
    councilPassAtMinQuorum: 6,
  },
  {
    id: 'y2028',
    periodLabel: '2028. 3.~',
    badge: '+4명',
    totalJustices: 18,
    addedNote: '대법원장 포함 18명',
    twoThirdsMin: 12,
    formulaNote: '18명의 2/3 이상 → 최소 12명',
    councilPassAtMinQuorum: 7,
  },
  {
    id: 'y2029',
    periodLabel: '2029. 3.~',
    badge: '+4명',
    totalJustices: 22,
    addedNote: '대법원장 포함 22명',
    twoThirdsMin: 15,
    formulaNote: '22명의 2/3 이상 → 최소 15명',
    councilPassAtMinQuorum: 8,
  },
  {
    id: 'y2030',
    periodLabel: '2030. 3.~',
    badge: '최종 26명',
    totalJustices: 26,
    addedNote: '대법원장 포함 총 26명',
    twoThirdsMin: 18,
    formulaNote: '26명의 2/3 이상 → 최소 18명',
    councilPassAtMinQuorum: 10,
  },
];

export const CORE_PRECEDENTS: CorePrecedent[] = [
  {
    id: '2013hunba370',
    caseNumber: '2013헌바370',
    verdict: '합헌',
    title: '대법원규칙 위임 기준 완화와 범위',
    summary:
      '제108조에 적힌 일(소송절차·내부규율·사무처리)은 법률이 따로 시키지 않아도 법률에 어긋나지 않는 선에서 규칙 제정이 가능하다. 적혀 있지 않은 일도 국회가 법률로 맡기면 가능하며, 소송비용 같은 기술적 실무는 법원이 제일 잘 알기 때문에 포괄위임금지원칙은 지키되 구체성 요구는 완화된다.',
    bridgeTitle: '앞 주차 수업 연결',
    bridgeText:
      '중간고사 KBS 수신료 감면 단서에서 수익적·기술적 사항 위임 기준이 완화되던 논리와 연결됩니다.',
    relatedQuestionIds: [1, 5, 12],
  },
  {
    id: '99hunba43',
    caseNumber: '99헌바43 · 96헌바16',
    verdict: '합헌',
    title: '최소 형량 상향과 판사의 양형재량',
    summary:
      '강도상해죄(최소 징역 7년 → 작량감경 절반 시 3년 6개월 > 집행유예 기준 3년)나 특가법 제12조(최소 징역 10년)처럼 법정형 하한을 높여 집행유예를 줄 수 없게 해도 합헌이다. 판사도 국회가 정한 법 안에서 형을 매기는 것이기 때문이다.',
    bridgeTitle: '앞 주차 수업 연결',
    bridgeText:
      '2주차 보호감호 사건은 판사에게 재범 위험성 판단 여지를 아예 주지 않고 무조건 선고하게 해 위헌이었으나, 최소 형량 기준선 설정은 입법재량이라 합헌입니다.',
    visualScale: {
      step1: '최소 징역 7년',
      step2: '절반 감경(작량감경) → 징역 3년 6개월',
      step3: '집행유예 기준(3년 이하) 초과',
      verdictLabel: '합헌',
    },
    relatedQuestionIds: [2, 3, 13],
  },
  {
    id: '2015hunba331',
    caseNumber: '2015헌바331',
    verdict: '합헌',
    title: '판사 근무평정 규칙 위임과 연임 탈락',
    summary:
      '근무평정을 대법원규칙에 맡긴 것은 평가 항목을 예상할 수 있어 합헌이고, ‘근무성적이 현저히 불량한 경우’ 연임 제외 조항도 뜻이 통하며 10년 치 누적 평가와 불복 소송 기회가 열려 있어 합헌이다.',
    bridgeTitle: '출제 함정 주의',
    bridgeText:
      '기출문제에서는 연임 탈락한 청구인(판사)의 위헌 주장을 마치 헌법재판소 결론인 것처럼 그대로 옮겨 오답 선지를 만듭니다.',
    relatedQuestionIds: [3, 5],
  },
  {
    id: '2001hunga1',
    caseNumber: '2001헌가1',
    verdict: '합헌',
    title: '부실 금융회사 파산관재인 지정',
    summary:
      '망한 금융회사를 정리할 청산 관리인(파산관재인)으로 예금보험공사를 뽑게 한 법은 합헌이다. 관리인 뽑는 일은 ‘누가 옳고 그른지 가리는 재판의 핵심 본질’이 아니기 때문이다.',
    bridgeTitle: '출제 함정 주의',
    bridgeText:
      '결정문 맨 뒤에 실린 재판관 3인의 소수 반대의견(위헌 주장) 문구를 다수의견인 것처럼 그대로 베껴 출제합니다.',
    relatedQuestionIds: [3, 5],
  },
];
