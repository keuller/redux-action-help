var webpack = require('webpack'),
    path = require('path');

    module.exports = {
        entry: {
            'redux-action-helper': path.resolve(__dirname, 'src/redux-action-helper')
        },
        resolve: {
            extensions: ['', '.js']
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].min.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: path.join(__dirname, 'node_modules'),
                    loader: 'babel-loader',
                    query: { presets: ['es2015'] }
                }
            ]
        },
        plugins:[
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': 'production'
            }),
            new webpack.optimize.UglifyJsPlugin({
                compressor: { warnings: false }
            })
        ],
        debug: false
    };
