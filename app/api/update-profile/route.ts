import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const supabase = await createClient();
		const { data: { user } } = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const { display_name, handle, bio, is_public, avatar_url } = body;

		// Validate handle format
		if (handle) {
			const handleRegex = /^[a-zA-Z0-9_-]{3,30}$/;
			if (!handleRegex.test(handle)) {
				return NextResponse.json(
					{ error: 'Handle must be 3-30 characters and contain only letters, numbers, underscores, and hyphens' },
					{ status: 400 }
				);
			}

			// Check if handle is taken by another user
			const { data: existingProfile } = await supabase
				.from('profiles')
				.select('id')
				.eq('handle', handle.toLowerCase())
				.neq('id', user.id)
				.single();

			if (existingProfile) {
				return NextResponse.json(
					{ error: 'This handle is already taken' },
					{ status: 400 }
				);
			}
		}

		// Build update object
		const updateData: Record<string, any> = {
			updated_at: new Date().toISOString(),
		};

		if (display_name !== undefined) {
			updateData.display_name = display_name?.trim() || null;
		}

		if (handle !== undefined) {
			updateData.handle = handle.toLowerCase();
		}

		if (bio !== undefined) {
			updateData.bio = bio?.trim() || null;
		}

		if (is_public !== undefined) {
			updateData.is_public = is_public;
		}

		if (avatar_url !== undefined) {
			updateData.avatar_url = avatar_url || null;
		}

		const { data, error } = await supabase
			.from('profiles')
			.update(updateData)
			.eq('id', user.id)
			.select()
			.single();

		if (error) {
			console.error('Failed to update profile:', error);
			return NextResponse.json(
				{ error: 'Failed to update profile' },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, profile: data });
	} catch (err) {
		console.error('Update profile error:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
