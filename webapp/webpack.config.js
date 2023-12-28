var path = require('path');

module.exports = {
    entry: [
        './src/index.tsx'
    ],
    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true

                        // Babel configuration is in babel.config.js because jest requires it to be there.
                    }
                }
            }
        ]
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-intl': 'ReactIntl',
        redux: 'Redux',
        'react-redux': 'ReactRedux',
        'prop-types': 'PropTypes',
        'react-bootstrap': 'ReactBootstrap',
        'react-router-dom': 'ReactRouterDom'
    },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
        filename: 'main.js'
    }
};
