const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    entry: {
        block: './src/block/index.js',
    },
    output: {
        path: __dirname + '/build',
        filename: '[name].js',
    },
};