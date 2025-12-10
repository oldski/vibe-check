import { getVibeProfile } from "@/lib/getVibeProfile";
import { getSupabaseServerClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { getDailyVibe } from "@/lib/getDailyVibe";
import { getVibes } from "@/lib/getVibes";
import VibePageLayout from "@/components/vibe/vibePageLayout";

type PageProps = {
	params: Promise<{ handle: string; vibeId: string }>;
};

const VibePage = async ({ params }: PageProps) => {
	const { handle, vibeId } = await params;

	const supabase = await getSupabaseServerClient();
	const { data: { user } } = await supabase.auth.getUser();

	const profile = await getVibeProfile(handle);
	if (!profile) notFound();

	const dailyVibe = await getDailyVibe(vibeId);
	if (!dailyVibe) notFound();

	const vibes = await getVibes();

	return (
		<VibePageLayout
			key={dailyVibe.id}
			vibes={vibes}
			selectedVibe={dailyVibe}
			userId={user?.id ?? ''}
			handle={handle}
			mode="view"
		/>
	);
};

export default VibePage;
