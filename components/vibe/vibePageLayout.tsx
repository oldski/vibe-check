'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { DailyVibe, Vibe, VibeFormState } from '@/lib/types';
import { getVibeStyles } from '@/lib/getVibeStyles';
import VibeForm from './vibeForm';

type VibePageLayoutProps = {
	selectedVibe?: DailyVibe;
	userId: string;
	vibes: Vibe[];
	handle: string;
	mode: 'view' | 'edit' | 'add';
};

export default function VibePageLayout({
	selectedVibe,
	userId,
	vibes,
	handle,
	mode
}: VibePageLayoutProps) {
	const [form, setForm] = useState<VibeFormState | null>(null);
	const [mounted, setMounted] = useState(false);

	const { resolvedTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	// Wait for mount to get accurate theme - resolvedTheme is undefined during SSR
	const currentTheme = (mounted ? resolvedTheme : 'light') === 'dark' ? 'dark' : 'light';

	// Initialize form state based on mode
	useEffect(() => {
		if (mode === 'add') {
			setForm({
				id: undefined,
				vibe_date: format(new Date(), 'yyyy-MM-dd'),
				message: '',
				vibe: vibes[0]?.id ?? null, // Start with first vibe selected
				audio: '',
				media: '',
			});
		} else if (selectedVibe) {
			const dateOnly = new Date(selectedVibe.vibe_date).toISOString().split('T')[0];
			setForm({
				id: selectedVibe.id,
				vibe_date: dateOnly,
				message: selectedVibe.message,
				vibe: selectedVibe.vibe.id,
				audio: selectedVibe.audio ?? '',
				media: selectedVibe.media ?? '',
			});
		}
	}, [mode, selectedVibe, vibes]);

	// Get vibe styling - use first vibe as default for add mode
	const selectedVibeType = form ? vibes.find((v) => v.id === form.vibe) : null;
	const defaultVibe = vibes[0]; // fallback for when no vibe selected
	const activeVibe = selectedVibeType ?? defaultVibe;
	const vibeType = activeVibe?.vibe_type?.toLowerCase() ?? 'happy';
	// Use Tailwind classes like vibeGrid for consistent theme handling
	const vibeBgClass = currentTheme === 'dark'
		? `bg-${vibeType}-900`
		: `bg-${vibeType}-400`;
	const hasImage = form?.media && form.media.match(/\.(jpg|jpeg|png|webp)$/i);

	if (!form || !mounted) return null;

	const isEditMode = mode === 'add' || mode === 'edit';

	return (
		<div className="fixed inset-0 z-30 overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0 z-0">
				{/* Base color layer */}
				<div className={clsx("absolute inset-0", vibeBgClass)} />

				{/* Image layer */}
				{hasImage && (
					<motion.div
						className="absolute inset-0"
						style={{
							backgroundImage: `url(${form.media})`,
							backgroundSize: "cover",
							backgroundPosition: "center top",
						}}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					/>
				)}

				{/* Color overlay with blend mode - only applied when there's an image */}
				{/* Without this condition, mix-blend-multiply darkens the -900 color even further */}
				{hasImage && (
					<div
						className={clsx(
							"absolute inset-0 mix-blend-multiply pointer-events-none",
							vibeBgClass
						)}
						style={{ opacity: 0.85 }}
					/>
				)}
			</div>

			{/* Form Content */}
			<motion.div
				className={clsx(
					"relative z-10 w-full h-full flex flex-col",
					isEditMode ? "p-6 pt-16 pb-20" : "p-6 pt-16 pb-16"
				)}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
			>
				<div className="w-full h-full flex flex-col">
					<VibeForm
						form={form}
						setForm={setForm as React.Dispatch<React.SetStateAction<VibeFormState>>}
						userId={userId}
						vibes={vibes}
						isOwner={selectedVibe?.profile_id === userId || mode === 'add'}
						vibeId={form.id}
						handle={handle}
						mode={mode}
					/>
				</div>
			</motion.div>
		</div>
	);
}
