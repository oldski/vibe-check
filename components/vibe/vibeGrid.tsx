'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type {DailyVibe, Vibe} from '@/lib/types'
import {useTheme} from "next-themes";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import {Calendar, Music} from "lucide-react";
import Link from "next/link";
import { getVibeStyles } from '@/lib/getVibeStyles';
import {cn} from "@/lib/utils";

type VibeGridProps = {
	dailyVibes: DailyVibe[];
	vibes: Vibe[];
	handle: string;
	profile: {
		id: string;
		display_name: string | null;
		created_at: string;
	}
}
export default function VibeGrid({ dailyVibes, vibes, handle, profile }: VibeGridProps) {
	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

	return (
		<>
			<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid-flow-row w-full">
				<AnimatePresence>
					{dailyVibes.map((entry) => {
						const vibeStyle = getVibeStyles(entry.vibe.vibe_type, currentTheme)
						return (
							<Link
								key={entry.id}
								href={`/v/${handle}/${entry.id}`}
								scroll={false}
								shallow={true}
								prefetch={false}
							>
								<motion.div
									key={entry.id}
									layout
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{
										delay: Math.random() * 0.5,
										duration: 0.6,
										ease: 'easeOut',
									}}
									whileTap={{ scale: 0.98 }}
									className="relative group aspect-square w-full overflow-hidden shadow-md hover:shadow-xl transition-shadow will-change-transform isolate"
								>
									{/* Image background (blurred) */}
									{entry.media ? (
										<div
											className="absolute inset-0 z-0 bg-cover bg-center scale-105 blur-sm group-hover:blur-0 transition-transform duration-500 ease-out group-hover:scale-110"
											style={{ backgroundImage: `url(${entry.media})` }}
										/>
									) : (
										<div
											className="absolute inset-0 z-0 bg-white"
										/>
									)}

									{/* Color overlay */}
									<div
										className={
										cn(
											"absolute inset-0 z-10 mix-blend-multiply pointer-events-none transition-opacity duration-500 ease-in-out",
											currentTheme === 'light' ? `bg-${entry.vibe.vibe_type.toLowerCase()}-400` : `bg-${entry.vibe.vibe_type.toLowerCase()}-900`,
										)
									}
										style={{ opacity: 0.85 }}
									/>

									{/* Foreground content */}
									<div className={cn(
										"relative z-20 p-4 h-full flex flex-col justify-end",
										currentTheme === 'light' ? `text-${entry.vibe.vibe_type.toLowerCase()}-800` : entry.vibe.vibe_type === 'Brat' ? `text-${entry.vibe.vibe_type.toLowerCase()}-400` : `text-${entry.vibe.vibe_type.toLowerCase()}-500`,
									)}>
										{/* Date - above message */}
										<div className="flex flex-row items-center gap-2 mb-2">
											<Calendar size={14} className={cn("opacity-60", vibeStyle?.text)} />
											<div className={cn("text-xs opacity-60 font-medium", vibeStyle?.text)}>
												{format(parseISO(entry.vibe_date), 'MMMM d, yyyy')}
											</div>
										</div>

										{/* Message */}
										<div className={cn(
											"font-bold tracking-tight text-xl sm:text-2xl md:text-3xl mb-2",
											currentTheme === 'light' ? `text-${entry.vibe.vibe_type.toLowerCase()}-800` : entry.vibe.vibe_type === 'Brat' ? `text-${entry.vibe.vibe_type.toLowerCase()}-400` : `text-${entry.vibe.vibe_type.toLowerCase()}-500`,
										)}>
											{entry.message}
										</div>

										{/* Bottom row: vibe type + audio indicator */}
										<div className={cn(
											"flex items-center justify-between",
											currentTheme === 'light' ? `text-${entry.vibe.vibe_type.toLowerCase()}-800` : entry.vibe.vibe_type === 'Brat' ? `text-${entry.vibe.vibe_type.toLowerCase()}-400` : `text-${entry.vibe.vibe_type.toLowerCase()}-500`,
										)}>
											<div className="transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-90 transition duration-300 ease-out">
												<div className="text-xs tracking-widest uppercase font-bold opacity-30 line-clamp-3">
													{entry.vibe.vibe_type}
												</div>
											</div>
											<motion.div
												whileHover={{
													scale: 1.1,
													opacity: 1,
												}}
												transition={{
													type: 'spring',
													stiffness: 200,
													damping: 20
												}}
												className="inline-block"
											>
												{entry.audio && <Music />}
											</motion.div>
										</div>
									</div>
								</motion.div>
							</Link>
						)
					})}
				</AnimatePresence>
			</div>
		</>
	)
}
