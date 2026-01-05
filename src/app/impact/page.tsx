import { Logo } from '@/components/Logo';
import Link from 'next/link';
import Image from 'next/image';

export default function Impact() {
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

      {/* Lead Image */}
      <section className="relative w-full h-[60vh] min-h-[500px] bg-gray-200">
        <Image
          src="/images/impact-page/lead-image.jpg"
          alt="Mother and baby in Northern Uganda"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Main Content */}
      <main className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">2025 Impact</h1>
          <p className="text-xl text-gray-600 mb-12">Measured outcomes from our integrated community development model in Northern Uganda.</p>

          <div className="prose prose-lg max-w-none mb-16">
            <p className="text-gray-700 leading-relaxed mb-6">
              In 2025, Be A Number delivered measurable impact across four integrated systems: health, education, workforce development, and economic empowerment.
            </p>
          </div>

          {/* Secondary Program Image */}
          <div className="mb-16 w-full max-w-3xl mx-auto">
            <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src="/images/impact-page/secondary-image.jpg"
                alt="Program implementation in Northern Uganda"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Health</h2>
              <p className="text-4xl font-bold text-gray-900 mb-2">700+</p>
              <p className="text-gray-700">Medical outreach served</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
              <p className="text-4xl font-bold text-gray-900 mb-2">15</p>
              <p className="text-gray-700">Students supported</p>
              <p className="text-gray-600 text-sm mt-2">380-student capacity school opening 2026</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Workforce</h2>
              <p className="text-4xl font-bold text-gray-900 mb-2">68</p>
              <p className="text-gray-700">Adults trained</p>
              <p className="text-gray-600 text-sm mt-2">60 women, 8 men</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Economic Empowerment</h2>
              <p className="text-4xl font-bold text-gray-900 mb-2">30</p>
              <p className="text-gray-700">Local jobs supported</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-700 leading-relaxed">
              These outcomes are the foundation of a regional model designed to reach 10,000+ lives within five years and replicate across post-conflict regions.
            </p>
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
