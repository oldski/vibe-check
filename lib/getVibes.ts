import { Vibe } from './types'
import { getSupabaseServerClient } from './supabase'

type OrderOptions = 'asc' | 'desc' | 'random';

export const getVibes = async (order: OrderOptions = 'asc'): Promise<Vibe[]> => {
	const supabase = await getSupabaseServerClient()
	
	let query = supabase
	.from('vibes')
	.select(`
      id,
      vibe_type,
      color_light,
      color_dark
    `);
	
	if(order === 'random') {
		query = query.order('RANDOM()');
	} else {
		const ascending = order === 'asc';
		query = query.order('vibe_type', {ascending});
	}
	
	const { data, error } = await query;
	
	if (error) {
		console.error('Error fetching vibes:', error)
		return []
	}
	
	// Force TypeScript to treat the shape correctly
	return data as unknown as Vibe[];
}