import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { followUser, unfollowUser, getFollowCounts, isFollowing } from '@/lib/follows';

export async function POST(request: Request) {
	try {
		const supabase = await createClient();
		const { data: { user } } = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { targetId, action } = body;

		if (!targetId || !action) {
			return NextResponse.json(
				{ error: 'Missing targetId or action' },
				{ status: 400 }
			);
		}

		if (targetId === user.id) {
			return NextResponse.json(
				{ error: 'Cannot follow yourself' },
				{ status: 400 }
			);
		}

		let success = false;

		if (action === 'follow') {
			success = await followUser(user.id, targetId);
		} else if (action === 'unfollow') {
			success = await unfollowUser(user.id, targetId);
		} else {
			return NextResponse.json(
				{ error: 'Invalid action. Use "follow" or "unfollow"' },
				{ status: 400 }
			);
		}

		if (!success) {
			return NextResponse.json(
				{ error: `Failed to ${action}` },
				{ status: 500 }
			);
		}

		// Return updated counts
		const counts = await getFollowCounts(targetId);
		const nowFollowing = await isFollowing(user.id, targetId);

		return NextResponse.json({
			success: true,
			isFollowing: nowFollowing,
			counts,
		});
	} catch (error) {
		console.error('Follow API error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// GET endpoint to check follow status
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const targetId = searchParams.get('targetId');

		if (!targetId) {
			return NextResponse.json(
				{ error: 'Missing targetId' },
				{ status: 400 }
			);
		}

		const supabase = await createClient();
		const { data: { user } } = await supabase.auth.getUser();

		const counts = await getFollowCounts(targetId);
		const following = user ? await isFollowing(user.id, targetId) : false;

		return NextResponse.json({
			isFollowing: following,
			counts,
		});
	} catch (error) {
		console.error('Follow status API error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
