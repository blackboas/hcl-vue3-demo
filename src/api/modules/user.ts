// api/modules/user.ts
import request from '@/api/request'
import type { AxiosPromise } from 'axios'

// 定义用户类型
export interface UserInfo {
  id: number
  username: string
  email: string
  avatar?: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}

// 用户相关 API
export class UserAPI {
  /**
   * 用户登录
   * @param data 登录参数
   */
  static login(data: LoginParams): AxiosPromise<LoginResponse> {
    return request({
      url: '/auth/login',
      method: 'post',
      data
    })
  }
  
  /**
   * 获取用户信息
   */
  static getUserInfo(): AxiosPromise<UserInfo> {
    return request({
      url: '/user/info',
      method: 'get'
    })
  }
  
  /**
   * 用户登出
   */
  static logout(): AxiosPromise<void> {
    return request({
      url: '/auth/logout',
      method: 'post'
    })
  }
}