'use client';

import React from 'react';
import { usePolicyStore } from '@/store/usePolicyStore';
import { PolicyCategory } from '@/types/policy';
import { Sparkles, Coins, Home, Receipt, GraduationCap } from 'lucide-react';

const CATEGORIES: { label: string; value: PolicyCategory | 'ALL'; icon: React.ReactNode }[] = [
  { label: '전체', value: 'ALL', icon: <Sparkles className="w-4 h-4" /> },
  { label: '금융·저축', value: 'FINANCE', icon: <Coins className="w-4 h-4" /> },
  { label: '주거·대출', value: 'HOUSING', icon: <Home className="w-4 h-4" /> },
  { label: '세제·환급', value: 'TAX', icon: <Receipt className="w-4 h-4" /> },
  { label: '자기계발', value: 'CAREER', icon: <GraduationCap className="w-4 h-4" /> },
];

export const CategoryTabs: React.FC = () => {
  const { category, setCategory } = usePolicyStore();

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isActive = category === cat.value;
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(cat.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 shadow-xs ${
              isActive
                ? 'bg-blue-600 text-white ring-2 ring-blue-600/30 shadow-md shadow-blue-500/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
