'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function SponsorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sponsorCode, setSponsorCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/sponsor/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, sponsorCode }),
      });

      const data = await response.json();

      console.log('Verify response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or sponsor code');
      }

      if (!data.sponsorCode) {
        throw new Error('No sponsor code returned from server');
      }

      // Redirect to sponsor dashboard
      console.log('Redirecting to:', `/sponsor/${data.sponsorCode}`);
      router.push(`/sponsor/${data.sponsorCode}`);
      // Also try window.location as fallback
      setTimeout(() => {
        window.location.href = `/sponsor/${data.sponsorCode}`;
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to verify. Please check your email and sponsor code.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-8 w-8 text-gray-900" />
            <span className="text-xl font-semibold text-gray-900">Be A Number</span>
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sponsor Portal</h1>
            <p className="text-gray-600">
              Access updates about the child you support
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="sponsorCode" className="block text-sm font-medium text-gray-700 mb-2">
                Sponsor Code
              </label>
              <input
                type="text"
                id="sponsorCode"
                value={sponsorCode}
                onChange={(e) => setSponsorCode(e.target.value.toUpperCase())}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono"
                placeholder="BAN-2025-001"
                pattern="BAN-[0-9]{4}-[0-9]{3}"
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: BAN-YYYY-XXX (e.g., BAN-2025-001)
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Access Portal'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Don't have your sponsor code?{' '}
              <Link href="/contact" className="text-gray-900 font-medium hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>What is a Sponsor Code?</strong> Your unique sponsor code was sent to you when you began sponsoring a child. 
            It connects you to your sponsored child's updates and progress reports.
          </p>
        </div>
      </div>
    </div>
  );
}
