'use client';

import React from 'react';
import { Policy } from '@/types/policy';
import { usePolicyStore } from '@/store/usePolicyStore';
import { checkEligibility, getDDayStatus } from '@/lib/eligibility';
import {
  Calendar,
  Clock,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface DeadlineViewProps {
  policies: Policy[];
}

export const DeadlineView: React.FC<DeadlineViewProps> = ({ policies }) => {
  const {
    age,
    region,
    maxIncome,
    employment,
    isBookmarked,
    toggleBookmark,
    setSelectedPolicy,
  } = usePolicyStore();

  // Categorize policies into Urgent / Open / Upcoming / Always
  const periodPolicies = policies.filter((p) => p.applicationType === 'PERIOD');
  const alwaysPolicies = policies.filter((p) => p.applicationType === 'ALWAYS');

  const urgentList = periodPolicies.filter((p) => {
    const status = getDDayStatus(p);
    return status.type === 'URGENT' || (status.type === 'OPEN' && (status.daysRemaining ?? 999) <= 30);
  });

  const upcomingList = periodPolicies.filter((p) => {
    const status = getDDayStatus(p);
    return status.type === 'UPCOMING';
  });

  const otherPeriodList = periodPolicies.filter((p) => {
    const status = getDDayStatus(p);
    return status.type !== 'URGENT' && status.type !== 'UPCOMING' && (status.daysRemaining ?? 0) > 30;
  });

  const renderTimelineItem = (policy: Policy) => {
    const dDay = getDDayStatus(policy);
    const eligibility = checkEligibility(policy, { age, region, maxIncome, employment });
    const bookmarked = isBookmarked(policy.id);

    return (
      <div
        key={policy.id}
        onClick={() => setSelectedPolicy(policy)}
        className="group relative flex flex-col md:flex-row items-start md:items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer gap-4"
      >
        <div className="flex items-start gap-4 flex-1">
          {/* D-Day badge bubble */}
          <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Calendar className="w-4 h-4 text-slate-400 mb-1" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 text-center leading-tight">
              {dDay.label.split(' ')[0]}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                {policy.hostingAgency}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${dDay.badgeClass}`}>
                {policy.startDate && policy.endDate
                  ? `${policy.startDate} ~ ${policy.endDate}`
                  : '상시 모집'}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {policy.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {policy.benefitSummary}
            </p>
          </div>
        </div>

        {/* Eligibility + Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
          {eligibility.isEligible ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              신청 가능
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              조건 확인
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(policy.id);
              }}
              className={`p-2 rounded-xl transition-all ${
                bookmarked
                  ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            <a
              href={policy.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs"
            >
              <span>공식 신청</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. 마감 임박 타임라인 */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              이번 달 마감 임박 & 진행 중인 정책
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              기한 내 신청해야 하는 기간 한정 정책입니다. 마감 전 서류를 준비하세요.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {urgentList.length > 0 ? (
            urgentList.map(renderTimelineItem)
          ) : (
            <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500">
              현재 조건에 해당하는 마감 임박 정책이 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* 2. 오픈 예정 타임라인 */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              다음 달 및 향후 오픈 예정 정책
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              공식 모집 일정이 예정된 정책입니다. 북마크해두고 알림을 챙기세요.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {upcomingList.length > 0 ? (
            upcomingList.map(renderTimelineItem)
          ) : (
            <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500">
              예정된 오픈 정책이 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* 3. 상시 신청 가능 정책 ( 언제든 신청 가능 ) */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              상시 신청 가능 (기한 없음)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              마감일 걱정 없이 조건만 충족하면 1년 내내 언제든 신청할 수 있는 핵심 정책입니다.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {alwaysPolicies.map(renderTimelineItem)}
        </div>
      </section>
    </div>
  );
};
