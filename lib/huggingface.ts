// Hugging Face Inference API utility

const HF_API_URL = 'https://router.huggingface.co/hf-inference/models';

type HFEmotionResult = {
	label: string;
	score: number;
}[];

// GoEmotions model returns 28 emotions - we map them to our 16 vibe types
const emotionToVibeMap: Record<string, string> = {
	// Direct matches
	joy: 'happy',
	love: 'loved',
	anger: 'angry',
	fear: 'anxious',
	sadness: 'melancholy',
	gratitude: 'appreciative',
	optimism: 'optimistic',

	// Mapped emotions
	admiration: 'appreciative',
	amusement: 'playful',
	annoyance: 'angry',
	approval: 'happy',
	caring: 'loved',
	confusion: 'overwhelmed',
	curiosity: 'reflective',
	desire: 'motivated',
	disappointment: 'melancholy',
	disapproval: 'angry',
	disgust: 'angry',
	embarrassment: 'anxious',
	excitement: 'motivated',
	grief: 'melancholy',
	nervousness: 'anxious',
	pride: 'inspired',
	realization: 'reflective',
	relief: 'chill',
	remorse: 'reflective',
	surprise: 'playful',
	neutral: 'chill',
};

// Fallback for unmapped emotions
const defaultVibe = 'chill';

export async function detectEmotion(text: string): Promise<{
	suggestedVibe: string;
	confidence: number;
	topEmotions: { emotion: string; score: number; vibe: string }[];
} | null> {
	const token = process.env.HUGGINGFACE_API_TOKEN;

	if (!token) {
		console.error('HUGGINGFACE_API_TOKEN not set');
		return null;
	}

	// Don't analyze very short text
	if (text.trim().length < 10) {
		return null;
	}

	try {
		const response = await fetch(
			`${HF_API_URL}/SamLowe/roberta-base-go_emotions`,
			{
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ inputs: text }),
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('HF API error response:', response.status, errorText);

			// Model might be loading (cold start)
			if (response.status === 503) {
				console.log('Model is loading, please try again in a few seconds');
				return null;
			}
			throw new Error(`HF API error: ${response.status} - ${errorText}`);
		}

		const result = await response.json();

		// Result can be nested array [[{label, score}, ...]] or {error: ...}
		if (result.error) {
			console.error('HF API returned error:', result.error);
			return null;
		}

		// Result is nested array [[{label, score}, ...]]
		const emotions = Array.isArray(result) && Array.isArray(result[0])
			? result[0] as HFEmotionResult
			: null;

		if (!emotions || emotions.length === 0) {
			return null;
		}

		// Sort by score descending
		const sorted = [...emotions].sort((a, b) => b.score - a.score);

		// Get top 3 emotions
		const topEmotions = sorted.slice(0, 3).map(e => ({
			emotion: e.label,
			score: e.score,
			vibe: emotionToVibeMap[e.label] || defaultVibe,
		}));

		// The suggested vibe is from the highest scoring emotion
		const topEmotion = sorted[0];
		const suggestedVibe = emotionToVibeMap[topEmotion.label] || defaultVibe;

		return {
			suggestedVibe,
			confidence: topEmotion.score,
			topEmotions,
		};
	} catch (error) {
		console.error('Emotion detection error:', error);
		return null;
	}
}

// Get vibe type from emotion label
export function getVibeFromEmotion(emotion: string): string {
	return emotionToVibeMap[emotion.toLowerCase()] || defaultVibe;
}

// Text generation for personalized insights
type GenerateInsightParams = {
	dominantVibe: string;
	mostRecentVibe: string;
	vibeCount: number;
	streak: number;
	timeOfDay: string;
	patterns: { vibe: string; count: number }[];
};

export async function generateVibeInsight(params: GenerateInsightParams): Promise<string | null> {
	const token = process.env.HUGGINGFACE_API_TOKEN;

	if (!token) {
		console.error('HUGGINGFACE_API_TOKEN not set');
		return null;
	}

	const { dominantVibe, mostRecentVibe, vibeCount, streak, timeOfDay, patterns } = params;

	// Build a context-aware prompt
	const patternSummary = patterns.map(p => `${p.vibe} (${p.count}x)`).join(', ');

	const prompt = `Generate a warm, supportive 1-2 sentence mood insight for someone who:
- Currently feels: ${mostRecentVibe}
- Usually feels: ${dominantVibe}
- Has checked in ${vibeCount} times in 2 weeks
- Has a ${streak} day streak
- Time of day: ${timeOfDay}
- Recent vibes: ${patternSummary}

Be conversational, empathetic, and encouraging. Don't use emojis.`;

	try {
		const response = await fetch(
			`${HF_API_URL}/google/flan-t5-base`,
			{
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					inputs: prompt,
					parameters: {
						max_new_tokens: 100,
						temperature: 0.7,
						do_sample: true,
					},
				}),
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('HF text generation error:', response.status, errorText);

			if (response.status === 503) {
				console.log('Model is loading, using fallback');
				return null;
			}
			return null;
		}

		const result = await response.json();

		// Result format: [{ generated_text: "..." }] or { error: "..." }
		if (result.error) {
			console.error('HF API returned error:', result.error);
			return null;
		}

		// Handle different response formats
		let generatedText: string | null = null;

		if (Array.isArray(result) && result[0]?.generated_text) {
			generatedText = result[0].generated_text;
		} else if (typeof result === 'string') {
			generatedText = result;
		} else if (result.generated_text) {
			generatedText = result.generated_text;
		}

		if (generatedText) {
			// Clean up the response
			return generatedText.trim();
		}

		return null;
	} catch (error) {
		console.error('Text generation error:', error);
		return null;
	}
}

// Generate a personalized reflection prompt
export async function generateReflectionPrompt(vibe: string, timeOfDay: string): Promise<string | null> {
	const token = process.env.HUGGINGFACE_API_TOKEN;

	if (!token) {
		return null;
	}

	const prompt = `Generate a single thoughtful reflection question for someone feeling ${vibe} during the ${timeOfDay}. Make it introspective and encouraging. Just the question, nothing else.`;

	try {
		const response = await fetch(
			`${HF_API_URL}/google/flan-t5-base`,
			{
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					inputs: prompt,
					parameters: {
						max_new_tokens: 50,
						temperature: 0.8,
						do_sample: true,
					},
				}),
			}
		);

		if (!response.ok) {
			return null;
		}

		const result = await response.json();

		if (result.error) {
			return null;
		}

		if (Array.isArray(result) && result[0]?.generated_text) {
			return result[0].generated_text.trim();
		} else if (typeof result === 'string') {
			return result.trim();
		} else if (result.generated_text) {
			return result.generated_text.trim();
		}

		return null;
	} catch (error) {
		console.error('Reflection prompt generation error:', error);
		return null;
	}
}
