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

module.exports = {
	productionSourceMap: false,
	runtimeCompiler:true,
	// configureWebpack: {
	// 	plugins: [new BundleAnalyzerPlugin()]
	// }

	css:{extract:false},

	/*
	-- plugins
	[
	  'vue-loader',
	  'define',
	  'case-sensitive-paths',
	  'friendly-errors',
	  'hmr',
	  'progress',
	  'html',
	  'preload',
	  'prefetch',
	  'copy'
	]
	 */
	// publicPath: process.env.NODE_ENV === 'production' ? '/static/' : '/',
	assetsDir:'static',
	filenameHashing:false,
	// indexPath:'index.html',

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

	chainWebpack: config => {
		console.log('config.output.filename', config.output.filename);

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

		// Moving js files from `dist/static/js` to `dist`
		// config.module
		// 	.rule('bundlejs')
		// 	.test(/\.js$/)
		// 	.use('url-loader')
		// 	.loader('url-loader')
		// 	.options({
		// 		name:`[name].bundle.js`
		// 	}).tap(args => {
		// 	// Changing default copy path to dist/static
		// 		console.log('options', args);
		// 	return args;
		// 	})
		// 	.end();
	}

	// configureWebpack: {
	// 	entry : "./src/main.js",
	// 	//devtool: 'source-map',
	// 	resolve: {
	// 		extensions: ['.js', '.vue', '.json'],
	// 		modules: ['node_modules'],
	// 		alias: {
	// 			'vue$': 'vue/dist/vue.esm.js'
	// 		}
	// 	},
	// 	output: {
	// 		filename: '[name].bundle.js',
	// 		chunkFilename: '[name].bundle.js',
	// 	},
	//
	// 	module: {
	// 		rules: [
	// 			{
	// 				test: /\.vue$/,
	// 				exclude: /node_modules/,
	// 				use: 'vue-loader'
	// 			}, {
	// 				test: /\.js$/,
	// 				exclude: /node_modules/,
	// 				include: path.resolve(__dirname, 'src'),
	// 				use: {
	// 					loader: 'babel-loader',
	// 				}
	// 			}, {
	// 				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
	// 				exclude: /node_modules/,
	// 				include: path.resolve(__dirname, 'src'),
	// 				use: {
	// 					loader: 'url-loader',
	// 					options: {
	// 						limit: 10000,
	// 						name: utils.assetsPath('media/[name].[ext]')
	// 					}
	// 				}
	// 			}, {
	// 				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
	// 				use: {
	// 					loader: 'url-loader',
	// 					options: {
	// 						limit: 10000,
	// 						name: utils.assetsPath('img/[name].[ext]')
	// 					}
	// 				}
	// 			}, {
	// 				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
	// 				use: {
	// 					loader: 'url-loader',
	// 					options: {
	// 						limit: 10000,
	// 						name: utils.assetsPath('fonts/[name].[ext]')
	// 					}
	// 				}
	// 			},
	// 			{
	// 				test: /\.scss$/,
	// 				exclude: /node_modules/,
	// 				use: [
	// 					'vue-style-loader',
	// 					'css-loader',
	// 					'sass-loader'
	// 				]
	// 			}
	// 		]
	// 	},
	// 	plugins:[
	// 		new WebpackShellPlugin({
	// 			// onBuildStart:['node scripts/pre-pack'],
	// 			onBuildEnd:['node scripts/post-pack']
	// 		}),
	// 		new CopyWebpackPlugin([{
	// 			from: utils.resolve('static'),
	// 			to: utils.resolve('dist/static'),
	// 			toType: 'dir'
	// 		}]),
	// 	]
	// }
}
