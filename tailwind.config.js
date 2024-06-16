const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			animation: {
				bling: 'pulse 1s ease-in-out',
				unlock: 'unlock 0.5s ease-in-out',
				typewriter: 'typewriter 1s steps(11) forwards',
				flyinbottom: 'flyinbottom 0.1s ease-out'
			},
			keyframes: {
				typewriter: {
					to: {
						left: "100%"
					}
				},
				unlock: {
					'0%': {
						transform: 'scale(5) rotate(30deg)',
						opacity: '0',
					},
					'50%': {
						transform: 'scale(0.8) rotate(0deg)',
						opacity: '0.5',
					},
					'100%': {
						transform: 'scale(1) rotate(0deg)',
						opacity: '1',
					},
				},
				flyinbottom: {
					'0%': {
						transform: 'translateY(100%)',
						opacity: '0.5',
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1',
					},
				},
			}
		},
	},

	plugins: [require('daisyui')]
};

module.exports = config;