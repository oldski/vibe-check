'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, X, User, Sparkles, Loader2 } from 'lucide-react';
import { useSearch, type SearchUser, type SearchVibe } from '@/hooks/useSearch';
import { useTheme } from 'next-themes';
import { getVibeStyles } from '@/lib/getVibeStyles';
import { cn } from '@/lib/utils';

// All vibes from vibeClassMap - match the vibe_type values in the database
const EMOTIONS = [
	'happy',
	'angry',
	'chill',
	'reflective',
	'appreciative',
	'motivated',
	'playful',
	'inspired',
	'optimistic',
	'loved',
	'lonely',
	'melancholy',
	'anxious',
	'overwhelmed',
	'tired',
	'brat',
];

export default function DiscoverySearch() {
	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
	const [activeTab, setActiveTab] = useState<'all' | 'users' | 'vibes'>('all');

	const {
		query,
		setQuery,
		emotion,
		searchByEmotion,
		results,
		isLoading,
		clearSearch,
		hasResults,
	} = useSearch({ type: 'all', limit: 15 });

	const showResults = query.length >= 2 || emotion !== null;
	const filteredUsers = activeTab === 'vibes' ? [] : results.users;
	const filteredVibes = activeTab === 'users' ? [] : results.vibes;

	return (
		<div className="w-full max-w-2xl mx-auto mb-8">
			{/* Search Input */}
			<div className="relative">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
				<input
					type="text"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						if (emotion) searchByEmotion(null); // Clear emotion when typing
					}}
					placeholder="Search users and vibes..."
					className="w-full pl-12 pr-12 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
				/>
				{(query || emotion) && (
					<button
						onClick={clearSearch}
						className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
					>
						<X className="size-4 text-muted-foreground" />
					</button>
				)}
			</div>

			{/* Emotion Filter Chips */}
			<div className="mt-3 flex flex-wrap gap-2">
				<span className="text-xs text-muted-foreground self-center mr-1">Browse by vibe:</span>
				{EMOTIONS.map((emotionType) => {
					const vibeStyles = getVibeStyles(emotionType, currentTheme);
					const isSelected = emotion === emotionType;
					return (
						<button
							key={emotionType}
							onClick={() => searchByEmotion(isSelected ? null : emotionType)}
							className={cn(
								"px-3 py-1 text-xs font-medium rounded-full transition-all capitalize",
								isSelected
									? cn(vibeStyles?.bg, vibeStyles?.text, "ring-2 ring-offset-2 ring-offset-background")
									: "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
							)}
						>
							{emotionType}
						</button>
					);
				})}
			</div>

			{/* Results Dropdown */}
			<AnimatePresence>
				{showResults && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className="mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden max-h-[60vh] overflow-y-auto"
					>
						{/* Active emotion indicator */}
						{emotion && (
							<div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center justify-between">
								<span className="text-sm">
									Showing <span className="font-medium capitalize">{emotion}</span> vibes
								</span>
								<button
									onClick={() => searchByEmotion(null)}
									className="text-xs text-muted-foreground hover:text-foreground"
								>
									Clear filter
								</button>
							</div>
						)}

						{/* Tabs (hide when filtering by emotion since it only returns vibes) */}
						{!emotion && (
							<div className="flex border-b border-border sticky top-0 bg-card z-10">
								<button
									onClick={() => setActiveTab('all')}
									className={cn(
										"flex-1 px-4 py-2 text-sm font-medium transition-colors",
										activeTab === 'all'
											? "border-b-2 border-foreground text-foreground"
											: "text-muted-foreground hover:text-foreground"
									)}
								>
									All
								</button>
								<button
									onClick={() => setActiveTab('users')}
									className={cn(
										"flex-1 px-4 py-2 text-sm font-medium transition-colors",
										activeTab === 'users'
											? "border-b-2 border-foreground text-foreground"
											: "text-muted-foreground hover:text-foreground"
									)}
								>
									Users ({results.users.length})
								</button>
								<button
									onClick={() => setActiveTab('vibes')}
									className={cn(
										"flex-1 px-4 py-2 text-sm font-medium transition-colors",
										activeTab === 'vibes'
											? "border-b-2 border-foreground text-foreground"
											: "text-muted-foreground hover:text-foreground"
									)}
								>
									Vibes ({results.vibes.length})
								</button>
							</div>
						)}

						{/* Loading State */}
						{isLoading && (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="size-6 animate-spin text-muted-foreground" />
							</div>
						)}

						{/* No Results */}
						{!isLoading && !hasResults && (query.length >= 2 || emotion) && (
							<div className="py-8 text-center text-muted-foreground">
								<Search className="size-8 mx-auto mb-2 opacity-50" />
								<p>
									{emotion
										? `No ${emotion} vibes found yet`
										: `No results found for "${query}"`}
								</p>
							</div>
						)}

						{/* Results */}
						{!isLoading && hasResults && (
							<div className="divide-y divide-border">
								{/* Users Section */}
								{filteredUsers.length > 0 && (
									<div>
										{activeTab === 'all' && (
											<div className="px-4 py-2 bg-muted/30 text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
												<User className="size-3" />
												Users
											</div>
										)}
										{filteredUsers.map((user) => (
											<UserResult key={user.id} user={user} onSelect={clearSearch} />
										))}
									</div>
								)}

								{/* Vibes Section */}
								{filteredVibes.length > 0 && (
									<div>
										{activeTab === 'all' && !emotion && (
											<div className="px-4 py-2 bg-muted/30 text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
												<Sparkles className="size-3" />
												Vibes
											</div>
										)}
										{filteredVibes.map((vibe) => (
											<VibeResult
												key={vibe.id}
												vibe={vibe}
												theme={currentTheme}
												onSelect={clearSearch}
											/>
										))}
									</div>
								)}
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

// User Result Item
function UserResult({ user, onSelect }: { user: SearchUser; onSelect: () => void }) {
	return (
		<Link
			href={`/v/${user.handle}`}
			onClick={onSelect}
			className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
		>
			{user.avatar_url ? (
				<img
					src={user.avatar_url}
					alt={user.display_name || user.handle}
					className="size-10 rounded-full object-cover"
				/>
			) : (
				<div className="size-10 rounded-full bg-muted flex items-center justify-center font-bold">
					{(user.display_name || user.handle).charAt(0).toUpperCase()}
				</div>
			)}
			<div className="flex-1 min-w-0">
				<p className="font-medium truncate">
					{user.display_name || user.handle}
				</p>
				<p className="text-sm text-muted-foreground truncate">
					@{user.handle}
				</p>
			</div>
		</Link>
	);
}

// Vibe Result Item
function VibeResult({
	vibe,
	theme,
	onSelect,
}: {
	vibe: SearchVibe;
	theme: 'light' | 'dark';
	onSelect: () => void;
}) {
	const vibeStyles = getVibeStyles(vibe.vibe.vibe_type, theme);

	return (
		<Link
			href={`/v/${vibe.profile.handle}/${vibe.id}`}
			onClick={onSelect}
			className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
		>
			{/* Vibe color indicator */}
			<div
				className={cn(
					"size-10 rounded-lg flex items-center justify-center text-xs font-bold uppercase shrink-0",
					vibeStyles?.bg,
					vibeStyles?.text
				)}
			>
				{vibe.vibe.vibe_type.slice(0, 2)}
			</div>

			<div className="flex-1 min-w-0">
				<p className="text-sm line-clamp-2">{vibe.message}</p>
				<div className="flex items-center gap-2 mt-1">
					<span className="text-xs text-muted-foreground">
						@{vibe.profile.handle}
					</span>
					<span className="text-xs text-muted-foreground">
						{new Date(vibe.vibe_date).toLocaleDateString()}
					</span>
				</div>
			</div>
		</Link>
	);
}
