import { getSupabaseServerClient } from './supabase';
import { getFollowCounts, isFollowing } from './follows';
import type { ProfileWithFollowStatus } from './types';

type GetPublicProfilesOptions = {
	currentUserId?: string | null;
	limit?: number;
	offset?: number;
	excludeUserId?: string; // Exclude current user from results
};

/**
 * Get public profiles for discovery page
 * Returns profiles with follow status and basic stats
 */
export async function getPublicProfiles({
	currentUserId,
	limit = 20,
	offset = 0,
	excludeUserId,
}: GetPublicProfilesOptions = {}): Promise<ProfileWithFollowStatus[]> {
	const supabase = await getSupabaseServerClient();

	// Get public profiles
	let query = supabase
		.from('profiles')
		.select('*')
		.eq('is_public', true)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1);

	// Exclude current user if specified
	if (excludeUserId) {
		query = query.neq('id', excludeUserId);
	}

	const { data: profiles, error } = await query;

	if (error || !profiles) {
		console.error('Error fetching public profiles:', error);
		return [];
	}

	// Enrich profiles with follow counts and vibe counts
	const enrichedProfiles = await Promise.all(
		profiles.map(async (profile) => {
			// Get follow counts
			const followCounts = await getFollowCounts(profile.id);

			// Get vibe count
			const { count: vibeCount } = await supabase
				.from('dailyvibes')
				.select('id', { count: 'exact', head: true })
				.eq('profile_id', profile.id);

			// Check if current user is following this profile
			const userIsFollowing = currentUserId && currentUserId !== profile.id
				? await isFollowing(currentUserId, profile.id)
				: false;

			return {
				...profile,
				isFollowing: userIsFollowing,
				followerCount: followCounts.followers,
				vibeCount: vibeCount ?? 0,
			} as ProfileWithFollowStatus;
		})
	);

	return enrichedProfiles;
}

/**
 * Get profiles that a user is following (for "Following" feed)
 */
export async function getFollowingProfiles(
	userId: string,
	limit = 20,
	offset = 0
): Promise<ProfileWithFollowStatus[]> {
	const supabase = await getSupabaseServerClient();

	// Get profiles that this user follows
	const { data: follows, error } = await supabase
		.from('follows')
		.select(`
			following:profiles!following_id (
				id,
				handle,
				display_name,
				avatar_url,
				bio,
				is_public,
				created_at,
				updated_at
			)
		`)
		.eq('follower_id', userId)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1);

	if (error || !follows) {
		console.error('Error fetching following profiles:', error);
		return [];
	}

	// Extract and enrich profiles
	const profiles = follows.map((f) => f.following).filter(Boolean);

	const enrichedProfiles = await Promise.all(
		profiles.map(async (profile: any) => {
			const followCounts = await getFollowCounts(profile.id);

			const { count: vibeCount } = await supabase
				.from('dailyvibes')
				.select('id', { count: 'exact', head: true })
				.eq('profile_id', profile.id);

			return {
				...profile,
				isFollowing: true, // User is following these profiles
				followerCount: followCounts.followers,
				vibeCount: vibeCount ?? 0,
			} as ProfileWithFollowStatus;
		})
	);

	return enrichedProfiles;
}
