'use client';

import { motion } from 'framer-motion';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useFollow } from '@/hooks/useFollow';
import { FollowCounts } from '@/lib/types';
import { cn } from '@/lib/utils';

type FollowButtonProps = {
	targetId: string;
	initialIsFollowing?: boolean;
	initialCounts?: FollowCounts;
	variant?: 'default' | 'compact' | 'icon';
	className?: string;
	disabled?: boolean;
};

export default function FollowButton({
	targetId,
	initialIsFollowing = false,
	initialCounts,
	variant = 'default',
	className,
	disabled = false,
}: FollowButtonProps) {
	const { isFollowing, isLoading, toggleFollow } = useFollow({
		targetId,
		initialIsFollowing,
		initialCounts,
	});

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!disabled && !isLoading) {
			await toggleFollow();
		}
	};

	if (variant === 'icon') {
		return (
			<motion.button
				type="button"
				onClick={handleClick}
				disabled={disabled || isLoading}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				className={cn(
					"p-2 rounded-full transition-colors",
					isFollowing
						? "bg-white/20 hover:bg-red-500/20 text-white"
						: "bg-white/20 hover:bg-white/30 text-white",
					disabled && "opacity-50 cursor-not-allowed",
					className
				)}
				aria-label={isFollowing ? 'Unfollow' : 'Follow'}
			>
				{isLoading ? (
					<Loader2 className="size-4 animate-spin" />
				) : isFollowing ? (
					<UserMinus className="size-4" />
				) : (
					<UserPlus className="size-4" />
				)}
			</motion.button>
		);
	}

	if (variant === 'compact') {
		return (
			<motion.button
				type="button"
				onClick={handleClick}
				disabled={disabled || isLoading}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				className={cn(
					"px-3 py-1 text-xs font-medium rounded-full transition-colors flex items-center gap-1",
					isFollowing
						? "bg-white/20 hover:bg-red-500/30 text-white"
						: "bg-white text-black hover:bg-white/90",
					disabled && "opacity-50 cursor-not-allowed",
					className
				)}
			>
				{isLoading ? (
					<Loader2 className="size-3 animate-spin" />
				) : isFollowing ? (
					<>
						<UserMinus className="size-3" />
						<span>Following</span>
					</>
				) : (
					<>
						<UserPlus className="size-3" />
						<span>Follow</span>
					</>
				)}
			</motion.button>
		);
	}

	// Default variant
	return (
		<motion.button
			type="button"
			onClick={handleClick}
			disabled={disabled || isLoading}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className={cn(
				"px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
				isFollowing
					? "bg-muted hover:bg-red-500/20 text-foreground"
					: "bg-primary text-primary-foreground hover:bg-primary/90",
				disabled && "opacity-50 cursor-not-allowed",
				className
			)}
		>
			{isLoading ? (
				<Loader2 className="size-4 animate-spin" />
			) : isFollowing ? (
				<>
					<UserMinus className="size-4" />
					<span>Following</span>
				</>
			) : (
				<>
					<UserPlus className="size-4" />
					<span>Follow</span>
				</>
			)}
		</motion.button>
	);
}
