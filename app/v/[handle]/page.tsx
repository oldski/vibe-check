import { getVibeProfile } from "@/lib/getVibeProfile";
import { notFound } from "next/navigation";
import { getDailyVibes } from "@/lib/getDailyVibes";
import { getVibes } from "@/lib/getVibes";
import VibeGrid from "@/components/vibe/vibeGrid";
import VibeProfileClient from "@/components/vibe/vibeProfileClient";
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
		<VibeProfileClient
			initialVibes={dailyVibes}
			vibeTypes={vibes}
			handle={handle}
			profile={profile}
			userId={user?.id}
		>
			{isOwner && (
				<MotionLink
					href={`/v/${profile.handle}/add`}
					className="fixed bottom-20 right-6 z-40 bg-black text-white p-4 rounded-full shadow-lg hover:bg-zinc-800 transition flex items-center justify-center"
				>
					<SmilePlus className="size-6" />
				</MotionLink>
			)}
			<VibeGrid
				vibes={vibes}
				handle={handle}
				profile={profile}
				initialVibes={dailyVibes}
			/>
		</VibeProfileClient>
	);
}

export default VibeProfilePage;
