export const vibeClassMap: Record<string, Record<'light' | 'dark', {
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
}>> = {
	happy: {
		light: {
			bg: 'bg-happy-500',
			text: 'text-happy-900',
			placeholder: 'placeholder-happy-800',
			border: 'border-happy-700',
			borderBottom: 'border-b-happy-700',
			ring: 'ring-happy-300',
			hover: 'hover:bg-happy-600',
			focus: 'focus:ring-happy-400',
			active: 'active:bg-happy-700',
			disabled: 'disabled:bg-happy-200',
			outline: 'outline-happy-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-happy-600 text-happy-100 hover:bg-happy-700 active:bg-happy-800 ring-2 ring-happy-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-happy-800',
			text: 'text-happy-500',
			placeholder: 'placeholder-happy-400',
			border: 'border-happy-300',
			borderBottom: 'border-b-happy-300',
			ring: 'ring-happy-200',
			hover: 'hover:bg-happy-500',
			focus: 'focus:ring-happy-300',
			active: 'active:bg-happy-600',
			disabled: 'disabled:bg-happy-300',
			outline: 'outline-happy-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-happy-400 text-happy-950 hover:text-happy-950 active:text-happy-950 hover:bg-happy-500 active:bg-happy-100 ring-2 ring-happy-600 transition-all duration-200'
		}
	},
	
	angry: {
		light: {
			bg: 'bg-angry-500',
			text: 'text-angry-900',
			placeholder: 'placeholder-angry-800',
			border: 'border-angry-700',
			borderBottom: 'border-b-angry-700',
			ring: 'ring-angry-300',
			hover: 'hover:bg-angry-600',
			focus: 'focus:ring-angry-400',
			active: 'active:bg-angry-700',
			disabled: 'disabled:bg-angry-200',
			outline: 'outline-angry-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-angry-600 text-angry-100 hover:bg-angry-700 active:bg-angry-800 ring-2 ring-angry-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-angry-800',
			text: 'text-angry-500',
			placeholder: 'placeholder-angry-400',
			border: 'border-angry-300',
			borderBottom: 'border-b-angry-300',
			ring: 'ring-angry-200',
			hover: 'hover:bg-angry-500',
			focus: 'focus:ring-angry-300',
			active: 'active:bg-angry-600',
			disabled: 'disabled:bg-angry-300',
			outline: 'outline-angry-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-angry-400 text-angry-950 hover:bg-angry-500 active:bg-angry-600 ring-2 ring-angry-200 transition-all duration-200'
		}
	},
	chill: {
		light: {
			bg: 'bg-chill-500',
			text: 'text-chill-900',
			placeholder: 'placeholder-chill-800',
			border: 'border-chill-700',
			borderBottom: 'border-b-chill-700',
			ring: 'ring-chill-300',
			hover: 'hover:bg-chill-600',
			focus: 'focus:ring-chill-400',
			active: 'active:bg-chill-700',
			disabled: 'disabled:bg-chill-200',
			outline: 'outline-chill-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-chill-600 text-chill-100 hover:bg-chill-700 active:bg-chill-800 ring-2 ring-chill-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-chill-800',
			text: 'text-chill-500',
			placeholder: 'placeholder-chill-400',
			border: 'border-chill-300',
			borderBottom: 'border-b-chill-300',
			ring: 'ring-chill-200',
			hover: 'hover:bg-chill-500',
			focus: 'focus:ring-chill-300',
			active: 'active:bg-chill-600',
			disabled: 'disabled:bg-chill-300',
			outline: 'outline-chill-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-chill-400 text-chill-950 hover:bg-chill-500 active:bg-chill-600 ring-2 ring-chill-200 transition-all duration-200'
		}
	},
	reflective: {
		light: {
			bg: 'bg-reflective-500',
			text: 'text-reflective-900',
			placeholder: 'placeholder-reflective-800',
			border: 'border-reflective-700',
			borderBottom: 'border-b-reflective-700',
			ring: 'ring-reflective-300',
			hover: 'hover:bg-reflective-600',
			focus: 'focus:ring-reflective-400',
			active: 'active:bg-reflective-700',
			disabled: 'disabled:bg-reflective-200',
			outline: 'outline-reflective-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-reflective-600 text-reflective-100 hover:bg-reflective-700 active:bg-reflective-800 ring-2 ring-reflective-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-reflective-800',
			text: 'text-reflective-500',
			placeholder: 'placeholder-reflective-400',
			border: 'border-reflective-300',
			borderBottom: 'border-b-reflective-300',
			ring: 'ring-reflective-200',
			hover: 'hover:bg-reflective-500',
			focus: 'focus:ring-reflective-300',
			active: 'active:bg-reflective-600',
			disabled: 'disabled:bg-reflective-300',
			outline: 'outline-reflective-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-reflective-400 text-reflective-950 hover:bg-reflective-500 active:bg-reflective-600 ring-2 ring-reflective-200 transition-all duration-200'
		}
	},
	appreciative: {
		light: {
			bg: 'bg-appreciative-500',
			text: 'text-appreciative-900',
			placeholder: 'placeholder-appreciative-800',
			border: 'border-appreciative-700',
			borderBottom: 'border-b-appreciative-700',
			ring: 'ring-appreciative-300',
			hover: 'hover:bg-appreciative-600',
			focus: 'focus:ring-appreciative-400',
			active: 'active:bg-appreciative-700',
			disabled: 'disabled:bg-appreciative-200',
			outline: 'outline-appreciative-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-appreciative-600 text-appreciative-100 hover:bg-appreciative-700 active:bg-appreciative-800 ring-2 ring-appreciative-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-appreciative-800',
			text: 'text-appreciative-500',
			placeholder: 'placeholder-appreciative-400',
			border: 'border-appreciative-300',
			borderBottom: 'border-b-appreciative-300',
			ring: 'ring-appreciative-200',
			hover: 'hover:bg-appreciative-500',
			focus: 'focus:ring-appreciative-300',
			active: 'active:bg-appreciative-600',
			disabled: 'disabled:bg-appreciative-300',
			outline: 'outline-appreciative-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-appreciative-400 text-appreciative-950 hover:bg-appreciative-500 active:bg-appreciative-600 ring-2 ring-appreciative-200 transition-all duration-200'
		}
	},
	motivated: {
		light: {
			bg: 'bg-motivated-500',
			text: 'text-motivated-900',
			placeholder: 'placeholder-motivated-800',
			border: 'border-motivated-700',
			borderBottom: 'border-b-motivated-700',
			ring: 'ring-motivated-300',
			hover: 'hover:bg-motivated-600',
			focus: 'focus:ring-motivated-400',
			active: 'active:bg-motivated-700',
			disabled: 'disabled:bg-motivated-200',
			outline: 'outline-motivated-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-motivated-600 text-motivated-100 hover:bg-motivated-700 active:bg-motivated-800 ring-2 ring-motivated-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-motivated-800',
			text: 'text-motivated-500',
			placeholder: 'placeholder-motivated-400',
			border: 'border-motivated-300',
			borderBottom: 'border-b-motivated-300',
			ring: 'ring-motivated-200',
			hover: 'hover:bg-motivated-500',
			focus: 'focus:ring-motivated-300',
			active: 'active:bg-motivated-600',
			disabled: 'disabled:bg-motivated-300',
			outline: 'outline-motivated-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-motivated-400 text-motivated-950 hover:bg-motivated-500 active:bg-motivated-600 ring-2 ring-motivated-200 transition-all duration-200'
		}
	},
	playful: {
		light: {
			bg: 'bg-playful-500',
			text: 'text-playful-900',
			placeholder: 'placeholder-playful-800',
			border: 'border-playful-700',
			borderBottom: 'border-b-playful-700',
			ring: 'ring-playful-300',
			hover: 'hover:bg-playful-600',
			focus: 'focus:ring-playful-400',
			active: 'active:bg-playful-700',
			disabled: 'disabled:bg-playful-200',
			outline: 'outline-playful-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-playful-600 text-playful-100 hover:bg-playful-700 active:bg-playful-800 ring-2 ring-playful-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-playful-800',
			text: 'text-playful-500',
			placeholder: 'placeholder-playful-400',
			border: 'border-playful-300',
			borderBottom: 'border-b-playful-300',
			ring: 'ring-playful-200',
			hover: 'hover:bg-playful-500',
			focus: 'focus:ring-playful-300',
			active: 'active:bg-playful-600',
			disabled: 'disabled:bg-playful-300',
			outline: 'outline-playful-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-playful-400 text-playful-950 hover:bg-playful-500 active:bg-playful-600 ring-2 ring-playful-200 transition-all duration-200'
		}
	},
	inspired: {
		light: {
			bg: 'bg-inspired-500',
			text: 'text-inspired-900',
			placeholder: 'placeholder-inspired-800',
			border: 'border-inspired-700',
			borderBottom: 'border-b-inspired-700',
			ring: 'ring-inspired-300',
			hover: 'hover:bg-inspired-600',
			focus: 'focus:ring-inspired-400',
			active: 'active:bg-inspired-700',
			disabled: 'disabled:bg-inspired-200',
			outline: 'outline-inspired-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-inspired-600 text-inspired-100 hover:bg-inspired-700 active:bg-inspired-800 ring-2 ring-inspired-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-inspired-800',
			text: 'text-inspired-500',
			placeholder: 'placeholder-inspired-400',
			border: 'border-inspired-300',
			borderBottom: 'border-b-inspired-300',
			ring: 'ring-inspired-200',
			hover: 'hover:bg-inspired-500',
			focus: 'focus:ring-inspired-300',
			active: 'active:bg-inspired-600',
			disabled: 'disabled:bg-inspired-300',
			outline: 'outline-inspired-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-inspired-400 text-inspired-950 hover:bg-inspired-500 active:bg-inspired-600 ring-2 ring-inspired-200 transition-all duration-200'
		}
	},
	optimistic: {
		light: {
			bg: 'bg-optimistic-500',
			text: 'text-optimistic-900',
			placeholder: 'placeholder-optimistic-800',
			border: 'border-optimistic-700',
			borderBottom: 'border-b-optimistic-700',
			ring: 'ring-optimistic-300',
			hover: 'hover:bg-optimistic-600',
			focus: 'focus:ring-optimistic-400',
			active: 'active:bg-optimistic-700',
			disabled: 'disabled:bg-optimistic-200',
			outline: 'outline-optimistic-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-optimistic-600 text-optimistic-100 hover:bg-optimistic-700 active:bg-optimistic-800 ring-2 ring-optimistic-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-optimistic-800',
			text: 'text-optimistic-500',
			placeholder: 'placeholder-optimistic-400',
			border: 'border-optimistic-300',
			borderBottom: 'border-b-optimistic-300',
			ring: 'ring-optimistic-200',
			hover: 'hover:bg-optimistic-500',
			focus: 'focus:ring-optimistic-300',
			active: 'active:bg-optimistic-600',
			disabled: 'disabled:bg-optimistic-300',
			outline: 'outline-optimistic-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-optimistic-400 text-optimistic-950 hover:bg-optimistic-500 active:bg-optimistic-600 ring-2 ring-optimistic-200 transition-all duration-200'
		}
	},
	loved: {
		light: {
			bg: 'bg-loved-500',
			text: 'text-loved-900',
			placeholder: 'placeholder-loved-800',
			border: 'border-loved-700',
			borderBottom: 'border-b-loved-700',
			ring: 'ring-loved-300',
			hover: 'hover:bg-loved-600',
			focus: 'focus:ring-loved-400',
			active: 'active:bg-loved-700',
			disabled: 'disabled:bg-loved-200',
			outline: 'outline-loved-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-loved-600 text-loved-100 hover:bg-loved-700 active:bg-loved-800 ring-2 ring-loved-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-loved-800',
			text: 'text-loved-500',
			placeholder: 'placeholder-loved-400',
			border: 'border-loved-300',
			borderBottom: 'border-b-loved-300',
			ring: 'ring-loved-200',
			hover: 'hover:bg-loved-500',
			focus: 'focus:ring-loved-300',
			active: 'active:bg-loved-600',
			disabled: 'disabled:bg-loved-300',
			outline: 'outline-loved-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-loved-400 text-loved-950 hover:bg-loved-500 active:bg-loved-600 ring-2 ring-loved-200 transition-all duration-200'
		}
	},
	lonely: {
		light: {
			bg: 'bg-lonely-500',
			text: 'text-lonely-900',
			placeholder: 'placeholder-lonely-800',
			border: 'border-lonely-700',
			borderBottom: 'border-b-lonely-700',
			ring: 'ring-lonely-300',
			hover: 'hover:bg-lonely-600',
			focus: 'focus:ring-lonely-400',
			active: 'active:bg-lonely-700',
			disabled: 'disabled:bg-lonely-200',
			outline: 'outline-lonely-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-lonely-600 text-lonely-100 hover:bg-lonely-700 active:bg-lonely-800 ring-2 ring-lonely-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-lonely-800',
			text: 'text-lonely-500',
			placeholder: 'placeholder-lonely-400',
			border: 'border-lonely-300',
			borderBottom: 'border-b-lonely-300',
			ring: 'ring-lonely-200',
			hover: 'hover:bg-lonely-500',
			focus: 'focus:ring-lonely-300',
			active: 'active:bg-lonely-600',
			disabled: 'disabled:bg-lonely-300',
			outline: 'outline-lonely-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-lonely-400 text-lonely-950 hover:bg-lonely-500 active:bg-lonely-600 ring-2 ring-lonely-200 transition-all duration-200'
		}
	},
	melancholy: {
		light: {
			bg: 'bg-melancholy-500',
			text: 'text-melancholy-900',
			placeholder: 'placeholder-melancholy-800',
			border: 'border-melancholy-700',
			borderBottom: 'border-b-melancholy-700',
			ring: 'ring-melancholy-300',
			hover: 'hover:bg-melancholy-600',
			focus: 'focus:ring-melancholy-400',
			active: 'active:bg-melancholy-700',
			disabled: 'disabled:bg-melancholy-200',
			outline: 'outline-melancholy-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-melancholy-600 text-melancholy-100 hover:bg-melancholy-700 active:bg-melancholy-800 ring-2 ring-melancholy-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-melancholy-800',
			text: 'text-melancholy-500',
			placeholder: 'placeholder-melancholy-400',
			border: 'border-melancholy-300',
			borderBottom: 'border-b-melancholy-300',
			ring: 'ring-melancholy-200',
			hover: 'hover:bg-melancholy-500',
			focus: 'focus:ring-melancholy-300',
			active: 'active:bg-melancholy-600',
			disabled: 'disabled:bg-melancholy-300',
			outline: 'outline-melancholy-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-melancholy-400 text-melancholy-950 hover:bg-melancholy-500 active:bg-melancholy-600 ring-2 ring-melancholy-200 transition-all duration-200'
		}
	},
	anxious: {
		light: {
			bg: 'bg-anxious-500',
			text: 'text-anxious-900',
			placeholder: 'placeholder-anxious-800',
			border: 'border-anxious-700',
			borderBottom: 'border-b-anxious-700',
			ring: 'ring-anxious-300',
			hover: 'hover:bg-anxious-600',
			focus: 'focus:ring-anxious-400',
			active: 'active:bg-anxious-700',
			disabled: 'disabled:bg-anxious-200',
			outline: 'outline-anxious-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-anxious-600 text-anxious-100 hover:bg-anxious-700 active:bg-anxious-800 ring-2 ring-anxious-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-anxious-800',
			text: 'text-anxious-500',
			placeholder: 'placeholder-anxious-400',
			border: 'border-anxious-300',
			borderBottom: 'border-b-anxious-300',
			ring: 'ring-anxious-200',
			hover: 'hover:bg-anxious-500',
			focus: 'focus:ring-anxious-300',
			active: 'active:bg-anxious-600',
			disabled: 'disabled:bg-anxious-300',
			outline: 'outline-anxious-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-anxious-400 text-anxious-950 hover:bg-anxious-500 active:bg-anxious-600 ring-2 ring-anxious-200 transition-all duration-200'
		}
	},
	overwhelmed: {
		light: {
			bg: 'bg-overwhelmed-500',
			text: 'text-overwhelmed-900',
			placeholder: 'placeholder-overwhelmed-800',
			border: 'border-overwhelmed-700',
			borderBottom: 'border-b-overwhelmed-700',
			ring: 'ring-overwhelmed-300',
			hover: 'hover:bg-overwhelmed-600',
			focus: 'focus:ring-overwhelmed-400',
			active: 'active:bg-overwhelmed-700',
			disabled: 'disabled:bg-overwhelmed-200',
			outline: 'outline-overwhelmed-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-overwhelmed-600 text-overwhelmed-100 hover:bg-overwhelmed-700 active:bg-overwhelmed-800 ring-2 ring-overwhelmed-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-overwhelmed-800',
			text: 'text-overwhelmed-500',
			placeholder: 'placeholder-overwhelmed-400',
			border: 'border-overwhelmed-300',
			borderBottom: 'border-b-overwhelmed-300',
			ring: 'ring-overwhelmed-200',
			hover: 'hover:bg-overwhelmed-500',
			focus: 'focus:ring-overwhelmed-300',
			active: 'active:bg-overwhelmed-600',
			disabled: 'disabled:bg-overwhelmed-300',
			outline: 'outline-overwhelmed-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-overwhelmed-400 text-overwhelmed-950 hover:bg-overwhelmed-500 active:bg-overwhelmed-600 ring-2 ring-overwhelmed-200 transition-all duration-200'
		}
	},
	tired: {
		light: {
			bg: 'bg-tired-500',
			text: 'text-tired-900',
			placeholder: 'placeholder-tired-800',
			border: 'border-tired-700',
			borderBottom: 'border-b-tired-700',
			ring: 'ring-tired-300',
			hover: 'hover:bg-tired-600',
			focus: 'focus:ring-tired-400',
			active: 'active:bg-tired-700',
			disabled: 'disabled:bg-tired-200',
			outline: 'outline-tired-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-tired-600 text-tired-100 hover:bg-tired-700 active:bg-tired-800 ring-2 ring-tired-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-tired-800',
			text: 'text-tired-500',
			placeholder: 'placeholder-tired-400',
			border: 'border-tired-300',
			borderBottom: 'border-b-tired-300',
			ring: 'ring-tired-200',
			hover: 'hover:bg-tired-500',
			focus: 'focus:ring-tired-300',
			active: 'active:bg-tired-600',
			disabled: 'disabled:bg-tired-300',
			outline: 'outline-tired-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-tired-400 text-tired-950 hover:bg-tired-500 active:bg-tired-600 ring-2 ring-tired-200 transition-all duration-200'
		}
	},
	brat: {
		light: {
			bg: 'bg-brat-500',
			text: 'text-brat-900',
			placeholder: 'placeholder-brat-800',
			border: 'border-brat-700',
			borderBottom: 'border-b-brat-700',
			ring: 'ring-brat-300',
			hover: 'hover:bg-brat-600',
			focus: 'focus:ring-brat-400',
			active: 'active:bg-brat-700',
			disabled: 'disabled:bg-brat-200',
			outline: 'outline-brat-500',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-brat-600 text-brat-100 hover:bg-brat-700 active:bg-brat-800 ring-2 ring-brat-300 transition-all duration-200'
		},
		dark: {
			bg: 'bg-brat-950',
			text: 'text-brat-500',
			placeholder: 'placeholder-brat-400',
			border: 'border-brat-300',
			borderBottom: 'border-b-brat-300',
			ring: 'ring-brat-200',
			hover: 'hover:bg-brat-500',
			focus: 'focus:ring-brat-300',
			active: 'active:bg-brat-600',
			disabled: 'disabled:bg-brat-300',
			outline: 'outline-brat-400',
			transition: 'transition-colors duration-300',
			vibeButton: 'bg-brat-950 text-brat-500 hover:bg-brat-500 hover:text-brat-900 active:text-brat-500 active:bg-brat-800 active:ring-brat-500 ring-2 ring-brat-500 transition-all duration-200'
		}
	}
};