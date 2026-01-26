'use client';

import { useState, useEffect } from 'react';

interface DonationSectionProps {}

export function DonationSection({}: DonationSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isMonthly, setIsMonthly] = useState(true);

  // Reset loading state when component mounts or page becomes visible
  // This handles the case when user clicks back from Stripe Checkout
  useEffect(() => {
    // Reset loading state on mount
    setIsLoading(false);

    // Handle page visibility - reset if user comes back to the page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsLoading(false);
      }
    };

    // Handle focus - reset if user comes back to the tab/window
    const handleFocus = () => {
      setIsLoading(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleDonate = async (amount?: number) => {
    const donationAmount = amount || (customAmount ? parseFloat(customAmount) : null);
    const MAX_DONATION_AMOUNT = 10000; // $10,000 maximum per transaction
    
    if (!donationAmount || donationAmount < 1) {
      alert('Please enter a valid donation amount (minimum $1)');
      return;
    }
    
    if (donationAmount > MAX_DONATION_AMOUNT) {
      alert(`Donation amount exceeds maximum of $${MAX_DONATION_AMOUNT.toLocaleString()}. Please contact us for larger donations.`);
      return;
    }

    setIsLoading(true);

    try {
      // Create Stripe Checkout Session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: donationAmount,
          isMonthly: isMonthly,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Donation error:', error);
      alert(error.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <section id="donate" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900 text-white p-6 sm:p-8 md:p-12 rounded-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Support Our Work</h2>
          <p className="text-gray-200 mb-12 max-w-2xl mx-auto text-center leading-relaxed">
            Your investment supports sustainable systems that generate measurable, long-term outcomes. 96–97% of all funding directly supports programs and community impact. We operate with a lean administrative structure and report all outcomes and financials annually.
          </p>
          
          {/* Donation Frequency Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setIsMonthly(false)}
              className={`px-6 py-2 rounded-md font-medium transition-colors cursor-pointer ${
                !isMonthly
                  ? 'bg-white text-gray-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              One-time
            </button>
            <button
              onClick={() => setIsMonthly(true)}
              className={`relative px-6 py-2 rounded-md font-medium transition-colors cursor-pointer ${
                isMonthly
                  ? 'bg-white text-gray-900 ring-2 ring-white ring-offset-2 ring-offset-gray-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {/* Recommended badge */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Most Impact
              </span>
              Monthly
            </button>
          </div>
          
          {/* Monthly benefit callout */}
          {isMonthly && (
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mb-8 max-w-lg mx-auto text-center">
              <p className="text-green-200 text-sm">
                <span className="font-semibold">Monthly donors</span> provide predictable funding that helps us plan long-term programs and sustain local jobs.
              </p>
            </div>
          )}

          {/* Donation Tiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button 
              onClick={() => handleDonate(25)}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-md p-3 sm:p-4 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <div className="text-xl sm:text-2xl font-bold mb-2">$25</div>
              <div className="text-xs sm:text-sm text-gray-200 leading-snug">Covers school supplies for 5 students for one term</div>
            </button>
            <button 
              onClick={() => handleDonate(50)}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-md p-3 sm:p-4 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <div className="text-xl sm:text-2xl font-bold mb-2">$50</div>
              <div className="text-xs sm:text-sm text-gray-200 leading-snug">Covers malaria treatment for 3 families</div>
            </button>
            <button 
              onClick={() => handleDonate(100)}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-md p-3 sm:p-4 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <div className="text-xl sm:text-2xl font-bold mb-2">$100</div>
              <div className="text-xs sm:text-sm text-gray-200 leading-snug">Funds complete vocational training for 1 person</div>
            </button>
            <button 
              onClick={() => handleDonate(250)}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-md p-3 sm:p-4 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <div className="text-xl sm:text-2xl font-bold mb-2">$250</div>
              <div className="text-xs sm:text-sm text-gray-200 leading-snug">Covers one month's salary for a local teacher</div>
            </button>
          </div>
          
          <p className="text-center text-gray-300 text-sm mb-6">You may also choose your own amount.</p>
          
          {/* Custom Amount Input */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2">
              <span className="text-white text-lg">$</span>
              <input
                type="number"
                min="1"
                max="10000"
                step="0.01"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 w-32"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => handleDonate()}
              disabled={isLoading}
              className="px-8 py-4 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Donate'}
            </button>
          </div>
          
          {/* What happens after donation */}
          <div className="border-t border-white/20 pt-8 mt-8">
            <h3 className="text-lg font-semibold mb-4 text-center">What happens after you donate</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-200">
              <div className="text-center">
                <div className="font-semibold mb-2 text-white">1. Receipt & Confirmation</div>
                <div>You receive an immediate tax-deductible receipt via email.</div>
              </div>
              <div className="text-center">
                <div className="font-semibold mb-2 text-white">2. Program Impact</div>
                <div>The vast majority of your contribution directly supports health, education, workforce development, and economic programs in Northern Uganda, with minimal overhead to sustain long-term operations and accountability.</div>
              </div>
              <div className="text-center">
                <div className="font-semibold mb-2 text-white">3. Impact Updates</div>
                <div>We share quarterly updates on how your contribution is creating lasting change.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
