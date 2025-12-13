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

type AssistantDrawerProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function AssistantDrawer({ isOpen, onClose }: AssistantDrawerProps) {
	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
	const [data, setData] = useState<AssistantData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<'insight' | 'song' | 'prompt'>('insight');

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
		if (isOpen && !data && !error) {
			fetchAssistant();
		}
	}, [isOpen, data, error]);

	const handleRefresh = () => {
		setIsRefreshing(true);
		fetchAssistant();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 bg-black/50 z-40"
						onClick={onClose}
					/>

					{/* Drawer */}
					<motion.div
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						exit={{ y: '100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl max-h-[85vh] overflow-hidden shadow-2xl"
					>
						{/* Handle */}
						<div className="flex justify-center py-2">
							<div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
						</div>

						{/* Header */}
						<div className="px-4 pb-3 border-b border-border flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="size-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
									<Sparkles className="size-4 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-sm">Vibe Assistant</h3>
									{data && (
										<p className="text-xs text-muted-foreground">
											{data.timeOfDay} vibes
										</p>
									)}
								</div>
							</div>
							<div className="flex items-center gap-2">
								{data?.streak && data.streak > 0 && (
									<div className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 text-orange-500 rounded-full text-xs font-medium">
										<Flame className="size-3" />
										{data.streak}
									</div>
								)}
								<button
									onClick={handleRefresh}
									disabled={isRefreshing}
									className="p-1.5 hover:bg-muted rounded-full transition-colors"
								>
									<RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
								</button>
								<button
									onClick={onClose}
									className="p-1.5 hover:bg-muted rounded-full transition-colors"
								>
									<X className="size-4" />
								</button>
							</div>
						</div>

						{/* Content */}
						<div className="overflow-y-auto max-h-[calc(85vh-80px)]">
							{isLoading ? (
								<div className="p-6">
									<div className="space-y-3 animate-pulse">
										<div className="h-4 bg-muted rounded w-3/4" />
										<div className="h-4 bg-muted rounded w-1/2" />
										<div className="h-4 bg-muted rounded w-2/3" />
									</div>
								</div>
							) : error ? (
								<div className="p-6 text-center">
									<p className="text-sm text-muted-foreground mb-3">{error}</p>
									<button
										onClick={handleRefresh}
										className="text-sm text-purple-500 hover:underline"
									>
										Try again
									</button>
								</div>
							) : data ? (
								<>
									{/* Tabs */}
									<div className="flex border-b border-border">
										<button
											onClick={() => setActiveTab('insight')}
											className={cn(
												"flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors",
												activeTab === 'insight'
													? "border-b-2 border-purple-500 text-purple-500"
													: "text-muted-foreground hover:text-foreground"
											)}
										>
											<TrendingUp className="size-3.5" />
											Insight
										</button>
										<button
											onClick={() => setActiveTab('song')}
											className={cn(
												"flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors",
												activeTab === 'song'
													? "border-b-2 border-pink-500 text-pink-500"
													: "text-muted-foreground hover:text-foreground"
											)}
										>
											<Music className="size-3.5" />
											Song
										</button>
										<button
											onClick={() => setActiveTab('prompt')}
											className={cn(
												"flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors",
												activeTab === 'prompt'
													? "border-b-2 border-blue-500 text-blue-500"
													: "text-muted-foreground hover:text-foreground"
											)}
										>
											<MessageCircle className="size-3.5" />
											Reflect
										</button>
									</div>

									{/* Tab Content */}
									<div className="p-4">
										<AnimatePresence mode="wait">
											{activeTab === 'insight' && (
												<motion.div
													key="insight"
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													transition={{ duration: 0.15 }}
												>
													<p className="text-sm leading-relaxed">{data.moodInsight}</p>

													{data.patterns.length > 0 && (
														<div className="mt-4 pt-3 border-t border-border/50">
															<p className="text-xs text-muted-foreground mb-2">Recent vibes:</p>
															<div className="flex flex-wrap gap-1.5">
																{data.patterns.map(({ vibe, count }) => {
																	const styles = getVibeStyles(vibe, currentTheme);
																	return (
																		<span
																			key={vibe}
																			className={cn(
																				"px-2 py-0.5 text-xs rounded-full capitalize",
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
													transition={{ duration: 0.15 }}
												>
													<p className="text-xs text-muted-foreground mb-2">
														For your {data.mostRecentVibe} vibe:
													</p>
													<a
														href={`https://open.spotify.com/track/${data.songSuggestion.spotifyId}`}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
													>
														<div className="size-10 rounded bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
															<Music className="size-5 text-white" />
														</div>
														<div className="flex-1 min-w-0">
															<p className="font-medium text-sm truncate">{data.songSuggestion.title}</p>
															<p className="text-xs text-muted-foreground truncate">
																{data.songSuggestion.artist}
															</p>
														</div>
														<ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
													</a>
												</motion.div>
											)}

											{activeTab === 'prompt' && (
												<motion.div
													key="prompt"
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													transition={{ duration: 0.15 }}
													className="text-center py-2"
												>
													<p className="text-xs text-muted-foreground mb-2">Something to consider:</p>
													<p className="text-base font-medium italic leading-relaxed">"{data.reflectionPrompt}"</p>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</>
							) : null}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
