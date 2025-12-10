'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/contexts/toastContext';
import { Mail, Key, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type BackstageAccountProps = {
	email: string;
};

export default function BackstageAccount({ email }: BackstageAccountProps) {
	const { addToast } = useToast();

	// Email change state
	const [isChangingEmail, setIsChangingEmail] = useState(false);
	const [newEmail, setNewEmail] = useState('');
	const [emailLoading, setEmailLoading] = useState(false);

	// Password change state
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	const [passwordLoading, setPasswordLoading] = useState(false);
	const [passwordError, setPasswordError] = useState<string | null>(null);

	// Delete account state
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] = useState('');
	const [deleteLoading, setDeleteLoading] = useState(false);

	const handleEmailChange = async () => {
		if (!newEmail || newEmail === email) {
			addToast('Please enter a new email address', 'warning');
			return;
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newEmail)) {
			addToast('Please enter a valid email address', 'warning');
			return;
		}

		setEmailLoading(true);

		try {
			const res = await fetch('/api/update-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: newEmail }),
			});

			const data = await res.json();

			if (res.ok) {
				addToast('Verification email sent! Please check your inbox.', 'success');
				setIsChangingEmail(false);
				setNewEmail('');
			} else {
				addToast(data.error || 'Failed to update email', 'error');
			}
		} catch {
			addToast('Failed to update email', 'error');
		} finally {
			setEmailLoading(false);
		}
	};

	const handlePasswordChange = async () => {
		setPasswordError(null);

		if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
			setPasswordError('Please fill in all fields');
			return;
		}

		if (passwordForm.newPassword.length < 6) {
			setPasswordError('Password must be at least 6 characters');
			return;
		}

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			setPasswordError('Passwords do not match');
			return;
		}

		setPasswordLoading(true);

		try {
			const res = await fetch('/api/update-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: passwordForm.newPassword }),
			});

			const data = await res.json();

			if (res.ok) {
				addToast('Password updated successfully!', 'success');
				setIsChangingPassword(false);
				setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
			} else {
				setPasswordError(data.error || 'Failed to update password');
			}
		} catch {
			setPasswordError('Failed to update password');
		} finally {
			setPasswordLoading(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (deleteConfirmText !== 'DELETE') {
			addToast('Please type DELETE to confirm', 'warning');
			return;
		}

		setDeleteLoading(true);

		try {
			const res = await fetch('/api/delete-account', {
				method: 'POST',
			});

			const data = await res.json();

			if (res.ok) {
				addToast('Account deleted. Goodbye!', 'success');
				// Redirect to home after short delay
				setTimeout(() => {
					window.location.href = '/';
				}, 1500);
			} else {
				addToast(data.error || 'Failed to delete account', 'error');
				setDeleteLoading(false);
			}
		} catch {
			addToast('Failed to delete account', 'error');
			setDeleteLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<h2 className="text-lg font-semibold">Account Settings</h2>

			{/* Email Section */}
			<div className="bg-card border rounded-xl p-4">
				<div className="flex items-center gap-3 mb-3">
					<div className="size-8 rounded-lg bg-muted flex items-center justify-center">
						<Mail className="size-4 text-muted-foreground" />
					</div>
					<span className="font-medium">Email Address</span>
				</div>

				{!isChangingEmail ? (
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">{email}</p>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsChangingEmail(true)}
						>
							Change
						</Button>
					</div>
				) : (
					<div className="space-y-3">
						<Input
							type="email"
							value={newEmail}
							onChange={(e) => setNewEmail(e.target.value)}
							placeholder="Enter new email address"
						/>
						<p className="text-xs text-muted-foreground">
							A verification link will be sent to your new email address.
						</p>
						<div className="flex gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setIsChangingEmail(false);
									setNewEmail('');
								}}
								disabled={emailLoading}
							>
								Cancel
							</Button>
							<Button
								size="sm"
								onClick={handleEmailChange}
								disabled={emailLoading}
							>
								{emailLoading ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									'Send Verification'
								)}
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* Password Section */}
			<div className="bg-card border rounded-xl p-4">
				<div className="flex items-center gap-3 mb-3">
					<div className="size-8 rounded-lg bg-muted flex items-center justify-center">
						<Key className="size-4 text-muted-foreground" />
					</div>
					<span className="font-medium">Password</span>
				</div>

				{!isChangingPassword ? (
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">••••••••••••</p>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsChangingPassword(true)}
						>
							Change
						</Button>
					</div>
				) : (
					<div className="space-y-3">
						<div>
							<label className="text-sm text-muted-foreground mb-1 block">New Password</label>
							<Input
								type="password"
								value={passwordForm.newPassword}
								onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
								placeholder="Enter new password"
							/>
						</div>
						<div>
							<label className="text-sm text-muted-foreground mb-1 block">Confirm Password</label>
							<Input
								type="password"
								value={passwordForm.confirmPassword}
								onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
								placeholder="Confirm new password"
							/>
						</div>
						{passwordError && (
							<p className="text-xs text-red-500">{passwordError}</p>
						)}
						<div className="flex gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setIsChangingPassword(false);
									setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
									setPasswordError(null);
								}}
								disabled={passwordLoading}
							>
								Cancel
							</Button>
							<Button
								size="sm"
								onClick={handlePasswordChange}
								disabled={passwordLoading}
							>
								{passwordLoading ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									'Update Password'
								)}
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* Danger Zone */}
			<div className="bg-card border border-red-500/20 rounded-xl p-4">
				<div className="flex items-center gap-3 mb-3">
					<div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center">
						<Trash2 className="size-4 text-red-500" />
					</div>
					<span className="font-medium text-red-500">Danger Zone</span>
				</div>

				{!showDeleteConfirm ? (
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium">Delete Account</p>
							<p className="text-xs text-muted-foreground">
								Permanently delete your account and all your vibes
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							className="border-red-500/50 text-red-500 hover:bg-red-500/10"
							onClick={() => setShowDeleteConfirm(true)}
						>
							Delete
						</Button>
					</div>
				) : (
					<AnimatePresence>
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							className="space-y-3"
						>
							<div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg">
								<AlertTriangle className="size-5 text-red-500 shrink-0 mt-0.5" />
								<div>
									<p className="text-sm font-medium text-red-500">This action cannot be undone</p>
									<p className="text-xs text-muted-foreground mt-1">
										All your vibes, profile data, and media will be permanently deleted.
									</p>
								</div>
							</div>

							<div>
								<label className="text-sm text-muted-foreground mb-1 block">
									Type <span className="font-mono font-bold">DELETE</span> to confirm
								</label>
								<Input
									value={deleteConfirmText}
									onChange={(e) => setDeleteConfirmText(e.target.value)}
									placeholder="Type DELETE"
									className="border-red-500/30 focus-visible:ring-red-500"
								/>
							</div>

							<div className="flex gap-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setShowDeleteConfirm(false);
										setDeleteConfirmText('');
									}}
									disabled={deleteLoading}
								>
									Cancel
								</Button>
								<Button
									size="sm"
									variant="destructive"
									onClick={handleDeleteAccount}
									disabled={deleteLoading || deleteConfirmText !== 'DELETE'}
								>
									{deleteLoading ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										'Delete Account Forever'
									)}
								</Button>
							</div>
						</motion.div>
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}
