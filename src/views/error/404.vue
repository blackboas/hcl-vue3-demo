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