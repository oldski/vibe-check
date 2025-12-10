import { getVibeProfile } from "@/lib/getVibeProfile";
import { notFound } from "next/navigation";
import { getDailyVibes } from "@/lib/getDailyVibes";
import { getVibes } from "@/lib/getVibes";
import VibeGrid from "@/components/vibe/vibeGrid";
import MotionLink from "@/components/ui/motionLink";
import { SmilePlus } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase";

type PageProps = {
	params: Promise<{ handle: string }>;
};

const VibeProfilePage = async ({ params }: PageProps) => {
	const { handle } = await params;

	const supabase = await getSupabaseServerClient();
	const { data: { user } } = await supabase.auth.getUser();

	const profile = await getVibeProfile(handle);
	if (!profile) notFound();

	const dailyVibes = await getDailyVibes(profile.id);
	const vibes = await getVibes();
	const isOwner = user?.id === profile.id;

	return (
		<>
			{isOwner && (
				<MotionLink
					href={`/v/${profile.handle}/add`}
					className="fixed bottom-20 right-6 z-40 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-zinc-800 transition"
				>
					<SmilePlus />
				</MotionLink>
			)}
			<VibeGrid
				dailyVibes={dailyVibes}
				vibes={vibes}
				handle={handle}
				profile={profile}
			/>
		</>
	);
}

export default VibeProfilePage;
