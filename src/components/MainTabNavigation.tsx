'use client';

import React from 'react';
import { usePolicyStore } from '@/store/usePolicyStore';
import { MainTabType } from '@/types/policy';
import { Landmark, Lightbulb, Bell, Sparkles } from 'lucide-react';
import { mockPolicies } from '@/data/mockPolicies';

interface TabItem {
  id: MainTabType;
  label: string;
  subLabel: string;
  icon: React.ReactNode;
  badge?: string;
}

const TABS: TabItem[] = [
  {
    id: 'POLICIES',
    label: '청년 정책',
    subLabel: '지원금 · 대출 · 소득공제',
    icon: <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  {
    id: 'TIPS',
    label: '청년꿀팁',
    subLabel: '이력서 · 이직 · 재테크 · 부업 · 노동법',
    icon: <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />,
    badge: 'HOT',
  },
  {
    id: 'NEWS',
    label: '실시간 소식',
    subLabel: '신청 오픈 · 개정 보도자료',
    icon: <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />,
    badge: 'NEW',
  },
];

export const MainTabNavigation: React.FC = () => {
  const { activeMainTab, setActiveMainTab } = usePolicyStore();

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between sm:justify-start gap-1 sm:gap-3 py-2 overflow-x-auto scrollbar-none" aria-label="메인 대분류">
          {TABS.map((tab) => {
            const isActive = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMainTab(tab.id)}
                className={`group relative flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2.5 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-left transition-all ${
                  isActive
                    ? 'bg-blue-50/90 text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 shadow-xs ring-1 ring-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {tab.icon}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs sm:text-sm font-black tracking-tight ${isActive ? 'text-blue-900 dark:text-blue-100' : 'text-slate-800 dark:text-slate-200'}`}>
                      {tab.label}
                    </span>
                    {tab.id === 'POLICIES' ? (
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {mockPolicies.length}건
                      </span>
                    ) : tab.badge ? (
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : tab.badge === 'HOT'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 hidden md:block font-medium truncate mt-0.5">
                    {tab.subLabel}
                  </p>
                </div>

                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
