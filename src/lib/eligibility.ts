import { Policy, EmploymentType } from '@/types/policy';

export interface EligibilityResult {
  isEligible: boolean;
  score: number; // 0 ~ 100
  statusText: '신청 가능' | '조건 불일치' | '확인 필요';
  reasons: {
    passed: string[];
    failed: string[];
  };
}

export function checkEligibility(
  policy: Policy,
  user: {
    age: number;
    region: string;
    maxIncome: number | null; // null = 무관/전체보기 or 3600, 5000, 7500
    employment: EmploymentType;
  }
): EligibilityResult {
  const passed: string[] = [];
  const failed: string[] = [];

  // 1. 연령 검사
  const ageMatch = user.age >= policy.ageRange.min && user.age <= policy.ageRange.max;
  if (ageMatch) {
    passed.push(`연령 충족 (만 ${policy.ageRange.min}~${policy.ageRange.max}세 대상)`);
  } else {
    failed.push(`연령 미달/초과 (신청 연령: 만 ${policy.ageRange.min}~${policy.ageRange.max}세)`);
  }

  // 2. 지역 검사
  const regionMatch =
    user.region === '전국' ||
    policy.region.includes('전국') ||
    policy.region.includes(user.region);

  if (regionMatch) {
    passed.push(`지역 충족 (${policy.region.join(', ')})`);
  } else {
    failed.push(`지역 불일치 (${policy.region.join(', ')} 거주자 전용)`);
  }

  // 3. 소득 기준 검사
  // policy.maxAnnualIncome: null (소득무관) or 3600, 5000, 7500
  // user.maxIncome: null (선택안함/소득무관) or 3600 (연봉 3600 이하), 5000, 7500
  let incomeMatch = true;
  if (user.maxIncome !== null) {
    if (policy.maxAnnualIncome !== null) {
      // 정책 기준보다 사용자의 소득이 더 높은 구간이면 불일치
      if (user.maxIncome > policy.maxAnnualIncome) {
        incomeMatch = false;
        failed.push(`소득 기준 초과 (연봉 ${policy.maxAnnualIncome.toLocaleString()}만 원 이하 대상)`);
      } else {
        passed.push(`소득 요건 충족 (연봉 ${policy.maxAnnualIncome.toLocaleString()}만 원 이하)`);
      }
    } else {
      passed.push('소득 무관 (모든 청년 지원 가능)');
    }
  } else {
    if (policy.maxAnnualIncome !== null) {
      passed.push(`소득 요건: 연봉 ${policy.maxAnnualIncome.toLocaleString()}만 원 이하`);
    } else {
      passed.push('소득 무관');
    }
  }

  // 4. 고용 형태 검사
  let employmentMatch = true;
  if (user.employment !== 'ALL') {
    const isEmpMatch =
      policy.employmentCondition.includes('ALL') ||
      policy.employmentCondition.includes(user.employment);

    if (isEmpMatch) {
      passed.push('고용 형태 적합');
    } else {
      employmentMatch = false;
      const conditionMap: Record<EmploymentType, string> = {
        SME: '중소기업 재직자',
        GENERAL_CORP: '일반/대기업 재직자',
        UNEMPLOYED: '무직/취업준비생',
        FREELANCER: '프리랜서/자영업자',
        ALL: '제한 없음',
      };
      const allowed = policy.employmentCondition.map((c) => conditionMap[c] || c).join(', ');
      failed.push(`고용 조건 불일치 (${allowed} 전용)`);
    }
  } else {
    passed.push('고용 형태 무관');
  }

  const isEligible = ageMatch && regionMatch && incomeMatch && employmentMatch;
  const totalChecks = passed.length + failed.length;
  const score = totalChecks > 0 ? Math.round((passed.length / totalChecks) * 100) : 100;

  let statusText: '신청 가능' | '조건 불일치' | '확인 필요' = '신청 가능';
  if (!isEligible) {
    statusText = score >= 50 ? '확인 필요' : '조건 불일치';
  }

  return {
    isEligible,
    score,
    statusText,
    reasons: { passed, failed },
  };
}

export interface DDayStatus {
  type: 'ALWAYS' | 'URGENT' | 'OPEN' | 'UPCOMING' | 'CLOSED';
  label: string;
  badgeClass: string;
  daysRemaining?: number;
}

// 기준 고정일 (2026년 기준) - Next.js 16 정적 사전 렌더링 시 new Date() 동적 호출 에러 방지
const STABLE_REFERENCE_DATE = new Date('2026-03-01T00:00:00Z');

export function getDDayStatus(policy: Policy, baseDate: Date = STABLE_REFERENCE_DATE): DDayStatus {
  if (policy.applicationType === 'ALWAYS' || !policy.endDate) {
    return {
      type: 'ALWAYS',
      label: '상시 신청',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    };
  }

  const now = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate()).getTime();
  const end = new Date(policy.endDate).getTime();
  const start = policy.startDate ? new Date(policy.startDate).getTime() : now;

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysToEnd = Math.ceil((end - now) / msPerDay);
  const daysToStart = Math.ceil((start - now) / msPerDay);

  if (daysToStart > 0) {
    return {
      type: 'UPCOMING',
      label: `오픈예정 (D-${daysToStart})`,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
      daysRemaining: daysToStart,
    };
  }

  if (daysToEnd < 0) {
    return {
      type: 'CLOSED',
      label: '모집 마감',
      badgeClass: 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
      daysRemaining: daysToEnd,
    };
  }

  if (daysToEnd <= 7) {
    return {
      type: 'URGENT',
      label: `마감 임박 D-${daysToEnd === 0 ? 'Day' : daysToEnd}`,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
      daysRemaining: daysToEnd,
    };
  }

  return {
    type: 'OPEN',
    label: `D-${daysToEnd}`,
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
    daysRemaining: daysToEnd,
  };
}
