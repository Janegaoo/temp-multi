/*
 * @Author: Jane
 * @Date: 2020-05-20 10:24:53
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-20 11:00:45
 * @Descripttion:
 */


import core from './core';
import lazyLoad from './features/lazyLoad';
import freezeVertical from './features/freezeVertical';

const component = {

  name: 'Krpano',

  mixins: [core, lazyLoad, freezeVertical],

  template: "<div class='vue-krpano'></div>",

  mounted() {
    this.createPano();
  },
};

component.install = (Vue) => {
  Vue.component(component.name, component);
};

export default component;
