'use client';

import Link from "next/link";
import { useEffect, useState, ReactNode } from "react";
import { useVibeHeader } from "@/contexts/vibeHeaderContext";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

type HeaderClientProps = {
	children: ReactNode; // This will be HeaderAuth passed from server component
};

const HOTSPOT_HEIGHT = 60; // pixels from top to trigger header

const HeaderClient = ({ children }: HeaderClientProps) => {
	const { state } = useVibeHeader();
	const [navVisible, setNavVisible] = useState(false);

	const isVibePage = state.isVibePage;

	useEffect(() => {
		// Start hidden
		setNavVisible(false);

		const handleMouseMove = (e: MouseEvent) => {
			const isInHotspot = e.clientY <= HOTSPOT_HEIGHT;
			setNavVisible(isInHotspot);
		};

		const handleTouchStart = () => {
			// Toggle on tap
			setNavVisible(prev => !prev);
		};

		const handleMouseLeave = () => {
			setNavVisible(false);
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
		<header className="fixed top-0 left-0 right-0 z-50">
			{/* Backdrop blur - only when nav is visible */}
			<motion.div
				className="absolute inset-0 bg-background/30 backdrop-blur-sm border-b border-foreground/10"
				initial={{ opacity: 0 }}
				animate={{ opacity: navVisible ? 1 : 0 }}
				transition={{ duration: 0.3 }}
			/>

			<nav className="relative w-full flex justify-center h-14">
				<div className="w-full flex justify-between items-center px-6 text-sm">
					{/* Left side - Logo (always visible) */}
					<div className="flex gap-4 items-center">
						{isVibePage && state.handle && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: navVisible ? 1 : 0 }}
								transition={{ duration: 0.3 }}
							>
								<Link
									href={`/v/${state.handle}`}
									className={clsx(
										"hover:opacity-70 transition-opacity",
										state.vibeStyles?.text
									)}
									title="back to vibes"
								>
									<ChevronLeft size={20} />
								</Link>
							</motion.div>
						)}
						<Link
							href="/"
							className={clsx(
								"font-semibold",
								isVibePage ? clsx("text-xs opacity-70", state.vibeStyles?.text) : ""
							)}
						>
							{isVibePage ? "VC" : "Vibe Check"}
						</Link>
					</div>

					{/* Right side - Nav items (hidden until hotspot) */}
					<motion.div
						className="flex gap-4 items-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: navVisible ? 1 : 0 }}
						transition={{ duration: 0.3 }}
					>
						{isVibePage && state.isOwner && state.vibeId && (
							<>
								<Link
									href={`/v/${state.handle}/${state.vibeId}/edit`}
									className={clsx(
										"hover:opacity-70 transition-opacity",
										state.vibeStyles?.text
									)}
									title="edit vibe"
								>
									<Pencil size={18} />
								</Link>
								{state.onDelete && (
									<button
										type="button"
										onClick={state.onDelete}
										className={clsx(
											"hover:opacity-70 transition-opacity",
											state.vibeStyles?.text
										)}
										title="delete vibe"
									>
										<Trash2 size={18} />
									</button>
								)}
							</>
						)}
						{!isVibePage && children}
					</motion.div>
				</div>
			</nav>
		</header>
	);
};

export default HeaderClient;
