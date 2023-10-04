import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    fallback: {
        path: false,
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'ts-loader',
        },
        exclude: '/node_modules/'
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader?url=false',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/images/'
          }
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Pro-Man-Tool',
      template: 'src/assets/index.html',
      favicon: 'src/assets/favicon.ico',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[name].[hash].css',
      ignoreOrder: false,
    }),
    new CopyPlugin({
       patterns: [
            { from: 'src/assets/images', to: 'assets/images' },
        ],
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    publicPath: '/'
  },
};