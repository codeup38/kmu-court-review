import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpenCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  FileCheck2,
  ListTodo,
  ScanSearch,
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
  code: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'wrong-traps',
    code: '프리셋 01',
    title: '틀린 문제 함정 패턴 집중 해부',
    desc: '내가 틀린 문항·선택 선지·정답 법리를 묶어 비교 설명 + 확인 퀴즈 1개 요청',
    icon: ScanSearch,
  },
  {
    id: 'tutor-table',
    code: '프리셋 02',
    title: '헷갈리는 판례·조문 1:1 과외 모드',
    desc: '북마크 판례·조문 기준표를 먼저 제시받은 뒤 단계별 문답으로 점검',
    icon: BookOpenCheck,
  },
  {
    id: 'variant-quiz',
    code: '프리셋 03',
    title: '약점 쟁점 실전 변형문제 추가 출제',
    desc: '판례 왜곡 없이 주체·정족수·원칙예외·반대의견 함정 7급 문제를 1문제씩 풀이',
    icon: ListTodo,
  },
  {
    id: 'case-feedback',
    code: '프리셋 04',
    title: '해외파병 사례형 답안 첨삭 & 후속 질문',
    desc: '내 초안(또는 백지 가이드) 기반 맞힌 점 → 빠진 경계 → 보완 역질문 피드백',
    icon: FileCheck2,
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
  const [selectedPreset, setSelectedPreset] = useState<CoachPresetId>(initialPreset);
  const [selectedFallbackTopics, setSelectedFallbackTopics] = useState<string[]>([
    'rule108',
    'courtorg',
  ]);
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
      // Fallback textarea copy
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

  // 드로어가 열릴 때 현재 프리셋 프롬프트 자동 복사 편의 제공
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
      return exists ? prev.filter((id) => id !== topicId) : [...prev, topicId];
    });
  };

  const hasDraft = state.essayDraft.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 백드롭 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f172a]/45 z-40"
          />

          {/* 우측 슬라이드오버 드로어 */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            aria-label="AI 복습 코치"
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-white border-l-2 border-[#0f172a] z-50 flex flex-col shadow-2xl"
          >
            {/* 드로어 상단 헤더 */}
            <div className="px-6 py-4 border-b-2 border-[#0f172a] bg-[#f8fafc] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-[#1e3a8a] block">
                  컨텍스트 기반 맞춤 프롬프트 엔진
                </span>
                <h2 className="text-lg font-extrabold text-[#0f172a]">
                  AI 복습 코치
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 border border-[#cbd5e1] bg-white text-[#475569] hover:text-[#0f172a] hover:border-[#0f172a]"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 스크롤 본문 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 1. 자동 수집된 내 학습 상태 요약 */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="border border-[#cbd5e1] bg-[#f8fafc] p-3">
                  <span className="text-[11px] font-bold text-[#64748b] block">
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
                <div className="border border-[#cbd5e1] bg-[#f8fafc] p-3">
                  <span className="text-[11px] font-bold text-[#64748b] block">
                    헷갈림 북마크
                  </span>
                  <span className="text-lg font-extrabold text-[#1e3a8a] tabular-nums">
                    {bookmarkCount}개
                  </span>
                </div>
                <div className="border border-[#cbd5e1] bg-[#f8fafc] p-3">
                  <span className="text-[11px] font-bold text-[#64748b] block">
                    사례형 초안
                  </span>
                  <span
                    className={`text-sm font-extrabold block mt-1 ${
                      hasDraft ? 'text-[#0f766e]' : 'text-[#64748b]'
                    }`}
                  >
                    {hasDraft ? '작성됨' : '미작성 (가이드)'}
                  </span>
                </div>
              </div>

              {/* 2. 원클릭 스마트 프리셋 4종 */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#0f172a]">
                    원클릭 스마트 프리셋 선택 (클릭 즉시 맞춤 생성·복사)
                  </span>
                  {copiedState && (
                    <span className="inline-flex items-center gap-1 font-extrabold text-[#0f766e]">
                      <Check className="w-3.5 h-3.5" />
                      클립보드 복사됨
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {PRESET_CARDS.map((card) => {
                    const Icon = card.icon;
                    const active = selectedPreset === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleSelectPreset(card.id)}
                        className={`w-full text-left p-3.5 border transition-all flex items-start gap-3 ${
                          active
                            ? 'bg-[#eff6ff] border-[#1e3a8a] border-l-4 shadow-sm'
                            : 'bg-white border-[#cbd5e1] hover:border-[#94a3b8]'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            active ? 'text-[#1e3a8a]' : 'text-[#64748b]'
                          }`}
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-extrabold text-[#1e3a8a] tabular-nums">
                              {card.code}
                            </span>
                            <span className="text-sm font-extrabold text-[#0f172a]">
                              {card.title}
                            </span>
                          </div>
                          <p className="text-xs text-[#475569] leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 프리셋 2 선택 시 북마크가 0개면 핵심 쟁점 선택 칩 노출 */}
                {selectedPreset === 'tutor-table' && bookmarkCount === 0 && (
                  <div className="bg-[#f8fafc] border border-[#cbd5e1] p-3 space-y-2">
                    <div className="text-xs font-extrabold text-[#334155]">
                      북마크한 항목이 없어 아래 선택된 핵심 쟁점으로 과외표를 구성합니다:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {FALLBACK_TUTOR_TOPICS.map((t) => {
                        const chosen = selectedFallbackTopics.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleFallbackTopic(t.id)}
                            className={`px-2.5 py-1 text-xs font-bold border transition-colors ${
                              chosen
                                ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                                : 'bg-white text-[#475569] border-[#cbd5e1]'
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

              {/* 3. 선택적 접이식 1줄 메모 */}
              <div className="border border-[#cbd5e1] bg-[#f8fafc]">
                <button
                  type="button"
                  onClick={() => setMemoExpanded((prev) => !prev)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-[#334155] hover:text-[#0f172a]"
                >
                  <span>특별히 더 궁금한 점이 있다면 한 줄 추가 (선택)</span>
                  {memoExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {memoExpanded && (
                  <div className="px-3.5 pb-3.5">
                    <input
                      type="text"
                      value={state.coachCustomMemo}
                      onChange={(e) => onChangeCustomMemo(e.target.value)}
                      placeholder="예: 대법관회의와 전원합의체의 차이를 비유로 설명해 주세요"
                      className="w-full px-3 py-2 text-xs bg-white border border-[#cbd5e1] text-[#0f172a] focus:outline-none focus:border-[#1e3a8a]"
                    />
                  </div>
                )}
              </div>

              {/* 4. 생성된 프롬프트 전문 뷰어 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0f172a]">
                    생성된 맞춤 프롬프트 프리뷰
                  </span>
                  <button
                    type="button"
                    onClick={() => copyPromptToClipboard(generatedPrompt)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold transition-colors ${
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

                <pre className="w-full max-h-64 overflow-y-auto bg-[#0f172a] text-[#e2e8f0] p-4 text-xs leading-relaxed whitespace-pre-wrap font-sans border border-[#334155]">
                  {generatedPrompt}
                </pre>
              </div>
            </div>

            {/* 드로어 하단 고정: 외부 채팅창 빠른 실행 링크 버튼 */}
            <div className="px-6 py-4 border-t border-[#cbd5e1] bg-[#f8fafc]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EXTERNAL_AI_LINKS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-extrabold bg-white border border-[#cbd5e1] text-[#0f172a] hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors"
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
