const path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');

var babelOptions = {
    "presets": [
        "react",
        [
            "es2015",
            {
                "modules": false
            }
        ],
        "es2016"
    ]
};

module.exports = {
    mode: "development",

    entry: "./index.tsx",

    output: {
        path: path.resolve(__dirname, 'android/app/src/main/assets/fluid')
      },

    // Enable sourcemaps for debugging webpack's output.
    // devtool: "source-map",

    devtool: 'source-map',
    // devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: {
            index: path.join(__dirname, 'index.html')
          }
       
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
    // // https://stackoverflow.com/questions/61035800/module-parse-failed-unexpected-token-react-native-index-js-typeof-operator
    // externals: {
    //     "react-native": true,
    // },

    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                '@babel/preset-env', 
                                '@babel/preset-typescript', 
                                '@babel/preset-react'],
                            plugins: [
                                    "@babel/proposal-class-properties",
                                    "@babel/proposal-object-rest-spread",
                                    // https://github.com/babel/babel/issues/9849
                                    "@babel/plugin-transform-runtime"
                                ]
                        }
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
              inlineSource: '.(js|css)$' // embed all javascript and css inline
          }),
      ]        
};