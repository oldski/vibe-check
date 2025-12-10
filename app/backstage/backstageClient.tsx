'use client';

import { useState } from 'react';
import { Profile, ProfileStats } from '@/lib/types';
import BackstageProfile from '@/components/backstage/backstageProfile';
import BackstageStats from '@/components/backstage/backstageStats';
import BackstageConnections from '@/components/backstage/backstageConnections';
import BackstageAccount from '@/components/backstage/backstageAccount';
import { useRouter } from 'next/navigation';

type BackstageClientProps = {
	profile: Profile;
	stats: ProfileStats;
	email: string;
};

export default function BackstageClient({ profile: initialProfile, stats, email }: BackstageClientProps) {
	const router = useRouter();
	const [profile, setProfile] = useState(initialProfile);

	const handleProfileUpdate = (updatedProfile: Profile) => {
		setProfile(updatedProfile);
		// Refresh the page data if handle changed
		if (updatedProfile.handle !== initialProfile.handle) {
			router.refresh();
		}
	};

	return (
		<div className="space-y-8">
			{/* Profile Section */}
			<BackstageProfile
				profile={profile}
				onProfileUpdate={handleProfileUpdate}
			/>

			{/* Stats Section */}
			<BackstageStats stats={stats} />

			{/* Connected Services */}
			<BackstageConnections />

			{/* Account Settings */}
			<BackstageAccount email={email} />
		</div>
	);
}
