'use client';

import React from 'react';
import { usePolicyStore } from '@/store/usePolicyStore';
import { ShieldCheck, Bookmark, Sparkles, RefreshCcw } from 'lucide-react';
import { mockPolicies } from '@/data/mockPolicies';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Header: React.FC = () => {
  const { bookmarkedIds, onlyBookmarked, setOnlyBookmarked, resetFilters } = usePolicyStore();
  const totalCount = mockPolicies.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-1 ring-white/20">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                청년체크
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                YouthCheck
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              광고 없는 2030 직장인 알짜 정책 큐레이션
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>엄선 정책 <strong className="text-blue-600 dark:text-blue-400">{totalCount}</strong>개 실시간 체크</span>
          </div>

          {/* Bookmarks Toggle Button */}
          <button
            type="button"
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              onlyBookmarked
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${onlyBookmarked ? 'fill-white' : ''}`} />
            <span>저장한 정책</span>
            {bookmarkedIds.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                onlyBookmarked ? 'bg-white text-amber-600' : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
              }`}>
                {bookmarkedIds.length}
              </span>
            )}
          </button>

          {/* Light / Dark Mode Toggle Button */}
          <ThemeToggle />

          {/* Reset Button */}
          <button
            type="button"
            onClick={resetFilters}
            title="필터 초기화"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
