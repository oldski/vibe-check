'use client';
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const vibes = [
	{ id: "happy", label: "Happy", color: "#FBBF24" },
	{ id: "sad", label: "Sad", color: "#60A5FA" },
	{ id: "angry", label: "Angry", color: "#F87171" },
	{ id: "chill", label: "Chill", color: "#34D399" },
	{ id: "anxious", label: "Anxious", color: "#A78BFA" },
	{ id: "excited", label: "Excited", color: "#F472B6" },
	{ id: "moody", label: "Moody", color: "#6B7280" },
	{ id: "focused", label: "Focused", color: "#10B981" },
	{ id: "tired", label: "Tired", color: "#9CA3AF" },
	{ id: "grateful", label: "Grateful", color: "#FACC15" },
	{ id: "romantic", label: "Romantic", color: "#FB7185" },
	{ id: "nostalgic", label: "Nostalgic", color: "#FCD34D" },
	{ id: "creative", label: "Creative", color: "#A3E635" },
	{ id: "inspired", label: "Inspired", color: "#7C3AED" },
	{ id: "lonely", label: "Lonely", color: "#C084FC" },
];

export default function Sandbox() {
	const [selected, setSelected] = useState("happy");
	const containerRef = useRef<HTMLDivElement>(null);
	
	useEffect(() => {
		const handleScroll = () => {
			if (!containerRef.current) return;
			
			const container = containerRef.current;
			const containerRect = container.getBoundingClientRect();
			const containerCenter = containerRect.top + containerRect.height / 2;
			
			const items = Array.from(container.querySelectorAll("[data-id]"));
			
			let closestId = selected;
			let minDistance = Infinity;
			
			items.forEach((item) => {
				const rect = item.getBoundingClientRect();
				const itemCenter = rect.top + rect.height / 2;
				const distance = Math.abs(itemCenter - containerCenter);
				
				if (distance < minDistance) {
					minDistance = distance;
					const id = item.getAttribute("data-id");
					if (id) closestId = id;
				}
			});
			
			setSelected(closestId);
		};
		
		const container = containerRef.current;
		container?.addEventListener("scroll", handleScroll);
		
		handleScroll();
		
		return () => {
			container?.removeEventListener("scroll", handleScroll);
		};
	}, [selected]);
	
	const scrollToVibe = (id: string) => {
		const container = containerRef.current;
		if (!container) return;
		
		const target = container.querySelector(`[data-id="${id}"]`) as HTMLElement;
		if (target) {
			const containerRect = container.getBoundingClientRect();
			const containerCenter = containerRect.top + containerRect.height / 2;
			const targetRect = target.getBoundingClientRect();
			const targetCenter = targetRect.top + targetRect.height / 2;
			const offset = targetCenter - containerCenter;
			
			container.scrollBy({ top: offset, behavior: 'smooth' });
		}
	};
	
	return (
		<div className="relative h-80 w-full">
			<div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white via-transparent to-white z-10" />
			<div
				className="relative h-full w-full overflow-y-scroll scrollbar-hide snap-y snap-mandatory scroll-smooth"
				ref={containerRef}
			>
				<div className="flex flex-col items-start py-20 gap-4">
					{vibes.map((vibe) => {
						const isSelected = selected === vibe.id;
						return (
							<div
								key={vibe.id}
								data-id={vibe.id}
								className={clsx(
									"snap-center h-20 flex items-center px-8",
									isSelected ? "text-black font-bold" : "text-gray-400"
								)}
							>
								<button
									onClick={() => scrollToVibe(vibe.id)}
									className="w-full text-2xl focus:outline-none"
								>
									{vibe.label}
								</button>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}



