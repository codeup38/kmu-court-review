import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import {
  BOUNDARY_SUMMARIES,
  QUOTA_MILESTONES,
} from '../data/schemaData';
import { MainViewId } from '../types';

interface SchemaViewProps {
  onNavigateToQuestion: (questionId: number) => void;
  onNavigateView: (view: MainViewId) => void;
}

type TopicId = 'powers' | 'hierarchy' | 'organs' | 'precedents';

const CONCEPT_TOPICS: { id: TopicId; label: string }[] = [
  { id: 'powers', label: '1. 삼권분립과 사법부' },
  { id: 'hierarchy', label: '2. 법의 서열과 헌법 조문' },
  { id: 'organs', label: '3. 대법원 3기구와 정원' },
  { id: 'precedents', label: '4. 핵심 합헌 판례 4선' },
];

export const SchemaView: React.FC<SchemaViewProps> = ({
  onNavigateToQuestion,
  onNavigateView,
}) => {
  const [topic, setTopic] = useState<TopicId>('powers');
  const [quotaIdx, setQuotaIdx] = useState<number>(0);

  const selectedQuota = QUOTA_MILESTONES[quotaIdx];

  const selectTopic = (next: TopicId) => {
    setTopic(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* 상단 4개 주제 탭 */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-2.5 sm:p-3 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {CONCEPT_TOPICS.map((t) => {
            const active = topic === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTopic(t.id)}
                className={`relative px-3.5 py-2.5 rounded-lg text-sm sm:text-[15px] font-bold text-center transition-colors ${
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

      {/* ==================== 주제 1 : 삼권분립과 사법부 (PPT 02·03페이지) ==================== */}
      {topic === 'powers' && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b-2 border-[#0f172a] pb-4 space-y-1">
            <span className="text-sm font-extrabold text-[#1e3a8a] block">
              도입 · 삼권분립의 구조와 핵심 관점
            </span>
            <h2 className="text-2xl sm:text-[29px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
              삼권분립에서 각 기관이 맡은 역할과 넘지 못하는 선
            </h2>
          </div>

          {/* 관통 질문 배너 */}
          <div className="bg-[#f8fafc] border border-slate-300 border-l-[6px] border-l-[#1e3a8a] rounded-r-lg px-5 py-4 text-[17px] sm:text-[18.5px] text-[#0f172a] leading-relaxed">
            발표에서 다룬 네 문제는 모두{' '}
            <strong>
              “사법부(법원과 헌법재판소)는 어디까지 판단할 수 있고, 어디서 멈춰야 하는가?”
            </strong>
            를 묻습니다.
          </div>

          {/* 삼권분립 3기둥 (상단 입법·행정 2열 + 하단 사법부 통합 박스) */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-xl border border-slate-300 bg-[#f8fafc] p-6">
                <div className="text-sm font-extrabold text-[#1e3a8a] mb-1.5">
                  입법부 · 국회
                </div>
                <h3 className="text-xl font-extrabold text-[#0f172a] mb-3">
                  법률 제정 · 조약 및 파병 동의(제60조①·②)
                </h3>
                <ul className="space-y-2 text-[17px] text-slate-700 leading-relaxed">
                  <li>
                    • 형량이나 법원 조직 등 <strong>일반 기준을 법률로 정함</strong>
                  </li>
                  <li>
                    • 한계:{' '}
                    <span className="key-underline">
                      재판의 핵심 본질을 빼앗거나 과도하면 안 됨
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-300 bg-[#f8fafc] p-6">
                <div className="text-sm font-extrabold text-[#1e3a8a] mb-1.5">
                  행정부 · 대통령
                </div>
                <h3 className="text-xl font-extrabold text-[#0f172a] mb-3">
                  조약 체결·비준(제73조) · 국군 통수(제74조①)
                </h3>
                <ul className="space-y-2 text-[17px] text-slate-700 leading-relaxed">
                  <li>
                    • 외교·국방에 관한 <strong>고도의 정치적 결단</strong>을 내림
                  </li>
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
                  <div className="text-sm font-extrabold text-[#1e3a8a] mb-1.5">
                    법원 (헌법 제101조~제110조)
                  </div>
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#0f172a] mb-2.5">
                    독립된 재판 · 대법원규칙 제정
                  </h4>
                  <ul className="space-y-2 text-[16.5px] sm:text-[17px] text-slate-700 leading-relaxed">
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
                  <div className="text-sm font-extrabold text-[#1e3a8a] mb-1.5">
                    헌법재판소 (헌법 제111조~제113조)
                  </div>
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#0f172a] mb-2.5">
                    위헌법률 · 권한쟁의 심판
                  </h4>
                  <ul className="space-y-2 text-[16.5px] sm:text-[17px] text-slate-700 leading-relaxed">
                    <li>
                      • 대통령·국회의 <strong>정치적 유불리는 판단하지 않음(자제)</strong>
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

          {/* 3가지 핵심 경계 카드 (PPT 02페이지 상단 포인트 보더 카드 스타일) */}
          <div className="pt-2 space-y-4">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
              문제로 확인하는 세 가지 핵심 경계
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BOUNDARY_SUMMARIES.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-300 border-t-4 border-t-[#1e3a8a] bg-white p-5 flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div>
                    <div className="text-xs sm:text-[13px] font-extrabold text-[#1e3a8a] mb-2">
                      {item.code}
                    </div>
                    <div className="text-[18px] sm:text-[19px] font-extrabold text-[#0f172a] leading-snug mb-2.5">
                      {item.title}
                    </div>
                    <p className="text-[15.5px] sm:text-[16px] text-slate-600 leading-relaxed">
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
                    className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#1e3a8a] hover:text-[#0f172a] self-start pt-1"
                  >
                    <span>{item.linkLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 다음 주제 이동 */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={() => selectTopic('hierarchy')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] transition-colors"
            >
              <span>다음 주제 : 법의 서열과 헌법 조문</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ==================== 주제 2 : 법의 서열과 헌법 조문 (PPT 04·05페이지) ==================== */}
      {topic === 'hierarchy' && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-10">
          <div className="border-b-2 border-[#0f172a] pb-4 space-y-1">
            <span className="text-sm font-extrabold text-[#1e3a8a] block">
              법단계와 헌법 제5장 「법원」
            </span>
            <h2 className="text-2xl sm:text-[29px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
              법의 위아래 서열과 헌법이 정한 법원의 뼈대
            </h2>
          </div>

          {/* 1. PPT 05페이지 법단계 다이어그램의 시각적 위계 재현 */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-[#0f172a]">
                1. 법의 위아래 서열과 위헌·위법 심사 기관 (헌법 제107조)
              </h3>
              <p className="text-[16px] sm:text-[17px] text-slate-600 mt-1">
                하위 규범은 상위 규범에 어긋날 수 없으며, 법원의 심사 대상은 대법원규칙에 한정되지 않고 <strong>‘명령·규칙’</strong> 전반을 포함합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-300 bg-[#f8fafc] p-5 sm:p-7 space-y-3">
              {/* 1단계 : 헌법 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5 rounded-lg bg-[#0f172a] text-white px-5 py-4 text-center">
                  <div className="text-lg sm:text-xl font-extrabold">
                    헌법 (최고규범)
                  </div>
                </div>
                <div className="md:col-span-7 text-[15.5px] sm:text-[16.5px] text-slate-600 md:pl-3">
                  모든 법률과 명령·규칙의 근거이자 한계가 되는 최상위 규범
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-5 flex justify-center text-slate-400">
                  <ArrowDown className="w-5 h-5" />
                </div>
              </div>

              {/* 2단계 : 법률 → 헌법재판소 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5 rounded-lg bg-[#1e3a8a] text-white px-5 py-4 text-center">
                  <div className="text-lg sm:text-xl font-extrabold">
                    법률 (국회 제정)
                  </div>
                  <div className="text-xs sm:text-sm text-[#bfdbfe] font-semibold mt-0.5">
                    법원조직법 · 형법 · 민사소송법 등
                  </div>
                </div>
                <div className="md:col-span-7 flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-[#1e3a8a] shrink-0 hidden md:block" />
                  <div className="flex-1 rounded-lg bg-[#eff6ff] border border-[#93c5fd] px-4 py-3">
                    <div className="text-[16px] sm:text-[17px] font-extrabold text-[#1e3a8a]">
                      헌법재판소 심판 (헌법 제107조 제1항)
                    </div>
                    <div className="text-sm sm:text-[15px] text-slate-700 font-medium mt-0.5">
                      재판의 전제가 된 법률은 법원이 위헌 제청 → 헌재가 결정
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-5 flex justify-center text-slate-400">
                  <ArrowDown className="w-5 h-5" />
                </div>
              </div>

              {/* 3단계 : 명령 · 규칙 → 대법원 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5 rounded-lg bg-white border-2 border-slate-700 px-5 py-4 text-center">
                  <div className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                    명령 · 규칙
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
                    법률 위반 불가 (제75·95·108조)
                  </div>
                </div>
                <div className="md:col-span-7 flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-[#1e3a8a] shrink-0 hidden md:block" />
                  <div className="flex-1 rounded-lg bg-[#eff6ff] border-2 border-[#1e3a8a] px-4 py-3">
                    <div className="text-[16px] sm:text-[17px] font-extrabold text-[#1e3a8a]">
                      대법원 최종 심사 (헌법 제107조 제2항)
                    </div>
                    <div className="text-sm sm:text-[15px] text-[#0f172a] font-semibold mt-0.5">
                      위헌·위법 인정 시 반드시{' '}
                      <span className="key-underline">
                        대법관 전원의 3분의 2 이상의 합의체
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-5 flex justify-center text-slate-400">
                  <ArrowDown className="w-5 h-5" />
                </div>
              </div>

              {/* 4단계 : 조례 · 지자체 규칙 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5 rounded-lg bg-white border border-slate-300 px-5 py-3.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-slate-500">
                    조례 · 지자체 규칙
                  </div>
                </div>
                <div className="md:col-span-7 text-sm sm:text-[15.5px] text-slate-500 md:pl-3">
                  법령의 범위 안에서 제정하는 자치법규 (헌법 제117조 제1항)
                </div>
              </div>
            </div>
          </div>

          {/* 2. PPT 04페이지 헌법 제101~110조 핵심 표 (핵심 키워드 볼드·밑줄 적용!) */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xl font-extrabold text-[#0f172a]">
              2. 헌법이 정한 법원의 큰 뼈대 (제101조~제110조)
            </h3>

            <div className="divide-y divide-slate-300 border border-slate-300 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 bg-white">
                <div className="md:col-span-3 bg-[#eff6ff] md:border-r border-slate-300 px-5 py-4 flex items-center font-extrabold text-[#1e3a8a] text-[17px]">
                  제101조 · 제102조
                </div>
                <div className="md:col-span-9 px-5 py-4 text-[17px] sm:text-[18px] text-[#0f172a] leading-relaxed">
                  재판은 법관이 모인 법원이 맡고, 구체적인 인원수와 조직은{' '}
                  <strong>「법원조직법」</strong>으로 정함
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 bg-white">
                <div className="md:col-span-3 bg-[#eff6ff] md:border-r border-slate-300 px-5 py-4 flex items-center font-extrabold text-[#1e3a8a] text-[17px]">
                  제103조 (재판 독립)
                </div>
                <div className="md:col-span-9 px-5 py-4 text-[17px] sm:text-[18px] text-[#0f172a] leading-relaxed">
                  판사는 외부 간섭 없이 <strong>헌법과 법률에 따라</strong> 양심껏 심판함 (법률을 무시할 자유가 아님)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 bg-white">
                <div className="md:col-span-3 bg-[#eff6ff] md:border-r border-slate-300 px-5 py-4 flex items-center font-extrabold text-[#1e3a8a] text-[17px]">
                  제104조 ~ 제106조
                </div>
                <div className="md:col-span-9 px-5 py-4 text-[17px] sm:text-[18px] text-[#0f172a] leading-relaxed">
                  대법원장(<strong>6년 단임</strong>) · 대법관(6년, 연임 가능) · 일반법관(10년, 연임 가능) /{' '}
                  <span className="key-underline">
                    탄핵이나 금고 이상의 형 선고 없이는 파면 불가
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 bg-white">
                <div className="md:col-span-3 bg-[#eff6ff] md:border-r border-slate-300 px-5 py-4 flex items-center font-extrabold text-[#1e3a8a] text-[17px]">
                  제107조 (위헌 심사)
                </div>
                <div className="md:col-span-9 px-5 py-4 text-[17px] sm:text-[18px] text-[#0f172a] leading-relaxed">
                  <strong>법률</strong>이 위헌인지는 헌법재판소에 제청하고,{' '}
                  <strong>명령·규칙·처분</strong>이 위헌·위법인지는 대법원이 최종 심사함
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 bg-white">
                <div className="md:col-span-3 bg-[#eff6ff] md:border-r border-slate-300 px-5 py-4 flex items-center font-extrabold text-[#1e3a8a] text-[17px]">
                  제108조 ~ 제110조
                </div>
                <div className="md:col-span-9 px-5 py-4 text-[17px] sm:text-[18px] text-[#0f172a] leading-relaxed">
                  <strong>법률에 저촉되지 않는 범위</strong>에서 대법원규칙 제정 / 재판 과정(심리)은 비공개 가능해도{' '}
                  <span className="key-underline">판결 선고는 무조건 공개</span> / 군사법원 상고심은 항상 대법원, 비상계엄하 사형은 단심 불가
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={() => selectTopic('organs')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] transition-colors"
            >
              <span>다음 주제 : 대법원 3기구와 정원</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ==================== 주제 3 : 대법원 3기구와 정원 변화 (PPT 05·11페이지) ==================== */}
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

          {/* 1. PPT 11페이지 스타일 한눈에 들어오는 비교표 + 기출 함정 정리 */}
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#0f172a]">
                1. 기출에서 가장 자주 섞어 내는 대법원 세 기구
              </h3>
              <p className="text-[16px] sm:text-[17px] text-slate-600 mt-1">
                세 기구의 역할(심의·의결·재판), 인원, 출석 정족수를 한 표로 비교해 두면 선지 함정이 바로 보입니다.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-[16.5px] sm:text-[17.5px] leading-relaxed">
                <thead>
                  <tr className="bg-slate-200/80 border-b border-slate-400 text-[#0f172a]">
                    <th className="py-4 px-5 font-extrabold w-1/4">기구명</th>
                    <th className="py-4 px-5 font-extrabold w-[16%] border-l border-slate-300">
                      역할
                    </th>
                    <th className="py-4 px-5 font-extrabold border-l border-slate-300">
                      핵심 인원 · 정족수 · 원칙
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 bg-white">
                  <tr>
                    <td className="py-4 px-5 font-extrabold bg-[#f8fafc]">
                      법관인사위원회
                      <span className="block text-xs font-semibold text-slate-500 mt-0.5">
                        제25조의2 제1·3항
                      </span>
                    </td>
                    <td className="py-4 px-5 border-l border-slate-200">
                      인사 <strong>심의</strong>
                    </td>
                    <td className="py-4 px-5 border-l border-slate-200">
                      <strong>대법원</strong>에 설치(법무부 X) →{' '}
                      <span className="key-underline">
                        위원장 1명을 포함해 11명
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-5 font-extrabold bg-[#f8fafc]">
                      대법관회의
                      <span className="block text-xs font-semibold text-slate-500 mt-0.5">
                        제16조② · 제17조
                      </span>
                    </td>
                    <td className="py-4 px-5 border-l border-slate-200">
                      운영 <strong>의결</strong>
                    </td>
                    <td className="py-4 px-5 border-l border-slate-200">
                      <strong>대법원장</strong>이 안건을 부치고(과반수 부의 X),{' '}
                      <span className="key-underline">
                        전원 2/3 이상 출석
                      </span>{' '}
                      + 출석 과반수 찬성
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-5 font-extrabold bg-[#f8fafc]">
                      합의체와 부(소부)
                      <span className="block text-xs font-semibold text-slate-500 mt-0.5">
                        제7조 제1항
                      </span>
                    </td>
                    <td className="py-4 px-5 border-l border-slate-200">
                      사건 <strong>재판</strong>
                    </td>
                    <td className="py-4 px-5 border-l border-slate-200">
                      의견 일치 시 3명 이상 부(소부)에서 재판 가능하나,{' '}
                      <strong>
                        명령·규칙을 위헌·위법이라 판단할 땐 반드시{' '}
                      </strong>
                      <span className="key-underline">
                        대법관 전원의 3분의 2 이상의 합의체
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-r-lg border-l-[6px] border-l-[#1e3a8a] bg-[#f8fafc] border border-slate-300 px-5 py-4 text-[16px] sm:text-[17px] text-[#0f172a] leading-relaxed">
              <strong>조문 원문 체크 :</strong> 대법원 홈페이지나 실무에서는 흔히 ‘전원합의체’라고 부르지만, 법원조직법 제7조 제1항의 실제 조문 표현은 정확히{' '}
              <span className="key-underline">
                ‘대법관 전원의 3분의 2 이상의 합의체’
              </span>
              입니다. (한편 명령·규칙이 <strong>합헌·적법</strong>하다고 의견이 일치하거나 개별 <strong>행정처분</strong>의 위법을 인정할 때는 3명 이상 부에서도 재판 가능)
            </div>
          </div>

          {/* 2. 대법관 정원 단계적 증원 */}
          <div className="border-t border-slate-200 pt-8 space-y-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#0f172a]">
                2. 법원조직법 개정에 따른 대법관 정원 변화 (현행 14명 → 2030년 26명)
              </h3>
              <p className="text-[16px] sm:text-[17px] text-slate-600 mt-1 leading-relaxed">
                개정 법원조직법(법률 제21451호 부칙)에 따라 대법관 정원이 단계적으로 늘어나며, 그에 맞춰 ‘대법관 전원의 3분의 2 이상’ 기준 인원도 함께 달라집니다.
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
                        : 'bg-[#f8fafc] border-slate-300 text-slate-700 hover:bg-white hover:border-[#1e3a8a]'
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#f8fafc] rounded-xl border border-slate-300 p-5">
                <span className="text-xs sm:text-sm font-bold text-slate-500 block">
                  선택 시점 대법관 총원 (대법원장 포함)
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mt-1 tabular-nums">
                  총 {selectedQuota.totalJustices}명
                </div>
                <span className="text-sm text-slate-600 mt-1 block">
                  {selectedQuota.note}
                </span>
              </div>

              <div className="bg-[#eff6ff] rounded-xl border border-[#93c5fd] p-5">
                <span className="text-xs sm:text-sm font-extrabold text-[#1e3a8a] block">
                  대법관 전원의 3분의 2 이상 최소 인원
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1e3a8a] mt-1 tabular-nums">
                  최소 {selectedQuota.twoThirdsMin}명
                </div>
                <span className="text-sm text-slate-700 mt-1 block">
                  재판 합의체 · 대법관회의 출석 기준 동일 적용
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={() => selectTopic('precedents')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#0f172a] text-white hover:bg-[#1e3a8a] transition-colors"
            >
              <span>다음 주제 : 핵심 합헌 판례 4선</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ==================== 주제 4 : 핵심 합헌 판례 4선 (PPT 15·17페이지) ==================== */}
      {topic === 'precedents' && (
        <section className="bg-white rounded-xl border border-slate-200/90 border-t-4 border-t-[#0f172a] p-6 sm:p-10 shadow-sm space-y-9">
          <div className="border-b-2 border-[#0f172a] pb-4 space-y-1">
            <span className="text-sm font-extrabold text-[#1e3a8a] block">
              사법권의 독립과 한계 · 기출 핵심 결정례
            </span>
            <h2 className="text-2xl sm:text-[29px] font-extrabold text-[#0f172a] tracking-tight leading-snug">
              사법권의 독립을 다툰 네 사건 — 결론은 전부 ‘합헌’
            </h2>
          </div>

          {/* 1. PPT 15페이지 한눈에 비교하는 요약표 먼저 제시! */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
              1. 네 사건 한눈에 보기 요약표
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-[16px] sm:text-[17px] leading-relaxed">
                <thead>
                  <tr className="bg-slate-200/80 border-b border-slate-400 text-[#0f172a]">
                    <th className="py-3.5 px-4 font-extrabold w-[27%]">
                      다퉈진 사건
                    </th>
                    <th className="py-3.5 px-4 font-extrabold border-l border-slate-300">
                      헌법재판소가 합헌으로 본 핵심 이유
                    </th>
                    <th className="py-3.5 px-4 font-extrabold w-[18%] border-l border-slate-300">
                      실제 결론
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 bg-white">
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold bg-[#f8fafc]">
                      ① 대법원규칙 위임 기준
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      소송절차·실무는 법원이 가장 잘 알므로 <strong>포괄위임금지는 지키되 구체성 요구는 완화됨</strong>
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      <span className="key-underline">합헌</span> (2013헌바370)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold bg-[#f8fafc]">
                      ② 법정형 하한 상향과 양형
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      최소 형량을 높여 집행유예를 줄 수 없게 해도 <strong>법 테두리 내 양형이므로 입법재량</strong>
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      <span className="key-underline">합헌</span> (99헌바43 등)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold bg-[#f8fafc]">
                      ③ 판사 근무평정 · 연임 탈락
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      평가 항목을 대강 예상할 수 있고, <strong>‘현저히 불량’도 뜻이 통하며 10년 누적 평가·소송 보장</strong>
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      <span className="key-underline">합헌</span> (2015헌바331)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-extrabold bg-[#f8fafc]">
                      ④ 부실 금융회사 파산관재인
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      청산 관리인 뽑는 일은 <strong>‘누가 옳고 그른지 가리는 재판의 핵심 본질’이 아님</strong>
                    </td>
                    <td className="py-3.5 px-4 border-l border-slate-200">
                      <span className="key-underline">합헌</span> (2001헌가1)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. 판례별 상세 해설 및 기출 함정 (3중 중첩 박스를 없애고 PPT 해설 카드로 정리) */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
              2. 판례별 세부 법리와 출제 함정
            </h3>

            {/* 판례 1 */}
            <article className="rounded-xl border border-slate-300 border-l-[6px] border-l-[#1e3a8a] bg-white p-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-0.5 rounded bg-[#1e3a8a] text-white text-sm font-extrabold">
                  합헌 · 2013헌바370
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                  대법원규칙 위임 기준 완화와 비열거 사항 위임
                </h4>
              </div>
              <p className="text-[17px] sm:text-[18px] text-slate-800 leading-[1.72]">
                헌법 제108조에 적힌 사항은 법률 위임 없이도 <span className="key-underline">법률에 저촉되지 않는 범위</span>에서 규칙 제정이 가능하고, 적혀 있지 않은 사항도 법률로 위임하면 제정할 수 있다. 소송비용 등 기술적 실무는 법원이 잘 알기 때문에 <strong>포괄위임금지원칙은 준수하되 위임의 구체성 요구는 완화</strong>된다.
              </p>
              <div className="bg-[#eff6ff] border border-[#93c5fd] rounded-lg px-4 py-3 text-[15.5px] sm:text-[16px] text-[#0f172a]">
                <strong className="text-[#1e3a8a] font-extrabold mr-1.5">
                  앞 주차 수업 연결 :
                </strong>
                중간고사 KBS 수신료 감면 단서에서 수익적·기술적 사항의 위임 기준이 완화되던 논리와 연결됩니다.
              </div>
            </article>

            {/* 판례 2 */}
            <article className="rounded-xl border border-slate-300 border-l-[6px] border-l-[#1e3a8a] bg-white p-6 space-y-3.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-0.5 rounded bg-[#1e3a8a] text-white text-sm font-extrabold">
                  합헌 · 99헌바43 · 96헌바16
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                  최소 형량 상향(집행유예 불가)과 법관의 양형재량
                </h4>
              </div>

              <div className="bg-[#f8fafc] rounded-lg border border-slate-300 px-4 py-3 flex flex-wrap items-center gap-2.5 text-sm sm:text-[15.5px] font-extrabold tabular-nums">
                <span className="bg-slate-200 text-[#0f172a] px-3 py-1 rounded">
                  강도상해 최소 징역 7년
                </span>
                <span className="text-slate-500">→ 절반 감경(작량감경) →</span>
                <span className="bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5] px-3 py-1 rounded">
                  징역 3년 6개월
                </span>
                <span className="text-slate-500">&gt;</span>
                <span className="bg-[#eff6ff] text-[#1e3a8a] border border-[#93c5fd] px-3 py-1 rounded">
                  집행유예 기준(3년 이하) 초과
                </span>
              </div>

              <p className="text-[17px] sm:text-[18px] text-slate-800 leading-[1.72]">
                강도상해죄(최소 7년)나 특가법 제12조(최소 10년)처럼 법정형 하한을 높여 작량감경만으로는 집행유예를 선고할 수 없게 했더라도, 판사 역시 국회가 정한 법 테두리 안에서 양형하는 것이므로 <span className="key-underline">양형결정권이나 법관 독립 침해가 아니다</span>.
              </p>
              <div className="bg-[#eff6ff] border border-[#93c5fd] rounded-lg px-4 py-3 text-[15.5px] sm:text-[16px] text-[#0f172a]">
                <strong className="text-[#1e3a8a] font-extrabold mr-1.5">
                  앞 주차 수업 연결 :
                </strong>
                2주차 보호감호 사건은 판사에게 재범 위험성 판단 여지를 아예 주지 않고 무조건 선고하게 해 위헌이었으나, 최소 형량 기준선 설정은 입법재량이라 합헌입니다.
              </div>
            </article>

            {/* 판례 3 */}
            <article className="rounded-xl border border-slate-300 border-l-[6px] border-l-[#b91c1c] bg-white p-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-0.5 rounded bg-[#1e3a8a] text-white text-sm font-extrabold">
                  합헌 · 2015헌바331
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                  판사 근무평정 규칙 위임과 근무성적 불량 연임 탈락
                </h4>
              </div>
              <p className="text-[17px] sm:text-[18px] text-slate-800 leading-[1.72]">
                근무평정을 대법원규칙에 맡긴 것은 평가 항목을 대강 예상할 수 있어 <span className="key-underline">포괄위임금지원칙에 위배되지 않고</span>, ‘근무성적이 현저히 불량한 경우’ 연임 제외 조항도 <strong>10년 치 누적 평가와 불복 소송 기회</strong>가 보장되어 명확성원칙과 사법 독립에 합치된다.
              </p>
              <div className="bg-[#fef2f2] border border-[#fca5a5] rounded-lg px-4 py-3 text-[15.5px] sm:text-[16px] text-[#0f172a]">
                <strong className="text-[#b91c1c] font-extrabold mr-1.5">
                  기출 함정 주의 :
                </strong>
                기출문제(2025 7급 24번 ①·②)에서는 연임 탈락한 청구인(판사)의 위헌 주장을 마치 헌법재판소 결론인 것처럼 서술해 오답을 만듭니다.
              </div>
            </article>

            {/* 판례 4 */}
            <article className="rounded-xl border border-slate-300 border-l-[6px] border-l-[#b91c1c] bg-white p-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-0.5 rounded bg-[#1e3a8a] text-white text-sm font-extrabold">
                  합헌 · 2001헌가1
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-[#0f172a]">
                  부실 금융회사 파산관재인으로 예금보험공사 선임
                </h4>
              </div>
              <p className="text-[17px] sm:text-[18px] text-slate-800 leading-[1.72]">
                망한 금융회사를 정리할 청산 관리인(파산관재인)을 뽑는 일은 <span className="key-underline">‘누가 옳고 그른지 가리는 전형적인 사법권의 핵심 본질’이 아니므로</span>, 공적자금 회수를 위해 예금보험공사를 선임하도록 법률로 정해도 사법권을 침해하지 않는다.
              </p>
              <div className="bg-[#fef2f2] border border-[#fca5a5] rounded-lg px-4 py-3 text-[15.5px] sm:text-[16px] text-[#0f172a]">
                <strong className="text-[#b91c1c] font-extrabold mr-1.5">
                  기출 함정 주의 :
                </strong>
                결정문 맨 뒤에 실린 <strong>소수 재판관 3명의 반대의견(위헌 주장)</strong> 문구를 다수의견인 것처럼 그대로 베껴 출제합니다.
              </div>
            </article>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={() => onNavigateView('trainer')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-extrabold bg-[#1e3a8a] text-white hover:bg-[#0f172a] transition-colors"
            >
              <span>개념 복습 완료 · 문제 풀이로 이동하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
