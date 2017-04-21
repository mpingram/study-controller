const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: [
    "./scripts/app.js",
  ],
  
  devServer: {
    contentBase: path.resolve( __dirname, "dist" ),
    historyApiFallback: true
    //publicPath: "/",
  },

  output: {
    filename: "bundle.js",
    path: path.resolve( __dirname, "dist" ),
    publicPath: "/",
  },

  context: path.resolve( __dirname, "src" ),
  // Enable sourcemaps for debugging webpack's output.
  devtool: "inline-source-map",

  module: {
    rules: [

      {
        test: /\.scss$/,
        include: /src\/styles/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader, sass-loader"]
        })
      },
      { 
        test: /\.js?$/,
        include: /src\/scripts/,
        exclude: /node_modules|typedefs/,
        use: [
          { loader: "babel-loader" },
        ]
      }
    ]
  },

  // resolve: {
  //   modules: [
  //     "node_modules",
  //     path.resolve(__dirname, "app")
  //   ],
  //   extensions: [".webpack.js", ".web.js", ".js", ".jsx"]
  // },
  
  plugins: [
    new ExtractTextPlugin("bundle.css")
  ]
};  

