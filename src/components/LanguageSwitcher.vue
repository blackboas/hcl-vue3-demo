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