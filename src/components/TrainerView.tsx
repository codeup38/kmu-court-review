import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  Eye,
  FileQuestion,
  Keyboard,
  ListChecks,
  MessageSquareText,
  RotateCcw,
  ScanSearch,
  Shuffle,
  XCircle,
  Zap,
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

function renderHighlightedText(
  text: string,
  wrongSpan?: string,
  enableXRay?: boolean
): React.ReactNode {
  if (!enableXRay || !wrongSpan) return text;
  const idx = text.indexOf(wrongSpan);
  if (idx === -1) return text;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + wrongSpan.length);
  const after = text.slice(idx + wrongSpan.length);

  return (
    <>
      {before}
      <span className="bg-[#fef2f2] text-[#b91c1c] line-through decoration-[#b91c1c] decoration-2 font-bold px-1 border-b border-[#fca5a5]">
        {match}
      </span>
      {after}
    </>
  );
}

interface QuestionCardProps {
  question: QuestionItem;
  record?: UserAnswerRecord;
  isBookmarked: boolean;
  onSubmit: (selected: number | 'O' | 'X') => void;
  onRetry: () => void;
  onToggleBookmark: () => void;
  onOpenExplainAI: () => void;
  onOpenVariantAI: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
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
    <article className="bg-white border border-[#cbd5e1] border-t-[3px] border-t-[#0f172a] p-6 md:p-8 shadow-sm">
      {/* 문항 상단 메타 */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#e2e8f0]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold bg-[#0f172a] text-white px-2.5 py-1 tabular-nums">
            {question.code}
          </span>
          <span className="text-xs font-extrabold text-[#1e3a8a] bg-[#eff6ff] border border-[#93c5fd] px-2.5 py-0.5">
            {question.sourceTitle}
          </span>
          {isGraded && (
            <span className="text-xs font-bold bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1] px-2 py-0.5">
              함정 유형: {question.trapTag}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleBookmark}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold border transition-colors ${
            isBookmarked
              ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
              : 'bg-[#f8fafc] text-[#475569] border-[#cbd5e1] hover:border-[#1e3a8a] hover:text-[#1e3a8a]'
          }`}
        >
          {isBookmarked ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>헷갈림 저장됨</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span>헷갈림 저장</span>
            </>
          )}
        </button>
      </div>

      {/* 질문 본문 */}
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-extrabold text-[#0f172a] leading-relaxed">
          {question.type === 'ox' && isGraded && question.answer === 'X'
            ? renderHighlightedText(
                question.stem,
                question.xrayPoints[0]?.wrongSpan,
                true
              )
            : question.stem}
        </h3>
      </div>

      {/* 선지 영역: 4지선다 vs O/X */}
      {question.type === 'mcq' && question.choices ? (
        <div className="space-y-2.5">
          {question.choices.map((choiceText, idx) => {
            const choiceNum = idx + 1;
            const isSelected = record?.selected === choiceNum;
            const isCorrectAnswer = question.answer === choiceNum;
            const xrayForChoice = question.xrayPoints.find(
              (x) => x.choiceNum === choiceNum
            );

            let cardStyle =
              'bg-[#f8fafc] border-[#cbd5e1] hover:bg-white hover:border-[#1e3a8a] text-[#0f172a]';
            if (isGraded) {
              if (isCorrectAnswer) {
                cardStyle =
                  'bg-[#eff6ff] border-[#1e3a8a] border-l-4 text-[#0f172a] shadow-sm';
              } else if (isSelected && !isCorrectAnswer) {
                cardStyle =
                  'bg-[#fef2f2] border-[#b91c1c] border-l-4 text-[#0f172a]';
              } else {
                cardStyle = 'bg-white border-[#e2e8f0] text-[#334155]';
              }
            }

            return (
              <button
                key={choiceNum}
                type="button"
                onClick={() => onSubmit(choiceNum)}
                className={`w-full text-left p-4 border transition-all flex items-baseline gap-3.5 ${cardStyle}`}
              >
                <span
                  className={`text-base font-extrabold shrink-0 tabular-nums ${
                    isGraded && isCorrectAnswer
                      ? 'text-[#1e3a8a]'
                      : isGraded && isSelected && !isCorrectAnswer
                      ? 'text-[#b91c1c]'
                      : 'text-[#1e3a8a]'
                  }`}
                >
                  {CIRCLE_NUMS[idx]}
                </span>
                <div className="flex-1 space-y-1.5">
                  <p className="text-[15px] md:text-base leading-relaxed font-medium">
                    {renderHighlightedText(
                      choiceText,
                      xrayForChoice?.wrongSpan,
                      isGraded
                    )}
                  </p>
                  {isGraded && (isCorrectAnswer || isSelected) && (
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      {isCorrectAnswer && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-[#1e3a8a] text-white px-2 py-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          정답 선지
                        </span>
                      )}
                      {isSelected && !isCorrectAnswer && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-[#b91c1c] text-white px-2 py-0.5">
                          <XCircle className="w-3 h-3" />
                          내가 선택한 오답
                        </span>
                      )}
                      {isSelected && isCorrectAnswer && (
                        <span className="text-[11px] font-extrabold text-[#0f766e]">
                          내 선택 일치
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
            const isCorrectAnswer = question.answer === oxVal;

            let btnStyle =
              'bg-[#f8fafc] border-[#cbd5e1] hover:bg-white hover:border-[#1e3a8a] text-[#0f172a]';
            if (isGraded) {
              if (isCorrectAnswer) {
                btnStyle =
                  'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a] shadow-sm';
              } else if (isSelected && !isCorrectAnswer) {
                btnStyle = 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]';
              } else {
                btnStyle = 'bg-white border-[#e2e8f0] text-[#94a3b8]';
              }
            }

            return (
              <button
                key={oxVal}
                type="button"
                onClick={() => onSubmit(oxVal)}
                className={`py-4 px-5 border font-extrabold transition-all flex items-center justify-center gap-3 ${btnStyle}`}
              >
                <span className="text-2xl tabular-nums">{oxVal}</span>
                <span className="text-sm font-bold">
                  {oxVal === 'O' ? '옳은 지문' : '틀린 지문'}
                </span>
                {isGraded && isCorrectAnswer && (
                  <span className="text-[11px] font-extrabold bg-[#1e3a8a] text-white px-2 py-0.5">
                    정답
                  </span>
                )}
                {isGraded && isSelected && !isCorrectAnswer && (
                  <span className="text-[11px] font-extrabold bg-[#b91c1c] text-white px-2 py-0.5">
                    내 선택
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 채점 완료 시 오픈: 정답 배지 + 함정 X-Ray + 명쾌한 해설 + 원클릭 AI 액션 */}
      <AnimatePresence>
        {isGraded && record && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-6 pt-6 border-t-2 border-[#0f172a] space-y-4"
          >
            {/* 채점 결과 헤더 바 */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                {record.isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold bg-[#0f766e] text-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    정답입니다
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold bg-[#b91c1c] text-white">
                    <XCircle className="w-3.5 h-3.5" />
                    오답 — 출제 함정 주의
                  </span>
                )}
                <span className="text-sm font-extrabold text-[#0f172a] tabular-nums">
                  정답:{' '}
                  {question.type === 'mcq'
                    ? `${CIRCLE_NUMS[Number(question.answer) - 1]} (${question.answer}번)`
                    : question.answer}
                </span>
                <span className="text-xs font-semibold text-[#64748b]">
                  근거: {question.referenceBasis}
                </span>
              </div>

              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#64748b] hover:text-[#0f172a] border border-[#cbd5e1] bg-[#f8fafc]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>다시 풀기</span>
              </button>
            </div>

            {/* 함정 X-Ray 해부 패널 */}
            <div className="bg-[#f8fafc] border border-[#cbd5e1] p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0f172a]">
                  <ScanSearch className="w-4 h-4 text-[#b91c1c]" />
                  함정 X-Ray : 출제자가 비튼 구절 vs 올바른 법리 교정
                </span>
                <span className="text-[11px] font-extrabold text-[#b91c1c] bg-[#fef2f2] border border-[#fca5a5] px-2 py-0.5">
                  {question.trapTag}
                </span>
              </div>

              <div className="space-y-2.5">
                {question.xrayPoints.map((xr, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#e2e8f0] p-3.5 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        {xr.choiceNum && (
                          <span className="font-extrabold text-[#0f172a] tabular-nums">
                            선지 {CIRCLE_NUMS[xr.choiceNum - 1]}
                          </span>
                        )}
                        <span className="font-extrabold px-2 py-0.5 bg-[#fef2f2] text-[#b91c1c] border border-[#fca5a5]">
                          {xr.trapType}
                        </span>
                      </div>
                      <span className="font-bold text-[#475569] tabular-nums">
                        {xr.basis}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs md:text-[13px]">
                      <div className="bg-[#fef2f2]/80 border border-[#fca5a5] p-2.5">
                        <span className="font-extrabold text-[#b91c1c] block mb-0.5">
                          비튼 함정 표현 (X)
                        </span>
                        <span className="text-[#0f172a] line-through decoration-[#b91c1c]">
                          {xr.wrongSpan}
                        </span>
                      </div>
                      <div className="bg-[#eff6ff] border border-[#93c5fd] p-2.5">
                        <span className="font-extrabold text-[#1e3a8a] block mb-0.5">
                          올바른 교정 표현 (O)
                        </span>
                        <span className="text-[#0f172a] font-bold">{xr.rightSpan}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 명쾌한 해설 카드 */}
            <div className="bg-white border border-[#cbd5e1] border-l-4 border-l-[#1e3a8a] p-4">
              <div className="text-xs font-extrabold text-[#1e3a8a] mb-1">핵심 해설</div>
              <p className="text-sm text-[#1e293b] leading-relaxed">
                {question.explanation}
              </p>
            </div>

            {/* 문항 하단 원클릭 액션 버튼 3종 */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onToggleBookmark}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold border transition-colors ${
                  isBookmarked
                    ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                    : 'bg-white text-[#334155] border-[#cbd5e1] hover:border-[#1e3a8a] hover:text-[#1e3a8a]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isBookmarked ? '헷갈림 저장됨' : '헷갈림 저장'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenExplainAI}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] transition-colors"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>내가 고른 선지 왜 헷갈렸는지 AI 설명 듣기</span>
              </button>

              <button
                type="button"
                onClick={onOpenVariantAI}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold bg-[#eff6ff] text-[#1e3a8a] border border-[#93c5fd] hover:bg-[#1e3a8a] hover:text-white transition-colors"
              >
                <FileQuestion className="w-3.5 h-3.5" />
                <span>이 쟁점 변형문제 AI에게 더 받아 풀기</span>
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

  // Speed Drill state
  const [drillCards, setDrillCards] = useState<SpeedDrillCard[]>(SPEED_DRILL_CARDS);
  const [revealedDrillIds, setRevealedDrillIds] = useState<number[]>([]);

  // 외부 뷰(구조와 경계 등)에서 특정 문항 바로가기로 진입했을 때
  useEffect(() => {
    if (focusedQuestionId !== null) {
      setMode('focus');
      setFilter('all');
      const idx = QUESTIONS_DATA.findIndex((q) => q.id === focusedQuestionId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
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

  // 집중 풀이 키보드 단축키 (1~4, O/X, ←/→)
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
      } else if (currentQuestion.type === 'mcq' && ['1', '2', '3', '4'].includes(e.key)) {
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

  // 전체 진행률 계산
  const totalSolved = Object.keys(answers).length;
  const totalCorrect = Object.values(answers).filter((a) => a.isCorrect).length;
  const accuracyPct =
    totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

  const handleExplainAI = (q: QuestionItem) => {
    const rec = answers[q.id];
    const prompt = buildQuestionExplainPrompt(q, rec?.selected);
    onTriggerInstantPrompt({
      title: `${q.code} 맞춤 함정 해설 프롬프트`,
      subtitle: `${q.sourceTitle} · 내가 고른 선지와 핵심 법리 경계 비교`,
      prompt,
    });
  };

  const handleVariantAI = (q: QuestionItem) => {
    const prompt = buildQuestionVariantPrompt(q);
    onTriggerInstantPrompt({
      title: `${q.code} 동일 쟁점 실전 변형문제 프롬프트`,
      subtitle: `${q.sourceTitle} · 대화형 1문제씩 추가 출제`,
      prompt,
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
      {/* ==================== 상단 컨트롤 바 ==================== */}
      <section className="bg-white border border-[#cbd5e1] border-t-[3px] border-t-[#0f172a] p-4 md:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* 뷰 모드 스위처 */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#f8fafc] p-1 border border-[#cbd5e1]">
            {(
              [
                { id: 'focus', label: '집중 풀이', icon: Eye },
                { id: 'list', label: '전체 목록', icon: ListChecks },
                { id: 'drill', label: '1분 스피드 빈칸 드릴', icon: Zap },
              ] as const
            ).map((m) => {
              const Icon = m.icon;
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`relative px-3.5 py-2 text-xs md:text-sm font-extrabold transition-colors flex items-center gap-1.5 ${
                    active ? 'text-white' : 'text-[#475569] hover:text-[#0f172a]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="trainerModePill"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      className="absolute inset-0 bg-[#0f172a]"
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* 우측 진행률 바 + [기록 초기화] */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-[#f8fafc] border border-[#cbd5e1] px-3.5 py-2">
              <div className="text-xs font-extrabold text-[#0f172a] tabular-nums">
                완료 <span className="text-[#1e3a8a]">{totalSolved}/16</span> · 정답률{' '}
                <span className="text-[#1e3a8a]">{accuracyPct}%</span>
              </div>
              <div className="w-24 h-2 bg-[#e2e8f0] overflow-hidden hidden sm:block">
                <div
                  className="h-full bg-[#1e3a8a] transition-all duration-300"
                  style={{ width: `${(totalSolved / 16) * 100}%` }}
                />
              </div>
            </div>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                disabled={totalSolved === 0}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-[#cbd5e1] bg-white text-[#475569] hover:text-[#b91c1c] hover:border-[#fca5a5] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>기록 초기화</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onResetAllAnswers();
                    setConfirmReset(false);
                  }}
                  className="px-2.5 py-2 text-xs font-extrabold bg-[#b91c1c] text-white"
                >
                  초기화 확인
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-2 text-xs font-bold border border-[#cbd5e1] bg-white text-[#475569]"
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 카테고리 필터 (스피드 드릴 모드가 아닐 때 표시) */}
        {mode !== 'drill' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e2e8f0]">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: '전체 (16)' },
                  { id: 'exam', label: '발표 기출 (3)' },
                  { id: 'variant', label: '실전 변형 (3)' },
                  { id: 'ox', label: '핵심 O/X (10)' },
                  { id: 'review', label: `오답·북마크만 (${reviewSetIds.size})` },
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
                    className={`px-3 py-1.5 text-xs font-extrabold border transition-colors tabular-nums ${
                      active
                        ? 'bg-[#eff6ff] text-[#1e3a8a] border-[#1e3a8a]'
                        : 'bg-white text-[#475569] border-[#cbd5e1] hover:border-[#94a3b8] hover:text-[#0f172a]'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {mode === 'focus' && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748b]">
                <Keyboard className="w-3.5 h-3.5 text-[#1e3a8a]" />
                <span>
                  단축키 지원: 선지 <strong className="text-[#0f172a]">1~4</strong> ·{' '}
                  <strong className="text-[#0f172a]">O / X</strong> · 이동{' '}
                  <strong className="text-[#0f172a]">← / →</strong>
                </span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ==================== MODE 1 : 집중 풀이 ==================== */}
      {mode === 'focus' && (
        <>
          {filteredQuestions.length === 0 ? (
            <div className="bg-white border border-[#cbd5e1] p-10 text-center space-y-3">
              <p className="text-base font-extrabold text-[#0f172a]">
                현재 오답 또는 북마크된 문항이 없습니다.
              </p>
              <p className="text-sm text-[#64748b]">
                문제를 풀며 틀리거나 [헷갈림 저장]을 누른 문항이 이곳에 자동으로 모입니다.
              </p>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="px-4 py-2 text-xs font-extrabold bg-[#0f172a] text-white"
              >
                전체 16문항 보기로 전환
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 문항 번호 빠른 이동 스트립 */}
              <div className="bg-white border border-[#cbd5e1] p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {filteredQuestions.map((q, idx) => {
                    const rec = answers[q.id];
                    const isCurrent = idx === currentIndex;
                    const isMarked = bookmarkedQuestions.includes(q.id);

                    let dotClass =
                      'bg-[#f8fafc] text-[#475569] border-[#cbd5e1] hover:border-[#1e3a8a]';
                    if (rec?.isCorrect) {
                      dotClass = 'bg-[#eff6ff] text-[#1e3a8a] border-[#93c5fd]';
                    } else if (rec && !rec.isCorrect) {
                      dotClass = 'bg-[#fef2f2] text-[#b91c1c] border-[#fca5a5]';
                    }
                    if (isCurrent) {
                      dotClass += ' ring-2 ring-[#0f172a] font-extrabold';
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`relative w-9 h-8 text-xs font-bold border transition-all tabular-nums ${dotClass}`}
                      >
                        {q.code}
                        {isMarked && (
                          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#1e3a8a]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 이전 / 다음 버튼 */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold border border-[#cbd5e1] bg-white text-[#0f172a] hover:border-[#1e3a8a] disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>이전</span>
                  </button>
                  <span className="text-xs font-extrabold text-[#475569] px-2 tabular-nums">
                    {currentIndex + 1} / {filteredQuestions.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        Math.min(filteredQuestions.length - 1, prev + 1)
                      )
                    }
                    disabled={currentIndex >= filteredQuestions.length - 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold border border-[#cbd5e1] bg-white text-[#0f172a] hover:border-[#1e3a8a] disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <span>다음</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {currentQuestion && (
                <QuestionCard
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
            </div>
          )}
        </>
      )}

      {/* ==================== MODE 2 : 전체 목록 연속 풀이 ==================== */}
      {mode === 'list' && (
        <div className="space-y-5">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white border border-[#cbd5e1] p-10 text-center space-y-3">
              <p className="text-base font-extrabold text-[#0f172a]">
                현재 오답 또는 북마크된 문항이 없습니다.
              </p>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="px-4 py-2 text-xs font-extrabold bg-[#0f172a] text-white"
              >
                전체 16문항 보기
              </button>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <QuestionCard
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

      {/* ==================== MODE 3 : 1분 스피드 빈칸 드릴 ==================== */}
      {mode === 'drill' && (
        <section className="bg-white border border-[#cbd5e1] border-t-[3px] border-t-[#1e3a8a] p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
            <div>
              <span className="text-xs font-extrabold text-[#1e3a8a] block mb-1">
                시험 직전 60초 점검 · 핵심 숫자·주체·정족수 10선
              </span>
              <h2 className="text-xl font-extrabold text-[#0f172a]">
                1분 스피드 빈칸 드릴 (카드를 탭하여 정답 확인)
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold text-[#475569] mr-1 tabular-nums">
                확인 {revealedDrillIds.length} / {drillCards.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setRevealedDrillIds(
                    revealedDrillIds.length === drillCards.length
                      ? []
                      : drillCards.map((c) => c.id)
                  )
                }
                className="px-3 py-1.5 text-xs font-extrabold border border-[#cbd5e1] bg-[#f8fafc] text-[#0f172a] hover:border-[#1e3a8a]"
              >
                {revealedDrillIds.length === drillCards.length
                  ? '모두 다시 가리기'
                  : '전체 정답 펼치기'}
              </button>
              <button
                type="button"
                onClick={shuffleDrillCards}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a]"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>순서 섞기</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drillCards.map((card, idx) => {
              const isRevealed = revealedDrillIds.includes(card.id);
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => toggleDrillCard(card.id)}
                  className={`text-left p-5 border transition-all flex flex-col justify-between gap-4 ${
                    isRevealed
                      ? 'bg-[#eff6ff]/60 border-[#1e3a8a] border-l-4 shadow-sm'
                      : 'bg-[#f8fafc] border-[#cbd5e1] hover:bg-white hover:border-[#1e3a8a]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-xs font-extrabold text-[#1e3a8a] tabular-nums">
                        드릴 {String(idx + 1).padStart(2, '0')} · {card.category}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 border ${
                          isRevealed
                            ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                            : 'bg-white text-[#64748b] border-[#cbd5e1]'
                        }`}
                      >
                        {isRevealed ? '정답 공개됨' : '탭하여 확인'}
                      </span>
                    </div>

                    <p className="text-[15px] font-bold text-[#0f172a] leading-relaxed">
                      {card.promptBefore}
                      {isRevealed ? (
                        <span className="inline-block bg-[#1e3a8a] text-white font-extrabold px-2 py-0.5 mx-0.5">
                          {card.blankTarget}
                        </span>
                      ) : (
                        <span className="inline-block bg-white border border-dashed border-[#1e3a8a] text-[#1e3a8a] font-extrabold px-3 py-0.5 mx-0.5">
                          ? 빈칸 정답 확인
                        </span>
                      )}
                      {card.promptAfter}
                    </p>
                  </div>

                  {isRevealed && (
                    <div className="pt-2.5 border-t border-[#cbd5e1] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-[#b91c1c]">
                        주의 함정: {card.trapNote}
                      </span>
                      <span className="font-semibold text-[#475569] tabular-nums">
                        {card.basis}
                      </span>
                    </div>
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
