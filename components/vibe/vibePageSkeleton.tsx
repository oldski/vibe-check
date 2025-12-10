'use client'

export default function VibePageSkeleton() {
	return (
		<div className="fixed inset-0 z-30 overflow-hidden bg-muted animate-pulse">
			{/* Shimmer overlay */}
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/5 to-transparent skeleton-shimmer" />

			{/* Content container matching vibePageLayout */}
			<div className="relative z-10 w-full h-full flex flex-col p-6 pt-16 pb-16">
				<div className="w-full h-full flex flex-col">
					{/* Top row: Date on right */}
					<div className="flex justify-end mb-4">
						<div className="w-32 h-8 rounded-lg bg-muted-foreground/20" />
					</div>

					{/* Message section - flex-1 to fill space, justify-end */}
					<div className="flex-1 flex flex-col justify-end lg:w-3/4">
						<div className="space-y-3">
							<div className="w-full h-10 rounded bg-muted-foreground/20" />
							<div className="w-4/5 h-10 rounded bg-muted-foreground/20" />
							<div className="w-3/5 h-10 rounded bg-muted-foreground/20" />
						</div>
					</div>

					{/* Bottom section: Vibe type + Audio */}
					<div className="flex items-center justify-between mt-4">
						{/* Vibe type placeholder */}
						<div className="w-20 h-4 rounded bg-muted-foreground/20" />

						{/* Audio/Spotify placeholder */}
						<div className="w-24 h-20 rounded-lg bg-muted-foreground/20" />
					</div>
				</div>
			</div>
		</div>
	);
}
