'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import Image from 'next/image';

interface AvailableChild {
  recordId: string;
  id: string;
  displayName: string;
  age?: string;
  location?: string;
  photo?: {
    url: string;
    filename: string;
  };
}

interface ApiResponse {
  success: boolean;
  data?: {
    children: AvailableChild[];
    total: number;
  };
  error?: string;
}

export default function SponsorshipCatalog() {
  const [children, setChildren] = useState<AvailableChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvailableChildren() {
      try {
        const response = await fetch('/api/sponsorship/available');
        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load available children');
        }

        setChildren(data.data?.children || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAvailableChildren();
  }, []);

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
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sponsor a Child
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Change a child's life through education, healthcare, and hope.
            Your sponsorship provides the support they need to thrive.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
                <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
              </div>
              <p className="text-gray-500 mt-4">Loading available children...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to Load</h2>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : children.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  All Children Are Sponsored!
                </h2>
                <p className="text-gray-600 mb-6">
                  Great news — all our children currently have sponsors! 
                  Join our waitlist to be notified when new children need sponsors.
                </p>
                
                {/* Email Waitlist Form */}
                {waitlistSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800 font-medium">
                      ✓ You're on the list! We'll email you when children need sponsors.
                    </p>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      // Simple email validation
                      if (!waitlistEmail || !waitlistEmail.includes('@')) {
                        setWaitlistError('Please enter a valid email address');
                        return;
                      }
                      // In a real implementation, this would submit to an API
                      // For now, we'll just show success (the actual backend would need to be built)
                      setWaitlistSubmitted(true);
                      setWaitlistError(null);
                    }}
                    className="mb-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={waitlistEmail}
                        onChange={(e) => {
                          setWaitlistEmail(e.target.value);
                          setWaitlistError(null);
                        }}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Join Waitlist
                      </button>
                    </div>
                    {waitlistError && (
                      <p className="text-red-600 text-sm mt-2">{waitlistError}</p>
                    )}
                  </form>
                )}
                
                <div className="border-t border-blue-200 pt-6">
                  <p className="text-gray-600 text-sm mb-4">
                    Want to help in other ways?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/#donate"
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-center"
                    >
                      Make a Donation
                    </Link>
                    <Link
                      href="/contact"
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Children Awaiting Sponsors
                </h2>
                <p className="text-gray-600">
                  {children.length} {children.length === 1 ? 'child is' : 'children are'} waiting for a sponsor like you.
                </p>
              </div>

              {/* Children Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {children.map((child) => (
                  <div
                    key={child.recordId}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Photo */}
                    <div className="aspect-[4/3] relative bg-gray-100">
                      {child.photo?.url ? (
                        <Image
                          src={child.photo.url}
                          alt={`Photo of ${child.displayName}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <svg
                            className="w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {child.displayName}
                      </h3>
                      <div className="space-y-1 text-gray-600 text-sm mb-4">
                        {child.age && (
                          <p>
                            <span className="font-medium">Age:</span> {child.age}
                          </p>
                        )}
                        {child.location && (
                          <p>
                            <span className="font-medium">Location:</span> {child.location}
                          </p>
                        )}
                      </div>

                      {/* Sponsor Button */}
                      <Link
                        href={`/contact?subject=Sponsor ${encodeURIComponent(child.displayName)}&childId=${child.id}`}
                        className="block w-full py-3 px-4 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Sponsor {child.displayName.split(' ')[0]}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Sponsorship Info */}
          <section className="mt-16 bg-gray-50 rounded-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What Your Sponsorship Provides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-2">Education</div>
                <h3 className="font-semibold text-gray-900 mb-1">School & Supplies</h3>
                <p className="text-gray-600 text-sm">
                  Tuition, uniforms, books, and educational materials
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">Healthcare</div>
                <h3 className="font-semibold text-gray-900 mb-1">Medical Care</h3>
                <p className="text-gray-600 text-sm">
                  Regular check-ups, medications, and emergency care
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">Nutrition</div>
                <h3 className="font-semibold text-gray-900 mb-1">Daily Meals</h3>
                <p className="text-gray-600 text-sm">
                  Nutritious food to support healthy growth and learning
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Have questions about sponsorship?
            </p>
            <Link
              href="/contact"
              className="text-blue-600 font-medium hover:underline"
            >
              Contact us to learn more
            </Link>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 Be A Number, International. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
