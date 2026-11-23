import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  Check,
  GitBranch,
  Layers,
  Scale,
  ShieldAlert,
  Users,
} from 'lucide-react';
import {
  BOUNDARY_ITEMS,
  CORE_PRECEDENTS,
  OVERARCHING_QUESTION,
  QUICK_REF_STRIP,
  QUOTA_MILESTONES,
  ROUTER_SITUATIONS,
} from '../data/schemaData';
import { BoundaryId, MainViewId, PillarNodeId } from '../types';

interface SchemaViewProps {
  bookmarkedCases: string[];
  onToggleCaseBookmark: (caseId: string) => void;
  onNavigateToQuestion: (questionId: number) => void;
  onNavigateView: (view: MainViewId) => void;
}

const ORGAN_MAP_TABS: {
  id: 'const-court' | 'sc-grand' | 'sc-petty' | 'sc-council' | 'sc-personnel';
  label: string;
  sub: string;
}[] = [
  { id: 'const-court', label: '헌법재판소', sub: '헌법재판' },
  { id: 'sc-grand', label: '전원 2/3 이상 합의체', sub: '대법원 원칙 재판' },
  { id: 'sc-petty', label: '3명 이상 부(소부)', sub: '대법원 예외 재판' },
  { id: 'sc-council', label: '대법관회의', sub: '사법행정 의결' },
  { id: 'sc-personnel', label: '법관인사위원회', sub: '인사 심의(11명)' },
];

export const SchemaView: React.FC<SchemaViewProps> = ({
  bookmarkedCases,
  onToggleCaseBookmark,
  onNavigateToQuestion,
  onNavigateView,
}) => {
  const [activeBoundary, setActiveBoundary] = useState<BoundaryId | null>('b1');
  const [activeSituationId, setActiveSituationId] = useState<string>('s2');
  const [activeQuotaIndex, setActiveQuotaIndex] = useState<number>(0);

  const selectedBoundary = BOUNDARY_ITEMS.find((b) => b.id === activeBoundary) ?? null;
  const selectedSituation =
    ROUTER_SITUATIONS.find((s) => s.id === activeSituationId) ?? ROUTER_SITUATIONS[0];
  const selectedQuota = QUOTA_MILESTONES[activeQuotaIndex];

  const isNodeHighlighted = (node: PillarNodeId) => {
    if (!selectedBoundary) return true;
    return selectedBoundary.highlightedNodes.includes(node);
  };

  const isJudiciaryAnyHighlighted =
    isNodeHighlighted('courts') || isNodeHighlighted('constCourt');

  return (
    <div className="space-y-10">
      {/* ==================== MODULE 1-A : 삼권분립 3기둥 & 사법부의 역할과 한계 맵 ==================== */}
      <section className="bg-white border border-[#cbd5e1] border-t-[3px] border-t-[#0f172a] p-6 md:p-8 shadow-sm">
        {/* 상단 관통 질문 배너 */}
        <div className="border-b border-[#e2e8f0] pb-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-tight text-[#1e3a8a]">
              <Scale className="w-3.5 h-3.5" />
              모듈 1-A · 삼권분립 3기둥과 사법부의 경계선
            </span>
            <span className="text-xs font-semibold text-[#64748b]">
              아래 경계 칩을 클릭해 충돌 지점과 연결 문항을 확인하세요
            </span>
          </div>
          <p className="text-lg md:text-xl font-extrabold text-[#0f172a] leading-snug">
            {OVERARCHING_QUESTION}
          </p>
        </div>

        {/* 경계 선택 인터랙티브 칩 바 */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {BOUNDARY_ITEMS.map((item) => {
              const isActive = activeBoundary === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setActiveBoundary((prev) => (prev === item.id ? null : item.id))
                  }
                  className={`px-3.5 py-2 text-sm font-bold border transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-sm'
                      : 'bg-[#f8fafc] text-[#334155] border-[#cbd5e1] hover:border-[#1e3a8a] hover:text-[#0f172a]'
                  }`}
                >
                  <span
                    className={`text-xs font-extrabold px-1.5 py-0.5 tabular-nums ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#e2e8f0] text-[#0f172a]'
                    }`}
                  >
                    {item.code}
                  </span>
                  <span>{item.title}</span>
                </button>
              );
            })}
            {activeBoundary !== null && (
              <button
                type="button"
                onClick={() => setActiveBoundary(null)}
                className="px-3 py-2 text-xs font-bold text-[#64748b] hover:text-[#0f172a] border border-transparent hover:border-[#cbd5e1] transition-colors"
              >
                전체 기둥 균등 보기
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {selectedBoundary && (
              <motion.div
                key={selectedBoundary.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className="bg-[#eff6ff] border border-[#93c5fd] border-l-4 border-l-[#1e3a8a] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#1e3a8a] bg-white border border-[#93c5fd] px-2 py-0.5">
                      {selectedBoundary.code} · {selectedBoundary.title}
                    </span>
                    <span className="text-sm font-extrabold text-[#0f172a]">
                      {selectedBoundary.summary}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-[#334155] leading-relaxed">
                    {selectedBoundary.detail}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {selectedBoundary.links.map((lnk, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (lnk.questionId) {
                          onNavigateToQuestion(lnk.questionId);
                        } else {
                          onNavigateView(lnk.targetView);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] transition-colors"
                    >
                      <span>{lnk.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 반드시 준수: 삼권분립 3기둥 레이아웃 (기둥 1 입법부 / 기둥 2 행정부 / 기둥 3 사법부 통합 컨테이너 내부에 법원 + 헌법재판소) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* 기둥 1 · 입법부 (국회) */}
          <div
            className={`lg:col-span-3 flex flex-col justify-between border transition-all duration-200 p-5 ${
              selectedBoundary && isNodeHighlighted('legislative')
                ? 'border-[#1e3a8a] border-t-[4px] bg-[#eff6ff]/40 shadow-sm'
                : !selectedBoundary
                ? 'border-[#cbd5e1] border-t-[3px] border-t-[#334155] bg-[#f8fafc]'
                : 'border-[#e2e8f0] border-t-[3px] border-t-[#cbd5e1] bg-[#f8fafc] opacity-45'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold text-[#1e3a8a] tracking-tight tabular-nums">
                  기둥 1 · 입법권
                </span>
                {selectedBoundary && isNodeHighlighted('legislative') && (
                  <span className="text-[11px] font-extrabold bg-[#1e3a8a] text-white px-2 py-0.5">
                    관련 기둥
                  </span>
                )}
              </div>
              <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">
                입법부 · 국회
              </h3>
              <p className="text-xs font-semibold text-[#64748b] mb-4">
                헌법 제40조 · 제60조 제1·2항
              </p>

              <div className="space-y-3 text-sm">
                <div className="bg-white border border-[#e2e8f0] p-3">
                  <div className="text-xs font-extrabold text-[#0f172a] mb-1">핵심 권한</div>
                  <p className="text-[#334155] text-[13px] leading-relaxed">
                    법률 제정 · 조약 체결·비준 동의(제60조①) · 국군 해외파견 동의(제60조②)
                  </p>
                </div>
                <div className="bg-[#fef2f2]/70 border border-[#fca5a5] p-3">
                  <div className="text-xs font-extrabold text-[#b91c1c] mb-1">
                    넘지 못하는 선 (한계)
                  </div>
                  <p className="text-[#334155] text-[13px] leading-relaxed">
                    법원의 재판 핵심 본질을 빼앗거나 기본권을 과도하게 제한할 수 없음
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 기둥 2 · 행정부 (대통령) */}
          <div
            className={`lg:col-span-3 flex flex-col justify-between border transition-all duration-200 p-5 ${
              selectedBoundary && isNodeHighlighted('executive')
                ? 'border-[#1e3a8a] border-t-[4px] bg-[#eff6ff]/40 shadow-sm'
                : !selectedBoundary
                ? 'border-[#cbd5e1] border-t-[3px] border-t-[#334155] bg-[#f8fafc]'
                : 'border-[#e2e8f0] border-t-[3px] border-t-[#cbd5e1] bg-[#f8fafc] opacity-45'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold text-[#1e3a8a] tracking-tight tabular-nums">
                  기둥 2 · 행정권
                </span>
                {selectedBoundary && isNodeHighlighted('executive') && (
                  <span className="text-[11px] font-extrabold bg-[#1e3a8a] text-white px-2 py-0.5">
                    관련 기둥
                  </span>
                )}
              </div>
              <h3 className="text-lg font-extrabold text-[#0f172a] mb-1">
                행정부 · 대통령
              </h3>
              <p className="text-xs font-semibold text-[#64748b] mb-4">
                헌법 제66조 · 제73조 · 제74조①
              </p>

              <div className="space-y-3 text-sm">
                <div className="bg-white border border-[#e2e8f0] p-3">
                  <div className="text-xs font-extrabold text-[#0f172a] mb-1">핵심 권한</div>
                  <p className="text-[#334155] text-[13px] leading-relaxed">
                    조약 체결·비준(제73조) · 국군 통수(제74조①) 등 외교·국방의 고도의 정치적 결단
                  </p>
                </div>
                <div className="bg-[#fef2f2]/70 border border-[#fca5a5] p-3">
                  <div className="text-xs font-extrabold text-[#b91c1c] mb-1">
                    넘지 못하는 선 (한계)
                  </div>
                  <p className="text-[#334155] text-[13px] leading-relaxed">
                    반드시 헌법이 정한 절차(국회의 사전동의 등)를 지켜야 함
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 기둥 3 · 사법부 (넓은 의미의 사법권 — 하나의 통합 컨테이너 안에 법원 + 헌법재판소 함께 배치) */}
          <div
            className={`lg:col-span-6 flex flex-col border transition-all duration-200 p-5 ${
              selectedBoundary && isJudiciaryAnyHighlighted
                ? 'border-[#1e3a8a] border-t-[4px] bg-[#eff6ff]/30 shadow-sm'
                : !selectedBoundary
                ? 'border-[#1e3a8a] border-t-[4px] bg-[#f8fafc]'
                : 'border-[#e2e8f0] border-t-[3px] bg-[#f8fafc] opacity-50'
            }`}
          >
            {/* 기둥 3 통합 헤더 */}
            <div className="border-b border-[#cbd5e1] pb-3 mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-xs font-extrabold text-[#1e3a8a] tracking-tight tabular-nums block mb-1">
                  기둥 3 · 사법권 (넓은 의미의 사법권)
                </span>
                <h3 className="text-lg font-extrabold text-[#0f172a]">
                  사법부 통합 구조 — 구체적 사건 재판은 법원이, 헌법적 통제는 헌법재판소가 분담
                </h3>
              </div>
            </div>

            {/* 사법부 통합 컨테이너 내부 2분할 카드: ① 법원 / ② 헌법재판소 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {/* 내부 ① 법원 */}
              <div
                className={`border p-4 flex flex-col justify-between transition-all ${
                  selectedBoundary && isNodeHighlighted('courts')
                    ? 'bg-white border-[#1e3a8a] ring-1 ring-[#1e3a8a]'
                    : !selectedBoundary
                    ? 'bg-white border-[#cbd5e1]'
                    : 'bg-white/60 border-[#e2e8f0] opacity-55'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-extrabold text-[#1e3a8a] tabular-nums">
                      내부 ① · 헌법 제101조~제110조
                    </span>
                    {selectedBoundary && isNodeHighlighted('courts') && (
                      <span className="text-[11px] font-extrabold bg-[#eff6ff] text-[#1e3a8a] border border-[#93c5fd] px-1.5 py-0.5">
                        핵심 당사자
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-extrabold text-[#0f172a] mb-3">법원</h4>

                  <div className="space-y-2.5">
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5">
                      <div className="text-[11px] font-extrabold text-[#0f172a] mb-1">권한</div>
                      <p className="text-[13px] text-[#334155] leading-relaxed">
                        외부 간섭 없이 독립하여 구체적 사건 재판 · 대법원규칙 제정
                      </p>
                    </div>
                    <div className="bg-[#fef2f2]/70 border border-[#fca5a5] p-2.5">
                      <div className="text-[11px] font-extrabold text-[#b91c1c] mb-1">
                        넘지 못하는 선 (한계)
                      </div>
                      <p className="text-[13px] text-[#334155] leading-relaxed">
                        국회가 만든 법률 테두리 안에서만 재판·규칙 제정 가능(법률을 무시할 자유가 아님)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 내부 ② 헌법재판소 */}
              <div
                className={`border p-4 flex flex-col justify-between transition-all ${
                  selectedBoundary && isNodeHighlighted('constCourt')
                    ? 'bg-white border-[#1e3a8a] ring-1 ring-[#1e3a8a]'
                    : !selectedBoundary
                    ? 'bg-white border-[#cbd5e1]'
                    : 'bg-white/60 border-[#e2e8f0] opacity-55'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-extrabold text-[#1e3a8a] tabular-nums">
                      내부 ② · 헌법 제111조~제113조
                    </span>
                    {selectedBoundary && isNodeHighlighted('constCourt') && (
                      <span className="text-[11px] font-extrabold bg-[#eff6ff] text-[#1e3a8a] border border-[#93c5fd] px-1.5 py-0.5">
                        핵심 당사자
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-extrabold text-[#0f172a] mb-3">헌법재판소</h4>

                  <div className="space-y-2.5">
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5">
                      <div className="text-[11px] font-extrabold text-[#0f172a] mb-1">권한</div>
                      <p className="text-[13px] text-[#334155] leading-relaxed">
                        위헌법률심판 · 권한쟁의심판 등 헌법재판
                      </p>
                    </div>
                    <div className="bg-[#fef2f2]/70 border border-[#fca5a5] p-2.5">
                      <div className="text-[11px] font-extrabold text-[#b91c1c] mb-1">
                        넘지 못하는 선 (한계)
                      </div>
                      <p className="text-[13px] text-[#334155] leading-relaxed">
                        외교·국방 선택의 정치적 유불리는 판단하지 않되(사법자제), 헌법상 권한과 절차를 어겼는지는 심판함
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MODULE 1-B : 인터랙티브 라우터 + 대법관 정원 시뮬레이터 ==================== */}
      <section className="bg-white border border-[#cbd5e1] border-t-[3px] border-t-[#1e3a8a] p-6 md:p-8 shadow-sm space-y-8">
        <div className="border-b border-[#e2e8f0] pb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1e3a8a] mb-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              모듈 1-B · 헌법 제107조 분담 & 법원조직법 3기구 라우터
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0f172a]">
              이 사안은 어디서, 몇 명이 결정할까?
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#64748b]">
            좌측 6가지 상황을 클릭하면 담당 기구와 정족수 경로가 전환됩니다
          </span>
        </div>

        {/* 1. 6가지 상황 라우터 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 좌측 6가지 상황 선택 버튼 */}
          <div className="lg:col-span-5 space-y-2">
            {ROUTER_SITUATIONS.map((sit) => {
              const isSelected = sit.id === activeSituationId;
              return (
                <button
                  key={sit.id}
                  type="button"
                  onClick={() => setActiveSituationId(sit.id)}
                  className={`w-full text-left p-3.5 border transition-all relative ${
                    isSelected
                      ? 'bg-[#eff6ff] border-[#1e3a8a] border-l-4 shadow-sm'
                      : 'bg-[#f8fafc] border-[#cbd5e1] hover:bg-white hover:border-[#94a3b8]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-xs font-extrabold tabular-nums ${
                        isSelected ? 'text-[#1e3a8a]' : 'text-[#64748b]'
                      }`}
                    >
                      {sit.num}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 border ${
                        isSelected
                          ? 'bg-white text-[#1e3a8a] border-[#93c5fd]'
                          : 'bg-white text-[#475569] border-[#e2e8f0]'
                      }`}
                    >
                      {sit.shortTag}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[#0f172a] leading-snug">
                    {sit.question}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 우측 결과 보드 + 경로 다이어그램 */}
          <div className="lg:col-span-7 border border-[#cbd5e1] bg-[#f8fafc] p-5 md:p-6">
            {/* 상단 5개 기구 위치 인디케이터 */}
            <div className="mb-5">
              <div className="text-[11px] font-bold text-[#64748b] mb-2">
                최종 담당 기구 위치
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {ORGAN_MAP_TABS.map((org) => {
                  const active = selectedSituation.organCategory === org.id;
                  return (
                    <div
                      key={org.id}
                      className={`px-2.5 py-2 border text-center transition-all ${
                        active
                          ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white shadow-sm'
                          : 'bg-white border-[#e2e8f0] text-[#64748b]'
                      }`}
                    >
                      <div className="text-xs font-extrabold leading-tight">{org.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          active ? 'text-[#bfdbfe]' : 'text-[#94a3b8]'
                        }`}
                      >
                        {org.sub}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSituation.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                {/* 핵심 결정 보드 */}
                <div className="bg-white border border-[#cbd5e1] border-t-[3px] border-t-[#0f172a] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold text-[#1e3a8a] bg-[#eff6ff] border border-[#93c5fd] px-2.5 py-0.5">
                      {selectedSituation.num} 판정 결과
                    </span>
                    <span className="text-xs font-bold text-[#475569] tabular-nums">
                      근거: {selectedSituation.legalBasis}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-[#0f172a] mb-1">
                    담당 : {selectedSituation.organTitle}
                  </h3>
                  <p className="text-sm font-bold text-[#1e3a8a] mb-3">
                    {selectedSituation.organSubtitle}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-3 border-t border-[#e2e8f0] text-xs">
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5">
                      <span className="font-extrabold text-[#0f172a] block mb-0.5">
                        구성 · 정족수 · 심판 원칙
                      </span>
                      <span className="text-[#334155] font-medium">
                        {selectedSituation.quorumOrRule}
                      </span>
                    </div>
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5">
                      <span className="font-extrabold text-[#0f172a] block mb-0.5">
                        {selectedSituation.proposerOrNote ? '안건 부의 주체' : '적용 조문'}
                      </span>
                      <span className="text-[#334155] font-medium">
                        {selectedSituation.proposerOrNote ?? selectedSituation.legalBasis}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3단계 시각적 처리 경로 다이어그램 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {selectedSituation.flowSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-3 border relative ${
                        step.accent === 'crimson'
                          ? 'bg-[#fef2f2] border-[#fca5a5]'
                          : step.accent === 'navy'
                          ? 'bg-white border-[#93c5fd]'
                          : 'bg-white border-[#cbd5e1]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-extrabold mb-1">
                        <span
                          className={
                            step.accent === 'crimson'
                              ? 'text-[#b91c1c]'
                              : step.accent === 'navy'
                              ? 'text-[#1e3a8a]'
                              : 'text-[#64748b]'
                          }
                        >
                          0{idx + 1}단계 · {step.stepLabel}
                        </span>
                        {idx < 2 && (
                          <ArrowRight className="w-3.5 h-3.5 text-[#94a3b8] hidden md:block" />
                        )}
                      </div>
                      <div className="text-sm font-extrabold text-[#0f172a] mb-0.5">
                        {step.actor}
                      </div>
                      <div className="text-xs text-[#475569] leading-relaxed">
                        {step.detail}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 함정 경보 및 조문 주의 노트 */}
                <div className="bg-[#fef2f2] border border-[#fca5a5] border-l-4 border-l-[#b91c1c] p-3.5 space-y-2">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#b91c1c] shrink-0 mt-0.5" />
                    <p className="text-xs md:text-sm font-semibold text-[#0f172a] leading-relaxed">
                      <strong className="text-[#b91c1c] mr-1.5">출제 함정 포인트:</strong>
                      {selectedSituation.keyWarning}
                    </p>
                  </div>
                  {selectedSituation.examCaution && (
                    <div className="bg-white border border-[#fca5a5] p-2.5 text-xs text-[#334155] leading-relaxed">
                      <strong className="text-[#0f172a] font-extrabold mr-1">
                        시험 주의 노트:
                      </strong>
                      {selectedSituation.examCaution}
                    </div>
                  )}
                </div>

                {/* 연결 문항 이동 */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-xs font-semibold text-[#64748b]">
                    이 경계를 묻는 수록 문항:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSituation.relatedQuestionIds.map((qId) => (
                      <button
                        key={qId}
                        type="button"
                        onClick={() => onNavigateToQuestion(qId)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-extrabold bg-white border border-[#cbd5e1] text-[#0f172a] hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors tabular-nums"
                      >
                        <span>문항 Q{qId} 풀기</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 2. 통합 인터랙티브 위젯: 대법관 정원 변화 시뮬레이터 (법률 제21451호 부칙 반영) */}
        <div className="border border-[#cbd5e1] bg-[#f8fafc] p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-5 border-b border-[#cbd5e1]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1e3a8a] mb-1">
                <Users className="w-3.5 h-3.5" />
                대법관 정원 변화 시뮬레이터 (개정 법원조직법 · 법률 제21451호 부칙 반영)
              </div>
              <h3 className="text-base md:text-lg font-extrabold text-[#0f172a]">
                연도별 대법관 총원(대법원장 포함) 및 전원 2/3 이상 최소 정족수 시뮬레이션
              </h3>
            </div>

            {/* 연도 전환 탭 */}
            <div className="flex flex-wrap gap-1.5 bg-white p-1 border border-[#cbd5e1]">
              {QUOTA_MILESTONES.map((m, idx) => {
                const active = idx === activeQuotaIndex;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveQuotaIndex(idx)}
                    className={`relative px-3 py-1.5 text-xs font-extrabold transition-colors tabular-nums ${
                      active ? 'text-white' : 'text-[#475569] hover:text-[#0f172a]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="quotaYearPill"
                        transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                        className="absolute inset-0 bg-[#1e3a8a]"
                      />
                    )}
                    <span className="relative z-10">{m.periodLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* 좌측 수치 요약 및 슬라이더 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-[#cbd5e1] p-4">
                  <span className="text-xs font-bold text-[#64748b] block mb-1">
                    대법관 총원 (원장 포함)
                  </span>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tabular-nums">
                    총 {selectedQuota.totalJustices}명
                  </div>
                  <span className="inline-block mt-1 text-xs font-bold text-[#475569] tabular-nums">
                    {selectedQuota.addedNote}
                  </span>
                </div>

                <div className="bg-[#eff6ff] border border-[#93c5fd] p-4">
                  <span className="text-xs font-extrabold text-[#1e3a8a] block mb-1">
                    전원 2/3 이상 기준
                  </span>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#1e3a8a] tabular-nums">
                    최소 {selectedQuota.twoThirdsMin}명
                  </div>
                  <span className="inline-block mt-1 text-xs font-semibold text-[#334155] tabular-nums">
                    {selectedQuota.formulaNote}
                  </span>
                </div>
              </div>

              {/* 슬라이더 조작 */}
              <div className="bg-white border border-[#e2e8f0] px-4 py-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#475569] mb-2 tabular-nums">
                  <span>시행 시기 슬라이더 조작</span>
                  <span className="text-[#1e3a8a] font-extrabold">
                    {selectedQuota.periodLabel} ({selectedQuota.badge})
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={QUOTA_MILESTONES.length - 1}
                  step={1}
                  value={activeQuotaIndex}
                  onChange={(e) => setActiveQuotaIndex(Number(e.target.value))}
                  aria-label="대법관 정원 시행 연도 선택"
                  className="w-full accent-[#1e3a8a] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-semibold text-[#64748b] mt-1 tabular-nums">
                  <span>2026 (14명)</span>
                  <span>2028.3 (18명)</span>
                  <span>2029.3 (22명)</span>
                  <span>2030.3 (26명)</span>
                </div>
              </div>
            </div>

            {/* 우측 26개 좌석 도트 시각화 */}
            <div className="lg:col-span-7 bg-white border border-[#cbd5e1] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs">
                <span className="font-extrabold text-[#0f172a]">
                  대법관 좌석 인디케이터 (전원 2/3 이상 정족수 점등)
                </span>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#475569]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#1e3a8a] inline-block" />
                    2/3 정족수 ({selectedQuota.twoThirdsMin}석)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#cbd5e1] border border-[#94a3b8] inline-block" />
                    나머지 재직석 ({selectedQuota.totalJustices - selectedQuota.twoThirdsMin}석)
                  </span>
                  {selectedQuota.totalJustices < 26 && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 border border-dashed border-[#cbd5e1] inline-block" />
                      증원 예정 ({26 - selectedQuota.totalJustices}석)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-7 sm:grid-cols-[repeat(13,minmax(0,1fr))] gap-2">
                {Array.from({ length: 26 }, (_, i) => {
                  const seatNum = i + 1;
                  const isQuorumLit = seatNum <= selectedQuota.twoThirdsMin;
                  const isActiveSeat = seatNum <= selectedQuota.totalJustices;

                  return (
                    <motion.div
                      key={seatNum}
                      layout
                      initial={false}
                      animate={{
                        scale: isActiveSeat ? 1 : 0.94,
                        opacity: isActiveSeat ? 1 : 0.4,
                      }}
                      transition={{ duration: 0.2 }}
                      className={`h-10 flex flex-col items-center justify-center border text-xs font-extrabold tabular-nums ${
                        isQuorumLit
                          ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white shadow-sm'
                          : isActiveSeat
                          ? 'bg-[#e2e8f0] border-[#94a3b8] text-[#334155]'
                          : 'bg-transparent border-dashed border-[#cbd5e1] text-[#94a3b8]'
                      }`}
                      title={
                        seatNum === 1
                          ? '대법원장 (정원 포함)'
                          : isQuorumLit
                          ? `대법관 ${seatNum}석 (2/3 정족수 내)`
                          : isActiveSeat
                          ? `대법관 ${seatNum}석 (현 정원 내)`
                          : `향후 증원 예정 ${seatNum}번석`
                      }
                    >
                      <span>{seatNum}</span>
                      {seatNum === 1 && (
                        <span className="text-[9px] leading-none font-bold opacity-85">
                          원장
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3. 하단 빠른 참조 스트립 (헌법 제105~110조 핵심 체크) */}
        <div>
          <div className="text-xs font-extrabold text-[#475569] mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#1e3a8a]" />
            헌법 제105조~제110조 핵심 조문 빠른 참조 스트립
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_REF_STRIP.map((ref) => (
              <div
                key={ref.title}
                className="bg-[#f8fafc] border border-[#cbd5e1] border-l-[3px] border-l-[#0f172a] p-3.5"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-extrabold text-[#0f172a]">{ref.title}</span>
                  <span className="text-[11px] font-bold text-[#1e3a8a] tabular-nums">
                    {ref.provision}
                  </span>
                </div>
                <p className="text-xs text-[#334155] leading-relaxed">{ref.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MODULE 1-C : 핵심 헌재 결정례 4선 & 앞 주차 수업 연결 브릿지 ==================== */}
      <section className="bg-white border border-[#cbd5e1] border-t-[3px] border-t-[#0f172a] p-6 md:p-8 shadow-sm">
        <div className="border-b border-[#e2e8f0] pb-4 mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-xs font-extrabold text-[#1e3a8a] block mb-1">
              모듈 1-C · 사법권 관련 핵심 헌법재판소 결정례 4선 (전부 합헌)
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0f172a]">
              핵심 헌재 결정례 4선 & 앞 주차 수업 연결 브릿지
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#64748b]">
            [헷갈림 저장]을 누르면 우측 상단 AI 복습 코치 과외 목록에 자동 담깁니다
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {CORE_PRECEDENTS.map((prec) => {
            const isBookmarked = bookmarkedCases.includes(prec.id);
            const isTrapCard = prec.bridgeTitle.includes('함정');

            return (
              <article
                key={prec.id}
                className="border border-[#cbd5e1] bg-[#f8fafc] p-5 flex flex-col justify-between gap-4 hover:border-[#94a3b8] transition-colors"
              >
                <div className="space-y-3">
                  {/* 카드 상단: 사건번호 + 합헌 배지 + [헷갈림 저장] 버튼 */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-extrabold text-[#1e3a8a] tabular-nums">
                          {prec.caseNumber}
                        </span>
                        <span className="text-xs font-extrabold bg-[#0f766e] text-white px-2 py-0.5">
                          {prec.verdict}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-extrabold text-[#0f172a]">
                        {prec.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleCaseBookmark(prec.id)}
                      className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-extrabold border transition-colors ${
                        isBookmarked
                          ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                          : 'bg-white text-[#475569] border-[#cbd5e1] hover:border-[#1e3a8a] hover:text-[#1e3a8a]'
                      }`}
                    >
                      {isBookmarked ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>저장됨</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>헷갈림 저장</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 판례 핵심 법리 */}
                  <p className="text-sm text-[#334155] leading-relaxed bg-white border border-[#e2e8f0] p-3.5">
                    {prec.summary}
                  </p>

                  {/* 강도상해죄 작량감경 스케일 바 (99헌바43) */}
                  {prec.visualScale && (
                    <div className="bg-white border border-[#cbd5e1] px-3 py-2.5 flex flex-wrap items-center gap-2 text-xs font-bold tabular-nums">
                      <span className="bg-[#e2e8f0] text-[#0f172a] px-2 py-1">
                        {prec.visualScale.step1}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#64748b]" />
                      <span className="bg-[#fef2f2] text-[#b91c1c] border border-[#fca5a5] px-2 py-1">
                        {prec.visualScale.step2}
                      </span>
                      <span className="text-[#64748b]">&gt;</span>
                      <span className="bg-[#eff6ff] text-[#1e3a8a] border border-[#93c5fd] px-2 py-1">
                        {prec.visualScale.step3}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {/* 앞 주차 수업 연결 브릿지 / 기출 함정 주의 */}
                  <div
                    className={`p-3 border-l-4 text-xs leading-relaxed ${
                      isTrapCard
                        ? 'bg-[#fef2f2] border border-[#fca5a5] border-l-[#b91c1c] text-[#0f172a]'
                        : 'bg-[#eff6ff] border border-[#93c5fd] border-l-[#1e3a8a] text-[#0f172a]'
                    }`}
                  >
                    <div
                      className={`font-extrabold mb-0.5 flex items-center gap-1 ${
                        isTrapCard ? 'text-[#b91c1c]' : 'text-[#1e3a8a]'
                      }`}
                    >
                      {isTrapCard && <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>{prec.bridgeTitle}</span>
                    </div>
                    <p className="text-[#334155] font-medium">{prec.bridgeText}</p>
                  </div>

                  {/* 연결 문항 버튼 */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-[#64748b]">
                      출제 적용 문항 확인:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {prec.relatedQuestionIds.map((qId) => (
                        <button
                          key={qId}
                          type="button"
                          onClick={() => onNavigateToQuestion(qId)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-white border border-[#cbd5e1] text-[#0f172a] hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors tabular-nums"
                        >
                          <span>Q{qId}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
