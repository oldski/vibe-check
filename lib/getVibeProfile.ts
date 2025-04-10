import { getSupabaseServerClient } from './supabase'

export async function getVibeProfile(handle: string){
	const supabase = await getSupabaseServerClient();
	
	const { data: profile, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('handle', handle)
		.single();
	
	if(error || !profile || !profile.is_public) return null;
	
	return profile;
}