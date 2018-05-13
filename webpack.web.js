const { resolve } = require('path');
const root = (...args) => resolve(__dirname, ...args);

module.exports = {

    entry: root('src/web/index'),

    output: {
        path: root('dist'),
        filename: 'bundle.js'
    },

    target: 'electron-renderer',

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader?modules=1'
                ]
            },
            {
                test: /\.(bmp|png|jpe?g|svg|eot|woff2?|ttf)/,
                loader: 'file-loader'
            }
        ]
    },

    resolve: {
        extensions: ['.jsx', '.js', '.css', '.json']
    }

};