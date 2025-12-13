import { vibeClassMap } from './vibeClassMap'

type Theme = 'light' | 'dark'

// Neutral/empty state styles for when no vibe is selected
const neutralStyles = {
	light: {
		bg: 'bg-gray-200',
		text: 'text-gray-700',
		placeholder: 'placeholder-gray-500',
		border: 'border-gray-400',
		borderBottom: 'border-b-gray-400',
		ring: 'ring-gray-300',
		hover: 'hover:bg-gray-300',
		focus: 'focus:ring-gray-400',
		active: 'active:bg-gray-400',
		disabled: 'disabled:bg-gray-100',
		outline: 'outline-gray-400',
		transition: 'transition-colors duration-300',
		vibeButton: 'bg-gray-300 text-gray-700 hover:bg-gray-400 active:bg-gray-500 ring-2 ring-gray-300 transition-all duration-200'
	},
	dark: {
		bg: 'bg-gray-800',
		text: 'text-gray-400',
		placeholder: 'placeholder-gray-500',
		border: 'border-gray-600',
		borderBottom: 'border-b-gray-600',
		ring: 'ring-gray-600',
		hover: 'hover:bg-gray-700',
		focus: 'focus:ring-gray-500',
		active: 'active:bg-gray-600',
		disabled: 'disabled:bg-gray-900',
		outline: 'outline-gray-500',
		transition: 'transition-colors duration-300',
		vibeButton: 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500 ring-2 ring-gray-600 transition-all duration-200'
	}
};

export function getVibeStyles(vibeType?: string, theme: Theme = 'light') {
	const vibeKey = vibeType?.toLowerCase()
	if (!vibeKey || !vibeClassMap[vibeKey]) {
		return neutralStyles[theme];
	}

	return vibeClassMap[vibeKey][theme];
}
