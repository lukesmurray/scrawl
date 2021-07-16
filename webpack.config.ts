/* eslint-disable node/no-unpublished-require */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable node/no-unpublished-import */
import path from 'path'

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import DotenvFlow from 'dotenv-flow-webpack'
import webpack from 'webpack'

const isDev = process.env.NODE_ENV !== 'production'

const srcDir = path.join(__dirname, 'src')
const outDir = path.join(__dirname, 'dist/js')

const config: webpack.Configuration = {
  watch: isDev,
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'inline-source-map' : 'source-map',
  // @ts-ignore
  devServer: {
    hot: true,
    firewall: false,
    port: 3912,
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
      watch: false,
    },
    client: {
      host: 'localhost',
    },
  },
  entry: {
    popup: path.join(srcDir, 'popup'),
    options: path.join(srcDir, 'options'),
    background: path.join(srcDir, 'background'),
    content: path.join(srcDir, 'content'),
  },
  output: {
    path: outDir,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          // auto insert react runtime
          presets: [['react-app', { runtime: 'automatic' }]],
          plugins: [isDev && require.resolve('react-refresh/babel')].filter(
            Boolean,
          ),
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': srcDir,
    },
  },
  // @ts-ignore
  plugins: [
    new CleanWebpackPlugin(),
    new DotenvFlow(),
    new webpack.EnvironmentPlugin({
      MV3_HOT_RELOAD_PORT: 7761,
    }),
    isDev &&
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
  ].filter(Boolean),
}

export default config
