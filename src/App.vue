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