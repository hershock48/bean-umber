import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { YDONavigation } from '@/components/YDONavigation';

export const metadata: Metadata = {
  title: "Our Partnership | Youth Development Organisation Uganda",
  description: "YDO collaborates as a core implementation partner with Be A Number, International, combining strategic systems design with local execution capacity in Northern Uganda.",
  openGraph: {
    title: "Our Partnership | Youth Development Organisation Uganda",
    description: "YDO and Be A Number work together on community-driven development rooted in dignity, sustainability, and measurable outcomes.",
    images: ["/images/partnerships/sewing-classroom-training.jpg"],
  },
};

export default function YDOPartnership() {
  return (
    <div className="min-h-screen bg-white">
      <YDONavigation currentPath="/ydo/partnership" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Our Partnership
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl leading-relaxed">
            YDO collaborates as a core implementation partner with Be A Number, International, combining strategic systems design with local execution capacity in Northern Uganda.
          </p>
        </div>
      </section>

      {/* Partnership Overview */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Partnership Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Be A Number, International and Youth Development Organisation Uganda (YDO) work together as core partners in Northern Uganda, combining U.S.-based strategic systems design with YDO's local execution capacity.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                This partnership ensures that programs reflect local context and community priorities, outcomes are locally measured and sustained, and investments build assets and capabilities owned by Ugandan partners.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Together, we work on community-driven development rooted in dignity, sustainability, and measurable outcomes. YDO is central to implementing education, youth development, and community empowerment initiatives that complement Be A Number's integrated systems approach.
              </p>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[16/10] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/partnerships/sewing-classroom-training.jpg"
                  alt="Partnership in action - vocational training"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Vision */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Shared Vision & Complementary Strategies</h2>
          <p className="text-gray-700 mb-8 max-w-3xl leading-relaxed">
            Both organizations are committed to locally grounded solutions in Northern Uganda's post-conflict context, working together to create lasting transformation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-green-200 rounded-lg bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community-Led Approach</h3>
              <p className="text-gray-700 leading-relaxed">
                Be A Number's framework prioritizes local leadership and ownership in the design and operation of sustainable systems. This aligns with YDO's emphasis on community rehabilitation and local empowerment.
              </p>
            </div>
            <div className="p-8 border border-green-200 rounded-lg bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Education & Skills Development</h3>
              <p className="text-gray-700 leading-relaxed">
                Be A Number supports inclusive education infrastructure and scholarships, while YDO implements vocational and psycho-social training. Together, these create a continuum from learning to livelihood.
              </p>
            </div>
            <div className="p-8 border border-green-200 rounded-lg bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Economic Empowerment</h3>
              <p className="text-gray-700 leading-relaxed">
                Be A Number's vocational training feeds into local job creation and cooperatives. YDO's focus on livelihood support and community capacity complements these pathways, especially for vulnerable populations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Across Systems */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Integration Across Systems</h2>
          <p className="text-gray-700 mb-8 max-w-3xl leading-relaxed">
            YDO serves as a core local partner, enabling effective delivery of capacity-building, education access, and protective programming where needs are greatest.
          </p>
          
          <div className="space-y-8">
            <div className="p-8 border border-green-200 rounded-lg bg-green-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Education</h3>
              <p className="text-gray-700 leading-relaxed">
                School infrastructure supported by Be A Number is directly bolstered by YDO's scholarship and child-support activities. Together, we ensure children have access to quality education from early childhood through secondary levels.
              </p>
            </div>
            <div className="p-8 border border-green-200 rounded-lg bg-green-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Training</h3>
              <p className="text-gray-700 leading-relaxed">
                YDO's vocational and life-skills training connects with Be A Number's workforce development goals. Our programs equip youth and adults with practical, professional, and marketable skills tied to local market needs.
              </p>
            </div>
            <div className="p-8 border border-green-200 rounded-lg bg-green-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Welfare</h3>
              <p className="text-gray-700 leading-relaxed">
                YDO's advocacy for children with disabilities, vulnerable families, and women's economic participation enhances the holistic system Be A Number builds. Together, we create protective environments and strengthen community resilience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Role */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">YDO as a Core Local Partner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Be A Number identifies Youth Development Organisation Uganda (YDO) as a core implementation partner in Northern Uganda. YDO's deep local context, community networks, and operational experience enable effective delivery of capacity-building, education access, and protective programming where needs are greatest.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                YDO's location in Gulu District, combined with our understanding of post-conflict community needs, allows us to implement programs that are culturally appropriate, contextually relevant, and sustainable.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our partnership ensures that investments build assets and capabilities owned by Ugandan partners, creating lasting change that extends beyond initial program implementation.
              </p>
            </div>
            <div className="w-full">
              <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/images/governance/planning-notebook.jpg"
                  alt="Community planning and partnership work"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Values */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Shared Values</h2>
          <p className="text-gray-700 mb-8 max-w-3xl leading-relaxed">
            Both organizations share core values that guide our partnership and joint work in Northern Uganda.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dignity</h3>
              <p className="text-gray-700 leading-relaxed">
                Every individual deserves to be treated with dignity and respect, regardless of their circumstances or background.
              </p>
            </div>
            <div className="p-6 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-700 leading-relaxed">
                Programs are designed to be sustained by communities long-term, reducing dependency on external aid.
              </p>
            </div>
            <div className="p-6 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Community Ownership</h3>
              <p className="text-gray-700 leading-relaxed">
                Local leadership and community ownership are central to all program design and implementation.
              </p>
            </div>
            <div className="p-6 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Long-Term Transformation</h3>
              <p className="text-gray-700 leading-relaxed">
                We focus on lasting change rather than short-term relief, building systems that create intergenerational opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Together */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Impact Together</h2>
          <p className="text-gray-700 mb-8 max-w-3xl leading-relaxed">
            Together, the partnership leverages integrated systems change with on-the-ground capacity to move communities toward resilience, sustainability, and intergenerational opportunity.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Be A Number's 2025 Impact</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 700+ patient visits through outreach</li>
                <li>• Vocational training for dozens of adults</li>
                <li>• School capacity development for hundreds of students</li>
                <li>• Local jobs supported through economic activity</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">YDO's Contributions</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Educational support and scholarships to vulnerable children</li>
                <li>• Vocational and life-skills training tied to community needs</li>
                <li>• Advocacy for children's rights and welfare</li>
                <li>• Psycho-social support and community mobilization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Opportunities */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Strategic Opportunities</h2>
          <div className="space-y-6">
            <div className="p-6 border-l-4 border-green-600 bg-green-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Scaling Community Systems</h3>
              <p className="text-gray-700 leading-relaxed">
                Expand education and training footprints by combining Be A Number's infrastructure support with YDO's localized programming and outreach capacity.
              </p>
            </div>
            <div className="p-6 border-l-4 border-green-600 bg-green-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Strengthening Workforce Pathways</h3>
              <p className="text-gray-700 leading-relaxed">
                Integrate vocational curricula with market linkages and cooperative formations supported jointly by both organizations.
              </p>
            </div>
            <div className="p-6 border-l-4 border-green-600 bg-green-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Holistic Well-Being</h3>
              <p className="text-gray-700 leading-relaxed">
                Coordinate health initiatives with education and psycho-social support structures to reinforce community stability and growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More */}
      <section className="py-16 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Learn More About Be A Number</h2>
          <p className="text-gray-700 mb-6">
            Visit <a href="https://www.beanumber.org" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-800 underline font-medium">beanumber.org</a> to learn more about our partner organization and their integrated systems approach to community development.
          </p>
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
