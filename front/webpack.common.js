var webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const path = require('path');
module.exports = {
  context: __dirname + "/src", // `__dirname` is root of project and `src` is source
  entry: {
    app: "./ts/main.ts",
  },
  output: {
    path: __dirname + "/public/dl/assets/js/",
    publicPath: "/dl/assets/js/",
    filename: "[name].bundle.js",
  },
  optimization: {
    moduleIds: "named",
  },
  resolve: {
    extensions: [".ts", ".js", ".vue"],
    alias: {
      vue: "vue/dist/vue.common.js",
      "vue-class-component":
        "vue-class-component/dist/vue-class-component.common.js",
      config: "conf/"+process.env.NODE_ENV+".ts"
    },
    modules: ["./src/ts", "./src/styles/scss", "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: "vue-loader",
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          "vue-style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")({})],
            },
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["src/ts/styles", "node_modules"],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/, //Check for sass or scss file names
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: { appendTsSuffixTo: [/\.vue$/] },
      },
      {
        test: /\.(jpg|png|svg)$/,
        loaders: "file-loader?name=[name].[ext]",
      },
    ],
  },
  plugins: [new VueLoaderPlugin(), new webpack.ProvidePlugin({})],
};
