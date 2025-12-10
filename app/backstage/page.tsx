import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getVibeProfileByUserId } from "@/lib/getVibeProfileByUserId";
import { getProfileStats } from "@/lib/getProfileStats";
import { Profile } from "@/lib/types";
import BackstageClient from "./backstageClient";

export default async function BackstagePage() {
	const supabase = await createClient();

	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		return redirect("/sign-in");
	}

	// Fetch profile and stats
	const profile = await getVibeProfileByUserId(user.id);

	if (!profile) {
		// This shouldn't happen if profile is created on signup
		return redirect("/sign-in");
	}

	const stats = await getProfileStats(user.id);

	// Cast to our Profile type (database might have additional fields)
	const profileData: Profile = {
		id: profile.id,
		handle: profile.handle,
		display_name: profile.display_name ?? null,
		avatar_url: profile.avatar_url ?? null,
		bio: profile.bio ?? null,
		is_public: profile.is_public ?? true,
		created_at: profile.created_at,
		updated_at: profile.updated_at ?? profile.created_at,
	};

	return (
		<div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-8">Backstage</h1>

			<BackstageClient
				profile={profileData}
				stats={stats}
				email={user.email || ''}
			/>
		</div>
	);
}
