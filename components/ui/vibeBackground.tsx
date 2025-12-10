'use client';

import { motion } from 'framer-motion';
import type { Vibe } from '@/lib/types';
import { cn } from '@/lib/utils';

type VibeBackgroundProps = {
	vibes: Vibe[];
};

const VibeBackground = ({ vibes }: VibeBackgroundProps) => {
	const colorWeights = ['500', '600', '700', '800'];
	const blocksNeeded = 12;
	
	const images = [
		{ filename: 'blockparty-street-panda.jpg' },
		{ filename: 'friends-drinks-laughing.jpg' },
		{ filename: 'friends-sun-group.jpg' },
		{ filename: 'pool-inflatable.jpg' },
		{ filename: 'blockparty-street-panda.jpg' },
		{ filename: 'friends-drinks-laughing.jpg' },
		{ filename: 'friends-sun-group.jpg' },
		{ filename: 'pool-inflatable.jpg' },
	];
	
	// Pick random blocks to get images
	const imageIndexes = new Set<number>();
	while (imageIndexes.size < images.length) {
		imageIndexes.add(Math.floor(Math.random() * blocksNeeded));
	}
	const imageIndexArray = Array.from(imageIndexes);
	
	// Generate vibe-colored grid blocks
	const grid = Array.from({ length: blocksNeeded }).map((_, i) => {
		const vibe = vibes[i % vibes.length];
		const vibeType = vibe.vibe_type.toLowerCase();
		const weight = colorWeights[Math.floor(Math.random() * colorWeights.length)];
		const hasImage = imageIndexArray.includes(i);
		const image = hasImage ? images[imageIndexArray.indexOf(i)] : null;
		
		return {
			id: `${vibe.vibe_type}-${i}`,
			className: `bg-${vibeType}-${weight}`,
			image,
		};
	});
	
	return (
		<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
			<div className="w-full h-full">
				<div
					className={cn(
						'grid w-full',
						'grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid-flow-row',
						// 'w-[120%] h-full -ml-[10%]'
					)}
				>
					{grid.map((block, index) => (
						<motion.div
							key={block.id}
							className="relative aspect-square w-full overflow-hidden isolate"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								delay: Math.random() * 0.5,
								duration: 0.6,
								ease: 'easeOut',
							}}
						>
							{/* Blurred image background */}
							{block.image && (
								<div
									className="absolute inset-0 z-0 bg-cover bg-center scale-105"
									style={{ backgroundImage: `url(/images/${block.image.filename})` }}
								/>
							)}
							
							{/* Color overlay */}
							<div
								className={cn(
									"absolute inset-0 z-10 mix-blend-multiply pointer-events-none backdrop-blur-sm",
									block.className
								)}
								style={{ opacity: 0.85 }}
							/>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

export default VibeBackground;
