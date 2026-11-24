export type MainViewId = 'schema' | 'trainer' | 'case';

export type QuestionCategory = 'exam' | 'variant' | 'ox';

export interface XRayPoint {
  choiceNum?: number;
  trapType: string;
  wrongSpan: string;
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
  matchGroups: string[][];
}

export interface UserAnswerRecord {
  selected: number | 'O' | 'X';
  isCorrect: boolean;
  answeredAt: number;
}

export interface StudyState {
  answers: Record<number, UserAnswerRecord>;
  essayDraft: string;
  coachCustomMemo: string;
}

export type CoachPresetId =
  | 'wrong-traps'
  | 'variant-quiz'
  | 'case-feedback'
  | 'general-topdown';

export interface InstantPromptModalData {
  title: string;
  subtitle: string;
  placeholder: string;
  buildPrompt: (userNote: string) => string;
}
