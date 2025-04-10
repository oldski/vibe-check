import { createClient } from "@/utils/supabase/client";

export const uploadVibeMedia = async (file: File, userId: string, vibeDate: string ): Promise<string | null> => {
	const supabase = createClient();
	
	const filename = `${vibeDate}_${file.name}`;
	const filePath = `${userId}/${filename}`;
	
	const { data, error } = await supabase.storage
		.from('vibes-media')
		.upload(filePath, file)
	
	if(error){
		console.error('bad vibes...upload error', error.message);
		return null;
	}
	
	const { data: publicData } = supabase.storage
		.from('vibes-media')
		.getPublicUrl(filePath)
	
		return publicData?.publicUrl ?? null;
}