'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Sparkles,
	Music,
	MessageCircle,
	TrendingUp,
	RefreshCw,
	Plus,
	X,
	Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Vibe } from '@/lib/types';

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

type AssistantPanelProps = {
	vibes: Vibe[];
	onSelectVibe?: (vibeId: number) => void;
	onAddSong?: (spotifyUrl: string) => void;
};

export default function AssistantPanel({ vibes, onSelectVibe, onAddSong }: AssistantPanelProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [data, setData] = useState<AssistantData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<'insight' | 'song' | 'prompt'>('insight');

	const fetchAssistant = async () => {
		if (data && !isRefreshing) return;

		setIsLoading(true);
		try {
			setError(null);
			const response = await fetch('/api/assistant');
			if (response.ok) {
				const result = await response.json();
				setData(result);
				return result;
			} else {
				const errorData = await response.json().catch(() => ({}));
				setError(errorData.error || `Error: ${response.status}`);
			}
		} catch (err) {
			console.error('Failed to fetch assistant data:', err);
			setError('Failed to load');
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
		return null;
	};

	useEffect(() => {
		if (isExpanded && !data && !isLoading) {
			fetchAssistant();
		}
	}, [isExpanded]);

	const handleRefresh = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsRefreshing(true);
		setData(null);
		fetchAssistant();
	};

	const handleTabClick = (tab: 'insight' | 'song' | 'prompt') => (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setActiveTab(tab);
	};

	const handleToggle = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isExpanded) {
			setIsExpanded(true);
			// Fetch data and auto-select dominant vibe
			const result = data || await fetchAssistant();
			if (result && result.dominantVibe && onSelectVibe) {
				const matchingVibe = vibes.find(
					v => v.vibe_type.toLowerCase() === result.dominantVibe.toLowerCase()
				);
				if (matchingVibe) {
					onSelectVibe(matchingVibe.id);
				}
			}
		} else {
			setIsExpanded(false);
		}
	};

	const handleClose = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsExpanded(false);
	};

	const handleAddSong = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (data?.songSuggestion && onAddSong) {
			const spotifyUrl = `https://open.spotify.com/track/${data.songSuggestion.spotifyId}`;
			onAddSong(spotifyUrl);
			setIsExpanded(false);
		}
	};

	return (
		<div className="relative">
			{/* Collapsed Pill Button */}
			<AnimatePresence>
				{!isExpanded && (
					<motion.button
						type="button"
						onClick={handleToggle}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.15 }}
						className={cn(
							"inline-flex items-center gap-2 px-4 py-2 rounded-full",
							"bg-gradient-to-r from-purple-500 to-pink-500",
							"text-white text-sm font-medium",
							"shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
							"transition-all duration-200"
						)}
					>
						<Sparkles className="size-4" />
						<span>Vibe Assistant</span>
						{data?.streak && data.streak > 0 && (
							<span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
								<Flame className="size-3" />
								{data.streak}
							</span>
						)}
					</motion.button>
				)}
			</AnimatePresence>

			{/* Expanded Overlay Panel */}
			<AnimatePresence>
				{isExpanded && (
					<>
						{/* Backdrop - click to close */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.15 }}
							className="fixed inset-0 z-40"
							onClick={handleClose}
						/>

						{/* Panel */}
						<motion.div
							initial={{ opacity: 0, y: -10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -10, scale: 0.95 }}
							transition={{ duration: 0.2, type: 'spring', damping: 25 }}
							className={cn(
								"fixed top-20 left-4 right-4 z-50",
								"lg:left-4 lg:right-auto lg:w-[50%]",
								"bg-background backdrop-blur-md",
								"border border-purple-500/30 rounded-2xl",
								"shadow-2xl shadow-purple-500/20"
							)}
						>
							{/* Header */}
							<div className="flex items-center justify-between p-3 border-b border-border/50">
								<div className="flex items-center gap-2">
									<div className="size-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
										<Sparkles className="size-4 text-white" />
									</div>
									<span className="font-semibold">Vibe Assistant</span>
									{data?.streak && data.streak > 0 && (
										<span className="flex items-center gap-0.5 px-2 py-0.5 bg-orange-500/20 text-orange-500 rounded-full text-sm font-medium">
											<Flame className="size-3.5" />
											{data.streak}
										</span>
									)}
								</div>
								<div className="flex items-center gap-1">
									<button
										type="button"
										onClick={handleRefresh}
										disabled={isRefreshing || isLoading}
										className="p-2 hover:bg-muted rounded-full transition-colors"
									>
										<RefreshCw className={cn("size-4", (isRefreshing || isLoading) && "animate-spin")} />
									</button>
									<button
										type="button"
										onClick={handleClose}
										className="p-2 hover:bg-muted rounded-full transition-colors"
									>
										<X className="size-4" />
									</button>
								</div>
							</div>

							{/* Content */}
							{isLoading ? (
								<div className="p-5">
									<div className="space-y-3 animate-pulse">
										<div className="h-4 bg-muted rounded w-3/4" />
										<div className="h-4 bg-muted rounded w-1/2" />
									</div>
								</div>
							) : error ? (
								<div className="p-5 text-center">
									<p className="text-sm text-muted-foreground">{error}</p>
								</div>
							) : data ? (
								<>
									{/* Tabs */}
									<div className="flex border-b border-border/50">
										<button
											type="button"
											onClick={handleTabClick('insight')}
											className={cn(
												"flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
												activeTab === 'insight'
													? "border-b-2 border-purple-500 text-purple-500"
													: "text-muted-foreground hover:text-foreground"
											)}
										>
											<TrendingUp className="size-4" />
											Insight
										</button>
										<button
											type="button"
											onClick={handleTabClick('song')}
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
											type="button"
											onClick={handleTabClick('prompt')}
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

									{/* Tab Content */}
									<div className="p-5">
										<AnimatePresence mode="wait">
											{activeTab === 'insight' && (
												<motion.div
													key="insight"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													transition={{ duration: 0.1 }}
												>
													<p className="text-base leading-relaxed">{data.moodInsight}</p>
													{data.patterns.length > 0 && (
														<div className="mt-4 pt-4 border-t border-border/50">
															<p className="text-sm text-muted-foreground mb-2">Recent vibes:</p>
															<div className="flex flex-wrap gap-2">
																{data.patterns.map(({ vibe, count }) => (
																	<span
																		key={vibe}
																		className="px-3 py-1 text-sm rounded-full capitalize bg-muted text-foreground"
																	>
																		{vibe} ({count})
																	</span>
																))}
															</div>
														</div>
													)}
												</motion.div>
											)}

											{activeTab === 'song' && (
												<motion.div
													key="song"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													transition={{ duration: 0.1 }}
												>
													<p className="text-sm text-muted-foreground mb-3">
														Suggested for your {data.mostRecentVibe} vibe:
													</p>
													<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
														<div className="size-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
															<Music className="size-6 text-white" />
														</div>
														<div className="flex-1 min-w-0">
															<p className="font-semibold truncate">{data.songSuggestion.title}</p>
															<p className="text-sm text-muted-foreground truncate">
																{data.songSuggestion.artist}
															</p>
														</div>
														<button
															type="button"
															onClick={handleAddSong}
															className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors flex-shrink-0"
														>
															<Plus className="size-4" />
															Add
														</button>
													</div>
													<p className="text-xs text-muted-foreground mt-3 text-center">
														This will add the song to your vibe
													</p>
												</motion.div>
											)}

											{activeTab === 'prompt' && (
												<motion.div
													key="prompt"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													transition={{ duration: 0.1 }}
													className="text-center py-3"
												>
													<p className="text-sm text-muted-foreground mb-3">Something to consider:</p>
													<p className="text-lg font-medium italic leading-relaxed">"{data.reflectionPrompt}"</p>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</>
							) : null}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
