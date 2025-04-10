import { DailyVibe } from './types'
import { getSupabaseServerClient } from './supabase'

export const getDailyVibes = async (profileId?: string): Promise<DailyVibe[]> => {
	const supabase = await getSupabaseServerClient();
	
	let query = supabase
	.from('dailyvibes')
	.select(`
      id,
      vibe_date,
      message,
      audio,
      media,
      vibe (
        id,
        vibe_type,
        color_light,
        color_dark
      )
    `)
	.order('vibe_date', { ascending: false });
	
	if(profileId){
		query = query.eq('profile_id', profileId);
	}
	
	const { data, error } = await query;
	
	if(error){
		console.error('Error fetching daily vibes:', error);
		return [];
	}
	
	return data as unknown as DailyVibe[];
}