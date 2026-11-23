import { useCallback, useEffect, useState } from 'react';
import { QUESTIONS_DATA } from '../data/questionsData';
import { StudyState } from '../types';

const STORAGE_KEY = 'kmu_court_review_state_v2';

const DEFAULT_STATE: StudyState = {
  answers: {},
  essayDraft: '',
  coachCustomMemo: '',
};

function loadInitialState(): StudyState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<StudyState>;
    return {
      answers:
        parsed.answers && typeof parsed.answers === 'object'
          ? parsed.answers
          : {},
      essayDraft: typeof parsed.essayDraft === 'string' ? parsed.essayDraft : '',
      coachCustomMemo:
        typeof parsed.coachCustomMemo === 'string'
          ? parsed.coachCustomMemo
          : '',
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
      // ignore storage errors
    }
  }, [state]);

  const submitAnswer = useCallback(
    (questionId: number, selected: number | 'O' | 'X') => {
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
    },
    []
  );

  const clearSingleAnswer = useCallback((questionId: number) => {
    setState((prev) => {
      const nextAnswers = { ...prev.answers };
      delete nextAnswers[questionId];
      return { ...prev, answers: nextAnswers };
    });
  }, []);

  const resetAllAnswers = useCallback(() => {
    setState((prev) => ({ ...prev, answers: {} }));
  }, []);

  const setEssayDraft = useCallback((essayDraft: string) => {
    setState((prev) => ({ ...prev, essayDraft }));
  }, []);

  const setCoachCustomMemo = useCallback((coachCustomMemo: string) => {
    setState((prev) => ({ ...prev, coachCustomMemo }));
  }, []);

  const wrongCount = Object.values(state.answers).filter(
    (a) => !a.isCorrect
  ).length;

  return {
    state,
    submitAnswer,
    clearSingleAnswer,
    resetAllAnswers,
    setEssayDraft,
    setCoachCustomMemo,
    wrongCount,
  };
}
