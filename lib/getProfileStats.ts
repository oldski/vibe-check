import { ProfileStats } from './types';
import { getSupabaseServerClient } from './supabase';

export async function getProfileStats(profileId: string): Promise<ProfileStats> {
	const supabase = await getSupabaseServerClient();

	// Get all vibes for this profile
	const { data: vibes, error } = await supabase
		.from('dailyvibes')
		.select(`
			id,
			vibe_date,
			vibe (
				vibe_type
			)
		`)
		.eq('profile_id', profileId)
		.order('vibe_date', { ascending: false });

	if (error || !vibes) {
		return {
			totalVibes: 0,
			mostUsedVibe: null,
			currentStreak: 0,
			longestStreak: 0,
			thisMonthVibes: 0,
		};
	}

	// Total vibes
	const totalVibes = vibes.length;

	// Most used vibe
	const vibeCounts: Record<string, number> = {};
	vibes.forEach((v: any) => {
		const vibeType = v.vibe?.vibe_type;
		if (vibeType) {
			vibeCounts[vibeType] = (vibeCounts[vibeType] || 0) + 1;
		}
	});

	let mostUsedVibe: { vibe_type: string; count: number } | null = null;
	let maxCount = 0;
	for (const [vibe_type, count] of Object.entries(vibeCounts)) {
		if (count > maxCount) {
			maxCount = count;
			mostUsedVibe = { vibe_type, count };
		}
	}

	// Calculate streaks
	const dates = vibes.map((v: any) => v.vibe_date).sort().reverse();
	const uniqueDates = Array.from(new Set(dates));

	let currentStreak = 0;
	let longestStreak = 0;
	let tempStreak = 0;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	for (let i = 0; i < uniqueDates.length; i++) {
		const vibeDate = new Date(uniqueDates[i]);
		vibeDate.setHours(0, 0, 0, 0);

		const expectedDate = new Date(today);
		expectedDate.setDate(expectedDate.getDate() - i);
		expectedDate.setHours(0, 0, 0, 0);

		if (vibeDate.getTime() === expectedDate.getTime()) {
			tempStreak++;
			if (i === uniqueDates.length - 1 || tempStreak > longestStreak) {
				longestStreak = Math.max(longestStreak, tempStreak);
			}
		} else {
			if (i === 0) {
				// Check if yesterday had a vibe (streak might still be active)
				const yesterday = new Date(today);
				yesterday.setDate(yesterday.getDate() - 1);
				if (vibeDate.getTime() === yesterday.getTime()) {
					tempStreak++;
					continue;
				}
			}
			currentStreak = tempStreak;
			tempStreak = 1;
		}
	}

	currentStreak = tempStreak;
	longestStreak = Math.max(longestStreak, tempStreak);

	// This month's vibes
	const now = new Date();
	const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	const thisMonthVibes = vibes.filter((v: any) => {
		const vibeDate = new Date(v.vibe_date);
		return vibeDate >= firstOfMonth;
	}).length;

	return {
		totalVibes,
		mostUsedVibe,
		currentStreak,
		longestStreak,
		thisMonthVibes,
	};
}
