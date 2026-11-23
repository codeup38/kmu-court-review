import { MainViewId } from '../types';

export const OVERARCHING_QUESTION =
  '발표에서 다룬 네 문제는 모두 “사법부(법원과 헌법재판소)는 어디까지 판단할 수 있고, 어디서 멈춰야 하는가?”를 묻습니다.';

export interface BoundarySummary {
  id: string;
  code: string;
  title: string;
  summary: string;
  linkLabel: string;
  targetView: MainViewId;
  questionId?: number;
}

export const BOUNDARY_SUMMARIES: BoundarySummary[] = [
  {
    id: 'b1',
    code: '경계 01 · 대법원규칙',
    title: '대법원은 어디까지 규칙을 만들 수 있나?',
    summary: '법원 스스로 만드는 규칙이라도 국회가 만든 법률을 넘을 수는 없다.',
    linkLabel: '기출 1번 확인',
    targetView: 'trainer',
    questionId: 1,
  },
  {
    id: 'b2',
    code: '경계 02 · 입법과 재판',
    title: '국회는 어디까지 재판 기준을 정할 수 있나?',
    summary: '최소 형량 기준이나 판사 인사 틀을 법률로 정해도 재판 개입은 아니다.',
    linkLabel: '기출 2·3번 확인',
    targetView: 'trainer',
    questionId: 2,
  },
  {
    id: 'b3',
    code: '경계 03 · 통치행위와 통제',
    title: '헌재는 대통령 결정을 어디까지 심사하나?',
    summary: '외교·군사 선택의 유불리는 따지지 않아도, 국회 동의를 건너뛴 절차 위반은 심사한다.',
    linkLabel: '사례형 보기',
    targetView: 'case',
  },
];

export interface NormTier {
  id: string;
  rank: string;
  name: string;
  sub: string;
  reviewTarget?: string;
  reviewDetail?: string;
  emphasis?: boolean;
}

export const NORM_HIERARCHY_TIERS: NormTier[] = [
  {
    id: 'constitution',
    rank: '1단계 · 최고규범',
    name: '헌법',
    sub: '모든 국가권력의 근거이자 넘지 못할 최상위 기준',
  },
  {
    id: 'statute',
    rank: '2단계 · 국회 제정',
    name: '법률',
    sub: '법원조직법 · 형법 · 민사소송법 등',
    reviewTarget: '헌법재판소 심판',
    reviewDetail: '재판 전제 시 법원이 위헌 제청 (헌법 제107조 제1항)',
  },
  {
    id: 'decree-rule',
    rank: '3단계 · 법률 위반 불가',
    name: '명령 · 규칙',
    sub: '대통령령(제75조) · 총리령·부령(제95조) · 대법원규칙(제108조) 등',
    reviewTarget: '대법원 최종 심사',
    reviewDetail:
      '헌법 제107조 제2항 · 위헌·위법 인정 시 반드시 대법관 전원의 3분의 2 이상의 합의체(법원조직법 제7조①)',
    emphasis: true,
  },
  {
    id: 'ordinance',
    rank: '4단계 · 자치법규',
    name: '조례 · 지자체 규칙',
    sub: '법령의 범위 안에서 지방자치단체가 제정 (헌법 제117조 제1항)',
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
    title: '헌법과 법률에 따른 심판',
    desc: '판사는 외부 간섭 없이 헌법과 법률에 따라 양심껏 심판함 (법률을 무시할 자유가 아님)',
  },
  {
    articles: '제104조 ~ 제106조',
    title: '임기 · 연임 · 신분보장',
    desc: '대법원장(6년, 중임 불가) · 대법관(6년, 연임 가능) · 일반법관(10년, 연임 가능) / 탄핵이나 금고 이상의 형 선고 없이는 파면 불가',
  },
  {
    articles: '제107조 (위헌 심사)',
    title: '위헌·위법 심사 분담',
    desc: '법률이 위헌인지는 헌법재판소에 제청하고, 명령·규칙·처분이 위헌·위법인지는 대법원이 최종 심사함',
  },
  {
    articles: '제108조 ~ 제110조',
    title: '규칙 · 공개 · 군사법원',
    desc: '법률에 저촉되지 않는 범위에서 대법원규칙 제정 / 심리는 결정으로 비공개 가능해도 판결 선고는 무조건 공개 / 군사법원 상고심은 항상 대법원, 비상계엄하 사형은 단심 불가',
  },
];

export interface CourtOrganRow {
  name: string;
  role: string;
  composition: string;
  trap: string;
  basis: string;
}

export const COURT_THREE_ORGANS: CourtOrganRow[] = [
  {
    name: '법관인사위원회',
    role: '인사 심의',
    composition: '대법원에 설치 · 위원장 1명을 포함한 11명으로 구성',
    trap: '‘법무부 설치(X)’, ‘의결기구(X)’, ‘위원장 제외 11명(X)’ 함정 주의',
    basis: '법원조직법 제25조의2 제1·3항',
  },
  {
    name: '대법관회의',
    role: '사법행정 의결',
    composition: '대법원장이 안건 부의 · 전원 3분의 2 이상 출석 + 출석인원 과반수 찬성',
    trap: '‘대법관 과반수가 부의(X)’, ‘전원 과반수 출석(X)’ 기출 함정 주의',
    basis: '법원조직법 제16조② · 제17조 제2·6호',
  },
  {
    name: '합의체 · 부(소부)',
    role: '사건 재판',
    composition:
      '대법관 전원의 3분의 2 이상의 합의체 원칙 / 3명 이상 부(소부)에서 의견 일치 시 예외 재판',
    trap: '명령·규칙이 위헌·위법이라 인정할 땐 의견 일치해도 3명 이상 부에서 재판 불가! (합헌 일치 · 개별 처분 위법 인정은 부 재판 가능)',
    basis: '법원조직법 제7조 제1항',
  },
];

export interface QuotaMilestone {
  id: string;
  periodLabel: string;
  totalJustices: number;
  twoThirdsMin: number;
  note: string;
}

export const QUOTA_MILESTONES: QuotaMilestone[] = [
  {
    id: 'y2026',
    periodLabel: '2026 현행',
    totalJustices: 14,
    twoThirdsMin: 10,
    note: '현행 정원 (대법원장 포함 14명)',
  },
  {
    id: 'y2028',
    periodLabel: '2028. 3.~',
    totalJustices: 18,
    twoThirdsMin: 12,
    note: '1단계 +4명 증원 (총 18명)',
  },
  {
    id: 'y2029',
    periodLabel: '2029. 3.~',
    totalJustices: 22,
    twoThirdsMin: 15,
    note: '2단계 +4명 증원 (총 22명)',
  },
  {
    id: 'y2030',
    periodLabel: '2030. 3.~',
    totalJustices: 26,
    twoThirdsMin: 18,
    note: '최종 +4명 증원 (총 26명)',
  },
];

export interface CorePrecedent {
  id: string;
  caseNumber: string;
  verdict: string;
  title: string;
  summary: string;
  noteTitle: string;
  noteText: string;
  isTrap: boolean;
  scale?: {
    step1: string;
    step2: string;
    step3: string;
  };
}

export const CORE_PRECEDENTS: CorePrecedent[] = [
  {
    id: '2013hunba370',
    caseNumber: '2013헌바370',
    verdict: '합헌',
    title: '대법원규칙 위임 기준 완화와 범위',
    summary:
      '헌법 제108조에 적힌 일(소송절차·내부규율·사무처리)은 법률이 따로 위임하지 않아도 법률에 어긋나지 않는 선에서 규칙으로 정할 수 있다. 적혀 있지 않은 일도 국회가 법률로 맡기면 가능하며, 소송비용 같은 기술적 실무는 법원이 가장 잘 알기 때문에 포괄위임금지원칙은 지키되 구체성 요구는 완화된다.',
    noteTitle: '앞 주차 수업 연결',
    noteText:
      '중간고사 KBS 수신료 감면 단서에서 수익적·기술적 사항의 위임 기준이 완화되던 논리와 연결됩니다.',
    isTrap: false,
  },
  {
    id: '99hunba43',
    caseNumber: '99헌바43 · 96헌바16',
    verdict: '합헌',
    title: '최소 형량 상향과 판사의 양형재량',
    summary:
      '강도상해죄(최소 징역 7년)나 특가법 제12조(최소 징역 10년)처럼 법정형 하한을 높여 작량감경을 해도 집행유예를 줄 수 없게 했더라도 합헌이다. 판사도 국회가 정한 법의 테두리 안에서 형을 매기는 것이기 때문이다.',
    noteTitle: '앞 주차 수업 연결',
    noteText:
      '2주차 보호감호 사건은 판사에게 재범 위험성 판단 여지를 아예 주지 않고 무조건 선고하게 해 위헌이었으나, 최소 형량 기준선 설정은 입법재량이라 합헌입니다.',
    isTrap: false,
    scale: {
      step1: '최소 징역 7년',
      step2: '절반 감경(작량감경) → 3년 6개월',
      step3: '집행유예 기준(3년 이하) 초과 → 합헌',
    },
  },
  {
    id: '2015hunba331',
    caseNumber: '2015헌바331',
    verdict: '합헌',
    title: '판사 근무평정 규칙 위임과 연임 탈락',
    summary:
      '근무평정을 대법원규칙에 맡긴 것은 평가 항목을 예상할 수 있어 합헌이고, ‘근무성적이 현저히 불량한 경우’ 연임 제외 조항도 뜻이 통하며 10년 치 누적 평가와 불복 소송 기회가 보장되어 합헌이다.',
    noteTitle: '기출 함정 주의',
    noteText:
      '시험 선지에서는 연임 탈락한 청구인(판사)의 위헌 주장을 마치 헌법재판소 결론인 것처럼 서술해 오답을 만듭니다.',
    isTrap: true,
  },
  {
    id: '2001hunga1',
    caseNumber: '2001헌가1',
    verdict: '합헌',
    title: '부실 금융회사 파산관재인 지정',
    summary:
      '망한 금융회사를 정리할 청산 관리인(파산관재인)으로 예금보험공사를 선임하게 한 법률은 합헌이다. 관리인을 뽑는 일은 ‘누가 옳고 그른지 가리는 재판의 핵심 본질’이 아니기 때문이다.',
    noteTitle: '기출 함정 주의',
    noteText:
      '결정문 맨 뒤에 실린 재판관 3인의 소수 반대의견(위헌 주장) 문구를 다수의견인 것처럼 그대로 베껴 출제합니다.',
    isTrap: true,
  },
];
