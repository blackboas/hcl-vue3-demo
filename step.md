我将为您详细说明如何使用 Vite 创建一个企业级的 Vue3 项目，包含您提到的所有功能。

## 1. 项目初始化

### 创建项目基础结构

```bash
# 创建项目目录
mkdir enterprise-vue3-project
cd enterprise-vue3-project

# 使用 Vite 创建 Vue3 + TypeScript 项目
npm create vite@latest . --template vue-ts

# 安装依赖
npm install

# 安装开发依赖
npm install -D @types/node
```

## 2. 安装核心依赖

```bash
# 安装路由、状态管理
npm install vue-router@4 pinia

# 安装 HTTP 客户端
npm install axios

# 安装 UI 组件库
npm install ant-design-vue
npm install @antv/x6

# 安装图表库
npm install echarts

# 安装 SaaS 相关依赖
npm install sass sass-loader

# 安装国际化
npm install vue-i18n@9

# 安装 Babel 相关依赖
npm install -D @babel/core @babel/preset-env @babel/preset-typescript

# 安装 ESLint 相关依赖
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D eslint-plugin-vue eslint-config-standard
```

## 3. 配置文件设置

### vite.config.ts (Vite 配置文件)

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    // 配置路径别名
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@views': resolve(__dirname, 'src/views'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@store': resolve(__dirname, 'src/store'),
        '@router': resolve(__dirname, 'src/router'),
        '@locales': resolve(__dirname, 'src/locales')
      }
    },
    
    // 插件配置
    plugins: [
      vue()
    ],
    
    // 服务器配置
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT) || 3000,
      // 代理配置
      proxy: {
        // API 代理配置示例
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
        }
      }
    },
    
    // 构建配置
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      rollupOptions: {
        output: {
          // 分包配置
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            antd: ['ant-design-vue'],
            echarts: ['echarts'],
            utils: ['axios', '@antv/x6']
          }
        }
      }
    },
    
    // CSS 配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    }
  }
})
```

### tsconfig.json (TypeScript 配置)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* 路径映射 */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@views/*": ["src/views/*"],
      "@utils/*": ["src/utils/*"],
      "@assets/*": ["src/assets/*"],
      "@store/*": ["src/store/*"],
      "@router/*": ["src/router/*"],
      "@locales/*": ["src/locales/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### .eslintrc.cjs (ESLint 配置)

```javascript
/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'vue'
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  }
}
```

## 4. 环境变量配置

### .env (默认环境变量)

```env
# 应用端口
VITE_APP_PORT=3000

# API 配置
VITE_APP_BASE_API=/api
VITE_APP_API_URL=http://localhost:8080

# 应用配置
VITE_APP_TITLE=企业级 Vue3 应用
VITE_APP_THEME=light
```

### .env.development (开发环境)

```env
NODE_ENV=development
VITE_APP_API_URL=http://localhost:8080
```

### .env.production (生产环境)

```env
NODE_ENV=production
VITE_APP_API_URL=https://api.yourdomain.com
```

### .env.test (测试环境)

```env
NODE_ENV=test
VITE_APP_API_URL=https://test-api.yourdomain.com
```

## 5. 项目结构设计

```
src/
├── api/                 # API 接口封装
├── assets/              # 静态资源
├── components/          # 公共组件
├── layouts/             # 布局组件
├── locales/             # 国际化文件
├── router/              # 路由配置
├── store/               # 状态管理
├── styles/              # 样式文件
├── utils/               # 工具函数
├── views/               # 页面组件
├── App.vue             # 根组件
└── main.ts             # 入口文件
```

## 6. 核心功能实现

### main.ts (入口文件)

```typescript
import { createApp } from 'vue'
import App from './App.vue'

// 路由
import router from '@/router'

// 状态管理
import { createPinia } from 'pinia'

// 国际化
import { setupI18n } from '@/locales'

// Ant Design Vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 样式
import '@/styles/index.scss'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)
app.use(Antd)

// 设置国际化
setupI18n(app)

// 挂载应用
app.mount('#app')
```

### router/index.ts (路由配置)

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 布局组件
import Layout from '@/layouts/MainLayout.vue'

// 页面组件
const Dashboard = () => import('@/views/dashboard/index.vue')
const About = () => import('@/views/about/index.vue')

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: '仪表盘',
          icon: 'dashboard'
        }
      },
      {
        path: 'about',
        name: 'About',
        component: About,
        meta: {
          title: '关于',
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
```

### store/index.ts (状态管理)

```typescript
// store/index.ts
import { defineStore } from 'pinia'

// 定义状态类型
interface AppState {
  theme: string
  locale: string
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
}

// 创建应用状态存储
export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: localStorage.getItem('theme') || 'light',
    locale: localStorage.getItem('locale') || 'zh-CN',
    sidebar: {
      opened: true,
      withoutAnimation: false
    }
  }),
  
  getters: {
    // 获取当前主题
    currentTheme: (state) => state.theme,
    // 获取当前语言
    currentLocale: (state) => state.locale
  },
  
  actions: {
    // 切换主题
    toggleTheme(theme?: string) {
      this.theme = theme || (this.theme === 'light' ? 'dark' : 'light')
      localStorage.setItem('theme', this.theme)
    },
    
    // 切换语言
    setLocale(locale: string) {
      this.locale = locale
      localStorage.setItem('locale', locale)
    },
    
    // 切换侧边栏
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
    }
  }
})
```

### api/request.ts (Axios 二次封装)

```typescript
// api/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { message } from 'ant-design-vue'
import { useAppStore } from '@/store'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  // 基础URL
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 请求超时时间
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在发送请求之前做些什么
    const appStore = useAppStore()
    
    // 添加认证 token
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 添加语言头
    if (config.headers) {
      config.headers['Accept-Language'] = appStore.currentLocale
    }
    
    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    const { code, data, message: msg } = response.data
    
    // 根据自定义状态码判断请求结果
    if (code === 200) {
      return data
    } else {
      // 处理业务错误
      message.error(msg || '请求失败')
      return Promise.reject(new Error(msg || '请求失败'))
    }
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    const { response } = error
    
    if (response) {
      switch (response.status) {
        case 401:
          message.error('未授权，请重新登录')
          // 清除 token 并跳转登录页
          localStorage.removeItem('access_token')
          window.location.href = '/login'
          break
        case 403:
          message.error('拒绝访问')
          break
        case 404:
          message.error('请求地址出错')
          break
        case 500:
          message.error('服务器内部错误')
          break
        default:
          message.error(`连接错误${response.status}`)
      }
    } else {
      message.error('网络错误')
    }
    
    return Promise.reject(error)
  }
)

// 导出封装后的 axios 实例
export default service
```

### api/modules/user.ts (用户相关 API)

```typescript
// api/modules/user.ts
import request from '@/api/request'
import type { AxiosPromise } from 'axios'

// 定义用户类型
export interface UserInfo {
  id: number
  username: string
  email: string
  avatar?: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}

// 用户相关 API
export class UserAPI {
  /**
   * 用户登录
   * @param data 登录参数
   */
  static login(data: LoginParams): AxiosPromise<LoginResponse> {
    return request({
      url: '/auth/login',
      method: 'post',
      data
    })
  }
  
  /**
   * 获取用户信息
   */
  static getUserInfo(): AxiosPromise<UserInfo> {
    return request({
      url: '/user/info',
      method: 'get'
    })
  }
  
  /**
   * 用户登出
   */
  static logout(): AxiosPromise<void> {
    return request({
      url: '/auth/logout',
      method: 'post'
    })
  }
}
```

### locales/index.ts (国际化配置)

```typescript
// locales/index.ts
import { createI18n } from 'vue-i18n'
import type { App } from 'vue'

// 导入语言包
import zhCN from './langs/zh-CN.json'
import enUS from './langs/en-US.json'

// 定义语言包类型
interface LanguagePack {
  [key: string]: string | LanguagePack
}

// 语言包映射
const messages: Record<string, LanguagePack> = {
  'zh-CN': zhCN,
  'en-US': enUS
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: localStorage.getItem('locale') || 'zh-CN',
  fallbackLocale: 'en-US',
  messages
})

// 设置国际化
export function setupI18n(app: App) {
  app.use(i18n)
}

// 导出 i18n 实例
export default i18n

// 导出常用方法
export const $t = (key: string) => i18n.global.t(key)
```

### locales/langs/zh-CN.json (中文语言包)

```json
{
  "common": {
    "confirm": "确认",
    "cancel": "取消",
    "submit": "提交",
    "reset": "重置",
    "search": "搜索",
    "add": "新增",
    "edit": "编辑",
    "delete": "删除",
    "view": "查看",
    "save": "保存",
    "close": "关闭"
  },
  "menu": {
    "dashboard": "仪表盘",
    "about": "关于"
  },
  "dashboard": {
    "title": "仪表盘",
    "welcome": "欢迎使用企业级 Vue3 应用"
  },
  "about": {
    "title": "关于",
    "description": "这是一个基于 Vue3 + Vite + TypeScript 的企业级应用模板"
  }
}
```

### locales/langs/en-US.json (英文语言包)

```json
{
  "common": {
    "confirm": "Confirm",
    "cancel": "Cancel",
    "submit": "Submit",
    "reset": "Reset",
    "search": "Search",
    "add": "Add",
    "edit": "Edit",
    "delete": "Delete",
    "view": "View",
    "save": "Save",
    "close": "Close"
  },
  "menu": {
    "dashboard": "Dashboard",
    "about": "About"
  },
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome to Enterprise Vue3 Application"
  },
  "about": {
    "title": "About",
    "description": "This is an enterprise-level application template based on Vue3 + Vite + TypeScript"
  }
}
```

### utils/theme.ts (主题切换工具)

```typescript
// utils/theme.ts
import { useAppStore } from '@/store'

/**
 * 切换主题
 * @param theme 主题名称
 */
export function toggleTheme(theme?: string) {
  const appStore = useAppStore()
  const newTheme = theme || (appStore.currentTheme === 'light' ? 'dark' : 'light')
  
  // 更新状态
  appStore.toggleTheme(newTheme)
  
  // 更新 DOM
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

/**
 * 初始化主题
 */
export function initTheme() {
  const appStore = useAppStore()
  
  if (appStore.currentTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
```

### styles/variables.scss (SCSS 变量)

```scss
// styles/variables.scss
// 主题变量
:root {
  // 主色调
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  
  // 文字颜色
  --text-color-primary: #333;
  --text-color-secondary: #666;
  --text-color-disabled: #999;
  
  // 背景颜色
  --bg-color-primary: #ffffff;
  --bg-color-secondary: #f5f5f5;
  
  // 边框颜色
  --border-color: #d9d9d9;
  
  // 阴影
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

// 暗色主题
:root.dark {
  // 文字颜色
  --text-color-primary: #fff;
  --text-color-secondary: #ccc;
  --text-color-disabled: #999;
  
  // 背景颜色
  --bg-color-primary: #1f1f1f;
  --bg-color-secondary: #262626;
  
  // 边框颜色
  --border-color: #434343;
  
  // 阴影
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
}
```

### styles/index.scss (全局样式)

```scss
// styles/index.scss
@import './variables.scss';

// 重置样式
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  font-size: 14px;
  line-height: 1.5715;
  color: var(--text-color-primary);
  background-color: var(--bg-color-primary);
}

// 滚动条样式
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

// 工具类
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ml-10 {
  margin-left: 10px;
}

.mr-10 {
  margin-right: 10px;
}

.mt-10 {
  margin-top: 10px;
}

.mb-10 {
  margin-bottom: 10px;
}

.p-10 {
  padding: 10px;
}

// 暗色主题适配
.dark {
  color-scheme: dark;
}
```

## 7. 组件示例

### components/ThemeSwitcher.vue (主题切换组件)

```vue
<!-- components/ThemeSwitcher.vue -->
<template>
  <a-switch
    v-model:checked="isDark"
    checked-children="Dark"
    un-checked-children="Light"
    @change="handleThemeChange"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAppStore } from '@/store'
import { toggleTheme } from '@/utils/theme'

const appStore = useAppStore()
const isDark = ref(appStore.currentTheme === 'dark')

// 监听主题变化
watch(
  () => appStore.currentTheme,
  (newTheme) => {
    isDark.value = newTheme === 'dark'
  }
)

// 处理主题切换
const handleThemeChange = () => {
  toggleTheme()
}
</script>
```

### components/LanguageSwitcher.vue (语言切换组件)

```vue
<!-- components/LanguageSwitcher.vue -->
<template>
  <a-dropdown>
    <a-button type="link">
      {{ currentLocale === 'zh-CN' ? '中文' : 'English' }}
      <DownOutlined />
    </a-button>
    <template #overlay>
      <a-menu @click="handleLocaleChange">
        <a-menu-item key="zh-CN">中文</a-menu-item>
        <a-menu-item key="en-US">English</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { DownOutlined } from '@ant-design/icons-vue'

const appStore = useAppStore()
const { locale } = useI18n()

// 当前语言
const currentLocale = computed(() => appStore.currentLocale)

// 处理语言切换
const handleLocaleChange = ({ key }: { key: string }) => {
  appStore.setLocale(key)
  locale.value = key
}
</script>
```

## 8. 页面示例

### views/dashboard/index.vue (仪表盘页面)

```vue
<!-- views/dashboard/index.vue -->
<template>
  <div class="dashboard">
    <a-row :gutter="24">
      <a-col :span="24">
        <a-card>
          <template #title>
            <h2>{{ $t('dashboard.title') }}</h2>
          </template>
          <p>{{ $t('dashboard.welcome') }}</p>
        </a-card>
      </a-col>
      
      <a-col :span="12">
        <a-card title="图表示例">
          <div ref="chartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
      
      <a-col :span="12">
        <a-card title="流程图示例">
          <div ref="graphRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { Graph } from '@antv/x6'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 图表引用
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 流程图引用
const graphRef = ref<HTMLDivElement | null>(null)
let graphInstance: Graph | null = null

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    
    // 图表配置
    const option = {
      title: {
        text: '销售统计'
      },
      tooltip: {},
      xAxis: {
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20, 8]
        }
      ]
    }
    
    chartInstance.setOption(option)
  }
}

// 初始化流程图
const initGraph = () => {
  if (graphRef.value) {
    graphInstance = new Graph({
      container: graphRef.value,
      width: graphRef.value.offsetWidth,
      height: graphRef.value.offsetHeight,
      grid: true,
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true
      },
      connecting: {
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 8
          }
        }
      }
    })
    
    // 添加节点
    const rect = graphInstance.addNode({
      shape: 'rect',
      x: 40,
      y: 40,
      width: 80,
      height: 40,
      label: '开始'
    })
    
    const circle = graphInstance.addNode({
      shape: 'circle',
      x: 180,
      y: 180,
      width: 40,
      height: 40,
      label: '结束'
    })
    
    // 添加边
    graphInstance.addEdge({
      source: rect,
      target: circle,
      label: '流程'
    })
  }
}

// 组件挂载时初始化
onMounted(() => {
  initChart()
  initGraph()
})

// 组件卸载前清理
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  
  if (graphInstance) {
    graphInstance.dispose()
  }
})

// 窗口大小改变时重置图表大小
window.addEventListener('resize', () => {
  if (chartInstance) {
    chartInstance.resize()
  }
  
  if (graphInstance && graphRef.value) {
    graphInstance.resize(graphRef.value.offsetWidth, graphRef.value.offsetHeight)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
}
</style>
```

## 9. package.json 脚本配置

```json
{
  "name": "enterprise-vue3-project",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.vue",
    "lint:fix": "eslint src --ext .ts,.vue --fix",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "@antv/x6": "^2.18.1",
    "ant-design-vue": "^4.2.3",
    "axios": "^1.7.2",
    "echarts": "^5.5.1",
    "pinia": "^2.2.2",
    "vue": "^3.4.37",
    "vue-i18n": "^9.13.1",
    "vue-router": "^4.4.3"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@babel/preset-env": "^7.25.3",
    "@babel/preset-typescript": "^7.24.7",
    "@types/node": "^22.2.0",
    "@typescript-eslint/eslint-plugin": "^8.0.1",
    "@typescript-eslint/parser": "^8.0.1",
    "@vitejs/plugin-vue": "^5.1.2",
    "eslint": "^8.57.0",
    "eslint-config-standard": "^17.1.0",
    "eslint-plugin-vue": "^9.27.0",
    "sass": "^1.77.8",
    "sass-loader": "^16.0.0",
    "typescript": "^5.5.4",
    "vite": "^5.4.0",
    "vue-tsc": "^2.0.29"
  }
}
```

这个企业级 Vue3 项目模板包含了您要求的所有功能：

1. **基础配置**：Vite + Vue3 + TypeScript + Babel + ESLint
2. **核心插件**：Vue Router、Pinia、Axios 二次封装
3. **UI 组件**：Ant Design Vue、Antv X6、ECharts
4. **工程化配置**：环境变量、路径别名、代理配置、按需引入
5. **高级功能**：换肤、自定义主题、国际化
6. **项目结构**：清晰的目录结构和模块划分

您可以根据实际需求进一步扩展和定制这个模板。