import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import HeaderNav from "./headerNav";
import HeaderClient from "./headerClient";

const Header = () => {
	return (
		<HeaderClient>
			{hasEnvVars ? <HeaderNav /> : null}
		</HeaderClient>
	);
};

export default Header;
