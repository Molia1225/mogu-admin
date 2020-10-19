import Vue from 'vue';
import Router from 'vue-router';

import Home from "@/components/common/Home";

Vue.use(Router);

export default new Router({
  mode: 'history',
//   base: '/htxdManageSystem/distribute-manager/manager-gold',
  base: '/nbyh/manager-gold',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/index',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/ActConfig',
          name: 'ActConfig',
          component: () => import('@/view/Festival/ActConfig'),
        },
        {
          path: '/RoundList',
          name: 'RoundList',
          component: () => import('@/view/Round/RoundList'),
        },
        {
          path: '/ShareList',
          name: 'ShareList',
          component: () => import('@/view/Share/ShareList'),
        },
        {
          path: '/InfoConfig',
          name: 'InfoConfig',
          component: () => import('@/view/Share/InfoConfig'),
        },
        {
          path: '/StockList',
          name: 'StockList',
          component: () => import('@/view/Stock/StockList'),
        },
        {
          path: '/StockBaseList',
          name: 'StockBaseList',
          component: () => import('@/view/Stock/StockBaseList'),
        },
        {
          path: '/StockDetailList',
          name: 'StockDetailList',
          component: () => import('@/view/Stock/StockDetailList'),
        },
        {
          path: '/WinningCheck',
          name: 'WinningCheck',
          component: () => import('@/view/WinningCheck'),
        },
        {
          path: '/FestivalList',
          name: 'FestivalList',
          component: () => import('@/view/Festival/FestivalList'),
        },
        {
          path: '/FundProductList',
          name: 'FundProduct',
          component: () => import('@/view/FundProduct/FundProductList'),
        },
      ]
    },
    {
      path: '/login',
      component: () => import("@/view/Login"),
    },
  ]
})
