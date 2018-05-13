const { resolve } = require('path');
const root = (...args) => resolve(__dirname, ...args);

module.exports = {

    entry: root('src/native/main'),

    output: {
        path: root('dist'),
        filename: 'app.js'
    },

    target: 'electron-main',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-class-properties']
                    }
                },
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.css', '.json']
    },

    node: {
        __dirname: false
    }

};