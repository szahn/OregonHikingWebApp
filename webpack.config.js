const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const common = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}

module.exports = {
    entry: [ './src/index.jsx'],
    output: {
        path: path.join(__dirname, 'wwwroot'),
        publicPath: '/',
        filename: 'app.js'
    },
    plugins: [

    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }
        ]
    }
};