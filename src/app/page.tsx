import { Logo } from '@/components/Logo';
import { CountUpNumber } from '@/components/CountUpNumber';
import { StickyDonateButton } from '@/components/StickyDonateButton';
import { DonationSection } from '@/components/DonationSection';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Be A Number, International | Rebuilding Post-War Societies",
  description: "Be A Number partners with local leadership in Northern Uganda to build sustainable community systems. In 2025, we reached 700+ patients, 60 women, and 15 students. Our goal: reach 20,000+ lives within five years.",
  openGraph: {
    title: "Be A Number, International | Rebuilding Post-War Societies",
    description: "Be A Number partners with local leadership in Northern Uganda to build sustainable community systems — healthcare, education, workforce development, and economic infrastructure.",
    images: ["/images/homepage/hero-community-group.jpg"],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <StickyDonateButton />
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <Logo className="h-8 w-8 text-gray-900" />
              <span className="text-xl font-semibold text-gray-900">Be A Number</span>
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#model" className="text-gray-700 hover:text-gray-900 transition-colors">
                Model
              </a>
              <a href="#impact-2025" className="text-gray-700 hover:text-gray-900 transition-colors">
                Impact
              </a>
              <a href="#partnerships" className="text-gray-700 hover:text-gray-900 transition-colors">
                Partnerships
              </a>
              <a
                href="#donate"
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Donate
              </a>
            </div>
            <div className="md:hidden">
              <a
                href="#donate"
                className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
              >
                Donate
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="top" className="relative pt-16 pb-20 md:pt-20 md:pb-32 px-6 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
        <Image
            src="/images/homepage/hero-community-group.jpg"
            alt="Wide community group photo in front of painted building"
            fill
            className="object-cover md:object-cover"
            style={{ objectPosition: 'center 30%' }}
            sizes="100vw"
          priority
        />
        </div>
        <div className="absolute inset-0 z-0 bg-black/70 md:bg-black/65"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Rebuilding post-war societies through locally-led systems change.
          </h1>
            <p className="text-base sm:text-lg text-white/90 mb-6 leading-[1.8]">
              Be A Number partners with local leadership in Northern Uganda to design and operate integrated community systems — healthcare, education, workforce development, and local economic infrastructure — that move communities from survival to long-term stability.
            </p>
            <p className="text-base sm:text-lg text-white/90 mb-6 leading-[1.8]">
              In 2025 alone, our work reached 700+ patients, 60 women, and 15 students, demonstrating how durable institutions, when owned and led by the community, generate measurable outcomes and lasting transformation.
            </p>
            <p className="text-base sm:text-lg text-white/90 mb-10 leading-[1.8]">
              Each system is built to sustain itself through earned income and local ownership, ensuring long-term operations beyond initial investment and enabling replication across post-conflict regions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <a
                href="#impact-2025"
                className="px-8 py-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-center font-medium"
              >
                View 2025 Impact
              </a>
              <a
                href="#community"
                className="px-8 py-4 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors text-center font-medium"
              >
                Meet the Community
              </a>
            </div>
            
            {/* Trust Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 py-4 px-6 bg-white/10 backdrop-blur-sm rounded-md border border-white/20">
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>501(c)(3) Registered</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>96.7% Program Allocation</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Local Leadership</span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Audited Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Snapshot */}
      <section id="impact-2025" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">2025 Measured Outcomes (Current)</h2>
          <p className="text-gray-700 mb-12 leading-relaxed">These results demonstrate the model's effectiveness. We are on track to reach 20,000+ lives within five years and replicate the model in additional post-conflict regions.</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <CountUpNumber target={700} suffix="+" className="inline" />
                </div>
                <div className="text-gray-700">Medical outreach served</div>
              </div>
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <CountUpNumber target={60} className="inline" />
                </div>
                <div className="text-gray-700">Women trained (sewing/vocational)</div>
              </div>
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <CountUpNumber target={8} className="inline" />
                </div>
                <div className="text-gray-700">Men trained (construction skills)</div>
              </div>
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <CountUpNumber target={15} className="inline" />
                </div>
                <div className="text-gray-700">Students supported</div>
              </div>
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <CountUpNumber target={30} className="inline" />
                </div>
                <div className="text-gray-700">Local jobs supported</div>
              </div>
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <CountUpNumber target={380} className="inline" />
                </div>
                <div className="text-gray-700">School capacity: students</div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full px-4 py-4">
                <div className="relative aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src="/images/impact/mother-child-portrait.jpg"
                    alt="Portrait of mother and child inside home with jerrycans"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How the model works */}
      <section className="py-20 px-6 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-12 text-center">How it works</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-4 relative">
            {/* Timeline connector line - desktop */}
            <div className="hidden md:block absolute top-6 left-1/4 right-1/4 h-0.5 bg-gray-300 -z-10"></div>
            
            {/* Step 1 */}
            <div className="flex-1 w-full md:w-auto text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white mb-4 text-xl font-bold">
                1
              </div>
              <p className="text-gray-900 font-semibold text-lg">Community-led planning</p>
            </div>
            
            {/* Arrow - desktop */}
            <div className="hidden md:block text-gray-400 text-2xl flex-shrink-0">→</div>
            
            {/* Arrow - mobile */}
            <div className="md:hidden text-gray-400 text-2xl py-2">↓</div>
            
            {/* Step 2 */}
            <div className="flex-1 w-full md:w-auto text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white mb-4 text-xl font-bold">
                2
              </div>
              <p className="text-gray-900 font-semibold text-lg">Build foundational community systems</p>
            </div>
            
            {/* Arrow - desktop */}
            <div className="hidden md:block text-gray-400 text-2xl flex-shrink-0">→</div>
            
            {/* Arrow - mobile */}
            <div className="md:hidden text-gray-400 text-2xl py-2">↓</div>
            
            {/* Step 3 */}
            <div className="flex-1 w-full md:w-auto text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white mb-4 text-xl font-bold">
                3
              </div>
              <p className="text-gray-900 font-semibold text-lg">Sustain through local jobs + earned income</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Be A Number */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Be A Number</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Unlike traditional aid programs, we build systems that sustain themselves. Communities own and operate all programs long-term.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Traditional aid often creates dependency: communities wait for outside funding, programs end when donations stop, and local leadership is sidelined. Our model works differently. We invest in infrastructure, training, and income-generating activities that create earned revenue. Programs become self-sustaining, ensuring operations continue without ongoing external funding. Communities set priorities, local staff run operations, and the systems we build become permanent assets.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This model can be replicated in any post-conflict region where community leadership and local partnerships are in place.
              </p>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/governance/planning-notebook.jpg"
                  alt="Woman with clothesline in Northern Uganda"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Model */}
      <section id="model" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The Model</h2>
          <p className="text-gray-700 mb-12 max-w-3xl leading-relaxed">Four integrated systems work together to create sustainable, long-term change. Each system generates measurable outcomes and can operate independently.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Health</h3>
              <p className="text-gray-700 leading-relaxed">
                Medical center and outreach programs provide essential healthcare services. Measured outcomes include patient visits, treatment completions, and health education sessions. Operations are sustained through local partnerships and community support.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">700+ patient visits in 2025</p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Education</h3>
              <p className="text-gray-700 leading-relaxed">
                School infrastructure serves 380 students. Scholarships support children from early childhood through secondary education. Measured outcomes include enrollment rates, completion rates, and academic performance. School fees sustain operations long-term.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">380-student capacity school opening 2026</p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Workforce</h3>
              <p className="text-gray-700 leading-relaxed">
                Vocational training programs teach practical skills in sewing, construction, and other in-demand trades. Measured outcomes include training completions, job placements, and business starts. Programs are designed to respond to local market needs.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">68 adults trained</p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Economic Empowerment</h3>
              <p className="text-gray-700 leading-relaxed">
                Economic activities include local business support, job creation, and income-generating partnerships. Measured outcomes include jobs created, businesses supported, and revenue generated. These activities ensure long-term program sustainability.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">30 local jobs supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet the Community</h2>
          <p className="text-gray-700 mb-12 max-w-3xl leading-relaxed">
            The people of Northern Uganda are building their own future. Community leaders set priorities, local staff run operations, and families participate in programs that will sustain generations to come.
          </p>

          {/* Community Image */}
          <div className="mb-12 w-full max-w-2xl mx-auto">
            <div className="relative w-full aspect-[16/10] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src="/images/partnerships/sewing-classroom-training.jpg"
                alt="Wide sewing classroom training scene"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Leaders</h3>
              <p className="text-gray-700 leading-relaxed">
                Local elders and elected leaders work with our team to identify community needs and set program priorities. Their leadership ensures programs reflect local values and long-term goals.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Program Staff</h3>
              <p className="text-gray-700 leading-relaxed">
                All programs are staffed by trained local professionals—teachers, healthcare workers, and vocational instructors. They run daily operations and build relationships with participants.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Participants</h3>
              <p className="text-gray-700 leading-relaxed">
                Families participate in health programs, students attend school, and adults learn new skills. Their success creates lasting change that extends to future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Built */}
      <section id="infrastructure" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Infrastructure Built</h2>
          <p className="text-gray-700 mb-12 leading-relaxed">All infrastructure built and operated by local partners in Northern Uganda.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Medical Center</h3>
              <p className="text-gray-700">Operational</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nursery & Primary School</h3>
              <p className="text-gray-700">95% complete; 380-student capacity</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Training Center</h3>
              <p className="text-gray-700">Active</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lodge + 3 Dorms</h3>
              <p className="text-gray-700">For university cohorts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section id="partnerships" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Partnerships</h2>
          <p className="text-gray-700 mb-12 max-w-3xl leading-relaxed">
            We partner with established institutions to ensure program quality, accountability, and replicability. Academic partnerships provide technical expertise and program validation. Local organizations implement programs with community leadership. These partnerships demonstrate the model's ability to scale across regions.
          </p>
          
          {/* Primary Image */}
          <div className="mb-12 w-full max-w-2xl mx-auto">
            <div className="relative w-full aspect-[16/10] bg-gray-200 rounded-lg overflow-hidden">
            <Image
                src="/images/impact-page/secondary-image.jpg"
                alt="Kevin Hershock with community members carrying jerrycans"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Key Partners & Collaborators */}
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Partners & Collaborators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="p-8 border border-gray-200 rounded-lg bg-white">
              <div className="h-16 mb-4 flex items-center">
                <div className="text-2xl font-bold text-gray-700">University of Worcester (UK)</div>
              </div>
              <p className="text-gray-700">Academic partner; four student cohorts scheduled for 2026</p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg bg-white">
              <div className="h-16 mb-4 flex items-center">
                <div className="text-xl font-semibold text-gray-700">Youth Development Organization (YDO), Uganda</div>
              </div>
              <p className="text-gray-700">Core local implementing partner in Northern Uganda</p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg bg-white">
              <div className="h-16 mb-4 flex items-center">
                <div className="text-xl font-semibold text-gray-700">Rotary Club of Marshall (USA)</div>
              </div>
              <p className="text-gray-700">Longstanding civic partner supporting health, education, and community development initiatives</p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg bg-white">
              <div className="h-16 mb-4 flex items-center">
                <div className="text-xl font-semibold text-gray-700">Rotary Club of Gulu (Uganda)</div>
              </div>
              <p className="text-gray-700">Local institutional partner advancing health, education, and post-conflict community development</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-gray-50 border-l-4 border-gray-900 p-8 rounded-lg">
            <p className="text-lg text-gray-700 italic mb-4 leading-relaxed">
              "This partnership has transformed our community. Our children now have access to education, our families have healthcare, and our people have skills to build their futures. We are building something that will last for generations."
            </p>
            <p className="text-gray-600 font-medium">— Community Leader, Northern Uganda</p>
          </div>
        </div>
      </section>

      {/* Trust & Credibility */}
      <section className="py-16 px-6 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">3+</div>
              <div className="text-sm text-gray-600">Years active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">501(c)(3)</div>
              <div className="text-sm text-gray-600">Nonprofit status</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-600">Local leadership</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
              <div className="text-sm text-gray-600">Institutional partners</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">Public</div>
              <div className="text-sm text-gray-600">Financial reports</div>
            </div>
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <DonationSection />

      {/* Founder Attribution */}
      <section className="py-12 px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 text-sm">
            Founded by <a href="/founder" className="text-gray-900 hover:text-gray-700 underline font-medium">Kevin Hershock</a> after 15+ years of community work in Northern Uganda
          </p>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-12 px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-700 leading-relaxed">
            Our 5-year goal: Reach 20,000+ lives and replicate this model across post-conflict regions.
          </p>
        </div>
      </section>

      {/* Reports */}
      <section className="py-12 px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 text-sm mb-2">
            Reports: <a href="/reports/2025-impact-financial-summary" className="text-gray-900 hover:text-gray-700 underline font-medium">2025 Impact & Financial Summary</a> • <a href="/reports/2025-annual-report" className="text-gray-900 hover:text-gray-700 underline font-medium">2025 Annual Report</a>
          </p>
          <p className="text-gray-500 text-xs mt-2">All reports independently reviewed and publicly available.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Be A Number, International</h3>
              <p className="text-gray-600 text-sm">
                8475 18 1/2 Mile Road, Marshall, MI 49068
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-600 text-sm">
                Email: Kevin@beanumber.org
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <p className="text-gray-600 text-sm mb-2">
                EIN: 93-1948872
              </p>
              <a href="/governance" className="text-gray-600 text-sm hover:text-gray-900 underline">
                Governance & Financials
              </a>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© 2025 Be A Number, International. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
