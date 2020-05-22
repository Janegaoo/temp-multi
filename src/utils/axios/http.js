/*
 * @Author: Jane
 * @Date: 2020-05-21 13:52:09
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-21 13:52:58
 * @Descripttion:
 */
import request from './request';

const http = {
  /**
     * methods: 请求
     * @param url 请求地址
     * @param params 请求参数
     */
  get(url, params) {
    const config = {
      methods: 'get',
      url,
    };
    if (params) config.params = params;
    return request(config);
  },
  post(url, params) {
    const config = {
      methods: 'post',
      url,
    };
    if (params) config.data = params;
    return request(config);
  },
  put(url, params) {
    const config = {
      methods: 'put',
      url,
    };
    if (params) config.params = params;
    return request(config);
  },
  delete(url, params) {
    const config = {
      methods: 'delete',
      url,
    };
    if (params) config.params = params;
    return request(config);
  },
};
// 导出
export default http;
