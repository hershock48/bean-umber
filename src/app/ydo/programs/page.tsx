import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Our Programs",
  description: "YDO implements education support, vocational training, psycho-social support, and child protection programs in Northern Uganda, empowering war-affected communities.",
  openGraph: {
    title: "Our Programs | Youth Development Organisation Uganda",
    description: "Education, vocational training, psycho-social support, and child protection programs that empower communities in Northern Uganda.",
    images: ["/images/partnerships/sewing-classroom-training.jpg"],
  },
};

export default function YDOPrograms() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-green-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/ydo" className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">YDO</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Youth Development Organisation</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/ydo/about" className="text-gray-700 hover:text-green-700 transition-colors">
                About
              </Link>
              <Link href="/ydo/programs" className="text-green-700 font-medium">
                Programs
              </Link>
              <Link href="/ydo/partnership" className="text-gray-700 hover:text-green-700 transition-colors">
                Partnership
              </Link>
              <Link href="/ydo/contact" className="text-gray-700 hover:text-green-700 transition-colors">
                Contact
              </Link>
            </div>
            <div className="md:hidden">
              <button className="text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Our Programs
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl leading-relaxed">
            YDO implements on-the-ground programming that aligns with community priorities, focusing on education, empowerment, and protection for vulnerable populations in Northern Uganda.
          </p>
        </div>
      </section>

      {/* Education & Scholarships */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Education & Scholarships</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                We provide educational support and scholarships to vulnerable children, ensuring access to quality education from early childhood through secondary levels.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our education programs include:
              </p>
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Scholarship programs for vulnerable children</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>School infrastructure support</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Early childhood education programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secondary education support</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Child welfare advocacy</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                These programs create pathways from learning to livelihood, ensuring children have the foundation they need to build successful futures.
              </p>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/homepage/hero-community-group.jpg"
                  alt="Children and community members in Northern Uganda"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vocational & Life Skills Training */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/partnerships/sewing-classroom-training.jpg"
                  alt="Vocational training in sewing classroom"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Vocational & Life Skills Training</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Vocational and life-skills training programs equip youth and adults with practical, professional, and marketable skills tied to community needs.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our training programs include:
              </p>
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sewing and tailoring skills</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Construction and building skills</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Business and entrepreneurship training</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Life skills development</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Market linkages and job placement support</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                These programs respond to local market needs and create pathways to economic opportunity, especially for vulnerable populations including women and youth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Psycho-Social Support */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Psycho-Social Support</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                We provide psycho-social support services to help individuals and families heal from trauma and build resilience in post-conflict communities.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our psycho-social programs include:
              </p>
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Individual and group counseling</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Trauma healing workshops</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Safe spaces for children and youth</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Family support services</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Community healing activities</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                These programs create safe spaces for processing experiences and developing coping strategies, reinforcing community stability and growth.
              </p>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/governance/planning-notebook.jpg"
                  alt="Community support and development work"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Child Protection & Advocacy */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/impact/mother-child-portrait.jpg"
                  alt="Mother and child in Northern Uganda"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Child Protection & Advocacy</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                YDO advocates for the rights and welfare of vulnerable children, women, and communities, working to create protective environments that prevent children from entering armed conflict.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our advocacy and protection work includes:
              </p>
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Rights awareness and education</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Child protection systems strengthening</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Support for children with disabilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Women's economic participation support</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Community mobilization for vulnerable populations</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                These efforts reinforce durable systems, reduce dependency on external aid, and strengthen community resilience while ensuring the protection and support of the most vulnerable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Integration */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Integrated Approach</h2>
          <p className="text-gray-700 mb-8 max-w-3xl leading-relaxed">
            Our programs work together to create holistic support for communities. Education connects with vocational training, psycho-social support reinforces educational outcomes, and advocacy ensures protective environments.
          </p>
          <div className="bg-green-50 p-8 rounded-lg border border-green-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">How Programs Connect</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <p className="mb-2"><strong>Education → Vocational Training:</strong></p>
                <p>Students who complete education programs can access vocational training to develop marketable skills.</p>
              </div>
              <div>
                <p className="mb-2"><strong>Psycho-Social → Education:</strong></p>
                <p>Healing and resilience building support children's ability to learn and succeed in school.</p>
              </div>
              <div>
                <p className="mb-2"><strong>Advocacy → Protection:</strong></p>
                <p>Rights awareness and protection systems create safe environments for all programs to operate.</p>
              </div>
              <div>
                <p className="mb-2"><strong>Training → Economic Opportunity:</strong></p>
                <p>Vocational skills connect to market opportunities, creating pathways to sustainable livelihoods.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Youth Development Organisation Uganda</h3>
              <p className="text-gray-400 text-sm">
                Gulu District, Northern Uganda
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Contact</h3>
              <p className="text-gray-400 text-sm mb-2">
                Visit our website: <a href="https://www.theyouth.world" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">theyouth.world</a>
              </p>
              <p className="text-gray-400 text-sm">
                Visit our partner: <a href="https://www.beanumber.org" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">beanumber.org</a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link href="/ydo/about" className="text-gray-400 text-sm hover:text-white">
                  About Us
                </Link>
                <Link href="/ydo/programs" className="text-gray-400 text-sm hover:text-white">
                  Programs
                </Link>
                <Link href="/ydo/partnership" className="text-gray-400 text-sm hover:text-white">
                  Partnership
                </Link>
                <Link href="/ydo/contact" className="text-gray-400 text-sm hover:text-white">
                  Contact
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>© 2025 Youth Development Organisation Uganda. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
