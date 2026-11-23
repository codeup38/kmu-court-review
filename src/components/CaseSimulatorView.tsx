import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import {
  CASE_PROMPT_QUESTION,
  CASE_SEGMENTS,
  ESSAY_CHECKLIST_ITEMS,
  MODEL_ESSAY_SECTIONS,
  TIMELINE_NODES,
} from '../data/caseData';
import { InstantPromptModalData } from '../types';
import {
  buildCaseDraftFeedbackPrompt,
  buildCaseGuidedPrompt,
} from '../utils/promptEngine';

interface CaseSimulatorViewProps {
  essayDraft: string;
  onChangeEssayDraft: (val: string) => void;
  onTriggerInstantPrompt: (data: InstantPromptModalData) => void;
}

const CASE_STEPS = [
  { id: 0, label: '1. 문제 읽기' },
  { id: 1, label: '2. 타임라인 분석' },
  { id: 2, label: '3. 핵심 쟁점 정리' },
  { id: 3, label: '4. 4단 답안 완성' },
];

export const CaseSimulatorView: React.FC<CaseSimulatorViewProps> = ({
  essayDraft,
  onChangeEssayDraft,
  onTriggerInstantPrompt,
}) => {
  const [stepIdx, setStepIdx] = useState<number>(0);

  // Step 2: 타임라인 선택
  const [activeTimelineId, setActiveTimelineId] = useState<string>('t1');

  // Step 3: 핵심 쟁점 체크
  const [step1Q1, setStep1Q1] = useState<number | null>(null);
  const [step1Q2, setStep1Q2] = useState<'possible' | 'impossible' | null>(null);
  const [step2Policy, setStep2Policy] = useState<'restraint' | 'review' | null>(
    null
  );
  const [step2Proc, setStep2Proc] = useState<'restraint' | 'review' | null>(
    null
  );
  const [claimantMode, setClaimantMode] = useState<'assembly' | 'members'>(
    'assembly'
  );

  // Step 4: 4단 답안 빈칸 및 초안 입력
  const [clozeActive, setClozeActive] = useState<boolean>(false);
  const [revealedBlankKeys, setRevealedBlankKeys] = useState<string[]>([]);
  const [practiceOpen, setPracticeOpen] = useState<boolean>(false);

  const selectedTimeline =
    TIMELINE_NODES.find((t) => t.id === activeTimelineId) ?? TIMELINE_NODES[0];

  const goStep = (next: number) => {
    setStepIdx(next);
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

  const handleOpenDraftFeedback = () => {
    onTriggerInstantPrompt({
      title: '해외파병 사례형 — 내 답안 초안 AI 첨삭',
      subtitle: '수업 채점 기준(제60조①·②, 2003헌마814, 2011헌라2) 기반 피드백',
      placeholder:
        '예: 제3자 소송담당 부분을 내가 맞게 쓴 건지 특히 봐줘 (선택)',
      buildPrompt: (userNote: string) =>
        essayDraft.trim().length > 0
          ? buildCaseDraftFeedbackPrompt(essayDraft, userNote)
          : buildCaseGuidedPrompt(userNote),
    });
  };

  const handleOpenGuidedQA = () => {
    onTriggerInstantPrompt({
      title: '해외파병 사례형 — 백지 상태 단계별 AI 문답',
      subtitle: '모범답안 스포일러 없이 1단계부터 차근차근 연습',
      placeholder:
        '예: 어디서부터 목차를 잡아야 할지 감이 안 잡혀서 1단계부터 천천히 물어봐 줘 (선택)',
      buildPrompt: (userNote: string) => buildCaseGuidedPrompt(userNote),
    });
  };

  return (
    <div className="space-y-6">
      {/* 상단 4단계 탭 (즉시 전환, 버그 원천 차단) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {CASE_STEPS.map((s) => {
            const active = stepIdx === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goStep(s.id)}
                className={`relative px-3.5 py-2.5 rounded-lg text-sm sm:text-[15px] font-bold text-center transition-colors ${
                  active
                    ? 'text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="caseStepPill"
                    transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                    className="absolute inset-0 bg-[#0f172a] rounded-lg"
                  />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== 1단계 : 담백한 문제 원문 먼저 읽기 ==================== */}
      {stepIdx === 0 && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-7">
          <div className="border-b-2 border-[#0f172a] pb-4 space-y-1">
            <span className="text-sm font-extrabold text-[#1e3a8a] block">
              사법부 사례형 문항
            </span>
            <h2 className="text-2xl sm:text-[27px] font-extrabold text-[#0f172a] tracking-tight">
              먼저 사례 문제의 원문과 설문을 읽어보세요
            </h2>
          </div>

          <div className="rounded-xl border-2 border-slate-800 bg-white p-6 sm:p-8 space-y-6">
            <div className="space-y-4 text-[17px] sm:text-[18.5px] leading-[1.82] text-[#0f172a]">
              {[1, 2].map((paraNum) => (
                <p key={paraNum}>
                  {CASE_SEGMENTS.filter((s) => s.paragraph === paraNum)
                    .map((s) => s.text)
                    .join('')}
                </p>
              ))}
            </div>

            <div className="bg-[#eff6ff] border-l-[5px] border-l-[#1e3a8a] rounded-r-lg px-5 py-4 text-[17.5px] sm:text-[19.5px] font-extrabold text-[#0f172a] leading-snug">
              {CASE_PROMPT_QUESTION}
            </div>
          </div>

          <p className="text-[15.5px] text-slate-600 leading-relaxed">
            원문을 한 번 읽으셨다면, 다음 단계에서 복잡한 날짜별 사건을 타임라인으로 나누어 어떤 행위가 진짜 심판대상인지 정리해 봅니다.
          </p>
        </section>
      )}

      {/* ==================== 2단계 : 타임라인으로 사실관계 분석 ==================== */}
      {stepIdx === 1 && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-7">
          <div className="border-b-2 border-[#0f172a] pb-4 space-y-1">
            <span className="text-sm font-extrabold text-[#1e3a8a] block">
              사건 정리 · 날짜별 사실관계와 법적 의미
            </span>
            <h2 className="text-2xl sm:text-[27px] font-extrabold text-[#0f172a] tracking-tight">
              타임라인을 눌러 시점별 쟁점을 확인해 보세요
            </h2>
          </div>

          {/* 4개 날짜 선택 버튼 */}
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

          {/* 선택 시점 법적 포인트 */}
          <div
            className={`rounded-xl p-5 sm:p-6 border-l-[5px] space-y-2 ${
              selectedTimeline.isCoreTarget
                ? 'bg-[#fef2f2] border border-[#fca5a5] border-l-[#b91c1c]'
                : 'bg-[#f8fafc] border border-slate-200 border-l-[#1e3a8a]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`text-base font-extrabold tabular-nums ${
                  selectedTimeline.isCoreTarget
                    ? 'text-[#b91c1c]'
                    : 'text-[#1e3a8a]'
                }`}
              >
                {selectedTimeline.dateLabel} · {selectedTimeline.legalPointTitle}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-500 tabular-nums">
                {selectedTimeline.provisionBadge}
              </span>
            </div>
            <p className="text-[16px] sm:text-[17px] text-slate-800 leading-[1.72]">
              {selectedTimeline.legalPointBody}
            </p>
          </div>

          {/* 지문 내 해당 문장 밑줄 연동 */}
          <div className="rounded-xl border border-slate-300 bg-white p-6 sm:p-7 space-y-4 text-[16.5px] sm:text-[17.5px] leading-[1.78] text-[#0f172a]">
            {[1, 2].map((paraNum) => (
              <p key={paraNum}>
                {CASE_SEGMENTS.filter((s) => s.paragraph === paraNum).map(
                  (seg) => {
                    const isHighlighted = seg.timelineId === activeTimelineId;
                    const isCore = seg.timelineId === 't4';
                    return (
                      <span
                        key={seg.id}
                        onClick={() =>
                          seg.timelineId && setActiveTimelineId(seg.timelineId)
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
        </section>
      )}

      {/* ==================== 3단계 : 핵심 쟁점 3가지 정리 ==================== */}
      {stepIdx === 2 && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-10">
          <div className="border-b-2 border-[#0f172a] pb-4 space-y-1">
            <span className="text-sm font-extrabold text-[#1e3a8a] block">
              사례형 핵심 논점 3단계
            </span>
            <h2 className="text-2xl sm:text-[27px] font-extrabold text-[#0f172a] tracking-tight">
              동의권 분리 → 통치행위 한계 → 청구 주체 비교
            </h2>
          </div>

          {/* 쟁점 1 : 제60조① vs 제60조② */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-[#0f172a]">
              쟁점 1. ‘파병협정 동의(제60조①)’와 ‘실제 파병 동의(제60조②)’는 별개다
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-[15.5px] sm:text-[16.5px] leading-relaxed">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[#0f172a]">
                    <th className="py-3.5 px-4 font-extrabold w-1/5">구분</th>
                    <th className="py-3.5 px-4 font-extrabold w-2/5 border-l border-slate-200">
                      조약 체결·비준 동의 (제60조 제1항)
                    </th>
                    <th className="py-3.5 px-4 font-extrabold w-2/5 border-l border-slate-200 text-[#1e3a8a]">
                      국군 해외파견 동의 (제60조 제2항)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold bg-slate-50">
                      동의 대상
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      중요 국제 약속(안전보장 조약)을 맺는 것
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      <span className="key-underline">
                        우리 군대를 실제로 외국에 보내는 것(사전 동의)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold bg-slate-50">
                      사안 적용
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      비준 예정 서명 단계라면 서명 전 미동의만으로 즉시 무효 단정 불가
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200 font-semibold">
                      표결 무산·시간 부족으로 사전동의를 생략할 헌법상 예외 없음
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-5 space-y-3">
                <p className="text-[16px] font-extrabold text-[#0f172a] leading-snug">
                  5. 20. 협정(비준 예정 서명 단계)은 서명 전 동의가 없어 즉시 무효일까요?
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep1Q1(1)}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-extrabold ${
                      step1Q1 === 1
                        ? 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]'
                        : 'bg-white border-slate-300 hover:border-[#1e3a8a]'
                    }`}
                  >
                    즉시 무효
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep1Q1(2)}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-extrabold ${
                      step1Q1 !== null
                        ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                        : 'bg-white border-slate-300 hover:border-[#1e3a8a]'
                    }`}
                  >
                    무효 단정 불가
                  </button>
                </div>
                {step1Q1 !== null && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    별도 비준이 예정되어 있다면 최종 비준 전에 동의를 받으면 되므로 즉시 무효로 단정할 수 없습니다.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-5 space-y-3">
                <p className="text-[16px] font-extrabold text-[#0f172a] leading-snug">
                  야당의 표결 저지와 시간 부족을 이유로 8. 30. 파병의 사전동의를 생략할 수 있을까요?
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep1Q2('possible')}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-extrabold ${
                      step1Q2 === 'possible'
                        ? 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]'
                        : 'bg-white border-slate-300 hover:border-[#1e3a8a]'
                    }`}
                  >
                    생략 가능
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep1Q2('impossible')}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-extrabold ${
                      step1Q2 !== null
                        ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                        : 'bg-white border-slate-300 hover:border-[#1e3a8a]'
                    }`}
                  >
                    생략 불가
                  </button>
                </div>
                {step1Q2 !== null && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    동의안 제출이나 표결 무산은 동의가 아니며, 시간 부족이나 야당 저지로 사전동의를 생략할 예외는 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 쟁점 2 : 이라크 파병 2003헌마814 대조 */}
          <div className="border-t border-slate-200 pt-8 space-y-4">
            <h3 className="text-xl font-extrabold text-[#0f172a]">
              쟁점 2. 통치행위라도 ‘헌법 절차 위반’은 헌재가 심사한다 (2003헌마814 대조)
            </h3>

            <div className="bg-[#f8fafc] border border-slate-200 border-l-4 border-l-[#1e3a8a] rounded-r-lg p-5 text-[16px] sm:text-[17px] text-[#0f172a] leading-[1.72]">
              과거 이라크 파병 결정(2003헌마814)이 심판을 자제한 것은{' '}
              <span className="key-underline">
                “국회 동의 등 헌법과 법률이 정한 절차를 지켜 이루어진 것임이 명백”
              </span>
              했기 때문이다. 이 사안은 국회 동의를 건너뛰었으므로 전제가 다르다.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="text-sm font-extrabold text-slate-600">
                  ① 중동 파병이 우리나라 국익·안보에 유리한지 여부
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep2Policy('restraint')}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-extrabold ${
                      step2Policy !== null
                        ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                        : 'bg-slate-50 border-slate-300 hover:border-[#1e3a8a]'
                    }`}
                  >
                    사법심사 자제
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep2Policy('review')}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-extrabold ${
                      step2Policy === 'review'
                        ? 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]'
                        : 'bg-slate-50 border-slate-300 hover:border-[#1e3a8a]'
                    }`}
                  >
                    헌재 심사 가능
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="text-sm font-extrabold text-[#1e3a8a]">
                  ② 헌법 제60조 제2항의 국회 동의를 거쳤는지 여부
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep2Proc('restraint')}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-extrabold ${
                      step2Proc === 'restraint'
                        ? 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]'
                        : 'bg-slate-50 border-slate-300 hover:border-[#1e3a8a]'
                    }`}
                  >
                    사법심사 자제
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep2Proc('review')}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-extrabold ${
                      step2Proc !== null
                        ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                        : 'bg-slate-50 border-slate-300 hover:border-[#1e3a8a]'
                    }`}
                  >
                    헌재 심사 가능
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 쟁점 3 : 청구 주체 스위치 (국회 vs 개별 의원) */}
          <div className="border-t border-slate-200 pt-8 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
              <h3 className="text-xl font-extrabold text-[#0f172a]">
                쟁점 3. 누가 권한쟁의심판을 청구하느냐에 따라 결론이 갈린다
              </h3>

              <div className="inline-flex bg-[#f1f5f9] p-1 rounded-lg border border-slate-300 self-start">
                <button
                  type="button"
                  onClick={() => setClaimantMode('assembly')}
                  className={`px-3.5 py-2 rounded-md text-sm font-extrabold transition-colors ${
                    claimantMode === 'assembly'
                      ? 'bg-[#1e3a8a] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  국회 (본회의 의결) 청구
                </button>
                <button
                  type="button"
                  onClick={() => setClaimantMode('members')}
                  className={`px-3.5 py-2 rounded-md text-sm font-extrabold transition-colors ${
                    claimantMode === 'members'
                      ? 'bg-[#b91c1c] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  개별 의원 (丙·丁) 청구
                </button>
              </div>
            </div>

            {claimantMode === 'assembly' ? (
              <div className="rounded-xl border-2 border-[#1e3a8a] bg-[#eff6ff]/45 p-6 space-y-3.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded bg-[#1e3a8a] text-white text-sm font-extrabold">
                    적법 · 본안 판단 가능
                  </span>
                  <span className="text-lg font-extrabold text-[#0f172a]">
                    국회 (본회의 의결) → 대통령 甲 상대
                  </span>
                </div>
                <ul className="space-y-2 text-[16px] sm:text-[17px] text-slate-800 leading-relaxed">
                  <li>
                    • 헌법 제60조 제2항의 파병동의권은{' '}
                    <span className="key-underline">‘국회 전체’의 고유 권한</span>이다.
                  </li>
                  <li>
                    • 파병 강행 의사가 확정된 결정이므로 국회의 동의권을 침해할 현저한 위험이 인정될 여지가 있다.
                  </li>
                  <li>
                    • 청구기간(안 날부터 60일 이내 등)을 지켜 청구하면 헌재가 동의권 침해 및 무효 여부를 본안에서 판단할 수 있다.
                  </li>
                </ul>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-[#b91c1c] bg-[#fef2f2]/45 p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded bg-[#b91c1c] text-white text-sm font-extrabold">
                    부적법 각하
                  </span>
                  <span className="text-lg font-extrabold text-[#0f172a]">
                    개별 의원 丙·丁 청구 시 두 경로 모두 막힘 (2005헌라8 · 2011헌라2)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg border border-[#fca5a5] p-4 space-y-1">
                    <div className="text-xs font-extrabold text-[#b91c1c]">
                      경로 1 · 국회 파병동의권 침해 주장
                    </div>
                    <div className="text-base font-extrabold text-[#0f172a]">
                      제3자 소송담당 불허
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      동의권의 주인은 ‘국회 전체’이므로 의원 개인이 국회를 대신해 소송을 낼 수 없다.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-[#fca5a5] p-4 space-y-1">
                    <div className="text-xs font-extrabold text-[#b91c1c]">
                      경로 2 · 의원 심의·표결권 침해 주장
                    </div>
                    <div className="text-base font-extrabold text-[#0f172a]">
                      심의·표결권의 대내적 한계
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      심의·표결권은 국회 내부(의장 등 상대) 권한이므로 외부 기관인 대통령에 의해 직접 침해될 수 없다.
                    </p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-600">
                  ※ 11주차 수업 국무총리 서리 사건 각하 논리 및 조약 동의권 판례(2011헌라2)와 동일한 구조입니다.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==================== 4단계 : 서술형 4단 답안 완성 ==================== */}
      {stepIdx === 3 && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b-2 border-[#0f172a] pb-4 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-sm font-extrabold text-[#1e3a8a] block">
                사례형 최종 정리
              </span>
              <h2 className="text-2xl sm:text-[27px] font-extrabold text-[#0f172a] tracking-tight">
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
                  <span>모범 답안 전체 보기</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>핵심 키워드 가려보기</span>
                </>
              )}
            </button>
          </div>

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

          {/* AI 서술형 연습 연결 */}
          <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#0f172a]">
                  AI로 서술형 답안 첨삭 · 연습하기
                </h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  짧은 초안을 적어 첨삭 프롬프트를 복사하거나, 백지 상태에서 단계별 문답을 시작할 수 있습니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPracticeOpen((prev) => !prev)}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-white border border-slate-300 text-[#0f172a] hover:border-[#1e3a8a]"
                >
                  {practiceOpen ? '초안 입력 접기' : '내 답안 초안 쓰기'}
                </button>
                <button
                  type="button"
                  onClick={handleOpenGuidedQA}
                  className="px-4 py-2 rounded-lg text-sm font-extrabold bg-[#1e3a8a] text-white hover:bg-[#0f172a] transition-colors"
                >
                  AI와 단계별 문답 시작
                </button>
              </div>
            </div>

            {practiceOpen && (
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <textarea
                  rows={5}
                  value={essayDraft}
                  onChange={(e) => onChangeEssayDraft(e.target.value)}
                  placeholder="3~4문장으로 핵심 흐름만 적어보셔도 됩니다. 작성하면 아래 필수 논점 포함 여부가 자동으로 표시됩니다."
                  className="w-full rounded-xl border border-slate-300 bg-white p-4 text-[16px] text-[#0f172a] leading-relaxed focus:outline-none focus:border-[#1e3a8a]"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-500 mr-1 tabular-nums">
                    반영된 핵심 논점 ({matchedCount}/{ESSAY_CHECKLIST_ITEMS.length}):
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
                    onClick={handleOpenDraftFeedback}
                    className="px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] transition-colors"
                  >
                    내 초안으로 AI 첨삭 프롬프트 만들기
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 하단 정중앙 고정 3열 그리드 단계 이동 바 */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 pt-1">
        <div className="justify-self-start">
          <button
            type="button"
            onClick={() => goStep(Math.max(0, stepIdx - 1))}
            disabled={stepIdx === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold bg-white border border-slate-300 text-slate-700 hover:border-[#0f172a] disabled:opacity-35 disabled:pointer-events-none shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전</span>
          </button>
        </div>

        <div className="justify-self-center text-sm sm:text-base font-extrabold text-slate-600 tabular-nums">
          {stepIdx + 1} / {CASE_STEPS.length}
        </div>

        <div className="justify-self-end">
          <button
            type="button"
            onClick={() =>
              goStep(Math.min(CASE_STEPS.length - 1, stepIdx + 1))
            }
            disabled={stepIdx >= CASE_STEPS.length - 1}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] disabled:opacity-35 disabled:pointer-events-none shadow-sm"
          >
            <span>
              {stepIdx < CASE_STEPS.length - 1 ? '다음 단계' : '완료'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
