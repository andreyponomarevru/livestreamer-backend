//
// Webpack Conf
//
// GUIDE: https://webpack.js.org/guides/getting-started/
//

// NOTE: when we'are providing paths, in some cases to construct them we use `path.resolve(...)` because those paths must be absolute

// NOTE: if for some reason you'll decide to use `style-loader` instead of `mini-css-extract-plugin`, keep in mind that `style-loader` outputs all css  into .js file (so you won't see any .css files in your build folder), and when you open the page, .js file will dynamically generate `<style>` tag and then inject into it all your css

const url = require("url");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// Load env vars specified in docker-compose.yml into process.env
const dotenv = require("dotenv").config();

const { REACT_APP_API_ROOT, PORT, NODE_ENV } = process.env;
console.log(REACT_APP_API_ROOT, PORT, NODE_ENV);

//
// Plugins
//

// https://webpack.js.org/plugins/copy-webpack-plugin/
const copyPlugin = new CopyPlugin({
  patterns: [
    { from: "public/img", to: "img" },
    { from: "public/favicons", to: "" },
  ],
});

// Extract all CSS into separate .css file and inject a link as `<link href=main.css...`
// DOC: https://webpack.js.org/plugins/mini-css-extract-plugin/
const miniCssExtractPlugin = new MiniCssExtractPlugin();

const injectEnvVarsIntoReactPlugin = new webpack.DefinePlugin({
  "process.env": {
    REACT_APP_API_ROOT: `"${REACT_APP_API_ROOT}"`,
  },
});

// Generate an HTML file and inject a link to .js bundle
// DOC: https://webpack.js.org/plugins/html-webpack-plugin/
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  hash: true,
  minify: false,
  template: path.resolve(__dirname, "public", "index.html"),
  inject: "body",
});

//
// Loaders
//

// DOC: https://webpack.js.org/guides/typescript/
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
// DOC: https://webpack.js.org/configuration/

const webpackConf = {
  mode: NODE_ENV,
  entry: path.resolve(__dirname, "src", "index.tsx"),
  // https://webpack.js.org/configuration/stats/
  stats: "errors-warnings",

  // options related to how webpack emits results
  output: {
    // the url to the output dir resolved relative to the HTML page
    publicPath: "", // "" means "relative to HTML file"
  },

  module: { rules: [tsLoader, sourceMapLoader, scssLoader, imageLoader] },
  resolve: { extensions: ["*", ".js", ".json", ".tsx"] },

  // enhance debugging by adding meta info for the browser devtools
  devtool: "source-map",

  target: "web",
  // https://webpack.js.org/configuration/dev-server/
  // https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md
  devServer: {
    liveReload: true,
    open: true,
    static: {
      // serve static files from
      // try this if nothing works:
      // directory: path.resolve(__dirname, "static"),
      publicPath: [path.join(__dirname, "public")],
    },
    hot: "only",
    allowedHosts: "all",
    port: 8081, //PORT,
    // in some cases helps changing the value to "127.0.0.1" or "lcoalhost or 0.0.0.0"
    host: "localhost",
    https: false,
    // TODO: uncomment it
    // https: {
    //	https://webpack.js.org/configuration/dev-server/#devserverhttps
    //  https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md
    //},
    headers: { "Access-Control-Allow-Origin": "*" },
    devMiddleware: {
      //publicPath: `http://localhost`, //new URL(REACT_APP_API_ROOT).host, //`http://musicbox.com:8000`,-
    },

    client: {
      // Can be `string`:
      //
      // To get protocol/hostname/port from browser
      // webSocketURL: 'auto://0.0.0.0:0/ws'
      webSocketURL: {
        hostname: "0.0.0.0",
        pathname: "/ws",
        port: 8081,
      },
    },
    // It is alternative to weSocketServer option
    //webSocketServer: {
    //  options: {
    //    path: "/my/custom/path/to/web/socket/server",
    //  },
    //},
    webSocketServer: "ws",
  },

  plugins: [
    injectEnvVarsIntoReactPlugin,
    miniCssExtractPlugin,
    htmlWebpackPlugin,
    copyPlugin,
  ],
};

module.exports = webpackConf;
