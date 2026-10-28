import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-10 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">청년체크 (YouthCheck)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-bold">
                공식 데이터 기반
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              광고 없이, 직장인도 받을 수 있는 알짜 청년 정책만 3초 만에 체크
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <span className="text-slate-400">공식 연계 출처:</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200">서민금융진흥원</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200">주택도시기금</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200">국세청 홈택스</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200">보건복지부 복지로</span>
            <span className="hover:text-slate-800 dark:hover:text-slate-200">국토교통부</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>
              청년체크는 영리 목적의 사설 블로그나 광고 유입 링크를 일절 제공하지 않으며, 대한민국 정부 및 공공기관의 공식 고시 데이터만을 기준으로 안내합니다.
            </span>
          </div>
          <div>© 2026 청년체크 (YouthCheck). All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};
