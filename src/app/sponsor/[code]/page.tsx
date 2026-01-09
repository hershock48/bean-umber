import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import Image from 'next/image';
import { SponsorDashboard } from '@/components/SponsorDashboard';

async function getSponsorSession(code: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('sponsor_session');

  if (!sessionCookie) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      return null;
    }

    // Verify sponsor code matches
    if (session.sponsorCode !== code) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export default async function SponsorPage({ params }: { params: { code: string } }) {
  const session = await getSponsorSession(params.code);

  if (!session) {
    redirect('/sponsor/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-8 w-8 text-gray-900" />
              <span className="text-xl font-semibold text-gray-900">Be A Number</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Sponsor Code: {params.code}</span>
              <form action="/api/sponsor/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <SponsorDashboard sponsorCode={params.code} email={session.email} />
    </div>
  );
}
