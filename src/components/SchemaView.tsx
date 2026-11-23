import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
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
                className={`relative px-4 py-3 rounded-xl text-[15px] sm:text-base font-extrabold text-center transition-colors ${
                  active
                    ? 'text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
        <div className="space-y-7">
          {/* 강렬한 다크 히어로 배너 (페이지 중심축) */}
          <div className="bg-[#0f172a] text-white rounded-2xl p-7 sm:p-9 shadow-md space-y-2.5">
            <span className="inline-block text-xs sm:text-sm font-extrabold tracking-wide text-[#93c5fd]">
              사법부 복습을 관통하는 핵심 질문
            </span>
            <p className="text-xl sm:text-[24px] font-extrabold leading-[1.5] text-white">
              {OVERARCHING_QUESTION}
            </p>
          </div>

          {/* 삼권분립 3기둥 (중첩 속박스를 없애고 대비로 구분) */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="space-y-1">
              <span className="text-sm font-extrabold text-[#1e3a8a]">
                삼권분립의 구조
              </span>
              <h2 className="text-2xl sm:text-[30px] font-extrabold text-[#0f172a] tracking-tight">
                각 국가기관이 맡은 역할과 넘지 못하는 선
              </h2>
            </div>

            {/* 상단 2열 : 입법부 / 행정부 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-200 p-6 space-y-3">
                <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs sm:text-sm font-extrabold">
                  입법부 · 국회
                </span>
                <h3 className="text-xl sm:text-[22px] font-extrabold text-[#0f172a]">
                  법률 제정 · 조약 및 파병 동의(제60조①·②)
                </h3>
                <div className="space-y-2 pt-1 text-[17px] sm:text-[18px] leading-[1.7] text-slate-700">
                  <p>• 형량이나 법원 조직 등 일반 기준을 법률로 정함</p>
                  <p className="text-[#0f172a]">
                    • <strong className="text-[#b91c1c]">한계:</strong> 재판의 핵심 본질을 빼앗거나 기본권을 과도하게 제한할 수 없음
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-6 space-y-3">
                <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs sm:text-sm font-extrabold">
                  행정부 · 대통령
                </span>
                <h3 className="text-xl sm:text-[22px] font-extrabold text-[#0f172a]">
                  조약 체결·비준(제73조) · 국군 통수(제74조①)
                </h3>
                <div className="space-y-2 pt-1 text-[17px] sm:text-[18px] leading-[1.7] text-slate-700">
                  <p>• 외교·국방에 관한 고도의 정치적 결단을 내림</p>
                  <p className="text-[#0f172a]">
                    • <strong className="text-[#b91c1c]">한계:</strong> 반드시{' '}
                    <span className="key-underline">
                      헌법이 정한 절차(국회 동의 등)
                    </span>
                    를 지켜야 함
                  </p>
                </div>
              </div>
            </div>

            {/* 하단 통합 : 사법부 (네이비 헤더 바 + 내부 무테두리 2분할로 깔끔하게 강조) */}
            <div className="rounded-2xl border-2 border-[#1e3a8a] overflow-hidden shadow-sm">
              <div className="bg-[#1e3a8a] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-lg sm:text-xl font-extrabold">
                  사법부 · 법원과 헌법재판소 (넓은 의미의 사법권)
                </h3>
                <span className="text-xs sm:text-sm font-medium text-blue-100">
                  구체적 사건 재판은 법원이, 헌법적 통제는 헌법재판소가 분담
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
                <div className="p-6 sm:p-7 space-y-3">
                  <div className="text-sm font-extrabold text-[#1e3a8a]">
                    법원 (헌법 제101조~제110조)
                  </div>
                  <h4 className="text-xl sm:text-[22px] font-extrabold text-[#0f172a]">
                    독립된 재판 · 대법원규칙 제정
                  </h4>
                  <div className="space-y-2 pt-1 text-[17px] sm:text-[18px] leading-[1.7] text-slate-700">
                    <p>• 외부 간섭 없이 독립하여 구체적 사건을 재판함</p>
                    <p className="text-[#0f172a]">
                      • <strong className="text-[#b91c1c]">한계:</strong>{' '}
                      <span className="key-underline">
                        국회가 만든 법률 테두리 안
                      </span>
                      에서만 재판·규칙 제정 가능
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-3">
                  <div className="text-sm font-extrabold text-[#1e3a8a]">
                    헌법재판소 (헌법 제111조~제113조)
                  </div>
                  <h4 className="text-xl sm:text-[22px] font-extrabold text-[#0f172a]">
                    위헌법률 · 권한쟁의 심판
                  </h4>
                  <div className="space-y-2 pt-1 text-[17px] sm:text-[18px] leading-[1.7] text-slate-700">
                    <p>• 외교·국방의 정치적 유불리는 판단하지 않음(사법자제)</p>
                    <p className="text-[#0f172a]">
                      • <strong className="text-emerald-700">역할:</strong>{' '}
                      <span className="key-underline">
                        헌법상 권한과 절차를 어겼는지
                      </span>
                      는 심판함
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 박스를 없앤 오픈형 3줄 정리 리스트 */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <h3 className="text-xl font-extrabold text-[#0f172a]">
                문제 풀이로 이어지는 세 가지 경계선
              </h3>

              <div className="divide-y divide-slate-200">
                {BOUNDARY_SUMMARIES.map((item, idx) => (
                  <div
                    key={item.id}
                    className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-lg sm:text-xl font-extrabold text-[#1e3a8a] tabular-nums shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="text-lg sm:text-[19px] font-extrabold text-[#0f172a]">
                          {item.title}
                        </div>
                        <p className="text-[16.5px] sm:text-[17.5px] text-slate-600 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        item.questionId
                          ? onNavigateToQuestion(item.questionId)
                          : onNavigateView(item.targetView)
                      }
                      className="self-start sm:self-center shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-extrabold bg-slate-100 text-[#0f172a] hover:bg-[#1e3a8a] hover:text-white transition-colors"
                    >
                      <span>{item.linkLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==================== 주제 2 : 법의 서열과 헌법 조문 ==================== */}
      {topic === 'hierarchy' && (
        <div className="space-y-7">
          {/* 섹션 1 : 법의 서열 (위계 화살표와 컬러 포커스) */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-1.5">
              <span className="text-sm font-extrabold text-[#1e3a8a]">
                규범의 위계와 헌법 제107조
              </span>
              <h2 className="text-2xl sm:text-[30px] font-extrabold text-[#0f172a] tracking-tight">
                법의 위아래 서열과 위헌·위법 심사 기관
              </h2>
              <p className="text-[17px] text-slate-600 leading-relaxed pt-1">
                하위 규범은 상위 규범에 어긋날 수 없으며, 법원의 심사 대상은 대법원규칙에 한정되지 않고 <strong>‘명령·규칙’</strong> 전반을 포괄합니다.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {NORM_HIERARCHY_TIERS.map((tier, idx) => (
                <React.Fragment key={tier.id}>
                  <div
                    className={`rounded-xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      idx === 0
                        ? 'bg-[#0f172a] text-white'
                        : tier.emphasis
                        ? 'bg-[#eff6ff] border-2 border-[#1e3a8a]'
                        : 'bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <span
                        className={`text-xs sm:text-sm font-extrabold ${
                          idx === 0 ? 'text-[#93c5fd]' : 'text-[#1e3a8a]'
                        }`}
                      >
                        {tier.rank}
                      </span>
                      <div
                        className={`text-xl sm:text-2xl font-extrabold ${
                          idx === 0 ? 'text-white' : 'text-[#0f172a]'
                        }`}
                      >
                        {tier.name}
                      </div>
                      <p
                        className={`text-[16px] sm:text-[17px] ${
                          idx === 0 ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        {tier.sub}
                      </p>
                    </div>

                    {tier.reviewTarget && (
                      <div
                        className={`md:max-w-md rounded-xl px-5 py-3.5 shrink-0 ${
                          tier.emphasis
                            ? 'bg-[#1e3a8a] text-white shadow-sm'
                            : 'bg-white border border-slate-300 text-[#0f172a]'
                        }`}
                      >
                        <div className="text-base font-extrabold">
                          심사 기관 : {tier.reviewTarget}
                        </div>
                        <div
                          className={`text-sm font-medium mt-0.5 leading-snug ${
                            tier.emphasis ? 'text-blue-100' : 'text-slate-600'
                          }`}
                        >
                          {tier.reviewDetail}
                        </div>
                      </div>
                    )}
                  </div>

                  {idx < NORM_HIERARCHY_TIERS.length - 1 && (
                    <div className="flex justify-center py-0.5 text-slate-400">
                      <ArrowDown className="w-5 h-5" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* 섹션 2 : 헌법 제101~110조 (박스 없이 깔끔한 에디토리얼 행 구분) */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-sm font-extrabold text-[#1e3a8a]">
                헌법 제5장 「법원」
              </span>
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight">
                헌법 제101조~제110조 핵심 조문 정리
              </h2>
            </div>

            <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {CONSTITUTION_ARTICLES_SUMMARY.map((row) => (
                <div
                  key={row.articles}
                  className="py-5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-baseline"
                >
                  <div className="md:col-span-3">
                    <div className="text-lg font-extrabold text-[#1e3a8a] tabular-nums">
                      {row.articles}
                    </div>
                    <div className="text-sm font-bold text-slate-500">
                      {row.title}
                    </div>
                  </div>
                  <div className="md:col-span-9 text-[17px] sm:text-[18.5px] text-[#0f172a] leading-[1.72]">
                    {row.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ==================== 주제 3 : 대법원 3기구와 정원 변화 ==================== */}
      {topic === 'organs' && (
        <div className="space-y-7">
          {/* 섹션 1 : 3기구 비교표 */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-7">
            <div className="space-y-1.5">
              <span className="text-sm font-extrabold text-[#1e3a8a]">
                「법원조직법」 핵심 비교
              </span>
              <h2 className="text-2xl sm:text-[30px] font-extrabold text-[#0f172a] tracking-tight">
                기출에서 가장 자주 섞어 내는 대법원 세 기구
              </h2>
              <p className="text-[17px] text-slate-600 leading-relaxed">
                세 기구의 <strong>기능(심의·의결·재판)</strong>과 <strong>인원·출석 기준</strong>을 표로 한눈에 비교해 두세요.
              </p>
            </div>

            {/* 깔끔한 비교 테이블 */}
            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-[16.5px] sm:text-[17.5px] leading-[1.65]">
                <thead>
                  <tr className="bg-[#0f172a] text-white">
                    <th className="py-4 px-5 font-extrabold w-[22%]">기구명</th>
                    <th className="py-4 px-4 font-extrabold w-[16%]">핵심 역할</th>
                    <th className="py-4 px-5 font-extrabold w-[62%]">
                      인원 · 정족수 및 핵심 원칙
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {COURT_THREE_ORGANS.map((org, idx) => {
                    const roleBadge =
                      idx === 0
                        ? 'bg-amber-100 text-amber-900'
                        : idx === 1
                        ? 'bg-blue-100 text-[#1e3a8a]'
                        : 'bg-emerald-100 text-emerald-900';

                    return (
                      <tr key={org.name} className="align-top">
                        <td className="py-5 px-5 font-extrabold text-[#0f172a] bg-slate-50/70">
                          <div>{org.name}</div>
                          <div className="text-xs font-semibold text-slate-500 mt-1 tabular-nums">
                            {org.basis}
                          </div>
                        </td>
                        <td className="py-5 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-md text-sm font-extrabold ${roleBadge}`}
                          >
                            {org.role}
                          </span>
                        </td>
                        <td className="py-5 px-5 space-y-2">
                          <div className="font-bold text-[#0f172a]">
                            {org.composition}
                          </div>
                          <div className="text-[15.5px] font-semibold text-[#b91c1c]">
                            함정 주의 : {org.trap}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 앰버 포인트 팁 바 (조문 표현 주의) */}
            <div className="rounded-xl bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 px-5 py-4 text-[16.5px] text-slate-900 leading-relaxed">
              <strong className="font-extrabold text-amber-900 mr-2">
                조문 원문 체크:
              </strong>
              실무나 언론에서는 흔히 ‘전원합의체’라고 부르지만, 법원조직법 제7조 제1항의 실제 조문 표현은 정확히{' '}
              <strong className="underline decoration-amber-400 decoration-2">
                ‘대법관 전원의 3분의 2 이상의 합의체’
              </strong>
              입니다.
            </div>
          </section>

          {/* 섹션 2 : 대법관 정원 변화 (다크 스코어보드 대비) */}
          <section className="bg-[#0f172a] text-white rounded-2xl p-6 sm:p-10 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-sm font-extrabold text-[#93c5fd]">
                  개정 법원조직법 · 법률 제21451호 부칙 반영
                </span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight">
                  대법관 정원 단계적 증원 (현행 14명 → 2030년 26명)
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  정원이 늘어남에 따라 ‘대법관 전원의 3분의 2 이상’ 최소 기준 인원도 함께 늘어납니다.
                </p>
              </div>
            </div>

            {/* 연도 선택 버튼 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {QUOTA_MILESTONES.map((m, idx) => {
                const active = idx === quotaIdx;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setQuotaIdx(idx)}
                    className={`rounded-xl px-4 py-3.5 text-left transition-all tabular-nums border ${
                      active
                        ? 'bg-white text-[#0f172a] border-white shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    <div
                      className={`text-xs sm:text-sm font-bold ${
                        active ? 'text-[#1e3a8a]' : 'text-slate-400'
                      }`}
                    >
                      {m.periodLabel}
                    </div>
                    <div className="text-xl font-extrabold mt-0.5">
                      총 {m.totalJustices}명
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 스코어보드 수치 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div className="rounded-xl bg-slate-800/90 border border-slate-700 p-6">
                <span className="text-sm font-semibold text-slate-300 block">
                  대법관 총원 (대법원장 포함)
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1.5 tabular-nums">
                  총 {selectedQuota.totalJustices}명
                </div>
                <span className="text-sm text-slate-400 mt-1.5 block">
                  {selectedQuota.note}
                </span>
              </div>

              <div className="rounded-xl bg-[#1e3a8a] border border-blue-400/40 p-6">
                <span className="text-sm font-bold text-blue-200 block">
                  대법관 전원의 3분의 2 이상 기준
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1.5 tabular-nums">
                  최소 {selectedQuota.twoThirdsMin}명
                </div>
                <span className="text-sm text-blue-100 mt-1.5 block">
                  심판 합의체 구성 · 대법관회의 출석 기준 동일
                </span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==================== 주제 4 : 핵심 합헌 판례 4선 ==================== */}
      {topic === 'precedents' && (
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b-2 border-[#0f172a] pb-5 space-y-2">
            <span className="text-sm font-extrabold text-[#1e3a8a]">
              사법권의 독립과 한계 · 기출 결정례 4선
            </span>
            <h2 className="text-2xl sm:text-[30px] font-extrabold text-[#0f172a] tracking-tight">
              사법권 독립을 다툰 네 사건 — 결론은 모두{" "}
              <span className="text-emerald-700">‘합헌’</span>
            </h2>
            <p className="text-[17px] text-slate-600 leading-relaxed">
              시험에서는 청구인의 위헌 주장이나 소수 재판관 반대의견을 결론처럼 베껴 오답 선지를 만듭니다.
            </p>
          </div>

          {/* 회색 중첩 박스를 없애고 넉넉한 여백과 구분선으로 읽히게 배치 */}
          <div className="divide-y divide-slate-200">
            {CORE_PRECEDENTS.map((prec, idx) => (
              <article
                key={prec.id}
                className={`${idx === 0 ? 'pb-8' : 'py-8'} space-y-4`}
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-md bg-emerald-700 text-white text-sm font-extrabold">
                    {prec.verdict}
                  </span>
                  <span className="text-lg font-extrabold text-[#1e3a8a] tabular-nums">
                    {prec.caseNumber}
                  </span>
                </div>

                <h3 className="text-xl sm:text-[23px] font-extrabold text-[#0f172a]">
                  {prec.title}
                </h3>

                <p className="text-[17px] sm:text-[18.5px] text-slate-800 leading-[1.78]">
                  {prec.summary}
                </p>

                {prec.scale && (
                  <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[15px] sm:text-base font-bold tabular-nums">
                    <span className="bg-slate-100 text-slate-900 px-3.5 py-1.5 rounded-lg">
                      {prec.scale.step1}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-[#fef2f2] text-[#b91c1c] border border-[#fca5a5] px-3.5 py-1.5 rounded-lg">
                      {prec.scale.step2}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-lg">
                      {prec.scale.step3}
                    </span>
                  </div>
                )}

                <div
                  className={`rounded-r-xl border-l-4 px-5 py-3.5 text-[16px] sm:text-[17px] leading-relaxed ${
                    prec.isTrap
                      ? 'bg-[#fef2f2] text-slate-900 border-l-[#b91c1c]'
                      : 'bg-amber-50/90 text-slate-900 border-l-amber-500'
                  }`}
                >
                  <strong
                    className={`font-extrabold mr-2 ${
                      prec.isTrap ? 'text-[#b91c1c]' : 'text-amber-900'
                    }`}
                  >
                    {prec.noteTitle} :
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
