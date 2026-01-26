import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { YDONavigation } from '@/components/YDONavigation';

export const metadata: Metadata = {
  title: "Youth Development Organisation Uganda | Rehabilitating Post-War Communities",
  description: "Youth Development Organisation Uganda (YDO) rehabilitates and empowers war-affected communities in Northern Uganda through education, psycho-social support, vocational training, and advocacy for children's rights.",
  openGraph: {
    title: "Youth Development Organisation Uganda | Rehabilitating Post-War Communities",
    description: "YDO focuses on rehabilitation and empowerment in war-affected regions of Northern Uganda, emphasizing education, psycho-social support, life skills, vocational training, and the welfare of children, women, and vulnerable populations.",
    images: ["/images/homepage/hero-community-group.jpg"],
  },
};

export default function YDOHome() {
  return (
    <div className="min-h-screen bg-white">
      <YDONavigation currentPath="/ydo" />

      {/* Hero Section */}
      <section id="top" className="relative pt-16 pb-20 md:pt-20 md:pb-32 px-6 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/homepage/hero-community-group.jpg"
            alt="Community group in Northern Uganda"
            fill
            className="object-cover md:object-cover"
            style={{ objectPosition: 'center 30%' }}
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-green-900/75 md:bg-green-900/70"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Rehabilitating and empowering war-affected communities in Northern Uganda.
            </h1>
            <p className="text-base sm:text-lg text-white/90 mb-6 leading-[1.8]">
              Youth Development Organisation Uganda (YDO) envisions a world where war-affected communities are rehabilitated and where children are protected from armed conflict and supported to thrive.
            </p>
            <p className="text-base sm:text-lg text-white/90 mb-6 leading-[1.8]">
              We focus on education, psycho-social support, life skills, vocational training, scholarship programs, and the welfare of children, women, and vulnerable populations — rebuilding community resilience and creating protective environments.
            </p>
            <p className="text-base sm:text-lg text-white/90 mb-10 leading-[1.8]">
              Our mission centers on locally grounded solutions that empower families, strengthen access to education, and promote economic opportunity through community-led development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href="/ydo/programs"
                className="px-8 py-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center font-medium"
              >
                Our Programs
              </Link>
              <Link
                href="/ydo/about"
                className="px-8 py-4 bg-white text-green-700 rounded-md hover:bg-gray-100 transition-colors text-center font-medium"
              >
                Learn More
              </Link>
            </div>
            
            {/* Trust Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 py-4 px-6 bg-white/10 backdrop-blur-sm rounded-md border border-white/20">
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Community-Led</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Education Focus</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Child Protection</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Vocational Training</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                YDO's mission focuses on rehabilitating post-war communities by empowering families, children, and vulnerable populations — strengthening access to education, advocacy, psycho-social support, and vocational pathways.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We envision a world where war-affected communities are rehabilitated and where children are protected from armed conflict and supported to thrive. Our work emphasizes locally grounded solutions that build community resilience and create protective environments.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Through education support, scholarships, child welfare advocacy, psycho-social training, and life-skills programming, we reduce dependency on external aid and strengthen community capacity for long-term transformation.
              </p>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/governance/planning-notebook.jpg"
                  alt="Community planning and development work"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Programs</h2>
          <p className="text-gray-700 mb-12 max-w-3xl leading-relaxed">
            YDO implements on-the-ground programming that aligns with community priorities, focusing on education, empowerment, and protection for vulnerable populations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-green-200 rounded-lg bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Education & Scholarships</h3>
              <p className="text-gray-700 leading-relaxed">
                We provide educational support and scholarships to vulnerable children, ensuring access to quality education from early childhood through secondary levels. Our programs include school infrastructure support, scholarship programs, and child welfare advocacy.
              </p>
            </div>
            <div className="p-8 border border-green-200 rounded-lg bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Vocational & Life Skills Training</h3>
              <p className="text-gray-700 leading-relaxed">
                Vocational and life-skills training programs equip youth and adults with practical, professional, and marketable skills. These programs respond to local market needs and create pathways to economic opportunity.
              </p>
            </div>
            <div className="p-8 border border-green-200 rounded-lg bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Psycho-Social Support</h3>
              <p className="text-gray-700 leading-relaxed">
                We provide psycho-social support services to help individuals and families heal from trauma and build resilience. Our programs create safe spaces for processing experiences and developing coping strategies.
              </p>
            </div>
            <div className="p-8 border border-green-200 rounded-lg bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Child Protection & Advocacy</h3>
              <p className="text-gray-700 leading-relaxed">
                YDO advocates for the rights and welfare of vulnerable children, women, and communities. We work to create protective environments that prevent children from entering armed conflict and support their holistic development.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/ydo/programs"
              className="inline-block px-8 py-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Learn More About Our Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Partnership Highlight */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Partnership</h2>
          <p className="text-gray-700 mb-12 max-w-3xl leading-relaxed">
            YDO collaborates as a core implementation partner with Be A Number, International, combining strategic systems design with local execution capacity in Northern Uganda.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                This partnership ensures that programs reflect local context and community priorities, outcomes are locally measured and sustained, and investments build assets and capabilities owned by Ugandan partners.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Together, we work on community-driven development rooted in dignity, sustainability, and measurable outcomes. YDO is central to implementing education, youth development, and community empowerment initiatives that complement Be A Number's integrated systems approach.
              </p>
              <Link
                href="/ydo/partnership"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Learn More About Our Partnership
              </Link>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[16/10] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/partnerships/sewing-classroom-training.jpg"
                  alt="Vocational training in action"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
          <p className="text-gray-700 mb-12 leading-relaxed">
            YDO's contributions to community development in Northern Uganda include educational support, vocational training, and advocacy that strengthen community resilience and create lasting change.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Educational Support</h3>
              <p className="text-gray-700 leading-relaxed">
                Scholarships and educational support provided to vulnerable children, ensuring access to quality education and creating pathways to opportunity.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Skills Development</h3>
              <p className="text-gray-700 leading-relaxed">
                Vocational and life-skills training tied to community needs, equipping youth and adults with practical skills for economic empowerment.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advocacy & Protection</h3>
              <p className="text-gray-700 leading-relaxed">
                Advocacy for children's rights and welfare, creating protective environments and strengthening community capacity for child protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Simon Peter Wilobo</h3>
              <p className="text-gray-600 mb-4">Founder and Head of YDO</p>
              <p className="text-gray-700 leading-relaxed">
                Simon Peter Wilobo brings lived experience from Northern Uganda's post-conflict transition. His history of community service, child sponsorship programs, and development work grounds YDO's operations in local insight and resilience building.
              </p>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/impact/mother-child-portrait.jpg"
                  alt="Community members in Northern Uganda"
                  fill
                  className="object-cover"
                />
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
