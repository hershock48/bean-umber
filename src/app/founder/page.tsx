import { Logo } from '@/components/Logo';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Kevin C. Hershock - Founder & Executive Director",
  description: "Kevin Hershock is a founder-led social entrepreneur with over 15 years of cross-cultural development experience focused on post-conflict community recovery in East Africa. Founded Be A Number in 2010.",
  openGraph: {
    title: "Kevin C. Hershock - Founder & Executive Director | Be A Number",
    description: "Founder-led social entrepreneur with 15+ years of experience building sustainable community systems in Northern Uganda.",
    images: ["/images/founder/hero-sewing-classroom.jpg"],
  },
};

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
            <p className="text-gray-700 leading-relaxed mb-6 text-xl">
              The first time Kevin Hershock set foot in Northern Uganda, the war had just ended. Roads that once moved troops now carried families trying to find their way home. Communities that had survived decades of violence were starting over with almost nothing.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              It was 2008. Kevin was a college student who'd already spent time in Detroit homeless shelters, on Pine Ridge Reservation, in the Dominican Republic, and across Eastern Europe. But Uganda was different. The Acholi people he met weren't asking for charity—they were asking for partnership. They had plans for their communities. What they needed was someone willing to walk alongside them for the long haul.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Kevin stayed. Not for a week or a semester—for years. He learned the language, ate the food, slept in the villages. He watched mothers who had survived unimaginable violence start small businesses. He sat with community elders who mapped out dreams for schools that didn't exist yet.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              His first major project was a bakery. It employed women who had been exploited during the war, giving them income and dignity. The bakery ran for five years. But Kevin realized something: individual projects, no matter how successful, weren't enough. To really rebuild a community, you needed systems—healthcare, education, job training—all working together, all owned locally.
            </p>

            {/* Secondary Image - Mid-page */}
            <div className="my-12 w-full max-w-lg mx-auto">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/founder/secondary-woman-sewing.jpg"
                  alt="Women learning vocational skills in Northern Uganda"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Building Something Permanent</h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              In partnership with Simon Peter Wilobo and the Youth Development Organisation, Kevin secured six acres of land—Acholi land, for Acholi people. Together they built a medical center that's now treating hundreds of patients. A school for 380 children is nearly complete. Vocational training programs have taught 60 women to sew and 8 men to build. Every staff member—all 30 of them—is from the local community.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              The difference from traditional aid is simple: when international funding ends, these programs don't collapse. The community owns them. The community runs them. The systems generate their own income and serve their own people.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2025 Impact</h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              In just one year, the model proved itself:
            </p>

            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 ml-4">
              <li>700+ patients received medical care</li>
              <li>68 adults completed vocational training</li>
              <li>15 children supported through school</li>
              <li>30 local jobs created</li>
              <li>96.7% of funds went directly to programs</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-6">
              University of Worcester (UK) administrators visited and scheduled four student cohorts for 2026—proof that the model is attracting serious institutional partners.
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              Fifteen years after that first trip to Uganda, Kevin is still there, still building. But now he's not building alone. He's part of something the community owns—something that will outlast any single person or donation.
            </p>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Background</h2>
              <p className="text-gray-700 mb-2">Hillsdale College, 2010</p>
              <p className="text-gray-700">Founded Be A Number as a social enterprise while still a student, generating national attention and launching programs across the U.S. before focusing full-time on Uganda.</p>
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
