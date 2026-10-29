/**
 * 캘린더 등록 및 .ics 파일 다운로드 유틸리티
 * RFC 5545 표준 iCalendar 포맷 지원
 */

import { Policy } from '@/types/policy';

export interface CalendarEventParams {
  title: string;
  description?: string;
  startDate?: string; // 'YYYY-MM-DD'
  endDate?: string;   // 'YYYY-MM-DD'
  url?: string;
  isAlways?: boolean; // 상시 접수 여부
  isNextCycle?: boolean; // 차기 일정 자동 계산 여부
  cycleLabel?: string;  // '분기별', '반기별', '매년 12월' 등
}

export interface CalculatedPeriod {
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;   // 'YYYY-MM-DD'
  isNextCycle: boolean;
  cycleLabel?: string;
}

/**
 * Date 객체를 'YYYYMMDD' 문자열로 변환 (종일 일정용)
 */
export const formatDateToYYYYMMDD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
};

/**
 * Date 객체를 'YYYY-MM-DD' 문자열로 변환
 */
export const formatToHyphenDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/**
 * 'YYYY-MM-DD' 문자열을 'YYYYMMDD' 형식으로 정규화
 */
export const normalizeDateStr = (dateStr: string): string => {
  return dateStr.replace(/\D/g, '').slice(0, 8);
};

/**
 * iCalendar 종일 일정의 종료일(DTEND) 계산 (종료일 + 1일, Exclusive)
 */
export const calculateExclusiveEndDate = (endDateStr: string): string => {
  const cleaned = normalizeDateStr(endDateStr);
  if (cleaned.length !== 8) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return formatDateToYYYYMMDD(today);
  }

  const y = parseInt(cleaned.slice(0, 4), 10);
  const m = parseInt(cleaned.slice(4, 6), 10) - 1;
  const d = parseInt(cleaned.slice(6, 8), 10);

  const targetDate = new Date(y, m, d);
  targetDate.setDate(targetDate.getDate() + 1);

  return formatDateToYYYYMMDD(targetDate);
};

/**
 * 파일 이름에서 불필요한 특수문자 제거
 */
const sanitizeFileName = (name: string): string => {
  return name.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim();
};

/**
 * RFC 5545 텍스트 이스케이프 처리
 */
const escapeIcsText = (text: string): string => {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
};

const STABLE_DEFAULT_DATE = new Date('2026-11-01T00:00:00Z');

/**
 * 정책의 유효 신청 기간 계산 (마감 시 차기 일정 자동 계산)
 * - 상시 신청(ALWAYS)인 경우: null 반환 (캘린더 추가 제외)
 * - 이미 마감된 경우: recurrenceCycle(분기별, 반기별, 매년 12월 등)에 따라 다음 신청일 자동 계산
 */
export const getEffectiveApplicationPeriod = (
  policy: Policy,
  baseDate?: Date
): CalculatedPeriod | null => {
  // 1. 상시 신청 정책은 캘린더 등록 대상에서 제외
  if (policy.applicationType === 'ALWAYS') {
    return null;
  }

  const startStr = policy.applicationPeriod?.startDate || policy.startDate;
  const endStr = policy.applicationPeriod?.endDate || policy.endDate;

  if (!endStr) {
    return null;
  }

  const today = baseDate || (typeof window !== 'undefined' ? new Date() : STABLE_DEFAULT_DATE);
  const nowTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  // 기존 종료일 파싱
  const endParts = endStr.split('-').map(Number);
  const currentEnd = new Date(endParts[0], endParts[1] - 1, endParts[2]).getTime();

  // 아직 신청 기간이 남아있거나 진행/오픈예정인 경우
  if (currentEnd >= nowTime) {
    return {
      startDate: startStr || endStr,
      endDate: endStr,
      isNextCycle: false,
    };
  }

  // 2. 이미 신청이 마감된 경우 (currentEnd < nowTime)
  // 재모집 주기(recurrenceCycle)가 없으면 캘린더 등록 대상 제외
  if (!policy.recurrenceCycle) {
    return null;
  }

  // 기존 기간(일수) 계산
  let durationMs = 14 * 24 * 60 * 60 * 1000; // 기본 14일
  let startObj = new Date(endParts[0], endParts[1] - 1, endParts[2]);
  if (startStr) {
    const sParts = startStr.split('-').map(Number);
    startObj = new Date(sParts[0], sParts[1] - 1, sParts[2]);
    const endObj = new Date(endParts[0], endParts[1] - 1, endParts[2]);
    durationMs = Math.max(0, endObj.getTime() - startObj.getTime());
  }

  const nextStart = new Date(startObj);
  let nextEnd = new Date(nextStart.getTime() + durationMs);
  let cycleLabel = '정기';

  switch (policy.recurrenceCycle) {
    case 'MONTHLY': {
      cycleLabel = '매월';
      while (nextEnd.getTime() < nowTime) {
        nextStart.setMonth(nextStart.getMonth() + 1);
        nextEnd = new Date(nextStart.getTime() + durationMs);
      }
      break;
    }
    case 'QUARTERLY': {
      cycleLabel = '분기별';
      while (nextEnd.getTime() < nowTime) {
        nextStart.setMonth(nextStart.getMonth() + 3);
        nextEnd = new Date(nextStart.getTime() + durationMs);
      }
      break;
    }
    case 'BIANNUAL': {
      cycleLabel = '반기별';
      while (nextEnd.getTime() < nowTime) {
        nextStart.setMonth(nextStart.getMonth() + 6);
        nextEnd = new Date(nextStart.getTime() + durationMs);
      }
      break;
    }
    case 'YEARLY': {
      cycleLabel = '매년';
      while (nextEnd.getTime() < nowTime) {
        nextStart.setFullYear(nextStart.getFullYear() + 1);
        nextEnd = new Date(nextStart.getTime() + durationMs);
      }
      break;
    }
    case 'EVERY_DECEMBER': {
      cycleLabel = '매년 12월';
      let targetYear = today.getFullYear();
      let s = new Date(targetYear, 11, 1);
      let e = new Date(targetYear, 11, 31);
      if (e.getTime() < nowTime) {
        targetYear += 1;
        s = new Date(targetYear, 11, 1);
        e = new Date(targetYear, 11, 31);
      }
      nextStart.setTime(s.getTime());
      nextEnd = e;
      break;
    }
  }

  return {
    startDate: formatToHyphenDate(nextStart),
    endDate: formatToHyphenDate(nextEnd),
    isNextCycle: true,
    cycleLabel,
  };
};

/**
 * 일정 시작일과 종료일 계산
 */
const resolveDatesAndDescription = (params: CalendarEventParams, baseDate?: Date) => {
  const isAlways = params.isAlways || (!params.startDate && !params.endDate);
  const today = baseDate || (typeof window !== 'undefined' ? new Date() : STABLE_DEFAULT_DATE);
  const todayStr = formatDateToYYYYMMDD(today);

  let dtStart = todayStr;
  let dtEnd = calculateExclusiveEndDate(todayStr);
  let notePrefix = '';

  if (params.isNextCycle) {
    notePrefix = `[차기 일정 안내] 이전 차수 모집이 마감되어 다음 차수(${params.cycleLabel || '정기'} 모집: ${params.startDate} ~ ${params.endDate}) 일정으로 자동 설정되었습니다.\n\n`;
  } else if (isAlways) {
    notePrefix = '[상시 접수] 상시 접수 가능한 정책입니다.\n\n';
  }

  if (params.startDate) {
    dtStart = normalizeDateStr(params.startDate);
  }
  if (params.endDate) {
    dtEnd = calculateExclusiveEndDate(params.endDate);
  } else {
    dtEnd = calculateExclusiveEndDate(params.startDate || todayStr);
  }

  const rawDescription = `${notePrefix}${params.description || ''}${
    params.url ? `\n\n공식 신청 페이지: ${params.url}` : ''
  }\n\n출처: 청년체크 (YouthCheck)`.trim();

  const displayTitle = params.isNextCycle
    ? `[차기 ${params.cycleLabel || '정기'}모집] ${params.title}`
    : params.title;

  return {
    dtStart,
    dtEnd,
    displayTitle,
    fullDescription: rawDescription,
  };
};

/**
 * 함수 A: RFC 5545 표준 .ics(iCalendar) 파일 생성 및 브라우저 다운로드 트리거
 * 모바일(iOS Safari/삼성 캘린더) 및 PC 지원
 */
export const downloadIcsFile = (params: CalendarEventParams): void => {
  const { url } = params;
  const { dtStart, dtEnd, displayTitle, fullDescription } = resolveDatesAndDescription(params);

  const now = new Date();
  const dtStamp = `${formatDateToYYYYMMDD(now)}T${String(now.getUTCHours()).padStart(2, '0')}${String(
    now.getUTCMinutes()
  ).padStart(2, '0')}${String(now.getUTCSeconds()).padStart(2, '0')}Z`;

  const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@youthcheck.kr`;
  const summaryText = escapeIcsText(`[청년체크] ${displayTitle}`);
  const descriptionText = escapeIcsText(fullDescription);

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//YouthCheck//KR//KO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `SUMMARY:${summaryText}`,
    `DESCRIPTION:${descriptionText}`,
    url ? `URL:${url}` : '',
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  const icsContent = icsLines.join('\r\n');

  // UTF-8 인코딩의 Blob 객체 생성 (모바일 Safari/크롬에서 캘린더 앱 연동 인식)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `[청년체크]_${sanitizeFileName(displayTitle)}_일정.ics`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => {
    window.URL.revokeObjectURL(downloadUrl);
  }, 1000);
};

/**
 * 함수 B: 구글 캘린더 웹 인텐트 등록 URL 생성
 * 브라우저 환경에서 새 탭으로 구글 캘린더 등록 지원
 */
export const getGoogleCalendarUrl = (params: CalendarEventParams): string => {
  const { url } = params;
  const { dtStart, dtEnd, displayTitle, fullDescription } = resolveDatesAndDescription(params);

  const baseUrl = 'https://calendar.google.com/calendar/render';
  const queryParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: `[청년체크] ${displayTitle}`,
    dates: `${dtStart}/${dtEnd}`,
    details: fullDescription,
    sprop: url ? `website:${url}` : 'website:youthcheck.kr',
  });

  return `${baseUrl}?${queryParams.toString()}`;
};
