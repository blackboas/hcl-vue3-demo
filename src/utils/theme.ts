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