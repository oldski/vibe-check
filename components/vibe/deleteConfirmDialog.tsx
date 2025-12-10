'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

type VibeStyles = {
	bg?: string;
	text?: string;
	ring?: string;
};

type DeleteConfirmDialogProps = {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	vibeStyles?: VibeStyles;
};

const DeleteConfirmDialog = ({ isOpen, onConfirm, onCancel, vibeStyles }: DeleteConfirmDialogProps) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					className={clsx(
						"fixed bottom-6 right-6 p-6 rounded-lg shadow-lg z-50",
						"flex flex-col gap-2 items-start",
						vibeStyles?.bg,
						vibeStyles?.text,
						vibeStyles?.ring
					)}
				>
					<p className="text-sm font-medium">Are you sure you want to delete this vibe?</p>
					<div className="flex gap-2 mt-2">
						<button
							type="button"
							onClick={onConfirm}
							className={clsx("px-3 py-1 rounded text-sm", vibeStyles?.ring, vibeStyles?.text)}
						>
							Yes, Delete
						</button>
						<button
							type="button"
							onClick={onCancel}
							className="text-sm px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700"
						>
							Cancel
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default DeleteConfirmDialog;
