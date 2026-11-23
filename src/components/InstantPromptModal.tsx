import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, ExternalLink, X } from 'lucide-react';
import { InstantPromptModalData } from '../types';
import { EXTERNAL_AI_LINKS } from './AICoachDrawer';

interface InstantPromptModalProps {
  data: InstantPromptModalData | null;
  onClose: () => void;
}

export const InstantPromptModal: React.FC<InstantPromptModalProps> = ({
  data,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (data) {
      copyText(data.prompt);
    } else {
      setCopied(false);
    }
  }, [data]);

  return (
    <AnimatePresence>
      {data && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f172a]/50 z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.16 }}
              className="pointer-events-auto w-full max-w-2xl bg-white border-2 border-[#0f172a] border-t-[4px] border-t-[#1e3a8a] shadow-2xl flex flex-col max-h-[88vh]"
            >
              <div className="px-6 py-4 border-b border-[#cbd5e1] bg-[#f8fafc] flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold bg-[#0f766e] text-white px-2 py-0.5">
                      <Check className="w-3 h-3" />
                      {copied ? '클립보드 자동 복사됨' : '맞춤 프롬프트 준비됨'}
                    </span>
                    <span className="text-xs font-semibold text-[#64748b]">
                      {data.subtitle}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0f172a]">
                    {data.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 border border-[#cbd5e1] bg-white text-[#475569] hover:text-[#0f172a]"
                  aria-label="닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#475569]">
                    아래 AI 링크를 열어 붙여넣기(Ctrl+V / Cmd+V)하면 바로 대화가 시작됩니다.
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(data.prompt)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>프롬프트 다시 복사</span>
                  </button>
                </div>

                <pre className="w-full max-h-72 overflow-y-auto bg-[#0f172a] text-[#e2e8f0] p-4 text-xs leading-relaxed whitespace-pre-wrap font-sans border border-[#334155]">
                  {data.prompt}
                </pre>
              </div>

              <div className="px-6 py-4 border-t border-[#cbd5e1] bg-[#f8fafc] grid grid-cols-2 sm:grid-cols-4 gap-2">
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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
