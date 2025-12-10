import type { Dispatch, SetStateAction } from "react";
import { AudioLines, CircleX } from "lucide-react";
import { motion } from "framer-motion";
import { getSpotifyTrackId } from "@/lib/getSpotifyTrackId";
import { cn } from "@/lib/utils";
import { VibeFormState, VibeStyles } from "@/lib/types";

type InputAudioProps = {
	vibeAudio: string;
	mode: 'view' | 'edit' | 'add';
	vibeStyles?: VibeStyles | null;
	onSetForm: Dispatch<SetStateAction<VibeFormState>>;
	onHandleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputAudio = ({ vibeAudio, mode, vibeStyles, onSetForm, onHandleChange }: InputAudioProps) => {
	return (
		<div className="flex-1 flex flex-col gap-4">
			<div className={cn(
				"flex items-center gap-2 py-2 border-b-2 transition-colors",
				vibeStyles?.borderBottom
			)}>
				<span className="hover:opacity-70 p-1">
					<AudioLines />
				</span>
				<input
					type="url"
					name="audio"
					placeholder="Drop a Spotify link"
					value={vibeAudio}
					onChange={onHandleChange}
					className={cn(
						'flex-1 bg-transparent text-sm focus:outline-none',
						vibeStyles?.placeholder
					)}
					autoComplete="off"
				/>
				{vibeAudio && (
					<button
						type="button"
						onClick={() => onSetForm((prev) => ({ ...prev, audio: '' }))}
						className="hover:opacity-70 p-1 rounded-full"
						title="Remove track"
					>
						<CircleX size={16} />
					</button>
				)}
			</div>

			{/* Spotify Embed */}
			{vibeAudio && getSpotifyTrackId(vibeAudio) && (
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: 'easeOut' }}
				>
					<iframe
						src={`https://open.spotify.com/embed/track/${getSpotifyTrackId(vibeAudio)}`}
						width="100%"
						height="80"
						className="rounded-lg shadow"
						frameBorder="0"
						allow="encrypted-media"
					/>
				</motion.div>
			)}
		</div>
	)
}

export default InputAudio;
