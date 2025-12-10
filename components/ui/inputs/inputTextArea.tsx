import {clsx} from "clsx";
import {cn} from "@/lib/utils";

type InputCalendarProps = {
	vibeMessage: string;
	vibeType?: string;
	mode: 'view' | 'edit' | 'add';
	onHandleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}
const InputTextArea = ({vibeMessage, vibeType, mode, onHandleChange}: InputCalendarProps) => {
	
	const maxLength = 140;
	const warnThreshold = Math.floor(maxLength * 0.7);
	const dangerThreshold = Math.floor(maxLength * 0.95);
	
	return(
		<>
			{mode === 'view' ? (
				<div className={cn(
					'w-full resize-none text-3xl font-bold bg-transparent',
					// vibeStyles?.text
				)}>
					{vibeMessage}
				</div>
			) : (
				<>
					<textarea
						name="message"
						placeholder="Today felt like..."
						value={vibeMessage}
						onChange={onHandleChange}
						maxLength={maxLength}
						className={cn(
							'w-full resize-none text-2xl font-bold bg-transparent border-b',
							// vibeStyles?.text,
							// vibeStyles?.ring,
							'focus:outline-none',
							// vibeStyles?.borderBottom,
							// vibeStyles?.placeholder,
						)}
						rows={3}
					/>
						<div
							className={cn(
								'inline-block p-1 rounded-full text-xs font-mono bg-white',
								vibeMessage.length >= dangerThreshold
									? 'text-red-500'
									: vibeMessage.length >= warnThreshold
										? 'text-yellow-500'
										: 'text-green-500'
							)}
						>
							{vibeMessage.length} / {maxLength}
						</div>
					</>
			)}
		</>
	)
}

export default InputTextArea;