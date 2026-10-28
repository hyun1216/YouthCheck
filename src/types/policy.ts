export type PolicyCategory = 'FINANCE' | 'HOUSING' | 'TAX' | 'CAREER';

export type EmploymentType = 'SME' | 'GENERAL_CORP' | 'UNEMPLOYED' | 'FREELANCER' | 'ALL';

export type MainTabType = 'POLICIES' | 'TIPS' | 'NEWS';

export interface Policy {
  id: string;
  // 직관적 노출을 위한 핵심 필드
  eligibilitySummary: string; // 직관적인 핵심 자격 1줄 (예: "만 19~34세 + 연봉 7,500만 원 이하 직장인")
  benefitSummary: string;     // 직관적인 혜택 1줄 (예: "5년간 최대 5,000만 원 목돈 마련 + 정부기여금 & 비과세")
  officialName: string;       // 공식 행정 정책명 (예: "청년도약계좌")
  criticalBadge?: string;     // 결정적 자격 조건 강조 뱃지 (예: "중소기업 재직 필수", "무주택 세대주", "미취업 구직자")
  benefitHighlight?: string;  // 역발상 혜택 하이라이트 문구
  isDeadlineImminent?: boolean;

  // 기존 호환 필드
  title?: string;             // fallback for title (officialName과 동일)
  subTitle?: string;          // 보조 요약

  category: PolicyCategory;
  region: string[];           // ['전국'] 또는 ['서울', '경기'] 등
  ageRange: {
    min: number;
    max: number;
  };
  maxAnnualIncome: number | null; // 단위: 만원 (null은 소득 무관)
  employmentCondition: EmploymentType[];
  
  // 일정 관련
  applicationType: 'ALWAYS' | 'PERIOD'; // 상시 or 기간 모집
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  
  // 상세 안내 (아코디언/모달에서만 노출)
  eligibilityChecklist: string[]; // ["만 19~34세 이하", "연봉 5,000만 원 이하", "무주택자"]
  requiredDocuments: string[]; // ["소득금액증명원", "주민등록등본"]
  officialUrl: string; // 공식 신청 사이트 URL (복지로, 마이홈, 신한은행 등)
  
  // 추가 메타데이터
  hostingAgency: string; // 주관 기관 (예: 서민금융진흥원, 국토교통부, 국세청 등)
  tags: string[]; // ['#비과세', '#소득공제', '#목돈마련']
}

// 꿀팁 및 소식용 데이터 타입
export type TipSubCategory = '전체' | '이력서' | '이직&취직' | '재테크' | '부업' | '노동관련법규';

export interface ContentItem {
  id: string;
  tab: 'TIPS' | 'NEWS';
  subCategory?: '이력서' | '이직&취직' | '재테크' | '부업' | '노동관련법규'; // 중분류 카테고리
  categoryTag: string; // 예: "이력서/취업", "자격/훈련", "정책발표", "경력정리"
  title: string;
  description: string;
  isFeatured?: boolean; // 상단 강조 여부
  badge?: string; // "필독", "HOT", "NEW", "추천"
  date: string; // YYYY-MM-DD
  linkUrl?: string;
  linkText?: string;
  keyPoints?: string[]; // 3줄 핵심 요약
  readTimeMinutes?: number; // 읽는 데 걸리는 시간 (예: 2분)
  tags?: string[]; // ['#이력서', '#경력정리', '#국비지원', '#포트폴리오']
  templateSnippet?: string; // 클립보드 복사용 가이드/서식 텍스트
}

export interface UserFilterState {
  age: number;
  region: string;
  maxIncome: number | null; // null for 무관, or 3600, 5000, 7500
  employment: EmploymentType;
  category: PolicyCategory | 'ALL';
  searchQuery: string;
  onlyEligible: boolean;
  onlyBookmarked: boolean;
  viewMode: 'cards' | 'timeline';
}
