//
// Webpack Conf
//
// GUIDE: https://webpack.js.org/guides/getting-started/
//

// NOTE: when we'are providing paths, in some cases to construct them we use `path.resolve(...)` because those paths must be absolute

// NOTE: if for some reason you'll decide to use `style-loader` instead of `mini-css-extract-plugin`, keep in mind that `style-loader` outputs all css  into .js file (so you won't see any .css files in your build folder), and when you open the page, .js file will dynamically generate `<style>` tag and then inject into it all your css

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
  devtool: "inline-source-map",
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
  // https://webpack.js.org/configuration/dev-server/
  // https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md
  devServer: {
    proxy: {
      "/api/v1": {
        // "api" is a container name
        target: `http://api:${PORT}`,
        pathRewrite: { "^/api/v1": "" },
      },
    },

    liveReload: true,
    open: true,
    static: {
      // serve static files from
      // try this if nothing works:
      // directory: path.resolve(__dirname, "static"),
      publicPath: [path.join(__dirname, "public")],
    },
    hot: true,
    allowedHosts: "all",
    port: 8080,
    host: "0.0.0.0", // when you run webpack inside Docker, don't replace this value with "localhost" or any other value, otherwise you won't be able to access this dev server when it runs inside the Docker container. If webpack runs not inside Docker and you still have issues, try changing the value to "127.0.0.1" or "localhost"
    headers: { "Access-Control-Allow-Origin": "*" },
    devMiddleware: {
      //publicPath: `http://localhost`, //new URL(REACT_APP_API_ROOT).host, //`http://musicbox.com:8000`,-
    },

    // This is WS server for webpack to function properly, it has nothing to do with my ws chat server. Usually you need to set this settings when you proxy websocket through real server like nginx.
    client: {
      // To get protocol/hostname/port from browser, replace 'webSocketURL' object below with `webSocketURL: 'auto://0.0.0.0:0/ws'`
      webSocketURL:
        "auto://0.0.0.0/ws" /* //'pathname' should match the 'location' value set in Nginx, in line `location /ws { ...` 
        { hostname: "0.0.0.0",  pathname: "/ws", port: 8000 },*/,
      logging: "verbose",
    },
    webSocketServer: "ws",
  },

  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
  },
};

module.exports = webpackConf;
