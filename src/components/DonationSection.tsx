'use client';

import { useState, useEffect } from 'react';

interface DonationSectionProps {
  donorboxUrl?: string;
}

export function DonationSection({ donorboxUrl = 'https://donorbox.org/beanumber' }: DonationSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number | undefined>(undefined);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleDonate = (amount?: number) => {
    setDonationAmount(amount);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDonationAmount(undefined);
  };

  // Build Donorbox URL with amount parameter
  const getDonorboxUrl = () => {
    const params = new URLSearchParams();
    if (donationAmount) {
      params.set('amount', donationAmount.toString());
    }
    return `${donorboxUrl}${params.toString() ? '?' + params.toString() : ''}`;
  };

  return (
    <section id="donate" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900 text-white p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-center">Support Our Work</h2>
          <p className="text-gray-200 mb-12 max-w-2xl mx-auto text-center leading-relaxed">
            Your investment supports sustainable systems that generate measurable, long-term outcomes. 96–97% of all funding directly supports programs and community impact. We operate with a lean administrative structure and report all outcomes and financials annually.
          </p>
          
          {/* Donation Tiers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button 
              onClick={() => handleDonate(25)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-md p-4 text-center transition-colors"
            >
              <div className="text-2xl font-bold mb-2">$25</div>
              <div className="text-sm text-gray-200 leading-snug">Covers school supplies for 5 students for one term</div>
            </button>
            <button 
              onClick={() => handleDonate(50)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-md p-4 text-center transition-colors"
            >
              <div className="text-2xl font-bold mb-2">$50</div>
              <div className="text-sm text-gray-200 leading-snug">Covers malaria treatment for 3 families</div>
            </button>
            <button 
              onClick={() => handleDonate(100)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-md p-4 text-center transition-colors"
            >
              <div className="text-2xl font-bold mb-2">$100</div>
              <div className="text-sm text-gray-200 leading-snug">Funds complete vocational training for 1 person</div>
            </button>
            <button 
              onClick={() => handleDonate(250)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-md p-4 text-center transition-colors"
            >
              <div className="text-2xl font-bold mb-2">$250</div>
              <div className="text-sm text-gray-200 leading-snug">Covers one month's salary for a local teacher</div>
            </button>
          </div>
          
          <p className="text-center text-gray-300 text-sm mb-8">You may also choose your own amount.</p>
          
          <div className="text-center mb-8">
            <button
              onClick={() => handleDonate()}
              className="inline-block px-8 py-4 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Donate
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

      {/* Donorbox Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close donation form"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Donorbox iframe */}
            <div className="w-full h-[90vh] overflow-auto">
              <iframe
                src={getDonorboxUrl()}
                className="w-full h-full border-0"
                title="Donation Form"
                allow="payment"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
