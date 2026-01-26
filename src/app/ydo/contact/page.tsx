import type { Metadata } from 'next';
import Link from 'next/link';
import { YDONavigation } from '@/components/YDONavigation';

export const metadata: Metadata = {
  title: "Contact Us | Youth Development Organisation Uganda",
  description: "Get in touch with Youth Development Organisation Uganda (YDO) in Gulu District, Northern Uganda.",
  openGraph: {
    title: "Contact Us | Youth Development Organisation Uganda",
    description: "Contact YDO in Gulu District, Northern Uganda. Visit our partner Be A Number for more information.",
  },
};

export default function YDOContact() {
  return (
    <div className="min-h-screen bg-white">
      <YDONavigation currentPath="/ydo/contact" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl leading-relaxed">
            Get in touch with Youth Development Organisation Uganda. We're based in Gulu District, Northern Uganda.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Youth Development Organisation Uganda (YDO) is based in Gulu District, Northern Uganda. For inquiries about our programs, partnerships, or ways to get involved, please reach out through our partner organization.
              </p>
              
              <div className="space-y-6">
                <div className="p-6 border border-green-200 rounded-lg bg-green-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-700">
                    Gulu District, Northern Uganda
                  </p>
                </div>
                
                <div className="p-6 border border-green-200 rounded-lg bg-green-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Our Website</h3>
                  <p className="text-gray-700 mb-3">
                    Learn more about YDO:
                  </p>
                  <p className="text-gray-700 mb-4">
                    <a 
                      href="https://www.theyouth.world" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-green-700 hover:text-green-800 underline font-medium"
                    >
                      www.theyouth.world
                    </a>
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-6">Partner Organization</h3>
                  <p className="text-gray-700 mb-3">
                    For inquiries, please contact our partner:
                  </p>
                  <p className="text-gray-700">
                    <a 
                      href="https://www.beanumber.org" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-green-700 hover:text-green-800 underline font-medium"
                    >
                      Be A Number, International
                    </a>
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Visit <a href="https://www.beanumber.org" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline">beanumber.org</a> for contact information
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="p-8 border border-green-200 rounded-lg bg-green-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About Our Partnership</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  YDO collaborates as a core implementation partner with Be A Number, International. This partnership ensures that programs reflect local context and community priorities.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  For general inquiries, partnership opportunities, or ways to support our work, please visit our partner organization's website.
                </p>
                <a
                  href="https://www.beanumber.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  Visit Be A Number
                </a>
              </div>
              
              <div className="mt-8 p-8 border border-green-200 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Programs</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  YDO implements programs in:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Education & Scholarships</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Vocational & Life Skills Training</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Psycho-Social Support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Child Protection & Advocacy</span>
                  </li>
                </ul>
                <Link
                  href="/ydo/programs"
                  className="inline-block mt-6 text-green-700 hover:text-green-800 underline font-medium"
                >
                  Learn more about our programs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Leadership</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                <strong>Simon Peter Wilobo</strong>
              </p>
              <p className="text-gray-600 text-sm mb-4">Founder and Head of YDO</p>
              <p className="text-gray-700 leading-relaxed">
                Simon Peter Wilobo brings lived experience from Northern Uganda's post-conflict transition and grounds YDO's operations in local insight and resilience building.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Focus</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                YDO focuses on rehabilitation and empowerment in war-affected regions, emphasizing:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Education and scholarship programs</li>
                <li>• Vocational and life-skills training</li>
                <li>• Psycho-social support</li>
                <li>• Child protection and advocacy</li>
                <li>• Community resilience building</li>
              </ul>
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
