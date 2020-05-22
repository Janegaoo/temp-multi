/*
 * @Author: Jane
 * @Date: 2020-05-20 18:10:36
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-21 16:15:59
 * @Descripttion:
 */
import http from '@/utils/axios/http';

const base = '/api/';

export default {
  getCardProductList(params) {
    return http.post(`${base}apiName`, params);
  },
};
