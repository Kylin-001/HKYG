// auth.js 的类型声明文件
export function getToken(): string | null
export function setToken(token: string): void
export function removeToken(): void
export function getUserId(): number | null
export function setUserId(userId: number): void
export function removeUserId(): void
