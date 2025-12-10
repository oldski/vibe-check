'use client';

import { useState, useEffect, useMemo } from 'react';
import { DailyVibe, Vibe } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export type VibeFilters = {
	search: string;
	dateFrom: string;
	dateTo: string;
	emotions: string[];
};

type VibeFiltersProps = {
	vibes: DailyVibe[];
	vibeTypes: Vibe[];
	onFilterChange: (filteredVibes: DailyVibe[]) => void;
};

export default function VibeFiltersComponent({ vibes, vibeTypes, onFilterChange }: VibeFiltersProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [filters, setFilters] = useState<VibeFilters>({
		search: '',
		dateFrom: '',
		dateTo: '',
		emotions: [],
	});

	// Get unique emotions from vibes
	const availableEmotions = useMemo(() => {
		const emotions = new Set<string>();
		vibes.forEach(v => emotions.add(v.vibe.vibe_type.toLowerCase()));
		return Array.from(emotions).sort();
	}, [vibes]);

	// Count active filters
	const activeFilterCount = useMemo(() => {
		let count = 0;
		if (filters.search.trim()) count++;
		if (filters.dateFrom || filters.dateTo) count++;
		if (filters.emotions.length > 0) count += filters.emotions.length;
		return count;
	}, [filters]);

	// Apply filters
	useEffect(() => {
		let filtered = [...vibes];

		// Search filter (case-insensitive)
		if (filters.search.trim()) {
			const searchLower = filters.search.toLowerCase();
			filtered = filtered.filter(v =>
				v.message.toLowerCase().includes(searchLower)
			);
		}

		// Date range filter
		if (filters.dateFrom || filters.dateTo) {
			filtered = filtered.filter(v => {
				const vibeDate = parseISO(v.vibe_date);

				if (filters.dateFrom && filters.dateTo) {
					return isWithinInterval(vibeDate, {
						start: startOfDay(parseISO(filters.dateFrom)),
						end: endOfDay(parseISO(filters.dateTo)),
					});
				} else if (filters.dateFrom) {
					return vibeDate >= startOfDay(parseISO(filters.dateFrom));
				} else if (filters.dateTo) {
					return vibeDate <= endOfDay(parseISO(filters.dateTo));
				}
				return true;
			});
		}

		// Emotion filter
		if (filters.emotions.length > 0) {
			filtered = filtered.filter(v =>
				filters.emotions.includes(v.vibe.vibe_type.toLowerCase())
			);
		}

		onFilterChange(filtered);
	}, [filters, vibes, onFilterChange]);

	const toggleEmotion = (emotion: string) => {
		setFilters(prev => ({
			...prev,
			emotions: prev.emotions.includes(emotion)
				? prev.emotions.filter(e => e !== emotion)
				: [...prev.emotions, emotion],
		}));
	};

	const clearFilters = () => {
		setFilters({
			search: '',
			dateFrom: '',
			dateTo: '',
			emotions: [],
		});
	};

	const hasActiveFilters = filters.search || filters.dateFrom || filters.dateTo || filters.emotions.length > 0;

	return (
		<>
			{/* FAB Button */}
			<motion.button
				onClick={() => setIsOpen(true)}
				className={cn(
					"fixed bottom-20 left-6 z-[60] p-4 rounded-full shadow-lg transition flex items-center justify-center",
					hasActiveFilters
						? "bg-primary text-primary-foreground"
						: "bg-black text-white hover:bg-zinc-800"
				)}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				<Filter className="size-6" />
				{/* Badge */}
				{activeFilterCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold size-5 rounded-full flex items-center justify-center">
						{activeFilterCount}
					</span>
				)}
			</motion.button>

			{/* Floating Panel Overlay */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
							onClick={() => setIsOpen(false)}
						/>

						{/* Panel */}
						<motion.div
							initial={{ y: '100%', opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: '100%', opacity: 0 }}
							transition={{ type: 'spring', damping: 25, stiffness: 300 }}
							className="fixed bottom-0 left-0 right-0 z-[70] bg-background shadow-2xl max-h-[80vh] overflow-hidden"
						>
							{/* Handle */}
							<div className="flex justify-center pt-3 pb-2">
								<div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
							</div>

							{/* Header */}
							<div className="flex items-center justify-between px-6 pb-4">
								<h2 className="text-lg font-semibold">Filter Vibes</h2>
								<div className="flex items-center gap-2">
									{hasActiveFilters && (
										<Button
											variant="ghost"
											size="sm"
											onClick={clearFilters}
											className="text-muted-foreground"
										>
											Clear all
										</Button>
									)}
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setIsOpen(false)}
									>
										<X className="size-5" />
									</Button>
								</div>
							</div>

							{/* Content */}
							<div className="px-6 pb-8 space-y-6 overflow-y-auto max-h-[calc(80vh-100px)]">
								{/* Search */}
								<div className="space-y-2">
									<label className="text-sm text-muted-foreground flex items-center gap-2">
										<Search className="size-4" />
										Search
									</label>
									<div className="relative">
										<Input
											type="text"
											placeholder="Search vibes..."
											value={filters.search}
											onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
											className="pr-9"
										/>
										{filters.search && (
											<button
												onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											>
												<X className="size-4" />
											</button>
										)}
									</div>
								</div>

								{/* Date Range */}
								<div className="space-y-2">
									<label className="text-sm text-muted-foreground flex items-center gap-2">
										<Calendar className="size-4" />
										Date Range
									</label>
									<div className="flex items-center gap-2">
										<Input
											type="date"
											value={filters.dateFrom}
											onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
											className="flex-1"
											placeholder="From"
										/>
										<span className="text-muted-foreground">to</span>
										<Input
											type="date"
											value={filters.dateTo}
											onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
											className="flex-1"
											placeholder="To"
										/>
									</div>
									{(filters.dateFrom || filters.dateTo) && (
										<button
											onClick={() => setFilters(prev => ({ ...prev, dateFrom: '', dateTo: '' }))}
											className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
										>
											<X className="size-3" />
											Clear dates
										</button>
									)}
								</div>

								{/* Emotion Filter */}
								<div className="space-y-3">
									<label className="text-sm text-muted-foreground">Emotions</label>
									<div className="flex flex-wrap gap-2">
										{availableEmotions.map((emotion) => {
											const isSelected = filters.emotions.includes(emotion);

											return (
												<button
													key={emotion}
													onClick={() => toggleEmotion(emotion)}
													className={cn(
														"px-4 py-2 rounded-full text-sm font-medium transition-all capitalize",
														isSelected
															? "bg-foreground text-background"
															: "bg-muted hover:bg-muted/80 text-foreground"
													)}
												>
													{emotion}
												</button>
											);
										})}
									</div>
								</div>

								{/* Results Preview */}
								{hasActiveFilters && (
									<div className="pt-4 border-t">
										<p className="text-sm text-muted-foreground text-center">
											Showing results based on your filters
										</p>
									</div>
								)}
							</div>

							{/* Apply Button */}
							<div className="px-6 py-4 border-t bg-background">
								<Button
									onClick={() => setIsOpen(false)}
									className="w-full"
									size="lg"
								>
									{hasActiveFilters ? 'View Results' : 'Done'}
								</Button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
