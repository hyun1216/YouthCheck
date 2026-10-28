import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://youthcheck.kr'
  ),
  title: '청년체크 (YouthCheck) - 직장인 알짜 청년 정책 3초 체크',
  description:
    '광고 없이, 직장인도 받을 수 있는 알짜 청년 정책만 3초 만에 체크. 청년도약계좌, 중소기업 소득세 감면, 청년청약통장 등 공식 정부 신청 페이지 다이렉트 연결.',
  keywords: [
    '청년정책',
    '청년도약계좌',
    '중소기업소득세감면',
    '청년주택드림청약',
    '청년월세지원',
    'K패스',
    '직장인청년지원',
    '청년체크',
    'YouthCheck',
  ],
  authors: [{ name: 'YouthCheck Team' }],
  openGraph: {
    title: '청년체크 (YouthCheck) - 직장인 알짜 청년 정책 3초 체크',
    description: '광고 없이, 직장인도 받을 수 있는 알짜 청년 정책만 3초 만에 체크!',
    type: 'website',
    locale: 'ko_KR',
    siteName: '청년체크 (YouthCheck)',
    images: [
      {
        url: '/og-image.png',
        width: 1731,
        height: 909,
        alt: '청년체크 (YouthCheck) - 광고 없는 직장인 알짜 청년 정책 포털',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '청년체크 (YouthCheck) - 직장인 알짜 청년 정책 3초 체크',
    description: '광고 없이, 직장인도 받을 수 있는 알짜 청년 정책만 3초 만에 체크!',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
