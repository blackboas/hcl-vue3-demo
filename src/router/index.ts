// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 布局组件
import Layout from '@/layouts/MainLayout.vue'

// 页面组件
const Dashboard = () => import('@/views/dashboard/index.vue')
const About = () => import('@/views/about/index.vue')
const FlowChart = () => import('@/views/flowChart/index.vue')

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          title: '仪表盘',
          icon: 'dashboard'
        }
      },
      {
        path: '/about',
        name: 'about',
        component: About,
        meta: {
          title: '关于',
          icon: 'info-circle'
        }
      },
      {
        path: '/flowChart',
        name: 'flowChart',
        component: FlowChart,
        meta: {
          title: '流程图',
          icon: 'info-circle'
        }
      }
    ]
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router