/*
 * @Author: Jane
 * @Date: 2020-05-18 14:01:07
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-19 16:16:57
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

// plugins: [
//   ['import', {
//       libraryName: 'vant',
//       libraryDirectory: 'es',
//       style: true
//   }, 'vant']
// ]
