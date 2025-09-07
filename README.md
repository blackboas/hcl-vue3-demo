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