import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/supabase';
import { getVibeProfile } from '@/lib/getVibeProfile';
import {notFound, redirect} from 'next/navigation';
import { getVibes } from '@/lib/getVibes';
import VibeModalWrapper from '@/components/vibe/vibeModalWrapper';

const AddVibePage = async ({ params }: { params: { handle: string } }) => {
	const supabase = await getSupabaseServerClient();
	
	const { data: { user }, } = await supabase.auth.getUser();
	
	if(!user){
		redirect('/login');
	}
	
	const profile = await getVibeProfile(params.handle);
	if (!profile) notFound();
	
	const vibes = await getVibes();
	const isOwner = user?.id === profile.id;
	
	if (!isOwner) notFound(); // or redirect?
	
	return (
		<VibeModalWrapper
			userId={user.id}
			vibes={vibes}
			handle={params.handle}
			mode="add"
		/>
	);
};

export default AddVibePage;
