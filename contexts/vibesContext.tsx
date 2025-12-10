'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DailyVibe, Vibe, VibeFormState } from '@/lib/types';

type VibesContextType = {
	vibes: DailyVibe[];
	isLoading: boolean;
	error: string | null;
	setVibes: (vibes: DailyVibe[]) => void;
	addVibe: (form: VibeFormState, vibeTypes: Vibe[], profileId: string) => Promise<boolean>;
	updateVibe: (form: VibeFormState, vibeTypes: Vibe[]) => Promise<boolean>;
	deleteVibe: (id: string) => Promise<boolean>;
	clearError: () => void;
};

const VibesContext = createContext<VibesContextType | null>(null);

export function VibesProvider({
	children,
	initialVibes = []
}: {
	children: ReactNode;
	initialVibes?: DailyVibe[];
}) {
	const [vibes, setVibes] = useState<DailyVibe[]>(initialVibes);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const clearError = useCallback(() => setError(null), []);

	// Optimistic add
	const addVibe = useCallback(async (
		form: VibeFormState,
		vibeTypes: Vibe[],
		profileId: string
	): Promise<boolean> => {
		const vibeType = vibeTypes.find(v => v.id === form.vibe);
		if (!vibeType) {
			setError('Invalid vibe type');
			return false;
		}

		// Create optimistic entry with temporary ID
		const tempId = `temp-${Date.now()}`;
		const optimisticVibe: DailyVibe = {
			id: tempId,
			vibe_date: form.vibe_date,
			message: form.message,
			audio: form.audio || undefined,
			media: form.media || undefined,
			profile_id: profileId,
			vibe: vibeType,
		};

		// Optimistically add to state (at the beginning, sorted by date)
		setVibes(prev => [optimisticVibe, ...prev].sort((a, b) =>
			new Date(b.vibe_date).getTime() - new Date(a.vibe_date).getTime()
		));
		setIsLoading(true);
		setError(null);

		try {
			const res = await fetch('/api/send-vibes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			if (!res.ok) {
				throw new Error('Failed to save vibe');
			}

			const data = await res.json();

			// Replace temp ID with real ID if returned
			if (data.id) {
				setVibes(prev => prev.map(v =>
					v.id === tempId ? { ...v, id: data.id } : v
				));
			}

			return true;
		} catch (err) {
			// Revert optimistic update
			setVibes(prev => prev.filter(v => v.id !== tempId));
			setError(err instanceof Error ? err.message : 'Failed to add vibe');
			return false;
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Optimistic update
	const updateVibe = useCallback(async (
		form: VibeFormState,
		vibeTypes: Vibe[]
	): Promise<boolean> => {
		if (!form.id) {
			setError('Missing vibe ID');
			return false;
		}

		const vibeType = vibeTypes.find(v => v.id === form.vibe);
		if (!vibeType) {
			setError('Invalid vibe type');
			return false;
		}

		// Store previous state for rollback
		const previousVibes = [...vibes];

		// Optimistically update
		setVibes(prev => prev.map(v => {
			if (v.id === form.id) {
				return {
					...v,
					vibe_date: form.vibe_date,
					message: form.message,
					audio: form.audio || undefined,
					media: form.media || undefined,
					vibe: vibeType,
				};
			}
			return v;
		}).sort((a, b) =>
			new Date(b.vibe_date).getTime() - new Date(a.vibe_date).getTime()
		));
		setIsLoading(true);
		setError(null);

		try {
			const res = await fetch('/api/update-vibes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			if (!res.ok) {
				throw new Error('Failed to update vibe');
			}

			return true;
		} catch (err) {
			// Revert optimistic update
			setVibes(previousVibes);
			setError(err instanceof Error ? err.message : 'Failed to update vibe');
			return false;
		} finally {
			setIsLoading(false);
		}
	}, [vibes]);

	// Optimistic delete
	const deleteVibe = useCallback(async (id: string): Promise<boolean> => {
		// Store previous state for rollback
		const previousVibes = [...vibes];
		const deletedVibe = vibes.find(v => v.id === id);

		if (!deletedVibe) {
			setError('Vibe not found');
			return false;
		}

		// Optimistically remove
		setVibes(prev => prev.filter(v => v.id !== id));
		setIsLoading(true);
		setError(null);

		try {
			const res = await fetch('/api/delete-vibes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }),
			});

			if (!res.ok) {
				throw new Error('Failed to delete vibe');
			}

			return true;
		} catch (err) {
			// Revert optimistic update
			setVibes(previousVibes);
			setError(err instanceof Error ? err.message : 'Failed to delete vibe');
			return false;
		} finally {
			setIsLoading(false);
		}
	}, [vibes]);

	return (
		<VibesContext.Provider value={{
			vibes,
			isLoading,
			error,
			setVibes,
			addVibe,
			updateVibe,
			deleteVibe,
			clearError,
		}}>
			{children}
		</VibesContext.Provider>
	);
}

export function useVibes() {
	const context = useContext(VibesContext);
	if (!context) {
		throw new Error('useVibes must be used within a VibesProvider');
	}
	return context;
}

// Safe hook that returns null if not in provider (for pages outside the context)
export function useVibesSafe() {
	return useContext(VibesContext);
}
