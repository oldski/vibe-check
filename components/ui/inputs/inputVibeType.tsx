import {motion} from "framer-motion";
import {Vibe, VibeFormState} from "@/lib/types";
import {cn} from "@/lib/utils";
import {Dispatch, SetStateAction} from "react";

type vibeTypesProps = {
	vibeType?: number | null;
	vibes: Vibe[];
	mode: 'view' | 'edit' | 'add';
	onSetForm: Dispatch<SetStateAction<VibeFormState>>;
}

const InputVibeType = ({vibeType, vibes, mode, onSetForm}: vibeTypesProps) => {
	return(
		<div className="flex flex-wrap gap-2">
			{vibes.map((v) => {
				const isSelected = vibeType === v.id;
				// const isActiveStyle = isSelected ? vibeStyles : undefined;
				
				return (
					<motion.button
						key={v.id}
						type="button"
						onClick={() => onSetForm((prev) => ({ ...prev, vibe: v.id }))}
						className={cn(
							'px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase',
							// v.vibe_type === vibeType ? vibeStyles?.ring : vibeStyles?.vibeButton,
						)}
						whileTap={{ scale: 0.95 }}
						whileHover={{ scale: 1.07, boxShadow: '0 0 0 2px rgba(0,0,0,0.1)' }}
					>
						{v.vibe_type}
					</motion.button>
				);
			})}
		</div>
	)
}

export default InputVibeType;