import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
} from 'lucide-react';
import {
  BOUNDARY_ITEMS,
  CONSTITUTION_ARTICLES_SUMMARY,
  CORE_PRECEDENTS,
  NORM_HIERARCHY_TIERS,
  OVERARCHING_QUESTION,
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

const SCHEMA_PAGES = [
  { id: 0, num: '01', label: '삼권분립과 경계선' },
  { id: 1, num: '02', label: '헌법 조문과 법의 서열' },
  { id: 2, num: '03', label: '법원조직법과 대법관 정원' },
  { id: 3, num: '04', label: '핵심 헌재 결정례 4선' },
];

export const SchemaView: React.FC<SchemaViewProps> = ({
  bookmarkedCases,
  onToggleCaseBookmark,
  onNavigateToQuestion,
  onNavigateView,
}) => {
  const [pageIdx, setPageIdx] = useState<number>(0);
  const [activeBoundary, setActiveBoundary] = useState<BoundaryId | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<string>('decree-rule');
  const [activeSituationId, setActiveSituationId] = useState<string>('s2');
  const [activeQuotaIndex, setActiveQuotaIndex] = useState<number>(0);

  const selectedBoundary =
    BOUNDARY_ITEMS.find((b) => b.id === activeBoundary) ?? null;
  const selectedTier =
    NORM_HIERARCHY_TIERS.find((t) => t.id === selectedTierId) ??
    NORM_HIERARCHY_TIERS[2];
  const selectedSituation =
    ROUTER_SITUATIONS.find((s) => s.id === activeSituationId) ??
    ROUTER_SITUATIONS[1];
  const selectedQuota = QUOTA_MILESTONES[activeQuotaIndex];

  const isHighlighted = (node: PillarNodeId) => {
    if (!selectedBoundary) return true;
    return selectedBoundary.highlightedNodes.includes(node);
  };

  const goPage = (next: number) => {
    setPageIdx(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* 상단 4단계 서브 페이지 네비게이션 */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {SCHEMA_PAGES.map((p) => {
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
                    layoutId="schemaSubPageIndicator"
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

      {/* 페이지별 단일 집중 시트 */}
      <AnimatePresence mode="wait">
        {/* ==================== PAGE 01 : 삼권분립과 경계선 (슬라이드 02 · 03 계승) ==================== */}
        {pageIdx === 0 && (
          <motion.section
            key="schema-p0"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-8"
          >
            {/* 헤더 */}
            <div className="border-b-2 border-[#0f172a] pb-4 space-y-1.5">
              <span className="text-sm font-extrabold text-[#1e3a8a] block">
                도입 · 삼권분립의 구조와 핵심 관점
              </span>
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
                삼권분립에서 각 기관이 맡은 역할과 넘지 못하는 선
              </h2>
            </div>

            {/* 관통 질문 노트 바 */}
            <div className="bg-[#f8fafc] border border-slate-200 border-l-4 border-l-[#1e3a8a] rounded-r-lg px-5 py-4 text-base sm:text-[17.5px] text-[#0f172a] leading-relaxed">
              {OVERARCHING_QUESTION}
            </div>

            {/* 3가지 핵심 경계 카드 (클릭 시 밑줄·기관 하이라이트 연동) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">
                  아래 세 가지 경계 중 하나를 눌러 어떤 기관끼리 맞닿는지 확인해 보세요
                </span>
                {activeBoundary && (
                  <button
                    type="button"
                    onClick={() => setActiveBoundary(null)}
                    className="text-sm font-bold text-[#1e3a8a] hover:underline"
                  >
                    전체 균등 보기
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BOUNDARY_ITEMS.map((item) => {
                  const isActive = activeBoundary === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setActiveBoundary((prev) =>
                          prev === item.id ? null : item.id
                        )
                      }
                      className={`text-left rounded-lg p-5 border transition-all border-t-4 ${
                        isActive
                          ? 'bg-[#eff6ff]/70 border-[#1e3a8a] border-t-[#1e3a8a] shadow-sm'
                          : 'bg-white border-slate-200 border-t-[#1e3a8a]/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs sm:text-[13px] font-extrabold text-[#1e3a8a] mb-2">
                        {item.code}
                      </div>
                      <div className="text-lg sm:text-[19px] font-extrabold text-[#0f172a] leading-snug mb-2">
                        <span className={isActive ? 'key-underline' : ''}>
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[15px] text-slate-600 leading-relaxed">
                        {item.summary}
                      </p>
                    </button>
                  );
                })}
              </div>

              {selectedBoundary && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#eff6ff] border border-[#93c5fd] rounded-lg px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <p className="text-[15.5px] text-[#0f172a] leading-relaxed font-medium">
                    {selectedBoundary.detail}
                  </p>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {selectedBoundary.links.map((lnk, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          lnk.questionId
                            ? onNavigateToQuestion(lnk.questionId)
                            : onNavigateView(lnk.targetView)
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-extrabold bg-[#1e3a8a] text-white hover:bg-[#0f172a] transition-colors"
                      >
                        <span>{lnk.label}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* PPT 03페이지 레이아웃 그대로: 상단 2열(입법·행정) + 하단 사법부 통합 와이드 박스 */}
            <div className="space-y-5 pt-2">
              {/* 상단 2열: 입법부 / 행정부 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div
                  className={`rounded-xl border p-6 transition-all duration-200 ${
                    selectedBoundary && isHighlighted('legislative')
                      ? 'bg-white border-2 border-[#1e3a8a] shadow-sm'
                      : !selectedBoundary
                      ? 'bg-[#f8fafc] border-slate-300'
                      : 'bg-slate-50 border-slate-200 opacity-45'
                  }`}
                >
                  <div className="text-sm font-extrabold text-[#1e3a8a] mb-1.5">
                    입법부 · 국회
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0f172a] mb-3">
                    법률 제정 · 조약 체결·비준 및 파병 동의(제60조①·②)
                  </h3>
                  <ul className="space-y-1.5 text-[16.5px] text-slate-700 leading-relaxed">
                    <li>• 형량이나 법원 조직 등 일반 기준을 법률로 정함</li>
                    <li>
                      • 한계:{' '}
                      <span className="key-underline">
                        재판의 핵심 본질을 빼앗거나 기본권을 과도하게 제한할 수 없음
                      </span>
                    </li>
                  </ul>
                </div>

                <div
                  className={`rounded-xl border p-6 transition-all duration-200 ${
                    selectedBoundary && isHighlighted('executive')
                      ? 'bg-white border-2 border-[#1e3a8a] shadow-sm'
                      : !selectedBoundary
                      ? 'bg-[#f8fafc] border-slate-300'
                      : 'bg-slate-50 border-slate-200 opacity-45'
                  }`}
                >
                  <div className="text-sm font-extrabold text-[#1e3a8a] mb-1.5">
                    행정부 · 대통령
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0f172a] mb-3">
                    조약 체결·비준(제73조) · 국군 통수(제74조①)
                  </h3>
                  <ul className="space-y-1.5 text-[16.5px] text-slate-700 leading-relaxed">
                    <li>• 외교·국방에 관한 고도의 정치적 결단을 내림</li>
                    <li>
                      • 한계: 반드시{' '}
                      <span className="key-underline">
                        헌법이 정한 절차(국회의 사전동의 등)
                      </span>
                      를 지켜야 함
                    </li>
                  </ul>
                </div>
              </div>

              {/* 하단 통합 박스: 사법부 · 법원과 헌법재판소 (넓은 의미의 사법권) */}
              <div
                className={`rounded-xl border-2 border-[#1e3a8a] border-t-[5px] bg-[#f8fafc] p-6 sm:p-7 space-y-5 transition-opacity duration-200 ${
                  selectedBoundary &&
                  !isHighlighted('courts') &&
                  !isHighlighted('constCourt')
                    ? 'opacity-45'
                    : 'opacity-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-300 pb-3.5">
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#1e3a8a]">
                    사법부 · 법원과 헌법재판소 (넓은 의미의 사법권)
                  </h3>
                  <span className="text-sm sm:text-[15px] font-bold text-slate-600">
                    구체적 사건의 재판은 법원이, 헌법적 통제는 헌법재판소가 맡음
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div
                    className={`rounded-lg bg-white border p-5 sm:p-6 transition-all ${
                      selectedBoundary && isHighlighted('courts')
                        ? 'border-2 border-[#1e3a8a] shadow-sm'
                        : selectedBoundary
                        ? 'border-slate-200 opacity-50'
                        : 'border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-extrabold text-[#1e3a8a] mb-1.5">
                      법원 (헌법 제101조~제110조)
                    </div>
                    <h4 className="text-lg sm:text-xl font-extrabold text-[#0f172a] mb-2.5">
                      독립된 구체적 사건 재판 · 대법원규칙 제정
                    </h4>
                    <ul className="space-y-1.5 text-[16px] sm:text-[16.5px] text-slate-700 leading-relaxed">
                      <li>• 외부 간섭 없이 독립하여 재판함</li>
                      <li>
                        • 한계:{' '}
                        <span className="key-underline">
                          국회가 만든 법률 테두리 안
                        </span>
                        에서만 재판·규칙 제정 가능
                      </li>
                    </ul>
                  </div>

                  <div
                    className={`rounded-lg bg-white border p-5 sm:p-6 transition-all ${
                      selectedBoundary && isHighlighted('constCourt')
                        ? 'border-2 border-[#1e3a8a] shadow-sm'
                        : selectedBoundary
                        ? 'border-slate-200 opacity-50'
                        : 'border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-extrabold text-[#1e3a8a] mb-1.5">
                      헌법재판소 (헌법 제111조~제113조)
                    </div>
                    <h4 className="text-lg sm:text-xl font-extrabold text-[#0f172a] mb-2.5">
                      위헌법률심판 · 권한쟁의심판 등 헌법재판
                    </h4>
                    <ul className="space-y-1.5 text-[16px] sm:text-[16.5px] text-slate-700 leading-relaxed">
                      <li>
                        • 외교·국방 선택의 정치적 유불리는 판단하지 않음(사법자제)
                      </li>
                      <li>
                        • 역할:{' '}
                        <span className="key-underline">
                          헌법상 권한과 절차를 어겼는지
                        </span>
                        는 심판함
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ==================== PAGE 02 : 헌법 조문과 법의 서열 (슬라이드 04 · 05 계승) ==================== */}
        {pageIdx === 1 && (
          <motion.section
            key="schema-p1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-10"
          >
            <div className="border-b-2 border-[#0f172a] pb-4 space-y-1.5">
              <span className="text-sm font-extrabold text-[#1e3a8a] block">
                도입 · 규범의 위계와 헌법 제101조~제110조
              </span>
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
                법의 위아래 서열과 헌법이 정한 법원의 뼈대
              </h2>
            </div>

            {/* 파트 A : 법의 위아래 서열과 심사 기관 (교수님 피드백 3번 반영: 명령·규칙 & 2/3 이상 합의체) */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                  1. 법의 위아래 서열과 위헌·위법 심사 기관 (제107조)
                </h3>
                <span className="text-sm font-semibold text-slate-500">
                  각 단계를 클릭하면 심사 주체와 원칙이 표시됩니다
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* 좌측 4단계 법단계 스텝 */}
                <div className="lg:col-span-7 space-y-2.5">
                  {NORM_HIERARCHY_TIERS.map((tier) => {
                    const active = selectedTierId === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`w-full text-left rounded-lg p-4 sm:px-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          active
                            ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] shadow-sm'
                            : 'bg-[#f8fafc] border-slate-200 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-[#1e3a8a]">
                              {tier.rankLabel}
                            </span>
                            <span className="text-lg font-extrabold text-[#0f172a]">
                              {tier.name}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-0.5">
                            {tier.sub}
                          </p>
                        </div>

                        {tier.reviewOrgan && (
                          <span
                            className={`self-start sm:self-center shrink-0 text-xs sm:text-[13px] font-extrabold px-3 py-1.5 rounded-md ${
                              active
                                ? 'bg-[#1e3a8a] text-white'
                                : 'bg-white border border-slate-300 text-[#1e3a8a]'
                            }`}
                          >
                            → {tier.reviewOrgan}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 우측 선택 단계 설명 시트 */}
                <div className="lg:col-span-5 bg-[#f8fafc] border border-slate-300 border-t-4 border-t-[#1e3a8a] rounded-xl p-6 space-y-3">
                  <div className="text-xs font-extrabold text-[#1e3a8a]">
                    선택된 규범 단계 · {selectedTier.rankLabel}
                  </div>
                  <h4 className="text-xl font-extrabold text-[#0f172a]">
                    {selectedTier.name}
                  </h4>
                  {selectedTier.reviewRule && (
                    <div className="bg-white border border-[#93c5fd] rounded-lg px-3.5 py-2.5 text-sm font-bold text-[#1e3a8a]">
                      {selectedTier.reviewRule}
                    </div>
                  )}
                  <p className="text-[16px] text-slate-700 leading-relaxed">
                    {selectedTier.description}
                  </p>
                </div>
              </div>
            </div>

            {/* 파트 B : 헌법 제101조~제110조 핵심 표 (슬라이드 04 스타일) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                2. 헌법 제5장(제101조~제110조) 핵심 조문 한눈에 보기
              </h3>

              <div className="divide-y divide-slate-200 border border-slate-300 rounded-xl overflow-hidden">
                {CONSTITUTION_ARTICLES_SUMMARY.map((row) => (
                  <div
                    key={row.articles}
                    className="grid grid-cols-1 md:grid-cols-12 bg-white"
                  >
                    <div className="md:col-span-3 bg-[#eff6ff]/60 md:border-r border-slate-200 px-5 py-4 flex flex-col justify-center">
                      <span className="text-[16px] font-extrabold text-[#1e3a8a] tabular-nums">
                        {row.articles}
                      </span>
                      <span className="text-xs font-bold text-slate-500 mt-0.5">
                        {row.title}
                      </span>
                    </div>
                    <div className="md:col-span-9 px-5 py-4 flex items-center text-[16.5px] text-[#0f172a] leading-relaxed">
                      {row.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ==================== PAGE 03 : 법원조직법 3기구 & 대법관 정원 ==================== */}
        {pageIdx === 2 && (
          <motion.section
            key="schema-p2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-10"
          >
            <div className="border-b-2 border-[#0f172a] pb-4 space-y-1.5">
              <span className="text-sm font-extrabold text-[#1e3a8a] block">
                법원조직법 핵심 · 3기구 역할 분담과 대법관 정원 증원
              </span>
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
                이 사안은 어디서, 몇 명이 결정할까?
              </h2>
            </div>

            {/* 1. 6가지 상황 클릭형 라우터 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-2">
                {ROUTER_SITUATIONS.map((sit) => {
                  const active = sit.id === activeSituationId;
                  return (
                    <button
                      key={sit.id}
                      type="button"
                      onClick={() => setActiveSituationId(sit.id)}
                      className={`w-full text-left rounded-lg px-4 py-3.5 border transition-all flex items-baseline gap-3 ${
                        active
                          ? 'bg-[#eff6ff] border-2 border-[#1e3a8a] shadow-sm'
                          : 'bg-[#f8fafc] border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`text-sm font-extrabold tabular-nums shrink-0 ${
                          active ? 'text-[#1e3a8a]' : 'text-slate-400'
                        }`}
                      >
                        {sit.num}
                      </span>
                      <span className="text-[15.5px] sm:text-base font-bold text-[#0f172a] leading-snug">
                        {sit.question}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedSituation.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="rounded-xl border border-slate-300 border-t-4 border-t-[#1e3a8a] bg-[#f8fafc] p-6 sm:p-8 space-y-5"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-[#1e3a8a] bg-white border border-[#93c5fd] px-2.5 py-1 rounded">
                          {selectedSituation.shortTag}
                        </span>
                        <span className="text-sm font-bold text-slate-600 tabular-nums">
                          {selectedSituation.legalBasis}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] pt-1">
                        {selectedSituation.organTitle}
                      </h3>
                      <p className="text-base sm:text-[17px] font-bold text-[#1e3a8a]">
                        {selectedSituation.organSubtitle}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 space-y-2 text-[16px]">
                      <div>
                        <strong className="text-[#0f172a] font-extrabold mr-2">
                          핵심 기준:
                        </strong>
                        <span className="key-underline">
                          {selectedSituation.quorumOrRule}
                        </span>
                      </div>
                      {selectedSituation.proposerOrNote && (
                        <div className="text-slate-700 font-semibold pt-1">
                          • {selectedSituation.proposerOrNote}
                        </div>
                      )}
                    </div>

                    <div className="border-l-4 border-l-[#b91c1c] bg-[#fef2f2] rounded-r-lg p-4 space-y-2 text-[15.5px] leading-relaxed text-[#0f172a]">
                      <p>
                        <strong className="text-[#b91c1c] font-extrabold mr-1.5">
                          함정 주의:
                        </strong>
                        {selectedSituation.keyWarning}
                      </p>
                      {selectedSituation.examCaution && (
                        <p className="text-sm text-slate-700 pt-1 border-t border-[#fca5a5]/70">
                          <strong className="font-extrabold text-[#0f172a] mr-1">
                            조문 원문 체크:
                          </strong>
                          {selectedSituation.examCaution}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                      {selectedSituation.relatedQuestionIds.map((qId) => (
                        <button
                          key={qId}
                          type="button"
                          onClick={() => onNavigateToQuestion(qId)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-extrabold bg-white border border-slate-300 text-[#0f172a] hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors tabular-nums"
                        >
                          <span>관련 문항 Q{qId} 확인</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* 2. 대법관 정원 변화 시뮬레이터 (법률 제21451호 부칙 반영 — 깔끔하게 정돈) */}
            <div className="border-t border-slate-200 pt-8 space-y-5">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-sm font-extrabold text-[#1e3a8a] block mb-1">
                    개정 법원조직법 · 법률 제21451호 부칙 반영
                  </span>
                  <h3 className="text-xl font-extrabold text-[#0f172a]">
                    대법관 정원 변화(현행 14명 → 2030년 26명)와 전원 2/3 이상 기준
                  </h3>
                </div>

                <div className="inline-flex flex-wrap bg-[#f1f5f9] p-1 rounded-lg border border-slate-300 self-start">
                  {QUOTA_MILESTONES.map((m, idx) => {
                    const active = idx === activeQuotaIndex;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setActiveQuotaIndex(idx)}
                        className={`relative px-3.5 py-2 rounded-md text-sm font-extrabold transition-colors tabular-nums ${
                          active ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="cleanQuotaTab"
                            transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                            className="absolute inset-0 bg-[#1e3a8a] rounded-md"
                          />
                        )}
                        <span className="relative z-10">{m.periodLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#f8fafc] rounded-xl border border-slate-200 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <span className="text-xs font-bold text-slate-500 block mb-1">
                      대법관 총원 (대법원장 포함)
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tabular-nums">
                      총 {selectedQuota.totalJustices}명
                    </div>
                    <span className="text-xs font-semibold text-slate-500 mt-1 block">
                      {selectedQuota.addedNote}
                    </span>
                  </div>

                  <div className="bg-[#eff6ff] rounded-lg border border-[#93c5fd] p-4">
                    <span className="text-xs font-extrabold text-[#1e3a8a] block mb-1">
                      전원 2/3 이상 최소 인원
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#1e3a8a] tabular-nums">
                      최소 {selectedQuota.twoThirdsMin}명
                    </div>
                    <span className="text-xs font-semibold text-slate-600 mt-1 block tabular-nums">
                      {selectedQuota.formulaNote}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
                    <span>좌석 점등 인디케이터 (총 26석 기준)</span>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-[#1e3a8a] inline-block" />
                        2/3 정족수 ({selectedQuota.twoThirdsMin}명)
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" />
                        재직 정원
                      </span>
                      {selectedQuota.totalJustices < 26 && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-sm border border-dashed border-slate-300 inline-block" />
                          증원 예정
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-7 sm:grid-cols-[repeat(13,minmax(0,1fr))] gap-2">
                    {Array.from({ length: 26 }, (_, i) => {
                      const seat = i + 1;
                      const isLit = seat <= selectedQuota.twoThirdsMin;
                      const isCurrent = seat <= selectedQuota.totalJustices;
                      return (
                        <div
                          key={seat}
                          className={`h-9 rounded-md flex items-center justify-center text-xs font-extrabold tabular-nums transition-all ${
                            isLit
                              ? 'bg-[#1e3a8a] text-white shadow-sm'
                              : isCurrent
                              ? 'bg-slate-200 text-slate-700'
                              : 'border border-dashed border-slate-300 text-slate-300'
                          }`}
                        >
                          {seat}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ==================== PAGE 04 : 핵심 헌재 결정례 4선 ==================== */}
        {pageIdx === 3 && (
          <motion.section
            key="schema-p3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-8"
          >
            <div className="border-b-2 border-[#0f172a] pb-4 flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-1.5">
                <span className="text-sm font-extrabold text-[#1e3a8a] block">
                  사법권의 독립과 한계 · 결론은 네 사건 모두 ‘합헌’
                </span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
                  핵심 헌법재판소 결정례 4선 & 수업 연결 포인트
                </h2>
              </div>
              <span className="text-sm font-semibold text-slate-500">
                [헷갈림 저장] 시 AI 복습 코치 과외 목록에 추가됩니다
              </span>
            </div>

            <div className="space-y-5">
              {CORE_PRECEDENTS.map((prec) => {
                const isBookmarked = bookmarkedCases.includes(prec.id);
                const isTrap = prec.bridgeTitle.includes('함정');

                return (
                  <article
                    key={prec.id}
                    className="rounded-xl border border-slate-300 bg-[#f8fafc] p-6 sm:p-7 space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-extrabold bg-[#1e3a8a] text-white px-3 py-0.5 rounded tabular-nums">
                            {prec.verdict}
                          </span>
                          <span className="text-base font-extrabold text-[#1e3a8a] tabular-nums">
                            {prec.caseNumber}
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-[#0f172a] pt-0.5">
                          {prec.title}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleCaseBookmark(prec.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold border transition-colors ${
                          isBookmarked
                            ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-[#1e3a8a] hover:text-[#1e3a8a]'
                        }`}
                      >
                        {isBookmarked ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>저장됨</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-4 h-4" />
                            <span>헷갈림 저장</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[16.5px] sm:text-[17.5px] text-slate-800 leading-[1.7] bg-white rounded-lg border border-slate-200 p-5">
                      {prec.summary}
                    </p>

                    {prec.visualScale && (
                      <div className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex flex-wrap items-center gap-2.5 text-sm sm:text-[15px] font-bold tabular-nums">
                        <span className="bg-slate-100 text-slate-900 px-3 py-1 rounded">
                          {prec.visualScale.step1}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="bg-[#fef2f2] text-[#b91c1c] border border-[#fca5a5] px-3 py-1 rounded">
                          {prec.visualScale.step2}
                        </span>
                        <span className="text-slate-400">&gt;</span>
                        <span className="bg-[#eff6ff] text-[#1e3a8a] border border-[#93c5fd] px-3 py-1 rounded">
                          {prec.visualScale.step3}
                        </span>
                      </div>
                    )}

                    <div
                      className={`rounded-r-lg border-l-4 px-5 py-3.5 text-[15.5px] leading-relaxed ${
                        isTrap
                          ? 'bg-[#fef2f2] border border-[#fca5a5] border-l-[#b91c1c] text-slate-900'
                          : 'bg-[#eff6ff] border border-[#93c5fd] border-l-[#1e3a8a] text-slate-900'
                      }`}
                    >
                      <strong
                        className={`font-extrabold mr-2 ${
                          isTrap ? 'text-[#b91c1c]' : 'text-[#1e3a8a]'
                        }`}
                      >
                        {prec.bridgeTitle}:
                      </strong>
                      {prec.bridgeText}
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 하단 이전 / 다음 페이지 이동 바 */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => goPage(Math.max(0, pageIdx - 1))}
          disabled={pageIdx === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-white border border-slate-300 text-slate-700 hover:border-[#0f172a] hover:text-[#0f172a] disabled:opacity-35 disabled:pointer-events-none transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전 주제</span>
        </button>

        <span className="text-sm font-extrabold text-slate-500 tabular-nums">
          {pageIdx + 1} / {SCHEMA_PAGES.length}
        </span>

        {pageIdx < SCHEMA_PAGES.length - 1 ? (
          <button
            type="button"
            onClick={() => goPage(pageIdx + 1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] transition-colors shadow-sm"
          >
            <span>다음: {SCHEMA_PAGES[pageIdx + 1].label}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigateView('trainer')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#1e3a8a] text-white hover:bg-[#0f172a] transition-colors shadow-sm"
          >
            <span>문제 훈련으로 넘어가기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
