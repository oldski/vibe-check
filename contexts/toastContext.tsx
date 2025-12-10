'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
};

type ToastContextType = {
	toasts: Toast[];
	addToast: (message: string, type?: ToastType, duration?: number) => void;
	removeToast: (id: string) => void;
	clearToasts: () => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 4000) => {
		const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		const newToast: Toast = { id, message, type, duration };

		setToasts(prev => [...prev, newToast]);

		// Auto-dismiss after duration
		if (duration > 0) {
			setTimeout(() => {
				setToasts(prev => prev.filter(t => t.id !== id));
			}, duration);
		}
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts(prev => prev.filter(t => t.id !== id));
	}, []);

	const clearToasts = useCallback(() => {
		setToasts([]);
	}, []);

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
			{children}
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
}

// Safe hook for optional use
export function useToastSafe() {
	return useContext(ToastContext);
}
