'use client';

import Link, { LinkProps } from 'next/link';
import { motion } from 'framer-motion';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

type MotionLinkProps = LinkProps & ComponentPropsWithoutRef<'a'>;

const MotionLink = forwardRef<HTMLAnchorElement, MotionLinkProps>(
	({ children, className, ...props }, ref) => (
		<Link {...props} legacyBehavior passHref>
			<motion.a
				ref={ref}
				className={className}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				{children}
			</motion.a>
		</Link>
		
	)
);

MotionLink.displayName = 'MotionLink';

export default MotionLink;
