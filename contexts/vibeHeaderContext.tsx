'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type VibeHeaderState = {
	isVibePage: boolean;
	handle?: string;
	vibeId?: string;
	isOwner?: boolean;
	vibeStyles?: {
		bg?: string;
		text?: string;
	};
	onDelete?: () => void;
	onShare?: () => void;
	onExport?: () => void;
};

type VibeHeaderContextType = {
	state: VibeHeaderState;
	setVibeHeader: (state: VibeHeaderState) => void;
	clearVibeHeader: () => void;
};

const defaultState: VibeHeaderState = {
	isVibePage: false,
};

const VibeHeaderContext = createContext<VibeHeaderContextType | undefined>(undefined);

export function VibeHeaderProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<VibeHeaderState>(defaultState);

	const setVibeHeader = useCallback((newState: VibeHeaderState) => {
		setState(newState);
	}, []);

	const clearVibeHeader = useCallback(() => {
		setState(defaultState);
	}, []);

	return (
		<VibeHeaderContext.Provider value={{ state, setVibeHeader, clearVibeHeader }}>
			{children}
		</VibeHeaderContext.Provider>
	);
}

export function useVibeHeader() {
	const context = useContext(VibeHeaderContext);
	if (!context) {
		throw new Error('useVibeHeader must be used within a VibeHeaderProvider');
	}
	return context;
}
