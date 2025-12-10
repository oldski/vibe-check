import PageTransition from '@/components/ui/pageTransition';

export default function Template({ children }: { children: React.ReactNode }) {
	return <PageTransition>{children}</PageTransition>;
}
