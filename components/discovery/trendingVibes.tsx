'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import { useTheme } from 'next-themes';
import { getVibeStyles } from '@/lib/getVibeStyles';
import { cn } from '@/lib/utils';

type TrendingVibe = {
	id: number;
	vibe_type: string;
	color_light: string;
	color_dark: string;
	count: number;
};

type TrendingVibesProps = {
	onSelectEmotion?: (emotion: string) => void;
};

export default function TrendingVibes({ onSelectEmotion }: TrendingVibesProps) {
	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
	const [trending, setTrending] = useState<TrendingVibe[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchTrending = async () => {
			try {
				const response = await fetch('/api/discover/trending');
				const data = await response.json();
				setTrending(data.trending || []);
			} catch (err) {
				console.error('Failed to fetch trending:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTrending();
	}, []);

	if (isLoading) {
		return (
			<div className="bg-card border border-border rounded-xl p-4">
				<div className="flex items-center gap-2 mb-3">
					<TrendingUp className="size-5" />
					<h3 className="font-semibold">Trending This Week</h3>
				</div>
				<div className="flex gap-2 animate-pulse">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-10 w-24 bg-muted rounded-lg" />
					))}
				</div>
			</div>
		);
	}

	if (trending.length === 0) {
		return null;
	}

	// Find max count for relative sizing
	const maxCount = Math.max(...trending.map((v) => v.count));

	return (
		<div className="bg-card border border-border rounded-xl p-4">
			<div className="flex items-center gap-2 mb-3">
				<TrendingUp className="size-5" />
				<h3 className="font-semibold">Trending This Week</h3>
			</div>
			<div className="flex flex-wrap gap-2">
				{trending.map((vibe, index) => {
					const vibeStyles = getVibeStyles(vibe.vibe_type.toLowerCase(), currentTheme);
					const relativeSize = (vibe.count / maxCount) * 100;

					return (
						<button
							key={vibe.id}
							onClick={() => onSelectEmotion?.(vibe.vibe_type.toLowerCase())}
							className={cn(
								"flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105",
								vibeStyles?.bg,
								vibeStyles?.text
							)}
						>
							{index === 0 && <Flame className="size-4" />}
							<span className="font-medium capitalize">{vibe.vibe_type}</span>
							<span className="text-xs opacity-75">({vibe.count})</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
