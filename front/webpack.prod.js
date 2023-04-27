const { merge } = require("webpack-merge"); // webpack-merge
var common = require("./webpack.common.js"); // 汎用設定をインポート
var webpack = require("webpack");

module.exports = merge(common, {
  mode: "production",
  plugins: [new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')})],
});
