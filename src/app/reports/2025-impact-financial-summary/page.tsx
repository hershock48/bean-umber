import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function ImpactFinancialSummary() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">2025 Impact & Financial Summary</h1>
          <p className="text-xl text-gray-600 mb-12">One-page overview of outcomes and where funds went</p>

          {/* Key Outcomes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Outcomes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">700+</div>
                <div className="text-gray-700">Medical outreach served</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">60</div>
                <div className="text-gray-700">Women trained (sewing/vocational)</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">8</div>
                <div className="text-gray-700">Men trained (construction skills)</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">15</div>
                <div className="text-gray-700">Students supported</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">380</div>
                <div className="text-gray-700">Student school capacity</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">30</div>
                <div className="text-gray-700">Local jobs supported</div>
              </div>
            </div>
          </section>

          {/* Financial Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Stewardship</h2>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 mb-6">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">96.7%</div>
                <div className="text-gray-700 font-medium">Program allocation (2025)</div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              In 2025, 96.7% of total expenditures directly supported community programs, reflecting disciplined financial management and maximum impact.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Administrative and operational functions remain intentionally lean, ensuring strong governance, compliance, reporting, and long-term sustainability as the organization scales across post-conflict regions.
            </p>
          </section>
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
