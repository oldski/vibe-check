'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2, Check } from 'lucide-react';

type VibeStyles = {
	bg?: string;
	text?: string;
	hover?: string;
	focus?: string;
	active?: string;
	ring?: string;
	disabled?: string;
	transition?: string;
};

type VibeFormActionsProps = {
	mode: 'edit' | 'add';
	isProcessing: boolean;
	success: boolean;
	vibeStyles?: VibeStyles;
	onCancel?: () => void;
};

const VibeFormActions = ({ mode, isProcessing, success, vibeStyles, onCancel }: VibeFormActionsProps) => {
	const buttonLabel = mode === 'edit' ? 'Save Vibe' : 'Submit Vibe';

	return (
		<div className="flex flex-row justify-end items-center gap-4">
			{mode === 'edit' && onCancel && (
				<motion.button
					type="button"
					onClick={onCancel}
					disabled={isProcessing}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					transition={{ type: 'spring', stiffness: 300 }}
					className={clsx(
						'px-6 py-2 rounded-full font-semibold opacity-70 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed',
						vibeStyles?.text,
						vibeStyles?.transition
					)}
				>
					Cancel
				</motion.button>
			)}
			<motion.button
				type="submit"
				disabled={isProcessing || success}
				whileHover={!isProcessing && !success ? { scale: 1.05 } : undefined}
				whileTap={!isProcessing && !success ? { scale: 0.95 } : undefined}
				transition={{ type: 'spring', stiffness: 300 }}
				className={clsx(
					'px-6 py-2 rounded-full font-semibold shadow-md flex items-center gap-2 min-w-[140px] justify-center',
					'disabled:opacity-70 disabled:cursor-not-allowed',
					vibeStyles?.bg,
					vibeStyles?.text,
					!isProcessing && !success && vibeStyles?.hover,
					vibeStyles?.focus,
					vibeStyles?.active,
					vibeStyles?.ring,
					vibeStyles?.transition
				)}
			>
				<AnimatePresence mode="wait">
					{isProcessing ? (
						<motion.span
							key="loading"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex items-center gap-2"
						>
							<Loader2 className="size-4 animate-spin" />
							<span>Saving...</span>
						</motion.span>
					) : success ? (
						<motion.span
							key="success"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0 }}
							className="flex items-center gap-2"
						>
							<Check className="size-4" />
							<span>Saved!</span>
						</motion.span>
					) : (
						<motion.span
							key="default"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							{buttonLabel}
						</motion.span>
					)}
				</AnimatePresence>
			</motion.button>
		</div>
	);
};

export default VibeFormActions;
