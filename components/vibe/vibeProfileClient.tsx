'use client';

import { ReactNode, useEffect } from 'react';
import { VibesProvider, useVibes } from '@/contexts/vibesContext';
import { DailyVibe, Vibe } from '@/lib/types';

type VibeProfileClientProps = {
	children: ReactNode;
	initialVibes: DailyVibe[];
	vibeTypes: Vibe[];
	handle: string;
	profile: {
		id: string;
		display_name: string | null;
		created_at: string;
	};
	userId?: string;
};

// Inner component that syncs initial vibes
function VibesSyncer({ initialVibes }: { initialVibes: DailyVibe[] }) {
	const { setVibes, vibes } = useVibes();

	// Only set vibes on initial mount if empty
	useEffect(() => {
		if (vibes.length === 0 && initialVibes.length > 0) {
			setVibes(initialVibes);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}

export default function VibeProfileClient({
	children,
	initialVibes,
}: VibeProfileClientProps) {
	return (
		<VibesProvider initialVibes={initialVibes}>
			<VibesSyncer initialVibes={initialVibes} />
			{children}
		</VibesProvider>
	);
}
