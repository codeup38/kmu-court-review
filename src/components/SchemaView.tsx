import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
  BOUNDARY_SUMMARIES,
  CONSTITUTION_ARTICLES_SUMMARY,
  CORE_PRECEDENTS,
  COURT_THREE_ORGANS,
  NORM_HIERARCHY_TIERS,
  OVERARCHING_QUESTION,
  QUOTA_MILESTONES,
} from '../data/schemaData';
import { MainViewId } from '../types';

interface SchemaViewProps {
  onNavigateToQuestion: (questionId: number) => void;
  onNavigateView: (view: MainViewId) => void;
}

type TopicId = 'powers' | 'hierarchy' | 'organs' | 'precedents';

const CONCEPT_TOPICS: { id: TopicId; label: string }[] = [
  { id: 'powers', label: '삼권분립과 사법부' },
  { id: 'hierarchy', label: '법의 서열과 헌법 조문' },
  { id: 'organs', label: '대법원 3기구와 정원 변화' },
  { id: 'precedents', label: '핵심 합헌 판례 4선' },
];

export const SchemaView: React.FC<SchemaViewProps> = ({
  onNavigateToQuestion,
  onNavigateView,
}) => {
  const [topic, setTopic] = useState<TopicId>('powers');
  const [quotaIdx, setQuotaIdx] = useState<number>(0);

  const selectedQuota = QUOTA_MILESTONES[quotaIdx];

  return (
    <div className="space-y-6">
      {/* 한 줄 안내 + 4개 주제 선택 탭 (순서 강요 없이 즉시 전환) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3.5">
        <p className="text-sm sm:text-[16px] text-slate-600 font-medium">
          발표에서 다룬 사법부 핵심 개념을 주제별로 정리했습니다. 복습하고 싶은 주제를 선택해 바로 확인하세요.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {CONCEPT_TOPICS.map((t) => {
            const active = topic === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTopic(t.id)}
                className={`relative px-3.5 py-2.5 rounded-lg text-sm sm:text-[16px] font-bold text-center transition-colors ${
                  active
                    ? 'text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="conceptTopicPill"
                    transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                    className="absolute inset-0 bg-[#0f172a] rounded-lg"
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== 주제 1 : 삼권분립과 사법부 ==================== */}
      {topic === 'powers' && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b-2 border-[#0f172a] pb-4 space-y-1">
            <span className="text-sm font-extrabold text-[#1e3a8a] block">
              핵심 관점 · 삼권분립의 구조
            </span>
            <h2 className="text-2xl sm:text-[29px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
              삼권분립에서 각 기관이 맡은 역할과 넘지 못하는 선
            </h2>
          </div>

          <div className="bg-[#f8fafc] border border-slate-200 border-l-4 border-l-[#1e3a8a] rounded-r-lg px-5 py-4 text-base sm:text-[18.5px] text-[#0f172a] leading-relaxed font-medium">
            {OVERARCHING_QUESTION}
          </div>

          {/* 삼권분립 3기둥 (슬라이드 03 구조 그대로: 상단 2열 입법·행정 + 하단 사법부 통합 컨테이너) */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-xl border border-slate-300 bg-[#f8fafc] p-6">
                <div className="text-sm font-extrabold text-[#1e3a8a] mb-1">
                  입법부 · 국회
                </div>
                <h3 className="text-xl font-extrabold text-[#0f172a] mb-3">
                  법률 제정 · 조약 및 파병 동의(제60조①·②)
                </h3>
                <ul className="space-y-1.5 text-[17px] sm:text-[17.5px] text-slate-700 leading-relaxed">
                  <li>• 형량이나 법원 조직 등 일반 기준을 법률로 정함</li>
                  <li>
                    • 한계:{' '}
                    <span className="key-underline">
                      재판의 핵심 본질을 빼앗거나 기본권을 과도하게 제한할 수 없음
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-300 bg-[#f8fafc] p-6">
                <div className="text-sm font-extrabold text-[#1e3a8a] mb-1">
                  행정부 · 대통령
                </div>
                <h3 className="text-xl font-extrabold text-[#0f172a] mb-3">
                  조약 체결·비준(제73조) · 국군 통수(제74조①)
                </h3>
                <ul className="space-y-1.5 text-[17px] sm:text-[17.5px] text-slate-700 leading-relaxed">
                  <li>• 외교·국방에 관한 고도의 정치적 결단을 내림</li>
                  <li>
                    • 한계: 반드시{' '}
                    <span className="key-underline">
                      헌법이 정한 절차(국회 동의 등)
                    </span>
                    를 지켜야 함
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl border-2 border-[#1e3a8a] border-t-[5px] bg-[#f8fafc] p-6 sm:p-7 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-300 pb-3.5">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#1e3a8a]">
                  사법부 · 법원과 헌법재판소 (넓은 의미의 사법권)
                </h3>
                <span className="text-sm font-bold text-slate-600">
                  구체적 사건의 재판은 법원이, 헌법적 통제는 헌법재판소가 맡음
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-lg bg-white border border-slate-300 p-5 sm:p-6">
                  <div className="text-sm font-extrabold text-[#1e3a8a] mb-1">
                    법원 (헌법 제101조~제110조)
                  </div>
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#0f172a] mb-2.5">
                    독립된 재판 · 대법원규칙 제정
                  </h4>
                  <ul className="space-y-1.5 text-[17px] text-slate-700 leading-relaxed">
                    <li>• 외부 간섭 없이 독립하여 구체적 사건을 재판함</li>
                    <li>
                      • 한계:{' '}
                      <span className="key-underline">
                        국회가 만든 법률 테두리 안
                      </span>
                      에서만 재판·규칙 제정 가능
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-white border border-slate-300 p-5 sm:p-6">
                  <div className="text-sm font-extrabold text-[#1e3a8a] mb-1">
                    헌법재판소 (헌법 제111조~제113조)
                  </div>
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#0f172a] mb-2.5">
                    위헌법률 · 권한쟁의 심판
                  </h4>
                  <ul className="space-y-1.5 text-[17px] text-slate-700 leading-relaxed">
                    <li>• 외교·국방의 정치적 유불리는 판단하지 않음(사법자제)</li>
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

          {/* 3가지 핵심 경계 요약 + 해당 문제 바로가기 */}
          <div className="pt-2 space-y-3">
            <h3 className="text-lg font-extrabold text-[#0f172a]">
              이번 발표에서 다루는 세 가지 경계
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BOUNDARY_SUMMARIES.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 bg-[#f8fafc] p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="text-xs font-extrabold text-[#1e3a8a] mb-1.5">
                      {item.code}
                    </div>
                    <div className="text-[18px] font-extrabold text-[#0f172a] leading-snug mb-2">
                      {item.title}
                    </div>
                    <p className="text-[16px] text-slate-600 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      item.questionId
                        ? onNavigateToQuestion(item.questionId)
                        : onNavigateView(item.targetView)
                    }
                    className="inline-flex items-center gap-1 text-sm font-extrabold text-[#1e3a8a] hover:underline self-start"
                  >
                    <span>{item.linkLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== 주제 2 : 법의 서열과 헌법 조문 ==================== */}
      {topic === 'hierarchy' && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-10">
          <div className="border-b-2 border-[#0f172a] pb-4 space-y-1">
            <span className="text-sm font-extrabold text-[#1e3a8a] block">
              법단계와 헌법 제5장 「법원」
            </span>
            <h2 className="text-2xl sm:text-[29px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
              법의 위아래 서열과 헌법 제101조~제110조 정리
            </h2>
          </div>

          {/* 1. 법의 서열 (클릭 뒤에 숨기지 않고 바로 한눈에 표시) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-[#0f172a]">
                1. 법의 위아래 서열과 위헌·위법 심사 기관 (헌법 제107조)
              </h3>
              <p className="text-[16.5px] text-slate-600 mt-1">
                아래 단계의 법은 위 단계의 법에 어긋날 수 없으며, 법원의 심사 대상은 대법원규칙에 한정되지 않고 ‘명령·규칙’ 전반을 포함합니다.
              </p>
            </div>

            <div className="space-y-3">
              {NORM_HIERARCHY_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={`rounded-xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    tier.emphasis
                      ? 'bg-[#eff6ff]/60 border-2 border-[#1e3a8a]'
                      : 'bg-[#f8fafc] border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-extrabold text-[#1e3a8a]">
                        {tier.rank}
                      </span>
                      <span className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                        {tier.name}
                      </span>
                    </div>
                    <p className="text-[16.5px] text-slate-700">{tier.sub}</p>
                  </div>

                  {tier.reviewTarget && (
                    <div className="md:max-w-md md:text-right bg-white rounded-lg border border-slate-200 px-4 py-3 shrink-0">
                      <div className="text-sm font-extrabold text-[#1e3a8a]">
                        심사 기관 : {tier.reviewTarget}
                      </div>
                      <div className="text-xs sm:text-[13.5px] font-semibold text-slate-600 mt-0.5 leading-snug">
                        {tier.reviewDetail}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. 헌법 제101~110조 핵심 표 */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xl font-extrabold text-[#0f172a]">
              2. 헌법 제101조~제110조 핵심 뼈대
            </h3>

            <div className="divide-y divide-slate-200 border border-slate-300 rounded-xl overflow-hidden">
              {CONSTITUTION_ARTICLES_SUMMARY.map((row) => (
                <div
                  key={row.articles}
                  className="grid grid-cols-1 md:grid-cols-12 bg-white"
                >
                  <div className="md:col-span-3 bg-[#eff6ff]/50 md:border-r border-slate-200 px-5 py-4 flex flex-col justify-center">
                    <span className="text-[17px] font-extrabold text-[#1e3a8a] tabular-nums">
                      {row.articles}
                    </span>
                    <span className="text-xs font-bold text-slate-500 mt-0.5">
                      {row.title}
                    </span>
                  </div>
                  <div className="md:col-span-9 px-5 py-4 flex items-center text-[17.5px] text-[#0f172a] leading-relaxed">
                    {row.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== 주제 3 : 대법원 3기구와 정원 변화 ==================== */}
      {topic === 'organs' && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-10">
          <div className="border-b-2 border-[#0f172a] pb-4 space-y-1">
            <span className="text-sm font-extrabold text-[#1e3a8a] block">
              「법원조직법」 핵심 정리
            </span>
            <h2 className="text-2xl sm:text-[29px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
              대법원 안의 세 기구 비교와 대법관 정원 변화
            </h2>
          </div>

          {/* 1. 대법원 3기구 한눈에 비교표 */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-[#0f172a]">
                1. 기출에서 가장 자주 섞어 내는 대법원 세 기구
              </h3>
              <p className="text-[16.5px] text-slate-600 mt-1">
                실제 시험 선지에서는 아래 세 기구의 역할(심의·의결·재판), 인원, 출석 정족수를 서로 바꾸어 오답을 만듭니다.
              </p>
            </div>

            <div className="space-y-4">
              {COURT_THREE_ORGANS.map((org) => (
                <div
                  key={org.name}
                  className="rounded-xl border border-slate-300 bg-[#f8fafc] p-5 sm:p-6 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                        {org.name}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-[#1e3a8a] text-white text-xs font-extrabold">
                        {org.role}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-500 tabular-nums">
                      {org.basis}
                    </span>
                  </div>

                  <p className="text-[17.5px] font-bold text-[#0f172a] leading-relaxed bg-white rounded-lg border border-slate-200 px-4 py-3">
                    {org.composition}
                  </p>

                  <p className="text-[16px] text-[#b91c1c] font-semibold leading-relaxed">
                    주의 : {org.trap}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-r-lg border-l-4 border-l-[#1e3a8a] bg-[#eff6ff]/70 border border-[#93c5fd] px-5 py-4 text-[16.5px] text-slate-800 leading-relaxed">
              <strong className="font-extrabold text-[#1e3a8a] mr-1.5">
                조문 표현 체크:
              </strong>
              실무나 홈페이지에서는 흔히 ‘전원합의체’라고 부르지만, 법원조직법 제7조 제1항의 정확한 조문 표현은{' '}
              <span className="key-underline">
                ‘대법관 전원의 3분의 2 이상의 합의체’
              </span>
              입니다.
            </div>
          </div>

          {/* 2. 대법관 정원 단계적 증원 (맥락 설명 먼저 + 깔끔한 연도 선택) */}
          <div className="border-t border-slate-200 pt-8 space-y-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#0f172a]">
                2. 법원조직법 개정에 따른 대법관 정원 변화 (현행 14명 → 2030년 26명)
              </h3>
              <p className="text-[16.5px] text-slate-600 mt-1 leading-relaxed">
                개정 법원조직법(법률 제21451호 부칙)에 따라 대법관 정원이 단계적으로 늘어나며, 그에 맞춰 ‘대법관 전원의 3분의 2 이상’ 기준 인원도 함께 달라집니다. 연도를 눌러 확인해 보세요.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {QUOTA_MILESTONES.map((m, idx) => {
                const active = idx === quotaIdx;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setQuotaIdx(idx)}
                    className={`rounded-xl px-4 py-3.5 border text-left transition-all tabular-nums ${
                      active
                        ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white shadow-sm'
                        : 'bg-[#f8fafc] border-slate-200 text-slate-700 hover:bg-white hover:border-[#1e3a8a]'
                    }`}
                  >
                    <div
                      className={`text-xs font-bold ${
                        active ? 'text-[#bfdbfe]' : 'text-slate-500'
                      }`}
                    >
                      {m.periodLabel}
                    </div>
                    <div className="text-lg font-extrabold mt-0.5">
                      총 {m.totalJustices}명
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl bg-[#f8fafc] border border-slate-200 p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <span className="text-xs font-bold text-slate-500 block">
                    선택 시점 대법관 총원 (대법원장 포함)
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mt-1 tabular-nums">
                    총 {selectedQuota.totalJustices}명
                  </div>
                  <span className="text-sm text-slate-600 mt-1 block">
                    {selectedQuota.note}
                  </span>
                </div>

                <div className="bg-[#eff6ff] rounded-lg border border-[#93c5fd] p-4">
                  <span className="text-xs font-extrabold text-[#1e3a8a] block">
                    대법관 전원의 3분의 2 이상 최소 인원
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1e3a8a] mt-1 tabular-nums">
                    최소 {selectedQuota.twoThirdsMin}명
                  </div>
                  <span className="text-sm text-slate-700 mt-1 block tabular-nums">
                    재판 합의체 · 대법관회의 출석 기준 동일 적용
                  </span>
                </div>
              </div>

              {/* 깔끔한 비율 바 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-500 tabular-nums">
                  <span>
                    전원 2/3 이상 기준 ({selectedQuota.twoThirdsMin}명 /{' '}
                    {selectedQuota.totalJustices}명)
                  </span>
                  <span>2030년 최종 정원 26명 대비</span>
                </div>
                <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#1e3a8a] transition-all duration-300"
                    style={{
                      width: `${(selectedQuota.twoThirdsMin / 26) * 100}%`,
                    }}
                  />
                  <div
                    className="h-full bg-slate-400/70 transition-all duration-300"
                    style={{
                      width: `${
                        ((selectedQuota.totalJustices -
                          selectedQuota.twoThirdsMin) /
                          26) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 주제 4 : 핵심 합헌 판례 4선 ==================== */}
      {topic === 'precedents' && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-7">
          <div className="border-b-2 border-[#0f172a] pb-4 space-y-1">
            <span className="text-sm font-extrabold text-[#1e3a8a] block">
              사법권의 독립과 한계 · 기출 핵심 결정례
            </span>
            <h2 className="text-2xl sm:text-[29px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
              사법권 독립을 다툰 네 사건 — 결론은 전부 ‘합헌’
            </h2>
          </div>

          <p className="text-[17px] text-slate-600 leading-relaxed">
            기출문제에서는 아래 네 사건에서 패소한 청구인의 주장이나 결정문 뒤의 소수 반대의견을 마치 헌재의 결론(위헌)인 것처럼 서술해 오답 선지를 만듭니다.
          </p>

          <div className="space-y-5">
            {CORE_PRECEDENTS.map((prec) => (
              <article
                key={prec.id}
                className="rounded-xl border border-slate-300 bg-[#f8fafc] p-6 space-y-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs sm:text-sm font-extrabold bg-[#1e3a8a] text-white px-2.5 py-0.5 rounded">
                      {prec.verdict}
                    </span>
                    <span className="text-base font-extrabold text-[#1e3a8a] tabular-nums">
                      {prec.caseNumber}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0f172a]">
                    {prec.title}
                  </h3>
                </div>

                <p className="text-[17.5px] sm:text-[18.5px] text-slate-800 leading-[1.72] bg-white rounded-lg border border-slate-200 p-5">
                  {prec.summary}
                </p>

                {prec.scale && (
                  <div className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex flex-wrap items-center gap-2 text-sm font-bold tabular-nums">
                    <span className="bg-slate-100 text-slate-900 px-2.5 py-1 rounded">
                      {prec.scale.step1}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-[#fef2f2] text-[#b91c1c] border border-[#fca5a5] px-2.5 py-1 rounded">
                      {prec.scale.step2}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-[#eff6ff] text-[#1e3a8a] border border-[#93c5fd] px-2.5 py-1 rounded">
                      {prec.scale.step3}
                    </span>
                  </div>
                )}

                <div
                  className={`rounded-r-lg border-l-4 px-5 py-3.5 text-[16.5px] leading-relaxed ${
                    prec.isTrap
                      ? 'bg-[#fef2f2] border border-[#fca5a5] border-l-[#b91c1c] text-slate-900'
                      : 'bg-[#eff6ff] border border-[#93c5fd] border-l-[#1e3a8a] text-slate-900'
                  }`}
                >
                  <strong
                    className={`font-extrabold mr-1.5 ${
                      prec.isTrap ? 'text-[#b91c1c]' : 'text-[#1e3a8a]'
                    }`}
                  >
                    {prec.noteTitle}:
                  </strong>
                  {prec.noteText}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
