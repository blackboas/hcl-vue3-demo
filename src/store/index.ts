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