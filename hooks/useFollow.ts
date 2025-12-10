'use client';

import { useState, useCallback } from 'react';
import { FollowCounts } from '@/lib/types';
import { useToast } from '@/contexts/toastContext';

type UseFollowProps = {
	targetId: string;
	initialIsFollowing?: boolean;
	initialCounts?: FollowCounts;
};

type UseFollowReturn = {
	isFollowing: boolean;
	counts: FollowCounts;
	isLoading: boolean;
	toggleFollow: () => Promise<void>;
	follow: () => Promise<void>;
	unfollow: () => Promise<void>;
};

export function useFollow({
	targetId,
	initialIsFollowing = false,
	initialCounts = { followers: 0, following: 0 },
}: UseFollowProps): UseFollowReturn {
	const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
	const [counts, setCounts] = useState<FollowCounts>(initialCounts);
	const [isLoading, setIsLoading] = useState(false);
	const { addToast } = useToast();

	const performAction = useCallback(async (action: 'follow' | 'unfollow') => {
		setIsLoading(true);

		// Optimistic update
		const previousFollowing = isFollowing;
		const previousCounts = { ...counts };

		setIsFollowing(action === 'follow');
		setCounts((prev) => ({
			...prev,
			followers: prev.followers + (action === 'follow' ? 1 : -1),
		}));

		try {
			const res = await fetch('/api/follow', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ targetId, action }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || `Failed to ${action}`);
			}

			const data = await res.json();

			// Update with actual server values
			setIsFollowing(data.isFollowing);
			setCounts(data.counts);
		} catch (error) {
			// Revert optimistic update on error
			setIsFollowing(previousFollowing);
			setCounts(previousCounts);

			const message = error instanceof Error ? error.message : `Failed to ${action}`;
			addToast(message, 'error');
		} finally {
			setIsLoading(false);
		}
	}, [targetId, isFollowing, counts, addToast]);

	const follow = useCallback(() => performAction('follow'), [performAction]);
	const unfollow = useCallback(() => performAction('unfollow'), [performAction]);
	const toggleFollow = useCallback(() => {
		return isFollowing ? unfollow() : follow();
	}, [isFollowing, follow, unfollow]);

	return {
		isFollowing,
		counts,
		isLoading,
		toggleFollow,
		follow,
		unfollow,
	};
}
