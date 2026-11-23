import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  RotateCcw,
  Shuffle,
} from 'lucide-react';
import { QUESTIONS_DATA, SPEED_DRILL_CARDS } from '../data/questionsData';
import {
  InstantPromptModalData,
  QuestionItem,
  SpeedDrillCard,
  UserAnswerRecord,
} from '../types';
import {
  buildQuestionExplainPrompt,
  buildQuestionVariantPrompt,
} from '../utils/promptEngine';

type TrainerMode = 'focus' | 'list' | 'drill';
type FilterKey = 'all' | 'exam' | 'variant' | 'ox' | 'review';

interface TrainerViewProps {
  answers: Record<number, UserAnswerRecord>;
  bookmarkedQuestions: number[];
  focusedQuestionId: number | null;
  isOverlayOpen: boolean;
  onClearFocusedQuestion: () => void;
  onSubmitAnswer: (questionId: number, selected: number | 'O' | 'X') => void;
  onClearSingleAnswer: (questionId: number) => void;
  onResetAllAnswers: () => void;
  onToggleQuestionBookmark: (questionId: number) => void;
  onTriggerInstantPrompt: (data: InstantPromptModalData) => void;
}

const CIRCLE_NUMS = ['①', '②', '③', '④'];

function renderInlineStrike(
  text: string,
  wrongSpan?: string,
  active?: boolean
): React.ReactNode {
  if (!active || !wrongSpan) return text;
  const idx = text.indexOf(wrongSpan);
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <del className="err-strike">{text.slice(idx, idx + wrongSpan.length)}</del>
      {text.slice(idx + wrongSpan.length)}
    </>
  );
}

interface QuestionSheetProps {
  question: QuestionItem;
  record?: UserAnswerRecord;
  isBookmarked: boolean;
  onSubmit: (selected: number | 'O' | 'X') => void;
  onRetry: () => void;
  onToggleBookmark: () => void;
  onOpenExplainAI: () => void;
  onOpenVariantAI: () => void;
}

const QuestionSheet: React.FC<QuestionSheetProps> = ({
  question,
  record,
  isBookmarked,
  onSubmit,
  onRetry,
  onToggleBookmark,
  onOpenExplainAI,
  onOpenVariantAI,
}) => {
  const isGraded = Boolean(record);

  return (
    <article className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm">
      {/* 상단 출처 & 북마크 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-sm font-extrabold bg-[#0f172a] text-white px-3 py-1 rounded tabular-nums">
            문항 {question.id}
          </span>
          <span className="text-sm sm:text-[15px] font-bold text-[#1e3a8a]">
            {question.sourceTitle}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleBookmark}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
            isBookmarked
              ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
              : 'bg-slate-50 text-slate-600 border-slate-300 hover:border-[#1e3a8a] hover:text-[#1e3a8a]'
          }`}
        >
          {isBookmarked ? (
            <>
              <Check className="w-4 h-4" />
              <span>저장됨</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              <span>헷갈림 저장</span>
            </>
          )}
        </button>
      </div>

      {/* 질문 원문 (PPT 시험지 스케일 20~22px) */}
      <h3 className="text-lg sm:text-[22px] font-extrabold text-[#0f172a] leading-[1.52] mb-7">
        {question.type === 'ox' && isGraded && question.answer === 'X'
          ? renderInlineStrike(
              question.stem,
              question.xrayPoints[0]?.wrongSpan,
              true
            )
          : question.stem}
      </h3>

      {/* 선지 영역 */}
      {question.type === 'mcq' && question.choices ? (
        <div className="space-y-3">
          {question.choices.map((choiceText, idx) => {
            const choiceNum = idx + 1;
            const isSelected = record?.selected === choiceNum;
            const isAnswer = question.answer === choiceNum;
            const xray = question.xrayPoints.find(
              (x) => x.choiceNum === choiceNum
            );

            let boxStyle =
              'bg-[#f8fafc] border-slate-200 hover:bg-white hover:border-[#1e3a8a] text-[#0f172a]';
            if (isGraded) {
              if (isAnswer) {
                boxStyle =
                  'bg-[#eff6ff]/75 border-[#1e3a8a] border-l-[5px] text-[#0f172a] shadow-sm';
              } else if (isSelected && !isAnswer) {
                boxStyle =
                  'bg-[#fef2f2]/75 border-[#b91c1c] border-l-[5px] text-[#0f172a]';
              } else {
                boxStyle = 'bg-white border-slate-200 text-slate-600';
              }
            }

            return (
              <button
                key={choiceNum}
                type="button"
                onClick={() => onSubmit(choiceNum)}
                className={`w-full text-left rounded-xl px-5 py-4 border transition-all flex items-baseline gap-3.5 ${boxStyle}`}
              >
                <span
                  className={`text-lg sm:text-[19px] font-extrabold shrink-0 tabular-nums ${
                    isGraded && isSelected && !isAnswer
                      ? 'text-[#b91c1c]'
                      : 'text-[#1e3a8a]'
                  }`}
                >
                  {CIRCLE_NUMS[idx]}
                </span>
                <div className="flex-1 space-y-1.5">
                  <p className="text-[16.5px] sm:text-[18px] leading-[1.65] font-medium">
                    {renderInlineStrike(choiceText, xray?.wrongSpan, isGraded)}
                  </p>
                  {isGraded && (isAnswer || isSelected) && (
                    <div className="flex items-center gap-2 pt-0.5 text-xs font-extrabold">
                      {isAnswer && (
                        <span className="bg-[#1e3a8a] text-white px-2.5 py-0.5 rounded">
                          정답
                        </span>
                      )}
                      {isSelected && !isAnswer && (
                        <span className="bg-[#b91c1c] text-white px-2.5 py-0.5 rounded">
                          내가 고른 선지
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {(['O', 'X'] as const).map((oxVal) => {
            const isSelected = record?.selected === oxVal;
            const isAnswer = question.answer === oxVal;

            let btnStyle =
              'bg-[#f8fafc] border-slate-200 hover:bg-white hover:border-[#1e3a8a] text-[#0f172a]';
            if (isGraded) {
              if (isAnswer) {
                btnStyle =
                  'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a] shadow-sm';
              } else if (isSelected && !isAnswer) {
                btnStyle =
                  'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]';
              } else {
                btnStyle = 'bg-white border-slate-200 text-slate-400';
              }
            }

            return (
              <button
                key={oxVal}
                type="button"
                onClick={() => onSubmit(oxVal)}
                className={`rounded-xl py-5 px-6 border transition-all flex items-center justify-center gap-3 ${btnStyle}`}
              >
                <span className="text-2xl sm:text-3xl font-extrabold tabular-nums">
                  {oxVal}
                </span>
                <span className="text-base sm:text-lg font-bold">
                  {oxVal === 'O' ? '옳은 설명' : '틀린 설명'}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 채점 후 오픈: 중첩 박스를 없앤 깔끔한 단일 해설 시트 (PPT 해설 슬라이드 감성) */}
      <AnimatePresence>
        {isGraded && record && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-8 pt-7 border-t-2 border-slate-900 space-y-6"
          >
            {/* 정오 판정 줄 */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-3.5 py-1 rounded text-sm font-extrabold text-white ${
                    record.isCorrect ? 'bg-[#1e3a8a]' : 'bg-[#b91c1c]'
                  }`}
                >
                  {record.isCorrect ? '정답입니다' : '오답입니다'}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-[#0f172a] tabular-nums">
                  정답 :{' '}
                  {question.type === 'mcq'
                    ? `${CIRCLE_NUMS[Number(question.answer) - 1]}번`
                    : question.answer}
                </span>
              </div>

              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-[#0f172a]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>다시 풀기</span>
              </button>
            </div>

            {/* PPT 취소선 → 파란 밑줄 교정 포인트 */}
            {(question.type === 'mcq' || question.answer === 'X') && (
              <div className="bg-[#f8fafc] rounded-xl border border-slate-200 border-l-[5px] border-l-[#b91c1c] p-5 space-y-3">
                <div className="text-sm font-extrabold text-[#991b1b]">
                  함정 교정 포인트 ({question.trapTag})
                </div>
                <div className="space-y-2.5 text-[16px] sm:text-[17px] leading-relaxed">
                  {question.xrayPoints.map((xr, idx) => (
                    <div key={idx} className="text-[#0f172a]">
                      {xr.choiceNum && (
                        <strong className="font-extrabold mr-2 tabular-nums">
                          선지 {CIRCLE_NUMS[xr.choiceNum - 1]}
                        </strong>
                      )}
                      <del className="err-strike">{xr.wrongSpan}</del>
                      <span className="mx-2 text-slate-400 font-bold">→</span>
                      <span className="key-underline">{xr.rightSpan}</span>
                      <span className="text-sm font-semibold text-slate-500 ml-2 tabular-nums">
                        ({xr.basis})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 본문 해설 */}
            <div className="space-y-2">
              <p className="text-[16.5px] sm:text-[17.5px] text-slate-800 leading-[1.75]">
                {question.explanation}
              </p>
              <p className="text-sm font-semibold text-slate-500 tabular-nums">
                근거 : {question.referenceBasis}
              </p>
            </div>

            {/* 절제된 하단 AI 보조 버튼 */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onOpenExplainAI}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-[#f1f5f9] text-slate-800 hover:bg-[#0f172a] hover:text-white transition-colors"
              >
                내가 고른 선지 AI 비교 설명 듣기
              </button>
              <button
                type="button"
                onClick={onOpenVariantAI}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-[#eff6ff] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-colors"
              >
                이 쟁점 변형문제 더 받아 풀기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};

export const TrainerView: React.FC<TrainerViewProps> = ({
  answers,
  bookmarkedQuestions,
  focusedQuestionId,
  isOverlayOpen,
  onClearFocusedQuestion,
  onSubmitAnswer,
  onClearSingleAnswer,
  onResetAllAnswers,
  onToggleQuestionBookmark,
  onTriggerInstantPrompt,
}) => {
  const [mode, setMode] = useState<TrainerMode>('focus');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const [drillCards, setDrillCards] = useState<SpeedDrillCard[]>(SPEED_DRILL_CARDS);
  const [revealedDrillIds, setRevealedDrillIds] = useState<number[]>([]);

  useEffect(() => {
    if (focusedQuestionId !== null) {
      setMode('focus');
      setFilter('all');
      const idx = QUESTIONS_DATA.findIndex((q) => q.id === focusedQuestionId);
      if (idx !== -1) setCurrentIndex(idx);
      onClearFocusedQuestion();
    }
  }, [focusedQuestionId, onClearFocusedQuestion]);

  const reviewSetIds = useMemo(() => {
    const ids = new Set<number>(bookmarkedQuestions);
    Object.entries(answers).forEach(([qId, rec]) => {
      if (!rec.isCorrect) ids.add(Number(qId));
    });
    return ids;
  }, [answers, bookmarkedQuestions]);

  const filteredQuestions = useMemo(() => {
    switch (filter) {
      case 'exam':
        return QUESTIONS_DATA.filter((q) => q.category === 'exam');
      case 'variant':
        return QUESTIONS_DATA.filter((q) => q.category === 'variant');
      case 'ox':
        return QUESTIONS_DATA.filter((q) => q.category === 'ox');
      case 'review':
        return QUESTIONS_DATA.filter((q) => reviewSetIds.has(q.id));
      default:
        return QUESTIONS_DATA;
    }
  }, [filter, reviewSetIds]);

  useEffect(() => {
    if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(0);
    }
  }, [filteredQuestions.length, currentIndex]);

  const currentQuestion = filteredQuestions[currentIndex] ?? null;

  // 집중 풀이 키보드 단축키 지원 (UI를 어지럽히지 않고 자연스럽게 동작)
  useEffect(() => {
    if (mode !== 'focus' || !currentQuestion || isOverlayOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex((prev) =>
          Math.min(filteredQuestions.length - 1, prev + 1)
        );
      } else if (
        currentQuestion.type === 'mcq' &&
        ['1', '2', '3', '4'].includes(e.key)
      ) {
        e.preventDefault();
        onSubmitAnswer(currentQuestion.id, Number(e.key));
      } else if (currentQuestion.type === 'ox') {
        if (e.key === 'o' || e.key === 'O') {
          e.preventDefault();
          onSubmitAnswer(currentQuestion.id, 'O');
        } else if (e.key === 'x' || e.key === 'X') {
          e.preventDefault();
          onSubmitAnswer(currentQuestion.id, 'X');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, currentQuestion, filteredQuestions.length, isOverlayOpen, onSubmitAnswer]);

  const totalSolved = Object.keys(answers).length;
  const totalCorrect = Object.values(answers).filter((a) => a.isCorrect).length;
  const accuracyPct =
    totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

  const handleExplainAI = (q: QuestionItem) => {
    const rec = answers[q.id];
    onTriggerInstantPrompt({
      title: `문항 ${q.id} 맞춤 해설 프롬프트`,
      subtitle: q.sourceTitle,
      prompt: buildQuestionExplainPrompt(q, rec?.selected),
    });
  };

  const handleVariantAI = (q: QuestionItem) => {
    onTriggerInstantPrompt({
      title: `문항 ${q.id} 변형문제 출제 프롬프트`,
      subtitle: q.sourceTitle,
      prompt: buildQuestionVariantPrompt(q),
    });
  };

  const toggleDrillCard = (cardId: number) => {
    setRevealedDrillIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  };

  const shuffleDrillCards = () => {
    setRevealedDrillIds([]);
    setDrillCards((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      {/* 간결하게 정돈된 상단 바 */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:px-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 좌측: 3가지 보기 방식 */}
          <div className="inline-flex bg-[#f1f5f9] p-1 rounded-lg border border-slate-200">
            {(
              [
                { id: 'focus', label: '한 문제씩 집중' },
                { id: 'list', label: '전체 연속 보기' },
                { id: 'drill', label: '핵심 빈칸 10선' },
              ] as const
            ).map((m) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`relative px-3.5 py-2 rounded-md text-sm font-bold transition-colors ${
                    active ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="cleanTrainerMode"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      className="absolute inset-0 bg-[#0f172a] rounded-md"
                    />
                  )}
                  <span className="relative z-10">{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* 우측: 풀이 현황 & 초기화 */}
          <div className="flex items-center gap-4 text-sm font-bold text-slate-600 tabular-nums">
            <span>
              풀이 <strong className="text-[#1e3a8a]">{totalSolved}/16</strong>
              {totalSolved > 0 && (
                <span className="ml-2 text-slate-500">
                  (정답률 {accuracyPct}%)
                </span>
              )}
            </span>

            {totalSolved > 0 && !confirmReset && (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="text-xs font-bold text-slate-400 hover:text-[#b91c1c] underline"
              >
                기록 초기화
              </button>
            )}
            {confirmReset && (
              <span className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onResetAllAnswers();
                    setConfirmReset(false);
                  }}
                  className="px-2.5 py-1 rounded text-xs font-extrabold bg-[#b91c1c] text-white"
                >
                  초기화 확인
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="text-xs font-bold text-slate-500"
                >
                  취소
                </button>
              </span>
            )}
          </div>
        </div>

        {/* 문항 유형 필터 */}
        {mode !== 'drill' && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
            {(
              [
                { id: 'all', label: '전체 16문항' },
                { id: 'exam', label: '발표 기출 (3)' },
                { id: 'variant', label: '실전 변형 (3)' },
                { id: 'ox', label: '핵심 O/X (10)' },
                { id: 'review', label: `오답·저장 (${reviewSetIds.size})` },
              ] as const
            ).map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setFilter(f.id);
                    setCurrentIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors tabular-nums ${
                    active
                      ? 'bg-[#eff6ff] text-[#1e3a8a] ring-1 ring-[#1e3a8a]'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ==================== 1. 한 문제씩 집중 풀이 ==================== */}
      {mode === 'focus' && (
        <>
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
              <p className="text-lg font-extrabold text-[#0f172a]">
                아직 오답이나 저장해 둔 문항이 없습니다.
              </p>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#0f172a] text-white"
              >
                전체 문항 보기
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {currentQuestion && (
                <QuestionSheet
                  key={currentQuestion.id}
                  question={currentQuestion}
                  record={answers[currentQuestion.id]}
                  isBookmarked={bookmarkedQuestions.includes(currentQuestion.id)}
                  onSubmit={(sel) => onSubmitAnswer(currentQuestion.id, sel)}
                  onRetry={() => onClearSingleAnswer(currentQuestion.id)}
                  onToggleBookmark={() =>
                    onToggleQuestionBookmark(currentQuestion.id)
                  }
                  onOpenExplainAI={() => handleExplainAI(currentQuestion)}
                  onOpenVariantAI={() => handleVariantAI(currentQuestion)}
                />
              )}

              {/* 하단 이전 / 문항 번호 / 다음 네비게이션 */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentIndex === 0}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold border border-slate-300 text-slate-700 hover:border-[#0f172a] disabled:opacity-35 disabled:pointer-events-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>이전 문제</span>
                </button>

                <div className="flex flex-wrap justify-center gap-1.5">
                  {filteredQuestions.map((q, idx) => {
                    const rec = answers[q.id];
                    const isCurrent = idx === currentIndex;
                    let pill = 'bg-slate-100 text-slate-600';
                    if (rec?.isCorrect) pill = 'bg-[#eff6ff] text-[#1e3a8a]';
                    else if (rec && !rec.isCorrect)
                      pill = 'bg-[#fef2f2] text-[#b91c1c]';

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-8 h-8 rounded-md text-xs font-extrabold tabular-nums transition-all ${pill} ${
                          isCurrent ? 'ring-2 ring-[#0f172a]' : ''
                        }`}
                      >
                        {q.id}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      Math.min(filteredQuestions.length - 1, prev + 1)
                    )
                  }
                  disabled={currentIndex >= filteredQuestions.length - 1}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] disabled:opacity-35 disabled:pointer-events-none"
                >
                  <span>다음 문제</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================== 2. 전체 연속 보기 ==================== */}
      {mode === 'list' && (
        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
              <p className="text-lg font-extrabold text-[#0f172a]">
                아직 오답이나 저장해 둔 문항이 없습니다.
              </p>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#0f172a] text-white"
              >
                전체 문항 보기
              </button>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <QuestionSheet
                key={q.id}
                question={q}
                record={answers[q.id]}
                isBookmarked={bookmarkedQuestions.includes(q.id)}
                onSubmit={(sel) => onSubmitAnswer(q.id, sel)}
                onRetry={() => onClearSingleAnswer(q.id)}
                onToggleBookmark={() => onToggleQuestionBookmark(q.id)}
                onOpenExplainAI={() => handleExplainAI(q)}
                onOpenVariantAI={() => handleVariantAI(q)}
              />
            ))
          )}
        </div>
      )}

      {/* ==================== 3. 핵심 빈칸 10선 ==================== */}
      {mode === 'drill' && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#1e3a8a] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="space-y-1">
              <span className="text-sm font-extrabold text-[#1e3a8a] block">
                시험 직전 숫자 · 주체 · 정족수 점검
              </span>
              <h2 className="text-2xl font-extrabold text-[#0f172a]">
                핵심 빈칸 10선 (문장을 눌러 밑줄 정답 확인)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setRevealedDrillIds(
                    revealedDrillIds.length === drillCards.length
                      ? []
                      : drillCards.map((c) => c.id)
                  )
                }
                className="px-3.5 py-2 rounded-lg text-sm font-bold border border-slate-300 text-slate-700 hover:border-[#0f172a]"
              >
                {revealedDrillIds.length === drillCards.length
                  ? '모두 가리기'
                  : '모두 펼치기'}
              </button>
              <button
                type="button"
                onClick={shuffleDrillCards}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-bold bg-[#0f172a] text-white hover:bg-[#1e3a8a]"
              >
                <Shuffle className="w-4 h-4" />
                <span>섞기</span>
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {drillCards.map((card, idx) => {
              const isRevealed = revealedDrillIds.includes(card.id);
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => toggleDrillCard(card.id)}
                  className={`w-full text-left rounded-xl p-5 sm:px-6 border transition-all space-y-2 ${
                    isRevealed
                      ? 'bg-[#eff6ff]/45 border-[#93c5fd]'
                      : 'bg-[#f8fafc] border-slate-200 hover:bg-white hover:border-[#1e3a8a]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 tabular-nums">
                    <span className="text-[#1e3a8a]">
                      {String(idx + 1).padStart(2, '0')} · {card.basis}
                    </span>
                    <span>{isRevealed ? '확인됨' : '클릭하여 정답 보기'}</span>
                  </div>

                  <p className="text-[16.5px] sm:text-[18px] font-semibold text-[#0f172a] leading-[1.68]">
                    {card.promptBefore}
                    {isRevealed ? (
                      <span className="key-underline mx-1">
                        {card.blankTarget}
                      </span>
                    ) : (
                      <span className="inline-block bg-white border border-dashed border-[#1e3a8a] text-[#1e3a8a] text-sm font-extrabold px-3 py-0.5 rounded mx-1">
                        빈칸 확인
                      </span>
                    )}
                    {card.promptAfter}
                  </p>

                  {isRevealed && (
                    <p className="text-sm font-semibold text-[#b91c1c] pt-1">
                      주의 : {card.trapNote}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
