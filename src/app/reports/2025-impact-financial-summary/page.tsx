import { Logo } from '@/components/Logo';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "2025 Impact & Financial Summary",
  description: "One-page overview of 2025 outcomes and financials. 700+ medical outreach, 60 women trained, 96.7% program allocation. All reports independently reviewed and publicly available.",
  openGraph: {
    title: "2025 Impact & Financial Summary | Be A Number",
    description: "2025 outcomes: 700+ patients, 60 women trained, 96.7% program allocation. Independently reviewed financial summary.",
  },
};

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
          {/* Header with Download Button */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">2025 Impact & Financial Summary</h1>
              <p className="text-xl text-gray-600">One-page overview of outcomes and where funds went</p>
            </div>
            <a
              href="/reports/2025-impact-financial-summary.pdf"
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </a>
          </div>

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

          {/* Related Reports */}
          <section className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Reports</h3>
            <Link 
              href="/reports/2025-annual-report" 
              className="text-gray-700 hover:text-gray-900 underline"
            >
              2025 Annual Report — Full narrative report →
            </Link>
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
