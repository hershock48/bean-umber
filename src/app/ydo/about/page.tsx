import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "About Us",
  description: "Youth Development Organisation Uganda (YDO) is a Ugandan nonprofit based in Gulu District that rehabilitates and empowers war-affected communities through education, psycho-social support, and advocacy.",
  openGraph: {
    title: "About Us | Youth Development Organisation Uganda",
    description: "YDO envisions a world where war-affected communities are rehabilitated and where children are protected from armed conflict and supported to thrive.",
    images: ["/images/homepage/hero-community-group.jpg"],
  },
};

export default function YDOAbout() {
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
              <Link href="/ydo/about" className="text-green-700 font-medium">
                About
              </Link>
              <Link href="/ydo/programs" className="text-gray-700 hover:text-green-700 transition-colors">
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
            About Youth Development Organisation Uganda
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl leading-relaxed">
            We are a Ugandan nonprofit based in Gulu District that envisions a world where war-affected communities are rehabilitated and where children are protected from armed conflict and supported to thrive.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Youth Development Organisation Uganda (YDO) is a community development organization that focuses on rehabilitation and empowerment in war-affected regions of Northern Uganda.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We emphasize education, psycho-social support, life skills, vocational training, scholarship programs, and the welfare of children, women, and vulnerable populations. Our mission centers on rebuilding community resilience and creating protective environments for children outside armed conflict.
              </p>
              <p className="text-gray-700 leading-relaxed">
                YDO advocates for the rights and welfare of vulnerable children, women, and communities, implementing programs aligned with local needs and community priorities.
              </p>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/homepage/hero-community-group.jpg"
                  alt="Community members in Northern Uganda"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              YDO's mission focuses on rehabilitating post-war communities by empowering families, children, and vulnerable populations — strengthening access to education, advocacy, psycho-social support, and vocational pathways.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We envision a world where war-affected communities are rehabilitated and where children are protected from armed conflict and supported to thrive. Our work emphasizes locally grounded solutions that build community resilience and create protective environments.
            </p>
            <div className="bg-white p-8 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Core Values</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Community Ownership:</strong> Programs are designed and implemented with local leadership and community participation</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Dignity & Respect:</strong> Every individual deserves to be treated with dignity and respect, regardless of their circumstances</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Sustainability:</strong> We build programs that can be sustained by communities long-term</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Child Protection:</strong> The welfare and protection of children is central to all our work</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Long-Term Transformation:</strong> We focus on lasting change rather than short-term relief</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Work</h2>
          <p className="text-gray-700 mb-12 max-w-3xl leading-relaxed">
            YDO implements on-the-ground programming that aligns with community priorities, focusing on education, empowerment, and protection for vulnerable populations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 border border-green-200 rounded-lg bg-green-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community-Led Approach</h3>
              <p className="text-gray-700 leading-relaxed">
                All programs are designed and implemented with local community leadership. We work closely with community elders, local leaders, and program participants to ensure our work reflects local priorities and values.
              </p>
            </div>
            <div className="p-8 border border-green-200 rounded-lg bg-green-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Integrated Programming</h3>
              <p className="text-gray-700 leading-relaxed">
                Our programs work together to create holistic support. Education connects with vocational training, psycho-social support reinforces educational outcomes, and advocacy ensures protective environments.
              </p>
            </div>
            <div className="p-8 border border-green-200 rounded-lg bg-green-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Partnerships</h3>
              <p className="text-gray-700 leading-relaxed">
                We partner with local institutions, community organizations, and international partners like Be A Number to leverage resources and expertise while maintaining local ownership and leadership.
              </p>
            </div>
            <div className="p-8 border border-green-200 rounded-lg bg-green-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Measured Outcomes</h3>
              <p className="text-gray-700 leading-relaxed">
                We track and measure the impact of our programs, ensuring they deliver meaningful outcomes for children, families, and communities. This includes educational achievements, skills development, and community resilience indicators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Simon Peter Wilobo</h3>
              <p className="text-lg text-green-700 mb-6">Founder and Head of YDO</p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Simon Peter Wilobo brings lived experience from Northern Uganda's post-conflict transition. His history of community service, child sponsorship programs, and development work grounds YDO's operations in local insight and resilience building.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                As a leader who has experienced the challenges of post-conflict recovery firsthand, Simon Peter understands the importance of locally grounded solutions and community ownership. Under his leadership, YDO has become a trusted partner in Northern Uganda's development landscape.
              </p>
              <p className="text-gray-700 leading-relaxed">
                His commitment to child protection, education, and community empowerment drives YDO's mission to create lasting change in war-affected communities.
              </p>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/impact/mother-child-portrait.jpg"
                  alt="Community development work in Northern Uganda"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Location */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                YDO is based in Gulu District, Northern Uganda — a region that has experienced significant challenges following decades of conflict.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Gulu District is at the heart of post-conflict recovery efforts in Northern Uganda. The region's communities are rebuilding infrastructure, restoring social systems, and creating new opportunities for children and families.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our location in Gulu allows us to work directly with the communities most affected by conflict, ensuring our programs reach those who need them most and are grounded in local context and priorities.
              </p>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[16/10] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/partnerships/sewing-classroom-training.jpg"
                  alt="Community work in Northern Uganda"
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
