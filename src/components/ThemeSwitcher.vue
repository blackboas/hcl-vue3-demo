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