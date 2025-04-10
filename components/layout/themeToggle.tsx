'use client';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {FaMoon, FaSun} from "react-icons/fa6";

const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	
	useEffect(() => setMounted(true), []);
	
	if(!mounted) return null;
	
	return (
		<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded border">
			{theme === 'light' ? <FaSun /> : <FaMoon /> }
		</button>
	)
}

export default ThemeToggle;