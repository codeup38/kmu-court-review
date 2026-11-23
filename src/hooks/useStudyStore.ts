import { useCallback, useEffect, useState } from 'react';
import { QUESTIONS_DATA } from '../data/questionsData';
import { StudyState } from '../types';

const STORAGE_KEY = 'kmu_court_review_state_v1';

const DEFAULT_STATE: StudyState = {
  answers: {},
  bookmarkedQuestions: [],
  bookmarkedCases: [],
  essayDraft: '',
  coachCustomMemo: '',
};

function loadInitialState(): StudyState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<StudyState>;
    return {
      answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
      bookmarkedQuestions: Array.isArray(parsed.bookmarkedQuestions)
        ? parsed.bookmarkedQuestions
        : [],
      bookmarkedCases: Array.isArray(parsed.bookmarkedCases) ? parsed.bookmarkedCases : [],
      essayDraft: typeof parsed.essayDraft === 'string' ? parsed.essayDraft : '',
      coachCustomMemo:
        typeof parsed.coachCustomMemo === 'string' ? parsed.coachCustomMemo : '',
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function useStudyStore() {
  const [state, setState] = useState<StudyState>(loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [state]);

  const submitAnswer = useCallback((questionId: number, selected: number | 'O' | 'X') => {
    const q = QUESTIONS_DATA.find((item) => item.id === questionId);
    if (!q) return;
    const isCorrect = q.answer === selected;
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: {
          selected,
          isCorrect,
          answeredAt: Date.now(),
        },
      },
    }));
  }, []);

  const clearSingleAnswer = useCallback((questionId: number) => {
    setState((prev) => {
      const nextAnswers = { ...prev.answers };
      delete nextAnswers[questionId];
      return {
        ...prev,
        answers: nextAnswers,
      };
    });
  }, []);

  const resetAllAnswers = useCallback(() => {
    setState((prev) => ({
      ...prev,
      answers: {},
    }));
  }, []);

  const toggleQuestionBookmark = useCallback((questionId: number) => {
    setState((prev) => {
      const exists = prev.bookmarkedQuestions.includes(questionId);
      return {
        ...prev,
        bookmarkedQuestions: exists
          ? prev.bookmarkedQuestions.filter((id) => id !== questionId)
          : [...prev.bookmarkedQuestions, questionId],
      };
    });
  }, []);

  const toggleCaseBookmark = useCallback((caseId: string) => {
    setState((prev) => {
      const exists = prev.bookmarkedCases.includes(caseId);
      return {
        ...prev,
        bookmarkedCases: exists
          ? prev.bookmarkedCases.filter((id) => id !== caseId)
          : [...prev.bookmarkedCases, caseId],
      };
    });
  }, []);

  const setEssayDraft = useCallback((essayDraft: string) => {
    setState((prev) => ({ ...prev, essayDraft }));
  }, []);

  const setCoachCustomMemo = useCallback((coachCustomMemo: string) => {
    setState((prev) => ({ ...prev, coachCustomMemo }));
  }, []);

  const wrongCount = Object.values(state.answers).filter((a) => !a.isCorrect).length;
  const bookmarkCount =
    state.bookmarkedQuestions.length + state.bookmarkedCases.length;

  // Unique review badge count: wrong questions + bookmarked questions (deduplicated) + bookmarked cases
  const attentionQuestionIds = new Set<number>([
    ...Object.entries(state.answers)
      .filter(([, rec]) => !rec.isCorrect)
      .map(([id]) => Number(id)),
    ...state.bookmarkedQuestions,
  ]);
  const coachBadgeCount = attentionQuestionIds.size + state.bookmarkedCases.length;

  return {
    state,
    submitAnswer,
    clearSingleAnswer,
    resetAllAnswers,
    toggleQuestionBookmark,
    toggleCaseBookmark,
    setEssayDraft,
    setCoachCustomMemo,
    wrongCount,
    bookmarkCount,
    coachBadgeCount,
  };
}
