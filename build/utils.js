/*
 * @Author: Jane
 * @Date: 2020-05-18 11:04:35
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-19 18:21:58
 * @Descripttion:
 */

/* 这里是添加的部分 ---------------------------- 开始 */
// glob是webpack安装时依赖的一个第三方模块，还模块允许你使用 *等符号, 例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
const glob = require('glob');
const path = require('path');
// 页面模板
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 取得相应的页面路径，因为之前的配置，所以是src文件夹下的pages文件夹
const PAGE_PATH = path.resolve(__dirname, '../src/views');
// 用于做相应的merge处理
const merge = require('webpack-merge');

const fs = require('fs');

const moduleRootPath = 'src/views'; // 模块根目录(这个可以根据自己的需求命名)
let moduleInfo = null;

exports.htmlPlugin = () => {
  const entryHtml = glob.sync(`${PAGE_PATH}/*/*.html`);
  const arr = [];
  entryHtml.forEach((filePath) => {
    const filename = filePath.substring(
      filePath.lastIndexOf('/') + 1,
      filePath.lastIndexOf('.'),
    );
    let conf = {
      // 模板来源
      template: filePath,
      // 文件名称
      filename: `${filename}.html`,
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', filename],
      inject: true,
    };
    if (process.env.NODE_ENV === 'production') {
      conf = merge(conf, {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        },
        chunksSortMode: 'dependency',
      });
    }
    arr.push(new HtmlWebpackPlugin(conf));
  });
  return arr;
};

/**
 * 深度遍历目录，并整理多页面模块
 * @param path 需要变量的路径
 * @param moduleName 模块名称
 */
function readDirSync(_path, moduleName, nextLevel) {
  // 缓存模块对象
  const moduleObj = {
    entry: '',
    template: '',
    filename: '',
    inject: true,
  };
  // 获取当前模块ID
  let moduleID = _path.replace(`${moduleRootPath}/`, '');
  if (_path === moduleRootPath) {
    moduleID = '';
  }
  // 获取目录下所有文件及文件夹
  const pa = fs.readdirSync(_path);
  pa.forEach((ele) => {
    const info = fs.statSync(`${_path}/${ele}`);
    if (info.isDirectory()) {
      // console.log("dir: "+ele)
      if (nextLevel) readDirSync(`${_path}/${ele}`, ele, false);
    } else {
      // 判断当前模块的html是否存在
      if (ele === 'index.html') {
        moduleObj.template = `${_path}/${ele}`;
        moduleObj.filename = `${moduleID}/index.html`;
      } else {
        moduleObj.template = './public/index.html';
        moduleObj.filename = `${moduleID}/index.html`;
      }
      // 判断当前模块的js是否存在
      if (ele === 'main.js') {
        moduleObj.entry = `${_path}/${ele}`;
      }
      // console.log("file: "+ele)
    }
  });
  // 判断模块是否真实(可能只是个分级目录)
  if (
    (moduleObj.moduleID !== '' && moduleObj.moduleHTML !== '')
    || (moduleObj.moduleID !== '' && moduleObj.moduleJS !== '')
  ) {
    if (moduleID) {
      moduleInfo[moduleID] = moduleObj;
    }
  }
}

exports.getEntries = function getEntries() {
  // 初始化模块列表
  this.getModuleInfo();
  console.log(
    '*********************************** entries ***********************************',
  );
  console.log(JSON.stringify(moduleInfo));
  return moduleInfo;
};
exports.getModuleInfo = function getModuleInfo() {
  // 判断是否为空，不为空则直接返回
  if (moduleInfo) {
    return moduleInfo;
  }
  // 为空则读取列表
  moduleInfo = {};
  readDirSync(moduleRootPath, '', true);
  return moduleInfo;
};

// exports.getEntries();

// 多页面3设置
const pages = {}; // 存放分页
exports.pages = () => {
  // 遍历拿到所有的js目录，如 ./src/pages/index/index.js
  //   var entryFiles = glob.sync(PAGE_PATH + '/*/*.js');

  //   var map = {};
  //   entryFiles.forEach(filePath => {
  const entryFiles = glob.sync(`${PAGE_PATH}/*/*.js`);
  // 获取当前模块ID
  // let moduleID = moduleRootPath.replace(`${moduleRootPath}/`, '');
  // if (moduleRootPath === moduleRootPath) {
  //   moduleID = '';
  // }
  entryFiles.forEach((filepath) => {
    // 使用 / 为分割形成数组 如 ‘.’ ‘src’ ‘pages’ ‘index’ ‘index.js’
    const fileList = filepath.split('/');
    // 拿到倒数第二项 如 index
    const fileName = fileList[fileList.length - 2];
    let selfChunks = [];
    // if (fileName === 'page1') {
    //   selfChunks = [
    //     'chunk-vendors',
    //     'chunk-common',
    //     'threejs',
    //     fileName,
    //     `manifest.${fileName}`
    //   ];
    // } else {
    //   selfChunks = [
    //     'chunk-vendors',
    //     'chunk-common',
    //     fileName,
    //     `manifest.${fileName}`
    //   ];
    // }
    selfChunks = [
      'chunk-vendors',
      'chunk-common',
      // 'threejs',
      fileName,
      `manifest.${fileName}`,
    ];
    pages[fileName] = {
      // 入口文件
      entry: `src/views/${fileName}/main.js`,
      // 模板文件，我使用的是一个公共的，也可以按照自己的需求配置
      template: 'public/index.html',
      title: '小红屋全景相机',
      // 打包后dist文件夹输出的名字
      // fileName: fileName + '.html',
      filename: `${fileName}/index.html`,
      chunks: selfChunks,
    };
  });
  console.log(pages);
  return pages;
};
