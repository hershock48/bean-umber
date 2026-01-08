import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function DonateSuccess() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-8 w-8 text-gray-900" />
            <span className="text-xl font-semibold text-gray-900">Be A Number</span>
          </Link>
        </div>
      </nav>

      {/* Thank You Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="mb-6">
            <svg
              className="mx-auto h-20 w-20 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Thank You for Your Donation!
          </h1>
          <p className="text-xl text-gray-700 mb-2 leading-relaxed">
            Your contribution supports sustainable systems that generate measurable, long-term outcomes in Northern Uganda.
          </p>
          <p className="text-gray-600">
            You will receive a tax-deductible receipt via email shortly.
          </p>
        </div>

        {/* What We Accomplished in 2025 */}
        <section className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">What We Accomplished in 2025</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Thanks to supporters like you, Be A Number delivered measurable impact across four integrated systems in Northern Uganda:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">700+</div>
              <div className="text-gray-700">Medical outreach served</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">68</div>
              <div className="text-gray-700">Adults trained (60 women, 8 men)</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">15</div>
              <div className="text-gray-700">Students supported through education</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">30</div>
              <div className="text-gray-700">Local jobs supported</div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            We also completed 95% of a 380-student capacity school, established international university partnerships, and built core infrastructure including a medical center, training facilities, and lodging for university cohorts.
          </p>
        </section>

        {/* What's Next in 2026 */}
        <section className="bg-gray-900 text-white rounded-lg shadow-lg p-8 md:p-12 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">What's Next in 2026 — With Your Help</h2>
          <p className="text-white/90 leading-relaxed mb-6">
            Your donation directly supports our 2026 goals:
          </p>
          <ul className="space-y-4 mb-6">
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/90">Complete the 380-student school facility and welcome the first cohort of students</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/90">Host four university cohorts from Worcester University (UK)</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/90">Expand vocational training programs to reach more women and men</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/90">Continue building toward our 5-year goal: reach 20,000+ lives and replicate this model across post-conflict regions</span>
            </li>
          </ul>
          <p className="text-white/90 leading-relaxed">
            Every dollar you give directly supports these outcomes. 96.7% of all funding goes to programs and community impact.
          </p>
        </section>

        {/* Founder & Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Founder Info */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet Our Founder</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <Link href="/founder" className="text-gray-900 font-semibold hover:text-gray-700 underline">Kevin C. Hershock</Link> is a founder-led social entrepreneur with over 15 years of cross-cultural development experience focused on post-conflict community recovery in East Africa.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              He founded Be A Number in 2010 and has built sustainable community systems in Northern Uganda through direct partnership with local leadership.
            </p>
            <Link
              href="/founder"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Read Full Story →
            </Link>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Connected</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Follow our journey and see your impact in action:
            </p>
            <div className="space-y-4">
              <a
                href="https://facebook.com/beanumber"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Follow on Facebook</span>
              </a>
              <a
                href="https://instagram.com/beanumber_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors font-medium"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Follow on Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact & Next Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Want to Learn More?</h2>
          <p className="text-gray-700 mb-6">
            Contact us at{' '}
            <a href="mailto:Kevin@beanumber.org" className="text-gray-900 font-semibold hover:text-gray-700 underline">
              Kevin@beanumber.org
            </a>
            {' '}or explore our website to see the full impact of your contribution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Return to Homepage
            </Link>
            <Link
              href="/impact"
              className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              See Our Impact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
