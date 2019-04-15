/**
 * Webpack config file.
 */
const path = require( 'path' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const isProd  = ( process.env.NODE_ENV === 'production' );
const devServer = {
  host: 'localhost',
  port: 8000,
};

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    path: path.join( __dirname, '/' ),
    publicPath: '/',
    filename: 'public/bundles/[name].min.js',
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg|map|css|eot|woff|woff2|ttf)$/,
        loader: 'ignore-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader!postcss-loader!sass-loader',
          fallback: 'style-loader',
        })
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'public/bundles/[name].min.css',
      allChunks: true,
      disable: !isProd
    })
  ],
  devServer: {
    host: devServer.host,
    port: devServer.port,
    contentBase: path.join( __dirname, '/' ),
    clientLogLevel: 'info',
    hot: true,
    inline: true,
    quiet: false,
    noInfo: false,
    compress: false,
  },
  performance: {
    hints: false,
  },
  stats: {
    colors: true,
  },
}

if ( isProd ) {
  module.exports.plugins = ( module.exports.plugins || [] ).concat( [
    new webpack.DefinePlugin( { 'process.env': { NODE_ENV: '"production"' } } ),
    new webpack.optimize.UglifyJsPlugin( { sourceMap: false, compress: { warnings: false } } ),
    new webpack.LoaderOptionsPlugin( { minimize: true } )
  ]);
}
