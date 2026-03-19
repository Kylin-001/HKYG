// login.js 的类型声明文件
export interface LoginRequest {
  username: string
  password: string
  code?: string
}

export interface LoginResponse {
  token: string
  userInfo: {
    id: number
    username: string
    nickname: string
    avatar: string
  }
}

export interface CaptchaResponse {
  captcha: string
  captchaKey: string
}

export function login(data: LoginRequest): Promise<{ data: LoginResponse }>
export function getCaptcha(): Promise<{ data: CaptchaResponse }>
export function logout(): Promise<{ data: any }>
