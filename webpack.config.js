const path = require("path");
const miniCss = require("mini-css-extract-plugin");
module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [miniCss.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new miniCss({
      filename: "style.css",
    }),
  ],
};
