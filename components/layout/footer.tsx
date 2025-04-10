import {ThemeSwitcher} from "@/components/theme-switcher";
import SupabaseLogo from "@/components/supabase-logo";
import NextLogo from "@/components/next-logo";

const Footer = () => {
	return(
		<footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
			<p>
				Powered by{" "}
				<a
					href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
					target="_blank"
					className="font-bold hover:underline"
					rel="noreferrer"
				>
					Supabase
				</a>
			</p>
			<a
				href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
				target="_blank"
				rel="noreferrer"
			>
				<SupabaseLogo />
			</a>
			<span className="border-l rotate-45 h-6" />
			<a href="https://nextjs.org/" target="_blank" rel="noreferrer">
				<NextLogo />
			</a>
			<ThemeSwitcher />
		</footer>
	)
}

export default Footer;