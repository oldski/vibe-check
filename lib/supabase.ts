import { createClient } from '@/utils/supabase/server'

export const getSupabaseServerClient = async () => {
	return createClient()
}