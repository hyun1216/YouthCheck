'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { MainTabNavigation } from '@/components/MainTabNavigation';
import { HeroSection } from '@/components/HeroSection';
import { FilterSection } from '@/components/FilterSection';
import { CategoryTabs } from '@/components/CategoryTabs';
import { PolicyCard } from '@/components/PolicyCard';
import { DeadlineView } from '@/components/DeadlineView';
import { PolicyDetailModal } from '@/components/PolicyDetailModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { TipCard } from '@/components/TipCard';
import { Footer } from '@/components/Footer';
import { mockPolicies } from '@/data/mockPolicies';
import { mockTips } from '@/data/mockTips';
import { usePolicyStore } from '@/store/usePolicyStore';
import { checkEligibility } from '@/lib/eligibility';
import {
  LayoutGrid,
  CalendarDays,
  FilterX,
  Sparkles,
  SlidersHorizontal,
  Lightbulb,
  Bell,
  Search,
  X,
  Award,
  FileText,
  Briefcase,
  Coins,
  Rocket,
  Scale,
} from 'lucide-react';
import { TipSubCategory } from '@/types/policy';

const TIP_SUBCATEGORIES: { id: TipSubCategory; label: string; icon: React.ElementType }[] = [
  { id: '전체', label: '전체', icon: Sparkles },
  { id: '이력서', label: '이력서', icon: FileText },
  { id: '이직&취직', label: '이직&취직', icon: Briefcase },
  { id: '재테크', label: '재테크', icon: Coins },
  { id: '부업', label: '부업', icon: Rocket },
  { id: '노동관련법규', label: '노동관련법규', icon: Scale },
];

export default function HomePage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [tipSubCategory, setTipSubCategory] = useState<TipSubCategory>('전체');

  const {
    activeMainTab,
    age,
    region,
    maxIncome,
    employment,
    category,
    searchQuery,
    onlyEligible,
    onlyBookmarked,
    bookmarkedIds,
    viewMode,
    setViewMode,
    resetFilters,
    setIsFilterBarExpanded,
  } = usePolicyStore();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Filtered policies computation based on user criteria
  const filteredPolicies = useMemo(() => {
    return mockPolicies.filter((policy) => {
      // 1. 카테고리 필터
      if (category !== 'ALL' && policy.category !== category) {
        return false;
      }

      // 2. 검색어 필터
      if (searchQuery.trim() !== '') {
        const query = searchQuery.trim().toLowerCase();
        const matchTitle = (policy.officialName || policy.title || '').toLowerCase().includes(query);
        const matchEligibility = (policy.eligibilitySummary || '').toLowerCase().includes(query);
        const matchBenefit = (policy.benefitSummary || '').toLowerCase().includes(query);
        const matchCritical = (policy.criticalBadge || '').toLowerCase().includes(query);
        const matchAgency = (policy.hostingAgency || '').toLowerCase().includes(query);
        const matchTag = (policy.tags || []).some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchEligibility && !matchBenefit && !matchCritical && !matchAgency && !matchTag) {
          return false;
        }
      }

      // 3. 북마크 필터
      if (onlyBookmarked && hasMounted) {
        if (!bookmarkedIds.includes(policy.id)) {
          return false;
        }
      }

      // 4. 내 조건 충족만 보기 필터
      if (onlyEligible) {
        const el = checkEligibility(policy, {
          age,
          region,
          maxIncome,
          employment,
        });
        if (!el.isEligible) {
          return false;
        }
      }

      return true;
    });
  }, [
    category,
    searchQuery,
    onlyBookmarked,
    hasMounted,
    bookmarkedIds,
    onlyEligible,
    age,
    region,
    maxIncome,
    employment,
  ]);

  // Count strictly eligible policies among all mock policies
  const eligibleCount = useMemo(() => {
    return mockPolicies.filter((p) => {
      return checkEligibility(p, { age, region, maxIncome, employment }).isEligible;
    }).length;
  }, [age, region, maxIncome, employment]);

  // Tips & News filtering
  const tipsItems = useMemo(() => {
    const allTips = mockTips.filter((item) => item.tab === 'TIPS');
    if (tipSubCategory === '전체') return allTips;
    return allTips.filter((item) => item.subCategory === tipSubCategory);
  }, [tipSubCategory]);

  const newsItems = useMemo(() => {
    return mockTips.filter((item) => item.tab === 'NEWS');
  }, []);

  const featuredTip = useMemo(() => {
    return tipsItems.find((t) => t.isFeatured);
  }, [tipsItems]);

  const nonFeaturedTips = useMemo(() => {
    return tipsItems.filter((t) => !t.isFeatured);
  }, [tipsItems]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 dark:bg-[#0a0f1d] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Header */}
      <Header />

      {/* Top Level Tabs Navigation (🏛️ 청년 정책 / 💡 청년꿀팁 / 📢 실시간 소식) */}
      <MainTabNavigation />

      {/* TAB 1: 🏛️ 청년 정책 뷰 (POLICIES) */}
      {activeMainTab === 'POLICIES' && (
        <>
          {/* Hero Section (Two-Track Discovery) */}
          <HeroSection />

          {/* Main Content Area: Policy List Section */}
          <main
            id="policy-list-section"
            className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 scroll-mt-16"
          >
            {/* Dynamic Accordion Filter Bar */}
            <FilterSection />

            {/* Status / Matching Summary Bar */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 flex items-center justify-center text-blue-700 dark:text-blue-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      내 조건 신청 가능:
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      {eligibleCount}개
                    </span>
                    <span className="text-xs text-slate-400">/ 전체 {mockPolicies.length}개</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    만 {age}세 · {region} · {maxIncome ? `연봉 ${maxIncome.toLocaleString()}만 이하` : '소득 무관'}
                  </p>
                </div>
              </div>

              {/* View Mode Tabs (Card Grid vs Timeline/Deadline) */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'cards'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>카드 리스트 ({filteredPolicies.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('timeline')}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'timeline'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>마감 & 캘린더 뷰</span>
                </button>
              </div>
            </div>

            {/* Category Navigation Tabs (전체 / 금융·저축 / 주거·대출 / 세제·환급 / 자기계발) */}
            <CategoryTabs />

            {/* Responsive Policy Cards Grid (1 col on mobile, 2 on tablet, 3 on desktop) */}
            {filteredPolicies.length > 0 ? (
              viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filteredPolicies.map((policy) => (
                    <PolicyCard key={policy.id} policy={policy} />
                  ))}
                </div>
              ) : (
                <DeadlineView policies={filteredPolicies} />
              )
            ) : (
              /* Empty State */
              <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <FilterX className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  조건에 일치하는 정책이 없습니다
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  연봉 제한을 풀거나 '내 조건 충족만 보기' 필터를 해제해보세요.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <span>조건 초기화</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFilterBarExpanded(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>필터 펼치기</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </>
      )}

      {/* TAB 2: 💡 청년꿀팁 뷰 (TIPS) */}
      {activeMainTab === 'TIPS' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-9">
          {/* Section Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 text-xs font-bold mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>청년 커리어 · 재테크 & 노동법 실전 가이드</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              청년꿀팁
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              이력서 작성 공식부터 이직·취직 치트키, 5년 치 세금 환급 재테크, N잡러 부업 세무, 청년 필수 노동법까지 알짜 정보만 모았습니다.
            </p>
          </div>

          {/* Subcategory Filter Pills (중분류 탭) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
            {TIP_SUBCATEGORIES.map((sub) => {
              const isActive = tipSubCategory === sub.id;
              const count =
                sub.id === '전체'
                  ? mockTips.filter((t) => t.tab === 'TIPS').length
                  : mockTips.filter((t) => t.tab === 'TIPS' && t.subCategory === sub.id).length;
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setTipSubCategory(sub.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-xs dark:bg-amber-500 dark:text-slate-950 font-extrabold'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white dark:text-slate-950' : 'text-slate-400'}`} />
                  <span>{sub.label}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive
                        ? 'bg-amber-600/40 text-white dark:bg-black/20 dark:text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* (1) Featured Hero Card (전체 또는 해당 중분류에 featured가 있을 때만 노출) */}
          {featuredTip && <TipCard item={featuredTip} />}

          {/* (2) Tip Cards Grid */}
          <div className={featuredTip ? 'mt-6' : 'mt-2'}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{tipSubCategory === '전체' ? '실전 청년 꿀팁 모음' : `${tipSubCategory} 꿀팁`}</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  총 {tipsItems.length}개
                </span>
              </h2>
            </div>

            {tipsItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {nonFeaturedTips.map((tip) => (
                  <TipCard key={tip.id} item={tip} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500">해당 카테고리에 등록된 꿀팁이 아직 없습니다.</p>
              </div>
            )}
          </div>
        </main>
      )}

      {/* TAB 3: 📢 실시간 소식 뷰 (NEWS) */}
      {activeMainTab === 'NEWS' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-9">
          {/* Section Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 text-xs font-bold mb-2">
              <Bell className="w-3.5 h-3.5 text-rose-600" />
              <span>청년정책 실시간 브리핑</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              실시간 정책 소식 & 고시 안내
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              이번 달 모집 시작/마감 공지, 부처별 최신 보도자료 요약 및 제도 개정 사항을 확인하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {newsItems.map((news) => (
              <TipCard key={news.id} item={news} />
            ))}
          </div>
        </main>
      )}

      {/* Mini Onboarding Modal (3-Step Quick Check) */}
      <OnboardingModal />

      {/* Policy Detail Modal */}
      <PolicyDetailModal />

      {/* Trust & Transparency Footer */}
      <Footer />
    </div>
  );
}
