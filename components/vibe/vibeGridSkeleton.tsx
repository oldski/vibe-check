'use client'

import { cn } from "@/lib/utils";

type VibeGridSkeletonProps = {
	count?: number;
}

export default function VibeGridSkeleton({ count = 6 }: VibeGridSkeletonProps) {
	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid-flow-row w-full">
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={i}
					className="relative aspect-square w-full overflow-hidden bg-muted animate-pulse"
				>
					{/* Shimmer effect */}
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent skeleton-shimmer" />

					{/* Content placeholders */}
					<div className="absolute inset-0 p-4 flex flex-col justify-end">
						{/* Date placeholder */}
						<div className="flex items-center gap-2 mb-2">
							<div className="w-4 h-4 rounded bg-muted-foreground/20" />
							<div className="w-24 h-3 rounded bg-muted-foreground/20" />
						</div>

						{/* Message placeholder - 3 lines */}
						<div className="space-y-2 mb-2">
							<div className="w-full h-6 rounded bg-muted-foreground/20" />
							<div className="w-4/5 h-6 rounded bg-muted-foreground/20" />
							<div className="w-2/3 h-6 rounded bg-muted-foreground/20" />
						</div>

						{/* Bottom row placeholder */}
						<div className="flex items-center justify-between">
							<div className="w-16 h-3 rounded bg-muted-foreground/20" />
							<div className="w-6 h-6 rounded bg-muted-foreground/20" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
