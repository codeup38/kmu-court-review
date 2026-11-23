import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Ban,
  CalendarClock,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck2,
  GitFork,
  MessageSquarePlus,
  PenLine,
  Scale,
  XCircle,
} from 'lucide-react';
import {
  CASE_FULL_TEXT,
  CASE_PROMPT_QUESTION,
  CASE_SEGMENTS,
  ESSAY_CHECKLIST_ITEMS,
  MODEL_ESSAY_SECTIONS,
  TIMELINE_NODES,
} from '../data/caseData';
import { CoachPresetId, InstantPromptModalData } from '../types';

interface CaseSimulatorViewProps {
  essayDraft: string;
  onChangeEssayDraft: (val: string) => void;
  onOpenCoachWithPreset: (preset: CoachPresetId) => void;
  onTriggerInstantPrompt: (data: InstantPromptModalData) => void;
}

export const CaseSimulatorView: React.FC<CaseSimulatorViewProps> = ({
  essayDraft,
  onChangeEssayDraft,
  onOpenCoachWithPreset,
  onTriggerInstantPrompt,
}) => {
  // 1. 타임라인 동기화 상태
  const [activeTimelineId, setActiveTimelineId] = useState<string>('t4');

  // 2. 3단계 의사결정 트리 상태
  const [step1Q1Choice, setStep1Q1Choice] = useState<number | null>(null);
  const [step1Q2Choice, setStep1Q2Choice] = useState<'possible' | 'impossible' | null>(
    null
  );

  const [step2PolicyChoice, setStep2PolicyChoice] = useState<
    'restraint' | 'review' | null
  >(null);
  const [step2ProcChoice, setStep2ProcChoice] = useState<
    'restraint' | 'review' | null
  >(null);

  const [claimantMode, setClaimantMode] = useState<'assembly' | 'members'>('assembly');

  // 3. 서술형 4단 답안 빌더 빈칸 상태
  const [clozeActive, setClozeActive] = useState<boolean>(true);
  const [revealedBlankKeys, setRevealedBlankKeys] = useState<string[]>([]);

  const selectedTimeline =
    TIMELINE_NODES.find((t) => t.id === activeTimelineId) ?? TIMELINE_NODES[3];

  const toggleBlankKey = (key: string) => {
    setRevealedBlankKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // 실시간 키워드 체크리스트 판별
  const checklistStatus = useMemo(() => {
    const normalized = essayDraft.replace(/\s+/g, ' ').toLowerCase();
    const compact = essayDraft.replace(/\s+/g, '').toLowerCase();

    return ESSAY_CHECKLIST_ITEMS.map((item) => {
      const matched = item.matchGroups.some((group) =>
        group.every((token) => {
          const t = token.toLowerCase();
          const tCompact = t.replace(/\s+/g, '');
          return normalized.includes(t) || compact.includes(tCompact);
        })
      );
      return { ...item, matched };
    });
  }, [essayDraft]);

  const matchedCount = checklistStatus.filter((c) => c.matched).length;

  const handleCopyDraftCoaching = () => {
    if (essayDraft.trim().length > 0) {
      onOpenCoachWithPreset('case-feedback');
      return;
    }
    // 초안이 아직 비어 있어도 즉시 맞춤 첨삭 안내 또는 코치 드로어 연결
    onOpenCoachWithPreset('case-feedback');
  };

  const handleBlankGuidedStart = () => {
    const guidedPrompt = `대학교 법학과 『헌법원리와제도』 수업의 '해외파병 결정과 사법심사·권한쟁의심판' 사례형 문제를 백지 상태에서 단계별 문답으로 연습하고 싶습니다.

[사례 원문]
${CASE_FULL_TEXT}
${CASE_PROMPT_QUESTION}

[수업 핵심 채점 기준 (이 범위 안에서만 지도할 것)]
1. 행위와 동의권 분리: 5. 20. 파병협정 체결·비준 동의(헌법 제60조 제1항 — 비준 예정 서명 단계라면 서명 전 미동의만으로 즉시 무효 단정 불가)와 8. 30. 실제 전투병력 파병 동의(헌법 제60조 제2항 — 별개의 사전동의 필수) 구별. 비준동의안 제출·표결 무산은 동의가 아니며 시간 부족·실력 저지로 사전동의 생략 불가.
2. 통치행위와 헌재 심사 범위: 파병의 외교·군사적 유불리는 사법자제하되, 이라크 파병 결정(2003헌마814)의 자제는 '국회 동의 등 헌법 절차를 지킨 것이 명백한 경우'가 전제였으므로 국회 동의를 결여한 절차 위반은 헌재 심사 가능.
3. 청구 주체별 적법성 분기: 권한 주체인 '국회(본회의 의결)'가 청구기간 내 권한쟁의심판을 청구하면 동의권 침해의 현저한 위험이 인정되어 본안 판단 가능 / 반면 야당 의원 '丙·丁 개인'이 청구하면 제3자 소송담당 불허 및 심의·표결권의 대내성 한계(2011헌라2)로 부적법 각하.
*(주의: 일반 국민이나 파병 장병의 기본권 침해 헌법소원은 논외로 하고, 위 국가기관 간 권한 배분·통치행위·권한쟁의 적법요건에만 집중해 주세요.)*

[진행 요청]
모범답안을 한 번에 다 알려주지 말고, 내가 스스로 4단 목차(Ⅰ. 권한 나누기 → Ⅱ. 절차 위반 → Ⅲ. 헌재 심사 범위 → Ⅳ. 청구 자격과 결론)를 완성할 수 있도록 1단계 질문부터 하나씩 던져 이끌어 주세요.`;

    onTriggerInstantPrompt({
      title: '백지 상태 단계별 사례형 문답 프롬프트',
      subtitle: '모범답안 스포일러 없이 1단계부터 AI와 문답으로 답안 완성하기',
      prompt: guidedPrompt,
    });
  };

  return (
    <div className="space-y-10">
      {/* ==================== 1. 인터랙티브 사건 지문 & 타임라인 동기화 ==================== */}
      <section className="bg-white border border-[#cbd5e1] border-t-[3px] border-t-[#0f172a] p-6 md:p-8 shadow-sm space-y-6">
        <div className="border-b border-[#e2e8f0] pb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1e3a8a] mb-1">
              <CalendarClock className="w-3.5 h-3.5" />
              사례 원문 분석 · 해외파병 결정과 사법심사·권한쟁의심판
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0f172a]">
              인터랙티브 사건 지문 & 타임라인 동기화
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#64748b]">
            타임라인 노드 또는 본문 문장을 클릭하면 시점별 법적 쟁점이 연동됩니다
          </span>
        </div>

        {/* 4단 타임라인 노드 바 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {TIMELINE_NODES.map((node, idx) => {
            const isSelected = activeTimelineId === node.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setActiveTimelineId(node.id)}
                className={`text-left p-3.5 border transition-all relative ${
                  isSelected
                    ? node.isCoreTarget
                      ? 'bg-[#fef2f2] border-[#b91c1c] border-t-[3px] shadow-sm'
                      : 'bg-[#eff6ff] border-[#1e3a8a] border-t-[3px] shadow-sm'
                    : 'bg-[#f8fafc] border-[#cbd5e1] hover:bg-white hover:border-[#94a3b8]'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span
                    className={`text-xs font-extrabold tabular-nums ${
                      node.isCoreTarget ? 'text-[#b91c1c]' : 'text-[#1e3a8a]'
                    }`}
                  >
                    0{idx + 1} · {node.dateLabel}
                  </span>
                  {node.isCoreTarget && (
                    <span className="text-[10px] font-extrabold bg-[#b91c1c] text-white px-1.5 py-0.5">
                      심판대상
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-[#0f172a] leading-snug">
                  {node.shortTitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* 사례 원문 전문 (문장 하이라이트 동기화) */}
        <div className="border-2 border-[#1e293b] bg-white p-5 md:p-6 space-y-4">
          <div className="space-y-3 text-[15px] md:text-base leading-relaxed text-[#0f172a]">
            {[1, 2].map((paraNum) => (
              <p key={paraNum}>
                {CASE_SEGMENTS.filter((s) => s.paragraph === paraNum).map((seg) => {
                  const isHighlighted = seg.timelineId === activeTimelineId;
                  const isCore = seg.timelineId === 't4';
                  return (
                    <span
                      key={seg.id}
                      onClick={() => seg.timelineId && setActiveTimelineId(seg.timelineId)}
                      className={`cursor-pointer transition-colors ${
                        isHighlighted
                          ? isCore
                            ? 'bg-[#fef2f2] text-[#991b1b] font-bold border-b-2 border-[#b91c1c] px-0.5'
                            : 'bg-[#eff6ff] text-[#1e3a8a] font-bold border-b-2 border-[#1e3a8a] px-0.5'
                          : 'hover:bg-[#f1f5f9]'
                      }`}
                    >
                      {seg.text}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>

          <div className="bg-[#eff6ff] border-l-4 border-l-[#1e3a8a] p-4 text-sm md:text-base font-extrabold text-[#0f172a]">
            {CASE_PROMPT_QUESTION}
          </div>
        </div>

        {/* 선택된 타임라인 노드의 법적 포인트 카드 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTimeline.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className={`p-4 md:p-5 border-l-4 ${
              selectedTimeline.isCoreTarget
                ? 'bg-[#fef2f2] border border-[#fca5a5] border-l-[#b91c1c]'
                : 'bg-[#f8fafc] border border-[#cbd5e1] border-l-[#1e3a8a]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span
                className={`text-xs font-extrabold tabular-nums ${
                  selectedTimeline.isCoreTarget ? 'text-[#b91c1c]' : 'text-[#1e3a8a]'
                }`}
              >
                [{selectedTimeline.dateLabel}] 법적 검토 포인트
              </span>
              <span className="text-xs font-bold bg-white border border-[#cbd5e1] text-[#334155] px-2 py-0.5 tabular-nums">
                {selectedTimeline.provisionBadge}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-[#0f172a] mb-1">
              {selectedTimeline.legalPointTitle}
            </h3>
            <p className="text-sm text-[#334155] leading-relaxed">
              {selectedTimeline.legalPointBody}
            </p>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ==================== 2. 3단계 의사결정 트리 시뮬레이터 ==================== */}
      <section className="bg-white border border-[#cbd5e1] border-t-[3px] border-t-[#1e3a8a] p-6 md:p-8 shadow-sm space-y-8">
        <div className="border-b border-[#e2e8f0] pb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1e3a8a] mb-1">
            <GitFork className="w-3.5 h-3.5" />
            단계별 법리 판별 · 직접 클릭해 확인하는 3단계 분기
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#0f172a]">
            3단계 의사결정 트리 시뮬레이터
          </h2>
        </div>

        {/* ---------- 1단계 : 행위와 동의권 분리 ---------- */}
        <div className="border border-[#cbd5e1] bg-[#f8fafc] p-5 md:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cbd5e1] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold bg-[#0f172a] text-white px-2.5 py-1 tabular-nums">
                1단계
              </span>
              <h3 className="text-lg font-extrabold text-[#0f172a]">
                행위와 동의권 분리 (헌법 제60조 제1항 vs 제2항)
              </h3>
            </div>
            <span className="text-xs font-bold text-[#64748b]">
              두 질문 카드를 직접 선택해 판정해 보세요
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 질문 카드 1-1 */}
            <div className="bg-white border border-[#cbd5e1] p-4 md:p-5 space-y-3.5">
              <div className="text-xs font-extrabold text-[#1e3a8a]">질문 카드 1-1</div>
              <p className="text-sm md:text-[15px] font-extrabold text-[#0f172a] leading-snug">
                5. 20. 파병협정(비준 예정 서명 단계 가정)과 8. 30. 실제 전투병력 파병결정에 필요한 국회 동의 근거는?
              </p>

              <div className="space-y-2">
                {[
                  {
                    id: 1,
                    text: '파병협정 동의(제60조①)만 받으면 실제 병력 파견 동의는 따로 받을 필요가 없다.',
                    isCorrect: false,
                  },
                  {
                    id: 2,
                    text: '협정 = 제60조 제1항(비준 전 동의 가능) vs 실제 파병 = 제60조 제2항(별개의 사전동의 필수)',
                    isCorrect: true,
                  },
                  {
                    id: 3,
                    text: '비준 예정 서명이라도 5. 20. 서명 전에 동의를 받지 않았으므로 협정은 즉시 당연무효다.',
                    isCorrect: false,
                  },
                ].map((opt) => {
                  const picked = step1Q1Choice === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStep1Q1Choice(opt.id)}
                      className={`w-full text-left p-3 border text-xs md:text-[13px] font-semibold leading-relaxed transition-all ${
                        step1Q1Choice !== null
                          ? opt.isCorrect
                            ? 'bg-[#eff6ff] border-[#1e3a8a] text-[#0f172a] font-bold'
                            : picked
                            ? 'bg-[#fef2f2] border-[#b91c1c] text-[#b91c1c]'
                            : 'bg-white border-[#e2e8f0] text-[#64748b]'
                          : 'bg-[#f8fafc] border-[#cbd5e1] hover:border-[#1e3a8a] text-[#0f172a]'
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {step1Q1Choice !== null && (
                <div
                  className={`p-3 text-xs leading-relaxed border-l-4 ${
                    step1Q1Choice === 2
                      ? 'bg-[#eff6ff] border border-[#93c5fd] border-l-[#1e3a8a]'
                      : 'bg-[#fef2f2] border border-[#fca5a5] border-l-[#b91c1c]'
                  }`}
                >
                  <strong className="font-extrabold text-[#0f172a] block mb-0.5">
                    {step1Q1Choice === 2 ? '정확한 판별입니다.' : '다시 경계를 확인하세요.'}
                  </strong>
                  조약 체결·비준 동의(제60조 제1항)는 비준 전 동의가 가능하므로 서명 전 미동의만으로 곧바로 무효라 단정할 수 없지만, 실제 전투병력 파병(제60조 제2항)에는 이와 별개의 국회의 사전동의가 필수입니다.
                </div>
              )}
            </div>

            {/* 질문 카드 1-2 */}
            <div className="bg-white border border-[#cbd5e1] p-4 md:p-5 flex flex-col justify-between space-y-3.5">
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-[#1e3a8a]">질문 카드 1-2</div>
                <p className="text-sm md:text-[15px] font-extrabold text-[#0f172a] leading-snug">
                  야당이 본회의 표결을 막았고 동맹국이 재촉해 시간이 급했다면, 대통령이 사전동의를 생략할 수 있을까?
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep1Q2Choice('possible')}
                    className={`py-3.5 px-4 border text-sm font-extrabold transition-all ${
                      step1Q2Choice === 'possible'
                        ? 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]'
                        : 'bg-[#f8fafc] border-[#cbd5e1] hover:border-[#1e3a8a] text-[#0f172a]'
                    }`}
                  >
                    생략 가능
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep1Q2Choice('impossible')}
                    className={`py-3.5 px-4 border text-sm font-extrabold transition-all ${
                      step1Q2Choice !== null
                        ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                        : 'bg-[#f8fafc] border-[#cbd5e1] hover:border-[#1e3a8a] text-[#0f172a]'
                    }`}
                  >
                    생략 불가
                  </button>
                </div>
              </div>

              {step1Q2Choice !== null && (
                <div
                  className={`p-3 text-xs leading-relaxed border-l-4 ${
                    step1Q2Choice === 'impossible'
                      ? 'bg-[#eff6ff] border border-[#93c5fd] border-l-[#1e3a8a]'
                      : 'bg-[#fef2f2] border border-[#fca5a5] border-l-[#b91c1c]'
                  }`}
                >
                  <strong className="font-extrabold text-[#0f172a] block mb-0.5">
                    {step1Q2Choice === 'impossible'
                      ? '정답 : 사전동의 생략 절대 불가'
                      : '오답 함정 : 긴급성이나 표결 무산으로도 생략 불가'}
                  </strong>
                  비준동의안 제출이나 본회의 표결 무산은 국회의 동의가 아닙니다. 시간 부족(동맹국 재촉)이나 야당의 실력 저지를 이유로 제60조 제2항의 사전동의를 생략할 헌법상 예외는 없으며, 동의권이 대통령에게 넘어가지도 않습니다.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- 2단계 : 통치행위와 헌재 심사 가능성 (2003헌마814 대조) ---------- */}
        <div className="border border-[#cbd5e1] bg-[#f8fafc] p-5 md:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cbd5e1] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold bg-[#0f172a] text-white px-2.5 py-1 tabular-nums">
                2단계
              </span>
              <h3 className="text-lg font-extrabold text-[#0f172a]">
                통치행위와 헌재 심사 가능성 (2003헌마814 이라크 파병 결정 대조)
              </h3>
            </div>
            <span className="text-xs font-bold text-[#64748b]">
              각 쟁점이 [사법심사 자제]인지 [헌재 심사 가능]인지 매칭하세요
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 쟁점 A : 정책 유불리 */}
            <div className="bg-white border border-[#cbd5e1] p-4 md:p-5 space-y-3">
              <span className="text-xs font-extrabold text-[#475569] bg-[#f1f5f9] border border-[#cbd5e1] px-2 py-0.5">
                쟁점 A · 정책적 판단 영역
              </span>
              <p className="text-sm md:text-[15px] font-extrabold text-[#0f172a]">
                “중동 전쟁 파병이 우리나라 국익·안보에 유리한지 여부”
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep2PolicyChoice('restraint')}
                  className={`py-2.5 px-3 border text-xs font-extrabold transition-all ${
                    step2PolicyChoice !== null
                      ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                      : 'bg-[#f8fafc] border-[#cbd5e1] hover:border-[#1e3a8a] text-[#0f172a]'
                  }`}
                >
                  사법심사 자제
                </button>
                <button
                  type="button"
                  onClick={() => setStep2PolicyChoice('review')}
                  className={`py-2.5 px-3 border text-xs font-extrabold transition-all ${
                    step2PolicyChoice === 'review'
                      ? 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]'
                      : 'bg-[#f8fafc] border-[#cbd5e1] hover:border-[#1e3a8a] text-[#0f172a]'
                  }`}
                >
                  헌재 심사 가능
                </button>
              </div>
              {step2PolicyChoice !== null && (
                <p
                  className={`text-xs font-semibold leading-relaxed ${
                    step2PolicyChoice === 'restraint' ? 'text-[#1e3a8a]' : 'text-[#b91c1c]'
                  }`}
                >
                  {step2PolicyChoice === 'restraint'
                    ? '정확합니다. 외교·국방의 정치적 유불리는 대의기관의 결단 영역으로 사법심사를 자제합니다.'
                    : '주의: 국익·안보 유불리 자체는 사법적 기준만으로 심판하기 부적절하여 자제 대상입니다.'}
                </p>
              )}
            </div>

            {/* 쟁점 B : 헌법 절차 준수 */}
            <div className="bg-white border border-[#cbd5e1] p-4 md:p-5 space-y-3">
              <span className="text-xs font-extrabold text-[#1e3a8a] bg-[#eff6ff] border border-[#93c5fd] px-2 py-0.5">
                쟁점 B · 헌법상 절차 영역
              </span>
              <p className="text-sm md:text-[15px] font-extrabold text-[#0f172a]">
                “헌법 제60조 제2항이 정한 국회의 파병 동의를 거쳤는지 여부”
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep2ProcChoice('restraint')}
                  className={`py-2.5 px-3 border text-xs font-extrabold transition-all ${
                    step2ProcChoice === 'restraint'
                      ? 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]'
                      : 'bg-[#f8fafc] border-[#cbd5e1] hover:border-[#1e3a8a] text-[#0f172a]'
                  }`}
                >
                  사법심사 자제
                </button>
                <button
                  type="button"
                  onClick={() => setStep2ProcChoice('review')}
                  className={`py-2.5 px-3 border text-xs font-extrabold transition-all ${
                    step2ProcChoice !== null
                      ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                      : 'bg-[#f8fafc] border-[#cbd5e1] hover:border-[#1e3a8a] text-[#0f172a]'
                  }`}
                >
                  헌재 심사 가능
                </button>
              </div>
              {step2ProcChoice !== null && (
                <p
                  className={`text-xs font-semibold leading-relaxed ${
                    step2ProcChoice === 'review' ? 'text-[#1e3a8a]' : 'text-[#b91c1c]'
                  }`}
                >
                  {step2ProcChoice === 'review'
                    ? '정확합니다! 필수 헌법 절차인 국회 동의를 건너뛰었는지는 헌법재판소가 심사할 수 있습니다.'
                    : '주의: 통치행위라도 헌법이 명문으로 정한 국회 동의 절차 위반까지 심사가 배제되지는 않습니다.'}
                </p>
              )}
            </div>
          </div>

          {/* 핵심 법리 확인 박스 */}
          <div className="bg-white border border-[#cbd5e1] border-l-4 border-l-[#1e3a8a] p-4 text-xs md:text-sm text-[#1e293b] leading-relaxed">
            <strong className="text-[#1e3a8a] font-extrabold mr-1.5">
              핵심 법리 확인 (2003헌마814 대조):
            </strong>
            과거 이라크 파병 결정(2003헌마814)이 심판을 자제한 것은{' '}
            <strong className="text-[#0f172a] underline decoration-[#93c5fd] decoration-2">
              ‘국회 동의 등 헌법과 법률이 정한 절차를 지킨 것이 명백한 경우’
            </strong>
            가 전제였으므로, 국회 동의를 건너뛴 절차 위반은 헌재가 심사할 수 있음.
          </div>
        </div>

        {/* ---------- 3단계 : 청구인 스위치 시뮬레이터 (국회 전체 vs 의원 丙·丁 개인) ---------- */}
        <div className="border border-[#cbd5e1] bg-[#f8fafc] p-5 md:p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#cbd5e1] pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold bg-[#0f172a] text-white px-2.5 py-1 tabular-nums">
                3단계
              </span>
              <h3 className="text-lg font-extrabold text-[#0f172a]">
                청구인 스위치 시뮬레이터 : 누가 권한쟁의심판을 청구하는가?
              </h3>
            </div>

            {/* 상단 토글 스위치 */}
            <div className="inline-flex bg-white p-1 border border-[#cbd5e1] self-start">
              {(
                [
                  { id: 'assembly', label: '청구인 A : 국회 (본회의 의결)' },
                  { id: 'members', label: '청구인 B : 야당 의원 丙·丁 개인' },
                ] as const
              ).map((tab) => {
                const active = claimantMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setClaimantMode(tab.id)}
                    className={`relative px-3.5 py-2 text-xs md:text-sm font-extrabold transition-colors ${
                      active ? 'text-white' : 'text-[#475569] hover:text-[#0f172a]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="claimantSwitchPill"
                        transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                        className={`absolute inset-0 ${
                          tab.id === 'assembly' ? 'bg-[#1e3a8a]' : 'bg-[#b91c1c]'
                        }`}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 실시간 시각적 심판 경로 다이어그램 (SVG) */}
          <div className="bg-white border border-[#cbd5e1] p-4">
            <svg
              viewBox="0 0 820 210"
              className="w-full h-auto"
              role="img"
              aria-label="권한쟁의심판 청구 주체별 심판 경로 다이어그램"
            >
              <defs>
                <marker
                  id="arrow-navy"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#1e3a8a" />
                </marker>
                <marker
                  id="arrow-muted"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#cbd5e1" />
                </marker>
              </defs>

              {/* 좌측 국회 울타리 */}
              <rect
                x="14"
                y="14"
                width="260"
                height="182"
                rx="4"
                fill="#f8fafc"
                stroke={claimantMode === 'assembly' ? '#1e3a8a' : '#94a3b8'}
                strokeWidth={claimantMode === 'assembly' ? '2.5' : '1.5'}
              />
              <text
                x="144"
                y="37"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="14"
                fontWeight="800"
              >
                국회 영역 (제60조② 동의권 귀속)
              </text>

              {/* 청구인 A 박스 : 국회 전체 */}
              <g
                onClick={() => setClaimantMode('assembly')}
                className="cursor-pointer"
              >
                <rect
                  x="30"
                  y="50"
                  width="228"
                  height="54"
                  rx="2"
                  fill={claimantMode === 'assembly' ? '#eff6ff' : '#ffffff'}
                  stroke={claimantMode === 'assembly' ? '#1e3a8a' : '#cbd5e1'}
                  strokeWidth={claimantMode === 'assembly' ? '2' : '1'}
                />
                <text
                  x="144"
                  y="73"
                  textAnchor="middle"
                  fill={claimantMode === 'assembly' ? '#1e3a8a' : '#475569'}
                  fontSize="13.5"
                  fontWeight="800"
                >
                  청구인 A · 국회 (본회의 의결)
                </text>
                <text
                  x="144"
                  y="92"
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="11.5"
                  fontWeight="600"
                >
                  파병동의권의 주체 (자기 권한 O)
                </text>
              </g>

              {/* 대내적 심의·표결 점선 */}
              <text
                x="144"
                y="121"
                textAnchor="middle"
                fill="#64748b"
                fontSize="11"
                fontWeight="700"
              >
                심의·표결권 (국회 내부 관계 한정)
              </text>

              {/* 청구인 B 박스 : 개별 의원 */}
              <g
                onClick={() => setClaimantMode('members')}
                className="cursor-pointer"
              >
                <rect
                  x="30"
                  y="130"
                  width="228"
                  height="54"
                  rx="2"
                  fill={claimantMode === 'members' ? '#fef2f2' : '#ffffff'}
                  stroke={claimantMode === 'members' ? '#b91c1c' : '#cbd5e1'}
                  strokeWidth={claimantMode === 'members' ? '2' : '1'}
                />
                <text
                  x="144"
                  y="153"
                  textAnchor="middle"
                  fill={claimantMode === 'members' ? '#b91c1c' : '#475569'}
                  fontSize="13.5"
                  fontWeight="800"
                >
                  청구인 B · 야당 의원 丙·丁 개인
                </text>
                <text
                  x="144"
                  y="172"
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="11.5"
                  fontWeight="600"
                >
                  구성원 개인 (동의권 주체 아님)
                </text>
              </g>

              {/* 경로 A 화살표 (국회 → 대통령 처분 다툼 → 헌재 본안) */}
              <line
                x1="258"
                y1="77"
                x2="556"
                y2="77"
                stroke={claimantMode === 'assembly' ? '#1e3a8a' : '#cbd5e1'}
                strokeWidth={claimantMode === 'assembly' ? '3' : '1.5'}
                markerEnd={
                  claimantMode === 'assembly'
                    ? 'url(#arrow-navy)'
                    : 'url(#arrow-muted)'
                }
              />
              <rect
                x="325"
                y="50"
                width="176"
                height="24"
                rx="2"
                fill={claimantMode === 'assembly' ? '#1e3a8a' : '#f1f5f9'}
              />
              <text
                x="413"
                y="66"
                textAnchor="middle"
                fill={claimantMode === 'assembly' ? '#ffffff' : '#94a3b8'}
                fontSize="11.5"
                fontWeight="800"
              >
                자기 권한 침해위험 → 적법 통과
              </text>

              {/* 경로 B 차단선 (의원 개인 → X 차단) */}
              <line
                x1="258"
                y1="157"
                x2="410"
                y2="157"
                stroke={claimantMode === 'members' ? '#b91c1c' : '#cbd5e1'}
                strokeWidth={claimantMode === 'members' ? '3' : '1.5'}
                strokeDasharray={claimantMode === 'members' ? '0' : '4,4'}
              />
              <circle
                cx="416"
                cy="157"
                r="13"
                fill={claimantMode === 'members' ? '#b91c1c' : '#cbd5e1'}
              />
              <text
                x="416"
                y="162"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="13"
                fontWeight="800"
              >
                ✕
              </text>
              <text
                x="416"
                y="188"
                textAnchor="middle"
                fill={claimantMode === 'members' ? '#b91c1c' : '#94a3b8'}
                fontSize="11.5"
                fontWeight="800"
              >
                제3자 소송담당 불허 · 대내성 한계
              </text>

              {/* 우측 헌법재판소 심판 결과 박스 */}
              <rect
                x="566"
                y="30"
                width="238"
                height="150"
                rx="3"
                fill={claimantMode === 'assembly' ? '#eff6ff' : '#fef2f2'}
                stroke={claimantMode === 'assembly' ? '#1e3a8a' : '#b91c1c'}
                strokeWidth="2.5"
              />
              <text
                x="685"
                y="62"
                textAnchor="middle"
                fill="#0f172a"
                fontSize="13"
                fontWeight="800"
              >
                헌법재판소 (피청구인: 대통령 甲)
              </text>
              <text
                x="685"
                y="84"
                textAnchor="middle"
                fill="#475569"
                fontSize="11.5"
                fontWeight="600"
              >
                대상: 2026. 8. 30. 파병결정
              </text>
              <rect
                x="588"
                y="102"
                width="194"
                height="56"
                rx="2"
                fill={claimantMode === 'assembly' ? '#1e3a8a' : '#b91c1c'}
              />
              <text
                x="685"
                y="127"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="14.5"
                fontWeight="800"
              >
                {claimantMode === 'assembly'
                  ? '적법 · 본안 판단 가능'
                  : '부적법 각하 (2011헌라2)'}
              </text>
              <text
                x="685"
                y="146"
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="11"
                fontWeight="600"
              >
                {claimantMode === 'assembly'
                  ? '동의권 침해 및 무효 확인 심리'
                  : '본안 진입 불가 (11주차 서리 사건 동일)'}
              </text>
            </svg>
          </div>

          <AnimatePresence mode="wait">
            {claimantMode === 'assembly' ? (
              <motion.div
                key="assembly"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="bg-white border border-[#93c5fd] p-4">
                    <div className="text-[11px] font-extrabold text-[#1e3a8a] mb-1">
                      01 · 청구 주체 적격
                    </div>
                    <div className="text-sm font-extrabold text-[#0f172a] mb-1">
                      국회 전체 (본회의 의결)
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      헌법 제60조 제2항 국군 해외파견 동의권의 고유한 주인 (자기 권한 O)
                    </p>
                  </div>

                  <div className="bg-white border border-[#93c5fd] p-4">
                    <div className="text-[11px] font-extrabold text-[#1e3a8a] mb-1">
                      02 · 피청구인 및 처분
                    </div>
                    <div className="text-sm font-extrabold text-[#0f172a] mb-1">
                      대통령 甲 · 8. 30. 파병결정
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      파병 강행 의사 확정으로 국회의 동의권을 침해할 현저한 위험 인정 여지
                    </p>
                  </div>

                  <div className="bg-white border border-[#93c5fd] p-4">
                    <div className="text-[11px] font-extrabold text-[#1e3a8a] mb-1">
                      03 · 청구기간 요건
                    </div>
                    <div className="text-sm font-extrabold text-[#0f172a] mb-1 tabular-nums">
                      안 날부터 60일 이내 등
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      헌법재판소법상 청구기간(있은 날부터 180일 이내) 준수 시 적법요건 통과
                    </p>
                  </div>

                  <div className="bg-[#eff6ff] border-2 border-[#1e3a8a] p-4 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-[#1e3a8a] text-white px-2 py-0.5 mb-1.5">
                        <CheckCircle2 className="w-3 h-3" />
                        최종 경로 판정
                      </div>
                      <div className="text-base font-extrabold text-[#1e3a8a] mb-1">
                        적법 · 본안 판단 가능
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-[#0f172a] leading-relaxed">
                      헌재가 국회의 파병동의권 침해 확인 및 파병결정 무효 확인 등 심판 가능
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                  {/* 좌측 두 개의 막히는 경로 */}
                  <div className="lg:col-span-8 space-y-3">
                    <div className="bg-white border border-[#fca5a5] border-l-4 border-l-[#b91c1c] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#b91c1c]">
                          <Ban className="w-3.5 h-3.5" />
                          막히는 길 1 · ‘국회 파병동의권’ 침해를 주장할 때
                        </span>
                        <span className="text-[11px] font-extrabold bg-[#fef2f2] text-[#b91c1c] border border-[#fca5a5] px-2 py-0.5">
                          제3자 소송담당 불허
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#0f172a] mb-1">
                        남의 권리를 대신 소송 걸 수 없음
                      </p>
                      <p className="text-xs text-[#475569] leading-relaxed">
                        제60조 제2항 파병동의권의 주인은 ‘국회 전체’이지 구성원 개인이 아니므로, 법률상 명문 규정이 없는 한 의원 丙·丁이 국회를 대신해 청구할 수 없음 (2005헌라8 · 2011헌라2).
                      </p>
                    </div>

                    <div className="bg-white border border-[#fca5a5] border-l-4 border-l-[#b91c1c] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#b91c1c]">
                          <Ban className="w-3.5 h-3.5" />
                          막히는 길 2 · ‘의원 심의·표결권’ 침해를 주장할 때
                        </span>
                        <span className="text-[11px] font-extrabold bg-[#fef2f2] text-[#b91c1c] border border-[#fca5a5] px-2 py-0.5">
                          대내적 권한 한계
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#0f172a] mb-1">
                        심의·표결권은 국회 안에서만(의장 등 상대) 쓰는 내부 권리
                      </p>
                      <p className="text-xs text-[#475569] leading-relaxed">
                        개별 의원의 심의·표결권은 국회 내부 관계에서만 행사·침해될 뿐, 외부 국가기관인 대통령의 파병결정에 의해 직접 침해될 가능성이 없음 (2011헌라2).
                      </p>
                    </div>
                  </div>

                  {/* 우측 최종 각하 결론 카드 */}
                  <div className="lg:col-span-4 bg-[#fef2f2] border-2 border-[#b91c1c] p-5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold bg-[#b91c1c] text-white px-2.5 py-0.5">
                        <XCircle className="w-3.5 h-3.5" />
                        최종 경로 판정
                      </span>
                      <h4 className="text-xl font-extrabold text-[#b91c1c]">
                        부적법 각하
                      </h4>
                      <p className="text-xs font-semibold text-[#0f172a] leading-relaxed">
                        두 경로 모두 적법요건(청구인적격·권한침해가능성)을 통과하지 못해 본안 판단 진입 불가
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#fca5a5] text-xs text-[#334155] leading-relaxed">
                      <strong className="text-[#991b1b] font-extrabold block mb-0.5">
                        앞 주차 수업 연결 브릿지:
                      </strong>
                      11주차 수업 국무총리 서리 사건 각하 논리 및 조약 동의권 판례(2005헌라8 · 2011헌라2)와 동일 구조
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ==================== 3. 서술형 4단 답안 빌더 & AI 1:1 코칭 연결 ==================== */}
      <section className="bg-white border border-[#cbd5e1] border-t-[3px] border-t-[#0f172a] p-6 md:p-8 shadow-sm space-y-8">
        {/* 모범 4단 구성 */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#e2e8f0] pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1e3a8a] mb-1">
                <Scale className="w-3.5 h-3.5" />
                서술형 답안 구성 · 모범 4단 목차 및 셀프 체크
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#0f172a]">
                서술형 4단 답안 빌더 & 실시간 법리 체크리스트
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setClozeActive((prev) => !prev);
                  setRevealedBlankKeys([]);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold border transition-colors ${
                  clozeActive
                    ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                    : 'bg-[#f8fafc] text-[#0f172a] border-[#cbd5e1] hover:border-[#1e3a8a]'
                }`}
              >
                {clozeActive ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>모범 문장 전체 펼치기</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>핵심 키워드 빈칸 가리기</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {clozeActive && (
            <div className="text-xs font-semibold text-[#64748b] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#1e3a8a]" />
              <span>
                가려진 파란 빈칸을 클릭하면 개별 핵심 키워드를 하나씩 확인하며 암기할 수 있습니다.
              </span>
            </div>
          )}

          <div className="space-y-3">
            {MODEL_ESSAY_SECTIONS.map((sec) => (
              <div
                key={sec.roman}
                className="grid grid-cols-1 md:grid-cols-12 border border-[#cbd5e1] bg-white"
              >
                <div className="md:col-span-3 bg-[#f1f5f9] border-b md:border-b-0 md:border-r border-[#cbd5e1] p-4 flex items-center gap-2">
                  <span className="text-sm font-extrabold text-[#1e3a8a]">
                    {sec.roman}.
                  </span>
                  <span className="text-sm font-extrabold text-[#0f172a]">
                    {sec.title}
                  </span>
                </div>
                <div className="md:col-span-9 p-4 text-sm text-[#1e293b] leading-relaxed">
                  {sec.segments.map((seg, idx) => {
                    if (!seg.isKeyword) {
                      return <span key={idx}>{seg.text}</span>;
                    }
                    const blankKey = `${sec.roman}-${idx}`;
                    const isShown = !clozeActive || revealedBlankKeys.includes(blankKey);

                    if (isShown) {
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => clozeActive && toggleBlankKey(blankKey)}
                          className={`inline font-extrabold text-[#1e3a8a] bg-[#eff6ff] border-b-2 border-[#93c5fd] px-1 mx-0.5 ${
                            clozeActive ? 'cursor-pointer hover:bg-[#dbeafe]' : 'cursor-default'
                          }`}
                        >
                          {seg.text}
                        </button>
                      );
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleBlankKey(blankKey)}
                        className="inline-flex items-center px-2.5 py-0.5 mx-0.5 text-xs font-extrabold bg-[#eff6ff] text-[#1e3a8a] border border-dashed border-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-colors"
                      >
                        핵심 법리 확인
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 선택형 연습장 + 실시간 키워드 점등 체크리스트 */}
        <div className="border border-[#cbd5e1] bg-[#f8fafc] p-5 md:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PenLine className="w-4 h-4 text-[#1e3a8a]" />
              <h3 className="text-base md:text-lg font-extrabold text-[#0f172a]">
                선택형 답안 연습장 (짧은 3~4문장 초안도 실시간 채점 기준 체크)
              </h3>
            </div>
            <span className="text-xs font-extrabold text-[#1e3a8a] bg-white border border-[#93c5fd] px-2.5 py-1 tabular-nums">
              핵심 법리 반영 {matchedCount} / {ESSAY_CHECKLIST_ITEMS.length}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7 space-y-2">
              <textarea
                rows={7}
                value={essayDraft}
                onChange={(e) => onChangeEssayDraft(e.target.value)}
                placeholder="예: 파병협정(제60조 1항)과 실제 국군 파견(제60조 2항)은 별개이며 시간 부족으로 사전동의를 생략할 예외는 없다. 이라크 파병(2003헌마814)은 절차 준수가 전제였으므로 절차 위반은 심사 가능하며, 국회가 청구하면 적법하나 의원 丙·丁 청구는 제3자 소송담당 불허 및 심의·표결권 대내성으로 각하된다."
                className="w-full border border-[#cbd5e1] bg-white p-4 text-sm text-[#0f172a] leading-relaxed focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] placeholder:text-[#94a3b8]"
              />
              <div className="flex items-center justify-between text-xs text-[#64748b] tabular-nums">
                <span>작성 내용은 브라우저에 자동 저장되며 AI 복습 코치와 연동됩니다.</span>
                <span>{essayDraft.length}자</span>
              </div>
            </div>

            {/* 우측 5개 자동 점등 체크리스트 */}
            <div className="lg:col-span-5 space-y-2">
              <div className="text-xs font-extrabold text-[#475569] mb-1">
                실시간 핵심 법리 키워드 점등 체크리스트
              </div>
              {checklistStatus.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 border transition-all flex items-start gap-2.5 ${
                    item.matched
                      ? 'bg-[#eff6ff] border-[#1e3a8a] shadow-sm'
                      : 'bg-white border-[#e2e8f0]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center border ${
                      item.matched
                        ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white'
                        : 'bg-[#f8fafc] border-[#cbd5e1] text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-extrabold ${
                        item.matched ? 'text-[#1e3a8a]' : 'text-[#0f172a]'
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#64748b] leading-snug mt-0.5">
                      {item.hint}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 AI 코칭 액션 버튼 2개 */}
          <div className="pt-3 border-t border-[#cbd5e1] flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopyDraftCoaching}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] transition-colors"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>내 초안으로 AI 1:1 첨삭 프롬프트 복사</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleBlankGuidedStart}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-extrabold bg-white text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#eff6ff] transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>백지 상태에서 AI와 단계별 문답 시작하기</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
