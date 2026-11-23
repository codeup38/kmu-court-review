import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  X,
} from 'lucide-react';
import { CoachPresetId, StudyState } from '../types';
import { buildCoachPresetPrompt } from '../utils/promptEngine';
import { PERSONAL_AI_LINKS, SCHOOL_AI_URL } from './InstantPromptModal';

interface AICoachDrawerProps {
  isOpen: boolean;
  initialPreset: CoachPresetId;
  state: StudyState;
  wrongCount: number;
  onClose: () => void;
  onChangeCustomMemo: (memo: string) => void;
}

const TEMPLATES: {
  id: CoachPresetId;
  title: string;
  desc: string;
}[] = [
  {
    id: 'wrong-traps',
    title: '틀린 문제 · 빈출 함정 정리',
    desc: '내가 틀린 문항(없으면 사법부 빈출 함정 Top 4)을 비교 설명받고 퀴즈 1개로 점검',
  },
  {
    id: 'variant-quiz',
    title: '실전 변형문제 1문제씩 더 풀기',
    desc: '판례 왜곡 없이 주체·정족수·반대의견 함정 문제를 AI와 대화형으로 풀이',
  },
  {
    id: 'case-feedback',
    title: '해외파병 사례형 첨삭 · 문답 연습',
    desc: '작성한 초안 첨삭 또는 백지 상태에서 4단 답안 단계별 문답 진행',
  },
];

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({
  isOpen,
  initialPreset,
  state,
  wrongCount,
  onClose,
  onChangeCustomMemo,
}) => {
  const [selectedPreset, setSelectedPreset] =
    useState<CoachPresetId>(initialPreset);
  const [copiedState, setCopiedState] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  useEffect(() => {
    setSelectedPreset(initialPreset);
    setCopiedState(false);
  }, [initialPreset, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const generatedPrompt = useMemo(
    () => buildCoachPresetPrompt(selectedPreset, state),
    [selectedPreset, state]
  );

  if (!isOpen) return null;

  const copyPromptToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedState(true);
      window.setTimeout(() => setCopiedState(false), 2600);
    } catch {
      const el = document.createElement('textarea');
      el.value = textToCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedState(true);
      window.setTimeout(() => setCopiedState(false), 2600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
      />

      <aside
        aria-label="AI 질문 템플릿"
        className="relative z-10 h-full w-full max-w-lg bg-white border-l border-slate-200 flex flex-col shadow-2xl"
      >
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#0f172a]">
              AI 질문 템플릿
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              직접 답변하는 챗봇이 아니라, 사법부 복습에 최적화된 질문 프롬프트를 복사해 AI에 붙여넣어 활용하는 도구입니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 shrink-0"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. 템플릿 선택 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-extrabold text-[#0f172a]">
                1. 필요한 질문 템플릿 선택
              </span>
              {wrongCount > 0 && (
                <span className="text-xs font-extrabold text-[#b91c1c] tabular-nums">
                  틀린 문제 {wrongCount}개 자동 반영
                </span>
              )}
            </div>

            <div className="space-y-2">
              {TEMPLATES.map((tpl) => {
                const active = selectedPreset === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(tpl.id);
                      setCopiedState(false);
                    }}
                    className={`w-full text-left rounded-xl p-4 border transition-all ${
                      active
                        ? 'bg-[#eff6ff] border-2 border-[#1e3a8a]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[15.5px] font-extrabold text-[#0f172a] mb-0.5">
                      {tpl.title}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {tpl.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 내 질문 덧붙이기 */}
          <div className="space-y-2">
            <label
              htmlFor="drawer-custom-memo"
              className="block text-sm font-extrabold text-[#0f172a]"
            >
              2. 특별히 궁금한 점 덧붙이기{' '}
              <span className="font-semibold text-slate-400">(선택)</span>
            </label>
            <input
              id="drawer-custom-memo"
              type="text"
              value={state.coachCustomMemo}
              onChange={(e) => {
                onChangeCustomMemo(e.target.value);
                setCopiedState(false);
              }}
              placeholder="예: 대법관회의와 대법원 심판 합의체의 차이를 쉽게 비교해 줘"
              className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 focus:bg-white border border-slate-300 text-[#0f172a] focus:outline-none focus:border-[#1e3a8a]"
            />
          </div>

          {/* 3. 복사 및 미리보기 */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => copyPromptToClipboard(generatedPrompt)}
              className={`w-full py-3.5 px-4 rounded-xl text-sm sm:text-base font-extrabold transition-colors flex items-center justify-center gap-2 shadow-sm ${
                copiedState
                  ? 'bg-[#0f766e] text-white'
                  : 'bg-[#0f172a] text-white hover:bg-[#1e3a8a]'
              }`}
            >
              {copiedState ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>프롬프트 복사 완료 — 아래 AI에 붙여넣기 하세요</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>맞춤형 프롬프트 복사하기</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setPreviewOpen((prev) => !prev)}
              className="w-full py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1"
            >
              <span>
                {previewOpen ? '프롬프트 전문 닫기' : '복사될 프롬프트 전문 미리보기'}
              </span>
              {previewOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {previewOpen && (
              <pre className="w-full max-h-56 overflow-y-auto rounded-xl bg-slate-900 text-slate-100 p-4 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {generatedPrompt}
              </pre>
            )}
          </div>

          {/* 4. 학교 무료 제공 AI 안내 및 바로가기 (상용 AI와 분리) */}
          <div className="rounded-xl border border-[#93c5fd] bg-[#eff6ff]/70 p-4 space-y-3">
            <div className="space-y-1.5">
              <div className="text-sm font-extrabold text-[#1e3a8a]">
                학교 무료 제공 AI(FactChat)로 무료 복습하기
              </div>
              <p className="text-[13.5px] text-slate-700 leading-relaxed">
                학교 계정(온국민 포털)으로 로그인만 하면 별도 비용 없이 유료 AI 모델들로 바로 복습·질문할 수 있습니다.
              </p>
              <p className="text-xs sm:text-[13px] font-bold text-[#1e3a8a] leading-relaxed">
                ※ 학교 AI 안에서 무제한 무료 모델 대신 ChatGPT 6.2 Sol, Claude Opus 5.5 등 최신 모델 사용을 권장합니다.
              </p>
            </div>

            <a
              href={SCHOOL_AI_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (!copiedState) copyPromptToClipboard(generatedPrompt);
              }}
              className="w-full py-3 px-4 rounded-xl text-sm font-extrabold bg-[#1e3a8a] text-white hover:bg-[#0f172a] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>학교 무료 제공 AI 열기 (온국민 포털 로그인)</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          </div>

          {/* 5. 개인 구독 상용 AI 바로가기 */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">
              개인 구독 AI에 붙여넣기
            </span>
            <div className="grid grid-cols-3 gap-2">
              {PERSONAL_AI_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (!copiedState) copyPromptToClipboard(generatedPrompt);
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold bg-slate-50 border border-slate-300 text-slate-700 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                >
                  <span>{item.label}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
