import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import {
	vibeContent,
	timeInsights,
	getTimeOfDay,
	getRandomItem,
} from '@/lib/vibeAssistantData';
import { generateVibeInsight, generateReflectionPrompt } from '@/lib/huggingface';

export async function GET() {
	const supabase = await createClient();

	// Get current user
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	// Get user's recent vibes (last 14 days)
	const twoWeeksAgo = new Date();
	twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
	const twoWeeksAgoStr = twoWeeksAgo.toISOString().split('T')[0];

	const { data: recentVibes, error } = await supabase
		.from('dailyvibes')
		.select(`
			id,
			vibe_date,
			message,
			vibe:vibes (
				id,
				vibe_type
			)
		`)
		.eq('profile_id', user.id)
		.gte('vibe_date', twoWeeksAgoStr)
		.order('vibe_date', { ascending: false });

	if (error) {
		console.error('Error fetching vibes:', error);
		return NextResponse.json({ error: 'Failed to fetch vibes' }, { status: 500 });
	}

	// Analyze vibe patterns
	const vibeCounts: Record<string, number> = {};
	const recentMessages: string[] = [];

	(recentVibes || []).forEach((vibe: any) => {
		const vibeType = vibe.vibe?.vibe_type?.toLowerCase();
		if (vibeType) {
			vibeCounts[vibeType] = (vibeCounts[vibeType] || 0) + 1;
		}
		if (vibe.message) {
			recentMessages.push(vibe.message);
		}
	});

	// Find most common vibe
	const sortedVibes = Object.entries(vibeCounts).sort((a, b) => b[1] - a[1]);
	const dominantVibe = sortedVibes[0]?.[0] || 'chill';
	const mostRecentVibe = (recentVibes?.[0] as any)?.vibe?.vibe_type?.toLowerCase() || dominantVibe;

	// Get time of day for contextual insight
	const timeOfDay = getTimeOfDay();

	// Build personalized response
	const content = vibeContent[mostRecentVibe] || vibeContent['chill'];

	// Calculate streak first (needed for AI insight)
	let streak = 0;
	if (recentVibes && recentVibes.length > 0) {
		const today = new Date();
		const sortedByDate = [...recentVibes].sort((a: any, b: any) =>
			new Date(b.vibe_date).getTime() - new Date(a.vibe_date).getTime()
		);

		let checkDate = new Date(today);
		for (const vibe of sortedByDate as any[]) {
			const vibeDate = new Date(vibe.vibe_date);
			const diffDays = Math.floor((checkDate.getTime() - vibeDate.getTime()) / (1000 * 60 * 60 * 24));

			if (diffDays <= 1) {
				streak++;
				checkDate = vibeDate;
			} else {
				break;
			}
		}
	}

	// Try AI-generated mood insight first, with curated fallback
	let moodInsight = '';
	if (recentVibes && recentVibes.length >= 3) {
		// Try AI generation for users with enough data
		const aiInsight = await generateVibeInsight({
			dominantVibe,
			mostRecentVibe,
			vibeCount: recentVibes.length,
			streak,
			timeOfDay,
			patterns: sortedVibes.slice(0, 3).map(([vibe, count]) => ({ vibe, count })),
		});

		if (aiInsight) {
			moodInsight = aiInsight;
		} else {
			// Fallback to curated content
			if (dominantVibe === mostRecentVibe) {
				moodInsight = `You've been feeling ${dominantVibe} a lot lately (${vibeCounts[dominantVibe]} times in 2 weeks). ${getRandomItem(content.insights)}`;
			} else {
				moodInsight = `Interesting shift - your vibe today is ${mostRecentVibe}, but you've mostly been ${dominantVibe} lately. ${getRandomItem(content.insights)}`;
			}
		}
	} else if (recentVibes && recentVibes.length > 0) {
		moodInsight = `${getRandomItem(content.insights)} ${getRandomItem(timeInsights[timeOfDay])}`;
	} else {
		moodInsight = `Ready to start tracking your vibes? Your first check-in is always special. ${getRandomItem(timeInsights[timeOfDay])}`;
	}

	// Pick a song suggestion (curated - no AI needed for music)
	const songSuggestion = getRandomItem(content.songs);

	// Try AI-generated reflection prompt, with curated fallback
	let reflectionPrompt = await generateReflectionPrompt(mostRecentVibe, timeOfDay);
	if (!reflectionPrompt) {
		reflectionPrompt = getRandomItem(content.prompts);
	}

	return NextResponse.json({
		moodInsight,
		songSuggestion,
		reflectionPrompt,
		dominantVibe,
		mostRecentVibe,
		vibeCount: recentVibes?.length || 0,
		streak,
		timeOfDay,
		patterns: sortedVibes.slice(0, 3).map(([vibe, count]) => ({ vibe, count })),
	});
}
