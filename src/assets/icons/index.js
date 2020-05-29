/*
 * @Author: Jane
 * @Date: 2020-05-27 18:02:02
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-28 14:51:11
 * @Descripttion:
 */
import Vue from 'vue';
import SvgIcon from '@components/SvgIcon';

Vue.component('svg-icon', SvgIcon);
// requires and returns all modules that match
const requireAll = (requireContext) => requireContext.keys().map(requireContext);

// import all svg
const req = require.context('./svg', true, /\.svg$/);
requireAll(req);
