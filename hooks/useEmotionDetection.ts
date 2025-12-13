'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type EmotionResult = {
	suggestedVibe: string;
	confidence: number;
	topEmotions: { emotion: string; score: number; vibe: string }[];
};

export function useEmotionDetection(text: string, debounceMs = 1000) {
	const [result, setResult] = useState<EmotionResult | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const detectEmotion = useCallback(async (inputText: string) => {
		// Cancel any pending request
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		// Don't analyze very short text
		if (inputText.trim().length < 15) {
			setResult(null);
			return;
		}

		setIsLoading(true);
		setError(null);

		abortControllerRef.current = new AbortController();

		try {
			const response = await fetch('/api/detect-emotion', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: inputText }),
				signal: abortControllerRef.current.signal,
			});

			if (!response.ok) {
				if (response.status === 422) {
					// Text couldn't be analyzed (too short, etc.)
					setResult(null);
					return;
				}
				throw new Error('Failed to detect emotion');
			}

			const data = await response.json();
			setResult(data);
		} catch (err) {
			if ((err as Error).name === 'AbortError') {
				// Request was cancelled, ignore
				return;
			}
			console.error('Emotion detection error:', err);
			setError('Could not analyze mood');
			setResult(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Debounced effect
	useEffect(() => {
		// Clear previous timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// Don't trigger for short text
		if (text.trim().length < 15) {
			setResult(null);
			setIsLoading(false);
			return;
		}

		// Set new debounced call
		timeoutRef.current = setTimeout(() => {
			detectEmotion(text);
		}, debounceMs);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [text, debounceMs, detectEmotion]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const clear = useCallback(() => {
		setResult(null);
		setError(null);
	}, []);

	return { result, isLoading, error, clear };
}
