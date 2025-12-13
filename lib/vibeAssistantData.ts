// Curated content for the Vibe Assistant
// Songs are Spotify track IDs for easy embedding

export type VibeContent = {
	songs: { title: string; artist: string; spotifyId: string }[];
	prompts: string[];
	insights: string[];
};

export const vibeContent: Record<string, VibeContent> = {
	happy: {
		songs: [
			{ title: "Good as Hell", artist: "Lizzo", spotifyId: "6KgBpzTuTRPebChN0VTyzV" },
			{ title: "Happy", artist: "Pharrell Williams", spotifyId: "60nZcImufyMA1MKQY3dcCH" },
			{ title: "Walking on Sunshine", artist: "Katrina & The Waves", spotifyId: "05wIrZSwuaVWhcv5FfqeH0" },
		],
		prompts: [
			"What made you smile today?",
			"Who would you love to share this good energy with?",
			"What's one thing you're grateful for right now?",
		],
		insights: [
			"Your positive energy is contagious - keep spreading it!",
			"Happy vibes attract happy moments. You're on a roll!",
			"This joy you're feeling? You deserve every bit of it.",
		],
	},
	chill: {
		songs: [
			{ title: "Electric", artist: "Khalid", spotifyId: "1wjzFQodRWqfRxqyVLerxF" },
			{ title: "Best Part", artist: "Daniel Caesar ft. H.E.R.", spotifyId: "1RMJOxR6GRPsBHL8qeC2ux" },
			{ title: "Sunset Lover", artist: "Petit Biscuit", spotifyId: "1Eolhana7nKHYpcYpdVcT5" },
		],
		prompts: [
			"What's helping you stay so relaxed today?",
			"If this moment was a place, where would it be?",
			"What sounds or music match your current mood?",
		],
		insights: [
			"Finding peace in the chaos is a superpower. You've got it.",
			"Chill vibes are healing vibes. Soak it in.",
			"Your calm energy creates space for clarity.",
		],
	},
	reflective: {
		songs: [
			{ title: "The Night We Met", artist: "Lord Huron", spotifyId: "0QZ5yyl6B6utIWkxeBDxQN" },
			{ title: "Holocene", artist: "Bon Iver", spotifyId: "37k5DgHrGewJdCVAUtGxPT" },
			{ title: "Motion Sickness", artist: "Phoebe Bridgers", spotifyId: "2RS0Z7jnG6ybdRKpPRD0PM" },
		],
		prompts: [
			"What's been on your mind lately?",
			"If you could tell your past self one thing, what would it be?",
			"What lesson has life been trying to teach you recently?",
		],
		insights: [
			"Reflection is the first step to growth. You're doing the work.",
			"Your thoughts have depth - don't rush through them.",
			"Sometimes looking back helps us move forward with purpose.",
		],
	},
	motivated: {
		songs: [
			{ title: "Lose Yourself", artist: "Eminem", spotifyId: "7MJQ9Nfxzh8LPZ9e9u8jPM" },
			{ title: "Eye of the Tiger", artist: "Survivor", spotifyId: "2KH16WveTQWT6KOG9Rg6e2" },
			{ title: "Stronger", artist: "Kanye West", spotifyId: "4fzsfWzRhPawzqhX8Qt9F3" },
		],
		prompts: [
			"What's driving your ambition today?",
			"What would you attempt if you knew you couldn't fail?",
			"What's one small step you can take right now toward your goal?",
		],
		insights: [
			"That fire in you? It's going to take you places.",
			"Motivation is momentum - ride this wave!",
			"You're not just dreaming, you're doing. Keep going.",
		],
	},
	anxious: {
		songs: [
			{ title: "Breathe Me", artist: "Sia", spotifyId: "2Rk4JlNc2TPmPkLKLWujJz" },
			{ title: "Weightless", artist: "Marconi Union", spotifyId: "6kkwzB6hXLIONkEk9JaG3G" },
			{ title: "Ocean Eyes", artist: "Billie Eilish", spotifyId: "7hDVYcQq6MxkdJGweuCtl9" },
		],
		prompts: [
			"What would help you feel more grounded right now?",
			"Can you name three things you can see, hear, and feel?",
			"What's one thing within your control today?",
		],
		insights: [
			"It's okay to not be okay. This feeling will pass.",
			"You've survived 100% of your hardest days. You've got this.",
			"Acknowledging anxiety is brave. You're already doing something about it.",
		],
	},
	melancholy: {
		songs: [
			{ title: "Skinny Love", artist: "Bon Iver", spotifyId: "6FGVYhkVuBMbhIsuL3k86S" },
			{ title: "Mad World", artist: "Gary Jules", spotifyId: "3JOVTQ5h8HGFnDdp4VT3MP" },
			{ title: "Hurt", artist: "Johnny Cash", spotifyId: "28cnXtME493VX9NOw9cIUh" },
		],
		prompts: [
			"What would you say to a friend feeling this way?",
			"Is there beauty in this sadness you're experiencing?",
			"What do you need most right now?",
		],
		insights: [
			"Sadness is part of the human experience. You're not alone.",
			"Sometimes we need to feel the lows to appreciate the highs.",
			"Your feelings are valid. Take all the time you need.",
		],
	},
	loved: {
		songs: [
			{ title: "At Last", artist: "Etta James", spotifyId: "0yMEoYBCBiSLqlTMIByas2" },
			{ title: "Adorn", artist: "Miguel", spotifyId: "0WXJ58k8sMhPmDqkWPrSwX" },
			{ title: "All of Me", artist: "John Legend", spotifyId: "3U4isOIWM3VvDubwSI3y7a" },
		],
		prompts: [
			"Who or what made you feel this loved?",
			"How can you share this love with someone else?",
			"What does love mean to you in this moment?",
		],
		insights: [
			"Love is the highest vibration. You're radiating it.",
			"To feel loved is a gift. To give love is a superpower.",
			"This warmth you feel? It's what life is all about.",
		],
	},
	angry: {
		songs: [
			{ title: "Break Stuff", artist: "Limp Bizkit", spotifyId: "6L3VbqX3T0mPKkpdL42qKZ" },
			{ title: "Killing in the Name", artist: "Rage Against the Machine", spotifyId: "59WN2psjkt1tyaxjspN8fp" },
			{ title: "You Oughta Know", artist: "Alanis Morissette", spotifyId: "3Vn9oCZbdCaJOtHbE5RNIW" },
		],
		prompts: [
			"What would help you release this energy constructively?",
			"Is there a boundary that needs to be set?",
			"What's underneath this anger?",
		],
		insights: [
			"Anger is energy - channel it wisely.",
			"Your feelings are valid, even the intense ones.",
			"Sometimes anger shows us what we truly care about.",
		],
	},
	tired: {
		songs: [
			{ title: "Porcelain", artist: "Moby", spotifyId: "45TjGKANjhWgKjNqGJLGnk" },
			{ title: "Intro", artist: "The xx", spotifyId: "4dYqcmy3FWBpfT92R8Pdrk" },
			{ title: "Sleep", artist: "Godspeed You! Black Emperor", spotifyId: "3ixO2XMH1xsJJpKmx1M37T" },
		],
		prompts: [
			"What would true rest look like for you?",
			"When did you last do absolutely nothing?",
			"What can you let go of today to make space for rest?",
		],
		insights: [
			"Rest is productive. Your body and mind need this.",
			"You can't pour from an empty cup. Refill yours.",
			"Being tired is your body's wisdom speaking. Listen to it.",
		],
	},
	playful: {
		songs: [
			{ title: "Mr. Brightside", artist: "The Killers", spotifyId: "003vvx7Niy0yvhvHt4a68B" },
			{ title: "Dance Monkey", artist: "Tones and I", spotifyId: "1rgnBhdG2JDFTbYkYRZAku" },
			{ title: "Shut Up and Dance", artist: "WALK THE MOON", spotifyId: "4kbj5MwxO1bq9wjT5g9HaA" },
		],
		prompts: [
			"What's making you feel so lighthearted?",
			"When was the last time you laughed until it hurt?",
			"What childhood activity would you love to do right now?",
		],
		insights: [
			"Playfulness is a form of freedom. Embrace it!",
			"Life doesn't always have to be serious. You get that.",
			"Your inner child is happy right now. Let them play.",
		],
	},
	inspired: {
		songs: [
			{ title: "Viva la Vida", artist: "Coldplay", spotifyId: "1mea3bSkSGXuIRvnydlB5b" },
			{ title: "Uprising", artist: "Muse", spotifyId: "4VqPOruhp5EdPBeR92t6lQ" },
			{ title: "Clocks", artist: "Coldplay", spotifyId: "0BCPKOYdS2jbQ8iyB56Ccs" },
		],
		prompts: [
			"What sparked this inspiration?",
			"How can you capture this creative energy?",
			"What would you create if there were no limits?",
		],
		insights: [
			"Inspiration is the universe whispering ideas to you. Listen.",
			"This creative fire is rare. Make something with it.",
			"You're seeing possibilities others miss. That's a gift.",
		],
	},
	optimistic: {
		songs: [
			{ title: "Here Comes the Sun", artist: "The Beatles", spotifyId: "6dGnYIeXmHdcikdzNNDMm2" },
			{ title: "Three Little Birds", artist: "Bob Marley", spotifyId: "6A9mKXlFRPMNMhWyiEuGsP" },
			{ title: "Beautiful Day", artist: "U2", spotifyId: "2KH16WveTQWT6KOG9Rg6e2" },
		],
		prompts: [
			"What's giving you hope today?",
			"What are you most looking forward to?",
			"How can you spread this optimism to someone who needs it?",
		],
		insights: [
			"Your optimism is like sunshine. Keep shining.",
			"Believing good things will happen often makes them happen.",
			"Hope is a muscle. You're keeping it strong.",
		],
	},
	appreciative: {
		songs: [
			{ title: "What a Wonderful World", artist: "Louis Armstrong", spotifyId: "29U7stRjqHU6rMiS8BfaI9" },
			{ title: "Count on Me", artist: "Bruno Mars", spotifyId: "6BVkLeGvgWbJJYwmEbkdAT" },
			{ title: "Lean on Me", artist: "Bill Withers", spotifyId: "3M8FzayQWtkvOhqMn2V4T2" },
		],
		prompts: [
			"What are you most thankful for today?",
			"Who deserves your gratitude right now?",
			"What's something small but wonderful you noticed today?",
		],
		insights: [
			"Gratitude transforms what we have into enough.",
			"An appreciative heart attracts more to appreciate.",
			"You're noticing the good stuff. That's a life skill.",
		],
	},
	lonely: {
		songs: [
			{ title: "Everybody Hurts", artist: "R.E.M.", spotifyId: "6PypGyiu0Y2lCDBN1XZEnP" },
			{ title: "Someone Like You", artist: "Adele", spotifyId: "4kflIGfjdZJW4ot2ioixTB" },
			{ title: "Creep", artist: "Radiohead", spotifyId: "70LcF31zb1H0PyJoS1Sx1r" },
		],
		prompts: [
			"What kind of connection are you craving?",
			"Who could you reach out to right now?",
			"How can you be a good companion to yourself today?",
		],
		insights: [
			"Loneliness means you have a big heart that wants to connect.",
			"Even in solitude, you're never truly alone.",
			"This feeling is temporary. Connection is always possible.",
		],
	},
	overwhelmed: {
		songs: [
			{ title: "Breathe", artist: "Telepopmusik", spotifyId: "2Y0wPrPQBrGhoLn14xRYCG" },
			{ title: "Let It Be", artist: "The Beatles", spotifyId: "7iN1s7xHE4ifF5povM6A48" },
			{ title: "Landslide", artist: "Fleetwood Mac", spotifyId: "5ihS6UUlyQAfmp48eSkxuQ" },
		],
		prompts: [
			"What's one thing you can let go of today?",
			"If you could only do one thing, what would it be?",
			"What would 'enough' look like right now?",
		],
		insights: [
			"You don't have to do it all. Just do the next right thing.",
			"Feeling overwhelmed means you care deeply. That's admirable.",
			"Break it down. One step at a time. You've got this.",
		],
	},
	brat: {
		songs: [
			{ title: "Bad Guy", artist: "Billie Eilish", spotifyId: "2Fxmhks0bxGSBdJ92vM42m" },
			{ title: "I Don't Care", artist: "Ed Sheeran & Justin Bieber", spotifyId: "0hVXuCcriWRGvwMV1r5Yn9" },
			{ title: "IDGAF", artist: "Dua Lipa", spotifyId: "0cmmJgEZ5YEpmMLYSIFLzR" },
		],
		prompts: [
			"What rules are you ready to break?",
			"What would unapologetic you do right now?",
			"Who's opinion do you need to stop caring about?",
		],
		insights: [
			"Sometimes being a little rebellious is exactly what you need.",
			"Your 'I don't care' energy is actually self-care.",
			"Embrace the chaos. You're in control of your own vibe.",
		],
	},
};

// Time-of-day insights
export const timeInsights = {
	morning: [
		"Morning vibes set the tone for your day.",
		"Starting your day with a check-in? That's self-awareness.",
		"What you feel now doesn't define the whole day.",
	],
	afternoon: [
		"Afternoon energy shift? Totally normal.",
		"How you're feeling now reflects your day so far.",
		"The day's not over - there's still magic to be made.",
	],
	evening: [
		"Evening reflection is powerful self-care.",
		"Processing your day? That's emotional intelligence.",
		"Tonight's vibe prepares tomorrow's mindset.",
	],
	night: [
		"Late night feels hit different.",
		"Nighttime is when truth often surfaces.",
		"Rest is coming. Honor how you feel right now.",
	],
};

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
	const hour = new Date().getHours();
	if (hour >= 5 && hour < 12) return 'morning';
	if (hour >= 12 && hour < 17) return 'afternoon';
	if (hour >= 17 && hour < 21) return 'evening';
	return 'night';
}

export function getRandomItem<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}
