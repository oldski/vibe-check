import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const handle = searchParams.get('handle');

		if (!handle) {
			return NextResponse.json(
				{ error: 'Handle is required' },
				{ status: 400 }
			);
		}

		// Validate handle format
		const handleRegex = /^[a-zA-Z0-9_-]{3,30}$/;
		if (!handleRegex.test(handle)) {
			return NextResponse.json({
				available: false,
				error: 'Handle must be 3-30 characters and contain only letters, numbers, underscores, and hyphens'
			});
		}

		const supabase = await createClient();
		const { data: { user } } = await supabase.auth.getUser();

		// Check if handle is taken
		let query = supabase
			.from('profiles')
			.select('id')
			.eq('handle', handle.toLowerCase());

		// Exclude current user's handle from check
		if (user) {
			query = query.neq('id', user.id);
		}

		const { data: existingProfile } = await query.single();

		return NextResponse.json({
			available: !existingProfile,
			handle: handle.toLowerCase()
		});
	} catch (err) {
		console.error('Check handle error:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
