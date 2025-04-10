import { Vibe } from './types'
import { getSupabaseServerClient } from './supabase'

export const getVibes = async (): Promise<Vibe[]> => {
	const supabase = await getSupabaseServerClient()
	
	const { data, error } = await supabase
	.from('vibes')
	.select(`
      id,
      vibe_type,
      color_light,
      color_dark
    `).order('vibe_type', { ascending: true });
	
	if (error) {
		console.error('Error fetching vibes:', error)
		return []
	}
	
	// Force TypeScript to treat the shape correctly
	return data as unknown as Vibe[];
}