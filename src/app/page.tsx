import { Logo } from '@/components/Logo';
import { CountUpNumber } from '@/components/CountUpNumber';
import { StickyDonateButton } from '@/components/StickyDonateButton';
import { DonationSection } from '@/components/DonationSection';
import Image from 'next/image';
import type { Metadata } from 'next';
import { HomePageContent } from './HomePageContent';

export const metadata: Metadata = {
  title: "Be A Number, International | Rebuilding Post-War Societies",
  description: "Be A Number partners with local leadership in Northern Uganda to build sustainable community systems. In 2025, we reached 700+ patients, 60 women, and 15 students. Our goal: reach 20,000+ lives within five years.",
  openGraph: {
    title: "Be A Number, International | Rebuilding Post-War Societies",
    description: "Be A Number partners with local leadership in Northern Uganda to build sustainable community systems — healthcare, education, workforce development, and economic infrastructure.",
    images: ["/images/homepage/hero-community-group.jpg"],
  },
};

export default function Home() {
  return <HomePageContent />;
}
