const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const webpack = require("webpack");
const autoprefixer = require('autoprefixer');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log('isDev: ', isDev);

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: "all"
		}
	};
	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssetsWebpackPlugin(),
			new TerserWebpackPlugin()
		]
	}
	return config
};

const fileName = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				hmr: isDev,
				reloadAll: true
			}
		},
		'css-loader',
		'postcss-loader'
	];
	if (extra) {
		loaders.push(extra)
	}
	return loaders
};

const babelOptions = presets => {
	const options = {
		presets: [
			'@babel/preset-env'
		],
		plugins: [
			'@babel/plugin-proposal-class-properties'
		],
	};
	if (presets) {
		options.presets.push(presets)
	}
	return options
};

const jsLoaders = () => {
	const loaders = [{
		loader: 'babel-loader',
		options: babelOptions()
	}];

	if(isDev) {
		loaders.push('eslint-loader')
	}
	return loaders
};

const plugins = () => {
	const base = [
		new HTMLWebpackPlugin({
			template: './index.html',
			minify: {
				removeComments: isProd,
				collapseWhitespace: isProd
			}

		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'src/favicon.ico'),
				to: path.resolve(__dirname, 'dist')
			},
			{
				from: path.resolve(__dirname, 'src/img'),
				to: path.resolve(__dirname, 'dist/img')
			}
		]),
		new MiniCssExtractPlugin({
			filename: fileName('css')
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				postcss: [
					autoprefixer()
				]
			}
		})
	];

	if (isProd) {
		base.push(new BundleAnalyzerPlugin())
	}

	return base
};

module.exports = {
	context: path.join(__dirname, 'src'),
	mode: "development",
	entry: {
		main: ['@babel/polyfill', './js/index.js']
	},
	resolve: {
		extensions: ['.js', '.json'],
		alias: {
			'@' : path.join(__dirname, 'src')
		}
	},
	output: {
		filename: fileName('js'),
		path: path.resolve(__dirname, 'dist')
	},
	optimization: optimization(),
	devServer: {
		port: 4200,
		hot: isDev
	},
	devtool: isDev ? 'source-map' : '',
	plugins: plugins(),
	module: {
		rules: [
			{
				test: /\.css$/,
				use: cssLoaders()
			},
			{
				test: /\.less$/,
				use: cssLoaders('less-loader')
			},
			{
				test: /\.s[ac]ss$/,
				use: cssLoaders('sass-loader')
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: ['file-loader']
			},
			{
				test: /\.(ttf|woff|woff2|eot)$/,
				use: ['file-loader']
			},
			{
				test: /\.xml$/,
				use: ['xml-loader']
			},
			{
				test: /\.csv$/,
				use: ['csv-loader']
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: jsLoaders()
			}
		]
	}
};