import { getSupabaseServerClient } from "@/lib/supabase";
import {DailyVibeInput} from "@/lib/types";

export const putDailyVibe = async (data: DailyVibeInput) => {
	const supabase = await getSupabaseServerClient();
	
	const { error } = await supabase.from('dailyvibes').insert([data]);
	
	if(error){
		console.error('Error inserting daily vibe:', error);
		throw new Error(error.message);
	}
	
	return true;
}