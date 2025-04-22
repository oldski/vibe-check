'use client';
import { useRef, useState } from 'react';
import {Vibe, VibeFormState} from '@/lib/types';
import { clsx } from 'clsx';
import { uploadVibeMedia } from '@/lib/uploadVibeMedia';
import imageCompression from 'browser-image-compression';
import { motion } from 'framer-motion';
import {AudioLines, Backpack, Calendar, ChevronLeft, CircleX, ImagePlus, Pencil, SmilePlus, Trash2} from 'lucide-react';
import { format } from 'date-fns';
import { parseLocalDate } from '@/lib/date-utiles';
import { useTheme } from 'next-themes';
import { getVibeStyles } from '@/lib/getVibeStyles';
import MotionLink from "@/components/ui/motionLink";
import Link from "next/link";

const INIT_VIBE_FORM = {
	id: '',
	vibe_date: format(new Date(), 'yyyy-MM-dd'),
	message: '',
	vibe: null,
	audio: '',
	media: '',
};

type VibeFormProps = {
	form: VibeFormState;
	setForm: React.Dispatch<React.SetStateAction<VibeFormState>>;
	userId: string;
	vibes: Vibe[];
	onClose: () => void;
	isOwner?: boolean;
	vibeId?: string;
	mode: 'view' | 'edit' | 'add';
};

const VibeForm = ({ form, setForm, userId, vibes, onClose, isOwner, vibeId, mode }: VibeFormProps) => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [success, setSuccess] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const dateInputRef = useRef<HTMLInputElement>(null);
	
	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
	const selectedVibe = vibes.find((v) => v.id === form.vibe);
	const vibeType = selectedVibe?.vibe_type;
	const vibeStyles = getVibeStyles(vibeType, currentTheme);
	
	const maxLength = 140;
	const warnThreshold = Math.floor(maxLength * 0.7);
	const dangerThreshold = Math.floor(maxLength * 0.95);
	const today = format(new Date(), 'yyyy-MM-dd');
	
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsProcessing(true);
		
		const api = mode === 'edit' ? '/api/update-vibes' : '/api/send-vibes';
		
		try {
			const res = await fetch(api, {
				method: 'POST',
				body: JSON.stringify(form),
			});
			if (res.ok) {
				setSuccess(true);
				setForm(INIT_VIBE_FORM);
			} else {
				console.error('submission failed due to bad vibes');
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsProcessing(false);
		}
	};
	
	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		
		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
		if (!allowedTypes.includes(file.type)) {
			alert('Only JPG, PNG, WebP, or MP4 files are allowed.');
			return;
		}
		
		const maxSize = 15 * 1024 * 1024; // 15MB
		if (file.size > maxSize) {
			alert('File too large. Max is 15MB.');
			return;
		}
		
		const compressedFile = file.type.startsWith('image/')
			? await imageCompression(file, {
				maxSizeMB: 1,
				maxWidthOrHeight: 1024,
				useWebWorker: true,
			})
			: file;
		
		const uploadUrl = await uploadVibeMedia(compressedFile, userId, form.vibe_date);
		if (uploadUrl) {
			setForm((prev) => ({ ...prev, media: uploadUrl }));
		} else {
			alert('Upload failed');
		}
	};
	
	function extractSpotifyTrackId(url: string) {
		const match = url.match(/track\/([a-zA-Z0-9]+)/);
		return match ? match[1] : null;
	}
	
	const handleDelete = async () => {
		const res = await fetch('/api/delete-vibes', {
			method: 'POST',
			body: JSON.stringify({
				id: form.id})
		});
		
		if (res.ok) {
			setShowConfirm(false);
			onClose(); // close modal
			// You could also trigger a toast here like: toast.success('Vibe deleted!')
		} else {
			console.error('Failed to delete vibe');
		}
	}
	
	return (
		<form onSubmit={handleSubmit} className={clsx('flex flex-col justify-between h-full gap-6', vibeStyles?.text)}>
			
			
				<div className={clsx("fixed top-6 left-6 z-50 px-5 py-3 rounded-full shadow-lg transition flex items-center justify-items-center gap-3 text-sm", vibeStyles?.bg)}>
					<MotionLink href={`/v/oldski/`} title="back to vibe"><ChevronLeft /></MotionLink>
					{ isOwner && (
						<>
							<MotionLink href={`/v/oldski/${vibeId}/edit`} className={clsx(mode === 'edit' && 'bg-black rounded-full text-white')} title="edit vibe"><Pencil /></MotionLink>
							<button type="button" onClick={() => setShowConfirm(true)} title="delete vibe"><Trash2 /></button>
						</>
					)}
				</div>
			
			
			{/* Date Field */}
			<div className={clsx('flex items-center justify-end gap-2 text-lg md:text-2xl font-bold text-right')}>
				<span>{format(parseLocalDate(form.vibe_date), 'MM/dd/yyyy')}</span>
				{mode === 'view' ? (
					<Calendar className={clsx(vibeStyles?.text)} />
				) : (
					<button
						type="button"
						onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus()}
						className={clsx('hover:opacity-70', vibeStyles?.text)}
					>
						<Calendar />
					</button>
				)}
				
				<input
					type="date"
					ref={dateInputRef}
					name="vibe_date"
					value={form.vibe_date}
					onChange={handleChange}
					max={today}
					className="sr-only"
				/>
			</div>
			
			{/* Vibe Selector */}
			{mode !== 'view' && (
				<div className="flex flex-wrap gap-2">
					{vibes.map((v) => {
						const isSelected = form.vibe === v.id;
						const isActiveStyle = isSelected ? vibeStyles : undefined;
						
						return (
							<motion.button
								key={v.id}
								type="button"
								onClick={() => setForm((prev) => ({ ...prev, vibe: v.id }))}
								className={clsx(
									'px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase',
									v.vibe_type === vibeType ? vibeStyles?.ring : vibeStyles?.vibeButton,
								)}
								whileTap={{ scale: 0.95 }}
								whileHover={{ scale: 1.07, boxShadow: '0 0 0 2px rgba(0,0,0,0.1)' }}
							>
								{v.vibe_type}
							</motion.button>
						);
					})}
				</div>
			)}
			
			{/* Message */}
			<div>
				{ mode !== 'view' && (
					<>
						<textarea
							name="message"
							placeholder="Today felt like..."
							value={form.message}
							onChange={handleChange}
							maxLength={maxLength}
							className={clsx(
								'w-full resize-none text-2xl font-bold bg-transparent border-b',
								vibeStyles?.text,
								vibeStyles?.ring,
								'focus:outline-none',
								vibeStyles?.borderBottom,
								vibeStyles?.placeholder,
							)}
							rows={3}
						/>
						<div
							className={clsx(
								'inline-block p-1 rounded-full text-xs font-mono bg-white',
								form.message.length >= dangerThreshold
									? 'text-red-500'
									: form.message.length >= warnThreshold
										? 'text-yellow-500'
										: 'text-green-500'
							)}
						>
							{form.message.length} / {maxLength}
						</div>
					</>
				)}
			</div>
			
			{mode === 'view' && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
					<div className="flex flex-col gap-2">
						<div className={clsx('w-full resize-none text-3xl font-bold bg-transparent', vibeStyles?.text,)}>{form.message}</div>
						<div className={clsx('text-xs tracking-widest uppercase font-bold opacity-30', vibeStyles?.text)}>{vibeType}</div>
					</div>
					
					{/* Spotify Embed */}
					{form.audio && extractSpotifyTrackId(form.audio) && (
						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: 'easeOut' }}
						>
							<iframe
								src={`https://open.spotify.com/embed/track/${extractSpotifyTrackId(form.audio)}`}
								width="100%"
								height="80"
								className="rounded-lg shadow"
								frameBorder="0"
								allow="encrypted-media"
							/>
						</motion.div>
					)}
				</div>
			)}
			
			{/* Media Row */}
			{mode !== 'view' && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
				{/* Image Upload */}
				<div className="flex">
					{form.media ? (
						<div className="relative">
							<img src={form.media} alt="preview" className="h-24 w-24 object-cover rounded-lg shadow" />
							<button
								type="button"
								onClick={() => setForm((prev) => ({ ...prev, media: '' }))}
								// className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full"
								className={clsx('absolute top-1 right-1 p-1 rounded-full hover:opacity-70', vibeStyles?.text)}
							>
								<Trash2 size={16} />
							</button>
						</div>
					) : (
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className={clsx('hover:opacity-70', vibeStyles?.text)}
							
						>
							<ImagePlus size={24} />
						</button>
					)}
					<input
						ref={fileInputRef}
						type="file"
						name="media"
						accept="image/*,video/*"
						onChange={handleFileUpload}
						className="hidden"
					/>
				</div>
				
				{/* Audio */}
				<div className="flex flex-col gap-4">
					<div className={clsx("flex items-center gap-2 py-2 border-b", vibeStyles?.borderBottom)}>
            <span className={clsx('hover:opacity-70 p-1', vibeStyles?.text)}>
              <AudioLines />
            </span>
						<input
							type="url"
							name="audio"
							placeholder="Drop a Spotify link"
							value={form.audio}
							onChange={handleChange}
							className={clsx(
								'w-full bg-transparent text-sm focus:outline-none',
								vibeStyles?.text,
								vibeStyles?.placeholder
							)}
							autoComplete="off"
						/>
						{form.audio && (
							<button
								type="button"
								onClick={() => setForm((prev) => ({ ...prev, audio: '' }))}
								className={clsx('hover:opacity-70 p-1 rounded-full', vibeStyles?.text)}
								title="Remove track"
							>
								<CircleX size={16} />
							</button>
						)}
					</div>
					
					{/* Spotify Embed */}
					{form.audio && extractSpotifyTrackId(form.audio) && (
						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: 'easeOut' }}
						>
							<iframe
								src={`https://open.spotify.com/embed/track/${extractSpotifyTrackId(form.audio)}`}
								width="100%"
								height="80"
								className="rounded-lg shadow"
								frameBorder="0"
								allow="encrypted-media"
							/>
						</motion.div>
					)}
				</div>
			</div>
			)}
			
			{mode !== 'view' && (
				<div className="flex flex-row justify-end align-items-center">
					{/* Submit Button */}
					{ mode === 'edit' ? (
						<>
							<motion.button
								type="submit"
								disabled={isProcessing}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								transition={{ type: 'spring', stiffness: 300 }}
								className={clsx(
									'self-end mt-4 px-6 py-2 rounded-full font-semibold shadow-md',
									vibeStyles?.bg,
									vibeStyles?.text,
									vibeStyles?.hover,
									vibeStyles?.focus,
									vibeStyles?.active,
									vibeStyles?.ring,
									vibeStyles?.disabled,
									vibeStyles?.transition
								)}
							>
								{isProcessing ? 'Processing...' : 'Edit Vibe'}
							</motion.button>
							
							{success && <p className="text-green-600 text-sm">Vibe Updated!</p>}
						</>
					) : (
						<>
							<motion.button
								type="submit"
								disabled={isProcessing}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								transition={{ type: 'spring', stiffness: 300 }}
								className={clsx(
									'self-end mt-4 px-6 py-2 rounded-full font-semibold shadow-md',
									vibeStyles?.bg,
									vibeStyles?.text,
									vibeStyles?.hover,
									vibeStyles?.focus,
									vibeStyles?.active,
									vibeStyles?.ring,
									vibeStyles?.disabled,
									vibeStyles?.transition
								)}
							>
								{isProcessing ? 'Processing...' : 'Submit Vibe'}
							</motion.button>
				
							{success && <p className="text-green-600 text-sm">Vibe added!</p>}
						</>
					)}
				</div>
			)}
			
			{showConfirm && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0 }}
					className={clsx(
						"fixed bottom-6 right-6 p-6 rounded-lg shadow-lg z-50",
						"flex flex-col gap-2 items-start",
						vibeStyles?.bg,
						vibeStyles?.text,
						vibeStyles?.ring
					)}
				>
					<p className="text-sm font-medium">Are you sure you want to delete this vibe?</p>
					<div className="flex gap-2 mt-2">
						<button
							type="button"
							onClick={handleDelete}
							className={clsx("px-3 py-1 rounded text-sm", vibeStyles?.ring, vibeStyles?.text)}
						>
							Yes, Delete
						</button>
						<button
							onClick={() => setShowConfirm(false)}
							className="text-sm px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700"
						>
							Cancel
						</button>
					</div>
				</motion.div>
			)}
		</form>
	);
};

export default VibeForm;
