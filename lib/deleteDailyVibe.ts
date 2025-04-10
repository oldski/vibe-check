import {getSupabaseServerClient} from "@/lib/supabase";

export async function deleteDailyVibe(id: string){
	const supabase = await getSupabaseServerClient();
	
	const { error } = await supabase
		.from('dailyvibes')
		.delete()
		.eq('id', id);
	
	if(error){
		throw new Error(error.message);
	}
}