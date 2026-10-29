'use client';

import React, { useState } from 'react';
import { ContentItem } from '@/types/policy';
import {
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Award,
  ChevronDown,
  ChevronUp,
  Building2,
} from 'lucide-react';

interface TipCardProps {
  item: ContentItem;
}

export const TipCard: React.FC<TipCardProps> = ({ item }) => {
  const [copied, setCopied] = useState(false);
  const [showSnippet, setShowSnippet] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Featured Hero Card (직무능력은행 안내 - 톤앤매너에 맞춘 깔끔하고 신뢰감 있는 디자인)
  if (item.isFeatured) {
    return (
      <div className="rounded-3xl border border-blue-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-800/60 dark:via-slate-900 dark:to-slate-900 p-5 sm:p-7 shadow-xs mb-6 transition-all">
        {/* Top Badges */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 dark:bg-slate-700 text-white shadow-xs dark:shadow-none">
            <Award className="w-3.5 h-3.5" />
            <span>{item.badge || '핵심 취업 치트키'}</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
            {item.categoryTag}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>{item.readTimeMinutes}분 완독</span>
          </span>
        </div>

        {/* Main Title & Description */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
          {item.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-4">
          {item.description}
        </p>

        {/* 3 Bullet Points (30초 핵심 요약 박스) */}
        {item.keyPoints && item.keyPoints.length > 0 && (
          <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              <FileCheck className="w-4 h-4 text-blue-600 dark:text-sky-300" />
              <span>30초 핵심 요약</span>
            </div>
            {item.keyPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-sky-200 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="font-medium leading-snug">{point}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {item.tags && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <a
            href={item.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-700/85 dark:hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-xs dark:shadow-none transition-colors"
          >
            <span>{item.linkText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {item.templateSnippet && (
            <button
              type="button"
              onClick={() => handleCopy(item.templateSnippet!)}
              className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors border ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? '작성 가이드 복사 완료!' : '직무 이력서 작성 가이드 복사'}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Standard Tip & Career Card
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-slate-600 transition-all">
      <div>
        {/* Top Meta */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.8 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-sky-300 border border-blue-200/60 dark:border-slate-700">
              {item.categoryTag}
            </span>
            {item.badge && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {item.badge}
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{item.readTimeMinutes}분 완독</span>
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2">
          {item.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* 30초 핵심 요약 (TL;DR Box) */}
        {item.keyPoints && item.keyPoints.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>핵심 포인트</span>
            </div>
            {item.keyPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="text-blue-600 dark:text-sky-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-snug">{point}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Snippet Preview (if available) */}
        {item.templateSnippet && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowSnippet(!showSnippet)}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-sky-300 hover:underline mb-2"
            >
              <span>{showSnippet ? '양식 템플릿 접기' : '양식 템플릿 미리보기'}</span>
              {showSnippet ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showSnippet && (
              <div className="relative p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => handleCopy(item.templateSnippet!)}
                  className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-white flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? '복사됨' : '복사'}</span>
                </button>
                {item.templateSnippet}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400">{item.date}</span>

        <div className="flex items-center gap-2">
          {item.templateSnippet && (
            <button
              type="button"
              onClick={() => handleCopy(item.templateSnippet!)}
              className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
                copied
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800'
                  : 'text-slate-600 border-slate-200 hover:bg-slate-100 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'
              }`}
              title="템플릿 복사"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          {item.linkUrl ? (
            <a
              href={item.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-blue-600 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white transition-all shadow-xs dark:shadow-none"
            >
              <span>{item.linkText ? item.linkText.replace(' ↗', '') : '바로가기'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{item.linkText || '본인 가입 은행 앱에서 확인'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
