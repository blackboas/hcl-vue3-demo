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