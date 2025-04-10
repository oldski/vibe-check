import {getSupabaseServerClient} from "@/lib/supabase";
import {DailyVibeInput} from "@/lib/types";

export const updateDailyVibe = async (data: DailyVibeInput) => {
	const supabase = await getSupabaseServerClient();
	
	const { id, vibe_date, message, audio, media, vibe } = data;
	
	const { error } = await supabase
	.from('dailyvibes')
	.update({
		vibe_date,
		message,
		audio,
		media,
		vibe
	})
		.eq("id", id);
	
	if(error){
		console.error('Error updating daily vibe:', error);
		throw new Error(error.message);
	}
	
	return true;
}