
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");


module.exports = {
        entry: {
            // Qui specifichiamo il file di ENTRATA
            main: path.resolve(__dirname, './src/index.js'),
        },
        output: {
            //  metterà i file risultanti nella cartella build
            filename: "bundle.js",
            path: path.resolve(__dirname, "build"),
        },
       
        devServer: {
            static: "./build",
            open: true,
        },
        plugins: [
          
            new HtmlWebpackPlugin({
                title: "Coming Home",
                template: path.resolve(__dirname, "./src/index.html"),
            }),

        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
            ]
        },
        mode: 'development',
};
