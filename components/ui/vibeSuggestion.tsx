'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { getVibeStyles } from '@/lib/getVibeStyles';
import { cn } from '@/lib/utils';
import { Vibe } from '@/lib/types';

type VibeSuggestionProps = {
	suggestedVibe: string | null;
	confidence: number;
	isLoading: boolean;
	vibes: Vibe[];
	onAccept: (vibeId: number) => void;
	onDismiss: () => void;
};

export default function VibeSuggestion({
	suggestedVibe,
	confidence,
	isLoading,
	vibes,
	onAccept,
	onDismiss,
}: VibeSuggestionProps) {
	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

	// Find the vibe ID from the suggested vibe type
	const matchingVibe = vibes.find(
		v => v.vibe_type.toLowerCase() === suggestedVibe?.toLowerCase()
	);

	const vibeStyles = suggestedVibe
		? getVibeStyles(suggestedVibe, currentTheme)
		: null;

	// Format confidence as percentage
	const confidencePercent = Math.round(confidence * 100);

	return (
		<AnimatePresence>
			{(isLoading || suggestedVibe) && (
				<motion.div
					initial={{ opacity: 0, y: -10, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -10, scale: 0.95 }}
					transition={{ duration: 0.2 }}
					className="mb-3"
				>
					{isLoading ? (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Loader2 className="size-4 animate-spin" />
							<span>Analyzing your vibe...</span>
						</div>
					) : (
						suggestedVibe && matchingVibe && (
							<div className="flex items-center gap-2 flex-wrap">
								<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
									<Sparkles className="size-4" />
									<span>AI suggests:</span>
								</div>

								<button
									type="button"
									onClick={() => onAccept(matchingVibe.id)}
									className={cn(
										'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
										'transition-all hover:scale-105 active:scale-95',
										'border-2 border-transparent hover:border-current/20',
										vibeStyles?.bg,
										vibeStyles?.text
									)}
								>
									<span className="capitalize">{suggestedVibe}</span>
									{confidencePercent >= 50 && (
										<span className="text-xs opacity-70">
											{confidencePercent}%
										</span>
									)}
								</button>

								<button
									type="button"
									onClick={onDismiss}
									className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
									aria-label="Dismiss suggestion"
								>
									<X className="size-4" />
								</button>
							</div>
						)
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
