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

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: [
                    'index_rn.tsx',
                    'App_rn.tsx',
                    'clicker_rn.tsx'
                ],
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: "tsconfig.react.json"
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
};