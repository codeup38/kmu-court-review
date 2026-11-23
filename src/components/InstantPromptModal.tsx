import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  X,
} from 'lucide-react';
import { InstantPromptModalData } from '../types';

export const SCHOOL_AI_URL = 'https://factchat.kookmin.ac.kr';

export const PERSONAL_AI_LINKS = [
  { label: 'ChatGPT', href: 'https://chatgpt.com' },
  { label: 'Claude', href: 'https://claude.ai' },
  { label: 'Gemini', href: 'https://gemini.google.com' },
];

interface InstantPromptModalProps {
  data: InstantPromptModalData | null;
  onClose: () => void;
}

export const InstantPromptModal: React.FC<InstantPromptModalProps> = ({
  data,
  onClose,
}) => {
  const [userNote, setUserNote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  useEffect(() => {
    setUserNote('');
    setCopied(false);
    setPreviewOpen(false);
  }, [data]);

  const promptText = useMemo(() => {
    if (!data) return '';
    return data.buildPrompt(userNote);
  }, [data, userNote]);

  if (!data) return null;

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-[1px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={data.title}
        className="relative z-10 w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* 모달 헤더 */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-[#1e3a8a] block">
              맞춤형 질문 프롬프트 복사
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
              {data.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">{data.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 shrink-0"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* 1. 내 생각 · 헷갈린 점 입력 (선택) */}
          <div className="space-y-2">
            <label
              htmlFor="instant-user-note"
              className="block text-sm font-extrabold text-[#0f172a]"
            >
              1. 헷갈렸던 점이나 내 생각을 덧붙여 보세요{' '}
              <span className="font-semibold text-slate-400">(선택)</span>
            </label>
            <textarea
              id="instant-user-note"
              rows={3}
              value={userNote}
              onChange={(e) => {
                setUserNote(e.target.value);
                setCopied(false);
              }}
              placeholder={data.placeholder}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 focus:bg-white p-3.5 text-sm sm:text-[15px] text-[#0f172a] leading-relaxed focus:outline-none focus:border-[#1e3a8a]"
            />
          </div>

          {/* 2. 원클릭 프롬프트 복사 */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => copyText(promptText)}
              className={`w-full py-3.5 px-5 rounded-xl text-base font-extrabold transition-colors flex items-center justify-center gap-2 shadow-sm ${
                copied
                  ? 'bg-[#0f766e] text-white'
                  : 'bg-[#0f172a] text-white hover:bg-[#1e3a8a]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>프롬프트 복사 완료 — 아래 AI에 바로 붙여넣기 하세요</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>맞춤형 질문 프롬프트 복사하기</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setPreviewOpen((prev) => !prev)}
              className="w-full py-2 px-3 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center gap-1"
            >
              <span>
                {previewOpen ? '복사될 프롬프트 전문 닫기' : '복사될 프롬프트 전문 미리보기'}
              </span>
              {previewOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {previewOpen && (
              <pre className="w-full max-h-52 overflow-y-auto rounded-xl bg-slate-900 text-slate-100 p-4 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {promptText}
              </pre>
            )}
          </div>

          {/* 3. 학교 무료 제공 AI 최우선 이동 + 추천 모델 안내 */}
          <div className="rounded-xl border border-[#93c5fd] bg-[#eff6ff]/70 p-4 sm:p-5 space-y-3">
            <div className="space-y-1">
              <div className="text-sm font-extrabold text-[#1e3a8a]">
                2. 복사한 내용을 AI에 붙여넣어 질문하기
              </div>
              <p className="text-xs sm:text-[13.5px] text-slate-700 leading-relaxed">
                <strong>
                  무제한 모델 대신 ChatGPT 6.2 Sol, Claude Opus 5.5 등 최신 모델 사용을 권장합니다.
                </strong>{' '}
                학교 무료 제공 AI(FactChat)는 온국민 포털 로그인으로 바로 무료 이용할 수 있으며, 개인 AI에서도 동일하게 활용할 수 있습니다.
              </p>
            </div>

            <a
              href={SCHOOL_AI_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (!copied) copyText(promptText);
              }}
              className="w-full py-3 px-4 rounded-xl text-sm sm:text-[15px] font-extrabold bg-[#1e3a8a] text-white hover:bg-[#0f172a] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>학교 무료 제공 AI 열기 (FactChat · 온국민 포털 로그인)</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-500">
                개인 AI 바로가기
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PERSONAL_AI_LINKS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (!copied) copyText(promptText);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
