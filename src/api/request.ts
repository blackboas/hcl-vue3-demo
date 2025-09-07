// api/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { message } from 'ant-design-vue'
import { useAppStore } from '@/store'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  // 基础URL
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 请求超时时间
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在发送请求之前做些什么
    const appStore = useAppStore()
    
    // 添加认证 token
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 添加语言头
    if (config.headers) {
      config.headers['Accept-Language'] = appStore.currentLocale
    }
    
    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    const { code, data, message: msg } = response.data
    
    // 根据自定义状态码判断请求结果
    if (code === 200) {
      return data
    } else {
      // 处理业务错误
      message.error(msg || '请求失败')
      return Promise.reject(new Error(msg || '请求失败'))
    }
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    const { response } = error
    
    if (response) {
      switch (response.status) {
        case 401:
          message.error('未授权，请重新登录')
          // 清除 token 并跳转登录页
          localStorage.removeItem('access_token')
          window.location.href = '/login'
          break
        case 403:
          message.error('拒绝访问')
          break
        case 404:
          message.error('请求地址出错')
          break
        case 500:
          message.error('服务器内部错误')
          break
        default:
          message.error(`连接错误${response.status}`)
      }
    } else {
      message.error('网络错误')
    }
    
    return Promise.reject(error)
  }
)

// 导出封装后的 axios 实例
export default service