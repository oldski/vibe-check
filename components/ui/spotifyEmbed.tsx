import {getSpotifyTrackId} from "@/lib/getSpotifyTrackId";

type SpotifyEmbedProps = {
	vibeAudio: string;
}

const SpotifyEmbed = ({vibeAudio}: SpotifyEmbedProps) => {
	
	return(
		<>
			{vibeAudio && getSpotifyTrackId(vibeAudio) && (
				<iframe
					src={`https://open.spotify.com/embed/track/${getSpotifyTrackId(vibeAudio)}`}
					width="100%"
					height="80"
					className="rounded-3xl shadow"
					frameBorder="0"
					allow="encrypted-media"
				/>
			)}
		</>
	)
}

export default SpotifyEmbed;