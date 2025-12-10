import { createClient } from "@/utils/supabase/client";

export const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
	const supabase = createClient();

	// Use a consistent filename so it overwrites previous avatar
	const ext = file.name.split('.').pop();
	const filename = `avatar.${ext}`;
	const filePath = `${userId}/${filename}`;

	// Delete old avatar first (in case extension changed)
	const { data: existingFiles } = await supabase.storage
		.from('avatars')
		.list(userId);

	if (existingFiles && existingFiles.length > 0) {
		const filesToDelete = existingFiles.map(f => `${userId}/${f.name}`);
		await supabase.storage.from('avatars').remove(filesToDelete);
	}

	const { data, error } = await supabase.storage
		.from('avatars')
		.upload(filePath, file, { upsert: true });

	if (error) {
		console.error('Avatar upload error:', error.message);
		return null;
	}

	const { data: publicData } = supabase.storage
		.from('avatars')
		.getPublicUrl(filePath);

	// Add cache-busting query param
	const url = publicData?.publicUrl;
	return url ? `${url}?t=${Date.now()}` : null;
};
