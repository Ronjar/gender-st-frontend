const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
		  animation: {
			bling: 'pulse 1s ease-in-out',
			typewriter: 'typewriter 2s steps(11) forwards',
		  },
		  keyframes: {
			typewriter: {
			  to: {
				left: "100%"
			  }
			}
		  }
		},
	  },

	plugins: [require('daisyui')]
};

module.exports = config;