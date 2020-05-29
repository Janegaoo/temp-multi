/*
 * @Author: Jane
 * @Date: 2020-05-27 14:40:36
 * @LastEditors: Jane
 * @LastEditTime: 2020-05-27 15:13:43
 * @Descripttion:
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import Hotspot from '../components/Hotspot.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Hotspot',
    component: Hotspot,
  },
  {
    path: '/preview',
    name: 'Preview',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/Preview.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
