'use client';

import { motion } from 'framer-motion';
import { ComponentPropsWithoutRef, FC } from 'react';
import { clsx } from 'clsx';

// Accept all valid HTML button props (excluding Framer-specific drag props)
type MotionButtonProps = ComponentPropsWithoutRef<'button'> & {
	variant?: 'primary' | 'ghost';
};

const MotionButton: FC<MotionButtonProps> = ({
	                                             children,
	                                             className,
	                                             variant = 'primary',
	                                             ...props
                                             }) => {
	const baseStyles = clsx(
		'rounded-full px-5 py-2 font-semibold shadow transition',
		variant === 'primary'
			? 'bg-zinc-900 text-white hover:bg-zinc-800'
			: 'bg-transparent text-zinc-800 dark:text-white border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800',
		className
	);
	
	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			className={baseStyles}
			// This cast tells TS to treat props as safe standard button props
			{...(props as any)}
		>
			{children}
		</motion.button>
	);
};

export default MotionButton;
