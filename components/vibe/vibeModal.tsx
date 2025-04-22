'use client';

import { Vibe, DailyVibe, VibeFormState } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import VibeForm from './vibeForm';
import { useTheme } from 'next-themes';
import { getVibeStyles } from '@/lib/getVibeStyles';
import { CircleX } from 'lucide-react';
import { clsx } from 'clsx';
import {useEffect} from "react";

type VibeModalProps = {
	open: boolean;
	onClose: () => void;
	userId: string;
	vibes: Vibe[];
	selectedVibe?: DailyVibe;
	form: VibeFormState;
	setForm: React.Dispatch<React.SetStateAction<VibeFormState>>;
	mode: 'view' | 'edit' | 'add';
};

const VibeModal = ({
	                   open,
	                   onClose,
	                   userId,
	                   vibes,
	                   selectedVibe,
	                   form,
	                   setForm,
	                   mode
                   }: VibeModalProps) => {
	
	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
	
	const selectedVibeType = vibes.find((v) => v.id === form.vibe);
	const vibeStyles = getVibeStyles(selectedVibeType?.vibe_type, currentTheme);
	
	const vibeColor = selectedVibeType?.color_light ?? '#ffffff';
	const hasImage = form.media && form.media.match(/\.(jpg|jpeg|png|webp)$/i);
	
	useEffect(() => {
		if (typeof window === 'undefined') return;
		
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		
		// Cleanup on unmount
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);
	
	return (
		<AnimatePresence>
			{open && (
				<motion.div
					// key={selectedVibe?.id} // ensures animation resets
					className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					onClick={onClose}
				>
					<motion.div
						className={clsx("absolute inset-0 z-0", vibeStyles?.bg)}
						initial={{ scale: 1 }}
						animate={{ scale: 1.03 }}
						exit={{ scale: 1 }}
						transition={{ duration: 0.5, ease: 'easeInOut' }}
					>
						{/* Layer 1: Blurred Image Background */}
						{hasImage && (
							<motion.div
								className="absolute inset-0 z-0"
								style={{
									backgroundImage: `url(${form.media})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
									filter: "blur(2px)",
									transform: "scale(1.05)",
								}}
								initial={{ opacity: 0 }}
								animate={{ opacity: 0.5 }}
								exit={{ opacity: 0 }}
							/>
						)}
						
						{/* Layer 2: Vibe Color Overlay */}
						<motion.div
							className={clsx("absolute w-full h-full inset-0 z-10 mix-blend-multiply pointer-events-none", vibeStyles?.bg)}
							initial={false}
							animate={{ backgroundColor: vibeColor, opacity: 0.87 }}
							transition={{ duration: 0.4 }}
						/>
					</motion.div>
					
					{/* Layer 3: Foreground Form Content */}
					<motion.div
						onClick={(e) => e.stopPropagation()}
						className="relative z-20 w-full md:w-11/12 h-full p-6 md:p-10 overflow-y-auto"
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						<div className={clsx("p-6 md:p-10 h-full")}>
							<VibeForm form={form} setForm={setForm} userId={userId} vibes={vibes} onClose={onClose} isOwner={selectedVibe?.profile_id === userId} vibeId={form.id} mode={mode} />
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default VibeModal;