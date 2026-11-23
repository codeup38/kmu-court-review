import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import { AICoachDrawer } from './components/AICoachDrawer';
import { CaseSimulatorView } from './components/CaseSimulatorView';
import { InstantPromptModal } from './components/InstantPromptModal';
import { SchemaView } from './components/SchemaView';
import { TrainerView } from './components/TrainerView';
import { useStudyStore } from './hooks/useStudyStore';
import {
  CoachPresetId,
  InstantPromptModalData,
  MainViewId,
} from './types';

const MAIN_TABS: { id: MainViewId; label: string }[] = [
  { id: 'schema', label: '개념 복습' },
  { id: 'trainer', label: '문제 풀이' },
  { id: 'case', label: '사례형 연습' },
];

export const App: React.FC = () => {
  const {
    state,
    submitAnswer,
    clearSingleAnswer,
    resetAllAnswers,
    setEssayDraft,
    setCoachCustomMemo,
    wrongCount,
  } = useStudyStore();

  const [activeView, setActiveView] = useState<MainViewId>('schema');
  const [focusedQuestionId, setFocusedQuestionId] = useState<number | null>(
    null
  );

  const [isCoachOpen, setIsCoachOpen] = useState<boolean>(false);
  const [coachPreset] = useState<CoachPresetId>('wrong-traps');
  const [instantPromptData, setInstantPromptData] =
    useState<InstantPromptModalData | null>(null);

  const handleNavigateToQuestion = useCallback((questionId: number) => {
    setFocusedQuestionId(questionId);
    setActiveView('trainer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateView = useCallback((view: MainViewId) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearFocusedQuestion = useCallback(() => {
    setFocusedQuestionId(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-[#0f172a]">
      {/* 상단 스티키 헤더 (PC 정중앙 3열 그리드 · 이름 제거) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[68px] py-2.5 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] gap-3">
            {/* 좌측 타이틀 */}
            <div className="justify-self-start min-w-0">
              <button
                type="button"
                onClick={() => handleNavigateView('schema')}
                className="text-left group"
              >
                <span className="block text-xs font-extrabold text-[#1e3a8a] mb-0.5">
                  헌법원리와제도
                </span>
                <h1 className="text-[15.5px] sm:text-lg font-extrabold text-[#0f172a] tracking-tight group-hover:text-[#1e3a8a] transition-colors truncate">
                  사법부 기출·사례 복습
                </h1>
              </button>
            </div>

            {/* 정중앙 3개 탭 (데스크톱) */}
            <nav
              aria-label="주요 학습 메뉴"
              className="hidden md:flex items-center justify-self-center bg-[#f1f5f9] p-1 rounded-xl border border-slate-200"
            >
              {MAIN_TABS.map((tab) => {
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleNavigateView(tab.id)}
                    className={`relative px-4 py-2 rounded-lg text-[15px] font-bold transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="headerMainTabIndicator"
                        transition={{
                          type: 'spring',
                          stiffness: 460,
                          damping: 36,
                        }}
                        className="absolute inset-0 bg-[#0f172a] rounded-lg"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* 우측: AI 질문 템플릿 버튼 */}
            <div className="justify-self-end shrink-0">
              <button
                type="button"
                onClick={() => setIsCoachOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-[#1e3a8a] text-white hover:bg-[#0f172a] transition-colors shadow-sm whitespace-nowrap"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>AI 질문 템플릿</span>
                {wrongCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[11px] font-extrabold bg-white/20 text-white tabular-nums">
                    {wrongCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* 모바일 3개 탭 바 */}
          <nav
            aria-label="모바일 학습 메뉴"
            className="grid grid-cols-3 md:hidden border-t border-slate-100 py-2 gap-1.5"
          >
            {MAIN_TABS.map((tab) => {
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNavigateView(tab.id)}
                  className={`py-2 rounded-lg text-sm font-bold text-center transition-colors ${
                    isActive
                      ? 'bg-[#0f172a] text-white'
                      : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 메인 본문 */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9">
        {activeView === 'schema' && (
          <SchemaView
            onNavigateToQuestion={handleNavigateToQuestion}
            onNavigateView={handleNavigateView}
          />
        )}

        {activeView === 'trainer' && (
          <TrainerView
            answers={state.answers}
            focusedQuestionId={focusedQuestionId}
            isOverlayOpen={isCoachOpen || instantPromptData !== null}
            onClearFocusedQuestion={handleClearFocusedQuestion}
            onSubmitAnswer={submitAnswer}
            onClearSingleAnswer={clearSingleAnswer}
            onResetAllAnswers={resetAllAnswers}
            onTriggerInstantPrompt={setInstantPromptData}
          />
        )}

        {activeView === 'case' && (
          <CaseSimulatorView
            essayDraft={state.essayDraft}
            onChangeEssayDraft={setEssayDraft}
            onTriggerInstantPrompt={setInstantPromptData}
          />
        )}
      </main>

      {/* 하단 푸터 (발표 자료 말미 크레딧 느낌으로 자연스럽게) */}
      <footer className="bg-white border-t border-slate-200 mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-slate-500">
          <span className="font-semibold">
            헌법원리와제도 · 사법부 기출·사례 복습
          </span>
          <div className="flex items-center gap-2 font-medium">
            <span className="text-slate-700 font-semibold">김시우</span>
            <span className="text-slate-300">|</span>
            <a
              href="mailto:codeup38@kookmin.ac.kr"
              className="hover:text-[#1e3a8a] hover:underline transition-colors"
            >
              codeup38@kookmin.ac.kr
            </a>
          </div>
        </div>
      </footer>

      <AICoachDrawer
        isOpen={isCoachOpen}
        initialPreset={coachPreset}
        state={state}
        wrongCount={wrongCount}
        onClose={() => setIsCoachOpen(false)}
        onChangeCustomMemo={setCoachCustomMemo}
      />

      <InstantPromptModal
        data={instantPromptData}
        onClose={() => setInstantPromptData(null)}
      />
    </div>
  );
};

export default App;
