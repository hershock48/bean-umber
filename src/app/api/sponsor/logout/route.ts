import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('sponsor_session');
  
  return NextResponse.redirect(new URL('/sponsor/login', process.env.NEXT_PUBLIC_SITE_URL || 'https://www.beanumber.org'));
}
