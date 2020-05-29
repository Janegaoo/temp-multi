const path = require('path');
const glob = require('glob');

const PAGES_PATH = path.resolve(__dirname, './src/views');
// const prodConfig = require('./build/webpack.prod.conf'); // 生产配置
// const devConfig = require('./build/webpack.dev.config'); // 开发模式配置
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // 用terser-webpack-plugin替换掉uglifyjs-webpack-plugin解决uglifyjs不支持es6语法问题
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const utils = require('./build/utils'); // 生成入口文件对象

const productionMode = process.env.NODE_ENV === 'prod';

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: productionMode ? '../' : '/', // 默认'/'，部署应用包时的基本 URL
  outputDir: 'dist',
  // assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'dev',
  productionSourceMap: false,
  // filenameHashing: true,
  // pages: utils.getEntries(),
  pages: utils.pages(),
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: true,
    // css预设器配置项
    loaderOptions: {
    },
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true,
  },
  devServer: {
    port: process.env.port || 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://172.169.1.241:29000',
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API}`]: '',
        },
      },
    },
    // after: require('./mock/mock-server.js')
  },
  // /如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中
  // 如果你需要基于环境有条件地配置行为，或者想要直接修改配置，那就换成一个函数 (该函数会在环境变量被设置之后懒执行)。该方法的第一个参数会收到已经解析好的配置。在函数内，
  // 你可以直接修改配置，或者返回一个将会被合并的对象
  configureWebpack: (config) => {
    // 后缀省略
    const v = config;
    v.resolve.extensions = [
      '.js',
      // '.ts',
      '.vue',
      '.json',
      '.css',
      '.scss',
    ];
    v.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          { from: resolve('static'), to: 'static' },
        ],
      }),
    );

    if (productionMode) {
      // 为生产环境修改配置...
      v.optimization = {
        minimize: true,
        moduleIds: 'hashed',
        // namedModules: true, // 解决方案是将默认的数字 id 命名规则换成路径的方式。webpack 4 中当 mode 为 development 会默认启动
        namedChunks: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              // ecma: undefined,
              warnings: false,
              // parse: {},
              compress: {
                warnings: false,
                drop_console: true, // 不生效
                drop_debugger: true,
                pure_funcs: ['console.log'],
              },
              // mangle: true, // Note `mangle.properties` is `false` by default.
              // module: false,
              output: {
                comments: false,
              },
              // toplevel: false,
              // nameCache: null,
              // ie8: false,
              // keep_classnames: undefined,
              // keep_fnames: false,
              // safari10: false,
            },
            extractComments: false, // 不单独提取注释
            cache: true,
            sourceMap: false,
            parallel: 4, // 进程
          }),
        ],
        splitChunks: {
          chunks: 'all', // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
              name: 'chunk-vendors',
              chunks: 'all',
              priority: -10, // 抽取优先级
            },
            // 抽离自定义工具库
            utilCommon: {
              name: 'chunk-common',
              minSize: 1024, // 将引用模块分离成新代码文件的最小体积
              minChunks: 2, // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
              priority: -20,
            },
            threejs: {
              name: 'threejs',
              // test: /[\\/]node_modules[\\/]element-ui[\\/]/,
              test: /[\\/]node_modules[\\/]three[\\/]/,
              chunks: 'initial',
              reuseExistingChunk: true,
              enforce: true,
              priority: 3,
            },
          },
        },
        runtimeChunk: {
          name: (entryPoint) => `manifest.${entryPoint.name}`,
        },
      };

      // v.output.path = path.join(__dirname, './dist');
      v.output.filename = 'js/[name].[chunkhash:8].js';
      v.output.chunkFilename = 'js/[name].[chunkhash:8].js';

      // config.output.chunkFilename('js/[name].[chunkhash:8].js');
      // config.output.filename('js/[name].[chunkhash:8].js');
      // config.output.chunkFilename('js/[name].[chunkhash:8].js');

      if (process.env.ANALYZ_ENV) {
        config.plugins.push(new BundleAnalyzerPlugin());
      }
    } else {
      // 为开发环境修改配置...
    }
  },
  // 对内部的 webpack 配置（比如修改、增加Loader选项）(链式操作)
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        const value = options;
        value.compilerOptions.preserveWhitespace = false;
        return value;
      });
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@pub', resolve('public'))
      .set('@build', resolve('build'));

    // config.optimization.runtimeChunk({
    //   name: (entryPoint) => `manifest.${entryPoint.name}`,
    // });
    // 移除 preload
    glob.sync(`${PAGES_PATH}/*/main.js`).forEach((filePath) => {
      const pageName = path.basename(path.dirname(filePath));
      config.plugins.delete(`preload-${pageName}`);
      config.plugins.delete(`prefetch-${pageName}`);
    });
    // 开启图片压缩
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => Object.assign(options, { limit: 20000 }));

    // svg
    config.module.rules.delete('svg'); // 重点:删除默认配置中处理svg,
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons/svg'))
      .end();

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      });

    // config.output.publicPath('/[name]/');
    if (productionMode) {
      config.optimization.delete('splitChunks'); // webpack 会默认给commonChunk打进chunk-vendors。所以需要对webpack的配置进行delete

      // config.module.rule('img').use('url-loader').loader('url-loader').tap((options) => {
      //   const selfOptions = options;
      //   selfOptions.name = 'img/[name].[hash:8].[ext]';
      //   return selfOptions;
      // });
      config.plugin('extract-css').tap(() => [
        {
          filename: 'css/[name].[contenthash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].css',
        },
      ]);
    }

    // config.output.filename('[name].[hash].js').end();
    // if (productionMode) {
    //   // 移除 prefetch 插件
    //   // config.plugins.delete('prefetch');
    //   // 移除 preload 插件
    //   // config.plugins.delete('preload');
    //   // 压缩代码
    //   config.optimization.minimize(true);
    //   // 分割代码
    //   // config.optimization.splitChunks({
    //   //   chunks: 'all',
    //   // });
    // }
    // config.plugin('html').tap((args) => {
    //   const selfArgs = args;
    //   console.log(selfArgs);
    // });
  },
};
