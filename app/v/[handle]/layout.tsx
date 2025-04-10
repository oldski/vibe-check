import type { ReactNode } from 'react';
import {getVibeProfile} from "@/lib/getVibeProfile";
import {getDailyVibes} from "@/lib/getDailyVibes";
import VibeGrid from "@/components/vibe/vibeGrid";
import {getVibes} from "@/lib/getVibes";
import MotionLink from "@/components/ui/motionLink";
import {SmilePlus} from "lucide-react";

type profileLayoutProps = {
	children: ReactNode;
	params: {
		handle: string;
	}
}

const VibeProfileLayout = async ({ children, params }: profileLayoutProps) => {
	
	const profile = await getVibeProfile(params.handle);
	if(!profile) return null;
	
	const dailyVibes = await getDailyVibes(profile.id);
	const vibes = await getVibes();
	
	return (
		<>
			<MotionLink
				href={`/v/${profile.handle}/add`}
				className={"fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-zinc-800 transition"}
			>
				<SmilePlus />
			</MotionLink>
			<VibeGrid dailyVibes={dailyVibes} vibes={vibes} handle={params.handle} profile={profile} />
			{children}
		</>
	);
}

export default VibeProfileLayout;