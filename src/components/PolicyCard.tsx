'use client';

import React, { useState } from 'react';
import { Policy } from '@/types/policy';
import { usePolicyStore } from '@/store/usePolicyStore';
import { CalendarSaveButton } from '@/components/CalendarSaveButton';
import { getEffectiveApplicationPeriod } from '@/utils/calendar';
import { checkEligibility, getDDayStatus } from '@/lib/eligibility';
import {
  ExternalLink,
  Bookmark,
  Sparkles,
  Coins,
  Home,
  Receipt,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  FileText,
  Clock,
  Target,
  BadgeAlert,
} from 'lucide-react';

interface PolicyCardProps {
  policy: Policy;
  initialExpanded?: boolean;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy, initialExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const effectivePeriod = getEffectiveApplicationPeriod(policy);

  const {
    age,
    region,
    maxIncome,
    employment,
    isBookmarked,
    toggleBookmark,
  } = usePolicyStore();

  const eligibility = checkEligibility(policy, {
    age,
    region,
    maxIncome,
    employment,
  });

  const dDay = getDDayStatus(policy);
  const bookmarked = isBookmarked(policy.id);

  // Category visual mapping
  const categoryConfig: Record<
    string,
    { label: string; badgeClass: string; icon: React.ReactNode }
  > = {
    FINANCE: {
      label: '금융·저축',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      icon: <Coins className="w-3.5 h-3.5" />,
    },
    HOUSING: {
      label: '주거·대출',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
      icon: <Home className="w-3.5 h-3.5" />,
    },
    TAX: {
      label: '세제·환급',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
      icon: <Receipt className="w-3.5 h-3.5" />,
    },
    CAREER: {
      label: '자기계발',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
    },
  };

  const cat = categoryConfig[policy.category] || categoryConfig.FINANCE;

  const toggleCheck = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 ${
        isExpanded
          ? 'border-blue-400 dark:border-blue-600 shadow-md ring-1 ring-blue-500/20'
          : 'border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
      }`}
    >
      {/* Card Header & Content */}
      <div className="p-4 sm:p-5">
        {/* Top Badges Row (Category + D-Day + Bookmark) */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Category Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.8 rounded-lg text-[11px] font-bold border ${cat.badgeClass}`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </span>

            {/* D-Day Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.8 rounded-lg text-[11px] font-bold border ${dDay.badgeClass}`}
            >
              <Clock className="w-3 h-3" />
              <span>{dDay.label}</span>
            </span>

            {/* Critical Restriction Highlight Badge (결정적 자격 조건 빨간색/주황색 강조 뱃지) */}
            {policy.criticalBadge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.8 rounded-lg text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800">
                <BadgeAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                <span>{policy.criticalBadge}</span>
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(policy.id);
            }}
            title={bookmarked ? '저장 취소' : '정책 저장'}
            className={`p-1.5 rounded-lg transition-colors ${
              bookmarked
                ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/60 dark:text-amber-400'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* 1. [🎯 자격: (누가?)] - 카드 최상단에 굵은 텍스트로 가장 먼저 노출 */}
        <div className="mb-2.5">
          <div className="flex items-start gap-1.5">
            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
              🎯 대상:
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
              {policy.eligibilitySummary}
            </h3>
          </div>
        </div>

        {/* 2. [공식 정책명 + 그 아래 혜택 (동일한 크기)] */}
        <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100/90 dark:border-blue-900/60 mb-3 space-y-2">
          {/* 공식 정책명 */}
          <div className="flex items-start gap-1.5">
            <span className="text-xs sm:text-sm font-extrabold text-blue-700 dark:text-blue-400 shrink-0 mt-0.5">
              🏛️ 정책:
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {policy.officialName || policy.title}
            </p>
          </div>

          {/* 그 아래에 동일한 크기로 혜택 노출 */}
          <div className="flex items-start gap-1.5 pt-1.5 border-t border-blue-100/80 dark:border-blue-900/50">
            <span className="text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
              💰 혜택:
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {policy.benefitSummary}
            </p>
          </div>
        </div>

        {/* Tags */}
        {policy.tags && policy.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {policy.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Condition Match Result Badge */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">내 조건 판별:</span>
          {eligibility.isEligible ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>신청 가능</span>
            </span>
          ) : eligibility.statusText === '확인 필요' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>일부 충족</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>조건 불일치</span>
            </span>
          )}
        </div>
      </div>

      {/* Accordion Expandable Details (복잡한 서류나 상세 내용은 클릭했을 때만 톡 펼쳐짐) */}
      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-3 bg-slate-50/60 dark:bg-slate-900/60 rounded-b-2xl animate-in fade-in duration-150">
          {/* Detailed Eligibility Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span>자격 요건 체크리스트</span>
              </span>
              <span className="text-[10px] text-slate-400">클릭하여 체크</span>
            </div>
            <div className="space-y-1.5">
              {policy.eligibilityChecklist.map((item, idx) => {
                const isChecked = checkedItems[idx] || false;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => toggleCheck(idx, e)}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors text-xs ${
                      isChecked
                        ? 'bg-blue-50/80 text-blue-900 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900'
                        : 'bg-white text-slate-700 border border-slate-200/80 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className={isChecked ? 'line-through opacity-75' : ''}>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Documents */}
          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              신청 시 필요 서류
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {policy.requiredDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Condition Breakdown Reasons */}
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
            <span className="font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
              내 프로필 대조 사유:
            </span>
            {eligibility.reasons.passed.map((p, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>{p}</span>
              </div>
            ))}
            {eligibility.reasons.failed.map((f, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          {/* Application Period Info (신청 기간 안내) */}
          <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-blue-900 dark:text-blue-300">
              {policy.applicationType === 'ALWAYS' ? (
                '📅 접수 형태: 상시 신청 접수 (마감 기한 없음)'
              ) : effectivePeriod?.isNextCycle ? (
                <>
                  <span className="text-amber-600 dark:text-amber-400 font-bold mr-1">
                    [이전 차수 마감]
                  </span>
                  차기 {effectivePeriod.cycleLabel} 모집: {effectivePeriod.startDate} ~{' '}
                  {effectivePeriod.endDate}
                  {policy.recurrenceNotice ? ` (${policy.recurrenceNotice})` : ''}
                </>
              ) : (
                <>
                  📅 신청 기간:{' '}
                  {policy.applicationPeriod
                    ? `${policy.applicationPeriod.startDate} ~ ${policy.applicationPeriod.endDate}`
                    : policy.startDate && policy.endDate
                    ? `${policy.startDate} ~ ${policy.endDate}`
                    : '신청 기간 공고 대기'}
                </>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Card Action Footer with Small Official Name at Bottom */}
      <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/40 dark:bg-slate-900/40 rounded-b-2xl">
        {/* 주관 기관 표시 */}
        <div className="min-w-0 flex-1">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate block">
            🏛️ {policy.hostingAgency}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Accordion Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>{isExpanded ? '접기' : '자격 & 서류'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Calendar Save Button */}
          <CalendarSaveButton policy={policy} />

          {/* Official Direct Link (광고 링크 배제) */}
          <a
            href={policy.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <span>공식 신청</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
