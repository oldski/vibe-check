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
import { useVibesSafe } from '@/contexts/vibesContext';
import { useToast } from '@/contexts/toastContext';
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

type ValidationErrors = {
	vibe?: string;
	message?: string;
	vibe_date?: string;
};

const VibeForm = ({ form, setForm, userId, vibes, isOwner, vibeId, handle, mode }: VibeFormProps) => {
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState(false);
	const [success, setSuccess] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { resolvedTheme } = useTheme();
	const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
	const selectedVibe = vibes.find((v) => v.id === form.vibe);
	const vibeType = selectedVibe?.vibe_type;
	const vibeStyles = getVibeStyles(vibeType, currentTheme);

	const { setVibeHeader, clearVibeHeader } = useVibeHeader();
	const { addToast } = useToast();

	// Use context for optimistic updates when available
	const vibesContext = useVibesSafe();

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

	// Validation function
	const validateForm = (): ValidationErrors => {
		const newErrors: ValidationErrors = {};

		if (!form.vibe) {
			newErrors.vibe = 'Please select a vibe';
		}

		if (!form.message || form.message.trim().length === 0) {
			newErrors.message = 'Please add a message';
		}

		if (!form.vibe_date) {
			newErrors.vibe_date = 'Please select a date';
		}

		return newErrors;
	};

	// Clear error when field is edited
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));

		// Clear error for this field when user starts typing
		if (errors[name as keyof ValidationErrors]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	// Mark field as touched on blur
	const handleBlur = (field: string) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate form
		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			// Mark all fields as touched to show errors
			setTouched({ vibe: true, message: true, vibe_date: true });
			addToast('Please fill in all required fields', 'warning');
			return;
		}

		setIsProcessing(true);

		const successMessage = mode === 'add' ? 'Vibe added!' : 'Vibe updated!';
		const errorMessage = mode === 'add' ? 'Failed to add vibe' : 'Failed to update vibe';

		try {
			// Use context for optimistic updates when available
			if (vibesContext) {
				let success = false;
				if (mode === 'add') {
					success = await vibesContext.addVibe(form, vibes, userId);
				} else if (mode === 'edit') {
					success = await vibesContext.updateVibe(form, vibes);
				}

				if (success) {
					setSuccess(true);
					addToast(successMessage, 'success');
					if (mode === 'add') {
						router.push(`/v/${handle}`);
					} else if (mode === 'edit') {
						router.push(`/v/${handle}/${vibeId}`);
					}
				} else {
					addToast(errorMessage, 'error');
				}
			} else {
				// Fallback to direct API calls when context is not available
				const api = mode === 'edit' ? '/api/update-vibes' : '/api/send-vibes';
				const res = await fetch(api, {
					method: 'POST',
					body: JSON.stringify(form),
				});
				if (res.ok) {
					setSuccess(true);
					addToast(successMessage, 'success');
					if (mode === 'add') {
						router.push(`/v/${handle}`);
					} else if (mode === 'edit') {
						router.push(`/v/${handle}/${vibeId}`);
					}
				} else {
					addToast(errorMessage, 'error');
				}
			}
		} catch (err) {
			console.error(err);
			addToast('Something went wrong', 'error');
		} finally {
			setIsProcessing(false);
		}
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
		if (!allowedTypes.includes(file.type)) {
			addToast('Only JPG, PNG, WebP, or MP4 files are allowed', 'warning');
			return;
		}

		const maxSize = 15 * 1024 * 1024;
		if (file.size > maxSize) {
			addToast('File too large. Max is 15MB', 'warning');
			return;
		}

		try {
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
				addToast('Image uploaded', 'success');
			} else {
				addToast('Upload failed', 'error');
			}
		} catch (err) {
			console.error(err);
			addToast('Upload failed', 'error');
		}
	};

	const handleDelete = async () => {
		try {
			// Use context for optimistic delete when available
			if (vibesContext && form.id) {
				const success = await vibesContext.deleteVibe(form.id);
				if (success) {
					setShowConfirm(false);
					addToast('Vibe deleted', 'success');
					router.push(`/v/${handle}`);
				} else {
					addToast('Failed to delete vibe', 'error');
				}
			} else {
				// Fallback to direct API call
				const res = await fetch('/api/delete-vibes', {
					method: 'POST',
					body: JSON.stringify({ id: form.id })
				});

				if (res.ok) {
					setShowConfirm(false);
					addToast('Vibe deleted', 'success');
					router.push(`/v/${handle}`);
				} else {
					addToast('Failed to delete vibe', 'error');
				}
			}
		} catch (err) {
			console.error(err);
			addToast('Failed to delete vibe', 'error');
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
					<div className="flex-1 flex flex-col justify-end lg:w-3/4">
						<InputTextArea vibeMessage={form.message} mode={mode} vibeStyles={vibeStyles} onHandleChange={handleChange} />
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
							<div className="w-1/4">
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
						onSelect={(vibeId) => {
							setForm((prev) => ({ ...prev, vibe: vibeId }));
							// Clear vibe error when a vibe is selected
							if (errors.vibe) {
								setErrors((prev) => ({ ...prev, vibe: undefined }));
							}
						}}
					/>

					{/* Message section */}
					<div className="mt-6 flex-1 flex flex-col justify-end">
						<InputTextArea
							vibeMessage={form.message}
							mode={mode}
							vibeStyles={vibeStyles}
							onHandleChange={handleChange}
							onBlur={() => handleBlur('message')}
							error={touched.message ? errors.message : undefined}
						/>
					</div>

					{/* Bottom section: Image + Spotify */}
					<div className="flex items-start gap-8 mt-8 pt-4">
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
						<InputAudio vibeAudio={form.audio} mode={mode} vibeStyles={vibeStyles} onSetForm={setForm} onHandleChange={handleChange} />
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
