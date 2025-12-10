'use client';

import { ProfileStats } from '@/lib/types';
import { Hash, Flame, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

type BackstageStatsProps = {
	stats: ProfileStats;
};

type StatCardProps = {
	label: string;
	value: string | number;
	icon: React.ReactNode;
	subtext?: string;
	className?: string;
};

function StatCard({ label, value, icon, subtext, className }: StatCardProps) {
	return (
		<div className={cn("bg-card border rounded-xl p-4", className)}>
			<div className="flex items-center gap-3 mb-2">
				<div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
					{icon}
				</div>
				<span className="text-sm text-muted-foreground">{label}</span>
			</div>
			<p className="text-2xl font-bold">{value}</p>
			{subtext && (
				<p className="text-xs text-muted-foreground mt-1">{subtext}</p>
			)}
		</div>
	);
}

export default function BackstageStats({ stats }: BackstageStatsProps) {
	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold">Your Vibe Stats</h2>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<StatCard
					label="Total Vibes"
					value={stats.totalVibes}
					icon={<Hash className="size-4 text-muted-foreground" />}
				/>

				<StatCard
					label="Current Streak"
					value={stats.currentStreak}
					icon={<Flame className="size-4 text-orange-500" />}
					subtext={stats.currentStreak > 0 ? "days in a row" : "Start today!"}
				/>

				<StatCard
					label="Longest Streak"
					value={stats.longestStreak}
					icon={<TrendingUp className="size-4 text-green-500" />}
					subtext="days"
				/>

				<StatCard
					label="This Month"
					value={stats.thisMonthVibes}
					icon={<Calendar className="size-4 text-blue-500" />}
					subtext="vibes"
				/>
			</div>

			{/* Most used vibe */}
			{stats.mostUsedVibe && (
				<div className="bg-card border rounded-xl p-4">
					<p className="text-sm text-muted-foreground mb-2">Most Used Vibe</p>
					<div className="flex items-center justify-between">
						<span className="text-xl font-bold capitalize">
							{stats.mostUsedVibe.vibe_type}
						</span>
						<span className="text-sm text-muted-foreground">
							{stats.mostUsedVibe.count} times
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
