
export const  getSpotifyTrackId = (url: string) => {
	const match = url.match(/track\/([a-zA-Z0-9]+)/);
	return match ? match[1] : null;
}