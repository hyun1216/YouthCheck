'use client';

import React from 'react';
import { usePolicyStore } from '@/store/usePolicyStore';
import { PolicyCategory, EmploymentType } from '@/types/policy';
import {
  Search,
  Filter,
  CheckCircle,
  Building,
  Coins,
  Home,
  Receipt,
  GraduationCap,
  Sparkles,
  MapPin,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  SlidersHorizontal,
  Target,
} from 'lucide-react';

const REGIONS = [
  '전국',
  '서울',
  '경기',
  '인천',
  '부산',
  '대구',
  '대전',
  '광주',
  '울산',
  '세종',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주',
];

const INCOME_OPTIONS: { label: string; value: number | null; desc: string }[] = [
  { label: '제한 없음 (소득 무관)', value: null, desc: '누구나 지원 가능' },
  { label: '연봉 3,600만 원 이하', value: 3600, desc: '월 약 260만 원' },
  { label: '연봉 5,000만 원 이하', value: 5000, desc: '월 약 350만 원' },
  { label: '연봉 7,500만 원 이하', value: 7500, desc: '도약계좌 등 가능' },
];

const EMPLOYMENT_OPTIONS: { label: string; value: EmploymentType }[] = [
  { label: '전체 (구분 없음)', value: 'ALL' },
  { label: '중소기업 직장인', value: 'SME' },
  { label: '일반·대기업 직장인', value: 'GENERAL_CORP' },
  { label: '무직 · 취준생', value: 'UNEMPLOYED' },
  { label: '자영업 · 프리랜서', value: 'FREELANCER' },
];

export const FilterSection: React.FC = () => {
  const {
    age,
    setAge,
    region,
    setRegion,
    maxIncome,
    setMaxIncome,
    employment,
    setEmployment,
    category,
    searchQuery,
    setSearchQuery,
    onlyEligible,
    setOnlyEligible,
    isFilterBarExpanded,
    setIsFilterBarExpanded,
    setIsOnboardingOpen,
    resetFilters,
  } = usePolicyStore();

  const employmentLabelMap: Record<EmploymentType, string> = {
    ALL: '고용무관',
    SME: '중소기업',
    GENERAL_CORP: '일반·대기업',
    UNEMPLOYED: '취준·무직',
    FREELANCER: '프리랜서',
  };

  const incomeLabel =
    maxIncome === null ? '소득무관' : `연봉 ${maxIncome.toLocaleString()}만 이하`;

  // Active filter count indicator
  const activeFiltersCount =
    (region !== '전국' ? 1 : 0) +
    (maxIncome !== null ? 1 : 0) +
    (employment !== 'ALL' ? 1 : 0) +
    (category !== 'ALL' ? 1 : 0) +
    (onlyEligible ? 1 : 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs p-3.5 sm:p-5 mb-5 transition-all">
      {/* Top Summary & Accordion Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Condition Summary Chips & Onboarding launcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:inline mr-1">
            적용 조건:
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800">
            만 {age}세
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {region}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {incomeLabel}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {employmentLabelMap[employment]}
          </span>

          {/* Quick Onboarding Re-run Button */}
          <button
            type="button"
            onClick={() => setIsOnboardingOpen(true)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-1"
          >
            <Target className="w-3 h-3" />
            <span>조건 재설정</span>
          </button>
        </div>

        {/* Right: Accordion Toggle Button & Only Eligible Checkbox */}
        <div className="flex items-center gap-2">
          {/* Only Eligible Switch */}
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold select-none px-2.5 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800">
            <input
              type="checkbox"
              checked={onlyEligible}
              onChange={(e) => setOnlyEligible(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
            />
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>내 조건 충족만</span>
          </label>

          {/* Dynamic Accordion Toggle Button: [조건 상세 필터 ⚙️] */}
          <button
            type="button"
            onClick={() => setIsFilterBarExpanded((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isFilterBarExpanded
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>조건 상세 필터 ⚙️</span>
            {activeFiltersCount > 0 && !isFilterBarExpanded && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
            {isFilterBarExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Detailed Accordion Panel (Expandable) */}
      {isFilterBarExpanded && (
        <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Age Slider */}
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span>만 나이:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold text-sm">{age}세</span>
                </label>
                <span className="text-[10px] text-slate-400">19~39세</span>
              </div>

              <input
                type="range"
                min="19"
                max="39"
                step="1"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <div className="flex justify-between gap-1">
                {[24, 28, 31, 34, 39].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAge(val)}
                    className={`px-1.5 py-0.5 text-[10px] rounded font-semibold transition-colors ${
                      age === val
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {val}세
                  </button>
                ))}
              </div>
            </div>

            {/* Region Selection */}
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>거주 지역:</span>
                <span className="text-blue-600 dark:text-blue-400 font-extrabold">{region}</span>
              </label>

              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:ring-1 focus:ring-blue-500"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r === '전국' ? '전국 (모든 지역)' : r}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">지자체 한정 청년 혜택 필터링</p>
            </div>

            {/* Income Selection */}
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                <span>세전 연봉:</span>
              </label>

              <select
                value={maxIncome === null ? 'ALL' : maxIncome}
                onChange={(e) => {
                  const val = e.target.value;
                  setMaxIncome(val === 'ALL' ? null : Number(val));
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:ring-1 focus:ring-blue-500"
              >
                {INCOME_OPTIONS.map((opt) => (
                  <option key={opt.value ?? 'ALL'} value={opt.value ?? 'ALL'}>
                    {opt.label} ({opt.desc})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">복잡한 중위소득 대신 연봉 기준</p>
            </div>

            {/* Employment Selection */}
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>고용 형태:</span>
              </label>

              <select
                value={employment}
                onChange={(e) => setEmployment(e.target.value as EmploymentType)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:ring-1 focus:ring-blue-500"
              >
                {EMPLOYMENT_OPTIONS.map((emp) => (
                  <option key={emp.value} value={emp.value}>
                    {emp.label}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">중소기업 소득세 90% 감면 등 적용</p>
            </div>
          </div>

          {/* Search Box & Reset Button */}
          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="정책명, 키워드 검색 (예: 전세, 도약, 세제)"
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-1 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>조건 전체 초기화</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
