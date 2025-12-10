import { getSupabaseServerClient } from "@/lib/supabase";
import { getVibeProfile } from "@/lib/getVibeProfile";
import { notFound, redirect } from "next/navigation";
import { getDailyVibe } from "@/lib/getDailyVibe";
import { getVibes } from "@/lib/getVibes";
import VibePageLayout from "@/components/vibe/vibePageLayout";

type PageProps = {
	params: Promise<{ handle: string; vibeId: string }>;
};

const EditVibePage = async ({ params }: PageProps) => {
	const { handle, vibeId } = await params;

	const supabase = await getSupabaseServerClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		redirect('/sign-in');
	}

	const profile = await getVibeProfile(handle);
	if (!profile) notFound();

	const dailyVibe = await getDailyVibe(vibeId);
	if (!dailyVibe) notFound();

	const vibes = await getVibes();
	const isOwner = user?.id === profile.id;

	if (!isOwner) notFound();

	return (
		<VibePageLayout
			userId={user.id}
			vibes={vibes}
			handle={handle}
			selectedVibe={dailyVibe}
			mode="edit"
		/>
	);
};

export default EditVibePage;
