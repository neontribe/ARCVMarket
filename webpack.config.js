/* "Copyright © 2017, Alexandra Rose Charity (reg. in England and Wales, #00279157)" */
var path = require('path');
var webpack = require('webpack');
var GitRevisionPlugin = require('git-revision-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var OfflinePlugin = require('offline-plugin');

var gitRevisionPlugin = new GitRevisionPlugin();

module.exports = {
    entry: ['babel-polyfill','./src/main.js'],
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: 'build.js?[hash]'
    },
    plugins: [
        new webpack.DefinePlugin({
            'VERSION': JSON.stringify(gitRevisionPlugin.version()),
            'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
            'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
            'BUILDDATE': JSON.stringify(new Date()),
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            favicon: 'src/assets/favicon.ico',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: false,
                removeAttributeQuotes: true
            }
        }),
        new webpack.BannerPlugin({
            banner: "Copyright (c) 2020, Alexandra Rose Charity (reg. in England and Wales, #00279157)",
        }),
        new OfflinePlugin({
        })
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: './fonts/[name].[ext]?[hash]'
                }
            },
            {
                test: /manifest.json/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        port: 8081
    },
    performance: {
        hints: false
    },

    devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'VERSION': JSON.stringify(gitRevisionPlugin.version()),
            'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
            'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
            'BUILDDATE': JSON.stringify(new Date()),
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/assets',
                to: '[name].[ext]?[hash]'
            },
        ])
    ])
}
