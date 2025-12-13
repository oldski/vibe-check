import { getSupabaseServerClient } from '@/lib/supabase';
import { getPublicProfiles, getFollowingProfiles } from '@/lib/getPublicProfiles';
import DiscoveryCard from '@/components/discovery/discoveryCard';
import DiscoverySearch from '@/components/discovery/discoverySearch';
import TrendingVibes from '@/components/discovery/trendingVibes';
import VibeOfDay from '@/components/discovery/vibeOfDay';
import { Compass, Users } from 'lucide-react';

export const metadata = {
	title: 'Discover | Vibe Check',
	description: 'Discover new people and vibes to follow',
};

export default async function DiscoverPage() {
	const supabase = await getSupabaseServerClient();
	const { data: { user } } = await supabase.auth.getUser();

	// Get public profiles (excluding current user)
	const profiles = await getPublicProfiles({
		currentUserId: user?.id,
		excludeUserId: user?.id,
		limit: 30,
	});

	// Get profiles the user is following (if logged in)
	const followingProfiles = user
		? await getFollowingProfiles(user.id, 10)
		: [];

	return (
		<div className="w-full max-w-6xl mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold flex items-center gap-3">
					<Compass className="size-8" />
					Discover
				</h1>
				<p className="text-muted-foreground mt-2">
					Find new people to follow and explore their vibes
				</p>
			</div>

			{/* Search */}
			<DiscoverySearch />

			{/* Trending & Vibe of Day */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
				<TrendingVibes />
				<VibeOfDay />
			</div>

			{/* Following Section (if user is logged in and following people) */}
			{followingProfiles.length > 0 && (
				<section className="mb-12">
					<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
						<Users className="size-5" />
						People You Follow
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{followingProfiles.map((profile, index) => (
							<DiscoveryCard
								key={profile.id}
								profile={profile}
								currentUserId={user?.id}
								index={index}
							/>
						))}
					</div>
				</section>
			)}

			{/* Discover Section */}
			<section>
				<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
					<Compass className="size-5" />
					{followingProfiles.length > 0 ? 'Discover New People' : 'All Public Vibers'}
				</h2>

				{profiles.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{profiles.map((profile, index) => (
							<DiscoveryCard
								key={profile.id}
								profile={profile}
								currentUserId={user?.id}
								index={index}
							/>
						))}
					</div>
				) : (
					<div className="text-center py-12 bg-muted/30 rounded-xl">
						<Compass className="size-12 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-lg font-medium mb-2">No profiles to discover yet</h3>
						<p className="text-muted-foreground">
							Be the first to share your vibes publicly!
						</p>
					</div>
				)}
			</section>

			{/* CTA for non-logged in users */}
			{!user && (
				<div className="mt-12 p-6 bg-muted/50 rounded-xl text-center">
					<h3 className="text-lg font-semibold mb-2">Join the vibe</h3>
					<p className="text-muted-foreground mb-4">
						Sign up to follow people and share your own vibes
					</p>
					<a
						href="/sign-up"
						className="inline-flex items-center gap-2 px-6 py-2 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition"
					>
						Get Started
					</a>
				</div>
			)}
		</div>
	);
}
