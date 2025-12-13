import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Simple seeded random function using today's date
function seededRandom(seed: number): number {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

export async function GET() {
	const supabase = await createClient();

	// Get today's date as seed (same vibe all day)
	const today = new Date();
	const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

	// Get all public vibes with messages (good content for featuring)
	const { data: vibes, error } = await supabase
		.from('dailyvibes')
		.select(`
			id,
			vibe_date,
			message,
			media,
			vibe:vibes (
				id,
				vibe_type,
				color_light,
				color_dark
			),
			profile:profiles!profile_id (
				id,
				handle,
				display_name,
				avatar_url,
				is_public
			)
		`)
		.not('message', 'eq', '')
		.order('vibe_date', { ascending: false })
		.limit(100);

	if (error) {
		console.error('Error fetching vibe of day:', error);
		return NextResponse.json({ vibe: null });
	}

	// Filter to only public profiles with actual content
	const publicVibes = (vibes || []).filter(
		(v: any) => v.profile?.is_public && v.message && v.message.length > 10
	);

	if (publicVibes.length === 0) {
		return NextResponse.json({ vibe: null });
	}

	// Use seeded random to pick today's vibe
	const randomIndex = Math.floor(seededRandom(dateSeed) * publicVibes.length);
	const selectedVibe = publicVibes[randomIndex];

	return NextResponse.json({ vibe: selectedVibe });
}
