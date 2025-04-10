import { getSupabaseServerClient } from '@/lib/supabase';
import { DailyVibe } from '@/lib/types';

export const getDailyVibe = async (vibeId: string): Promise<DailyVibe | null> => {
	const supabase = await getSupabaseServerClient();
	
	const { data, error } = await supabase
	.from('dailyvibes')
	.select(`
			id,
			vibe_date,
			message,
			audio,
			media,
			profile_id,
			vibe: vibe (
				id,
				vibe_type,
				color_light,
				color_dark
			)
		`)
	.eq('id', vibeId)
	.single();
	
	if (error) {
		console.error('Error fetching daily vibe:', error.message);
		return null;
	}
	
	return data as unknown as DailyVibe;
};
