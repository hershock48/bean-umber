'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Update {
  id: string;
  date: string;
  type: string;
  title: string;
  content: string;
  photos: string[];
}

interface ChildInfo {
  name: string;
  photo?: string;
  age?: string;
  location?: string;
  sponsorshipStartDate?: string;
}

interface SponsorDashboardProps {
  sponsorCode: string;
  email: string;
}

export function SponsorDashboard({ sponsorCode, email }: SponsorDashboardProps) {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nextRequestEligibleAt, setNextRequestEligibleAt] = useState<string | null>(null);
  const [canRequestUpdate, setCanRequestUpdate] = useState(false);

  useEffect(() => {
    loadSponsorData();
  }, [sponsorCode]);

  async function loadSponsorData() {
    try {
      const response = await fetch(`/api/sponsor/updates?sponsorCode=${sponsorCode}`);
      const data = await response.json();

      if (response.ok) {
        setUpdates(data.updates || []);
        setChildInfo(data.childInfo || null);
        setNextRequestEligibleAt(data.nextRequestEligibleAt);
        
        // Check if can request update using NextRequestEligibleAt
        if (data.nextRequestEligibleAt) {
          const eligibleDate = new Date(data.nextRequestEligibleAt);
          setCanRequestUpdate(new Date() >= eligibleDate);
        } else {
          setCanRequestUpdate(true);
        }
      }
    } catch (error) {
      console.error('Failed to load sponsor data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRequestUpdate() {
    if (!canRequestUpdate) return;

    try {
      const response = await fetch('/api/sponsor/request-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sponsorCode, email }),
      });

      if (response.ok) {
        alert('Update request submitted! Our field team will prepare an update for you.');
        // Reload data to get updated NextRequestEligibleAt
        await loadSponsorData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      alert('Failed to submit request. Please try again.');
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const daysUntilCanRequest = nextRequestEligibleAt
    ? Math.max(0, Math.ceil((new Date(nextRequestEligibleAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Child Profile Header */}
      {childInfo && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {childInfo.photo && (
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  src={childInfo.photo}
                  alt={childInfo.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {childInfo.name}
              </h1>
              {childInfo.age && (
                <p className="text-gray-600 mb-1">Age: {childInfo.age}</p>
              )}
              {childInfo.location && (
                <p className="text-gray-600 mb-1">Location: {childInfo.location}</p>
              )}
              {childInfo.sponsorshipStartDate && (
                <p className="text-sm text-gray-500 mt-2">
                  Sponsorship started: {new Date(childInfo.sponsorshipStartDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request Update Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Request an Update
            </h2>
            <p className="text-sm text-gray-600">
              {canRequestUpdate
                ? 'You can request a new update about your sponsored child.'
                : `You can request your next update in ${daysUntilCanRequest} days.`}
            </p>
          </div>
          <button
            onClick={handleRequestUpdate}
            disabled={!canRequestUpdate}
            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Request Update
          </button>
        </div>
      </div>

      {/* Updates Feed */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates</h2>

        {updates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 mb-4">
              No updates yet. Check back soon or request an update above.
            </p>
          </div>
        ) : (
          updates.map((update) => (
            <div key={update.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-2">
                      {update.type}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{update.title}</h3>
                  </div>
                  <time className="text-sm text-gray-500">
                    {new Date(update.date).toLocaleDateString()}
                  </time>
                </div>

                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {update.content}
                  </p>
                </div>

                {update.photos && update.photos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {update.photos.map((photo, idx) => (
                      <div key={idx} className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src={photo}
                          alt={`Update photo ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
