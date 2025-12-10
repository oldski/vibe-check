'use client';

import { Button } from '@/components/ui/button';
import { Music, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

type Connection = {
	id: string;
	name: string;
	icon: React.ReactNode;
	connected: boolean;
	description: string;
	comingSoon?: boolean;
};

const connections: Connection[] = [
	{
		id: 'spotify',
		name: 'Spotify',
		icon: (
			<svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
			</svg>
		),
		connected: false,
		description: 'Add songs to your vibes and get music recommendations',
	},
	{
		id: 'youtube-music',
		name: 'YouTube Music',
		icon: (
			<svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
			</svg>
		),
		connected: false,
		description: 'Connect your YouTube Music library',
		comingSoon: true,
	},
	{
		id: 'apple-music',
		name: 'Apple Music',
		icon: (
			<svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
				<path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.401-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.8-.228-2.403-.96-.63-.767-.706-1.787-.182-2.622.58-.925 1.613-1.378 2.714-1.19.373.063.733.18 1.096.273.186.048.262-.014.3-.186.04-.177.054-.358.054-.54V7.97c0-.023-.002-.047-.003-.07a.315.315 0 00-.257-.287c-.157-.036-.316-.065-.476-.093-.6-.107-1.2-.213-1.8-.32l-3.166-.563-1.067-.19c-.135-.023-.27-.033-.406-.026-.24.013-.377.143-.416.38-.01.063-.014.128-.014.192V16.56c0 .347-.028.69-.13 1.027-.26.863-.888 1.394-1.72 1.64-.418.124-.847.17-1.28.175-.9.01-1.7-.203-2.318-.847-.774-.808-.9-1.827-.398-2.77.472-.888 1.31-1.334 2.27-1.406.405-.03.808.006 1.207.082.226.043.45.1.668.167.14.043.2.003.232-.137a.66.66 0 00.02-.16V6.142c0-.16.022-.32.076-.472.12-.337.373-.503.714-.537.17-.017.342.005.51.034l5.14.915 2.63.468.628.11c.022.003.043.013.063.02z"/>
			</svg>
		),
		connected: false,
		description: 'Connect your Apple Music library',
		comingSoon: true,
	},
];

type BackstageConnectionsProps = {
	spotifyConnected?: boolean;
};

export default function BackstageConnections({ spotifyConnected = false }: BackstageConnectionsProps) {
	const handleConnect = (connectionId: string) => {
		if (connectionId === 'spotify') {
			// TODO: Implement Spotify OAuth flow
			console.log('Connect to Spotify');
		}
	};

	const handleDisconnect = (connectionId: string) => {
		if (connectionId === 'spotify') {
			// TODO: Implement Spotify disconnect
			console.log('Disconnect from Spotify');
		}
	};

	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold">Connected Services</h2>

			<div className="space-y-3">
				{connections.map((connection) => {
					const isConnected = connection.id === 'spotify' ? spotifyConnected : connection.connected;

					return (
						<div
							key={connection.id}
							className={cn(
								"bg-card border rounded-xl p-4 flex items-center gap-4",
								connection.comingSoon && "opacity-60"
							)}
						>
							{/* Icon */}
							<div className={cn(
								"size-12 rounded-xl flex items-center justify-center shrink-0",
								connection.id === 'spotify' && "bg-[#1DB954]/10 text-[#1DB954]",
								connection.id === 'youtube-music' && "bg-red-500/10 text-red-500",
								connection.id === 'apple-music' && "bg-pink-500/10 text-pink-500"
							)}>
								{connection.icon}
							</div>

							{/* Info */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<h3 className="font-medium">{connection.name}</h3>
									{isConnected && (
										<span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
											<Check className="size-3" />
											Connected
										</span>
									)}
									{connection.comingSoon && (
										<span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
											Coming Soon
										</span>
									)}
								</div>
								<p className="text-sm text-muted-foreground truncate">
									{connection.description}
								</p>
							</div>

							{/* Action */}
							{!connection.comingSoon && (
								<div className="shrink-0">
									{isConnected ? (
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDisconnect(connection.id)}
										>
											Disconnect
										</Button>
									) : (
										<Button
											size="sm"
											onClick={() => handleConnect(connection.id)}
											className="gap-2"
										>
											Connect
											<ExternalLink className="size-3" />
										</Button>
									)}
								</div>
							)}
						</div>
					);
				})}
			</div>

			<p className="text-xs text-muted-foreground">
				Connect music services to easily add songs to your vibes and get personalized recommendations.
			</p>
		</div>
	);
}
