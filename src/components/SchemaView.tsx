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

const ROLE_BADGE_STYLE: Record<string, string> = {
  '인사 심의': 'bg-teal-700 text-white',
  '사법행정 의결': 'bg-amber-700 text-white',
  '사건 재판': 'bg-[#1e3a8a] text-white',
};

export const SchemaView: React.FC<SchemaViewProps> = ({
  onNavigateToQuestion,
  onNavigateView,
}) => {
  const [topic, setTopic] = useState<TopicId>('powers');
  const [quotaIdx, setQuotaIdx] = useState<number>(0);

  const selectedQuota = QUOTA_MILESTONES[quotaIdx];

  return (
    <div className="space-y-7">
      {/* 상단 주제 전환 바 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {CONCEPT_TOPICS.map((t) => {
            const active = topic === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTopic(t.id)}
                className={`relative px-4 py-3 rounded-xl text-[15px] sm:text-base font-bold text-center transition-colors ${
                  active
                    ? 'text-white'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="conceptTopicPill"
                    transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                    className="absolute inset-0 bg-[#0f172a] rounded-xl"
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
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-11 shadow-sm space-y-10">
          {/* 섹션 타이틀 */}
          <div className="space-y-2">
            <span className="text-sm font-extrabold text-[#1e3a8a] tracking-tight block">
              핵심 관점 · 삼권분립의 구조
            </span>
            <h2 className="text-2xl sm:text-[31px] font-extrabold text-[#0f172a] tracking-tight leading-tight">
              삼권분립에서 각 기관이 맡은 역할과 넘지 못하는 선
            </h2>
          </div>

          {/* 시선을 잡아주는 다크 잉크 관통 질문 배너 */}
          <div className="rounded-2xl bg-[#0f172a] text-white px-6 py-6 sm:px-8 sm:py-7 shadow-sm">
            <span className="text-xs sm:text-sm font-bold text-[#93c5fd] block mb-1.5">
              오늘 네 문제를 관통하는 하나의 질문
            </span>
            <p className="text-lg sm:text-[21px] font-bold leading-relaxed text-slate-50">
              {OVERARCHING_QUESTION}
            </p>
          </div>

          {/* 삼권분립 구조: 상단 입법·행정 (깔끔한 2열 구분) + 하단 사법부 포컬 컨테이너 */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-1">
              {/* 입법부 */}
              <div className="border-t-[3px] border-slate-800 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-500">
                    입법부 · 국회
                  </span>
                  <span className="text-xs font-bold text-slate-400 tabular-nums">
                    제40조 · 제60조①·②
                  </span>
                </div>
                <h3 className="text-xl sm:text-[22px] font-extrabold text-[#0f172a]">
                  법률 제정 · 조약 및 파병 동의
                </h3>
                <p className="text-[17px] sm:text-[18px] text-slate-700 leading-[1.72]">
                  형량이나 법원 조직 등 일반 기준을 법률로 정하되,{' '}
                  <strong className="font-extrabold text-[#0f172a]">
                    재판의 핵심 본질을 빼앗거나 기본권을 과도하게 제한할 수 없다.
                  </strong>
                </p>
              </div>

              {/* 행정부 */}
              <div className="border-t-[3px] border-slate-800 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-500">
                    행정부 · 대통령
                  </span>
                  <span className="text-xs font-bold text-slate-400 tabular-nums">
                    제73조 · 제74조①
                  </span>
                </div>
                <h3 className="text-xl sm:text-[22px] font-extrabold text-[#0f172a]">
                  조약 체결·비준 · 국군 통수
                </h3>
                <p className="text-[17px] sm:text-[18px] text-slate-700 leading-[1.72]">
                  외교·국방의 고도의 정치적 결단을 내리되, 반드시{' '}
                  <strong className="font-extrabold text-[#0f172a]">
                    헌법이 정한 절차(국회의 사전동의 등)
                  </strong>
                  를 지켜야 한다.
                </p>
              </div>
            </div>

            {/* 사법부 통합 포컬 블록 (법원 + 헌법재판소) */}
            <div className="rounded-2xl bg-[#eff6ff]/65 border border-[#93c5fd] border-t-4 border-t-[#1e3a8a] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 border-b border-[#bfdbfe] pb-4">
                <h3 className="text-xl sm:text-[22px] font-extrabold text-[#1e3a8a]">
                  사법부 · 법원과 헌법재판소 (넓은 의미의 사법권)
                </h3>
                <span className="text-[15px] font-bold text-slate-600">
                  구체적 사건 재판은 법원이, 헌법적 통제는 헌법재판소가 분담
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2.5">
                  <div className="text-sm font-extrabold text-[#1e3a8a] tabular-nums">
                    법원 (헌법 제101조~제110조)
                  </div>
                  <h4 className="text-xl font-extrabold text-[#0f172a]">
                    독립된 재판 · 대법원규칙 제정
                  </h4>
                  <p className="text-[17px] sm:text-[18px] text-slate-700 leading-[1.72]">
                    외부 간섭 없이 독립하여 재판하지만,{' '}
                    <span className="key-underline">
                      국회가 만든 법률 테두리 안
                    </span>
                    에서만 재판·규칙 제정이 가능하다.
                  </p>
                </div>

                <div className="space-y-2.5 md:border-l md:border-[#bfdbfe] md:pl-8">
                  <div className="text-sm font-extrabold text-[#1e3a8a] tabular-nums">
                    헌법재판소 (헌법 제111조~제113조)
                  </div>
                  <h4 className="text-xl font-extrabold text-[#0f172a]">
                    위헌법률 · 권한쟁의 심판
                  </h4>
                  <p className="text-[17px] sm:text-[18px] text-slate-700 leading-[1.72]">
                    외교·국방의 정치적 유불리는 판단을 자제하되,{' '}
                    <span className="key-underline">
                      헌법상 권한과 절차를 어겼는지
                    </span>
                    는 심판한다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 세 가지 경계 요약 (박스 테두리 없이 시원한 타이포그래피 3열 인덱스) */}
          <div className="border-t-2 border-slate-900 pt-8 space-y-6">
            <h3 className="text-xl font-extrabold text-[#0f172a]">
              문제에 바로 적용되는 세 가지 경계
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BOUNDARY_SUMMARIES.map((item, idx) => (
                <div key={item.id} className="space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-2xl font-extrabold text-[#1e3a8a]/35 tabular-nums block">
                      0{idx + 1}
                    </span>
                    <h4 className="text-[18.5px] sm:text-[19.5px] font-extrabold text-[#0f172a] leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[16.5px] text-slate-600 leading-[1.68]">
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
                    className="inline-flex items-center gap-1.5 pt-2 text-[15px] font-extrabold text-[#1e3a8a] hover:text-[#0f172a] transition-colors self-start"
                  >
                    <span>{item.linkLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== 주제 2 : 법의 서열과 헌법 조문 ==================== */}
      {topic === 'hierarchy' && (
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-11 shadow-sm space-y-12">
          <div className="space-y-2">
            <span className="text-sm font-extrabold text-[#1e3a8a] block">
              법단계와 헌법 제5장 「법원」
            </span>
            <h2 className="text-2xl sm:text-[31px] font-extrabold text-[#0f172a] tracking-tight leading-tight">
              법의 위아래 서열과 헌법 제101조~제110조
            </h2>
          </div>

          {/* 1. 수직 스파인(Spine) 구조로 한눈에 들어오는 법의 서열 */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-[22px] font-extrabold text-[#0f172a]">
                1. 법의 서열과 위헌·위법 심사 주체 (헌법 제107조)
              </h3>
              <p className="text-[17px] text-slate-600 leading-relaxed">
                하위 규범은 상위 규범에 어긋날 수 없으며, 법원의 심사 대상은 대법원규칙에 한정되지 않고 ‘명령·규칙’ 전반을 포함합니다.
              </p>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-300 space-y-6 ml-2">
              {NORM_HIERARCHY_TIERS.map((tier, idx) => (
                <div key={tier.id} className="relative">
                  {/* 수직 라인 위 원형 마커 */}
                  <span
                    className={`absolute -left-[33px] sm:-left-[41px] top-1.5 w-4 h-4 rounded-full border-2 ${
                      tier.emphasis
                        ? 'bg-[#1e3a8a] border-[#1e3a8a] ring-4 ring-[#dbeafe]'
                        : idx === 0
                        ? 'bg-[#0f172a] border-[#0f172a]'
                        : 'bg-white border-slate-400'
                    }`}
                  />

                  <div
                    className={
                      tier.emphasis
                        ? 'rounded-xl bg-[#eff6ff]/75 border-l-4 border-l-[#1e3a8a] p-5 sm:p-6'
                        : 'py-1'
                    }
                  >
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                      <div>
                        <span className="text-xs sm:text-sm font-extrabold text-[#1e3a8a] mr-2.5">
                          {tier.rank}
                        </span>
                        <span className="text-xl sm:text-[22px] font-extrabold text-[#0f172a]">
                          {tier.name}
                        </span>
                        <p className="text-[16.5px] sm:text-[17.5px] text-slate-600 mt-1">
                          {tier.sub}
                        </p>
                      </div>

                      {tier.reviewTarget && (
                        <div className="mt-2 md:mt-0 md:text-right shrink-0">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-extrabold ${
                              tier.emphasis
                                ? 'bg-[#1e3a8a] text-white'
                                : 'bg-slate-900 text-white'
                            }`}
                          >
                            심사 주체 · {tier.reviewTarget}
                          </span>
                          <p className="text-[15px] font-semibold text-slate-700 mt-1.5 max-w-md">
                            {tier.reviewDetail}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 박스 감옥을 없앤 시원한 개방형 조문 리스트 */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xl sm:text-[22px] font-extrabold text-[#0f172a]">
              2. 헌법 제101조~제110조 핵심 뼈대
            </h3>

            <div className="border-t-2 border-slate-900 divide-y divide-slate-200 border-b border-slate-200">
              {CONSTITUTION_ARTICLES_SUMMARY.map((row) => (
                <div
                  key={row.articles}
                  className="py-5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-baseline"
                >
                  <div className="md:col-span-3">
                    <span className="text-[18px] font-extrabold text-[#1e3a8a] tabular-nums block">
                      {row.articles}
                    </span>
                    <span className="text-sm font-bold text-slate-500">
                      {row.title}
                    </span>
                  </div>
                  <div className="md:col-span-9 text-[17.5px] sm:text-[18.5px] text-[#0f172a] leading-[1.72]">
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
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-11 shadow-sm space-y-12">
          <div className="space-y-2">
            <span className="text-sm font-extrabold text-[#1e3a8a] block">
              「법원조직법」 핵심 정리
            </span>
            <h2 className="text-2xl sm:text-[31px] font-extrabold text-[#0f172a] tracking-tight leading-tight">
              대법원 세 기구 비교와 대법관 정원 변화
            </h2>
          </div>

          {/* 1. 역할별 컬러 배지(심의·의결·재판)로 구분한 개방형 3기구 비교 */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-[22px] font-extrabold text-[#0f172a]">
                1. 기출 선지에서 단골로 섞어 내는 세 기구
              </h3>
              <p className="text-[17px] text-slate-600 leading-relaxed">
                역할(심의·의결·재판), 설치 기관, 출석 정족수를 서로 바꾸어 출제하므로 세 기구를 나란히 대비해 두어야 합니다.
              </p>
            </div>

            <div className="border-t-2 border-slate-900 divide-y divide-slate-200 border-b border-slate-200">
              {COURT_THREE_ORGANS.map((org) => (
                <div
                  key={org.name}
                  className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 items-start"
                >
                  <div className="lg:col-span-4 space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold ${
                          ROLE_BADGE_STYLE[org.role] ?? 'bg-slate-800 text-white'
                        }`}
                      >
                        {org.role}
                      </span>
                      <span className="text-xs font-bold text-slate-400 tabular-nums">
                        {org.basis}
                      </span>
                    </div>
                    <h4 className="text-xl sm:text-[22px] font-extrabold text-[#0f172a]">
                      {org.name}
                    </h4>
                  </div>

                  <div className="lg:col-span-8 space-y-2">
                    <p className="text-[18px] sm:text-[19px] font-bold text-[#0f172a] leading-[1.65]">
                      {org.composition}
                    </p>
                    <p className="text-[16px] text-[#b91c1c] font-semibold leading-relaxed">
                      함정 주의 · {org.trap}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 웜 앰버 톤의 조문 원문 체크 콜아웃 */}
            <div className="rounded-xl bg-amber-50/90 border border-amber-200 border-l-4 border-l-amber-600 px-5 py-4 text-[16.5px] text-slate-800 leading-relaxed">
              <strong className="font-extrabold text-amber-900 mr-2">
                조문 표현 체크
              </strong>
              실무나 홈페이지에서는 흔히 ‘전원합의체’라고 부르지만, 법원조직법 제7조 제1항의 실제 조문 표현은 정확히{' '}
              <strong className="font-extrabold text-[#0f172a]">
                ‘대법관 전원의 3분의 2 이상의 합의체’
              </strong>
              입니다.
            </div>
          </div>

          {/* 2. 다크 패널로 강약을 준 대법관 정원 변화 위젯 */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-[22px] font-extrabold text-[#0f172a]">
                2. 법원조직법 개정에 따른 대법관 정원 변화 (14명 → 26명)
              </h3>
              <p className="text-[17px] text-slate-600 leading-relaxed">
                개정 법원조직법(법률 제21451호 부칙)으로 2030년까지 대법관이 단계적으로 증원되며, ‘전원 3분의 2 이상’ 기준 인원도 함께 늘어납니다.
              </p>
            </div>

            <div className="rounded-2xl bg-[#0f172a] text-white p-6 sm:p-8 space-y-7">
              {/* 연도 전환 탭 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUOTA_MILESTONES.map((m, idx) => {
                  const active = idx === quotaIdx;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setQuotaIdx(idx)}
                      className={`rounded-xl px-4 py-3 text-left transition-all tabular-nums ${
                        active
                          ? 'bg-[#2563eb] text-white shadow-sm'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold opacity-80">
                        {m.periodLabel}
                      </div>
                      <div className="text-lg font-extrabold mt-0.5">
                        총 {m.totalJustices}명
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 대형 숫자 대비 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1 border-t border-slate-800">
                <div>
                  <span className="text-sm font-semibold text-slate-400 block">
                    대법관 총원 (대법원장 포함)
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1.5 tabular-nums">
                    총 {selectedQuota.totalJustices}명
                  </div>
                  <span className="text-sm text-slate-400 mt-1 block">
                    {selectedQuota.note}
                  </span>
                </div>

                <div className="sm:border-l sm:border-slate-800 sm:pl-6">
                  <span className="text-sm font-bold text-[#93c5fd] block">
                    대법관 전원의 3분의 2 이상 기준
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#93c5fd] mt-1.5 tabular-nums">
                    최소 {selectedQuota.twoThirdsMin}명
                  </div>
                  <span className="text-sm text-slate-400 mt-1 block">
                    재판 합의체 · 대법관회의 출석 정족수 기준
                  </span>
                </div>
              </div>

              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-[#60a5fa] transition-all duration-300"
                  style={{
                    width: `${(selectedQuota.twoThirdsMin / 26) * 100}%`,
                  }}
                />
                <div
                  className="h-full bg-slate-500 transition-all duration-300"
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
        </section>
      )}

      {/* ==================== 주제 4 : 핵심 합헌 판례 4선 (박스 중첩 완전 제거) ==================== */}
      {topic === 'precedents' && (
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-11 shadow-sm space-y-8">
          <div className="space-y-2">
            <span className="text-sm font-extrabold text-emerald-700 block">
              사법권의 독립과 한계 · 기출 핵심 결정례
            </span>
            <h2 className="text-2xl sm:text-[31px] font-extrabold text-[#0f172a] tracking-tight leading-tight">
              사법권 독립을 다툰 네 사건 — 결론은 전부 ‘합헌’
            </h2>
            <p className="text-[17px] text-slate-600 leading-relaxed pt-1">
              기출문제에서는 패소한 청구인의 주장이나 결정문 뒤의 소수 반대의견을 헌재 결론(위헌)인 것처럼 서술해 오답 선지를 만듭니다.
            </p>
          </div>

          <div className="border-t-2 border-slate-900 divide-y divide-slate-200">
            {CORE_PRECEDENTS.map((prec) => (
              <article
                key={prec.id}
                className="py-8 first:pt-7 last:pb-2 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start"
              >
                {/* 좌측 판례 번호 · 합헌 배지 · 제목 */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-700 text-white text-xs sm:text-sm font-extrabold">
                      {prec.verdict}
                    </span>
                    <span className="text-base sm:text-[17px] font-extrabold text-slate-500 tabular-nums">
                      {prec.caseNumber}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-[22px] font-extrabold text-[#0f172a] leading-snug">
                    {prec.title}
                  </h3>
                </div>

                {/* 우측 시원한 본문 + 단일 포인트 바 (앰버 vs 크림슨) */}
                <div className="lg:col-span-8 space-y-4">
                  <p className="text-[17.5px] sm:text-[18.5px] text-slate-800 leading-[1.8]">
                    {prec.summary}
                  </p>

                  {prec.scale && (
                    <div className="flex flex-wrap items-center gap-2 text-[15px] font-bold tabular-nums pt-0.5">
                      <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg">
                        {prec.scale.step1}
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="bg-rose-50 text-[#b91c1c] px-3 py-1 rounded-lg">
                        {prec.scale.step2}
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg">
                        {prec.scale.step3}
                      </span>
                    </div>
                  )}

                  <div
                    className={`rounded-xl border-l-4 px-5 py-3.5 text-[16px] leading-relaxed ${
                      prec.isTrap
                        ? 'bg-[#fef2f2] border-l-[#b91c1c] text-slate-900'
                        : 'bg-amber-50/85 border-l-amber-500 text-slate-900'
                    }`}
                  >
                    <strong
                      className={`font-extrabold mr-2 ${
                        prec.isTrap ? 'text-[#b91c1c]' : 'text-amber-900'
                      }`}
                    >
                      {prec.noteTitle}
                    </strong>
                    {prec.noteText}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
