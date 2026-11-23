import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
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

const CASE_PAGES = [
  { id: 0, num: '01', label: '사건 원문과 타임라인' },
  { id: 1, num: '02', label: '협정 동의 vs 파병 동의' },
  { id: 2, num: '03', label: '통치행위와 청구 자격' },
  { id: 3, num: '04', label: '서술형 4단 답안 완성' },
];

export const CaseSimulatorView: React.FC<CaseSimulatorViewProps> = ({
  essayDraft,
  onChangeEssayDraft,
  onOpenCoachWithPreset,
  onTriggerInstantPrompt,
}) => {
  const [pageIdx, setPageIdx] = useState<number>(0);

  // Page 01: 타임라인 상태
  const [activeTimelineId, setActiveTimelineId] = useState<string>('t4');

  // Page 02: 1단계 판별 상태
  const [step1Q1Choice, setStep1Q1Choice] = useState<number | null>(null);
  const [step1Q2Choice, setStep1Q2Choice] = useState<
    'possible' | 'impossible' | null
  >(null);

  // Page 03: 2단계·3단계 상태
  const [step2PolicyChoice, setStep2PolicyChoice] = useState<
    'restraint' | 'review' | null
  >(null);
  const [step2ProcChoice, setStep2ProcChoice] = useState<
    'restraint' | 'review' | null
  >(null);
  const [claimantMode, setClaimantMode] = useState<'assembly' | 'members'>(
    'assembly'
  );

  // Page 04: 4단 답안 빈칸 및 연습장 토글
  const [clozeActive, setClozeActive] = useState<boolean>(true);
  const [revealedBlankKeys, setRevealedBlankKeys] = useState<string[]>([]);
  const [practiceOpen, setPracticeOpen] = useState<boolean>(false);

  const selectedTimeline =
    TIMELINE_NODES.find((t) => t.id === activeTimelineId) ?? TIMELINE_NODES[3];

  const goPage = (next: number) => {
    setPageIdx(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBlankKey = (key: string) => {
    setRevealedBlankKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

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
      title: '사례형 백지 상태 단계별 문답 프롬프트',
      subtitle: '모범답안 스포일러 없이 1단계부터 문답으로 연습',
      prompt: guidedPrompt,
    });
  };

  return (
    <div className="space-y-6">
      {/* 상단 4단계 서브 페이지 네비게이션 */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {CASE_PAGES.map((p) => {
            const active = pageIdx === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => goPage(p.id)}
                className={`relative px-4 py-3 rounded-lg text-left transition-colors flex items-center gap-2.5 ${
                  active
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="caseSubPageIndicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-0 bg-[#0f172a] rounded-lg"
                  />
                )}
                <span
                  className={`relative z-10 text-xs font-extrabold tabular-nums ${
                    active ? 'text-[#93c5fd]' : 'text-[#1e3a8a]'
                  }`}
                >
                  {p.num}
                </span>
                <span className="relative z-10 text-sm sm:text-[15px] font-bold truncate">
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ==================== PAGE 01 : 사건 원문과 타임라인 (슬라이드 18 · 19 계승) ==================== */}
        {pageIdx === 0 && (
          <motion.section
            key="case-p0"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-7"
          >
            <div className="border-b-2 border-[#0f172a] pb-4 flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-1">
                <span className="text-sm font-extrabold text-[#1e3a8a] block">
                  사법부 사례형 문항 · 사실관계 분석
                </span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight">
                  해외파병 사례 원문과 날짜별 핵심 포인트
                </h2>
              </div>
              <span className="text-sm font-semibold text-slate-500">
                날짜 탭이나 지문 문장을 눌러 밑줄 포인트를 확인하세요
              </span>
            </div>

            {/* 타임라인 날짜 선택 탭 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {TIMELINE_NODES.map((node) => {
                const isSelected = activeTimelineId === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveTimelineId(node.id)}
                    className={`text-left rounded-lg p-3.5 border transition-all ${
                      isSelected
                        ? node.isCoreTarget
                          ? 'bg-[#fef2f2] border-2 border-[#b91c1c] shadow-sm'
                          : 'bg-[#eff6ff] border-2 border-[#1e3a8a] shadow-sm'
                        : 'bg-[#f8fafc] border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`text-sm font-extrabold tabular-nums mb-1 ${
                        node.isCoreTarget ? 'text-[#b91c1c]' : 'text-[#1e3a8a]'
                      }`}
                    >
                      {node.dateLabel}
                    </div>
                    <div className="text-xs sm:text-[13px] font-semibold text-slate-700 leading-snug">
                      {node.shortTitle}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 시험지 스타일 사례 원문 (여유로운 줄간격과 18px 본문) */}
            <div className="rounded-xl border-2 border-slate-800 bg-white p-6 sm:p-8 space-y-6">
              <div className="space-y-4 text-[17px] sm:text-[18.5px] leading-[1.78] text-[#0f172a]">
                {[1, 2].map((paraNum) => (
                  <p key={paraNum}>
                    {CASE_SEGMENTS.filter((s) => s.paragraph === paraNum).map(
                      (seg) => {
                        const isHighlighted =
                          seg.timelineId === activeTimelineId;
                        const isCore = seg.timelineId === 't4';
                        return (
                          <span
                            key={seg.id}
                            onClick={() =>
                              seg.timelineId &&
                              setActiveTimelineId(seg.timelineId)
                            }
                            className={`cursor-pointer transition-colors rounded-sm ${
                              isHighlighted
                                ? isCore
                                  ? 'bg-[#fee2e2]/80 text-[#991b1b] font-bold border-b-2 border-[#b91c1c] px-0.5'
                                  : 'bg-[#eff6ff] text-[#1e3a8a] font-bold border-b-2 border-[#93c5fd] px-0.5'
                                : 'hover:bg-slate-100'
                            }`}
                          >
                            {seg.text}
                          </span>
                        );
                      }
                    )}
                  </p>
                ))}
              </div>

              <div className="bg-[#eff6ff] border-l-[5px] border-l-[#1e3a8a] rounded-r-lg px-5 py-4 text-[17.5px] sm:text-[19.5px] font-extrabold text-[#0f172a] leading-snug">
                {CASE_PROMPT_QUESTION}
              </div>
            </div>

            {/* 선택된 시점 해설 카드 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTimeline.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className={`rounded-xl p-5 sm:p-6 border-l-[5px] space-y-2 ${
                  selectedTimeline.isCoreTarget
                    ? 'bg-[#fef2f2] border border-[#fca5a5] border-l-[#b91c1c]'
                    : 'bg-[#f8fafc] border border-slate-200 border-l-[#1e3a8a]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`text-sm font-extrabold tabular-nums ${
                      selectedTimeline.isCoreTarget
                        ? 'text-[#b91c1c]'
                        : 'text-[#1e3a8a]'
                    }`}
                  >
                    {selectedTimeline.dateLabel} · {selectedTimeline.legalPointTitle}
                  </span>
                  <span className="text-xs font-bold text-slate-500 tabular-nums">
                    {selectedTimeline.provisionBadge}
                  </span>
                </div>
                <p className="text-[16px] sm:text-[17px] text-slate-800 leading-[1.7]">
                  {selectedTimeline.legalPointBody}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.section>
        )}

        {/* ==================== PAGE 02 : 1단계 · 협정 동의 vs 파병 동의 (슬라이드 20 · 21 계승) ==================== */}
        {pageIdx === 1 && (
          <motion.section
            key="case-p1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-8"
          >
            <div className="border-b-2 border-[#0f172a] pb-4 space-y-1.5">
              <span className="text-sm font-extrabold text-[#1e3a8a] block">
                사례형 1단계 검토 · 행위와 동의권 나누기
              </span>
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight">
                ‘파병협정 동의’와 ‘실제 군대 파견 동의’는 별개다
              </h2>
            </div>

            {/* PPT 20페이지 비교표 */}
            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-[16px] sm:text-[17px] leading-relaxed">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[#0f172a]">
                    <th className="py-4 px-5 font-extrabold w-1/5">구분</th>
                    <th className="py-4 px-5 font-extrabold w-2/5 border-l border-slate-200">
                      조약 체결·비준 동의권 (제60조 제1항)
                    </th>
                    <th className="py-4 px-5 font-extrabold w-2/5 border-l border-slate-200 text-[#1e3a8a]">
                      국군 해외파견 동의권 (제60조 제2항)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="py-4 px-5 font-extrabold bg-slate-50">
                      대통령 권한
                    </td>
                    <td className="py-4 px-5 border-l border-slate-200">
                      조약 체결·비준권 (헌법 제73조)
                    </td>
                    <td className="py-4 px-5 border-l border-slate-200">
                      국군통수권 (헌법 제74조 제1항)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-5 font-extrabold bg-slate-50">
                      동의 대상
                    </td>
                    <td className="py-4 px-5 border-l border-slate-200">
                      국가끼리 <strong>중요한 국제 약속(안전보장 등)</strong>을 맺는 것
                    </td>
                    <td className="py-4 px-5 border-l border-slate-200">
                      <span className="key-underline">
                        우리 군대를 실제로 외국에 보내는 것(사전 동의)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-5 font-extrabold bg-slate-50">
                      사안 적용
                    </td>
                    <td className="py-4 px-5 border-l border-slate-200">
                      비준 예정 서명 단계라면 서명 전 미동의만으로 곧바로 무효 단정 불가
                    </td>
                    <td className="py-4 px-5 border-l border-slate-200 font-semibold text-[#0f172a]">
                      전투병력 파견은 협정과 별도로 제2항의 사전동의가 반드시 필요함
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 직접 눌러 확인하는 2문항 판별 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-6 space-y-4">
                <div className="text-sm font-extrabold text-[#1e3a8a]">
                  점검 01 · 서명 단계 협정의 효력
                </div>
                <p className="text-[17px] font-extrabold text-[#0f172a] leading-snug">
                  5. 20. 파병협정(비준 예정 서명 단계 가정)은 사전동의가 없었다는 이유만으로 즉시 무효일까요?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStep1Q1Choice(1)}
                    className={`py-3 px-4 rounded-lg border text-base font-extrabold transition-all ${
                      step1Q1Choice === 1
                        ? 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]'
                        : 'bg-white border-slate-300 hover:border-[#1e3a8a] text-[#0f172a]'
                    }`}
                  >
                    즉시 당연무효
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep1Q1Choice(2)}
                    className={`py-3 px-4 rounded-lg border text-base font-extrabold transition-all ${
                      step1Q1Choice !== null
                        ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                        : 'bg-white border-slate-300 hover:border-[#1e3a8a] text-[#0f172a]'
                    }`}
                  >
                    즉시 무효 단정 불가
                  </button>
                </div>
                {step1Q1Choice !== null && (
                  <p className="text-[15.5px] text-slate-700 leading-relaxed pt-1">
                    별도의 비준이 예정된 조약이라면 <span className="key-underline">최종 비준 전에만 국회 동의</span>를 받으면 되므로, 丙·丁 주장처럼 서명 전 미동의만으로 곧바로 무효라 단정할 수 없습니다.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-6 space-y-4">
                <div className="text-sm font-extrabold text-[#1e3a8a]">
                  점검 02 · 긴급성·표결 저지와 파병 사전동의
                </div>
                <p className="text-[17px] font-extrabold text-[#0f172a] leading-snug">
                  야당의 표결 저지와 동맹국의 재촉으로 시간이 급했다면 8. 30. 파병의 사전동의를 생략할 수 있을까요?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStep1Q2Choice('possible')}
                    className={`py-3 px-4 rounded-lg border text-base font-extrabold transition-all ${
                      step1Q2Choice === 'possible'
                        ? 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]'
                        : 'bg-white border-slate-300 hover:border-[#1e3a8a] text-[#0f172a]'
                    }`}
                  >
                    생략 가능
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep1Q2Choice('impossible')}
                    className={`py-3 px-4 rounded-lg border text-base font-extrabold transition-all ${
                      step1Q2Choice !== null
                        ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                        : 'bg-white border-slate-300 hover:border-[#1e3a8a] text-[#0f172a]'
                    }`}
                  >
                    생략 절대 불가
                  </button>
                </div>
                {step1Q2Choice !== null && (
                  <p className="text-[15.5px] text-slate-700 leading-relaxed pt-1">
                    동의안 제출이나 표결 무산은 동의가 아니며, 시간 부족이나 야당 실력 저지를 이유로 <span className="key-underline">헌법 제60조 제2항의 사전동의를 생략할 예외 규정</span>은 없습니다.
                  </p>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* ==================== PAGE 03 : 2·3단계 · 통치행위와 청구 자격 (슬라이드 22~25 계승) ==================== */}
        {pageIdx === 2 && (
          <motion.section
            key="case-p2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-10"
          >
            <div className="border-b-2 border-[#0f172a] pb-4 space-y-1.5">
              <span className="text-sm font-extrabold text-[#1e3a8a] block">
                사례형 2 · 3단계 검토 · 사법심사 범위와 청구인 적격
              </span>
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight">
                헌재는 무엇을 심사할 수 있고, 누가 청구해야 적법한가?
              </h2>
            </div>

            {/* 2단계 : 이라크 파병(2003헌마814) 대조 및 심사 범위 분리 */}
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-[#0f172a]">
                1. 통치행위와 심사 범위 (이라크 파병 2003헌마814 결정 대조)
              </h3>

              <div className="bg-[#f8fafc] border border-slate-200 border-l-[5px] border-l-[#1e3a8a] rounded-r-xl p-5 sm:p-6 text-[16.5px] sm:text-[17.5px] text-[#0f172a] leading-[1.72]">
                이라크 파병 결정(2003헌마814)이 사법심사를 자제한 것은{' '}
                <span className="key-underline">
                  “국회 동의 등 헌법과 법률이 정한 절차를 지켜 이루어진 것임이 명백”
                </span>
                했기 때문이다. 따라서 정책의 유불리와 헌법 절차 위반은 나누어 판단한다.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3">
                  <div className="text-sm font-extrabold text-slate-500">
                    영역 A · 중동 파병이 국익·안보에 유리한지 여부
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setStep2PolicyChoice('restraint')}
                      className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-extrabold transition-all ${
                        step2PolicyChoice !== null
                          ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                          : 'bg-slate-50 border-slate-300 hover:border-[#1e3a8a]'
                      }`}
                    >
                      사법심사 자제
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep2PolicyChoice('review')}
                      className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-extrabold transition-all ${
                        step2PolicyChoice === 'review'
                          ? 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]'
                          : 'bg-slate-50 border-slate-300 hover:border-[#1e3a8a]'
                      }`}
                    >
                      헌재 심사 가능
                    </button>
                  </div>
                  {step2PolicyChoice !== null && (
                    <p className="text-[15px] text-slate-600 leading-relaxed">
                      외교·군사적 유불리는 대통령과 국회가 정치적 책임을 지고 결단할 영역이므로 판단을 자제합니다.
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3">
                  <div className="text-sm font-extrabold text-[#1e3a8a]">
                    영역 B · 헌법 제60조 제2항의 국회 동의를 거쳤는지 여부
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setStep2ProcChoice('restraint')}
                      className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-extrabold transition-all ${
                        step2ProcChoice === 'restraint'
                          ? 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]'
                          : 'bg-slate-50 border-slate-300 hover:border-[#1e3a8a]'
                      }`}
                    >
                      사법심사 자제
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep2ProcChoice('review')}
                      className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-extrabold transition-all ${
                        step2ProcChoice !== null
                          ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                          : 'bg-slate-50 border-slate-300 hover:border-[#1e3a8a]'
                      }`}
                    >
                      헌재 심사 가능
                    </button>
                  </div>
                  {step2ProcChoice !== null && (
                    <p className="text-[15px] text-slate-700 leading-relaxed">
                      국회 동의가 없으므로 이라크 판례와 전제가 다르며, 헌법상 절차 위반 여부는 심사할 수 있습니다.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3단계 : 청구인 스위치 시뮬레이터 (국회 전체 vs 의원 丙·丁 개인) */}
            <div className="border-t border-slate-200 pt-8 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-extrabold text-[#0f172a]">
                  2. 청구 주체에 따라 갈리는 결론 (스위치를 눌러 비교)
                </h3>

                <div className="inline-flex bg-[#f1f5f9] p-1 rounded-lg border border-slate-300 self-start">
                  {(
                    [
                      { id: 'assembly', label: '국회 (본회의 의결) 청구' },
                      { id: 'members', label: '개별 의원 (丙·丁) 청구' },
                    ] as const
                  ).map((tab) => {
                    const active = claimantMode === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setClaimantMode(tab.id)}
                        className={`relative px-4 py-2 rounded-md text-sm font-extrabold transition-colors ${
                          active ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="cleanClaimantSwitch"
                            transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                            className={`absolute inset-0 rounded-md ${
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

              <AnimatePresence mode="wait">
                {claimantMode === 'assembly' ? (
                  <motion.div
                    key="claim-assembly"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="rounded-xl border-2 border-[#1e3a8a] bg-[#eff6ff]/45 p-6 sm:p-8 space-y-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 rounded bg-[#1e3a8a] text-white text-sm font-extrabold">
                        적법 · 본안 판단 가능
                      </span>
                      <span className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                        국회 (본회의 의결) → 대통령 甲 상대 → 8. 30. 파병결정 다툼
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-[16.5px] sm:text-[17.5px] text-slate-800 leading-[1.7]">
                      <li>
                        • <strong>자기 권한:</strong> 헌법 제60조 제2항의 국군 해외파견 동의권은{' '}
                        <span className="key-underline">‘국회 전체’의 고유 권한</span>이다.
                      </li>
                      <li>
                        • <strong>침해 위험:</strong> 파병 강행 의사가 확정된 결정이므로 국회의 파병동의권을 침해할 현저한 위험이 인정될 여지가 있다.
                      </li>
                      <li>
                        • <strong>결론:</strong> 청구기간(안 날부터 60일 이내 등)을 준수해 청구하면 헌재가 동의권 침해 및 무효 여부를 본안에서 판단할 수 있다.
                      </li>
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div
                    key="claim-members"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="rounded-xl border-2 border-[#b91c1c] bg-[#fef2f2]/45 p-6 sm:p-8 space-y-5"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 rounded bg-[#b91c1c] text-white text-sm font-extrabold">
                        부적법 각하
                      </span>
                      <span className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                        야당 의원 丙·丁 개인 청구 시 두 경로 모두 막힘 (2005헌라8 · 2011헌라2)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg border border-[#fca5a5] p-5 space-y-1.5">
                        <div className="text-sm font-extrabold text-[#b91c1c]">
                          막히는 길 1 · 국회 파병동의권 침해 주장
                        </div>
                        <div className="text-lg font-extrabold text-[#0f172a]">
                          제3자 소송담당 불허
                        </div>
                        <p className="text-[15.5px] text-slate-700 leading-relaxed pt-1">
                          동의권의 주인은 ‘국회 전체’이므로, 법에 특별한 규정이 없는 한 의원 개인이 국회 권한을 대신 다툴 수 없다.
                        </p>
                      </div>

                      <div className="bg-white rounded-lg border border-[#fca5a5] p-5 space-y-1.5">
                        <div className="text-sm font-extrabold text-[#b91c1c]">
                          막히는 길 2 · 의원 심의·표결권 침해 주장
                        </div>
                        <div className="text-lg font-extrabold text-[#0f172a]">
                          심의·표결권의 대내적 한계
                        </div>
                        <p className="text-[15.5px] text-slate-700 leading-relaxed pt-1">
                          심의·표결권은 국회 내부(의장 등 상대)에서만 행사되는 권리일 뿐, 외부 기관인 대통령에 의해 직접 침해될 수 없다.
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-600">
                      ※ 11주차 수업 국무총리 서리 사건 각하 논리 및 조약 동의권 판례(2011헌라2)와 동일한 법리 구조입니다.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {/* ==================== PAGE 04 : 서술형 4단 답안 완성 (슬라이드 26 계승) ==================== */}
        {pageIdx === 3 && (
          <motion.section
            key="case-p3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-8"
          >
            <div className="border-b-2 border-[#0f172a] pb-4 flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-sm font-extrabold text-[#1e3a8a] block">
                  사례형 최종 정리 · 서술형 답안 완성
                </span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight">
                  서술형 답안 4단 구성
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setClozeActive((prev) => !prev);
                  setRevealedBlankKeys([]);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-extrabold border transition-colors ${
                  clozeActive
                    ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                    : 'bg-slate-50 text-[#0f172a] border-slate-300 hover:border-[#0f172a]'
                }`}
              >
                {clozeActive ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>모범 문장 전체 펼치기</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>핵심 법리 빈칸 가리기</span>
                  </>
                )}
              </button>
            </div>

            {/* PPT 26페이지 4단 답안 표 */}
            <div className="divide-y divide-slate-200 border border-slate-300 rounded-xl overflow-hidden">
              {MODEL_ESSAY_SECTIONS.map((sec) => (
                <div
                  key={sec.roman}
                  className="grid grid-cols-1 md:grid-cols-12 bg-white"
                >
                  <div className="md:col-span-3 bg-slate-50 md:border-r border-slate-200 px-5 py-4 flex items-center gap-2 font-extrabold text-[#0f172a] text-[16.5px]">
                    <span className="text-[#1e3a8a]">{sec.roman}.</span>
                    <span>{sec.title}</span>
                  </div>
                  <div className="md:col-span-9 px-6 py-5 text-[16.5px] sm:text-[17.5px] text-slate-800 leading-[1.75]">
                    {sec.segments.map((seg, idx) => {
                      if (!seg.isKeyword) {
                        return <span key={idx}>{seg.text}</span>;
                      }
                      const blankKey = `${sec.roman}-${idx}`;
                      const isShown =
                        !clozeActive || revealedBlankKeys.includes(blankKey);

                      if (isShown) {
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              clozeActive && toggleBlankKey(blankKey)
                            }
                            className={`inline text-left key-underline mx-0.5 ${
                              clozeActive ? 'cursor-pointer' : 'cursor-default'
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
                          className="inline-flex items-center px-3 py-0.5 mx-1 rounded text-sm font-extrabold bg-[#eff6ff] text-[#1e3a8a] border border-dashed border-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-colors"
                        >
                          키워드 확인
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* 깔끔한 접이식 답안 연습장 & AI 첨삭 버튼 */}
            <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0f172a]">
                    AI와 함께 서술형 연습하기
                  </h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    직접 초안을 써서 첨삭받거나, 백지 상태에서 질문에 답하며 연습할 수 있습니다.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPracticeOpen((prev) => !prev)}
                    className="px-4 py-2 rounded-lg text-sm font-bold bg-white border border-slate-300 text-[#0f172a] hover:border-[#1e3a8a]"
                  >
                    {practiceOpen ? '연습장 접기' : '내 답안 초안 써보기'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBlankGuidedStart}
                    className="px-4 py-2 rounded-lg text-sm font-extrabold bg-[#1e3a8a] text-white hover:bg-[#0f172a] transition-colors"
                  >
                    백지 상태에서 AI 문답 시작
                  </button>
                </div>
              </div>

              {practiceOpen && (
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <textarea
                    rows={5}
                    value={essayDraft}
                    onChange={(e) => onChangeEssayDraft(e.target.value)}
                    placeholder="3~4문장으로 핵심 흐름만 적어보셔도 됩니다. 작성하면 아래 필수 키워드가 자동으로 체크됩니다."
                    className="w-full rounded-xl border border-slate-300 bg-white p-4 text-[16px] text-[#0f172a] leading-relaxed focus:outline-none focus:border-[#1e3a8a]"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-500 mr-1 tabular-nums">
                      포함된 핵심 논점 ({matchedCount}/{ESSAY_CHECKLIST_ITEMS.length}):
                    </span>
                    {checklistStatus.map((item) => (
                      <span
                        key={item.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.matched
                            ? 'bg-[#eff6ff] text-[#1e3a8a] ring-1 ring-[#93c5fd]'
                            : 'bg-white text-slate-400 border border-slate-200'
                        }`}
                      >
                        {item.matched && <Check className="w-3 h-3" />}
                        {item.label}
                      </span>
                    ))}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => onOpenCoachWithPreset('case-feedback')}
                      className="px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] transition-colors"
                    >
                      내 초안으로 AI 1:1 첨삭 프롬프트 열기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 하단 이전 / 다음 단계 이동 바 */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => goPage(Math.max(0, pageIdx - 1))}
          disabled={pageIdx === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-white border border-slate-300 text-slate-700 hover:border-[#0f172a] hover:text-[#0f172a] disabled:opacity-35 disabled:pointer-events-none transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전 단계</span>
        </button>

        <span className="text-sm font-extrabold text-slate-500 tabular-nums">
          {pageIdx + 1} / {CASE_PAGES.length}
        </span>

        <button
          type="button"
          onClick={() => goPage(Math.min(CASE_PAGES.length - 1, pageIdx + 1))}
          disabled={pageIdx >= CASE_PAGES.length - 1}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] disabled:opacity-35 disabled:pointer-events-none transition-colors shadow-sm"
        >
          <span>
            {pageIdx < CASE_PAGES.length - 1
              ? `다음: ${CASE_PAGES[pageIdx + 1].label}`
              : '마지막 단계'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
