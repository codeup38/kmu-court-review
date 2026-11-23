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
            className="fixed inset-0 bg-slate-900/45 backdrop-blur-[1px] z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.16 }}
              className="pointer-events-auto w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold bg-[#0f766e] text-white px-2.5 py-0.5 rounded">
                      <Check className="w-3 h-3" />
                      {copied ? '클립보드에 복사됨' : '프롬프트 준비됨'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {data.subtitle}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                    {data.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900"
                  aria-label="닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-600">
                    아래 서비스 중 하나를 열어 바로 붙여넣기 하세요.
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(data.prompt)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>다시 복사</span>
                  </button>
                </div>

                <pre className="w-full max-h-72 overflow-y-auto rounded-xl bg-slate-900 text-slate-100 p-4 text-[13px] leading-relaxed whitespace-pre-wrap font-sans">
                  {data.prompt}
                </pre>
              </div>

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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
