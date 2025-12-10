'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Vibe, VibeFormState } from '@/lib/types';
import { clsx } from 'clsx';
import { uploadVibeMedia } from '@/lib/uploadVibeMedia';
import imageCompression from 'browser-image-compression';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { getVibeStyles } from '@/lib/getVibeStyles';
import { useVibeHeader } from '@/contexts/vibeHeaderContext';
import InputCalendar from "@/components/ui/inputs/inputCalendar";
import InputTextArea from "@/components/ui/inputs/inputTextArea";
import SpotifyEmbed from "@/components/ui/spotifyEmbed";
import InputAudio from "@/components/ui/inputs/inputAudio";
import EmotionSelector from "@/components/ui/inputs/emotionSelector";
import VibeFormActions from "./vibeFormActions";
import DeleteConfirmDialog from "./deleteConfirmDialog";

type VibeFormProps = {
	form: VibeFormState;
	setForm: React.Dispatch<React.SetStateAction<VibeFormState>>;
	userId: string;
	vibes: Vibe[];
	isOwner?: boolean;
	vibeId?: string;
	handle: string;
	mode: 'view' | 'edit' | 'add';
};

const VibeForm = ({ form, setForm, userId, vibes, isOwner, vibeId, handle, mode }: VibeFormProps) => {
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState(false);
	const [success, setSuccess] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
	const selectedVibe = vibes.find((v) => v.id === form.vibe);
	const vibeType = selectedVibe?.vibe_type;
	const vibeStyles = getVibeStyles(vibeType, currentTheme);

	const { setVibeHeader, clearVibeHeader } = useVibeHeader();

	// Set header state for vibe pages (view, edit, add)
	useEffect(() => {
		setVibeHeader({
			isVibePage: true,
			handle,
			vibeId,
			isOwner,
			vibeStyles: vibeStyles ? { bg: vibeStyles.bg, text: vibeStyles.text } : undefined,
			onDelete: mode === 'view' ? () => setShowConfirm(true) : undefined,
		});

		return () => {
			clearVibeHeader();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode, handle, vibeId, isOwner, vibeStyles?.bg, vibeStyles?.text]);

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
				if (mode === 'add') {
					router.push(`/v/${handle}`);
				} else if (mode === 'edit') {
					router.push(`/v/${handle}/${vibeId}`);
				}
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

		const maxSize = 15 * 1024 * 1024;
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

	const handleDelete = async () => {
		const res = await fetch('/api/delete-vibes', {
			method: 'POST',
			body: JSON.stringify({ id: form.id })
		});

		if (res.ok) {
			setShowConfirm(false);
			router.push(`/v/${handle}`);
		} else {
			console.error('Failed to delete vibe');
		}
	};

	const isViewMode = mode === 'view';
	const isEditMode = mode === 'add' || mode === 'edit';

	return (
		<form onSubmit={handleSubmit} className={clsx(
			'flex flex-col h-full w-full',
			vibeStyles?.text
		)}>
			{/* View Mode: Matching form layout */}
			{isViewMode ? (
				<div className="flex flex-col h-full">
					{/* Top row: Date on right */}
					<div className="flex justify-end mb-4">
						<InputCalendar vibeDate={form.vibe_date} vibeType={vibeType} mode={mode} onHandleChange={handleChange} />
					</div>

					{/* Message section - flex-1 to fill space, justify-end to push content to bottom */}
					<div className="flex-1 flex flex-col justify-end">
						<InputTextArea vibeMessage={form.message} mode={mode} onHandleChange={handleChange} />
					</div>

					{/* Bottom section: Vibe type + Audio */}
					<div className="flex items-center justify-between mt-4">
						{/* Subtle Vibe Type - matching vibeGrid style */}
						<span className={clsx(
							"text-xs tracking-widest uppercase font-bold opacity-30",
							vibeStyles?.text
						)}>
							{vibeType}
						</span>

						{/* Audio/Spotify */}
						{form.audio && (
							<div className="w-64">
								<SpotifyEmbed vibeAudio={form.audio} />
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="flex flex-col h-full">
					{/* Top row: Date on right */}
					<div className="flex justify-end mb-4">
						<InputCalendar vibeDate={form.vibe_date} vibeType={vibeType} mode={mode} onHandleChange={handleChange} />
					</div>

					{/* Emotion Selector with arrows */}
					<EmotionSelector
						vibes={vibes}
						selectedVibeId={form.vibe}
						onSelect={(vibeId) => setForm((prev) => ({ ...prev, vibe: vibeId }))}
					/>

					{/* Message section */}
					<div className="mt-6 flex-1 flex flex-col">
						<label className={clsx(
							"text-sm font-medium mb-2",
							vibeStyles?.text
						)}>
							Today felt like...
						</label>
						<InputTextArea vibeMessage={form.message} mode={mode} onHandleChange={handleChange} />
					</div>

					{/* Bottom section: Image + Spotify */}
					<div className="flex items-center gap-8 mt-6">
						{/* Image Upload */}
						<div className="flex items-center gap-2">
							{form.media ? (
								<div className="relative">
									<img src={form.media} alt="preview" className="h-16 w-16 object-cover rounded-lg shadow" />
									<button
										type="button"
										onClick={() => setForm((prev) => ({ ...prev, media: '' }))}
										className={clsx('absolute -top-2 -right-2 p-1 rounded-full bg-black/50 hover:opacity-70', vibeStyles?.text)}
									>
										<Trash2 size={12} />
									</button>
								</div>
							) : (
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className={clsx('hover:opacity-70 flex items-center gap-2', vibeStyles?.text)}
								>
									<ImagePlus size={20} />
									<span className="text-sm">Image</span>
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

						{/* Audio/Spotify */}
						<InputAudio vibeAudio={form.audio} vibeType={vibeType} mode={mode} onSetForm={setForm} onHandleChange={handleChange} />
					</div>

					{/* Submit Actions - pushed to bottom */}
					<div className="mt-auto pt-6">
						<VibeFormActions
							mode={mode}
							isProcessing={isProcessing}
							success={success}
							vibeStyles={vibeStyles ?? undefined}
							onCancel={mode === 'edit' && vibeId ? () => router.push(`/v/${handle}/${vibeId}`) : undefined}
						/>
					</div>
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmDialog
				isOpen={showConfirm}
				onConfirm={handleDelete}
				onCancel={() => setShowConfirm(false)}
				vibeStyles={vibeStyles ?? undefined}
			/>
		</form>
	);
};

export default VibeForm;
