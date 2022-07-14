const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode:"development",
    entry: ['./src/index.js'],
    output: {
      filename: 'index.js',
    },
    module: {
        rules: [
          { test: /\.js$/, use: 'babel-loader' },
        ],
      },
      plugins: [
        new CopyPlugin({
          patterns: [
            { from: "src/index.html", to: "./" },
          ],
        }),
      ],
  };