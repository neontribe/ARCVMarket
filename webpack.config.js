/* "Copyright © 2023, Alexandra Rose Charity (reg. in England and Wales, #00279157)" */
const path = require("path");
const webpack = require("webpack");
const { SourceMapDevToolPlugin } = require("webpack");
const { GitRevisionPlugin } = require("git-revision-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OfflinePlugin = require("@lcdp/offline-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const gitRevisionPlugin = new GitRevisionPlugin();
const now = new Date();

require("dotenv").config();
const API_BASE = process.env.API_BASE || "http://arcv-service.test/api";
const USE_MOCKS = process.env.USE_MOCKS || false;

module.exports = {
    mode: "none",
    entry: ["./src/main.js"],
    target: ["web", "es5"],
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/",
        filename: "build.js?[contenthash]"
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(gitRevisionPlugin.version()),
            COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
            BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
            BUILDDATE: JSON.stringify(now)
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "index.html",
            favicon: "src/assets/favicon.ico",
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: false,
                removeAttributeQuotes: true
            }
        }),
        new webpack.BannerPlugin({
            banner: "Copyright (c) 2023, Alexandra Rose Charity (reg. in England and Wales, #00279157)"
        }),
        new OfflinePlugin({
            autoUpdate: 1000 * 60 * 60 * 48,
            ServiceWorker: {
                events: true
            }
        }),
        new WebpackPwaManifest({
            name: "Rosie - Rose Voucher Records & Reimbursement",
            short_name: "Rosie",
            display_name: "Rosie - Rose Voucher Records & Reimbursement",
            description: "Record your Rose Vouchers.",
            lang: "en",
            dir: "ltr",
            theme_color: "#a74e94",
            background_color: "#fff",
            orientation: "natural",
            scope: "/",
            icons: [
                {
                    src: path.resolve("src/assets/launcher-48x48.png"),
                    size: "48x48"
                },
                {
                    src: path.resolve("src/assets/launcher-96x96.png"),
                    size: "96x96"
                },
                {
                    src: path.resolve("src/assets/launcher-144x144.png"),
                    size: "144x144"
                },
                {
                    src: path.resolve("src/assets/launcher-192x192.png"),
                    size: "192x192"
                },
                {
                    src: path.resolve("src/assets/icon.svg"),
                    size: "193x193"
                },
                {
                    src: path.resolve("src/assets/launcher-512x512.png"),
                    size: "512x512"
                }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "vue-style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            esModule: false
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            sassOptions: {
                                quietDeps: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]?[contenthash]",
                        esModule: false // https://github.com/webpack-contrib/file-loader#esmodule
                    }
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "./fonts/[name].[ext]?[contenthash]"
                    }
                }
            },
            {
                test: /\.(m|c)?js$/,
                enforce: "pre",
                use: ["source-map-loader"]
            }
        ]
    },
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js"
        }
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        open: true,
        port: 8081
    },
    infrastructureLogging: {
        level: "info"
    },
    performance: {
        hints: false
    }
};

if (process.env.NODE_ENV === "development") {
    module.exports.mode = "development";
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(gitRevisionPlugin.version()),
            COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
            BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
            BUILDDATE: JSON.stringify(now),
            "process.env": {
                NODE_ENV: "\"development\"",
                API_BASE: JSON.stringify(API_BASE),
                USE_MOCKS: JSON.stringify(USE_MOCKS)
            }
        }),
        new SourceMapDevToolPlugin({
            filename: "[file].map",
        })
    ]);
}

if (process.env.NODE_ENV === "production") {
    module.exports.mode = "production";
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(gitRevisionPlugin.version()),
            COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
            BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
            BUILDDATE: JSON.stringify(now),
            "process.env": {
                NODE_ENV: "\"production\""
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "src/assets",
                    to: "[name].[contenthash][ext]"
                }
            ]
        })
    ]);
}
