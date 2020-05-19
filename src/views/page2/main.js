/*
 * @Author: Jane
 * @Date: 2020-05-19 17:41:50
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-19 18:11:23
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
