export type MainViewId = 'schema' | 'trainer' | 'case';

export type BoundaryId = 'b1' | 'b2' | 'b3';

export type PillarNodeId = 'legislative' | 'executive' | 'courts' | 'constCourt';

export interface BoundaryItem {
  id: BoundaryId;
  code: string;
  title: string;
  summary: string;
  detail: string;
  highlightedNodes: PillarNodeId[];
  links: {
    label: string;
    targetView: MainViewId;
    questionId?: number;
  }[];
}

export interface RouterSituation {
  id: string;
  num: string;
  question: string;
  shortTag: string;
  organTitle: string;
  organSubtitle: string;
  organCategory: 'const-court' | 'sc-grand' | 'sc-petty' | 'sc-council' | 'sc-personnel';
  quorumOrRule: string;
  proposerOrNote?: string;
  legalBasis: string;
  keyWarning: string;
  examCaution?: string;
  flowSteps: {
    stepLabel: string;
    actor: string;
    detail: string;
    accent?: 'navy' | 'crimson' | 'slate';
  }[];
  relatedQuestionIds: number[];
}

export interface QuotaMilestone {
  id: string;
  periodLabel: string;
  badge: string;
  totalJustices: number;
  addedNote: string;
  twoThirdsMin: number;
  formulaNote: string;
  councilPassAtMinQuorum: number;
}

export interface CorePrecedent {
  id: string;
  caseNumber: string;
  verdict: string;
  title: string;
  summary: string;
  bridgeTitle: string;
  bridgeText: string;
  trapWarning?: string;
  relatedQuestionIds: number[];
  visualScale?: {
    step1: string;
    step2: string;
    step3: string;
    verdictLabel: string;
  };
}

export type QuestionCategory = 'exam' | 'variant' | 'ox';

export interface XRayPoint {
  choiceNum?: number; // 1~4 for MCQ, undefined for OX
  trapType: string;
  wrongSpan: string; // exact substring in choice/stem when possible
  rightSpan: string;
  basis: string;
}

export interface QuestionItem {
  id: number;
  code: string;
  category: QuestionCategory;
  categoryLabel: string;
  sourceTitle: string;
  type: 'mcq' | 'ox';
  stem: string;
  choices?: [string, string, string, string];
  answer: number | 'O' | 'X';
  trapTag: string;
  xrayPoints: XRayPoint[];
  explanation: string;
  referenceBasis: string;
}

export interface SpeedDrillCard {
  id: number;
  category: string;
  promptBefore: string;
  blankTarget: string;
  promptAfter: string;
  basis: string;
  trapNote: string;
}

export interface TimelineNode {
  id: string;
  dateLabel: string;
  shortTitle: string;
  legalPointTitle: string;
  legalPointBody: string;
  provisionBadge: string;
  isCoreTarget?: boolean;
}

export interface EssaySection {
  roman: string;
  title: string;
  segments: {
    text: string;
    isKeyword?: boolean;
  }[];
}

export interface EssayChecklistItem {
  id: string;
  label: string;
  hint: string;
  matchGroups: string[][]; // At least one group where all tokens match, OR custom matcher logic
}

export interface UserAnswerRecord {
  selected: number | 'O' | 'X';
  isCorrect: boolean;
  answeredAt: number;
}

export interface StudyState {
  answers: Record<number, UserAnswerRecord>;
  bookmarkedQuestions: number[];
  bookmarkedCases: string[];
  essayDraft: string;
  coachCustomMemo: string;
}

export type CoachPresetId = 'wrong-traps' | 'tutor-table' | 'variant-quiz' | 'case-feedback';

export interface InstantPromptModalData {
  title: string;
  subtitle: string;
  prompt: string;
}
