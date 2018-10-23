let webbpack = require('webpack');
let path = require('path');
let inProduction = (process.env.NODE_ENV === 'production');

module.exports = {

    entry: {
        app: [
            './src/javascripts/app.ts',
        ]
    },

    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },

    output: {
        path: path.resolve(__dirname, "./public/javascripts/bundle"),
        filename: 'main.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },

            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },

    plugins: [
        new webbpack.LoaderOptionsPlugin({
            minimize: inProduction
        })
    ]
};