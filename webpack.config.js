const webpack = require('webpack');

module.exports = {
  entry: __dirname + '/demo/js/app.js',
  output: {
    path: __dirname,
    filename: 'demo.js'
  },
  module: {
    loaders: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader",
        query: {
          presets: ['es2015']
        },
      },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
}