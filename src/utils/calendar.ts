/**
 * 캘린더 등록 및 .ics 파일 다운로드 유틸리티
 * RFC 5545 표준 iCalendar 포맷 지원
 */

export interface CalendarEventParams {
  title: string;
  description?: string;
  startDate?: string; // 'YYYY-MM-DD'
  endDate?: string;   // 'YYYY-MM-DD'
  url?: string;
  isAlways?: boolean; // 상시 접수 여부
}

/**
 * Date 객체를 'YYYYMMDD' 문자열로 변환 (종일 일정용)
 */
const formatDateToYYYYMMDD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
};

/**
 * 'YYYY-MM-DD' 문자열을 'YYYYMMDD' 형식으로 정규화
 */
const normalizeDateStr = (dateStr: string): string => {
  return dateStr.replace(/\D/g, '').slice(0, 8);
};

/**
 * iCalendar 종일 일정의 종료일(DTEND) 계산 (종료일 + 1일, Exclusive)
 */
const calculateExclusiveEndDate = (endDateStr: string): string => {
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
 * 일정 시작일과 종료일 계산 (상시 접수 정책 대응)
 */
const resolveDatesAndDescription = (params: CalendarEventParams, baseDate?: Date) => {
  const isAlways = params.isAlways || (!params.startDate && !params.endDate);
  const today = baseDate || (typeof window !== 'undefined' ? new Date() : STABLE_DEFAULT_DATE);
  const todayStr = formatDateToYYYYMMDD(today);

  let dtStart = todayStr;
  let dtEnd = calculateExclusiveEndDate(todayStr);
  let notePrefix = '';

  if (isAlways) {
    notePrefix = '[상시 접수] 상시 접수 가능한 정책입니다.\n';
  } else {
    if (params.startDate) {
      dtStart = normalizeDateStr(params.startDate);
    }
    if (params.endDate) {
      dtEnd = calculateExclusiveEndDate(params.endDate);
    } else {
      dtEnd = calculateExclusiveEndDate(params.startDate || todayStr);
    }
  }

  const rawDescription = `${notePrefix}${params.description || ''}${
    params.url ? `\n\n공식 신청 페이지: ${params.url}` : ''
  }\n\n출처: 청년체크 (YouthCheck)`.trim();

  return {
    dtStart,
    dtEnd,
    fullDescription: rawDescription,
  };
};

/**
 * 함수 A: RFC 5545 표준 .ics(iCalendar) 파일 생성 및 브라우저 다운로드 트리거
 * 모바일(iOS Safari/삼성 캘린더) 및 PC 지원
 */
export const downloadIcsFile = (params: CalendarEventParams): void => {
  const { title, url } = params;
  const { dtStart, dtEnd, fullDescription } = resolveDatesAndDescription(params);

  const now = new Date();
  const dtStamp = `${formatDateToYYYYMMDD(now)}T${String(now.getUTCHours()).padStart(2, '0')}${String(
    now.getUTCMinutes()
  ).padStart(2, '0')}${String(now.getUTCSeconds()).padStart(2, '0')}Z`;

  const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@youthcheck.kr`;
  const summaryText = escapeIcsText(`[청년체크] ${title}`);
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
  a.download = `[청년체크]_${sanitizeFileName(title)}_일정.ics`;

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
  const { title, url } = params;
  const { dtStart, dtEnd, fullDescription } = resolveDatesAndDescription(params);

  const baseUrl = 'https://calendar.google.com/calendar/render';
  const queryParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: `[청년체크] ${title}`,
    dates: `${dtStart}/${dtEnd}`,
    details: fullDescription,
    sprop: url ? `website:${url}` : 'website:youthcheck.kr',
  });

  return `${baseUrl}?${queryParams.toString()}`;
};
