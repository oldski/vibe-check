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