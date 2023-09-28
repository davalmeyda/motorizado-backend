module.exports = {
	apps: [
		{
			watch: true,
			name: 'Courier App',
			script: 'node main.js',
			ignore_watch: ['node_modules', 'dist', 'temp', 'public'],
		},
	],
};
