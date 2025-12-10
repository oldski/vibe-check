'use client';

import Link, { LinkProps } from 'next/link';
import { motion } from 'framer-motion';
import { ComponentPropsWithoutRef } from 'react';

type MotionLinkProps = LinkProps & Omit<ComponentPropsWithoutRef<'a'>, 'href'>;

const MotionLink = ({ children, className, href, ...props }: MotionLinkProps) => (
	<Link href={href} className={className} {...props}>
		<motion.span
			className="inline-block"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
		>
			{children}
		</motion.span>
	</Link>
);

export default MotionLink;
