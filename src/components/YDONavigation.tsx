'use client';

import { useState } from 'react';
import Link from 'next/link';

interface YDONavigationProps {
  currentPath?: string;
}

export function YDONavigation({ currentPath }: YDONavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/ydo/about', label: 'About' },
    { href: '/ydo/programs', label: 'Programs' },
    { href: '/ydo/partnership', label: 'Partnership' },
    { href: '/ydo/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => currentPath === href;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-green-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/ydo" className="flex items-center gap-3">
            <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">YDO</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Youth Development Organisation</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive(link.href)
                    ? 'text-green-700 font-medium'
                    : 'text-gray-700 hover:text-green-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 p-2 -mr-2"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-green-100 pt-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive(link.href)
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* BAN relationship indicator */}
              <div className="mt-3 pt-3 border-t border-green-100">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Be A Number
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
