var webpack = require("webpack");

module.exports = {
  context: __dirname + "/src", // `__dirname` is root of project and `src` is source
  entry: {
    app: "./ts/main.ts"
  },
  output: {
    path: __dirname + "/src/dl/js/",
    publicPath: "/dl/js/"
  },
  optimization: {
    moduleIds: "named"
  },
  resolve: {
    extensions: [".ts", ".js", ".vue"],
    alias: {
      vue: "vue/dist/vue.common.js",
      "vue-class-component":
        "vue-class-component/dist/vue-class-component.common.js"
    },
    modules: ["./src/ts", "./src/scss", "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.worker\.ts$/,
        use: ['worker-loader']
      },
      {
        test: /\.(sass|scss)$/, //Check for sass or scss file names
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              includePaths: ["src/ts", "src/ts/styles", "node_modules"]
            }
          }
        ]
      },
      {
        test: /\.css$/, //Check for sass or scss file names
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.ts$/,
        loader: "ts-loader"
      },
      {
        test: /\.(jpg|png|svg)$/,
        loaders: "file-loader?name=[name].[ext]"
      }
    ]
  },
  plugins: [new webpack.ProvidePlugin({})]
};
