'use client';
import {format} from "date-fns";
import {parseLocalDate} from "@/lib/date-utiles";
import {Calendar} from "lucide-react";
import {cn} from "@/lib/utils";
import {useRef} from "react";

type InputCalendarProps = {
	vibeDate: string;
	vibeType?: string;
	mode: 'view' | 'edit' | 'add';
	onHandleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}
const InputCalendar = ({vibeDate, vibeType, mode, onHandleChange}: InputCalendarProps) => {
	const dateInputRef = useRef<HTMLInputElement>(null);
	const today = format(new Date(), 'yyyy-MM-dd');
	
	return(
		<div className={cn('flex items-center justify-end gap-2 text-lg md:text-2xl font-bold text-right')}>
			<span>{format(parseLocalDate(vibeDate), 'MM/dd/yyyy')}</span>
			{mode === 'view' ? (
				<Calendar className={cn(
					vibeType,
					// vibeStyles?.text
				)} />
			) : (
				<button
					type="button"
					onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus()}
					className={cn(
						'hover:opacity-70',
						vibeType,
						// vibeStyles?.text
					)}
				>
					<Calendar />
				</button>
			)}
			
			<input
				type="date"
				ref={dateInputRef}
				name="vibe_date"
				value={vibeDate}
				onChange={onHandleChange}
				max={today}
				className="sr-only"
			/>
			
			{/*<input*/}
			{/*	type="date"*/}
			{/*	ref={dateInputRef}*/}
			{/*	name="vibe_date"*/}
			{/*	value={vibeDate}*/}
			{/*	onChange={onHandleChange}*/}
			{/*	max={today}*/}
			{/*	className="sr-only"*/}
			{/*/>*/}
		</div>
	)
}

export default InputCalendar;