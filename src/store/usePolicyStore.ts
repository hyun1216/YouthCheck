import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Policy, PolicyCategory, EmploymentType, MainTabType } from '@/types/policy';

interface PolicyState {
  // Filter states
  age: number;
  region: string;
  maxIncome: number | null; // null: 무관, 3600, 5000, 7500
  employment: EmploymentType;
  category: PolicyCategory | 'ALL';
  searchQuery: string;
  onlyEligible: boolean;
  onlyBookmarked: boolean;
  viewMode: 'cards' | 'timeline';

  // Main Level Tab: POLICIES | TIPS | NEWS
  activeMainTab: MainTabType;
  setActiveMainTab: (tab: MainTabType) => void;

  // UX & UI control states
  isOnboardingOpen: boolean;
  isFilterBarExpanded: boolean;
  hasCompletedOnboarding: boolean;

  // Modal detail
  selectedPolicy: Policy | null;

  // Bookmarks
  bookmarkedIds: string[];

  // Actions
  setAge: (age: number) => void;
  setRegion: (region: string) => void;
  setMaxIncome: (income: number | null) => void;
  setEmployment: (employment: EmploymentType) => void;
  setCategory: (category: PolicyCategory | 'ALL') => void;
  setSearchQuery: (query: string) => void;
  setOnlyEligible: (only: boolean) => void;
  setOnlyBookmarked: (only: boolean) => void;
  setViewMode: (mode: 'cards' | 'timeline') => void;
  setSelectedPolicy: (policy: Policy | null) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setIsFilterBarExpanded: (expanded: boolean | ((prev: boolean) => boolean)) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  setUserProfile: (profile: {
    age: number;
    maxIncome: number | null;
    employment: EmploymentType;
    region?: string;
  }) => void;
  toggleBookmark: (policyId: string) => void;
  isBookmarked: (policyId: string) => boolean;
  resetFilters: () => void;
  applyPreset: (preset: 'SME_WORKER' | 'FIRST_JOB' | 'JOB_SEEKER' | 'SAVINGS_FOCUS') => void;
}

const DEFAULT_FILTERS = {
  age: 28,
  region: '전국',
  maxIncome: null,
  employment: 'ALL' as EmploymentType,
  category: 'ALL' as PolicyCategory | 'ALL',
  searchQuery: '',
  onlyEligible: false,
  onlyBookmarked: false,
  viewMode: 'cards' as const,
  activeMainTab: 'POLICIES' as MainTabType,
  isFilterBarExpanded: false,
  isOnboardingOpen: false,
  hasCompletedOnboarding: false,
};

export const usePolicyStore = create<PolicyState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_FILTERS,
      selectedPolicy: null,
      bookmarkedIds: [],

      setActiveMainTab: (activeMainTab) => set({ activeMainTab }),
      setAge: (age) => set({ age }),
      setRegion: (region) => set({ region }),
      setMaxIncome: (maxIncome) => set({ maxIncome }),
      setEmployment: (employment) => set({ employment }),
      setCategory: (category) => set({ category }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setOnlyEligible: (onlyEligible) => set({ onlyEligible }),
      setOnlyBookmarked: (onlyBookmarked) => set({ onlyBookmarked }),
      setViewMode: (viewMode) => set({ viewMode }),
      setSelectedPolicy: (selectedPolicy) => set({ selectedPolicy }),
      setIsOnboardingOpen: (isOnboardingOpen) => set({ isOnboardingOpen }),
      setIsFilterBarExpanded: (action) =>
        set((state) => ({
          isFilterBarExpanded:
            typeof action === 'function' ? action(state.isFilterBarExpanded) : action,
        })),
      setHasCompletedOnboarding: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),

      setUserProfile: (profile) => {
        set({
          age: profile.age,
          maxIncome: profile.maxIncome,
          employment: profile.employment,
          region: profile.region || '전국',
          onlyEligible: true,
          hasCompletedOnboarding: true,
          isOnboardingOpen: false,
        });
      },

      toggleBookmark: (policyId) => {
        const { bookmarkedIds } = get();
        if (bookmarkedIds.includes(policyId)) {
          set({ bookmarkedIds: bookmarkedIds.filter((id) => id !== policyId) });
        } else {
          set({ bookmarkedIds: [...bookmarkedIds, policyId] });
        }
      },

      isBookmarked: (policyId) => {
        return get().bookmarkedIds.includes(policyId);
      },

      resetFilters: () => {
        set({
          ...DEFAULT_FILTERS,
          selectedPolicy: null,
        });
      },

      applyPreset: (preset) => {
        switch (preset) {
          case 'SME_WORKER':
            set({
              age: 28,
              region: '전국',
              employment: 'SME',
              maxIncome: 5000,
              onlyEligible: true,
              hasCompletedOnboarding: true,
            });
            break;
          case 'FIRST_JOB':
            set({
              age: 26,
              region: '전국',
              employment: 'SME',
              maxIncome: 3600,
              onlyEligible: true,
              hasCompletedOnboarding: true,
            });
            break;
          case 'JOB_SEEKER':
            set({
              age: 25,
              region: '전국',
              employment: 'UNEMPLOYED',
              maxIncome: null,
              category: 'CAREER',
              onlyEligible: true,
              hasCompletedOnboarding: true,
            });
            break;
          case 'SAVINGS_FOCUS':
            set({
              age: 29,
              region: '전국',
              maxIncome: 7500,
              category: 'FINANCE',
              onlyEligible: true,
              hasCompletedOnboarding: true,
            });
            break;
        }
      },
    }),
    {
      name: 'youthcheck-storage-v1',
      storage: createJSONStorage(() => localStorage),
      // We persist bookmarks, condition profile, and onboarding completion
      partialize: (state) => ({
        bookmarkedIds: state.bookmarkedIds,
        age: state.age,
        region: state.region,
        maxIncome: state.maxIncome,
        employment: state.employment,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);
