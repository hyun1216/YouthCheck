import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://youthcheck.kr');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    type: 'website',
    locale: 'ko_KR',
    siteName: '청년체크 (YouthCheck)',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
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
  verification: {
    google: 'dKupR7ufP6HfZnlTF7pKVVuWFmxOii2Qe4uXLzEdl3g',
    other: {
      'naver-site-verification': '334c79de8f592f8f8fd19d1f0ccb1ca85d34ed25',
    },
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="dKupR7ufP6HfZnlTF7pKVVuWFmxOii2Qe4uXLzEdl3g" />
        <meta name="naver-site-verification" content="334c79de8f592f8f8fd19d1f0ccb1ca85d34ed25" />
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
