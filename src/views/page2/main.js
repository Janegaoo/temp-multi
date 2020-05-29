/*
 * @Author: Jane
 * @Date: 2020-05-19 17:41:50
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-27 15:11:26
 * @Descripttion:
 */
import Vue from 'vue';
import router from '@/router/';
import store from '@/store/';
import App from './Index.vue';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
