const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'src');
const OUT_DIR = path.resolve(__dirname, 'dist');

module.exports = (_, { mode }) => {
  const isProduction = mode === 'production';

  return {
    context: SRC_DIR,
    entry: './index.jsx',
    output: {
      path: OUT_DIR,
      filename: isProduction ? '[name].[contenthash:5].js': '[name].js',
    },
    resolve: {
      extensions: ['.jsx', '.js', '.json'],
      alias: {
        '@babel/runtime/helpers/esm': '@babel/runtime/helpers/',
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: [SRC_DIR],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !isProduction,
              },
            },
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('autoprefixer'),
                    ... isProduction ? [require('cssnano')] : [],
                  ],
                },
              },
            },
          ],
          include: [SRC_DIR],
        },
        {
          test: /\.(png|jpe?g|webp|gif)$/,
          loader: 'file-loader',
          options: {
            name: isProduction ? '[path][name].[contenthash:5].[ext]' : '[path][name].[ext]',
          },
          include: [SRC_DIR],
        },
        {
          test: /\.inline.svg$/,
          use: ['@svgr/webpack'],
        }
      ],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
        },
      },
    },
    plugins: [
      new HtmlPlugin({
        template: './index.html',
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash:5].css': '[name].css',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public'),
          },
        ],
      }),
    ],
    devServer: {
      hot: true,
      inline: true
    }
  };
};
