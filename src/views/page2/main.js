/*
 * @Author: Jane
 * @Date: 2020-04-19 17:41:50
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-19 16:57:50
 * @Descripttion:
 */
import Vue from 'vue';
import router from '@/router/';
import store from '@/store/';
import App from './index.vue';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
