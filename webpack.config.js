let webbpack = require('webpack');
let path = require('path');
let inProduction = (process.env.NODE_ENV === 'production');

module.exports = {

    entry: {
        app: [
            './public/javascripts/app.js',
        ]
    },

    output: {
        path: path.resolve(__dirname, "./public/javascripts"),
        filename: 'main.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },

    plugins: [
        new webbpack.LoaderOptionsPlugin({
            minimize: inProduction
        })
    ]
};