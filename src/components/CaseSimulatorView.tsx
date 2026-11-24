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

  // Step 2: 타임라인 선택 (기본값 t4 = 8. 30. 심판대상 파병결정)
  const [activeTimelineId, setActiveTimelineId] = useState<string>('t4');

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
    TIMELINE_NODES.find((t) => t.id === activeTimelineId) ?? TIMELINE_NODES[3];

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
      title: '해외파병 사례형 — 탑다운 전체 지도 & 단계별 학습',
      subtitle: '전체 관문 구조도(뼈대)를 먼저 보고 핵심 갈림길 1:1 점검',
      placeholder:
        '예: 통치행위 심사 범위랑 국회·개별의원 청구자격이 나뉘는 부분이 특히 헷갈려 (선택)',
      buildPrompt: (userNote: string) => buildCaseGuidedPrompt(userNote),
    });
  };

  return (
    <div className="space-y-3.5 sm:space-y-6">
      {/* 상단 4단계 탭 (모바일 컴팩트 2x2 · 데스크톱 4열 그대로 유지) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-1.5 sm:p-3 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2">
          {CASE_STEPS.map((s) => {
            const active = stepIdx === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goStep(s.id)}
                className={`relative px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-lg text-[13px] sm:text-[15px] font-bold tracking-tight sm:tracking-normal text-center transition-colors ${
                  active
                    ? 'text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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

      {/* ==================== 1단계 : 담백한 문제 원문 먼저 읽기 (PPT 18페이지) ==================== */}
      {stepIdx === 0 && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] px-4 py-5 sm:p-10 shadow-sm space-y-5 sm:space-y-7">
          <div className="border-b-2 border-[#0f172a] pb-3.5 sm:pb-4 flex flex-wrap items-end justify-between gap-2">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-extrabold text-[#1e3a8a] block">
                사법부 사례형 문항
              </span>
              <h2 className="text-[20px] sm:text-[29px] font-extrabold text-[#0f172a] tracking-tight">
                사례형 문제 원문
              </h2>
            </div>
            <span className="text-xs sm:text-sm font-extrabold bg-[#0f172a] text-white px-2.5 sm:px-3 py-1 rounded">
              해외파병과 권한쟁의심판
            </span>
          </div>

          <div className="rounded-xl border sm:border-2 border-slate-300 sm:border-slate-800 bg-[#f8fafc]/40 sm:bg-white p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-sm">
            <div className="space-y-3.5 sm:space-y-4 text-[15px] sm:text-[19.5px] leading-[1.72] sm:leading-[1.82] text-[#0f172a]">
              <p>
                대한민국 정부는 <strong>2026. 5. 20.</strong> 동맹관계에 있는 A국 정부와{' '}
                <strong>「중동 전쟁 파병에 관한 협정」</strong>(이하 ‘파병협정’이라 한다)을 체결하였다. 그런데 파병협정을 체결한 사실은 2026. 8. 9.이 되어서야 국내에 알려졌고, 야당은 우리나라의 안보와는 아무런 상관도 없는 중동 전쟁에 전투병력을 파병하는 것에 대하여 강력하게 반발하였다.{' '}
                <strong>2026. 8. 12. 야당 소속 국회의원 丙과 丁</strong>은 파병협정의 체결 전에 미리 국회의 동의를 얻어야 하는데도 그러한 절차를 거치지 않았기 때문에 그 체결은 무효라고 주장하였다.
              </p>
              <p>
                <strong>대통령 甲</strong>은 <strong>2026. 8. 18.</strong> 국회에 파병협정에 대한 비준동의안을 제출하면서 <strong>국회의장 乙</strong>에게 신속한 처리를 요청하였다. 국회의장 乙은 <strong>2026. 8. 20.</strong> 열린 국회 본회의에서 파병협정 비준동의안의 처리를 시도하였으나, 야당 의원들의 실력 저지로 인하여 표결을 하지 못하였다. 대통령 甲은 A국 정부로부터 파병협정에 따른 전투병력의 파견을 거듭 재촉받자 시간적인 여유가 없다고 판단하고,{' '}
                <strong>
                  국회의 동의 없이 2026. 8. 30. 국군의 전투병력을 중동 지역에 파견하는 파병결정
                </strong>
                을 내렸다.
              </p>
            </div>

            <div className="bg-[#eff6ff] border-l-[5px] sm:border-l-[6px] border-l-[#1e3a8a] rounded-r-lg px-3.5 py-3 sm:px-5 sm:py-4 text-[15.5px] sm:text-[20.5px] font-extrabold text-[#0f172a] leading-snug">
              {CASE_PROMPT_QUESTION}
            </div>
          </div>

          <p className="text-[13.5px] sm:text-[16px] text-slate-600 leading-relaxed">
            사건 흐름을 읽으셨다면 아래 다음 버튼으로 넘어가 타임라인과 3단계 검토 순서로 쪼개어 분석해 보세요.
          </p>
        </section>
      )}

      {/* ==================== 2단계 : 타임라인으로 사실관계 분석 (PPT 19페이지) ==================== */}
      {stepIdx === 1 && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] px-4 py-5 sm:p-10 shadow-sm space-y-5 sm:space-y-8">
          <div className="border-b-2 border-[#0f172a] pb-3.5 sm:pb-4 space-y-1">
            <span className="text-xs sm:text-sm font-extrabold text-[#1e3a8a] block">
              사례형 · 판단 순서 세우기
            </span>
            <h2 className="text-[20px] sm:text-[29px] font-extrabold text-[#0f172a] tracking-tight leading-[1.35]">
              사건 타임라인과 3단계 검토 순서
            </h2>
          </div>

          <div className="bg-[#f8fafc] border border-slate-300 border-l-[5px] sm:border-l-[6px] border-l-[#1e3a8a] rounded-r-lg px-3.5 py-3 sm:px-5 sm:py-3.5 text-[14.5px] sm:text-[18px] text-[#0f172a] leading-[1.6]">
            지문 하나만 맞히면 되는 객관식과 달리, 사례형은 얽혀 있는 사건을{' '}
            <strong>세 단계 질문 순서</strong>로 쪼개야 풀립니다. 아래 날짜를 눌러 각 시점의 법적 의미를 확인하세요.
          </div>

          {/* PPT 19페이지 타임라인 행 스타일 + 클릭 연동 */}
          <div className="space-y-2 sm:space-y-2.5">
            {TIMELINE_NODES.map((node) => {
              const isSelected = activeTimelineId === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveTimelineId(node.id)}
                  className={`w-full text-left rounded-lg border overflow-hidden transition-all grid grid-cols-1 sm:grid-cols-12 ${
                    isSelected
                      ? node.isCoreTarget
                        ? 'border-2 border-[#b91c1c] shadow-sm'
                        : 'border-2 border-[#1e3a8a] shadow-sm'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div
                    className={`sm:col-span-3 px-3.5 py-2 sm:px-4 sm:py-3.5 font-extrabold text-[14px] sm:text-[17px] flex flex-wrap items-center justify-between gap-1.5 sm:border-r tabular-nums ${
                      isSelected
                        ? node.isCoreTarget
                          ? 'bg-[#b91c1c] text-white border-[#b91c1c]'
                          : 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                        : 'bg-slate-100 text-[#1e3a8a] border-slate-300'
                    }`}
                  >
                    <span>{node.dateLabel}</span>
                    {node.isCoreTarget && (
                      <span
                        className={`text-[11px] px-1.5 py-0.5 rounded font-extrabold ${
                          isSelected
                            ? 'bg-white text-[#b91c1c]'
                            : 'bg-[#b91c1c] text-white'
                        }`}
                      >
                        심판대상
                      </span>
                    )}
                  </div>
                  <div
                    className={`sm:col-span-9 px-3.5 py-2.5 sm:px-5 sm:py-3.5 text-[14.5px] sm:text-[17.5px] flex items-center leading-snug ${
                      isSelected
                        ? node.isCoreTarget
                          ? 'bg-[#fef2f2] font-bold text-[#0f172a]'
                          : 'bg-[#eff6ff] font-bold text-[#0f172a]'
                        : 'bg-white text-[#0f172a]'
                    }`}
                  >
                    {node.shortTitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 선택 시점 법적 포인트 */}
          <div
            className={`rounded-xl p-4 sm:p-6 border-l-[5px] sm:border-l-[6px] space-y-2 ${
              selectedTimeline.isCoreTarget
                ? 'bg-[#fef2f2] border border-[#fca5a5] border-l-[#b91c1c]'
                : 'bg-[#f8fafc] border border-slate-300 border-l-[#1e3a8a]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
              <span
                className={`text-[15.5px] sm:text-[18px] font-extrabold tabular-nums leading-snug ${
                  selectedTimeline.isCoreTarget
                    ? 'text-[#b91c1c]'
                    : 'text-[#1e3a8a]'
                }`}
              >
                [{selectedTimeline.dateLabel}] {selectedTimeline.legalPointTitle}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-500 tabular-nums">
                {selectedTimeline.provisionBadge}
              </span>
            </div>
            <p className="text-[14.5px] sm:text-[18px] text-slate-800 leading-[1.65] sm:leading-[1.72]">
              {selectedTimeline.legalPointBody}
            </p>
          </div>

          {/* 원문 내 해당 문장 밑줄 연동 */}
          <div className="rounded-xl border border-slate-300 bg-white p-4 sm:p-6 space-y-2.5 sm:space-y-3 text-[14.5px] sm:text-[18px] leading-[1.7] sm:leading-[1.78] text-slate-700">
            <div className="text-xs font-extrabold text-slate-400 mb-0.5 sm:mb-1">
              사례 원문 대조 (문장을 직접 클릭해도 시점이 전환됩니다)
            </div>
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
                              ? 'bg-[#fee2e2] text-[#991b1b] font-extrabold border-b-2 border-[#b91c1c] px-0.5'
                              : 'bg-[#eff6ff] text-[#1e3a8a] font-extrabold border-b-2 border-[#1e3a8a] px-0.5'
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

          {/* PPT 19페이지 하단 3단계 검토 플로우 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4 pt-1 sm:pt-2">
            <div className="rounded-lg border border-slate-300 border-t-4 border-t-[#1e3a8a] bg-white p-3.5 sm:p-4">
              <div className="text-xs font-extrabold text-[#1e3a8a] mb-0.5 sm:mb-1">
                1단계 · 행위 구분
              </div>
              <div className="text-[15.5px] sm:text-[17.5px] font-extrabold text-[#0f172a]">
                무엇에 대한 동의인가?
              </div>
              <p className="text-[13.5px] sm:text-[15px] text-slate-600 mt-1">
                협정 체결(제60조①)과 실제 병력 파견(제60조②) 나누기
              </p>
            </div>
            <div className="rounded-lg border border-slate-300 border-t-4 border-t-[#1e3a8a] bg-white p-3.5 sm:p-4">
              <div className="text-xs font-extrabold text-[#1e3a8a] mb-0.5 sm:mb-1">
                2단계 · 심사 범위
              </div>
              <div className="text-[15.5px] sm:text-[17.5px] font-extrabold text-[#0f172a]">
                헌재가 따질 수 있는가?
              </div>
              <p className="text-[13.5px] sm:text-[15px] text-slate-600 mt-1">
                외교적 유불리(자제)와 헌법 절차 위반(심사 가능) 나누기
              </p>
            </div>
            <div className="rounded-lg border border-slate-300 border-t-4 border-t-[#1e3a8a] bg-white p-3.5 sm:p-4">
              <div className="text-xs font-extrabold text-[#1e3a8a] mb-0.5 sm:mb-1">
                3단계 · 청구 자격
              </div>
              <div className="text-[15.5px] sm:text-[17.5px] font-extrabold text-[#0f172a]">
                누가 소송을 걸 수 있는가?
              </div>
              <p className="text-[13.5px] sm:text-[15px] text-slate-600 mt-1">
                ‘국회 전체’의 청구(적법) vs ‘국회의원 개인’의 청구(각하)
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 3단계 : 핵심 쟁점 3가지 정리 (PPT 20~25페이지) ==================== */}
      {stepIdx === 2 && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] px-4 py-5 sm:p-10 shadow-sm space-y-7 sm:space-y-10">
          <div className="border-b-2 border-[#0f172a] pb-3.5 sm:pb-4 space-y-1">
            <span className="text-xs sm:text-sm font-extrabold text-[#1e3a8a] block">
              사례형 핵심 논점 3단계
            </span>
            <h2 className="text-[20px] sm:text-[29px] font-extrabold text-[#0f172a] tracking-tight leading-[1.35]">
              동의권 분리 → 통치행위 한계 → 청구 주체 비교
            </h2>
          </div>

          {/* 쟁점 1 : 제60조① vs 제60조② */}
          <div className="space-y-3.5 sm:space-y-4">
            <h3 className="text-[17px] sm:text-xl font-extrabold text-[#0f172a] leading-snug">
              쟁점 1. ‘파병협정 동의(제60조①)’와 ‘실제 파병 동의(제60조②)’는 별개다
            </h3>

            {/* 모바일 전용 2단 비교 카드 (가로 스크롤 제거) */}
            <div className="md:hidden space-y-2.5">
              <div className="rounded-xl border border-slate-300 bg-white overflow-hidden">
                <div className="bg-[#f8fafc] border-b border-slate-200 px-3.5 py-2.5 font-extrabold text-[14.5px] text-[#0f172a]">
                  조약 체결·비준 동의 (제60조 제1항)
                </div>
                <div className="px-3.5 py-3 space-y-1.5 text-[14px] text-slate-800 leading-[1.6]">
                  <p>
                    • 대상: <strong>중요 국제 약속(안전보장 등)</strong>을 맺는 것
                  </p>
                  <p>
                    • 적용: 비준 예정 서명 단계라면 서명 전 미동의만으로 즉시 무효 단정 불가
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#93c5fd] bg-white overflow-hidden">
                <div className="bg-[#eff6ff] border-b border-[#bfdbfe] px-3.5 py-2.5 font-extrabold text-[14.5px] text-[#1e3a8a]">
                  국군 해외파견 동의 (제60조 제2항)
                </div>
                <div className="px-3.5 py-3 space-y-1.5 text-[14px] text-[#0f172a] leading-[1.6]">
                  <p>
                    • 대상:{' '}
                    <span className="key-underline">
                      우리 군대를 실제로 외국에 보내는 것(사전 동의)
                    </span>
                  </p>
                  <p>
                    • 적용: 표결 무산·시간 부족으로 <strong>사전동의를 생략할 예외 없음</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* 태블릿·데스크톱 3열 비교표 (100% 그대로 유지) */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-[16.5px] sm:text-[17.5px] leading-relaxed">
                <thead>
                  <tr className="bg-slate-200/80 border-b border-slate-400 text-[#0f172a]">
                    <th className="py-3.5 px-4 font-extrabold w-1/5">구분</th>
                    <th className="py-3.5 px-4 font-extrabold w-2/5 border-l border-slate-300">
                      조약 체결·비준 동의 (제60조 제1항)
                    </th>
                    <th className="py-3.5 px-4 font-extrabold w-2/5 border-l border-slate-300 text-[#1e3a8a]">
                      국군 해외파견 동의 (제60조 제2항)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 bg-white">
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold bg-[#f8fafc]">
                      동의 대상
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      <strong>중요 국제 약속(안전보장 등)</strong>을 맺는 것
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      <span className="key-underline">
                        우리 군대를 실제로 외국에 보내는 것(사전 동의)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold bg-[#f8fafc]">
                      사안 적용
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      비준 예정 서명 단계라면 서명 전 미동의만으로 즉시 무효 단정 불가
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200 font-semibold">
                      표결 무산·시간 부족으로 <strong>사전동의를 생략할 예외 없음</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                <p className="text-[15px] sm:text-[17px] font-extrabold text-[#0f172a] leading-snug">
                  5. 20. 협정(비준 예정 서명 단계)은 서명 전 동의가 없어 즉시 무효일까요?
                </p>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep1Q1(1)}
                    className={`py-2 sm:py-2.5 px-3 rounded-lg border text-[13.5px] sm:text-sm font-extrabold ${
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
                    className={`py-2 sm:py-2.5 px-3 rounded-lg border text-[13.5px] sm:text-sm font-extrabold ${
                      step1Q1 !== null
                        ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                        : 'bg-white border-slate-300 hover:border-[#1e3a8a]'
                    }`}
                  >
                    무효 단정 불가
                  </button>
                </div>
                {step1Q1 !== null && (
                  <p className="text-[14px] sm:text-[15.5px] text-slate-700 leading-relaxed">
                    별도 비준이 예정되어 있다면 최종 비준 전에 동의를 받으면 되므로 즉시 무효로 단정할 수 없습니다.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                <p className="text-[15px] sm:text-[17px] font-extrabold text-[#0f172a] leading-snug">
                  야당의 표결 저지와 시간 부족을 이유로 8. 30. 파병의 사전동의를 생략할 수 있을까요?
                </p>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep1Q2('possible')}
                    className={`py-2 sm:py-2.5 px-3 rounded-lg border text-[13.5px] sm:text-sm font-extrabold ${
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
                    className={`py-2 sm:py-2.5 px-3 rounded-lg border text-[13.5px] sm:text-sm font-extrabold ${
                      step1Q2 !== null
                        ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                        : 'bg-white border-slate-300 hover:border-[#1e3a8a]'
                    }`}
                  >
                    생략 불가
                  </button>
                </div>
                {step1Q2 !== null && (
                  <p className="text-[14px] sm:text-[15.5px] text-slate-700 leading-relaxed">
                    동의안 제출이나 표결 무산은 동의가 아니며, 시간 부족이나 야당 저지로 사전동의를 생략할 예외는 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 쟁점 2 : 이라크 파병 2003헌마814 대조 */}
          <div className="border-t border-slate-200 pt-6 sm:pt-8 space-y-3.5 sm:space-y-4">
            <h3 className="text-[17px] sm:text-xl font-extrabold text-[#0f172a] leading-snug">
              쟁점 2. 통치행위라도 ‘헌법 절차 위반’은 헌재가 심사한다 (2003헌마814 대조)
            </h3>

            <div className="bg-[#f8fafc] border border-slate-300 border-l-[5px] sm:border-l-[6px] border-l-[#1e3a8a] rounded-r-lg p-4 sm:p-5 text-[14.5px] sm:text-[18px] text-[#0f172a] leading-[1.65] sm:leading-[1.72]">
              과거 이라크 파병 결정(2003헌마814)이 심판을 자제한 것은{' '}
              <span className="key-underline">
                “국회 동의 등 헌법과 법률이 정한 절차를 지켜 이루어진 것임이 명백”
              </span>
              했기 때문이다. 이 사안은 국회 동의를 건너뛰었으므로 전제가 다르다.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl border border-slate-300 border-t-4 border-t-slate-500 bg-white p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                <div className="text-[13.5px] sm:text-sm font-extrabold text-slate-600">
                  영역 A · 중동 파병이 우리나라 국익·안보에 유리한지 여부
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep2Policy('restraint')}
                    className={`py-2 sm:py-2.5 px-3 rounded-lg border text-[13.5px] sm:text-sm font-extrabold ${
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
                    className={`py-2 sm:py-2.5 px-3 rounded-lg border text-[13.5px] sm:text-sm font-extrabold ${
                      step2Policy === 'review'
                        ? 'bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c]'
                        : 'bg-slate-50 border-slate-300 hover:border-[#1e3a8a]'
                    }`}
                  >
                    헌재 심사 가능
                  </button>
                </div>
                {step2Policy !== null && (
                  <p className="text-[14px] sm:text-[15px] text-slate-700 leading-relaxed">
                    외교·군사적 유불리는 대통령과 국회가 정치적 책임을 지고 결정할 영역이므로 헌재가 판단을 자제합니다.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate-300 border-t-4 border-t-[#1e3a8a] bg-white p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                <div className="text-[13.5px] sm:text-sm font-extrabold text-[#1e3a8a]">
                  영역 B · 헌법 제60조 제2항의 국회 동의를 거쳤는지 여부
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep2Proc('restraint')}
                    className={`py-2 sm:py-2.5 px-3 rounded-lg border text-[13.5px] sm:text-sm font-extrabold ${
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
                    className={`py-2 sm:py-2.5 px-3 rounded-lg border text-[13.5px] sm:text-sm font-extrabold ${
                      step2Proc !== null
                        ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] text-[#1e3a8a]'
                        : 'bg-slate-50 border-slate-300 hover:border-[#1e3a8a]'
                    }`}
                  >
                    헌재 심사 가능
                  </button>
                </div>
                {step2Proc !== null && (
                  <p className="text-[14px] sm:text-[15px] text-slate-700 leading-relaxed">
                    국회 동의 없이 파병을 강행해 이라크 판례(2003헌마814)와 전제가 다르므로, 헌법 절차 위반 여부는 심사할 수 있습니다.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 쟁점 3 : 청구 주체 스위치 (국회 vs 개별 의원) */}
          <div className="border-t border-slate-200 pt-6 sm:pt-8 space-y-4 sm:space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-3.5">
              <h3 className="text-[17px] sm:text-xl font-extrabold text-[#0f172a] leading-snug">
                쟁점 3. 누가 권한쟁의심판을 청구하느냐에 따라 결론이 갈린다
              </h3>

              <div className="grid grid-cols-2 sm:inline-flex bg-[#f1f5f9] p-1 rounded-lg border border-slate-300 w-full sm:w-auto sm:self-start">
                <button
                  type="button"
                  onClick={() => setClaimantMode('assembly')}
                  className={`px-2.5 sm:px-3.5 py-2 rounded-md text-[13px] sm:text-sm font-extrabold text-center transition-colors ${
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
                  className={`px-2.5 sm:px-3.5 py-2 rounded-md text-[13px] sm:text-sm font-extrabold text-center transition-colors ${
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
              <div className="rounded-xl border-2 border-[#1e3a8a] bg-[#eff6ff]/45 p-4 sm:p-6 space-y-3 sm:space-y-3.5">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="px-2.5 sm:px-3 py-1 rounded bg-[#1e3a8a] text-white text-xs sm:text-sm font-extrabold">
                    적법 · 본안 판단 가능
                  </span>
                  <span className="text-[15.5px] sm:text-lg font-extrabold text-[#0f172a]">
                    국회 (본회의 의결) → 대통령 甲 상대
                  </span>
                </div>
                <ul className="space-y-1.5 sm:space-y-2 text-[14.5px] sm:text-[18px] text-slate-800 leading-[1.62] sm:leading-relaxed">
                  <li>
                    • 헌법 제60조 제2항의 파병동의권은{' '}
                    <span className="key-underline">‘국회 전체’의 고유 권한</span>이다.
                  </li>
                  <li>
                    • 파병 강행 의사가 확정된 결정이므로 국회의 동의권을 침해할 <strong>현저한 위험</strong>이 인정될 여지가 있다.
                  </li>
                  <li>
                    • 청구기간(안 날부터 60일 이내 등)을 지켜 청구하면 헌재가 동의권 침해 및 무효 여부를 본안에서 판단할 수 있다.
                  </li>
                </ul>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-[#b91c1c] bg-[#fef2f2]/45 p-4 sm:p-6 space-y-3.5 sm:space-y-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="px-2.5 sm:px-3 py-1 rounded bg-[#b91c1c] text-white text-xs sm:text-sm font-extrabold">
                    부적법 각하
                  </span>
                  <span className="text-[15.5px] sm:text-lg font-extrabold text-[#0f172a] leading-snug">
                    개별 의원 丙·丁 청구 시 두 경로 모두 막힘 (2005헌라8 · 2011헌라2)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg border border-[#fca5a5] border-t-4 border-t-[#b91c1c] p-3.5 sm:p-4 space-y-1">
                    <div className="text-xs font-extrabold text-[#b91c1c]">
                      막히는 길 1 · 국회 파병동의권 침해 주장
                    </div>
                    <div className="text-[15px] sm:text-lg font-extrabold text-[#0f172a]">
                      남의 권리를 대신 소송 걸 수 없음 (제3자 소송담당 불허)
                    </div>
                    <p className="text-[14px] sm:text-[15.5px] text-slate-700 leading-relaxed">
                      동의권의 주인은 ‘국회 전체’이므로 의원 개인이 국회를 대신해 소송을 낼 수 없다.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-[#fca5a5] border-t-4 border-t-[#b91c1c] p-3.5 sm:p-4 space-y-1">
                    <div className="text-xs font-extrabold text-[#b91c1c]">
                      막히는 길 2 · 의원 심의·표결권 침해 주장
                    </div>
                    <div className="text-[15px] sm:text-lg font-extrabold text-[#0f172a]">
                      투표권은 국회 안에서만 쓰는 권리 (대외적 침해 불가)
                    </div>
                    <p className="text-[14px] sm:text-[15.5px] text-slate-700 leading-relaxed">
                      심의·표결권은 국회 내부(의장 등 상대) 권한이므로 외부 기관인 대통령에 의해 직접 침해될 수 없다.
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                  ※ 11주차 수업 국무총리 서리 사건 각하 논리 및 조약 동의권 판례(2011헌라2)와 동일한 구조입니다.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==================== 4단계 : 서술형 4단 답안 완성 (PPT 26페이지) ==================== */}
      {stepIdx === 3 && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] px-4 py-5 sm:p-10 shadow-sm space-y-5 sm:space-y-8">
          <div className="border-b-2 border-[#0f172a] pb-3.5 sm:pb-4 flex flex-wrap items-end justify-between gap-3 sm:gap-4">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-extrabold text-[#1e3a8a] block">
                사례형 최종 정리
              </span>
              <h2 className="text-[20px] sm:text-[29px] font-extrabold text-[#0f172a] tracking-tight">
                서술형 답안 4단 구성
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setClozeActive((prev) => !prev);
                setRevealedBlankKeys([]);
              }}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-[13px] sm:text-sm font-extrabold border transition-colors ${
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

          <div className="divide-y divide-slate-300 border border-slate-300 rounded-xl overflow-hidden">
            {MODEL_ESSAY_SECTIONS.map((sec) => (
              <div
                key={sec.roman}
                className="grid grid-cols-1 md:grid-cols-12 bg-white"
              >
                <div className="md:col-span-3 bg-slate-100 md:border-r border-slate-300 px-3.5 py-2.5 md:px-5 md:py-4 flex items-center gap-1.5 sm:gap-2 font-extrabold text-[#0f172a] text-[15px] md:text-[17.5px]">
                  <span className="text-[#1e3a8a]">{sec.roman}.</span>
                  <span>{sec.title}</span>
                </div>
                <div className="md:col-span-9 px-4 py-3.5 md:px-6 md:py-5 text-[15px] sm:text-[18.5px] text-slate-800 leading-[1.7] sm:leading-[1.78]">
                  {sec.segments.map((seg, idx) => {
                    if (!seg.isKeyword) {
                      return <span key={idx}>{seg.text}</span>;
                    }
                    const blankKey = `${sec.roman}-${idx}`;
                    const isShown =
                      !clozeActive || revealedBlankKeys.includes(blankKey);

                    if (isShown) {
                      return (
                        <span
                          key={idx}
                          role={clozeActive ? 'button' : undefined}
                          tabIndex={clozeActive ? 0 : undefined}
                          onClick={() =>
                            clozeActive && toggleBlankKey(blankKey)
                          }
                          onKeyDown={(e) => {
                            if (
                              clozeActive &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault();
                              toggleBlankKey(blankKey);
                            }
                          }}
                          className={`key-underline ${
                            clozeActive ? 'cursor-pointer' : 'cursor-default'
                          }`}
                        >
                          {seg.text}
                        </span>
                      );
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleBlankKey(blankKey)}
                        className="inline-flex items-center px-2.5 sm:px-3 py-0.5 mx-1 rounded text-xs sm:text-sm font-extrabold bg-[#eff6ff] text-[#1e3a8a] border border-dashed border-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-colors"
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
          <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
              <div>
                <h3 className="text-[16px] sm:text-lg font-extrabold text-[#0f172a]">
                  AI로 서술형 답안 첨삭 · 연습하기
                </h3>
                <p className="text-[13px] sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                  짧은 초안을 적어 첨삭 프롬프트를 복사하거나, 백지 상태에서 단계별 문답을 시작할 수 있습니다.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPracticeOpen((prev) => !prev)}
                  className="px-3 sm:px-4 py-2 rounded-lg text-[13px] sm:text-sm font-bold bg-white border border-slate-300 text-[#0f172a] hover:border-[#1e3a8a] text-center"
                >
                  {practiceOpen ? '초안 입력 접기' : '내 답안 초안 쓰기'}
                </button>
                <button
                  type="button"
                  onClick={handleOpenGuidedQA}
                  className="px-3 sm:px-4 py-2 rounded-lg text-[13px] sm:text-sm font-extrabold bg-[#1e3a8a] text-white hover:bg-[#0f172a] transition-colors text-center"
                >
                  AI와 단계별 문답 시작
                </button>
              </div>
            </div>

            {practiceOpen && (
              <div className="pt-4 border-t border-slate-200 space-y-3.5 sm:space-y-4">
                <textarea
                  rows={5}
                  value={essayDraft}
                  onChange={(e) => onChangeEssayDraft(e.target.value)}
                  placeholder="3~4문장으로 핵심 흐름만 적어보셔도 됩니다. 작성하면 아래 필수 논점 포함 여부가 자동으로 표시됩니다."
                  className="w-full rounded-xl border border-slate-300 bg-white p-3.5 sm:p-4 text-[16px] sm:text-[17px] text-[#0f172a] leading-relaxed focus:outline-none focus:border-[#1e3a8a]"
                />

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-[13.5px] sm:text-sm font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] transition-colors"
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
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
        <div className="justify-self-start">
          <button
            type="button"
            onClick={() => goStep(Math.max(0, stepIdx - 1))}
            disabled={stepIdx === 0}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[13px] sm:text-sm font-bold bg-white border border-slate-300 text-slate-700 hover:border-[#0f172a] disabled:opacity-35 disabled:pointer-events-none shadow-sm"
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
            className="inline-flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-[13px] sm:text-sm font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] disabled:opacity-35 disabled:pointer-events-none shadow-sm"
          >
            <span>
              {stepIdx === 0
                ? '다음 : 타임라인'
                : stepIdx === 1
                ? '다음 : 쟁점 정리'
                : stepIdx === 2
                ? '다음 : 답안 완성'
                : '완료'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
