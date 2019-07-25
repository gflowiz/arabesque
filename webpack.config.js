var webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var config = {
  context: __dirname, // `__dirname` is root of project and `/src` is source
  entry: './assets/js/main.js',

  output: {
    path:   path.resolve('./dist'), // `/dist` is the destination
    filename: 'bundle.js', // bundle created by webpack it will contain all our app logic. we will link to this .js file from our html page.
  },
 
  module: {
    rules: [
        {
          use: {
            loader: "babel-loader"
            },                
          test: /\.js$/,
          exclude: /node_modules/
      },
            {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }]
        },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
            // "style-loader",
           // the order is important. it executes in reverse order !
          'css-loader', // this will load first !
          // 'sass-loader'
        ]
      },
      {
      test: /\.(html)$/,
      use: {
        loader: 'html-loader',
        options: {
          attrs: ['img:src', 'link:href']
        }
      }
    },
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [  
  // new HtmlWebpackPlugin({
  //     title: 'My App',
  //     filename:  path.resolve('index.html')
  //   }),
  new MiniCssExtractPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      // This has effect on the react lib size
      'NODE_ENV': JSON.stringify('production'),
    }
  }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      d3: 'd3',
    }),
    new webpack.LoaderOptionsPlugin({
         // test: /\.xxx$/, // may apply this only for some modules
         options: {
           types: ["jquery","spectrum-colorpicker"]
         }
       }),
  ]
};

module.exports = config;