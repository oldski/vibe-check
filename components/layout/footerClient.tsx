'use client';

import { useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

type FooterClientProps = {
	children: ReactNode;
};

const HOTSPOT_HEIGHT = 60; // pixels from bottom to trigger footer

const FooterClient = ({ children }: FooterClientProps) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Start hidden
		setIsVisible(false);

		const handleMouseMove = (e: MouseEvent) => {
			const isInHotspot = window.innerHeight - e.clientY <= HOTSPOT_HEIGHT;
			setIsVisible(isInHotspot);
		};

		const handleTouchStart = () => {
			// Toggle on tap
			setIsVisible(prev => !prev);
		};

		const handleMouseLeave = () => {
			setIsVisible(false);
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('touchstart', handleTouchStart);
		document.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('touchstart', handleTouchStart);
			document.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	return (
		<motion.footer
			initial={{ y: 100, opacity: 0 }}
			animate={{
				y: isVisible ? 0 : 100,
				opacity: isVisible ? 1 : 0
			}}
			transition={{ duration: 0.3, ease: 'easeInOut' }}
			className="fixed bottom-0 left-0 right-0 z-50 w-full h-14 px-6 flex items-center bg-background/30 backdrop-blur-sm border-t border-foreground/10"
			onTouchStart={(e) => e.stopPropagation()}
		>
			{children}
		</motion.footer>
	);
};

export default FooterClient;
