var merge = require("webpack-merge"); // webpack-merge
var common = require("./webpack.common.js"); // 汎用設定をインポート

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "[name].bundle.js"
  },
  plugins: [],
  devServer: {
    contentBase: __dirname + "/src/",
    host: "0.0.0.0",
    disableHostCheck: true,
    proxy: [
      {
        context: ["/dl/api/**"],
        target:"http://172.31.168.1/",
        changeOrigin: true
      }
    ],
    historyApiFallback: {
      index: "dl/index.html"
    }
  },
  devtool: "inline-source-map"
});
