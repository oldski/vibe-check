import type { ReactNode } from 'react';

type ProfileLayoutProps = {
	children: ReactNode;
	params: Promise<{ handle: string }>;
}

const VibeProfileLayout = async ({ children, params }: ProfileLayoutProps) => {
	const { handle } = await params;

	return <>{children}</>;
}

export default VibeProfileLayout;
