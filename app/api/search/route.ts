import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get('q');
	const type = searchParams.get('type') || 'all'; // 'all', 'users', 'vibes'
	const emotion = searchParams.get('emotion'); // Filter by vibe_type
	const limit = parseInt(searchParams.get('limit') || '10');

	const supabase = await createClient();

	const results: { users: any[]; vibes: any[] } = {
		users: [],
		vibes: [],
	};

	// If searching by emotion only (no text query required)
	if (emotion) {
		// First get the vibe ID for this emotion type
		const { data: vibeData, error: vibeError } = await supabase
			.from('vibes')
			.select('id')
			.ilike('vibe_type', emotion)
			.single();

		if (vibeError || !vibeData) {
			console.error('Error finding vibe type:', vibeError, 'for emotion:', emotion);
			return NextResponse.json(results);
		}

		const { data: vibes, error: vibesError } = await supabase
			.from('dailyvibes')
			.select(`
				id,
				vibe_date,
				message,
				media,
				profile_id,
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
			.eq('vibe', vibeData.id)
			.order('vibe_date', { ascending: false })
			.limit(limit * 2);

		if (vibesError) {
			console.error('Error searching vibes by emotion:', vibesError);
		} else {
			// Include all vibes - discovery is for public exploration
			results.vibes = (vibes || []).slice(0, limit);
		}

		return NextResponse.json(results);
	}

	// Text-based search requires minimum 2 characters
	if (!query || query.length < 2) {
		return NextResponse.json({ users: [], vibes: [] });
	}

	const searchTerm = `%${query}%`;

	// Search users (public profiles only)
	if (type === 'all' || type === 'users') {
		const { data: users, error: usersError } = await supabase
			.from('profiles')
			.select('id, handle, display_name, avatar_url, bio, is_public')
			.eq('is_public', true)
			.or(`handle.ilike.${searchTerm},display_name.ilike.${searchTerm},bio.ilike.${searchTerm}`)
			.limit(limit);

		if (usersError) {
			console.error('Error searching users:', usersError);
		} else {
			results.users = users || [];
		}
	}

	// Search vibes (from public profiles only)
	if (type === 'all' || type === 'vibes') {
		const { data: vibes, error: vibesError } = await supabase
			.from('dailyvibes')
			.select(`
				id,
				vibe_date,
				message,
				media,
				profile_id,
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
			.ilike('message', searchTerm)
			.limit(limit * 2);

		if (vibesError) {
			console.error('Error searching vibes:', vibesError);
		} else {
			// Filter to only include vibes from public profiles
			const publicVibes = (vibes || [])
				.filter((v: any) => v.profile?.is_public === true)
				.slice(0, limit);
			results.vibes = publicVibes;
		}
	}

	return NextResponse.json(results);
}
