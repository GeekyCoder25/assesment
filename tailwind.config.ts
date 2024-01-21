import type {Config} from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {},
			colors: {
				primary: '#cb2449',
				background: 'var(--background)',
			},
		},
		fontFamily: {
			kanit: ['Kanit'],
			inter: ['Inter, sans-serif'],
		},
	},
	plugins: [],
};
export default config;
