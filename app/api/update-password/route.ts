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
		const { password } = body;

		if (!password) {
			return NextResponse.json({ error: 'Password is required' }, { status: 400 });
		}

		if (password.length < 6) {
			return NextResponse.json(
				{ error: 'Password must be at least 6 characters' },
				{ status: 400 }
			);
		}

		const { error } = await supabase.auth.updateUser({
			password: password,
		});

		if (error) {
			console.error('Password update error:', error);
			return NextResponse.json(
				{ error: error.message || 'Failed to update password' },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Password updated successfully',
		});
	} catch (err) {
		console.error('Update password error:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
