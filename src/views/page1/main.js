/*
 * @Author: Jane
 * @Date: 2020-05-19 17:41:50
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-21 14:00:37
 * @Descripttion:
 */
import Vue from 'vue';
import router from '@/router/';
import store from '@/store/';
import { Button } from 'vant';
import Krpano from '@/utils/krpano/index';
import App from './index.vue';

Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Krpano);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
