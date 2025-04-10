import { getVibeProfile } from "@/lib/getVibeProfile";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {getDailyVibe} from "@/lib/getDailyVibe";
import {getVibes} from "@/lib/getVibes";
import VibeModalWrapper from "@/components/vibe/vibeModalWrapper";

const VibePage = async ({ params }: { params: { handle: string; vibeId: string } }) => {
	
	const profile = await getVibeProfile(params.handle);
	if (!profile) notFound();
	
	const dailyVibe = await getDailyVibe(params.vibeId);
	if (!dailyVibe) notFound();
	
	const vibes = await getVibes();
	
	return (
		<VibeModalWrapper
			key={dailyVibe.id}
			vibes={vibes}
			selectedVibe={dailyVibe}
			userId={profile.id}
			handle={params.handle}
			mode="view"
		/>
	);
};

export default VibePage;
