'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast, ToastType } from '@/contexts/toastContext';
import { cn } from '@/lib/utils';

const toastStyles: Record<ToastType, { bg: string; icon: typeof CheckCircle; iconColor: string }> = {
	success: {
		bg: 'bg-green-500/90 dark:bg-green-600/90',
		icon: CheckCircle,
		iconColor: 'text-white',
	},
	error: {
		bg: 'bg-red-500/90 dark:bg-red-600/90',
		icon: AlertCircle,
		iconColor: 'text-white',
	},
	warning: {
		bg: 'bg-yellow-500/90 dark:bg-yellow-600/90',
		icon: AlertTriangle,
		iconColor: 'text-white',
	},
	info: {
		bg: 'bg-blue-500/90 dark:bg-blue-600/90',
		icon: Info,
		iconColor: 'text-white',
	},
};

export default function ToastContainer() {
	const { toasts, removeToast } = useToast();

	return (
		<div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
			<AnimatePresence mode="popLayout">
				{toasts.map((toast) => {
					const style = toastStyles[toast.type];
					const Icon = style.icon;

					return (
						<motion.div
							key={toast.id}
							layout
							initial={{ opacity: 0, y: 50, scale: 0.9 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, x: 100, scale: 0.9 }}
							transition={{ type: 'spring', stiffness: 400, damping: 30 }}
							className={cn(
								'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm text-white min-w-[280px] max-w-[400px]',
								style.bg
							)}
						>
							<Icon className={cn('size-5 shrink-0', style.iconColor)} />
							<p className="flex-1 text-sm font-medium">{toast.message}</p>
							<button
								onClick={() => removeToast(toast.id)}
								className="shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
								aria-label="Dismiss"
							>
								<X className="size-4" />
							</button>
						</motion.div>
					);
				})}
			</AnimatePresence>
		</div>
	);
}
