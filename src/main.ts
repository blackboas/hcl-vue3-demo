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