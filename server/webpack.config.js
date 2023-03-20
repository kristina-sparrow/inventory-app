const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: path.resolve(__dirname, "src/server.ts"),
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "server.js",
  },
  resolve: {
    extensions: [".ts", ".tsx"],
  },
  externals: [nodeExternals()],
  target: "node",
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json",
        },
      },
    ],
  },
};
