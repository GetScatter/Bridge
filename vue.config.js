const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
// 	.BundleAnalyzerPlugin;

// const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
// const rm = require('rimraf');
// const TerserPlugin = require('terser-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin')
//
// const assetsPath = (_path) => {
// 	const assetsSubDirectory = 'static';
// 	return path.posix.join(assetsSubDirectory, _path)
// }

const base = {
	css:{extract:false},
	// publicPath: process.env.NODE_ENV === 'production' ? '/static/' : '/',
	assetsDir:'static',
	filenameHashing:false,

	chainWebpack: config => {
		config.plugin('html')
			.tap(args => {
				args[0].template = path.join(__dirname, 'index.html');
				console.log(args);
				return args;
			})

		config
			.plugin('copy')
			.tap(args => {
				// Changing default copy path to dist/static
				args[0][0].to += `${path.sep}static`;
				return args;
			});
	}
}

if(process.env.NODE_ENV === 'production'){
	module.exports = Object.assign(base, {
		productionSourceMap: false,

		configureWebpack:{
			output: {
				filename: '[name].bundle.js',
				chunkFilename: '[name].bundle.js',
			},
			plugins:[
				new WebpackShellPlugin({
					// onBuildStart:['node scripts/pre-pack'],
					onBuildEnd:['node scripts/post-pack']
				}),
			]
		},
	})
} else {
	module.exports = Object.assign(base, {
		runtimeCompiler:true,
	})
}

