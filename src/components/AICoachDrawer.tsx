import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  X,
} from 'lucide-react';
import { CoachPresetId, StudyState } from '../types';
import {
  buildCoachPresetPrompt,
  FALLBACK_TUTOR_TOPICS,
} from '../utils/promptEngine';

export const EXTERNAL_AI_LINKS = [
  { label: '온국민 포털', href: 'https://portal.kookmin.ac.kr' },
  { label: 'ChatGPT', href: 'https://chatgpt.com' },
  { label: 'Claude', href: 'https://claude.ai' },
  { label: 'Gemini', href: 'https://gemini.google.com' },
];

interface AICoachDrawerProps {
  isOpen: boolean;
  initialPreset: CoachPresetId;
  state: StudyState;
  wrongCount: number;
  bookmarkCount: number;
  onClose: () => void;
  onChangeCustomMemo: (memo: string) => void;
}

const PRESET_CARDS: {
  id: CoachPresetId;
  title: string;
  desc: string;
}[] = [
  {
    id: 'wrong-traps',
    title: '틀린 문제 함정 패턴 집중 해부',
    desc: '틀린 문항과 내가 고른 선지를 묶어 왜 헷갈렸는지 비교 설명 요청',
  },
  {
    id: 'tutor-table',
    title: '헷갈리는 판례·조문 1:1 과외',
    desc: '저장한 판례·조문의 비교 기준표를 먼저 보고 차근차근 문답 진행',
  },
  {
    id: 'variant-quiz',
    title: '약점 쟁점 실전 변형문제 더 풀기',
    desc: '판례 왜곡 없이 주체·정족수·반대의견 함정 문제를 1문제씩 풀이',
  },
  {
    id: 'case-feedback',
    title: '해외파병 사례형 답안 첨삭',
    desc: '내 초안(또는 백지 가이드)을 바탕으로 맞힌 점과 보완 질문 받기',
  },
];

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({
  isOpen,
  initialPreset,
  state,
  wrongCount,
  bookmarkCount,
  onClose,
  onChangeCustomMemo,
}) => {
  const [selectedPreset, setSelectedPreset] =
    useState<CoachPresetId>(initialPreset);
  const [selectedFallbackTopics, setSelectedFallbackTopics] = useState<string[]>(
    ['rule108', 'courtorg']
  );
  const [memoExpanded, setMemoExpanded] = useState<boolean>(false);
  const [copiedState, setCopiedState] = useState<boolean>(false);

  useEffect(() => {
    setSelectedPreset(initialPreset);
  }, [initialPreset, isOpen]);

  const generatedPrompt = useMemo(
    () => buildCoachPresetPrompt(selectedPreset, state, selectedFallbackTopics),
    [selectedPreset, state, selectedFallbackTopics]
  );

  const copyPromptToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedState(true);
      window.setTimeout(() => setCopiedState(false), 2200);
    } catch {
      const el = document.createElement('textarea');
      el.value = textToCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedState(true);
      window.setTimeout(() => setCopiedState(false), 2200);
    }
  };

  useEffect(() => {
    if (isOpen) {
      copyPromptToClipboard(generatedPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialPreset]);

  const handleSelectPreset = (presetId: CoachPresetId) => {
    setSelectedPreset(presetId);
    const nextPrompt = buildCoachPresetPrompt(
      presetId,
      state,
      selectedFallbackTopics
    );
    copyPromptToClipboard(nextPrompt);
  };

  const toggleFallbackTopic = (topicId: string) => {
    setSelectedFallbackTopics((prev) => {
      const exists = prev.includes(topicId);
      if (exists && prev.length === 1) return prev;
      return exists
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId];
    });
  };

  const hasDraft = state.essayDraft.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-40"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 35 }}
            aria-label="AI 복습 코치"
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl"
          >
            {/* 헤더 */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-[#0f172a]">
                  AI 복습 코치
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  내 풀이 기록에 맞춘 프롬프트가 자동으로 복사됩니다
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 본문 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 학습 상태 요약 */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5">
                  <span className="text-xs font-semibold text-slate-500 block">
                    틀린 문제
                  </span>
                  <span
                    className={`text-lg font-extrabold tabular-nums ${
                      wrongCount > 0 ? 'text-[#b91c1c]' : 'text-[#0f172a]'
                    }`}
                  >
                    {wrongCount}개
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5">
                  <span className="text-xs font-semibold text-slate-500 block">
                    저장 항목
                  </span>
                  <span className="text-lg font-extrabold text-[#1e3a8a] tabular-nums">
                    {bookmarkCount}개
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5">
                  <span className="text-xs font-semibold text-slate-500 block">
                    사례 초안
                  </span>
                  <span className="text-sm font-extrabold text-slate-700 block mt-1">
                    {hasDraft ? '작성됨' : '미작성'}
                  </span>
                </div>
              </div>

              {/* 프리셋 4종 */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-extrabold text-[#0f172a]">
                    복습 주제 선택
                  </span>
                  {copiedState && (
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0f766e]">
                      <Check className="w-3.5 h-3.5" />
                      복사됨
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {PRESET_CARDS.map((card) => {
                    const active = selectedPreset === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleSelectPreset(card.id)}
                        className={`w-full text-left rounded-xl p-4 border transition-all ${
                          active
                            ? 'bg-[#eff6ff] border-2 border-[#1e3a8a]'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-[15.5px] font-extrabold text-[#0f172a] mb-0.5">
                          {card.title}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {card.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {selectedPreset === 'tutor-table' && bookmarkCount === 0 && (
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 space-y-2">
                    <div className="text-xs font-bold text-slate-600">
                      집중 점검할 주제를 선택하세요:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {FALLBACK_TUTOR_TOPICS.map((t) => {
                        const chosen = selectedFallbackTopics.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleFallbackTopic(t.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                              chosen
                                ? 'bg-[#1e3a8a] text-white'
                                : 'bg-white text-slate-600 border border-slate-300'
                            }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 선택적 1줄 추가 메모 */}
              <div className="rounded-lg border border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setMemoExpanded((prev) => !prev)}
                  className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-slate-700"
                >
                  <span>특별히 더 궁금한 점 한 줄 추가 (선택)</span>
                  {memoExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {memoExpanded && (
                  <div className="px-4 pb-3.5">
                    <input
                      type="text"
                      value={state.coachCustomMemo}
                      onChange={(e) => onChangeCustomMemo(e.target.value)}
                      placeholder="예: 대법관회의와 대법원 심판 합의체의 차이를 쉽게 비교해 주세요"
                      className="w-full px-3.5 py-2 rounded-lg text-sm bg-white border border-slate-300 text-[#0f172a] focus:outline-none focus:border-[#1e3a8a]"
                    />
                  </div>
                )}
              </div>

              {/* 프롬프트 전문 미리보기 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#0f172a]">
                    프롬프트 미리보기
                  </span>
                  <button
                    type="button"
                    onClick={() => copyPromptToClipboard(generatedPrompt)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors ${
                      copiedState
                        ? 'bg-[#0f766e] text-white'
                        : 'bg-[#0f172a] text-white hover:bg-[#1e3a8a]'
                    }`}
                  >
                    {copiedState ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>복사 완료</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>프롬프트 복사</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="w-full max-h-60 overflow-y-auto rounded-xl bg-slate-900 text-slate-100 p-4 text-[13px] leading-relaxed whitespace-pre-wrap font-sans">
                  {generatedPrompt}
                </pre>
              </div>
            </div>

            {/* 외부 AI 바로가기 */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EXTERNAL_AI_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-extrabold bg-white border border-slate-300 text-[#0f172a] hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors"
                >
                  <span>{item.label}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
