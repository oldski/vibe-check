import { getVibeProfile } from "@/lib/getVibeProfile";
import { getSupabaseServerClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { getDailyVibe } from "@/lib/getDailyVibe";
import { getVibes } from "@/lib/getVibes";
import VibePageLayout from "@/components/vibe/vibePageLayout";
import { Metadata } from "next";

type PageProps = {
	params: Promise<{ handle: string; vibeId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { handle, vibeId } = await params;

	const profile = await getVibeProfile(handle);
	const dailyVibe = await getDailyVibe(vibeId);

	if (!profile || !dailyVibe) {
		return {
			title: 'Vibe Not Found | Vibe Check',
		};
	}

	const vibeType = dailyVibe.vibe?.vibe_type ?? 'Vibe';
	const message = dailyVibe.message;
	const truncatedMessage = message.length > 100 ? message.slice(0, 100) + '...' : message;
	const displayName = profile.display_name || handle;

	return {
		title: `${vibeType} | ${displayName}'s Vibe Check`,
		description: truncatedMessage,
		openGraph: {
			title: `${vibeType} | Vibe Check`,
			description: truncatedMessage,
			type: 'article',
			images: dailyVibe.media ? [{ url: dailyVibe.media }] : undefined,
		},
		twitter: {
			card: dailyVibe.media ? 'summary_large_image' : 'summary',
			title: `${vibeType} | Vibe Check`,
			description: truncatedMessage,
			images: dailyVibe.media ? [dailyVibe.media] : undefined,
		},
	};
}

const VibePage = async ({ params }: PageProps) => {
	const { handle, vibeId } = await params;

	const supabase = await getSupabaseServerClient();
	const { data: { user } } = await supabase.auth.getUser();

	const profile = await getVibeProfile(handle);
	if (!profile) notFound();

	const dailyVibe = await getDailyVibe(vibeId);
	if (!dailyVibe) notFound();

	const vibes = await getVibes();

	return (
		<VibePageLayout
			key={dailyVibe.id}
			vibes={vibes}
			selectedVibe={dailyVibe}
			userId={user?.id ?? ''}
			handle={handle}
			mode="view"
		/>
	);
};

export default VibePage;
