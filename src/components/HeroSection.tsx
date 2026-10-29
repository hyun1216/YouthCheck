'use client';

import React from 'react';
import { usePolicyStore } from '@/store/usePolicyStore';
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  ArrowRight,
  Building2,
  Briefcase,
  GraduationCap,
  PiggyBank,
  Target,
  Compass,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { applyPreset, setIsOnboardingOpen, setOnlyEligible } = usePolicyStore();

  const handleExploreAll = () => {
    // '모든 정책 먼저 둘러보기': 내 조건 한정 필터 끄고 리스트로 스크롤
    setOnlyEligible(false);
    const target = document.getElementById('policy-list-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-7 pb-8 sm:pt-11 sm:pb-12 bg-gradient-to-b from-blue-50/80 via-slate-50/50 to-transparent dark:from-slate-900 dark:via-slate-900/60 dark:to-transparent border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Tagline Badge - 심플한 무채색 뱃지 + 미니멀 블루 닷 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            <span>광고 없는 순수 공공 혜택 큐레이션</span>
          </div>

          {/* Main Title: 기본 텍스트는 흑백, 핵심 키워드("3초 만에") 1개만 메인 블루로 강조 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.2]">
            광고 없는 알짜 청년 정책, <br className="hidden sm:inline" />
            <span className="text-blue-600 dark:text-blue-400">3초 만에</span> 청년체크
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            복잡한 중위소득 기준표 때문에 포기하셨나요? <strong className="font-semibold text-slate-900 dark:text-white">내 나이와 연봉</strong>만으로 
            직장인이 실제로 받을 수 있는 정부·지자체 공식 혜택만 3초 만에 판별해 드립니다.
          </p>

          {/* Two-Track CTA Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Button A: Primary - 과녁 이모지/원형 아이콘 제거, 모던한 블루 + 심플 화살표 */}
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-xs active:scale-[0.99] transition-all"
            >
              <span>내 조건으로 3초 만에 찾기</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Button B: Secondary / Ghost */}
            <button
              type="button"
              onClick={handleExploreAll}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base active:scale-[0.99] transition-all"
            >
              <span>모든 정책 둘러보기</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>상업 광고 링크 일절 배제</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>정부24 · 홈택스 · 복지로 정식 링크</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>2026 최신 정책 기준 반영</span>
            </div>
          </div>

          {/* Quick Presets - 테두리(Border) 제거, 옅은 회색 배경의 부드러운 필터 칩 */}
          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">빠른 프리셋:</span>
              <span className="text-[10px] text-slate-400">원클릭 상황별 설정</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('SME_WORKER')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>중소기업 청년 (소득세 90% 감면)</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('FIRST_JOB')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Briefcase className="w-3 h-3 text-slate-400" />
                <span>사회초년생 (연봉 3,600만 이하)</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('SAVINGS_FOCUS')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <PiggyBank className="w-3 h-3 text-slate-400" />
                <span>목돈 모으기 (도약계좌)</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('JOB_SEEKER')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <GraduationCap className="w-3 h-3 text-slate-400" />
                <span>취준생 (구직수당 · 직업훈련)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
