var path = require('path');
module.exports = {
	entry: './src/ViewPager.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'index.js',
		libraryTarget: 'commonjs2',
	},
	module: {
		rules: [{
			test: /.js$/,
			include: path.resolve(__dirname, 'src'),
			exclude: /(node_modules|build)/,
			use: 'babel-loader',
		}, {
			test: /.css$/,
			use: ['style-loader', 'css-loader'],
		}],
	},
	externals: {
		'react': 'commonjs react',
	},
};