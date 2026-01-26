import { Logo } from '@/components/Logo';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us",
  description: "Be A Number is a 501(c)(3) nonprofit rebuilding communities in Northern Uganda through integrated systems — healthcare, education, workforce development, and local economic infrastructure.",
  openGraph: {
    title: "About Us | Be A Number, International",
    description: "Learn about our mission, our approach, and the team behind Be A Number's work in Northern Uganda.",
    images: ["/images/homepage/hero-community-group.jpg"],
  },
};

export default function About() {
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
            <div className="hidden md:flex items-center gap-8">
              <Link href="/about" className="text-gray-900 font-medium">
                About
              </Link>
              <Link href="/impact" className="text-gray-700 hover:text-gray-900 transition-colors">
                Impact
              </Link>
              <Link href="/partnerships" className="text-gray-700 hover:text-gray-900 transition-colors">
                Partnerships
              </Link>
              <Link
                href="/#donate"
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Donate
              </Link>
            </div>
            <Link href="/" className="md:hidden text-gray-700 hover:text-gray-900 transition-colors text-sm">
              ← Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            About Be A Number
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl leading-relaxed">
            We're a 501(c)(3) nonprofit rebuilding communities in Northern Uganda through integrated, locally-owned systems. Our goal: lasting transformation, not temporary relief.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Be A Number began in 2010 when founder Kevin Hershock was a college student who refused to accept that communities recovering from war had to depend on outside charity forever.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                After years of direct experience in Northern Uganda — living in villages, building relationships with local leaders, running a women's bakery for five years — he recognized a fundamental problem: traditional aid creates dependency. Programs end when funding ends. Communities wait for outsiders instead of building their own future.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                So we built something different. Working with local partners, we developed integrated community systems — healthcare, education, vocational training, and economic infrastructure — designed to sustain themselves through earned income and local ownership.
              </p>
              <Link 
                href="/founder" 
                className="text-gray-900 font-medium hover:underline inline-flex items-center gap-2"
              >
                Meet our founder
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/homepage/hero-community-group.jpg"
                  alt="Community group in Northern Uganda"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Approach</h2>
          <p className="text-gray-700 mb-12 max-w-3xl leading-relaxed">
            We don't just fund projects — we build systems that communities own and operate. The difference matters.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-red-500 text-2xl">✗</span>
                Traditional Aid
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>Programs designed by outsiders</li>
                <li>Ends when funding runs out</li>
                <li>Creates dependency on donations</li>
                <li>Local leaders sidelined</li>
                <li>Focus on outputs (what we did)</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg border-2 border-gray-900">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-green-600 text-2xl">✓</span>
                Our Model
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>Programs designed with communities</li>
                <li>Systems generate their own income</li>
                <li>Builds local capacity and ownership</li>
                <li>Local leaders in charge</li>
                <li>Focus on outcomes (what changed)</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-700 mb-4">
              Want the full picture of how we work?
            </p>
            <Link 
              href="/governance" 
              className="text-gray-900 font-medium hover:underline"
            >
              View our governance & financials →
            </Link>
          </div>
        </div>
      </section>

      {/* The Partnership */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Work: BAN + YDO</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Be A Number works in deep partnership with Youth Development Organisation Uganda (YDO), our local implementing partner led by Simon Peter Wilobo.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Be A Number</strong> provides strategic design, fundraising, international partnerships, and systems architecture from the U.S.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>YDO</strong> provides local leadership, community relationships, program implementation, and on-the-ground operations in Northern Uganda.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                This isn't a donor-recipient relationship. It's a true partnership where both organizations bring essential capabilities. YDO isn't implementing our programs — we're jointly building systems that belong to the community.
              </p>
              <Link 
                href="/ydo" 
                className="text-gray-900 font-medium hover:underline inline-flex items-center gap-2"
              >
                Learn about YDO
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[16/10] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/partnerships/sewing-classroom-training.jpg"
                  alt="Vocational training program in Northern Uganda"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Facts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">501(c)(3)</div>
              <div className="text-gray-600 text-sm">U.S. nonprofit status</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">96.7%</div>
              <div className="text-gray-600 text-sm">Program allocation</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
              <div className="text-gray-600 text-sm">Years in Uganda</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600 text-sm">Local leadership</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Us</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Your support helps build systems that last — healthcare, education, and economic opportunity that communities own and operate forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#donate"
              className="px-8 py-4 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Donate Now
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors font-medium border border-white/20"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Be A Number, International</h3>
              <p className="text-gray-600 text-sm">
                8475 18 1/2 Mile Road, Marshall, MI 49068
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-600 text-sm">
                Email: Kevin@beanumber.org
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <p className="text-gray-600 text-sm mb-2">
                EIN: 93-1948872
              </p>
              <div className="flex flex-col gap-1">
                <Link href="/governance" className="text-gray-600 text-sm hover:text-gray-900 underline">
                  Governance & Financials
                </Link>
                <Link href="/privacy" className="text-gray-600 text-sm hover:text-gray-900 underline">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© 2025 Be A Number, International. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
