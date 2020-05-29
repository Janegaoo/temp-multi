/*
 * @Author: Jane
 * @Date: 2020-05-19 17:41:50
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-27 18:03:13
 * @Descripttion:
 */
import Vue from 'vue';
import store from '@/store/';
import { Button } from 'vant';
import Krpano from '@/utils/krpano';
import router from './router';
import App from './Index.vue';
import '@/assets/icons/index';

Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Krpano);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
