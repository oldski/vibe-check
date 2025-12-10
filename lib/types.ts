export type Vibe = {
	id: number;
	vibe_type: string;
	color_light: string;
	color_dark: string;
}

export type DailyVibe = {
	id: string;
	vibe_date: string;
	message: string;
	audio?: string;
	media?: string;
	profile_id: string;
	vibe: Vibe;
}

export type VibeFormProps = {
	vibes: Vibe[];
	userId: string;
}

export type VibeFormState = {
	id?: string;
	vibe_date: string;
	message: string;
	vibe: number | null;
	audio: string;
	media: string;
};

export type DailyVibeInput = {
	id?: string;
	vibe_date: string;
	message: string;
	vibe: number;
	audio?: string;
	media?: string;
	profile_id?: string;
}

export type VibeStyles = {
	bg: string;
	text: string;
	placeholder: string;
	ring?: string;
	hover?: string;
	focus?: string;
	active?: string;
	border?: string;
	borderBottom?: string;
	disabled?: string;
	outline?: string;
	vibeButton?: string;
	transition?: string;
}

export type Profile = {
	id: string;
	handle: string;
	display_name: string | null;
	avatar_url: string | null;
	bio: string | null;
	is_public: boolean;
	created_at: string;
	updated_at: string;
}

export type ProfileStats = {
	totalVibes: number;
	mostUsedVibe: { vibe_type: string; count: number } | null;
	currentStreak: number;
	longestStreak: number;
	thisMonthVibes: number;
}

// Follow types
export type Follow = {
	id: string;
	follower_id: string;
	following_id: string;
	created_at: string;
}

export type FollowCounts = {
	followers: number;
	following: number;
}

export type FollowStatus = {
	isFollowing: boolean;
	counts: FollowCounts;
}

// Profile with follow info for discovery
export type ProfileWithFollowStatus = Profile & {
	isFollowing: boolean;
	followerCount: number;
	vibeCount: number;
}