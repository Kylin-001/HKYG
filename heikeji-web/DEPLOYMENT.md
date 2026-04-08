# 🚀 黑科易购 (heikeji-web) - 部署指南

## 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [Docker部署](#docker部署)
- [传统部署](#传统部署)
- [Nginx配置](#nginx配置)
- [HTTPS配置](#https配置)
- [性能优化](#性能优化)
- [监控告警](#监控告警)
- [故障排查](#故障排查)

---

## 环境要求

### 最低要求
- **Node.js**: >= 18.0.0 (推荐 20.x LTS)
- **npm**: >= 9.0.0 或 pnpm >= 8.0.0
- **Docker**: >= 20.10.0 (可选，用于容器化部署)
- **Docker Compose**: >= 2.0.0 (可选)
- **Nginx**: >= 1.22.0 (生产环境)
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### 推荐配置
- **CPU**: 2核+
- **内存**: 4GB+
- **磁盘**: 50GB SSD
- **带宽**: 5Mbps+

---

## 快速开始

### 1️⃣ 克隆项目
```bash
git clone https://github.com/HKYG/heikeji-web.git
cd heikeji-web
```

### 2️⃣ 安装依赖
```bash
npm install
# 或使用 pnpm (更快)
pnpm install
```

### 3️⃣ 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入实际配置值
nano .env
```

### 4️⃣ 构建项目
```bash
npm run build
```

### 5️⃣ 启动开发服务器（测试）
```bash
npm run dev
```

访问 http://localhost:5174 查看应用

---

## Docker部署（推荐）

### 方式一：使用Docker Compose（完整栈）

#### 前置准备
```bash
# 安装Docker和Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# 验证安装
docker --version
docker compose version
```

#### 一键部署
```bash
# 赋予脚本执行权限
chmod +x scripts/deploy.sh

# 执行部署
./scripts/deploy.sh deploy
```

#### 管理命令
```bash
./scripts/deploy.sh start      # 启动服务
./scripts/deploy.sh stop       # 停止服务
./scripts/deploy.sh restart    # 重启服务
./scripts/deploy.sh logs       # 查看日志
./scripts/deploy.sh status     # 查看状态
./scripts/deploy.sh backup     # 备份数据
./scripts/deploy.sh benchmark  # 性能测试
./scripts/deploy.sh shell      # 进入容器
./scripts/deploy.sh cleanup    # 清理资源
```

### 方式二：仅构建前端镜像

#### 构建镜像
```bash
docker build -t heikeji-web:latest .
```

#### 运行容器
```bash
docker run -d \
  --name heikeji-web \
  -p 80:80 \
  -p 443:443 \
  -v $(pwd)/ssl:/etc/nginx/ssl:ro \
  heikeji-web:latest
```

#### 更新部署
```bash
# 重新构建并重启
docker build -t heikeji-web:latest .
docker stop heikeji-web && docker rm heikeji-web
docker run -d --name heikeji-web -p 80:80 heikeji-web:latest
```

---

## 传统部署（非Docker）

### 1. 构建项目
```bash
npm run build
```

产物将生成在 `dist/` 目录。

### 2. 安装Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx -y
```

### 3. 配置Nginx
复制 `docker/nginx.conf` 到Nginx配置目录：
```bash
sudo cp docker/nginx.conf /etc/nginx/sites-available/heikeji-web
sudo ln -s /etc/nginx/sites-available/heikeji-web /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```

### 4. 部署文件
```bash
# 复制构建产物到Nginx目录
sudo cp -r dist/* /var/www/html/heikeji-web/

# 设置权限
sudo chown -R www-data:www-data /var/www/html/heikeji-web/
```

### 5. 启动Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## Nginx配置详解

### 基础配置（见 `docker/nginx.conf`）
- Gzip压缩
- 静态资源缓存
- SPA路由支持
- API代理
- WebSocket支持
- 安全头设置

### 性能优化配置
```nginx
# 开启Brotli压缩（需安装模块）
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript;

# 缓存策略
location ~* \.(js|css)$ {
    expires 30d;
    add_header Cache-Control "public, no-transform";
}

location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## HTTPS配置

### 使用Let's Encrypt免费证书

#### 1. 安装Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 2. 获取证书
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### 3. 自动续期
Certbot会自动添加cron任务进行续期。验证：
```bash
sudo certbot renew --dry-run
```

### 手动证书配置
如果有商业证书，修改 `docker/nginx.conf`：
```nginx
server {
    listen 443 ssl http2;
    server_name www.heikeji.com;
    
    ssl_certificate     /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/nginx/ssl/chain.pem;
    
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
}
```

---

## 性能优化

### 构建优化
已在 `vite.config.ts` 中配置：
- Brotli/Gzip压缩
- 代码分割
- Tree-shaking
- CSS提取和压缩

### 运行时优化
1. **启用CDN**：将静态资源上传到CDN
2. **启用HTTP/2**：Nginx默认支持
3. **预加载关键资源**
4. **Service Worker缓存**

### 数据库优化
```yaml
# docker-compose.yml中的MongoDB配置
mongo:
  command:
    - --wiredTigerCacheSizeGB 2
    - --wiredTigerJournalCompressor zlib
```

---

## 监控告警

### 内置监控
应用已集成：
- Core Web Vitals采集
- 错误上报
- 性能数据收集

### 推荐监控方案

#### 1. Uptime Monitoring
- **UptimeRobot**: 免费监控5个站点
- **Pingdom**: 综合性能监控
- **Grafana + Prometheus**: 自建监控

#### 2. APM（应用性能监控）
- **Sentry**: 错误追踪和性能监控
- **New Relic**: 全栈APM
- **Datadog**: 云原生监控

#### 3. 日志管理
- **ELK Stack**: Elasticsearch + Logstash + Kibana
- **Loki + Grafana**: 轻量级日志方案

### 告警规则示例
```yaml
# 告警规则建议
alerts:
  - name: 高错误率
    condition: error_rate > 1%
    window: 5m
    action: notify(slack, email)
    
  - name: 响应时间过长
    condition: p95_latency > 3000ms
    window: 10m
    action: auto_scale
    
  - name: 服务不可用
    condition: availability < 99.9%
    window: 60m
    action: alert(oncall), rollback
```

---

## 故障排查

### 常见问题

#### 1. 页面404
```bash
# 检查Nginx配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 检查dist目录是否存在
ls -la /var/www/html/heikeji-web/
```

#### 2. API代理失败
```bash
# 测试后端连通性
curl http://localhost:3000/api/health

# 检查后端日志
docker logs heikeji-api
```

#### 3. HTTPS证书问题
```bash
# 检查证书有效期
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# 测试SSL Labs评级
# 访问 https://www.ssllabs.com/ssltest/
```

#### 4. 性能问题
```bash
# 运行Lighthouse审计
npx lighthouse https://yourdomain.com --output html --output-path ./report.html

# 分析Bundle大小
npm run analyze
```

### 日志位置
```bash
# Docker日志
docker logs heikeji-web

# Nginx访问日志
/var/log/nginx/access.log

# Nginx错误日志
/var/log/nginx/error.log

# 应用日志（如果在容器内）
docker exec heikeji-web cat /var/log/nginx/error.log
```

---

## 备份与恢复

### 自动备份
```bash
# 添加到crontab
0 2 * * * /path/to/scripts/deploy.sh backup >> /var/log/backup.log 2>&1
```

### 手动备份
```bash
# 备份所有数据
./scripts/deploy.sh backup

# 仅备份数据库
docker exec heikeji-mongo mongodump --archive=/data/db/backup.archive
docker cp heikeji-mongo:/data/db/backup.archive ./mongo-backup-$(date +%Y%m%d).archive
```

### 恢复数据
```bash
# 恢复MongoDB
docker cp ./backup.archive heikeji-mongo:/data/db/restore.archive
docker exec heikeji-mongo mongorestore --archive=/data/db/restore.archive --drop
```

---

## CI/CD流水线

项目已包含GitHub Actions配置（`.github/workflows/ci-cd.yml`），自动执行：

1. ✅ Lint检查
2. ✅ 单元测试
3. ✅ E2E测试
4. ✅ 构建
5. ✅ Docker镜像构建
6. ✅ 部署到staging/production

### 手动触发部署
```bash
# 创建tag触发部署
git tag v1.0.0
git push origin v1.0.0

# 或手动触发workflow
gh workflow run ci-cd.yml -f main
```

---

## 安全最佳实践

### 定期安全审计
```bash
# 运行内置安全审计工具
node scripts/security-audit.mjs

# 使用npm audit检查依赖漏洞
npm audit

# 使用Snyk扫描（推荐）
npx snyk test
```

### 安全检查清单
- [ ] 所有环境变量已正确配置
- [ ] .env文件已添加到.gitignore
- [ ] HTTPS已启用且配置正确
- [ ] 安全头已设置
- [ ] CORS配置合理
- [ ] 依赖定期更新
- [ ] 定期备份
- [ ] 访问日志已启用
- [ ] 防火墙规则已配置
- [ ] DDoS防护已启用

---

## 扩展阅读

- [Vite官方文档](https://vitejs.dev/)
- [Vue 3文档](https://vuejs.org/)
- [Nginx性能优化指南](https://www.nginx.com/blog/nginx-tuning-10g-starttls-stop-shutting-databases-when-you-can/)
- [Web.dev性能优化](https://web.dev/performance/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## 技术支持

如遇问题，请：

1. 查看[常见问题FAQ](docs/faq.md)
2. 搜索[Issues](https://github.com/HKYG/heikeji-web/issues)
3. 提交新的Issue描述问题
4. 联系运维团队

---

**最后更新**: 2026-04-05  
**维护团队**: 黑科易购技术部
