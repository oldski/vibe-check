'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type ShareMenuProps = {
	isOpen: boolean;
	onClose: () => void;
	url: string;
	title: string;
	text: string;
	vibeStyles?: {
		text?: string;
	};
};

// Simple SVG icons for social platforms
const TwitterIcon = () => (
	<svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
		<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
	</svg>
);

const FacebookIcon = () => (
	<svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
		<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
	</svg>
);

const WhatsAppIcon = () => (
	<svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
		<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
	</svg>
);

export default function ShareMenu({ isOpen, onClose, url, title, text, vibeStyles }: ShareMenuProps) {
	const [copied, setCopied] = useState(false);

	const encodedUrl = encodeURIComponent(url);
	const encodedText = encodeURIComponent(text);
	const encodedTitle = encodeURIComponent(title);

	const shareLinks = [
		{
			name: 'X (Twitter)',
			icon: TwitterIcon,
			href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
			color: 'hover:bg-black hover:text-white',
		},
		{
			name: 'Facebook',
			icon: FacebookIcon,
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
			color: 'hover:bg-[#1877F2] hover:text-white',
		},
		{
			name: 'WhatsApp',
			icon: WhatsAppIcon,
			href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
			color: 'hover:bg-[#25D366] hover:text-white',
		},
	];

	const handleCopyLink = async () => {
		try {
			// Try modern clipboard API first
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(url);
			} else {
				// Fallback for older browsers or non-secure contexts
				const textArea = document.createElement('textarea');
				textArea.value = url;
				textArea.style.position = 'fixed';
				textArea.style.left = '-999999px';
				textArea.style.top = '-999999px';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
			}
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	const handleShareClick = (href: string) => {
		window.open(href, '_blank', 'width=600,height=400,noopener,noreferrer');
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
						onClick={onClose}
					/>

					{/* Menu */}
					<motion.div
						initial={{ y: '100%', opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: '100%', opacity: 0 }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className="fixed bottom-0 left-0 right-0 z-[70] bg-background shadow-2xl"
					>
						{/* Handle */}
						<div className="flex justify-center pt-3 pb-2">
							<div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
						</div>

						{/* Header */}
						<div className="flex items-center justify-between px-6 pb-4">
							<h2 className="text-lg font-semibold">Share this vibe</h2>
							<button
								type="button"
								onClick={onClose}
								className="p-2 hover:bg-muted rounded-full transition-colors"
							>
								<X className="size-5" />
							</button>
						</div>

						{/* Share Options */}
						<div className="px-6 pb-8">
							<div className="grid grid-cols-4 gap-4">
								{shareLinks.map((link) => (
									<button
										key={link.name}
										type="button"
										onClick={() => handleShareClick(link.href)}
										className={cn(
											"flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 transition-all",
											link.color
										)}
									>
										<link.icon />
										<span className="text-xs font-medium">{link.name}</span>
									</button>
								))}
								<button
									type="button"
									onClick={handleCopyLink}
									className={cn(
										"flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 transition-all",
										copied ? "bg-green-500 text-white" : "hover:bg-muted"
									)}
								>
									{copied ? <Check className="size-5" /> : <Link2 className="size-5" />}
									<span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
								</button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
