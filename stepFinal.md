# 企业级 Vue3 项目完整搭建指南

## 项目概述

本指南详细记录了使用 Vite 搭建企业级 Vue3 项目的完整过程，包含所有配置文件、代码示例和注意事项。

## 1. 项目初始化

### 1.1 创建项目基础结构

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

### 1.2 安装核心依赖

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

# 安装图标库
npm install @ant-design/icons-vue

# 安装 Babel 相关依赖
npm install -D @babel/core @babel/preset-env @babel/preset-typescript

# 安装 ESLint 相关依赖
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D eslint-plugin-vue eslint-config-standard
```

## 2. 配置文件

### 2.1 vite.config.ts

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

### 2.2 tsconfig.json

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

### 2.3 tsconfig.node.json

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

### 2.4 .eslintrc.cjs

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

### 2.5 .gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
.web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test
.env.production

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# Vite
dist
.vite

# IDE
.vscode
.idea
```

## 3. 环境变量配置

### 3.1 .env

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

### 3.2 .env.development

```env
NODE_ENV=development
VITE_APP_API_URL=http://localhost:8080
```

### 3.3 .env.production

```env
NODE_ENV=production
VITE_APP_API_URL=https://api.yourdomain.com
```

### 3.4 .env.test

```env
NODE_ENV=test
VITE_APP_API_URL=https://test-api.yourdomain.com
```

## 4. 项目结构

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

## 5. 核心功能实现

### 5.1 main.ts

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

### 5.2 router/index.ts

```typescript
// src/router/index.ts
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

### 5.3 store/index.ts

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

### 5.4 api/request.ts

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

### 5.5 api/modules/user.ts

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

### 5.6 locales/index.ts

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

### 5.7 locales/langs/zh-CN.json

```json
{
  "common": {
    "appTitle": "企业管理系统",
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
    "close": "关闭",
    "backHome": "返回首页",
    "logout": "退出登录",
    "footer": "企业管理系统",
    "login": "登录"
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
  },
  "error": {
    "404": {
      "title": "404",
      "description": "抱歉，您访问的页面不存在"
    }
  },
  "login": {
    "title": "系统登录",
    "username": "用户名",
    "password": "密码",
    "usernamePlaceholder": "请输入用户名",
    "passwordPlaceholder": "请输入密码",
    "usernameRequired": "请输入用户名",
    "passwordRequired": "请输入密码",
    "loginSuccess": "登录成功",
    "loginFailed": "登录失败，请检查用户名和密码"
  }
}
```

### 5.8 locales/langs/en-US.json

```json
{
  "common": {
    "appTitle": "Enterprise Management System",
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
    "close": "Close",
    "backHome": "Back Home",
    "logout": "Logout",
    "footer": "Enterprise Management System",
    "login": "Login"
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
  },
  "error": {
    "404": {
      "title": "404",
      "description": "Sorry, the page you visited does not exist"
    }
  },
  "login": {
    "title": "System Login",
    "username": "Username",
    "password": "Password",
    "usernamePlaceholder": "Please enter username",
    "passwordPlaceholder": "Please enter password",
    "usernameRequired": "Please enter username",
    "passwordRequired": "Please enter password",
    "loginSuccess": "Login successful",
    "loginFailed": "Login failed, please check username and password"
  }
}
```

### 5.9 utils/theme.ts

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

### 5.10 utils/index.ts

```typescript
// utils/index.ts
/**
 * 工具函数集合
 */

/**
 * 防抖函数
 * @param func 需要防抖的函数
 * @param delay 延迟时间(ms)
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * 节流函数
 * @param func 需要节流的函数
 * @param delay 延迟时间(ms)
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastExecTime = 0
  
  return function (...args: Parameters<T>) {
    const now = Date.now()
    
    if (now - lastExecTime >= delay) {
      func.apply(this, args)
      lastExecTime = now
    }
  }
}

/**
 * 格式化日期
 * @param date 日期对象
 * @param format 格式化字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 深拷贝对象
 * @param obj 需要深拷贝的对象
 * @returns 深拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}
```

### 5.11 styles/variables.scss

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

### 5.12 styles/index.scss

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

## 6. 组件实现

### 6.1 layouts/MainLayout.vue

```vue
<!-- src/layouts/MainLayout.vue -->
<template>
  <a-layout class="layout-container">
    <!-- 侧边栏 -->
    <a-layout-sider 
      v-model:collapsed="collapsed" 
      :trigger="null" 
      collapsible
      width="256"
    >
      <div class="logo">
        <span v-if="!collapsed">{{ $t('common.appTitle') }}</span>
      </div>
      
      <!-- 菜单 -->
      <a-menu 
        v-model:selectedKeys="selectedKeys" 
        theme="dark" 
        mode="inline"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <template #icon>
            <DashboardOutlined />
          </template>
          <span>{{ $t('menu.dashboard') }}</span>
        </a-menu-item>
        
        <a-menu-item key="about">
          <template #icon>
            <InfoCircleOutlined />
          </template>
          <span>{{ $t('menu.about') }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    
    <!-- 主体内容 -->
    <a-layout>
      <!-- 头部 -->
      <a-layout-header class="layout-header">
        <div class="header-left">
          <component
            :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
        </div>
        
        <div class="header-right">
          <!-- 主题切换 -->
          <ThemeSwitcher />
          
          <!-- 语言切换 -->
          <LanguageSwitcher class="ml-10" />
          
          <!-- 用户信息 -->
          <a-dropdown>
            <a-avatar class="ml-10" :size="32">U</a-avatar>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;" @click="handleLogout">
                    <LogoutOutlined />
                    <span class="ml-8">{{ $t('common.logout') }}</span>
                  </a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      
      <!-- 内容区域 -->
      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
      
      <!-- 底部 -->
      <a-layout-footer class="layout-footer">
        {{ $t('common.footer') }} ©{{ new Date().getFullYear() }}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// 状态
const collapsed = ref(false)
const selectedKeys = reactive<string[]>([])

// 监听路由变化更新选中菜单
watch(
  () => route.path,
  (newPath) => {
    // 根据当前路径设置选中的菜单项
    if (newPath === '/dashboard') {
      selectedKeys[0] = 'dashboard'
    } else if (newPath === '/about') {
      selectedKeys[0] = 'about'
    }
  },
  { immediate: true }
)

// 菜单点击处理
const handleMenuClick = ({ key }: { key: string }) => {
  if (key === 'dashboard') {
    router.push('/dashboard')
  } else if (key === 'about') {
    router.push('/about')
  }
}

// 用户登出处理
const handleLogout = () => {
  // 清除本地存储
  localStorage.removeItem('access_token')
  
  // 跳转到登录页（如果有的话）
  // router.push('/login')
  console.log('用户登出')
}
</script>

<style scoped lang="scss">
.layout-container {
  min-height: 100vh;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--bg-color-primary);
  box-shadow: var(--box-shadow);
  
  .header-left,
  .header-right {
    display: flex;
    align-items: center;
  }
  
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    
    &:hover {
      color: var(--primary-color);
    }
  }
}

.layout-content {
  margin: 24px;
  padding: 24px;
  background: var(--bg-color-primary);
  min-height: 280px;
  border-radius: 4px;
  box-shadow: var(--box-shadow);
}

.layout-footer {
  text-align: center;
  background: var(--bg-color-primary);
  color: var(--text-color-secondary);
}

.ml-8 {
  margin-left: 8px;
}
</style>
```

### 6.2 components/ThemeSwitcher.vue

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

### 6.3 components/LanguageSwitcher.vue

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

### 6.4 views/dashboard/index.vue

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

### 6.5 views/about/index.vue

```vue
<!-- views/about/index.vue -->
<template>
  <div class="about">
    <a-card>
      <template #title>
        <h2>{{ $t('about.title') }}</h2>
      </template>
      
      <a-row :gutter="24">
        <a-col :span="24">
          <p>{{ $t('about.description') }}</p>
        </a-col>
        
        <a-col :span="12">
          <a-card title="技术栈" size="small">
            <ul>
              <li>Vue 3</li>
              <li>Vite</li>
              <li>TypeScript</li>
              <li>Ant Design Vue</li>
              <li>Pinia</li>
              <li>Vue Router</li>
            </ul>
          </a-card>
        </a-col>
        
        <a-col :span="12">
          <a-card title="功能特性" size="small">
            <ul>
              <li>国际化支持</li>
              <li>主题切换</li>
              <li>响应式设计</li>
              <li>权限控制</li>
              <li>图表展示</li>
              <li>流程图编辑</li>
            </ul>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.about {
  padding: 24px;
}

ul {
  list-style: none;
  padding-left: 0;
}

li {
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
}

li:before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: 0;
}
</style>
```

### 6.6 views/error/404.vue

```vue
<!-- views/error/404.vue -->
<template>
  <div class="not-found">
    <a-result status="404" :title="$t('error.404.title')" :sub-title="$t('error.404.description')">
      <template #extra>
        <a-button type="primary" @click="handleBackHome">
          {{ $t('common.backHome') }}
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const handleBackHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
```

### 6.7 views/login/index.vue

```vue
<!-- src/views/login/index.vue -->
<template>
  <div class="login-container">
    <a-card class="login-card">
      <template #title>
        <h2>{{ $t('login.title') }}</h2>
      </template>
      
      <a-form
        :model="formState"
        :rules="rules"
        ref="formRef"
        @finish="handleLogin"
      >
        <a-form-item name="username" :label="$t('login.username')">
          <a-input
            v-model:value="formState.username"
            :placeholder="$t('login.usernamePlaceholder')"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item name="password" :label="$t('login.password')">
          <a-input-password
            v-model:value="formState.password"
            :placeholder="$t('login.passwordPlaceholder')"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            block
          >
            {{ $t('common.login') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'

const router = useRouter()
const { t } = useI18n()

// 表单引用
const formRef = ref()

// 表单状态
const formState = reactive({
  username: '',
  password: ''
})

// 加载状态
const loading = ref(false)

// 表单规则
const rules = {
  username: [
    {
      required: true,
      message: t('login.usernameRequired'),
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('login.passwordRequired'),
      trigger: 'blur'
    }
  ]
}

// 登录处理
const handleLogin = async () => {
  try {
    loading.value = true
    
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 保存 token
    localStorage.setItem('access_token', 'fake-token')
    
    // 跳转到首页
    router.push('/')
    
    message.success(t('login.loginSuccess'))
  } catch (error) {
    message.error(t('login.loginFailed'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  max-width: 90%;
}
</style>
```

### 6.8 App.vue

```vue
<!-- App.vue -->
<template>
  <a-config-provider :locale="antdLocale">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store'
import { useI18n } from 'vue-i18n'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'

const appStore = useAppStore()
const { locale } = useI18n()

// Ant Design Vue 语言包
const antdLocale = computed(() => {
  return appStore.currentLocale === 'zh-CN' ? zhCN : enUS
})

// 监听语言变化并设置 Ant Design Vue 语言包
// 这里可以通过 watch 监听 locale 变化来动态切换
</script>

<style lang="scss">
@import '@/styles/index.scss';
</style>
```

## 7. package.json 脚本配置

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
    "@ant-design/icons-vue": "^7.0.1",
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

## 8. README.md

```markdown
# Enterprise Vue3 Project

基于 Vue3 + Vite + TypeScript 的企业级应用模板

## 技术栈

- Vue 3 (Composition API)
- Vite 5
- TypeScript
- Ant Design Vue 4
- Pinia (状态管理)
- Vue Router 4
- Axios
- ECharts 5
- AntV X6
- Vue I18n 9

## 功能特性

- 🌍 国际化支持 (i18n) - 支持多语言切换
- 🎨 主题切换 (暗色/亮色) - 支持动态主题切换
- 📱 响应式设计 - 适配不同屏幕尺寸
- 🔐 权限控制 - 基于角色的访问控制
- 📊 图表展示 - 使用 ECharts 进行数据可视化
- 🗺️ 流程图编辑 - 使用 AntV X6 进行流程图设计
- ✅ 代码规范 (ESLint/TSLint) - 统一代码风格
- ⚙️ 环境变量配置 - 支持多环境配置
- 📍 路径别名 - 简化模块导入路径
- 🌐 代理配置 - 解决开发环境跨域问题
- 📦 按需加载 - 优化打包体积
- 🚀 自动导入 - 自动导入组件和API

## 项目结构

```
src/
├── api/                 # API 接口封装
│   ├── request.ts       # Axios 二次封装
│   └── modules/         # 各模块 API
├── assets/              # 静态资源
│   ├── images/          # 图片资源
│   └── icons/           # 图标资源
├── components/          # 公共组件
├── layouts/             # 布局组件
├── locales/             # 国际化文件
│   ├── index.ts         # i18n 配置
│   └── langs/           # 语言包
├── router/              # 路由配置
├── store/               # 状态管理
├── styles/              # 样式文件
├── utils/               # 工具函数
├── views/               # 页面组件
├── App.vue             # 根组件
└── main.ts             # 入口文件
```

## 环境变量

项目使用 `.env` 文件管理环境变量：

- `.env` - 默认环境变量
- `.env.development` - 开发环境
- `.env.production` - 生产环境
- `.env.test` - 测试环境

### 环境变量示例

```bash
# 应用端口
VITE_APP_PORT=3000

# API 配置
VITE_APP_BASE_API=/api
VITE_APP_API_URL=http://localhost:8080

# 应用配置
VITE_APP_TITLE=企业级 Vue3 应用
VITE_APP_THEME=light
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 本地预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

### 修复代码问题

```bash
npm run lint:fix
```

### 类型检查

```bash
npm run type-check
```

## 配置说明

### 路径别名

项目配置了以下路径别名，方便模块导入：

- [@](file://c:\Users\blackboas\Desktop\H5\hcl-vue3-demo\vite.config.ts#L6-L71) - src 目录
- `@components` - src/components 目录
- `@views` - src/views 目录
- `@utils` - src/utils 目录
- `@assets` - src/assets 目录
- `@store` - src/store 目录
- [@router](file://c:\Users\blackboas\Desktop\H5\hcl-vue3-demo\src\router\index.ts#L47-L50) - src/router 目录
- `@locales` - src/locales 目录

使用示例：
```typescript
import HelloWorld from '@components/HelloWorld.vue'
import { useAppStore } from '@store/index.ts'
```

### 主题切换

支持亮色和暗色主题切换，主题状态保存在 localStorage 中：

```typescript
// 切换主题
import { toggleTheme } from '@utils/theme'

toggleTheme() // 自动切换
toggleTheme('dark') // 切换到暗色主题
toggleTheme('light') // 切换到亮色主题
```

### 国际化

支持多语言切换，语言状态保存在 localStorage 中：

```typescript
// 在组件中使用
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
t('common.confirm') // 获取翻译文本
```

### Axios 封装

项目对 Axios 进行了二次封装，包含以下特性：

- 请求/响应拦截器
- Token 自动添加
- 错误统一处理
- Loading 状态管理

使用示例：
```typescript
import request from '@api/request'

// GET 请求
request.get('/users')

// POST 请求
request.post('/users', { name: 'John' })
```

### 路由配置

路由采用模块化配置，支持：

- 嵌套路由
- 动态路由
- 路由守卫
- 路由元信息

### 状态管理

使用 Pinia 进行状态管理，特性包括：

- TypeScript 支持
- 热重载
- 服务端渲染支持
- 模块化设计

## 组件开发

### 创建新组件

在 `src/components/` 目录下创建新组件：

```vue
<!-- components/MyComponent.vue -->
<template>
  <div class="my-component">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello World')
</script>

<style scoped>
.my-component {
  color: var(--primary-color);
}
</style>
```

### 自动导入组件

项目支持自动导入 `components/` 目录下的组件，无需手动导入：

```vue
<template>
  <div>
    <!-- 直接使用，无需导入 -->
    <HelloWorld />
  </div>
</template>
```

## 样式规范

### CSS 变量

项目使用 CSS 变量定义主题色：

```css
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
}
```

### SCSS 支持

项目支持 SCSS 预处理器：

```scss
.dashboard {
  padding: 24px;
  
  &__header {
    margin-bottom: 24px;
  }
}
```

## 部署指南

### 构建生产版本

```bash
npm run build
```

构建后的文件位于 `dist/` 目录下。

### 部署到服务器

将 `dist/` 目录下的所有文件部署到 Web 服务器即可。

### Docker 部署

项目支持 Docker 部署：

```dockerfile
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

## 浏览器支持

- Chrome >= 80
- Firefox >= 74
- Safari >= 13
- Edge >= 80

## 常见问题

### 如何添加新的页面？

1. 在 `src/views/` 目录下创建页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 在 `src/layouts/MainLayout.vue` 中添加菜单项

### 如何添加新的 API 接口？

1. 在 `src/api/modules/` 目录下创建对应模块文件
2. 导出相关接口方法
3. 在组件中导入使用

### 如何添加新的语言？

1. 在 `src/locales/langs/` 目录下创建语言包文件
2. 在 `src/locales/index.ts` 中注册语言包
3. 在语言切换组件中添加对应选项

## License

MIT

---

**提示**: 开发过程中请遵循团队代码规范，使用 `npm run lint` 检查代码质量。
```

## 总结

这份完整的企业级 Vue3 项目搭建指南包含了以下核心内容：

1. **项目初始化** - 从零开始创建项目并安装所有必要依赖
2. **配置文件** - 包括 Vite、TypeScript、ESLint 等所有配置文件
3. **环境变量** - 多环境配置支持
4. **项目结构** - 清晰的目录结构和模块划分
5. **核心功能** - 路由、状态管理、HTTP 请求、国际化、主题切换等
6. **组件实现** - 所有核心组件的完整代码
7. **工具函数** - 常用工具函数集合
8. **样式系统** - CSS 变量和 SCSS 支持
9. **部署指南** - 项目构建和部署说明

这个项目模板提供了企业级应用开发所需的所有基础功能，可以直接用于实际项目开发，也可以根据具体需求进行扩展和定制。