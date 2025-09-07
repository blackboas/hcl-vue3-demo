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