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

	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

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
	const vibeStyles = getVibeStyles(activeVibe?.vibe_type, currentTheme);
	const vibeColor = currentTheme === 'dark'
		? (activeVibe?.color_dark ?? '#1a1a1a')
		: (activeVibe?.color_light ?? '#ffffff');
	const hasImage = form?.media && form.media.match(/\.(jpg|jpeg|png|webp)$/i);

	if (!form) return null;

	const isEditMode = mode === 'add' || mode === 'edit';

	return (
		<div className="fixed inset-0 z-30 overflow-hidden">
			{/* Animated Background */}
			<motion.div
				className="absolute inset-0 z-0"
				initial={{ opacity: 0 }}
				animate={{
					opacity: 1,
					backgroundColor: vibeColor
				}}
				transition={{ duration: 0.4 }}
			>
				{hasImage && (
					<motion.div
						className="absolute inset-0"
						style={{
							backgroundImage: `url(${form.media})`,
							backgroundSize: "cover",
							backgroundPosition: "center top", // Favor top of image for portraits
						}}
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.7 }}
					/>
				)}
			</motion.div>

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
