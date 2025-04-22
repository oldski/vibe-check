'use client';

import {useScroll, useTransform, motion, useSpring} from 'framer-motion';
import type {Vibe} from '@/lib/types';
import {useRef} from "react";
import {clsx} from "clsx";
import {cn} from "@/lib/utils";

type VibeBackgroundProps = {
	vibes: Vibe[]
}
const VibeBackground = ({vibes}: VibeBackgroundProps) => {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start'],
	});
	
	const colorWeights = ['500', '600', '700', '800'];
	const blocksNeeded = 24; // 4 rows x 9 cols
	
	// Generate 36 vibe color blocks with random class variants
	const grid = Array.from({ length: blocksNeeded }).map((_, i) => {
		const vibe = vibes[i % vibes.length];
		const vibeType = vibe.vibe_type.toLowerCase();
		const weight = colorWeights[Math.floor(Math.random() * colorWeights.length)];
		return {
			id: `${vibe.vibe_type}-${i}`,
			className: `bg-${vibeType}-${weight}`,
		};
	});
	
	
	// Group into rows based on column count (we’ll use CSS to control actual layout)
	const rows = [];
	const columns = 9; // Max for xl screen — layout will reflow on smaller screens
	for (let i = 0; i < grid.length; i += columns) {
		rows.push(grid.slice(i, i + columns));
	}
	
	return (
		<div ref={ref} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
			<div className="flex flex-col w-full h-full justify-center">
				{rows.map((row, rowIndex) => {
					const direction = rowIndex % 2 === 0 ? 1 : -1;
					const rawX = useTransform(scrollYProgress, [0, 1], [0, 60 * direction]);
					const x = useSpring(rawX, { stiffness: 30, damping: 20 });
					
					// const paddedRow = [row[row.length - 1], ...row, row[0]];
					
					return (
						<motion.div
							key={rowIndex}
							style={{ x }}
							className={cn(
								'grid w-full overflow-hidden',
								'grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid-flow-row w-full',
								// 'grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9',
								'w-[120%] h-full -ml-[10%]'
							)}
						>
							{row.map((block) => (
								<div
									key={block.id}
									className={cn(
										'transition duration-300 ease-in-out',
										'aspect-square',
										'hover:opacity-80',
										block.className
									)}
								/>
							))}
						</motion.div>
					);
				})}
			</div>
		</div>
	);
};

export default VibeBackground;