import {Vibe} from "@/lib/types";
import {ReactNode} from "react";
import VibeBackground from "@/components/ui/vibeBackground";

type HeroProps = {
	vibes: Vibe[],
	children: ReactNode
}

const Hero = ({ vibes, children }: HeroProps) => {
	return (
		<div className="flex flex-col justify-center items-center relative w-full h-screen overflow-hidden">
			{children}
			<VibeBackground vibes={vibes} />
		</div>
	);
};

export default Hero;
