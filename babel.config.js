/*
 * @Author: Jane
 * @Date: 2020-05-18 14:01:07
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-27 10:57:09
 * @Descripttion:
 */
// 配置 TerserPlugin console.log 不生效

const plugins = [];
if (['production', 'prod'].includes(process.env.NODE_ENV)) {
  plugins.push('transform-remove-console');
}
plugins.push(['import', { libraryName: 'vant', style: true }]);

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins,
};
