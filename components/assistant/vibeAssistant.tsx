'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
	Sparkles,
	Music,
	MessageCircle,
	TrendingUp,
	RefreshCw,
	ChevronRight,
	Flame,
	X,
} from 'lucide-react';
import { getVibeStyles } from '@/lib/getVibeStyles';
import { cn } from '@/lib/utils';

type AssistantData = {
	moodInsight: string;
	songSuggestion: {
		title: string;
		artist: string;
		spotifyId: string;
	};
	reflectionPrompt: string;
	dominantVibe: string;
	mostRecentVibe: string;
	vibeCount: number;
	streak: number;
	timeOfDay: string;
	patterns: { vibe: string; count: number }[];
};

export default function VibeAssistant() {
	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
	const [data, setData] = useState<AssistantData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<'insight' | 'song' | 'prompt'>('insight');
	const [isExpanded, setIsExpanded] = useState(false);

	const fetchAssistant = async () => {
		try {
			setError(null);
			const response = await fetch('/api/assistant');
			if (response.ok) {
				const result = await response.json();
				setData(result);
			} else {
				const errorData = await response.json().catch(() => ({}));
				setError(errorData.error || `Error: ${response.status}`);
			}
		} catch (err) {
			console.error('Failed to fetch assistant data:', err);
			setError('Failed to load assistant');
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	};

	useEffect(() => {
		fetchAssistant();
	}, []);

	const handleRefresh = () => {
		setIsRefreshing(true);
		fetchAssistant();
	};

	if (isLoading) {
		return (
			<div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-border rounded-2xl p-6">
				<div className="flex items-center gap-3 mb-4">
					<div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
						<Sparkles className="size-5 text-white" />
					</div>
					<div>
						<h3 className="font-semibold">Vibe Assistant</h3>
						<p className="text-sm text-muted-foreground">Loading your insights...</p>
					</div>
				</div>
				<div className="space-y-3 animate-pulse">
					<div className="h-4 bg-muted rounded w-3/4" />
					<div className="h-4 bg-muted rounded w-1/2" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-border rounded-2xl p-6">
				<div className="flex items-center gap-3 mb-4">
					<div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
						<Sparkles className="size-5 text-white" />
					</div>
					<div>
						<h3 className="font-semibold">Vibe Assistant</h3>
						<p className="text-sm text-muted-foreground">{error}</p>
					</div>
				</div>
				<button
					onClick={handleRefresh}
					className="text-sm text-purple-500 hover:underline"
				>
					Try again
				</button>
			</div>
		);
	}

	if (!data) {
		return null;
	}

	const vibeStyles = getVibeStyles(data.mostRecentVibe, currentTheme);

	return (
		<motion.div
			layout
			className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-border rounded-2xl overflow-hidden"
		>
			{/* Header */}
			<div className="p-4 border-b border-border/50">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
							<Sparkles className="size-5 text-white" />
						</div>
						<div>
							<h3 className="font-semibold">Vibe Assistant</h3>
							<p className="text-xs text-muted-foreground">
								Personalized for your {data.timeOfDay} vibe
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{data.streak > 0 && (
							<div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-500 rounded-full text-xs font-medium">
								<Flame className="size-3" />
								{data.streak} day streak
							</div>
						)}
						<button
							onClick={handleRefresh}
							disabled={isRefreshing}
							className="p-2 hover:bg-muted rounded-full transition-colors"
						>
							<RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
						</button>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex border-b border-border/50">
				<button
					onClick={() => setActiveTab('insight')}
					className={cn(
						"flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
						activeTab === 'insight'
							? "border-b-2 border-purple-500 text-purple-500"
							: "text-muted-foreground hover:text-foreground"
					)}
				>
					<TrendingUp className="size-4" />
					Mood Insight
				</button>
				<button
					onClick={() => setActiveTab('song')}
					className={cn(
						"flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
						activeTab === 'song'
							? "border-b-2 border-pink-500 text-pink-500"
							: "text-muted-foreground hover:text-foreground"
					)}
				>
					<Music className="size-4" />
					Song
				</button>
				<button
					onClick={() => setActiveTab('prompt')}
					className={cn(
						"flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
						activeTab === 'prompt'
							? "border-b-2 border-blue-500 text-blue-500"
							: "text-muted-foreground hover:text-foreground"
					)}
				>
					<MessageCircle className="size-4" />
					Reflect
				</button>
			</div>

			{/* Content */}
			<div className="p-4">
				<AnimatePresence mode="wait">
					{activeTab === 'insight' && (
						<motion.div
							key="insight"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
						>
							<p className="text-sm leading-relaxed mb-4">{data.moodInsight}</p>

							{/* Vibe patterns */}
							{data.patterns.length > 0 && (
								<div className="mt-4 pt-4 border-t border-border/50">
									<p className="text-xs text-muted-foreground mb-2">Your recent vibes:</p>
									<div className="flex flex-wrap gap-2">
										{data.patterns.map(({ vibe, count }) => {
											const styles = getVibeStyles(vibe, currentTheme);
											return (
												<span
													key={vibe}
													className={cn(
														"px-2 py-1 text-xs rounded-full capitalize",
														styles?.bg,
														styles?.text
													)}
												>
													{vibe} ({count})
												</span>
											);
										})}
									</div>
								</div>
							)}
						</motion.div>
					)}

					{activeTab === 'song' && (
						<motion.div
							key="song"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
						>
							<p className="text-xs text-muted-foreground mb-3">
								Based on your {data.mostRecentVibe} vibe:
							</p>
							<a
								href={`https://open.spotify.com/track/${data.songSuggestion.spotifyId}`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
							>
								<div className="size-12 rounded bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
									<Music className="size-6 text-white" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-medium truncate">{data.songSuggestion.title}</p>
									<p className="text-sm text-muted-foreground truncate">
										{data.songSuggestion.artist}
									</p>
								</div>
								<ChevronRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
							</a>
							<p className="text-xs text-muted-foreground mt-3 text-center">
								Open in Spotify
							</p>
						</motion.div>
					)}

					{activeTab === 'prompt' && (
						<motion.div
							key="prompt"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="text-center py-4"
						>
							<p className="text-xs text-muted-foreground mb-3">Something to think about:</p>
							<p className="text-lg font-medium italic">"{data.reflectionPrompt}"</p>
							<p className="text-xs text-muted-foreground mt-4">
								Consider this for your next vibe check
							</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	);
}
