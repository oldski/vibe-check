'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import FollowButton from '@/components/ui/followButton';
import type { ProfileWithFollowStatus } from '@/lib/types';

type DiscoveryCardProps = {
	profile: ProfileWithFollowStatus;
	currentUserId?: string | null;
	index?: number;
};

export default function DiscoveryCard({
	profile,
	currentUserId,
	index = 0,
}: DiscoveryCardProps) {
	const showFollowButton = !!currentUserId && currentUserId !== profile.id;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.05, duration: 0.3 }}
			className="group"
		>
			<div className="relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
				{/* Card Content */}
				<Link href={`/v/${profile.handle}`} className="block p-4">
					{/* Top: Avatar + Info */}
					<div className="flex items-start gap-3">
						{profile.avatar_url ? (
							<img
								src={profile.avatar_url}
								alt={profile.display_name || profile.handle}
								className="size-14 rounded-full object-cover border-2 border-border"
							/>
						) : (
							<div className="size-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold border-2 border-border">
								{(profile.display_name || profile.handle).charAt(0).toUpperCase()}
							</div>
						)}

						<div className="flex-1 min-w-0">
							<h3 className="font-bold text-lg truncate">
								{profile.display_name || profile.handle}
							</h3>
							<p className="text-sm text-muted-foreground truncate">
								@{profile.handle}
							</p>
						</div>
					</div>

					{/* Bio */}
					{profile.bio && (
						<p className="mt-3 text-sm text-muted-foreground line-clamp-2">
							{profile.bio}
						</p>
					)}

					{/* Stats Row */}
					<div className="mt-4 flex items-center gap-4 text-sm">
						<div className="flex items-center gap-1">
							<span className="font-bold">{profile.vibeCount}</span>
							<span className="text-muted-foreground">
								{profile.vibeCount === 1 ? 'vibe' : 'vibes'}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<span className="font-bold">{profile.followerCount}</span>
							<span className="text-muted-foreground">
								{profile.followerCount === 1 ? 'follower' : 'followers'}
							</span>
						</div>
					</div>
				</Link>

				{/* Follow Button - Outside Link to prevent navigation */}
				{showFollowButton && (
					<div className="absolute top-4 right-4">
						<FollowButton
							targetId={profile.id}
							initialIsFollowing={profile.isFollowing}
							initialCounts={{ followers: profile.followerCount, following: 0 }}
							variant="compact"
							className="bg-foreground text-background hover:bg-foreground/90"
						/>
					</div>
				)}
			</div>
		</motion.div>
	);
}
