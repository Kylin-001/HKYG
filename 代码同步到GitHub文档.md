# 代码同步到GitHub文档

## 1. 项目概述

### 1.1 项目信息
- **项目名称**: 黑科技商城 (Heikeji Mall)
- **本地代码路径**: `/home/heikeji/heikeji-mall`
- **GitHub仓库**: `https://github.com/Kylin-001/HKYG.git`
- **默认分支**: `main`

### 1.2 项目结构
```
heikeji-mall/
├── heikeji-admin/          # 管理后台
├── heikeji-common/         # 公共组件
├── heikeji-frontend/       # 前端项目
├── heikeji-mall-service/   # 微服务后端
├── heikeji-miniprogram/    # 微信小程序
├── sql/                    # 数据库脚本
└── scripts/                # 工具脚本
```

## 2. 同步准备工作

### 2.1 Git环境配置
1. **安装Git**
   ```bash
   sudo apt-get install git  # Ubuntu/Debian
   ```

2. **配置Git用户信息**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### 2.2 GitHub访问方式

#### 2.2.1 HTTPS方式 (推荐)
- 无需配置SSH密钥
- 使用GitHub用户名和个人访问令牌认证
- 配置命令:
  ```bash
  git remote set-url origin https://github.com/Kylin-001/HKYG.git
  ```

#### 2.2.2 SSH方式
- 需要将SSH公钥添加到GitHub账户
- 配置命令:
  ```bash
  git remote set-url origin git@github.com:Kylin-001/HKYG.git
  ```

## 3. 代码同步步骤

### 3.1 检查当前状态
```bash
# 查看本地文件修改状态
git status

# 查看本地分支和远程分支关系
git branch -a
```

### 3.2 添加和提交代码
```bash
# 将所有修改添加到暂存区
git add .

# 提交代码到本地仓库
git commit -m "提交描述信息"
```

### 3.3 推送代码到GitHub
```bash
# 推送当前分支到远程仓库
git push origin main

# 首次推送或关联分支
git push -u origin main
```

### 3.4 拉取远程更新
```bash
# 拉取远程最新代码（不合并）
git fetch

# 拉取并合并远程最新代码
git pull origin main
```

## 4. 同步状态验证

### 4.1 验证本地与远程同步状态
```bash
# 获取远程最新状态
git fetch

# 查看本地有而远程没有的提交
git log --oneline origin/main..main

# 查看远程有而本地没有的提交
git log --oneline main..origin/main
```

### 4.2 查看分支关联状态
```bash
# 查看当前分支关联的远程分支
git branch -vv
```

### 4.3 查看提交历史
```bash
# 查看本地提交记录
git log --oneline -n 10

# 查看远程提交记录
git log --oneline origin/main -n 10
```

## 5. 常见问题及解决方案

### 5.1 SSH连接失败
**错误信息**: `git@github.com: Permission denied (publickey)`

**解决方案**:
1. 查看SSH公钥内容
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```
2. 登录GitHub账户，添加公钥到SSH and GPG keys
3. 验证SSH连接
   ```bash
   ssh -T git@github.com
   ```

### 5.2 HTTPS推送需要输入密码
**解决方案**:
1. 创建GitHub个人访问令牌（Settings → Developer settings → Personal access tokens）
2. 使用令牌代替密码进行认证
3. 配置Git凭证缓存
   ```bash
   git config --global credential.helper cache
   git config --global credential.helper 'cache --timeout=3600'
   ```

### 5.3 推送冲突
**错误信息**: `fatal: refusing to merge unrelated histories`

**解决方案**:
1. 拉取远程代码并强制合并
   ```bash
   git pull origin main --allow-unrelated-histories
   ```
2. 解决冲突后重新提交和推送

### 5.4 无法访问远程仓库
**错误信息**: `Failed to connect to github.com port 443`

**解决方案**:
1. 检查网络连接
2. 尝试切换网络环境
3. 检查防火墙设置

## 6. 同步最佳实践

### 6.1 提交规范
- 提交信息清晰简洁
- 使用英文或中文描述
- 包含功能模块和具体修改内容
- 示例: `feat(auth): add JWT authentication`

### 6.2 分支管理
- `main`: 主分支，用于生产环境
- `develop`: 开发分支，用于集成测试
- `feature/*`: 特性分支，用于开发新功能
- `bugfix/*`: 修复分支，用于修复bug

### 6.3 同步频率
- 开发过程中建议每天至少同步一次
- 功能开发完成后立即同步
- 修复重要bug后立即同步

### 6.4 同步前检查
- 确保代码能够正常编译
- 运行相关测试用例
- 检查是否有敏感信息泄露
- 确保.gitignore配置正确

## 7. 同步状态记录

### 7.1 最近同步记录
| 同步时间 | 提交哈希 | 提交信息 | 同步结果 |
|---------|---------|---------|--------|
| 2026-01-11 | 843287e | 同步代码到GitHub | ✅ 成功 |
| 2026-01-10 | 9971c08 | Fix database password | ✅ 成功 |
| 2026-01-09 | 6c54020 | Update .gitignore | ✅ 成功 |

### 7.2 当前同步状态
- ✅ 本地分支: `main`
- ✅ 远程分支: `origin/main`
- ✅ 同步状态: **完全同步**
- ✅ 最新提交: `843287e` "同步代码到GitHub"

## 8. 附录

### 8.1 Git常用命令
| 命令 | 功能描述 |
|------|---------|
| `git init` | 初始化Git仓库 |
| `git clone <url>` | 克隆远程仓库 |
| `git add <file>` | 添加文件到暂存区 |
| `git commit -m "msg"` | 提交代码到本地仓库 |
| `git push <remote> <branch>` | 推送代码到远程仓库 |
| `git pull <remote> <branch>` | 拉取远程代码 |
| `git fetch` | 获取远程更新 |
| `git status` | 查看工作区状态 |
| `git log` | 查看提交历史 |
| `git branch` | 查看分支 |
| `git checkout <branch>` | 切换分支 |

### 8.2 联系方式
- **维护人员**: Kylin-001
- **GitHub Issues**: https://github.com/Kylin-001/HKYG/issues
- **文档更新时间**: 2026-01-11

---

**文档说明**: 本文档用于指导黑科技商城项目代码同步到GitHub的操作流程和最佳实践，定期更新以反映项目变化。