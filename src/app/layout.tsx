import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.beanumber.org'),
  title: {
    default: "Be A Number, International | Rebuilding Post-War Societies",
    template: "%s | Be A Number, International"
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
  description: "Be A Number partners with local leadership in Northern Uganda to build sustainable community systems — healthcare, education, workforce development, and economic infrastructure that transform communities from survival to long-term stability.",
  keywords: ["nonprofit", "Northern Uganda", "community development", "post-conflict recovery", "sustainable development", "501c3", "international development", "healthcare", "education", "workforce development"],
  authors: [{ name: "Be A Number, International" }],
  creator: "Be A Number, International",
  publisher: "Be A Number, International",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.beanumber.org",
    siteName: "Be A Number, International",
    title: "Be A Number, International | Rebuilding Post-War Societies",
    description: "Be A Number partners with local leadership in Northern Uganda to build sustainable community systems — healthcare, education, workforce development, and economic infrastructure that transform communities from survival to long-term stability.",
    images: [
      {
        url: "/images/homepage/hero-community-group.jpg",
        width: 1200,
        height: 630,
        alt: "Community group in Northern Uganda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Be A Number, International | Rebuilding Post-War Societies",
    description: "Be A Number partners with local leadership in Northern Uganda to build sustainable community systems.",
    images: ["/images/homepage/hero-community-group.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification if you have it
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
