const path = require('path');
module.exports = {
    entry: "./src/js/app.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'public'),
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['*', '.js']
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',

                    //Scss loader
                    'sass-loader'
                ],
            },
        ]
    }
}
