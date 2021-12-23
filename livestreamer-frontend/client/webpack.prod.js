const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// Load env vars specified in docker-compose.yml into process.env
const dotenv = require("dotenv").config();

const { API_ROOT_URL, PORT, NODE_ENV, LIKE_TIMEOUT_MS, WS_SERVER_URL } =
  process.env;
console.log(API_ROOT_URL, PORT, NODE_ENV, LIKE_TIMEOUT_MS, WS_SERVER_URL);

//
// Plugins
//

const injectEnvVarsIntoReactPlugin = new webpack.DefinePlugin({
  "process.env": {
    // Quotation markes arount variable are required!
    API_ROOT_URL: `"${API_ROOT_URL}"`,
    LIKE_TIMEOUT_MS: `"${LIKE_TIMEOUT_MS}"`,
    WS_SERVER_URL: `"${WS_SERVER_URL}"`,
    NODE_ENV: `"${NODE_ENV}"`,
  },
});

// https://webpack.js.org/plugins/copy-webpack-plugin/
const copyPlugin = new CopyPlugin({
  patterns: [
    { from: "public/img", to: "img" },
    { from: "public/favicons", to: "" },
  ],
});

// Extract all CSS into separate .css file and inject a link as `<link href=main.css...`
// Doc: https://webpack.js.org/plugins/mini-css-extract-plugin/
const miniCssExtractPlugin = new MiniCssExtractPlugin();

// Generate an HTML file and inject a link to .js bundle
// Doc: https://webpack.js.org/plugins/html-webpack-plugin/
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  hash: true,
  minify: false,
  template: path.resolve(__dirname, "public", "index.html"),
  inject: "body",
});

//
// Loaders
//

// Doc: https://webpack.js.org/guides/typescript/
const tsLoader = {
  test: /\.(ts|tsx)$/i,
  use: "ts-loader",
  exclude: "/node_modules/",
};

const sourceMapLoader = {
  enforce: "pre",
  test: /\.js$/i,
  loader: "source-map-loader",
};

const scssLoader = {
  test: /\.(css|scss)$/i,
  use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
};

// Export a) images imported in .tsx files, like `import "image.xxx"`, b) images imported directly into CSS
// https://webpack.js.org/guides/asset-management/#loading-images
const imageLoader = {
  test: /\.(jpe?g|png|gif|svg)$/i,
  type: "asset/resource",
  generator: { filename: "img/[hash][ext][query]" },
};

//
// Main conf
//
// Doc: https://webpack.js.org/configuration/

const webpackConf = {
  mode: NODE_ENV,
  // enhance debugging by adding meta info for the browser devtools
  devtool: "source-map",
  entry: path.resolve(__dirname, "src", "index.tsx"),
  plugins: [
    injectEnvVarsIntoReactPlugin,
    miniCssExtractPlugin,
    htmlWebpackPlugin,
    copyPlugin,
  ],
  // options related to how webpack emits results
  output: {
    // the url to the output dir resolved relative to the HTML page;
    // "" means "relative to HTML file"
    publicPath: "",
  },
  // https://webpack.js.org/configuration/stats/
  stats: "errors-warnings",
  module: { rules: [tsLoader, sourceMapLoader, scssLoader, imageLoader] },
  resolve: { extensions: ["*", ".js", ".json", ".tsx"] },
  target: "web",
};

module.exports = webpackConf;
