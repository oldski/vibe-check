import { vibeClassMap } from './vibeClassMap'

type Theme = 'light' | 'dark'

export function getVibeStyles(vibeType?: string, theme: Theme = 'light') {
	const vibeKey = vibeType?.toLowerCase()
	if (!vibeKey || !vibeClassMap[vibeKey]) {
		console.warn(`No style found for vibe: ${vibeKey}`);
		return null;
	}
	
	return vibeClassMap[vibeKey][theme];
}
