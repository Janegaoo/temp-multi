/*
 * @Author: Jane
 * @Date: 2020-04-19 17:41:50
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-19 16:57:41
 * @Descripttion:
 */
import Vue from 'vue';
import router from '@/router/';
import store from '@/store/';
import { Button } from 'vant';
import App from './index.vue';

Vue.config.productionTip = false;

Vue.use(Button);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
