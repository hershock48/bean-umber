import { Logo } from '@/components/Logo';
import Link from 'next/link';
import Image from 'next/image';

export default function Founder() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-8 w-8 text-gray-900" />
              <span className="text-xl font-semibold text-gray-900">Be A Number</span>
            </Link>
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Text-Only Hero */}
          <div className="mb-12 text-center border-b border-gray-200 pb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Kevin C. Hershock</h1>
            <p className="text-2xl text-gray-600">Founder & Executive Director</p>
            <p className="text-lg text-gray-500 mt-2">Be A Number, International</p>
          </div>

          {/* Portrait Image - Constrained Size Below Headline */}
          <div className="mb-12 w-full flex justify-center">
            <div className="relative w-full max-w-xs aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src="/images/founder/hero-sewing-classroom.jpg"
                alt="Kevin Hershock with community elder in Northern Uganda"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 320px"
              />
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Kevin Hershock is a founder-led social entrepreneur with over 15 years of cross-cultural development experience focused on post-conflict community recovery in East Africa.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              He founded Be A Number in 2010 while at Hillsdale College as a social enterprise modeled on product-linked impact, generating national media attention and multi-city deployment of community programs across the United States and internationally.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Kevin's early field work included service in Detroit homeless shelters, Pine Ridge Indian Reservation, the Dominican Republic, Eastern Europe, and extended residence in Uganda shortly after the civil war, where he established long-term community relationships and local leadership partnerships.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              In Uganda, he launched and operated a women-led bakery employing formerly exploited women, sustained over five years, and designed multiple economic empowerment models for women and families including entrepreneurship training and micro-finance initiatives.
            </p>

            {/* Secondary Image - Mid-page */}
            <div className="my-12 w-full max-w-2xl mx-auto">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/founder/secondary-woman-sewing.jpg"
                  alt="Kevin Hershock with seated mother and child in Northern Uganda"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              He later pivoted from individual interventions to a community-systems model, partnering directly with Acholi leadership on Acholi land in Northern Uganda. Through a co-founding partnership with Youth Development Organization (YDO), he secured six acres for integrated community development and directed the construction of core infrastructure including:
            </p>

            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
              <li>Medical center (completed, operational)</li>
              <li>Nursery & primary school (95% complete, 380-student capacity)</li>
              <li>Vocational training facilities</li>
              <li>3-bedroom international lodge and 3 dormitories</li>
              <li>Local workforce of 30 community members</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-6">
              Under Kevin's leadership, Be A Number delivered the following 2025 impact:
            </p>

            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
              <li>60 women completed vocational training</li>
              <li>8 men completed construction training</li>
              <li>700+ individuals served medically</li>
              <li>60+ youth engaged in sports & wellness programs</li>
              <li>15 children supported through education sponsorship</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-6">
              Kevin established international university partnerships, hosting senior administrators from Worcester University (UK) and scheduling four UK student cohorts for 2026.
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              In 2025, the organization raised and deployed $79,623 with 96.7% program efficiency while transitioning from pilot to scalable platform.
            </p>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
              <p className="text-gray-700">Hillsdale College — Bachelor's Degree, 2010</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-50 border-t border-gray-200 mt-24">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 Be A Number, International. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
