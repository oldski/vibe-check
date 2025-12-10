import { getSupabaseServerClient } from './supabase';
import { FollowCounts, FollowStatus } from './types';

/**
 * Get follow counts for a profile
 */
export async function getFollowCounts(profileId: string): Promise<FollowCounts> {
	const supabase = await getSupabaseServerClient();

	const [followersResult, followingResult] = await Promise.all([
		supabase
			.from('follows')
			.select('id', { count: 'exact', head: true })
			.eq('following_id', profileId),
		supabase
			.from('follows')
			.select('id', { count: 'exact', head: true })
			.eq('follower_id', profileId),
	]);

	return {
		followers: followersResult.count ?? 0,
		following: followingResult.count ?? 0,
	};
}

/**
 * Check if a user is following another user
 */
export async function isFollowing(followerId: string, targetId: string): Promise<boolean> {
	const supabase = await getSupabaseServerClient();

	const { data } = await supabase
		.from('follows')
		.select('id')
		.eq('follower_id', followerId)
		.eq('following_id', targetId)
		.single();

	return !!data;
}

/**
 * Get full follow status for displaying on a profile
 */
export async function getFollowStatus(
	viewerId: string | null,
	profileId: string
): Promise<FollowStatus> {
	const counts = await getFollowCounts(profileId);

	if (!viewerId || viewerId === profileId) {
		return { isFollowing: false, counts };
	}

	const following = await isFollowing(viewerId, profileId);
	return { isFollowing: following, counts };
}

/**
 * Follow a user
 */
export async function followUser(followerId: string, targetId: string): Promise<boolean> {
	const supabase = await getSupabaseServerClient();

	const { error } = await supabase.from('follows').insert({
		follower_id: followerId,
		following_id: targetId,
	});

	if (error) {
		console.error('Follow error:', error);
		return false;
	}

	return true;
}

/**
 * Unfollow a user
 */
export async function unfollowUser(followerId: string, targetId: string): Promise<boolean> {
	const supabase = await getSupabaseServerClient();

	const { error } = await supabase
		.from('follows')
		.delete()
		.eq('follower_id', followerId)
		.eq('following_id', targetId);

	if (error) {
		console.error('Unfollow error:', error);
		return false;
	}

	return true;
}

/**
 * Get list of followers for a profile
 */
export async function getFollowers(profileId: string) {
	const supabase = await getSupabaseServerClient();

	const { data, error } = await supabase
		.from('follows')
		.select(`
			id,
			created_at,
			follower:profiles!follower_id (
				id,
				handle,
				display_name,
				avatar_url
			)
		`)
		.eq('following_id', profileId)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Get followers error:', error);
		return [];
	}

	return data?.map((f) => f.follower) ?? [];
}

/**
 * Get list of users a profile is following
 */
export async function getFollowing(profileId: string) {
	const supabase = await getSupabaseServerClient();

	const { data, error } = await supabase
		.from('follows')
		.select(`
			id,
			created_at,
			following:profiles!following_id (
				id,
				handle,
				display_name,
				avatar_url
			)
		`)
		.eq('follower_id', profileId)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Get following error:', error);
		return [];
	}

	return data?.map((f) => f.following) ?? [];
}
