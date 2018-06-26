const path = require('path');
const glob = require('glob');



// const uglify = require('uglifyjs-webpack-plugin');


// 打包生成zip
// const WebpackZipPlugin =require('webpack-zip-plugin')

//生成html
const HtmlWebpackPlugin = require('html-webpack-plugin');

//用来清理打包的目录
const CleanWebpackPlugin = require('clean-webpack-plugin');

//css打包相关
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpack = require('webpack');

//开发模式，方便调试
const developMode = "development"

//生产模式
// const developMode = "production"

module.exports = {
    mode: developMode,//开发模式
    //文件入口地址
    entry: {
        "js/main": './src/main.js',//key是目录名称
        // "js/lib/common": './src/js/lib/common.js'
    },
    //用来追踪哪个文件报错
    // devtool: 'inline-source-map',//没发现起作用

    //热更新
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        //用来清理打包的目录,在打包的时候启用，平时开发的时候可以关闭
        new CleanWebpackPlugin(['dist']),

        //热更新相关
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),


        //=========================

        new HtmlWebpackPlugin({
            title: '我的网页',//网页的名字，可以不用管
            filename: 'index.html',//打包生成的路径
            template: 'src/modle/index.html'//文件路径
        }),

        //抽取css
        developMode === "production" ? new MiniCssExtractPlugin({
            filename: "./css/main.css",
        }):function(){},

        //打包后生成zip
        // new WebpackZipPlugin({
        //     initialFile: 'dist',  //需要打包的文件夹(一般为dist)
        //     // endPath: path.join(__dirname,'/'),  //打包到对应目录（一般为当前目录'./'）
        //     zipName: 'test.zip' //打包生成的文件名
        // }),

        // new uglify()

    ],
    //文件输出地址
    output: {
        filename: '[name].js',//[name]的名字是对应的是entry的key
        // chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            //css预编译
            {
                test: /\.scss$/,
                use: developMode === "production" ? [
                    {
                        loader: `${MiniCssExtractPlugin.loader}?limit=8192&name=images/[name].[ext]`,
                        options: {
                            publicPath: '../'//css里面引用的图片上一级目录
                        }
                    },
                    'css-loader',
                    'postcss-loader'
                ] : [   
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ],
            },
            //加载图片
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader?limit=8192&name=images/[name].[ext]',
                    }

                ],

            },
            //加载字体
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader?limit=8192&name=images/[name].[ext]',
                    }
                ]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                    }
                ]
                //  exclude: /node_modules/, 
                //  loader: "babel-loader"
            }
        ]
    }
};


// function getEntries(globPath) {
//     var files = glob.sync(globPath),
//       entries = {};

//     files.forEach(function(filepath) {
//         var split = filepath.split('/');
//         var name = split[split.length - 1];

//         entries[name] = './' + filepath;

//     });

//     return entries;
// }
       
// var entries = getEntries('src/modle/*.html');
// Object.keys(entries).forEach(function(name) {
//     // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
//     name = name.replace(/.html/,'')
//     let keys = `js/${name}`
//     let keys2 = `./src/js/${name}.js`
//     module.exports.entry[`${keys}`] = keys2
    
//     // 每个页面生成一个html
//     var plugin = new HtmlWebpackPlugin({
//         // 生成出来的html文件名
//         filename: `modle/${name}.html`,//打包生成的路径
//         template: `src/modle/${name}.html`,//文件路径,
//         // 自动将引用插入html
//         inject: true,
//         // 每个html引用的js模块，也可以在这里加上vendor等公用模块
//         chunks: [name]
//     });
//     module.exports.plugins.push(plugin);
// })