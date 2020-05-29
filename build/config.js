/*
 * @Author: Jane
 * @Date: 2020-05-21 14:09:55
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-28 15:56:30
 * @Descripttion:
 */
/**
 * 开发环境
 */
const dev = {
  BASE_API: 'https://192.168.0.0',
  ENV: 'dev',
};

/**
 * 测试环境
 */
const test = {
  BASE_API: 'https://192.168.0.0',
  ENV: 'prod',
};

/**
 * 生产环境
 */
const prod = {
  BASE_API: 'http://wwww.xiaohongwu.com',
  ENV: 'prod',
};

let SERVER = null;
console.log(process.env);
switch (process.env.VUE_APP_CURRENTMODE) {
  case 'dev':
    SERVER = dev;
    break;
  case 'prod':
    SERVER = prod;
    break;
  case 'test':
    SERVER = test;
    break;
  default:
    SERVER = test;
    break;
}

const SERVER_CONFIG = SERVER;

export default SERVER_CONFIG;
