# ============================================
# 黑科易购 (heikeji-web) - 生产环境Dockerfile
# 多阶段构建：优化镜像大小和安全性
# ============================================

# 阶段1: 依赖安装
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# 阶段2: 构建
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV VITE_API_BASE_URL=/api
VITE_APP_TITLE=黑科易购

RUN npx vite build

# 阶段3: 生产镜像（使用Nginx提供静态文件服务）
FROM nginx:1.25-alpine AS production

# 安装安全工具
RUN apk add --no-cache tzdata curl

# 设置时区
ENV TZ=Asia/Shanghai

# 复制自定义Nginx配置
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制安全头配置
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf

# 暴露端口
EXPOSE 80 443

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]

# ============================================
# 开发环境镜像（可选）
# ============================================
FROM node:20-alpine AS development
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
