import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText } from 'lucide-react';
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
  { id: 'schema', label: '구조와 경계' },
  { id: 'trainer', label: '문제 훈련' },
  { id: 'case', label: '사례형 시뮬레이터' },
];

export const App: React.FC = () => {
  const {
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
  } = useStudyStore();

  const [activeView, setActiveView] = useState<MainViewId>('schema');
  const [focusedQuestionId, setFocusedQuestionId] = useState<number | null>(
    null
  );

  const [isCoachOpen, setIsCoachOpen] = useState<boolean>(false);
  const [coachPreset, setCoachPreset] = useState<CoachPresetId>('wrong-traps');
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

  const handleOpenCoachWithPreset = useCallback((preset: CoachPresetId) => {
    setCoachPreset(preset);
    setIsCoachOpen(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-[#0f172a]">
      {/* 상단 스티키 헤더 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[70px] py-3 flex items-center justify-between gap-4">
            {/* 좌측 타이틀 */}
            <button
              type="button"
              onClick={() => handleNavigateView('schema')}
              className="text-left group"
            >
              <span className="block text-xs font-extrabold text-[#1e3a8a] mb-0.5">
                헌법원리와제도
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#0f172a] tracking-tight group-hover:text-[#1e3a8a] transition-colors">
                사법부 기출·사례 문제풀이
              </h1>
            </button>

            {/* 중앙 3개 메인 뷰 전환 탭 (데스크톱) */}
            <nav
              aria-label="학습 뷰 전환"
              className="hidden md:flex items-center bg-[#f1f5f9] p-1 rounded-xl border border-slate-200"
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
                          stiffness: 450,
                          damping: 35,
                        }}
                        className="absolute inset-0 bg-[#0f172a] rounded-lg"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* 우측 발표자 표기 + AI 복습 코치 */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <span className="hidden sm:inline-block text-sm font-semibold text-slate-600">
                발표자 &nbsp;|&nbsp;{' '}
                <strong className="text-[#0f172a] font-extrabold">김시우</strong>
              </span>

              <button
                type="button"
                onClick={() => setIsCoachOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold bg-[#1e3a8a] text-white hover:bg-[#0f172a] transition-colors shadow-sm"
              >
                <MessageSquareText className="w-4 h-4" />
                <span>AI 복습 코치</span>
                {coachBadgeCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md text-xs font-extrabold bg-white/20 text-white tabular-nums">
                    {coachBadgeCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* 모바일·태블릿 세로 뷰 전환 바 */}
          <nav
            aria-label="모바일 학습 뷰 전환"
            className="flex md:hidden items-center justify-between border-t border-slate-100 py-2 gap-1"
          >
            {MAIN_TABS.map((tab) => {
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNavigateView(tab.id)}
                  className={`relative flex-1 py-2 rounded-lg text-sm font-bold text-center transition-colors ${
                    isActive ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="mobileMainTabIndicator"
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 35,
                      }}
                      className="absolute inset-0 bg-[#0f172a] rounded-lg"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 메인 본문 (가독성 최적 폭 max-w-5xl & 넉넉한 여백) */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
        {activeView === 'schema' && (
          <SchemaView
            bookmarkedCases={state.bookmarkedCases}
            onToggleCaseBookmark={toggleCaseBookmark}
            onNavigateToQuestion={handleNavigateToQuestion}
            onNavigateView={handleNavigateView}
          />
        )}

        {activeView === 'trainer' && (
          <TrainerView
            answers={state.answers}
            bookmarkedQuestions={state.bookmarkedQuestions}
            focusedQuestionId={focusedQuestionId}
            isOverlayOpen={isCoachOpen || instantPromptData !== null}
            onClearFocusedQuestion={handleClearFocusedQuestion}
            onSubmitAnswer={submitAnswer}
            onClearSingleAnswer={clearSingleAnswer}
            onResetAllAnswers={resetAllAnswers}
            onToggleQuestionBookmark={toggleQuestionBookmark}
            onTriggerInstantPrompt={setInstantPromptData}
          />
        )}

        {activeView === 'case' && (
          <CaseSimulatorView
            essayDraft={state.essayDraft}
            onChangeEssayDraft={setEssayDraft}
            onOpenCoachWithPreset={handleOpenCoachWithPreset}
            onTriggerInstantPrompt={setInstantPromptData}
          />
        )}
      </main>

      {/* 하단 푸터 */}
      <footer className="bg-white border-t border-slate-200 mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between text-sm font-semibold text-slate-500">
          <span>헌법원리와제도 | 사법부 문제풀이</span>
          <span className="text-[#0f172a] font-extrabold">김시우</span>
        </div>
      </footer>

      <AICoachDrawer
        isOpen={isCoachOpen}
        initialPreset={coachPreset}
        state={state}
        wrongCount={wrongCount}
        bookmarkCount={bookmarkCount}
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
