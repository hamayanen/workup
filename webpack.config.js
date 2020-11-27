const path = require('path');
const Dotenv = require('dotenv-webpack');
require('dotenv').config();

module.exports = {
    entry: "./src/App.js",
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },
        {
            test: /\.(jpg|png)$/,
            loader: 'url-loader'
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        }
    },
    plugins: [
        new Dotenv({ systemvars: true }),
        new Dotenv({ path: '.env' })
    ],
    mode: "development"
};