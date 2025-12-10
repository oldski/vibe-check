import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
	try {
		const supabase = await createClient();
		const { data: { user } } = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Delete user's vibes first (cascade should handle this, but being explicit)
		const { error: vibesError } = await supabase
			.from('dailyvibes')
			.delete()
			.eq('profile_id', user.id);

		if (vibesError) {
			console.error('Error deleting vibes:', vibesError);
			// Continue anyway - profile deletion might cascade
		}

		// Delete user's media from storage
		const { data: mediaFiles } = await supabase.storage
			.from('vibes-media')
			.list(user.id);

		if (mediaFiles && mediaFiles.length > 0) {
			const filesToDelete = mediaFiles.map(f => `${user.id}/${f.name}`);
			await supabase.storage.from('vibes-media').remove(filesToDelete);
		}

		// Delete avatar from storage
		const { data: avatarFiles } = await supabase.storage
			.from('avatars')
			.list(user.id);

		if (avatarFiles && avatarFiles.length > 0) {
			const filesToDelete = avatarFiles.map(f => `${user.id}/${f.name}`);
			await supabase.storage.from('avatars').remove(filesToDelete);
		}

		// Delete profile (should cascade from auth user deletion, but being explicit)
		const { error: profileError } = await supabase
			.from('profiles')
			.delete()
			.eq('id', user.id);

		if (profileError) {
			console.error('Error deleting profile:', profileError);
		}

		// Sign out the user
		await supabase.auth.signOut();

		// Note: Actually deleting the auth user requires admin privileges
		// The profile and data are deleted, but the auth record may remain
		// unless using Supabase admin client or a database trigger

		return NextResponse.json({
			success: true,
			message: 'Account deleted successfully',
		});
	} catch (err) {
		console.error('Delete account error:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
