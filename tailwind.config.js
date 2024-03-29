module.exports = {
	mode: 'jit',
	purge: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				'accent-1': '#FAFAFA',
				'accent-2': '#EAEAEA',
				'accent-7': '#333',
				success: '#0070f3',
				cyan: '#79FFE1',
			},
			spacing: {
				28: '7rem',
			},
			letterSpacing: {
				tighter: '-.04em',
			},
			lineHeight: {
				tight: 1.2,
			},
			fontSize: {
				'5xl': '2.5rem',
				'6xl': '2.75rem',
				'7xl': '4.5rem',
				'8xl': '6.25rem',
			},
			boxShadow: {
				small: '0 5px 10px rgba(0, 0, 0, 0.12)',
				medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
			},
			minHeight: {
				'screen-75': '75vh',
				'screen-45': '45vh',
				'screen-25': '25vh',
				'screen-60': '60vh',
			},
			fontSize: {
				55: '55rem',
			},
			opacity: {
				80: '.8',
			},
			zIndex: {
				2: 2,
				3: 3,
			},
			inset: {
				'-100': '-100%',
				'-225-px': '-225px',
				'-160-px': '-160px',
				'-150-px': '-150px',
				'-94-px': '-94px',
				'-50-px': '-50px',
				'-29-px': '-29px',
				'-20-px': '-20px',
				'25-px': '25px',
				'40-px': '40px',
				'95-px': '95px',
				'145-px': '145px',
				'195-px': '195px',
				'210-px': '210px',
				'260-px': '260px',
			},
			height: {
				'95-px': '95px',
				'70-px': '70px',
				'350-px': '350px',
				'500-px': '500px',
				'600-px': '600px',
			},
			maxHeight: {
				'860-px': '860px',
			},
			maxWidth: {
				'100-px': '100px',
				'120-px': '120px',
				'150-px': '150px',
				'180-px': '180px',
				'200-px': '200px',
				'210-px': '210px',
				'580-px': '580px',
			},
			minWidth: {
				'140-px': '140px',
				48: '12rem',
			},
			backgroundSize: {
				full: '100%',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/aspect-ratio'),],
};
