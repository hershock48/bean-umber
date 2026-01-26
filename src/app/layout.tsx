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
  alternates: {
    canonical: 'https://www.beanumber.org',
  },
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
    // TODO: Kevin - Add Google Search Console verification code here
    // google: "your-verification-code",
  },
};

// Schema.org structured data for Organization/NGO
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Be A Number, International',
  alternateName: 'Be A Number',
  url: 'https://www.beanumber.org',
  logo: 'https://www.beanumber.org/icon.svg',
  description: 'Be A Number partners with local leadership in Northern Uganda to build sustainable community systems — healthcare, education, workforce development, and economic infrastructure.',
  foundingDate: '2022',
  founder: {
    '@type': 'Person',
    name: 'Kevin Hershock',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '8475 18 1/2 Mile Road',
    addressLocality: 'Marshall',
    addressRegion: 'MI',
    postalCode: '49068',
    addressCountry: 'US',
  },
  email: 'Kevin@beanumber.org',
  nonprofitStatus: '501(c)(3)',
  taxID: '93-1948872',
  areaServed: {
    '@type': 'Place',
    name: 'Northern Uganda',
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
