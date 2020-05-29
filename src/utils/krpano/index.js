/*
 * @Author: Jane
 * @Date: 2020-05-20 10:24:53
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-28 09:58:39
 * @Descripttion:
 */


import core from './core';
import lazyLoad from './features/lazyLoad';
import freezeVertical from './features/freezeVertical';

const component = {

  name: 'Krpano',

  mixins: [core, lazyLoad, freezeVertical],

  template: `<div class='vue-krpano' style="height: 100%; width: 100%;">
                <noscript>
                <table style="width:100%;height:100%;">
                  <tr style="vertical-align:middle;">
                    <td>
                      <div style="text-align:center;">ERROR:<br /><br />Javascript not activated<br /><br /></div>
                    </td>
                  </tr>
                </table>
              </noscript>
            </div>`,
  mounted() {
    this.createPano();
  },
};

component.install = (Vue) => {
  Vue.component(component.name, component);
};

export default component;
