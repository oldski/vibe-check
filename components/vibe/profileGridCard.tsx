'use client'

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getVibeStyles } from '@/lib/getVibeStyles';
import FollowButton from '@/components/ui/followButton';
import type { DailyVibe, FollowCounts } from '@/lib/types';

type ProfileGridCardProps = {
	profileId: string;
	handle: string;
	displayName: string | null;
	avatarUrl: string | null;
	bio: string | null;
	dailyVibes: DailyVibe[];
	isOwner?: boolean;
	currentUserId?: string | null;
	initialIsFollowing?: boolean;
	initialFollowCounts?: FollowCounts;
};

// Calculate most-used vibe from daily vibes
function getMostUsedVibe(dailyVibes: DailyVibe[]): string | null {
	if (dailyVibes.length === 0) return null;

	const vibeCounts: Record<string, number> = {};
	for (const vibe of dailyVibes) {
		const vibeType = vibe.vibe.vibe_type.toLowerCase();
		vibeCounts[vibeType] = (vibeCounts[vibeType] || 0) + 1;
	}

	let maxCount = 0;
	let mostUsed: string | null = null;
	for (const [vibeType, count] of Object.entries(vibeCounts)) {
		if (count > maxCount) {
			maxCount = count;
			mostUsed = vibeType;
		}
	}

	return mostUsed;
}

export default function ProfileGridCard({
	profileId,
	handle,
	displayName,
	avatarUrl,
	bio,
	dailyVibes,
	isOwner = false,
	currentUserId,
	initialIsFollowing = false,
	initialFollowCounts = { followers: 0, following: 0 },
}: ProfileGridCardProps) {
	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

	// Calculate most-used vibe for background color
	const mostUsedVibe = useMemo(() => getMostUsedVibe(dailyVibes), [dailyVibes]);
	const vibeStyles = getVibeStyles(mostUsedVibe || 'happy', currentTheme);

	// Total vibes count
	const totalVibes = dailyVibes.length;

	// Show follow button only for logged-in non-owners
	const showFollowButton = !isOwner && !!currentUserId;

	return (
		<div className="md:col-span-2 relative">
			<motion.div
				layout
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4, ease: 'easeOut' }}
				className={cn(
					"relative aspect-square md:aspect-[2/1] w-full overflow-hidden shadow-md will-change-transform isolate",
					currentTheme === 'light'
						? `bg-${mostUsedVibe || 'happy'}-400`
						: `bg-${mostUsedVibe || 'happy'}-900`
				)}
			>
				{/* Gradient overlay for depth */}
				<div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

				{/* Content */}
				<div className={cn(
					"relative z-20 p-4 md:p-6 h-full flex flex-col",
					vibeStyles?.text
				)}>
					{/* Top spacer to push content below header */}
					<div className="h-8 md:h-4" />

					{/* Middle: Avatar + Name + Handle + Bio + Actions */}
					<div className="flex-1 flex flex-col justify-center">
						<div className="flex items-center gap-3 md:gap-4">
							{avatarUrl ? (
								<img
									src={avatarUrl}
									alt={displayName || handle}
									className="size-14 md:size-20 rounded-full object-cover border-2 border-white/20 shadow-lg"
								/>
							) : (
								<div className="size-14 md:size-20 rounded-full bg-white/20 flex items-center justify-center text-xl md:text-3xl font-bold border-2 border-white/20 shadow-lg">
									{(displayName || handle).charAt(0).toUpperCase()}
								</div>
							)}
							<div className="flex flex-col min-w-0">
								<span className="font-bold text-xl md:text-3xl tracking-tight truncate">
									{displayName || handle}
								</span>
								<span className="text-sm md:text-base opacity-70">
									@{handle}
								</span>
							</div>
						</div>

						{/* Bio */}
						{bio && (
							<p className="mt-3 text-sm md:text-base opacity-80 line-clamp-2 max-w-xl">
								{bio}
							</p>
						)}

						{/* Action buttons - below bio */}
						<div className="mt-4 flex items-center gap-3">
							{isOwner ? (
								<Link
									href="/backstage"
									className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-sm font-medium"
								>
									<Settings size={16} />
									<span>Backstage</span>
								</Link>
							) : showFollowButton ? (
								<FollowButton
									targetId={profileId}
									initialIsFollowing={initialIsFollowing}
									initialCounts={initialFollowCounts}
									variant="default"
									className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
								/>
							) : null}
						</div>
					</div>

					{/* Bottom: Stats */}
					<div className="flex items-end justify-between mt-auto pt-4">
						{/* Left side: Vibes count + followers */}
						<div className="flex gap-6 md:gap-8">
							<div className="flex flex-col">
								<span className="text-2xl md:text-4xl font-bold tracking-tight">
									{totalVibes}
								</span>
								<span className="text-xs md:text-sm uppercase tracking-widest opacity-60">
									{totalVibes === 1 ? 'vibe' : 'vibes'}
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-2xl md:text-4xl font-bold tracking-tight">
									{initialFollowCounts.followers}
								</span>
								<span className="text-xs md:text-sm uppercase tracking-widest opacity-60">
									{initialFollowCounts.followers === 1 ? 'follower' : 'followers'}
								</span>
							</div>
						</div>

						{/* Right side: Top vibe indicator */}
						{mostUsedVibe && (
							<div className="flex flex-col items-end">
								<span className="text-xs uppercase tracking-widest opacity-50">
									top vibe
								</span>
								<span className="text-sm md:text-lg font-bold uppercase tracking-wider opacity-80">
									{mostUsedVibe}
								</span>
							</div>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
}
