'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CalendarPlus, CheckCircle2, ChevronDown, ExternalLink } from 'lucide-react';
import { Policy } from '@/types/policy';
import {
  downloadIcsFile,
  getGoogleCalendarUrl,
  getEffectiveApplicationPeriod,
  CalendarEventParams,
} from '@/utils/calendar';

interface CalendarSaveButtonProps {
  policy: Policy;
  className?: string;
  hideDropdown?: boolean;
}

export const CalendarSaveButton: React.FC<CalendarSaveButtonProps> = ({
  policy,
  className = '',
  hideDropdown = false,
}) => {
  // 1. 상시 신청 정책은 캘린더 등록 대상에서 제외
  if (policy.applicationType === 'ALWAYS') {
    return null;
  }

  // 2. 유효 신청 기간 계산 (마감된 경우 분기/반기/12월 등 차기 일정 자동 계산)
  const effectivePeriod = getEffectiveApplicationPeriod(policy);

  // 신청 기간 정보가 없거나, 이미 마감되었고 재모집 주기도 없는 경우 제외
  if (!effectivePeriod) {
    return null;
  }

  return (
    <CalendarSaveButtonInner
      policy={policy}
      effectivePeriod={effectivePeriod}
      className={className}
      hideDropdown={hideDropdown}
    />
  );
};

interface CalendarSaveButtonInnerProps {
  policy: Policy;
  effectivePeriod: NonNullable<ReturnType<typeof getEffectiveApplicationPeriod>>;
  className?: string;
  hideDropdown?: boolean;
}

const CalendarSaveButtonInner: React.FC<CalendarSaveButtonInnerProps> = ({
  policy,
  effectivePeriod,
  className = '',
  hideDropdown = false,
}) => {
  const [showToast, setShowToast] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const isNextCycle = effectivePeriod.isNextCycle;
  const cycleLabel = effectivePeriod.cycleLabel;

  // 캘린더 등록용 파라미터 구성
  const eventParams: CalendarEventParams = {
    title: policy.officialName || policy.title || '청년 정책',
    description: `${policy.benefitSummary}\n\n[지원대상] ${policy.eligibilitySummary}`,
    startDate: effectivePeriod.startDate,
    endDate: effectivePeriod.endDate,
    url: policy.officialUrl,
    isAlways: false,
    isNextCycle,
    cycleLabel,
  };

  // Google Calendar URL은 클라이언트 마운트 후 계산하여 SSR prerender 에러 방지
  const [googleCalUrl, setGoogleCalUrl] = useState<string>('#');

  useEffect(() => {
    setGoogleCalUrl(getGoogleCalendarUrl(eventParams));
  }, [policy.id, effectivePeriod.startDate, effectivePeriod.endDate, isNextCycle]);

  // 기본 클릭 시 .ics 파일 다운로드 및 토스트 표시
  const handleIcsDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuOpen(false);

    downloadIcsFile(eventParams);

    setShowToast(true);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const buttonLabel = isNextCycle ? '차기 일정 캘린더' : '캘린더 저장';
  const buttonTitle = isNextCycle
    ? `이전 모집 마감 → 차기 ${cycleLabel || '정기'} 모집(${effectivePeriod.startDate}~) 캘린더 저장`
    : '신청 일정 캘린더에 저장 (.ics 다운로드)';

  const toastMessage = isNextCycle
    ? `다음 차기(${cycleLabel || '정기'} 모집) 일정이 캘린더에 저장되었습니다.`
    : '신청 일정이 캘린더에 저장되었습니다.';

  return (
    <div className="relative inline-flex items-center" ref={menuRef}>
      <div className="inline-flex items-center rounded-lg shadow-xs">
        {/* 기본 클릭 버튼: .ics 다운로드 트리거 */}
        <button
          type="button"
          onClick={handleIcsDownload}
          title={buttonTitle}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            isNextCycle
              ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/80'
              : 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80 dark:border dark:border-slate-700'
          } ${!hideDropdown ? 'rounded-r-none' : ''} ${className}`}
        >
          <CalendarPlus className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">{buttonLabel}</span>
        </button>

        {/* 옵션 토글 화살표 버튼 (구글 캘린더 연동 옵션) */}
        {!hideDropdown && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsMenuOpen((prev) => !prev);
            }}
            title="캘린더 저장 방식 선택"
            className={`px-1.5 py-1.5 rounded-r-lg border-l transition-colors ${
              isNextCycle
                ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/80'
                : 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80 border-blue-200/80 dark:border-slate-700'
            }`}
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* 옵션 드롭다운 메뉴 */}
      {isMenuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
        >
          {isNextCycle && (
            <div className="px-3 py-1.5 mb-1 bg-amber-50/80 dark:bg-amber-950/50 border-b border-amber-100 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
              🔔 차기 {cycleLabel} 모집 ({effectivePeriod.startDate}~)
            </div>
          )}

          <button
            type="button"
            onClick={handleIcsDownload}
            className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
          >
            <span className="font-medium">기본 캘린더 (.ics)</span>
            <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              iOS/삼성
            </span>
          </button>

          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
          >
            <span className="font-medium">Google 캘린더에 추가</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      )}

      {/* 완료 토스트 알림 */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs sm:text-sm font-semibold shadow-2xl border border-slate-700/60 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
