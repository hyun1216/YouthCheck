'use client';

import React, { useState, useMemo } from 'react';
import { usePolicyStore } from '@/store/usePolicyStore';
import { mockPolicies } from '@/data/mockPolicies';
import { checkEligibility } from '@/lib/eligibility';
import { EmploymentType } from '@/types/policy';
import {
  X,
  Target,
  Sparkles,
  Building,
  GraduationCap,
  Coins,
  Check,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

const INCOME_OPTIONS = [
  { label: '소득 무관 (제한 없음)', value: null, desc: '누구나 지원 가능한 꿀혜택' },
  { label: '연봉 3,600만 원 이하', value: 3600, desc: '월 약 260만 원 (초년생 구간)' },
  { label: '연봉 5,000만 원 이하', value: 5000, desc: '월 약 350만 원 (청약/버팀목)' },
  { label: '연봉 7,500만 원 이하', value: 7500, desc: '청년도약계좌 등 가능' },
];

const EMPLOYMENT_OPTIONS: { label: string; value: EmploymentType; icon: React.ReactNode; desc: string }[] = [
  { label: '중소기업 재직자', value: 'SME', icon: <Building className="w-4 h-4" />, desc: '소득세 90% 감면, 버팀목 우대' },
  { label: '일반·대기업 재직자', value: 'GENERAL_CORP', icon: <Building className="w-4 h-4" />, desc: '도약계좌, K-패스, 청약' },
  { label: '무직 · 취업준비생', value: 'UNEMPLOYED', icon: <GraduationCap className="w-4 h-4" />, desc: '구직촉진수당, 국비훈련' },
  { label: '자영업 · 프리랜서', value: 'FREELANCER', icon: <Coins className="w-4 h-4" />, desc: '청년희망적금, K-패스' },
];

export const OnboardingModal: React.FC = () => {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    age: currentAge,
    maxIncome: currentIncome,
    employment: currentEmployment,
    setUserProfile,
  } = usePolicyStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAge, setSelectedAge] = useState<number>(currentAge || 28);
  const [selectedIncome, setSelectedIncome] = useState<number | null>(currentIncome);
  const [selectedEmployment, setSelectedEmployment] = useState<EmploymentType>(
    currentEmployment !== 'ALL' ? currentEmployment : 'SME'
  );

  // 실시간 예상 매칭 건수 계산
  const matchCount = useMemo(() => {
    return mockPolicies.filter((policy) => {
      return checkEligibility(policy, {
        age: selectedAge,
        region: '전국',
        maxIncome: selectedIncome,
        employment: selectedEmployment,
      }).isEligible;
    }).length;
  }, [selectedAge, selectedIncome, selectedEmployment]);

  if (!isOnboardingOpen) return null;

  const handleComplete = () => {
    setUserProfile({
      age: selectedAge,
      maxIncome: selectedIncome,
      employment: selectedEmployment,
      region: '전국',
    });

    // 정책 리스트 섹션으로 스크롤 이동
    setTimeout(() => {
      const target = document.getElementById('policy-list-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-sky-300 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-sky-300">3초 체크 온보딩</span>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">내 맞춤 정책 조건 입력</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOnboardingOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 my-4">
          {[
            { num: 1, label: '나이' },
            { num: 2, label: '연봉' },
            { num: 3, label: '고용상태' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num as 1 | 2 | 3)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                step === s.num
                  ? 'bg-blue-600 text-white shadow-xs dark:bg-slate-700 dark:shadow-none'
                  : step > s.num
                  ? 'bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-slate-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <span>Step {s.num}. {s.label}</span>
              {step > s.num && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-sky-300" />}
            </button>
          ))}
        </div>

        {/* Step 1: Age */}
        {step === 1 && (
          <div className="space-y-4 py-2 animate-in fade-in duration-150">
            <div>
              <label className="text-sm font-bold text-slate-900 dark:text-white block mb-1">
                현재 만 나이를 선택해주세요
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                대부분의 청년 정책은 만 19세 ~ 34세(군 복무 시 39세) 대상입니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">선택한 나이</span>
              <span className="text-3xl font-black text-blue-600 dark:text-sky-300">
                만 {selectedAge}세
              </span>
            </div>

            <input
              type="range"
              min="19"
              max="39"
              step="1"
              value={selectedAge}
              onChange={(e) => setSelectedAge(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-sky-400"
            />

            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[24, 26, 28, 31, 34].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedAge(v)}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    selectedAge === v
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs dark:bg-slate-700 dark:border-slate-600 dark:shadow-none'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-slate-500'
                  }`}
                >
                  {v}세
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-700/85 dark:hover:bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-500/20 dark:shadow-none transition-all"
            >
              <span>다음: 연봉 구간 선택</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Income */}
        {step === 2 && (
          <div className="space-y-4 py-2 animate-in fade-in duration-150">
            <div>
              <label className="text-sm font-bold text-slate-900 dark:text-white block mb-1">
                세전 연봉 구간을 선택해주세요
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                복잡한 중위소득 대신 근로소득원천징수 상의 연봉 기준으로 체크합니다.
              </p>
            </div>

            <div className="space-y-2">
              {INCOME_OPTIONS.map((opt) => {
                const isSelected = selectedIncome === opt.value;
                return (
                  <button
                    key={opt.value ?? 'ALL'}
                    type="button"
                    onClick={() => setSelectedIncome(opt.value)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-slate-800 border-blue-500 dark:border-slate-600 text-blue-950 dark:text-slate-100 shadow-xs dark:shadow-none ring-1 ring-blue-500/30 dark:ring-slate-600/50'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold">{opt.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-sky-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                이전
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-700/85 dark:hover:bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 dark:shadow-none transition-all"
              >
                <span>다음: 고용 상태 선택</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Employment */}
        {step === 3 && (
          <div className="space-y-4 py-2 animate-in fade-in duration-150">
            <div>
              <label className="text-sm font-bold text-slate-900 dark:text-white block mb-1">
                현재 고용 상태를 선택해주세요
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                중소기업 청년의 경우 5년간 소득세 90% 감면 등 특화 혜택이 적용됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EMPLOYMENT_OPTIONS.map((emp) => {
                const isSelected = selectedEmployment === emp.value;
                return (
                  <button
                    key={emp.value}
                    type="button"
                    onClick={() => setSelectedEmployment(emp.value)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-slate-800 border-blue-500 dark:border-slate-600 text-blue-950 dark:text-slate-100 shadow-xs dark:shadow-none ring-1 ring-blue-500/30 dark:ring-slate-600/50'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="mt-0.5 text-blue-600 dark:text-sky-300 shrink-0">{emp.icon}</div>
                    <div className="flex-1">
                      <div className="text-xs sm:text-sm font-bold">{emp.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{emp.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Count Preview */}
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  내 조건 충족 정책 발견:
                </span>
              </div>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                총 {matchCount}건
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                이전
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="w-2/3 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 dark:shadow-none transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>맞춤 정책 {matchCount}건 바로보기</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
            <span>입력한 조건은 브라우저에만 안전하게 저장됩니다</span>
          </span>
        </div>
      </div>
    </div>
  );
};
