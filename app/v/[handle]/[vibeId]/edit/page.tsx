import {getSupabaseServerClient} from "@/lib/supabase";
import {getVibeProfile} from "@/lib/getVibeProfile";
import {notFound, redirect} from "next/navigation";
import {getDailyVibe} from "@/lib/getDailyVibe";
import {getVibes} from "@/lib/getVibes";
import VibeModalWrapper from "@/components/vibe/vibeModalWrapper";

const EditVibePage = async ({ params }: { params: { handle: string; vibeId: string } }) => {
	const supabase = await getSupabaseServerClient();
	
	const { data: { user }, } = await supabase.auth.getUser();
	
	if(!user){
		redirect('/login');
	}
	
	const profile = await getVibeProfile(params.handle);
	if (!profile) notFound();
	
	const dailyVibe = await getDailyVibe(params.vibeId);
	if (!dailyVibe) notFound();
	
	const vibes = await getVibes();
	const isOwner = user?.id === profile.id;
	
	if (!isOwner) notFound();
	
	return (
		<VibeModalWrapper
			userId={user.id}
			vibes={vibes}
			handle={params.handle}
			selectedVibe={dailyVibe}
			mode="edit"
		/>
	);
};

export default EditVibePage;