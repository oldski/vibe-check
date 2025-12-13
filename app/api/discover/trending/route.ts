import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
	const supabase = await createClient();

	// Get vibes from the past 7 days
	const weekAgo = new Date();
	weekAgo.setDate(weekAgo.getDate() - 7);
	const weekAgoStr = weekAgo.toISOString().split('T')[0];

	// Get all vibes from public profiles in the past week
	const { data: vibes, error } = await supabase
		.from('dailyvibes')
		.select(`
			vibe,
			profile:profiles!profile_id (
				is_public
			)
		`)
		.gte('vibe_date', weekAgoStr);

	if (error) {
		console.error('Error fetching trending vibes:', error);
		return NextResponse.json({ trending: [] });
	}

	// Filter to only public profiles and count by vibe
	const vibeCounts: Record<number, number> = {};
	(vibes || []).forEach((v: any) => {
		if (v.profile?.is_public) {
			vibeCounts[v.vibe] = (vibeCounts[v.vibe] || 0) + 1;
		}
	});

	// Get vibe details for the top vibes
	const vibeIds = Object.keys(vibeCounts).map(Number);
	if (vibeIds.length === 0) {
		return NextResponse.json({ trending: [] });
	}

	const { data: vibeDetails } = await supabase
		.from('vibes')
		.select('id, vibe_type, color_light, color_dark')
		.in('id', vibeIds);

	// Sort by count and take top 5
	const trending = (vibeDetails || [])
		.map((vibe) => ({
			...vibe,
			count: vibeCounts[vibe.id] || 0,
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);

	return NextResponse.json({ trending });
}
