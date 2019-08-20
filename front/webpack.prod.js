var merge = require("webpack-merge"); // webpack-merge
var common = require("./webpack.common.js"); // 汎用設定をインポート
var CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "[name].bundle.[hash].js"
  },
  plugins: [new CleanWebpackPlugin(["./src/dl/js/*"])]
});
