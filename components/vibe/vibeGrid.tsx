'use client'

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import type { DailyVibe, Vibe, Profile, FollowCounts } from '@/lib/types'
import { useTheme } from "next-themes";
import { format, parseISO } from "date-fns";
import { Calendar, Music, Loader2 } from "lucide-react";
import Link from "next/link";
import { getVibeStyles } from '@/lib/getVibeStyles';
import { cn } from "@/lib/utils";
import { useVibesSafe } from '@/contexts/vibesContext';
import VibeFiltersComponent from './vibeFilters';
import ProfileGridCard from './profileGridCard';

type VibeGridProps = {
	vibes: Vibe[];
	handle: string;
	profile: Profile;
	initialVibes?: DailyVibe[];
	showFilters?: boolean;
	currentUserId?: string | null;
	isOwner?: boolean;
	initialIsFollowing?: boolean;
	initialFollowCounts?: FollowCounts;
}

export default function VibeGrid({
	vibes,
	handle,
	profile,
	initialVibes = [],
	showFilters = true,
	currentUserId,
	isOwner = false,
	initialIsFollowing = false,
	initialFollowCounts = { followers: 0, following: 0 },
}: VibeGridProps) {
	// Use context for optimistic updates, fall back to initialVibes for SSR
	const vibesContext = useVibesSafe();
	const allVibes = vibesContext?.vibes ?? initialVibes;
	const isLoading = vibesContext?.isLoading ?? false;
	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

	// Filtered vibes state
	const [filteredVibes, setFilteredVibes] = useState<DailyVibe[] | null>(null);

	// Handle filter changes
	const handleFilterChange = useCallback((filtered: DailyVibe[]) => {
		// Only set filtered if different from all vibes
		if (filtered.length === allVibes.length) {
			setFilteredVibes(null);
		} else {
			setFilteredVibes(filtered);
		}
	}, [allVibes.length]);

	// Use filtered vibes if available, otherwise all vibes
	const displayVibes = filteredVibes ?? allVibes;
	const isFiltered = filteredVibes !== null;

	return (
		<div className="relative">
			{/* Loading overlay for optimistic updates */}
			<AnimatePresence>
				{isLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
					>
						<Loader2 className="size-4 animate-spin" />
						<span className="text-sm font-medium">Saving...</span>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Floating Filter FAB & Panel */}
			{showFilters && allVibes.length > 0 && (
				<VibeFiltersComponent
					vibes={allVibes}
					vibeTypes={vibes}
					onFilterChange={handleFilterChange}
				/>
			)}

			{/* Filter status indicator */}
			<AnimatePresence>
				{isFiltered && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
					>
						<p className="text-sm font-medium">
							{displayVibes.length === 0
								? 'No vibes match your filters'
								: `Showing ${displayVibes.length} of ${allVibes.length} vibes`}
						</p>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row w-full">
				{/* Profile Card - always first */}
				<ProfileGridCard
					profileId={profile.id}
					handle={handle}
					displayName={profile.display_name}
					avatarUrl={profile.avatar_url}
					bio={profile.bio}
					dailyVibes={allVibes}
					isOwner={isOwner}
					currentUserId={currentUserId}
					initialIsFollowing={initialIsFollowing}
					initialFollowCounts={initialFollowCounts}
				/>

				<AnimatePresence>
					{displayVibes.map((entry) => {
						const vibeStyle = getVibeStyles(entry.vibe.vibe_type, currentTheme)
						const isOptimistic = entry.id.startsWith('temp-')
						return (
							<Link
								key={entry.id}
								href={`/v/${handle}/${entry.id}`}
								scroll={false}
								shallow={true}
								prefetch={false}
							>
								<motion.div
									key={entry.id}
									layout
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: isOptimistic ? 0.7 : 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{
										delay: isOptimistic ? 0 : Math.random() * 0.3,
										duration: 0.4,
										ease: 'easeOut',
									}}
									whileTap={{ scale: 0.98 }}
									className={cn(
										"relative group aspect-square w-full overflow-hidden shadow-md hover:shadow-xl transition-shadow will-change-transform isolate",
										isOptimistic && "animate-pulse"
									)}
								>
									{/* Image background (blurred) */}
									{entry.media ? (
										<div
											className="absolute inset-0 z-0 bg-cover bg-center scale-105 blur-sm group-hover:blur-0 transition-transform duration-500 ease-out group-hover:scale-110"
											style={{ backgroundImage: `url(${entry.media})` }}
										/>
									) : (
										<div
											className="absolute inset-0 z-0 bg-white"
										/>
									)}

									{/* Color overlay */}
									<div
										className={
										cn(
											"absolute inset-0 z-10 mix-blend-multiply pointer-events-none transition-opacity duration-500 ease-in-out",
											currentTheme === 'light' ? `bg-${entry.vibe.vibe_type.toLowerCase()}-400` : `bg-${entry.vibe.vibe_type.toLowerCase()}-900`,
										)
									}
										style={{ opacity: 0.85 }}
									/>

									{/* Foreground content */}
									<div className={cn(
										"relative z-20 p-4 h-full flex flex-col justify-end",
										vibeStyle?.text,
									)}>
										{/* Date - above message */}
										<div className="flex flex-row items-center gap-2 mb-2">
											<Calendar size={14} className="opacity-60" />
											<div className="text-xs opacity-60 font-medium">
												{format(parseISO(entry.vibe_date), 'MMMM d, yyyy')}
											</div>
										</div>

										{/* Message */}
										<div className="font-semibold tracking-tight text-xl sm:text-2xl md:text-3xl mb-2 line-clamp-3">
											{entry.message}
										</div>

										{/* Bottom row: vibe type + audio indicator */}
										<div className="flex items-center justify-between">
											<div className="transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-90 transition duration-300 ease-out">
												<div className="text-xs tracking-widest uppercase font-bold opacity-30 line-clamp-3">
													{entry.vibe.vibe_type}
												</div>
											</div>
											<motion.div
												whileHover={{
													scale: 1.1,
													opacity: 1,
												}}
												transition={{
													type: 'spring',
													stiffness: 200,
													damping: 20
												}}
												className="inline-block"
											>
												{entry.audio && <Music />}
											</motion.div>
										</div>
									</div>
								</motion.div>
							</Link>
						)
					})}
				</AnimatePresence>
			</div>
		</div>
	)
}
