/* "Copyright © 2020, Alexandra Rose Charity (reg. in England and Wales, #00279157)" */
var path = require('path');
var webpack = require('webpack');
var GitRevisionPlugin = require('git-revision-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var OfflinePlugin = require('offline-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var { VueLoaderPlugin } = require('vue-loader');
var WebpackPwaManifest = require('webpack-pwa-manifest');
var gitRevisionPlugin = new GitRevisionPlugin();

module.exports = {
    entry: ['@babel/polyfill','./src/main.js'],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: false,
            })
        ],
    },
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
        new VueLoaderPlugin(),
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
        new OfflinePlugin(),
        new WebpackPwaManifest({
            name : 'Rosie - Rose Voucher Records & Reimbursement',
            short_name : 'Rosie',
            display_name : 'Rosie - Rose Voucher Records & Reimbursement',
            description : 'Record your Rose Vouchers.',
            lang: 'en',
            dir: 'ltr',
            theme_color : '#a74e94',
            background_color : '#fff',
            orientation : 'natural',
            scope : '/',
            icons : [
                {
                    src: path.resolve('src/assets/launcher-48x48.png'),
                    size: '48x48',
                },
                {
                    src: path.resolve('src/assets/launcher-96x96.png'),
                    size: '96x96',
                },
                {
                    src: path.resolve('src/assets/launcher-144x144.png'),
                    size: '144x144',
                },
                {
                    src: path.resolve('src/assets/launcher-192x192.png'),
                    size: '192x192',
                },
                {
                    src: path.resolve('src/assets/icon.svg'),
                    size: '193x193',
                },
                {
                    src: path.resolve('src/assets/launcher-512x512.png'),
                    size: '512x512',
                }
            ]

        })
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]',
                        esModule: false // https://github.com/webpack-contrib/file-loader#esmodule
                    }
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: './fonts/[name].[ext]?[hash]'
                    }
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
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/assets',
                to: '[name].[ext]?[hash]'
            }
        ])
    ])
}
