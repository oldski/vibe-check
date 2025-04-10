'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VibeModal from './vibeModal';
import {DailyVibe, Vibe, VibeFormState} from '@/lib/types';
import {format} from "date-fns";

type Props = {
	selectedVibe?: DailyVibe;
	userId: string;
	vibes: Vibe[];
	handle: string;
	mode: 'view' | 'edit' | 'add';
	
};

export default function VibeModalWrapper({ selectedVibe, userId, vibes, handle, mode }: Props) {
	const router = useRouter();
	const [form, setForm] = useState<VibeFormState | null>(null);
	
	useEffect(() => {
		if (mode === 'add') {
			setForm({
				id: undefined,
				vibe_date: format(new Date(), 'yyyy-MM-dd'),
				message: '',
				vibe: null,
				audio: '',
				media: '',
			});
		} else if (selectedVibe) {
			const dateOnly = new Date(selectedVibe.vibe_date).toISOString().split('T')[0];
			setForm({
				id: selectedVibe.id,
				vibe_date: dateOnly,
				message: selectedVibe.message,
				vibe: selectedVibe.vibe.id,
				audio: selectedVibe.audio ?? '',
				media: selectedVibe.media ?? '',
			});
		}
	}, []);

	const handleClose = () => {
		router.push(`/v/${handle}`, { scroll: false });
	};
	
	if (!form && mode !== 'add') return null;
	
	return (
		form && (
			<VibeModal
				open={true}
				onClose={handleClose}
				selectedVibe={selectedVibe}
				userId={userId}
				vibes={vibes}
				handle={handle}
				form={form}
				// @ts-expect-error safe type inference issue for now
				setForm={setForm}
				mode={mode}
			/>
		)
	);
}
