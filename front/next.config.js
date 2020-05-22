const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const webpack = require('webpack');
const compressionPlugin = require('compression-webpack-plugin');

module.exports = withBundleAnalyzer({
    distDir: '.next',
    webpack(config) {
        const prod = process.env.NODE_ENV === 'production';
        const plugins = [
            ...config.plugins,
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\/ko$/),
        ];
        if (prod) {
            plugins.push(new compressionPlugin());
        }
        return {
            ...config,
            mode: prod ? 'production' : 'development',
            devtool: prod ? 'hidden-source-map' : 'eval',  //소스코드를 숨기고 에러가 발생시 소스맵 제공, eval: 빠르게 웹팩 적용
            plugins,
        }
    }
});