import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { QUESTIONS_DATA } from '../data/questionsData';
import {
  InstantPromptModalData,
  QuestionItem,
  UserAnswerRecord,
} from '../types';
import {
  buildQuestionExplainPrompt,
  buildQuestionVariantPrompt,
} from '../utils/promptEngine';

type FilterKey = 'all' | 'exam' | 'variant' | 'ox' | 'wrong';
type ViewMode = 'single' | 'list';

interface TrainerViewProps {
  answers: Record<number, UserAnswerRecord>;
  focusedQuestionId: number | null;
  isOverlayOpen: boolean;
  onClearFocusedQuestion: () => void;
  onSubmitAnswer: (questionId: number, selected: number | 'O' | 'X') => void;
  onClearSingleAnswer: (questionId: number) => void;
  onResetAllAnswers: () => void;
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
  onSubmit: (selected: number | 'O' | 'X') => void;
  onRetry: () => void;
  onOpenExplainAI: () => void;
  onOpenVariantAI: () => void;
}

const QuestionSheet: React.FC<QuestionSheetProps> = ({
  question,
  record,
  onSubmit,
  onRetry,
  onOpenExplainAI,
  onOpenVariantAI,
}) => {
  const isGraded = Boolean(record);

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-11 shadow-sm">
      {/* 출처 헤더 */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-extrabold bg-[#0f172a] text-white px-3 py-1 rounded-md tabular-nums">
            문항 {question.id}
          </span>
          <span className="text-[15px] sm:text-base font-bold text-[#1e3a8a]">
            {question.sourceTitle}
          </span>
        </div>

        {isGraded && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-[#0f172a]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 풀기</span>
          </button>
        )}
      </div>

      {/* 질문 본문 (시원하게 확대) */}
      <h3 className="text-xl sm:text-[23.5px] font-extrabold text-[#0f172a] leading-[1.52] mb-8">
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
        <div className="space-y-3.5">
          {question.choices.map((choiceText, idx) => {
            const choiceNum = idx + 1;
            const isSelected = record?.selected === choiceNum;
            const isAnswer = question.answer === choiceNum;
            const xray = question.xrayPoints.find(
              (x) => x.choiceNum === choiceNum
            );

            let boxStyle =
              'bg-white border-slate-200/95 hover:border-[#1e3a8a] hover:bg-slate-50/70 text-[#0f172a]';
            if (isGraded) {
              if (isAnswer) {
                boxStyle =
                  'bg-[#eff6ff]/70 border-2 border-[#1e3a8a] text-[#0f172a] shadow-sm';
              } else if (isSelected && !isAnswer) {
                boxStyle =
                  'bg-[#fef2f2]/75 border-2 border-[#b91c1c] text-[#0f172a]';
              } else {
                boxStyle = 'bg-slate-50/50 border-slate-200/70 text-slate-500';
              }
            }

            return (
              <button
                key={choiceNum}
                type="button"
                onClick={() => onSubmit(choiceNum)}
                className={`w-full text-left rounded-xl px-5 py-4 sm:py-5 border transition-all flex items-baseline gap-3.5 sm:gap-4 ${boxStyle}`}
              >
                <span
                  className={`text-lg sm:text-[20px] font-extrabold shrink-0 tabular-nums ${
                    isGraded && isSelected && !isAnswer
                      ? 'text-[#b91c1c]'
                      : isGraded && !isAnswer
                      ? 'text-slate-400'
                      : 'text-[#1e3a8a]'
                  }`}
                >
                  {CIRCLE_NUMS[idx]}
                </span>
                <div className="flex-1 space-y-2">
                  <p className="text-[17px] sm:text-[18.5px] leading-[1.7] font-medium">
                    {renderInlineStrike(choiceText, xray?.wrongSpan, isGraded)}
                  </p>
                  {isGraded && (isAnswer || isSelected) && (
                    <div className="flex items-center gap-2 pt-0.5 text-xs font-extrabold">
                      {isAnswer && (
                        <span className="bg-[#1e3a8a] text-white px-2.5 py-0.5 rounded-md">
                          정답
                        </span>
                      )}
                      {isSelected && !isAnswer && (
                        <span className="bg-[#b91c1c] text-white px-2.5 py-0.5 rounded-md">
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
              'bg-white border-slate-200/95 hover:border-[#1e3a8a] hover:bg-slate-50/70 text-[#0f172a]';
            if (isGraded) {
              if (isAnswer) {
                btnStyle =
                  'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a] shadow-sm';
              } else if (isSelected && !isAnswer) {
                btnStyle =
                  'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]';
              } else {
                btnStyle = 'bg-slate-50/60 border-slate-200 text-slate-400';
              }
            }

            return (
              <button
                key={oxVal}
                type="button"
                onClick={() => onSubmit(oxVal)}
                className={`rounded-xl py-5 sm:py-6 px-4 sm:px-6 border transition-all flex items-center justify-center gap-3 ${btnStyle}`}
              >
                <span className="text-2xl sm:text-3xl font-extrabold tabular-nums">
                  {oxVal}
                </span>
                <span className="text-[17px] sm:text-lg font-bold">
                  {oxVal === 'O' ? '옳다' : '틀리다'}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 채점 해설 영역 (과도한 박스를 줄이고 에메랄드/크림슨 강약으로 정돈) */}
      {isGraded && record && (
        <div className="mt-9 pt-8 border-t-2 border-slate-900 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`px-3.5 py-1 rounded-md text-sm sm:text-[15px] font-extrabold text-white ${
                record.isCorrect ? 'bg-emerald-700' : 'bg-[#b91c1c]'
              }`}
            >
              {record.isCorrect ? '정답입니다' : '오답입니다'}
            </span>
            <span className="text-lg sm:text-[19px] font-extrabold text-[#0f172a] tabular-nums">
              정답 :{' '}
              {question.type === 'mcq'
                ? `${CIRCLE_NUMS[Number(question.answer) - 1]}번`
                : question.answer}
            </span>
          </div>

          <div className="space-y-2.5">
            <p className="text-[17.5px] sm:text-[18.5px] text-slate-800 leading-[1.8]">
              {question.explanation}
            </p>
            <p className="text-[15px] font-semibold text-slate-500 tabular-nums">
              근거 : {question.referenceBasis}
            </p>
          </div>

          {(question.type === 'mcq' || question.answer === 'X') && (
            <div className="rounded-xl bg-[#fef2f2]/65 border-l-4 border-l-[#b91c1c] px-5 py-4 space-y-2.5">
              <div className="text-sm font-extrabold text-[#991b1b]">
                출제 함정 대조 · {question.trapTag}
              </div>
              <div className="space-y-2 text-[16.5px] sm:text-[17.5px] leading-relaxed">
                {question.xrayPoints.map((xr, idx) => (
                  <div key={idx} className="text-[#0f172a]">
                    {xr.choiceNum && (
                      <strong className="font-extrabold mr-2 tabular-nums">
                        선지 {CIRCLE_NUMS[xr.choiceNum - 1]}
                      </strong>
                    )}
                    <del className="err-strike">{xr.wrongSpan}</del>
                    <span className="mx-2 text-slate-400 font-bold">→</span>
                    <strong className="font-extrabold text-[#1e3a8a]">
                      {xr.rightSpan}
                    </strong>
                    <span className="text-sm font-semibold text-slate-500 ml-2 tabular-nums">
                      ({xr.basis})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenExplainAI}
              className="px-4 py-2.5 rounded-xl text-[15px] font-bold bg-[#0f172a] text-white hover:bg-[#1e3a8a] transition-colors"
            >
              이 문제 AI에게 질문하기
            </button>
            <button
              type="button"
              onClick={onOpenVariantAI}
              className="px-4 py-2.5 rounded-xl text-[15px] font-bold bg-[#eff6ff] text-[#1e3a8a] border border-[#93c5fd] hover:bg-[#1e3a8a] hover:text-white transition-colors"
            >
              비슷한 변형문제 더 풀기
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export const TrainerView: React.FC<TrainerViewProps> = ({
  answers,
  focusedQuestionId,
  isOverlayOpen,
  onClearFocusedQuestion,
  onSubmitAnswer,
  onClearSingleAnswer,
  onResetAllAnswers,
  onTriggerInstantPrompt,
}) => {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  useEffect(() => {
    if (focusedQuestionId !== null) {
      setViewMode('single');
      setFilter('all');
      const idx = QUESTIONS_DATA.findIndex((q) => q.id === focusedQuestionId);
      if (idx !== -1) setCurrentIndex(idx);
      onClearFocusedQuestion();
    }
  }, [focusedQuestionId, onClearFocusedQuestion]);

  const wrongIds = useMemo(() => {
    return Object.entries(answers)
      .filter(([, rec]) => !rec.isCorrect)
      .map(([id]) => Number(id));
  }, [answers]);

  const filteredQuestions = useMemo(() => {
    switch (filter) {
      case 'exam':
        return QUESTIONS_DATA.filter((q) => q.category === 'exam');
      case 'variant':
        return QUESTIONS_DATA.filter((q) => q.category === 'variant');
      case 'ox':
        return QUESTIONS_DATA.filter((q) => q.category === 'ox');
      case 'wrong':
        return QUESTIONS_DATA.filter((q) => wrongIds.includes(q.id));
      default:
        return QUESTIONS_DATA;
    }
  }, [filter, wrongIds]);

  useEffect(() => {
    if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(0);
    }
  }, [filteredQuestions.length, currentIndex]);

  const currentQuestion = filteredQuestions[currentIndex] ?? null;

  useEffect(() => {
    if (viewMode !== 'single' || !currentQuestion || isOverlayOpen) return;

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
  }, [
    viewMode,
    currentQuestion,
    filteredQuestions.length,
    isOverlayOpen,
    onSubmitAnswer,
  ]);

  const totalSolved = Object.keys(answers).length;

  const handleOpenExplainAI = (q: QuestionItem) => {
    const rec = answers[q.id];
    onTriggerInstantPrompt({
      title: `문항 ${q.id} — AI에게 비교 설명 듣기`,
      subtitle: q.sourceTitle,
      placeholder:
        '예: 내가 왜 이 선지를 골랐는지, 특히 헷갈리는 부분이 있다면 적어보세요 (선택)',
      buildPrompt: (userNote: string) =>
        buildQuestionExplainPrompt(q, rec?.selected, userNote),
    });
  };

  const handleOpenVariantAI = (q: QuestionItem) => {
    onTriggerInstantPrompt({
      title: `문항 ${q.id} — 같은 쟁점 변형문제 더 풀기`,
      subtitle: q.sourceTitle,
      placeholder:
        '예: 정족수나 주체 바꾸기 함정 위주로 O/X 문제를 더 풀고 싶어 (선택)',
      buildPrompt: (userNote: string) =>
        buildQuestionVariantPrompt(q, userNote),
    });
  };

  return (
    <div className="space-y-6">
      {/* 단일 컨트롤 바 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:px-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', label: '전체 16' },
              { id: 'exam', label: '발표 기출 3' },
              { id: 'variant', label: '실전 변형 3' },
              { id: 'ox', label: '핵심 O/X 10' },
              ...(wrongIds.length > 0
                ? [{ id: 'wrong' as const, label: `틀린 문제 ${wrongIds.length}` }]
                : []),
            ] as { id: FilterKey; label: string }[]
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
                className={`px-4 py-2 rounded-xl text-[15px] font-bold transition-colors tabular-nums ${
                  active
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3.5 text-[15px] font-bold text-slate-600 tabular-nums border-t md:border-t-0 border-slate-100 pt-2.5 md:pt-0">
          <button
            type="button"
            onClick={() =>
              setViewMode((prev) => (prev === 'single' ? 'list' : 'single'))
            }
            className="text-sm sm:text-[15px] font-bold text-[#1e3a8a] hover:underline"
          >
            {viewMode === 'single' ? '전체 펼쳐보기' : '한 문제씩 보기'}
          </button>

          <span className="text-slate-300">|</span>

          <span>
            풀이 <strong className="text-[#0f172a]">{totalSolved}/16</strong>
          </span>

          {totalSolved > 0 && !confirmReset && (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="text-xs font-bold text-slate-400 hover:text-[#b91c1c] underline"
            >
              초기화
            </button>
          )}
          {confirmReset && (
            <span className="inline-flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onResetAllAnswers();
                  setFilter('all');
                  setConfirmReset(false);
                }}
                className="px-2.5 py-1 rounded text-xs font-extrabold bg-[#b91c1c] text-white"
              >
                확인
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-xs text-slate-500"
              >
                취소
              </button>
            </span>
          )}
        </div>
      </div>

      {/* 한 문제씩 보기 */}
      {viewMode === 'single' && (
        <div className="space-y-5">
          {currentQuestion && (
            <QuestionSheet
              key={currentQuestion.id}
              question={currentQuestion}
              record={answers[currentQuestion.id]}
              onSubmit={(sel) => onSubmitAnswer(currentQuestion.id, sel)}
              onRetry={() => onClearSingleAnswer(currentQuestion.id)}
              onOpenExplainAI={() => handleOpenExplainAI(currentQuestion)}
              onOpenVariantAI={() => handleOpenVariantAI(currentQuestion)}
            />
          )}

          {/* 정중앙 3열 페이지네이션 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="justify-self-start">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[15px] font-bold border border-slate-300 text-slate-700 hover:border-[#0f172a] disabled:opacity-35 disabled:pointer-events-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>이전</span>
                </button>
              </div>

              <div className="justify-self-center text-base font-extrabold text-[#0f172a] tabular-nums">
                {currentIndex + 1} / {filteredQuestions.length}
              </div>

              <div className="justify-self-end">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      Math.min(filteredQuestions.length - 1, prev + 1)
                    )
                  }
                  disabled={currentIndex >= filteredQuestions.length - 1}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[15px] font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] disabled:opacity-35 disabled:pointer-events-none"
                >
                  <span>다음</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 pt-3 border-t border-slate-100">
              {filteredQuestions.map((q, idx) => {
                const rec = answers[q.id];
                const isCurrent = idx === currentIndex;
                let pill = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                if (rec?.isCorrect)
                  pill = 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200';
                else if (rec && !rec.isCorrect)
                  pill = 'bg-[#fef2f2] text-[#b91c1c] ring-1 ring-[#fca5a5]';

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-9 h-9 rounded-lg text-xs sm:text-sm font-extrabold tabular-nums transition-all ${pill} ${
                      isCurrent ? '!ring-2 !ring-[#0f172a]' : ''
                    }`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 전체 펼쳐보기 */}
      {viewMode === 'list' && (
        <div className="space-y-7">
          {filteredQuestions.map((q) => (
            <QuestionSheet
              key={q.id}
              question={q}
              record={answers[q.id]}
              onSubmit={(sel) => onSubmitAnswer(q.id, sel)}
              onRetry={() => onClearSingleAnswer(q.id)}
              onOpenExplainAI={() => handleOpenExplainAI(q)}
              onOpenVariantAI={() => handleOpenVariantAI(q)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
