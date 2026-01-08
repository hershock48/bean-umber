import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function AnnualReport() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">2025 Annual Report</h1>
          <p className="text-xl text-gray-600 mb-12">Full narrative report</p>

          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              In 2025, Be A Number continued to build sustainable community systems in Northern Uganda. Our model—focused on locally-led infrastructure, training, and income-generating activities—demonstrated measurable impact across health, education, workforce, and economic empowerment. Communities own and operate all programs, ensuring lasting change beyond initial investment.
            </p>
          </section>

          {/* Model in Action */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Model in Action</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-gray-900 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Health</h3>
                <p className="text-gray-700 leading-relaxed">
                  Medical center and outreach programs provided essential healthcare services to 700+ patients. Programs include primary care, preventive medicine, and health education. Operations are sustained through local partnerships and community support.
                </p>
              </div>
              <div className="border-l-4 border-gray-900 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Education</h3>
                <p className="text-gray-700 leading-relaxed">
                  School infrastructure serves 380 students. Scholarships support children from early childhood through secondary education. School fees sustain operations long-term, creating a self-financing education system.
                </p>
              </div>
              <div className="border-l-4 border-gray-900 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Workforce</h3>
                <p className="text-gray-700 leading-relaxed">
                  Vocational training programs taught practical skills in sewing, construction, and other in-demand trades. 68 adults completed training programs. Programs respond to local market needs and create pathways to employment.
                </p>
              </div>
              <div className="border-l-4 border-gray-900 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Economic Empowerment</h3>
                <p className="text-gray-700 leading-relaxed">
                  Economic activities include local business support, job creation, and income-generating partnerships. 30 local jobs were supported through our programs. These activities ensure long-term program sustainability.
                </p>
              </div>
            </div>
          </section>

          {/* Infrastructure Built */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Infrastructure Built</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Center</h3>
                <p className="text-gray-700">Operational</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nursery & Primary School</h3>
                <p className="text-gray-700">95% complete; 380-student capacity</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Training Center</h3>
                <p className="text-gray-700">Active</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lodge + 3 Dorms</h3>
                <p className="text-gray-700">For university cohorts</p>
              </div>
            </div>
          </section>

          {/* Partnerships */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Partnerships</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">University of Worcester (UK)</h3>
                <p className="text-gray-700">Cohorts planned for 2026 (4 groups)</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Youth Development Organisation (YDO)</h3>
                <p className="text-gray-700">Local implementing partner</p>
              </div>
            </div>
          </section>

          {/* What's Next */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Next</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In 2026, we will welcome four university cohorts from Worcester University, expand vocational training programs, and complete the 380-student school facility. We continue to document and refine our model to enable replication across post-conflict regions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our 5-year goal remains: reach 20,000+ lives and replicate this model across additional post-conflict regions where community leadership and local partnerships are in place.
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
