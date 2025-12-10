import { cn } from "@/lib/utils";
import { VibeStyles } from "@/lib/types";

type InputTextAreaProps = {
	vibeMessage: string;
	mode: 'view' | 'edit' | 'add';
	vibeStyles?: VibeStyles | null;
	onHandleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onBlur?: () => void;
	error?: string;
}

const InputTextArea = ({ vibeMessage, mode, vibeStyles, onHandleChange, onBlur, error }: InputTextAreaProps) => {
	const maxLength = 140;
	const warnThreshold = Math.floor(maxLength * 0.7);
	const dangerThreshold = Math.floor(maxLength * 0.95);

	return (
		<>
			{mode === 'view' ? (
				<div className="w-full resize-none text-5xl md:text-6xl font-semibold bg-transparent">
					{vibeMessage}
				</div>
			) : (
				<>
					<textarea
						name="message"
						placeholder="Today felt like..."
						value={vibeMessage}
						onChange={onHandleChange}
						onBlur={onBlur}
						maxLength={maxLength}
						className={cn(
							'w-full lg:w-3/4 resize-none text-3xl md:text-4xl font-semibold bg-transparent border-b-2 focus:outline-none transition-colors',
							vibeStyles?.placeholder,
							error ? 'border-red-500/50' : vibeStyles?.borderBottom,
						)}
						rows={3}
					/>
					<div className="flex items-center justify-between w-full lg:w-3/4 mt-2">
						{error ? (
							<span className="text-red-500 text-sm">{error}</span>
						) : (
							<span />
						)}
						<div
							className={cn(
								'inline-block p-1 rounded-full text-xs font-mono',
								vibeMessage.length >= dangerThreshold
									? 'text-red-500'
									: vibeMessage.length >= warnThreshold
										? 'text-yellow-500'
										: 'opacity-50'
							)}
						>
							{vibeMessage.length} / {maxLength}
						</div>
					</div>
				</>
			)}
		</>
	)
}

export default InputTextArea;
