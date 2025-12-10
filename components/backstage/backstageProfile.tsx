'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Profile } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/contexts/toastContext';
import { uploadAvatar } from '@/lib/uploadAvatar';
import imageCompression from 'browser-image-compression';
import { User, Check, X, Loader2, AtSign, Globe, Lock, Camera, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

type BackstageProfileProps = {
	profile: Profile;
	onProfileUpdate?: (profile: Profile) => void;
};

export default function BackstageProfile({ profile, onProfileUpdate }: BackstageProfileProps) {
	const { addToast } = useToast();
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [form, setForm] = useState({
		display_name: profile.display_name || '',
		handle: profile.handle,
		bio: profile.bio || '',
		is_public: profile.is_public,
	});

	const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);

	// Handle availability check
	const [handleStatus, setHandleStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
	const [handleError, setHandleError] = useState<string | null>(null);

	// Debounced handle check
	const checkHandle = useCallback(async (handle: string) => {
		if (handle === profile.handle) {
			setHandleStatus('idle');
			setHandleError(null);
			return;
		}

		if (handle.length < 3) {
			setHandleStatus('invalid');
			setHandleError('Handle must be at least 3 characters');
			return;
		}

		setHandleStatus('checking');
		setHandleError(null);

		try {
			const res = await fetch(`/api/check-handle?handle=${encodeURIComponent(handle)}`);
			const data = await res.json();

			if (data.error) {
				setHandleStatus('invalid');
				setHandleError(data.error);
			} else if (data.available) {
				setHandleStatus('available');
				setHandleError(null);
			} else {
				setHandleStatus('taken');
				setHandleError('This handle is already taken');
			}
		} catch {
			setHandleStatus('invalid');
			setHandleError('Failed to check handle availability');
		}
	}, [profile.handle]);

	// Debounce handle check
	useEffect(() => {
		if (!isEditing) return;

		const timer = setTimeout(() => {
			if (form.handle !== profile.handle) {
				checkHandle(form.handle);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [form.handle, isEditing, checkHandle, profile.handle]);

	const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			addToast('Only JPG, PNG, or WebP images are allowed', 'warning');
			return;
		}

		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			addToast('Image too large. Max is 5MB', 'warning');
			return;
		}

		setIsUploadingAvatar(true);

		try {
			// Compress the image
			const compressedFile = await imageCompression(file, {
				maxSizeMB: 0.5,
				maxWidthOrHeight: 400,
				useWebWorker: true,
			});

			const uploadUrl = await uploadAvatar(compressedFile, profile.id);

			if (uploadUrl) {
				setAvatarUrl(uploadUrl);

				// Update profile with new avatar URL
				const res = await fetch('/api/update-profile', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ avatar_url: uploadUrl }),
				});

				if (res.ok) {
					addToast('Avatar updated!', 'success');
					if (onProfileUpdate) {
						const data = await res.json();
						onProfileUpdate(data.profile);
					}
				} else {
					addToast('Failed to save avatar', 'error');
				}
			} else {
				addToast('Upload failed', 'error');
			}
		} catch (err) {
			console.error(err);
			addToast('Upload failed', 'error');
		} finally {
			setIsUploadingAvatar(false);
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const handleSave = async () => {
		if (handleStatus === 'taken' || handleStatus === 'invalid') {
			addToast('Please fix the handle before saving', 'warning');
			return;
		}

		setIsSaving(true);

		try {
			const res = await fetch('/api/update-profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			const data = await res.json();

			if (res.ok && data.success) {
				addToast('Profile updated!', 'success');
				setIsEditing(false);
				if (onProfileUpdate) {
					onProfileUpdate(data.profile);
				}
			} else {
				addToast(data.error || 'Failed to update profile', 'error');
			}
		} catch {
			addToast('Failed to update profile', 'error');
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setForm({
			display_name: profile.display_name || '',
			handle: profile.handle,
			bio: profile.bio || '',
			is_public: profile.is_public,
		});
		setHandleStatus('idle');
		setHandleError(null);
		setIsEditing(false);
	};

	return (
		<div className="bg-card border rounded-xl p-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-lg font-semibold">Profile</h2>
				{!isEditing ? (
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsEditing(true)}
					>
						Edit
					</Button>
				) : (
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleCancel}
							disabled={isSaving}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							onClick={handleSave}
							disabled={isSaving || handleStatus === 'taken' || handleStatus === 'invalid'}
						>
							{isSaving ? (
								<Loader2 className="size-4 animate-spin" />
							) : (
								'Save'
							)}
						</Button>
					</div>
				)}
			</div>

			<div className="flex flex-col sm:flex-row items-start gap-6">
				{/* Avatar */}
				<div className="shrink-0">
					<div className="relative group">
						<div className="size-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
							{avatarUrl ? (
								<img
									src={avatarUrl}
									alt="Avatar"
									className="size-full object-cover"
								/>
							) : (
								<User className="size-12 text-muted-foreground" />
							)}
						</div>

						{/* Upload overlay */}
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={isUploadingAvatar}
							className={cn(
								"absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-opacity",
								isUploadingAvatar ? "opacity-100" : "opacity-0 group-hover:opacity-100"
							)}
						>
							{isUploadingAvatar ? (
								<Loader2 className="size-6 text-white animate-spin" />
							) : (
								<Camera className="size-6 text-white" />
							)}
						</button>

						<input
							ref={fileInputRef}
							type="file"
							accept="image/jpeg,image/png,image/webp"
							onChange={handleAvatarUpload}
							className="hidden"
						/>
					</div>
					<p className="text-xs text-muted-foreground text-center mt-2">
						Click to upload
					</p>
				</div>

				{/* Profile info */}
				<div className="flex-1 space-y-4 w-full">
					{/* Display Name */}
					<div>
						<label className="text-sm text-muted-foreground mb-1 block">Display Name</label>
						{isEditing ? (
							<Input
								value={form.display_name}
								onChange={(e) => setForm({ ...form, display_name: e.target.value })}
								placeholder="Your display name"
								className="max-w-xs"
							/>
						) : (
							<p className="font-medium">
								{profile.display_name || <span className="text-muted-foreground italic">Not set</span>}
							</p>
						)}
					</div>

					{/* Handle */}
					<div>
						<label className="text-sm text-muted-foreground mb-1 block">Handle</label>
						{isEditing ? (
							<div className="space-y-1">
								<div className="relative max-w-xs">
									<AtSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
									<Input
										value={form.handle}
										onChange={(e) => setForm({ ...form, handle: e.target.value.toLowerCase() })}
										placeholder="yourhandle"
										className={cn(
											"pl-9 pr-9",
											handleStatus === 'available' && "border-green-500 focus-visible:ring-green-500",
											(handleStatus === 'taken' || handleStatus === 'invalid') && "border-red-500 focus-visible:ring-red-500"
										)}
									/>
									<div className="absolute right-3 top-1/2 -translate-y-1/2">
										<AnimatePresence mode="wait">
											{handleStatus === 'checking' && (
												<motion.div
													key="checking"
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													exit={{ opacity: 0, scale: 0.8 }}
												>
													<Loader2 className="size-4 animate-spin text-muted-foreground" />
												</motion.div>
											)}
											{handleStatus === 'available' && (
												<motion.div
													key="available"
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													exit={{ opacity: 0, scale: 0.8 }}
												>
													<Check className="size-4 text-green-500" />
												</motion.div>
											)}
											{(handleStatus === 'taken' || handleStatus === 'invalid') && (
												<motion.div
													key="error"
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													exit={{ opacity: 0, scale: 0.8 }}
												>
													<X className="size-4 text-red-500" />
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</div>
								{handleError && (
									<p className="text-xs text-red-500">{handleError}</p>
								)}
								<p className="text-xs text-muted-foreground">
									Your vibes will be at vibe-check.com/v/{form.handle || 'yourhandle'}
								</p>
							</div>
						) : (
							<p className="font-medium flex items-center gap-1">
								<AtSign className="size-4 text-muted-foreground" />
								{profile.handle}
							</p>
						)}
					</div>

					{/* Bio */}
					<div>
						<label className="text-sm text-muted-foreground mb-1 block">Bio</label>
						{isEditing ? (
							<textarea
								value={form.bio}
								onChange={(e) => setForm({ ...form, bio: e.target.value })}
								placeholder="Tell us about yourself..."
								rows={3}
								maxLength={200}
								className="flex w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
							/>
						) : (
							<p className={cn(
								"max-w-md",
								profile.bio ? "font-medium" : "text-muted-foreground italic"
							)}>
								{profile.bio || 'No bio yet'}
							</p>
						)}
						{isEditing && (
							<p className="text-xs text-muted-foreground mt-1">
								{form.bio.length}/200 characters
							</p>
						)}
					</div>

					{/* Visibility */}
					<div>
						<label className="text-sm text-muted-foreground mb-1 block">Profile Visibility</label>
						{isEditing ? (
							<div className="flex gap-2">
								<Button
									variant={form.is_public ? "default" : "outline"}
									size="sm"
									onClick={() => setForm({ ...form, is_public: true })}
									className="gap-2"
								>
									<Globe className="size-4" />
									Public
								</Button>
								<Button
									variant={!form.is_public ? "default" : "outline"}
									size="sm"
									onClick={() => setForm({ ...form, is_public: false })}
									className="gap-2"
								>
									<Lock className="size-4" />
									Private
								</Button>
							</div>
						) : (
							<p className="font-medium flex items-center gap-1">
								{profile.is_public ? (
									<>
										<Globe className="size-4 text-green-500" />
										Public
									</>
								) : (
									<>
										<Lock className="size-4 text-muted-foreground" />
										Private
									</>
								)}
							</p>
						)}
					</div>

					{/* Member since */}
					<div>
						<label className="text-sm text-muted-foreground mb-1 block">Member Since</label>
						<p className="font-medium">
							{format(new Date(profile.created_at), 'MMMM d, yyyy')}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
