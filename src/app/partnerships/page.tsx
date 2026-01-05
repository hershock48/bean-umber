import { Logo } from '@/components/Logo';
import Link from 'next/link';
import Image from 'next/image';

export default function Partnerships() {
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

      {/* Primary Image */}
      <section className="relative w-full h-[60vh] min-h-[500px] bg-gray-200">
        <Image
          src="/images/partnerships/sewing-classroom-training.jpg"
          alt="Sewing classroom training scene"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Main Content */}
      <main className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Partnerships</h1>
          <p className="text-xl text-gray-600 mb-12">We partner with established institutions to ensure program quality and replicability.</p>

          <div className="prose prose-lg max-w-none mb-16">
            <p className="text-gray-700 leading-relaxed mb-6">
              Academic partnerships provide technical expertise and program validation. Local organizations implement programs with community leadership. These partnerships demonstrate the model's ability to scale across regions.
            </p>
          </div>

          {/* Partner Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 border border-gray-200 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">University of Worcester</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                International university partnership providing technical expertise and program validation. Cohorts planned for 2026 (4 groups).
              </p>
              <p className="text-gray-600 text-sm">United Kingdom</p>
            </div>
            <div className="bg-white p-8 border border-gray-200 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">YDO</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Youth Development Organization (YDO) serves as our local implementing partner, working directly with community leadership to deliver programs.
              </p>
              <p className="text-gray-600 text-sm">Northern Uganda</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-gray-50 border-l-4 border-gray-900 p-8 rounded-lg mb-16">
            <p className="text-lg text-gray-700 italic mb-4 leading-relaxed">
              "This partnership has transformed our community. Our children now have access to education, our families have healthcare, and our people have skills to build their futures. We are building something that will last for generations."
            </p>
            <p className="text-gray-600 font-medium">— Community Leader, Northern Uganda</p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-700 leading-relaxed">
              These collaborations create the institutional pathway to replicate our model across post-conflict regions.
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
