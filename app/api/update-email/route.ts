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
		const { email } = body;

		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 });
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
		}

		// Update email - Supabase will send verification email
		const { error } = await supabase.auth.updateUser({
			email: email,
		});

		if (error) {
			console.error('Email update error:', error);
			return NextResponse.json(
				{ error: error.message || 'Failed to update email' },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Verification email sent',
		});
	} catch (err) {
		console.error('Update email error:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
