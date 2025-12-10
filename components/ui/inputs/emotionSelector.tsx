'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Vibe } from '@/lib/types';
import { getVibeStyles } from '@/lib/getVibeStyles';
import { clsx } from 'clsx';

type EmotionSelectorProps = {
	vibes: Vibe[];
	selectedVibeId: number | null;
	onSelect: (vibeId: number) => void;
};

// Throttle delays - mobile is more responsive
const THROTTLE_DELAY_DESKTOP = 300;
const THROTTLE_DELAY_MOBILE = 150;

// Swipe distances - mobile requires less distance
const MIN_SWIPE_DESKTOP = 80;
const MIN_SWIPE_MOBILE = 30;

const EmotionSelector = ({ vibes, selectedVibeId, onSelect }: EmotionSelectorProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
	const [isTouchDevice, setIsTouchDevice] = useState(false);
	const lastChangeRef = useRef<number>(0);

	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

	// Detect touch device on mount
	useEffect(() => {
		setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
	}, []);

	// Get vibe styles for the current emotion
	const currentVibe = vibes[currentIndex];
	const vibeStyles = getVibeStyles(currentVibe?.vibe_type, currentTheme);

	// Sync currentIndex with selectedVibeId
	useEffect(() => {
		if (selectedVibeId) {
			const index = vibes.findIndex(v => v.id === selectedVibeId);
			if (index >= 0) setCurrentIndex(index);
		}
	}, [selectedVibeId, vibes]);

	// Throttled navigation - prevents rapid changes (more responsive on mobile)
	const canChange = useCallback(() => {
		const now = Date.now();
		const delay = isTouchDevice ? THROTTLE_DELAY_MOBILE : THROTTLE_DELAY_DESKTOP;
		if (now - lastChangeRef.current < delay) {
			return false;
		}
		lastChangeRef.current = now;
		return true;
	}, [isTouchDevice]);

	const goToNext = useCallback(() => {
		if (!canChange()) return;
		const nextIndex = (currentIndex + 1) % vibes.length;
		setCurrentIndex(nextIndex);
		onSelect(vibes[nextIndex].id);
	}, [currentIndex, vibes, onSelect, canChange]);

	const goToPrev = useCallback(() => {
		if (!canChange()) return;
		const prevIndex = (currentIndex - 1 + vibes.length) % vibes.length;
		setCurrentIndex(prevIndex);
		onSelect(vibes[prevIndex].id);
	}, [currentIndex, vibes, onSelect, canChange]);

	// Keyboard support
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
				e.preventDefault();
				goToPrev();
			} else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
				e.preventDefault();
				goToNext();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [goToNext, goToPrev]);

	// Touch/swipe support - also handles touches from parent [data-swipeable] container
	const containerRef = useRef<HTMLDivElement>(null);

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStart({
			x: e.touches[0].clientX,
			y: e.touches[0].clientY
		});
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (!touchStart) return;

		const touchEnd = {
			x: e.changedTouches[0].clientX,
			y: e.changedTouches[0].clientY
		};

		const deltaX = touchEnd.x - touchStart.x;
		const deltaY = touchEnd.y - touchStart.y;
		// Mobile uses smaller swipe distance for easier swiping
		const minSwipeDistance = isTouchDevice ? MIN_SWIPE_MOBILE : MIN_SWIPE_DESKTOP;

		// Determine if horizontal or vertical swipe
		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			// Horizontal swipe (mobile)
			if (deltaX > minSwipeDistance) goToPrev();
			else if (deltaX < -minSwipeDistance) goToNext();
		} else {
			// Vertical swipe
			if (deltaY > minSwipeDistance) goToNext();
			else if (deltaY < -minSwipeDistance) goToPrev();
		}

		setTouchStart(null);
	};

	// Also listen for touches on parent [data-swipeable] container
	useEffect(() => {
		if (!isTouchDevice) return;

		const container = containerRef.current;
		const swipeableParent = container?.closest('[data-swipeable]') as HTMLElement | null;
		if (!swipeableParent) return;

		let startPos: { x: number; y: number } | null = null;

		const onTouchStart = (e: TouchEvent) => {
			startPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
		};

		const onTouchEnd = (e: TouchEvent) => {
			if (!startPos) return;
			const endPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
			const deltaX = endPos.x - startPos.x;
			const deltaY = endPos.y - startPos.y;

			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				if (deltaX > MIN_SWIPE_MOBILE) goToPrev();
				else if (deltaX < -MIN_SWIPE_MOBILE) goToNext();
			} else {
				if (deltaY > MIN_SWIPE_MOBILE) goToNext();
				else if (deltaY < -MIN_SWIPE_MOBILE) goToPrev();
			}
			startPos = null;
		};

		swipeableParent.addEventListener('touchstart', onTouchStart, { passive: true });
		swipeableParent.addEventListener('touchend', onTouchEnd, { passive: true });

		return () => {
			swipeableParent.removeEventListener('touchstart', onTouchStart);
			swipeableParent.removeEventListener('touchend', onTouchEnd);
		};
	}, [isTouchDevice, goToNext, goToPrev]);

	// Wheel/scroll support for desktop only - require minimum scroll amount
	const handleWheel = useCallback((e: WheelEvent) => {
		e.preventDefault();
		const minDelta = 30; // Minimum scroll amount to trigger change
		if (e.deltaY > minDelta) goToNext();
		else if (e.deltaY < -minDelta) goToPrev();
	}, [goToNext, goToPrev]);

	useEffect(() => {
		// Only add wheel listener on desktop to avoid interfering with mobile scrolling
		if (isTouchDevice) return;

		// Add wheel listener with passive: false to allow preventDefault
		window.addEventListener('wheel', handleWheel, { passive: false });
		return () => window.removeEventListener('wheel', handleWheel);
	}, [handleWheel, isTouchDevice]);

	if (!currentVibe) return null;

	return (
		<div
			ref={containerRef}
			className="flex items-center gap-3"
			style={{ touchAction: 'manipulation' }}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			{/* Up/Down arrows */}
			<div className="flex flex-col gap-1">
				<button
					type="button"
					onClick={goToPrev}
					className={clsx(
						"p-1 hover:opacity-70 transition-opacity",
						vibeStyles?.text
					)}
					aria-label="Previous emotion"
				>
					<ChevronUp size={20} />
				</button>
				<button
					type="button"
					onClick={goToNext}
					className={clsx(
						"p-1 hover:opacity-70 transition-opacity",
						vibeStyles?.text
					)}
					aria-label="Next emotion"
				>
					<ChevronDown size={20} />
				</button>
			</div>

			{/* Emotion name with animation */}
			<AnimatePresence mode="wait">
				<motion.span
					key={currentVibe.id}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className={clsx(
						"text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-widest",
						vibeStyles?.text
					)}
				>
					{currentVibe.vibe_type}
				</motion.span>
			</AnimatePresence>
		</div>
	);
};

export default EmotionSelector;
