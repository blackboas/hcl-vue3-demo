<!-- src/views/login/index.vue -->
<template>
  <div class="login-container">
    <a-card class="login-card">
      <template #title>
        <h2>{{ $t('login.title') }}</h2>
      </template>
      
      <a-form
        :model="formState"
        :rules="rules"
        ref="formRef"
        @finish="handleLogin"
      >
        <a-form-item name="username" :label="$t('login.username')">
          <a-input
            v-model:value="formState.username"
            :placeholder="$t('login.usernamePlaceholder')"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item name="password" :label="$t('login.password')">
          <a-input-password
            v-model:value="formState.password"
            :placeholder="$t('login.passwordPlaceholder')"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            block
          >
            {{ $t('common.login') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'

const router = useRouter()
const { t } = useI18n()

// 表单引用
const formRef = ref()

// 表单状态
const formState = reactive({
  username: '',
  password: ''
})

// 加载状态
const loading = ref(false)

// 表单规则
const rules = {
  username: [
    {
      required: true,
      message: t('login.usernameRequired'),
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('login.passwordRequired'),
      trigger: 'blur'
    }
  ]
}

// 登录处理
const handleLogin = async () => {
  try {
    loading.value = true
    
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 保存 token
    localStorage.setItem('access_token', 'fake-token')
    
    // 跳转到首页
    router.push('/')
    
    message.success(t('login.loginSuccess'))
  } catch (error) {
    message.error(t('login.loginFailed'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  max-width: 90%;
}
</style>