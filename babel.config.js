/*
 * @Author: Jane
 * @Date: 2020-05-18 14:01:07
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-21 14:04:30
 * @Descripttion:
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    ['import', { libraryName: 'vant', style: true }],
  ],
};
