'use client';

import { useState, useEffect, useCallback } from 'react';

type SearchUser = {
	id: string;
	handle: string;
	display_name: string | null;
	avatar_url: string | null;
	bio: string | null;
	is_public: boolean;
};

type SearchVibe = {
	id: string;
	vibe_date: string;
	message: string;
	media: string | null;
	profile_id: string;
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
		is_public: boolean;
	};
};

type SearchResults = {
	users: SearchUser[];
	vibes: SearchVibe[];
};

type UseSearchOptions = {
	debounceMs?: number;
	type?: 'all' | 'users' | 'vibes';
	limit?: number;
};

export function useSearch(options: UseSearchOptions = {}) {
	const { debounceMs = 300, type = 'all', limit = 10 } = options;

	const [query, setQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');
	const [emotion, setEmotion] = useState<string | null>(null);
	const [results, setResults] = useState<SearchResults>({ users: [], vibes: [] });
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Debounce the query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query);
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [query, debounceMs]);

	// Fetch results when debounced query or emotion changes
	useEffect(() => {
		const fetchResults = async () => {
			// Need either a query (2+ chars) or an emotion filter
			if (debouncedQuery.length < 2 && !emotion) {
				setResults({ users: [], vibes: [] });
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const params = new URLSearchParams();
				if (debouncedQuery.length >= 2) {
					params.set('q', debouncedQuery);
				}
				if (emotion) {
					params.set('emotion', emotion);
				}
				params.set('type', type);
				params.set('limit', limit.toString());

				const response = await fetch(`/api/search?${params}`);

				if (!response.ok) {
					throw new Error('Search failed');
				}

				const data = await response.json();
				setResults(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Search failed');
				setResults({ users: [], vibes: [] });
			} finally {
				setIsLoading(false);
			}
		};

		fetchResults();
	}, [debouncedQuery, emotion, type, limit]);

	const clearSearch = useCallback(() => {
		setQuery('');
		setEmotion(null);
		setResults({ users: [], vibes: [] });
	}, []);

	const searchByEmotion = useCallback((emotionType: string | null) => {
		setQuery(''); // Clear text search when filtering by emotion
		setEmotion(emotionType);
	}, []);

	const hasResults = results.users.length > 0 || results.vibes.length > 0;

	return {
		query,
		setQuery,
		emotion,
		setEmotion,
		searchByEmotion,
		results,
		isLoading,
		error,
		clearSearch,
		hasResults,
	};
}

export type { SearchUser, SearchVibe, SearchResults };
