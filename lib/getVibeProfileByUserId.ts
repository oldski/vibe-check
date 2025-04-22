import {getSupabaseServerClient} from "@/lib/supabase";

export async function getVibeProfileByUserId(userId: string){
	const supabase = await getSupabaseServerClient();
	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.single();
	
	if(error){
		console.error('Failed to fetch profile:', error.message);
		return null;
	}
	
	return data;
}