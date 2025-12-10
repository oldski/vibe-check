'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

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
	const successMessage = mode === 'edit' ? 'Vibe Updated!' : 'Vibe added!';

	return (
		<div className="flex flex-row justify-end items-center gap-4">
			{mode === 'edit' && onCancel && (
				<motion.button
					type="button"
					onClick={onCancel}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					transition={{ type: 'spring', stiffness: 300 }}
					className={clsx(
						'px-6 py-2 rounded-full font-semibold opacity-70 hover:opacity-100',
						vibeStyles?.text,
						vibeStyles?.transition
					)}
				>
					Cancel
				</motion.button>
			)}
			<motion.button
				type="submit"
				disabled={isProcessing}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				transition={{ type: 'spring', stiffness: 300 }}
				className={clsx(
					'px-6 py-2 rounded-full font-semibold shadow-md',
					vibeStyles?.bg,
					vibeStyles?.text,
					vibeStyles?.hover,
					vibeStyles?.focus,
					vibeStyles?.active,
					vibeStyles?.ring,
					vibeStyles?.disabled,
					vibeStyles?.transition
				)}
			>
				{isProcessing ? 'Processing...' : buttonLabel}
			</motion.button>

			{success && <p className="text-green-600 text-sm">{successMessage}</p>}
		</div>
	);
};

export default VibeFormActions;
