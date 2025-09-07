<!-- src/layouts/MainLayout.vue -->
<template>
  <a-layout class="layout-container">
    <!-- 侧边栏 -->
    <a-layout-sider 
      v-model:collapsed="collapsed" 
      :trigger="null" 
      collapsible
      width="256"
    >
      <div class="logo">
        <span v-if="!collapsed">{{ $t('common.appTitle') }}</span>
      </div>
      
      <!-- 菜单 -->
      <a-menu 
        v-model:selectedKeys="selectedKeys" 
        theme="dark" 
        mode="inline"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <template #icon>
            <DashboardOutlined />
          </template>
          <span>{{ $t('menu.dashboard') }}</span>
        </a-menu-item>
        
        <a-menu-item key="about">
          <template #icon>
            <InfoCircleOutlined />
          </template>
          <span>{{ $t('menu.about') }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    
    <!-- 主体内容 -->
    <a-layout>
      <!-- 头部 -->
      <a-layout-header class="layout-header">
        <div class="header-left">
          <component
            :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
        </div>
        
        <div class="header-right">
          <!-- 主题切换 -->
          <ThemeSwitcher />
          
          <!-- 语言切换 -->
          <LanguageSwitcher class="ml-10" />
          
          <!-- 用户信息 -->
          <a-dropdown>
            <a-avatar class="ml-10" :size="32">U</a-avatar>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;" @click="handleLogout">
                    <LogoutOutlined />
                    <span class="ml-8">{{ $t('common.logout') }}</span>
                  </a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      
      <!-- 内容区域 -->
      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
      
      <!-- 底部 -->
      <a-layout-footer class="layout-footer">
        {{ $t('common.footer') }} ©{{ new Date().getFullYear() }}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// 状态
const collapsed = ref(false)
const selectedKeys = reactive<string[]>([])

// 监听路由变化更新选中菜单
watch(
  () => route.path,
  (newPath) => {
    // 根据当前路径设置选中的菜单项
    if (newPath === '/dashboard') {
      selectedKeys[0] = 'dashboard'
    } else if (newPath === '/about') {
      selectedKeys[0] = 'about'
    }
  },
  { immediate: true }
)

// 菜单点击处理
const handleMenuClick = ({ key }: { key: string }) => {
  if (key === 'dashboard') {
    router.push('/dashboard')
  } else if (key === 'about') {
    router.push('/about')
  }
}

// 用户登出处理
const handleLogout = () => {
  // 清除本地存储
  localStorage.removeItem('access_token')
  
  // 跳转到登录页（如果有的话）
  // router.push('/login')
  console.log('用户登出')
}
</script>

<style scoped lang="scss">
.layout-container {
  min-height: 100vh;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--bg-color-primary);
  box-shadow: var(--box-shadow);
  
  .header-left,
  .header-right {
    display: flex;
    align-items: center;
  }
  
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    
    &:hover {
      color: var(--primary-color);
    }
  }
}

.layout-content {
  margin: 24px;
  padding: 24px;
  background: var(--bg-color-primary);
  min-height: 280px;
  border-radius: 4px;
  box-shadow: var(--box-shadow);
}

.layout-footer {
  text-align: center;
  background: var(--bg-color-primary);
  color: var(--text-color-secondary);
}

.ml-8 {
  margin-left: 8px;
}
</style>