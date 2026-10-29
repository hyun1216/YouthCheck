'use client';

import React, { useEffect, useState } from 'react';
import { usePolicyStore } from '@/store/usePolicyStore';
import { checkEligibility, getDDayStatus } from '@/lib/eligibility';
import { CalendarSaveButton } from '@/components/CalendarSaveButton';
import {
  X,
  ExternalLink,
  Bookmark,
  CheckSquare,
  Square,
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  Sparkles,
  MapPin,
  Building,
  Coins,
} from 'lucide-react';

export const PolicyDetailModal: React.FC = () => {
  const {
    selectedPolicy,
    setSelectedPolicy,
    age,
    region,
    maxIncome,
    employment,
    isBookmarked,
    toggleBookmark,
  } = usePolicyStore();

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Reset checked items when policy changes
    setCheckedItems({});
  }, [selectedPolicy?.id]);

  useEffect(() => {
    // Handle ESC key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPolicy(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedPolicy]);

  if (!selectedPolicy) return null;

  const eligibility = checkEligibility(selectedPolicy, {
    age,
    region,
    maxIncome,
    employment,
  });

  const dDay = getDDayStatus(selectedPolicy);
  const bookmarked = isBookmarked(selectedPolicy.id);

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setSelectedPolicy(null)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Meta */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-xs font-semibold text-blue-600 dark:text-sky-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {selectedPolicy.hostingAgency}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${dDay.badgeClass}`}>
            {dDay.label}
          </span>
        </div>

        {/* Title & Eligibility Summary */}
        <div className="mb-2">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mb-1">
            공식 정책명: {selectedPolicy.officialName || selectedPolicy.title}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
            {selectedPolicy.eligibilitySummary}
          </h2>
        </div>

        {/* Benefit Highlight Callout */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-sky-300 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                핵심 지원 혜택
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedPolicy.benefitSummary}
              </p>
            </div>
          </div>
        </div>

        {/* 내 조건 매칭 결과 요약 박스 */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                내 조건 체크 결과
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                  eligibility.isEligible
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {eligibility.statusText} ({eligibility.score}%)
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              만 {age}세 · {region} · {maxIncome ? `연봉 ${maxIncome.toLocaleString()}만 이하` : '소득 무관'}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            {eligibility.reasons.passed.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{p}</span>
              </div>
            ))}
            {eligibility.reasons.failed.map((f, idx) => (
              <div key={idx} className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 자격 요건 체크리스트 */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              자격 요건 체크리스트 (직접 확인)
            </h3>
            <span className="text-[11px] text-blue-600 dark:text-sky-300">클릭하여 체크</span>
          </div>

          <div className="space-y-2">
            {selectedPolicy.eligibilityChecklist.map((item, idx) => {
              const isChecked = checkedItems[idx] || false;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleCheck(idx)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    isChecked
                      ? 'bg-blue-50/70 border-blue-300 text-blue-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-200'
                      : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                  )}
                  <span className={`text-xs sm:text-sm font-medium ${isChecked ? 'line-through opacity-80' : ''}`}>
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 제출 서류 안내 */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            신청 시 필요 제출 서류
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedPolicy.requiredDocuments.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
              >
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => toggleBookmark(selectedPolicy.id)}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              bookmarked
                ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500' : ''}`} />
            <span>{bookmarked ? '저장됨' : '북마크 저장'}</span>
          </button>

          <CalendarSaveButton policy={selectedPolicy} />

          <a
            href={selectedPolicy.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700/85 dark:hover:bg-blue-600 dark:text-blue-50 shadow-md shadow-blue-500/25 dark:shadow-none transition-all"
          >
            <span>공식 신청 페이지 바로가기 (광고 없음)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
