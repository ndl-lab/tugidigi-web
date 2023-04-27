const { merge } = require("webpack-merge"); // webpack-merge
var common = require("./webpack.common.js"); // 汎用設定をインポート
var webpack = require("webpack");

module.exports = merge(common, {
  mode: "development",
  output: {
    publicPath: "/dl/assets/js/",
	filename:"[name].bundle.js"
  },
  devServer: {
    hot: true,
    host: "0.0.0.0",
    proxy: [
      {
        context: ["/dl/api/**"],
        target: "http://localhost:19998/",
      },
    ],
    historyApiFallback: {
      index: "/dl/index.html",
    },
  },
  devtool: "inline-source-map",
});
