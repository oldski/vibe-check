import { NextResponse } from 'next/server';
import { detectEmotion } from '@/lib/huggingface';

export async function POST(request: Request) {
	try {
		const { text } = await request.json();

		if (!text || typeof text !== 'string') {
			return NextResponse.json(
				{ error: 'Text is required' },
				{ status: 400 }
			);
		}

		// Detect emotion from text
		const result = await detectEmotion(text);

		if (!result) {
			return NextResponse.json(
				{ error: 'Could not analyze text' },
				{ status: 422 }
			);
		}

		return NextResponse.json(result);
	} catch (error) {
		console.error('Emotion detection error:', error);
		return NextResponse.json(
			{ error: 'Failed to detect emotion' },
			{ status: 500 }
		);
	}
}
