'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Calendar } from 'lucide-react';
import { useTheme } from 'next-themes';
import { getVibeStyles } from '@/lib/getVibeStyles';
import { cn } from '@/lib/utils';

type VibeOfDayData = {
	id: string;
	vibe_date: string;
	message: string;
	media: string | null;
	vibe: {
		id: number;
		vibe_type: string;
		color_light: string;
		color_dark: string;
	};
	profile: {
		id: string;
		handle: string;
		display_name: string | null;
		avatar_url: string | null;
	};
};

export default function VibeOfDay() {
	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
	const [vibe, setVibe] = useState<VibeOfDayData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchVibeOfDay = async () => {
			try {
				const response = await fetch('/api/discover/vibe-of-day');
				const data = await response.json();
				setVibe(data.vibe);
			} catch (err) {
				console.error('Failed to fetch vibe of day:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchVibeOfDay();
	}, []);

	if (isLoading) {
		return (
			<div className="bg-card border border-border rounded-xl overflow-hidden">
				<div className="p-4 border-b border-border">
					<div className="flex items-center gap-2">
						<Sparkles className="size-5" />
						<h3 className="font-semibold">Vibe of the Day</h3>
					</div>
				</div>
				<div className="p-6 animate-pulse">
					<div className="h-4 bg-muted rounded w-3/4 mb-2" />
					<div className="h-4 bg-muted rounded w-1/2" />
				</div>
			</div>
		);
	}

	if (!vibe) {
		return null;
	}

	const vibeType = vibe.vibe.vibe_type.toLowerCase();
	const vibeStyles = getVibeStyles(vibeType, currentTheme);
	const formattedDate = new Date(vibe.vibe_date).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	});

	return (
		<Link
			href={`/v/${vibe.profile.handle}/${vibe.id}`}
			className="block bg-card border border-border rounded-xl overflow-hidden hover:border-foreground/20 transition-colors"
		>
			{/* Header */}
			<div className="p-4 border-b border-border flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Sparkles className="size-5 text-yellow-500" />
					<h3 className="font-semibold">Vibe of the Day</h3>
				</div>
				<span
					className={cn(
						"px-2 py-1 text-xs font-medium rounded-full capitalize",
						vibeStyles?.bg,
						vibeStyles?.text
					)}
				>
					{vibe.vibe.vibe_type}
				</span>
			</div>

			{/* Content */}
			<div className="p-4">
				{/* Message */}
				<p className="text-lg line-clamp-3 mb-4">{vibe.message}</p>

				{/* Image preview if exists */}
				{vibe.media && vibe.media.match(/\.(jpg|jpeg|png|webp|gif)$/i) && (
					<div className="mb-4 rounded-lg overflow-hidden">
						<img
							src={vibe.media}
							alt="Vibe media"
							className="w-full h-32 object-cover"
						/>
					</div>
				)}

				{/* Footer */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{vibe.profile.avatar_url ? (
							<img
								src={vibe.profile.avatar_url}
								alt={vibe.profile.display_name || vibe.profile.handle}
								className="size-6 rounded-full object-cover"
							/>
						) : (
							<div className="size-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
								{(vibe.profile.display_name || vibe.profile.handle).charAt(0).toUpperCase()}
							</div>
						)}
						<span className="text-sm text-muted-foreground">
							@{vibe.profile.handle}
						</span>
					</div>
					<div className="flex items-center gap-1 text-xs text-muted-foreground">
						<Calendar className="size-3" />
						{formattedDate}
					</div>
				</div>
			</div>
		</Link>
	);
}
