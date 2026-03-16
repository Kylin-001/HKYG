#!/bin/bash

# 项目整理清理脚本
# 执行方式: bash organize_project.sh

echo "========================================="
echo "  黑科易购项目整理脚本"
echo "========================================="
echo ""

# 1. 将Python脚本移动到tools目录
echo "[1/4] 移动Python脚本到tools目录..."
if [ -f "generate_pptx.py" ]; then
    mv generate_pptx.py tools/
    echo "  ✓ generate_pptx.py"
fi

if [ -f "read_docx_simple.py" ]; then
    mv read_docx_simple.py tools/
    echo "  ✓ read_docx_simple.py"
fi

if [ -f "docx_parser.py" ]; then
    mv docx_parser.py tools/
    echo "  ✓ docx_parser.py"
fi

# 2. 移动Markdown文档到docs目录
echo ""
echo "[2/4] 移动Markdown文档到docs目录..."
if [ -f "API_DOCS.md" ]; then
    mv API_DOCS.md docs/api/
    echo "  ✓ API_DOCS.md -> docs/api/"
fi

if [ -f "SERVICE_PORTS.md" ]; then
    mv SERVICE_PORTS.md docs/project/
    echo "  ✓ SERVICE_PORTS.md -> docs/project/"
fi

if [ -f "SERVICE_STARTUP.md" ]; then
    mv SERVICE_STARTUP.md docs/project/
    echo "  ✓ SERVICE_STARTUP.md -> docs/project/"
fi

if [ -f "DEPLOYMENT.md" ]; then
    mv DEPLOYMENT.md docs/deployment/
    echo "  ✓ DEPLOYMENT.md -> docs/deployment/"
fi

if [ -f "NACOS_INSTALL_GUIDE.md" ]; then
    mv NACOS_INSTALL_GUIDE.md docs/nacos/
    echo "  ✓ NACOS_INSTALL_GUIDE.md -> docs/nacos/"
fi

if [ -f "DOCKER_MIRROR_CONFIG.md" ]; then
    mv DOCKER_MIRROR_CONFIG.md docs/deployment/
    echo "  ✓ DOCKER_MIRROR_CONFIG.md -> docs/deployment/"
fi

if [ -f "PRODUCTION_DEPLOYMENT_STANDARD.md" ]; then
    mv PRODUCTION_DEPLOYMENT_STANDARD.md docs/deployment/
    echo "  ✓ PRODUCTION_DEPLOYMENT_STANDARD.md -> docs/deployment/"
fi

# 3. 清理docs根目录的Markdown文件
if [ -f "docs/项目整合文档.md" ]; then
    mv docs/项目整合文档.md docs/project/
    echo "  ✓ docs/项目整合文档.md -> docs/project/"
fi

if [ -f "docs/快速开始指南.md" ]; then
    mv docs/快速开始指南.md docs/project/
    echo "  ✓ docs/快速开始指南.md -> docs/project/"
fi

if [ -f "docs/user_security_guide.md" ]; then
    mv docs/user_security_guide.md docs/security/
    echo "  ✓ docs/user_security_guide.md -> docs/security/"
fi

# 4. 清理docs/archive中的重复文件
echo ""
echo "[3/4] 清理重复的归档文件..."

# 删除重复的数据库文档
if [ -f "docs/archive/数据库导入说明.md" ]; then
    rm -f docs/archive/数据库导入说明.md
    echo "  ✓ 删除重复: docs/archive/数据库导入说明.md"
fi

# 删除重复的MySQL文档
if [ -f "docs/archive/MYSQL_START_TROUBLESHOOT.md" ]; then
    rm -f docs/archive/MYSQL_START_TROUBLESHOOT.md
    echo "  ✓ 删除重复: docs/archive/MYSQL_START_TROUBLESHOOT.md"
fi

if [ -f "docs/archive/MYSQL_AUTHENTICATION_SOLUTION.md" ]; then
    rm -f docs/archive/MYSQL_AUTHENTICATION_SOLUTION.md
    echo "  ✓ 删除重复: docs/archive/MYSQL_AUTHENTICATION_SOLUTION.md"
fi

# 删除重复的数据导入指南
if [ -f "docs/archive/黑龙江科技大学数据导入指南.md" ]; then
    rm -f docs/archive/黑龙江科技大学数据导入指南.md
    echo "  ✓ 删除重复: docs/archive/黑龙江科技大学数据导入指南.md"
fi

# 删除重复的开发计划
if [ -f "docs/archive/项目开发计划_更新版.md" ]; then
    rm -f docs/archive/项目开发计划_更新版.md
    echo "  ✓ 删除重复: docs/archive/项目开发计划_更新版.md"
fi

# 删除重复的前端开发计划
if [ -f "docs/archive/Frontend-Development-Plan-v2.0.md" ]; then
    rm -f docs/archive/Frontend-Development-Plan-v2.0.md
    echo "  ✓ 删除重复: docs/archive/Frontend-Development-Plan-v2.0.md"
fi

# 删除重复的优化文档
if [ -f "docs/archive/optimization-documentation.md" ]; then
    rm -f docs/archive/optimization-documentation.md
    echo "  ✓ 删除重复: docs/archive/optimization-documentation.md"
fi

# 5. 删除空目录
echo ""
echo "[4/4] 清理空目录..."
for dir in docs/mysql docs/tools docs/test docs/sql; do
    if [ -d "$dir" ] && [ -z "$(ls -A $dir)" ]; then
        rmdir "$dir"
        echo "  ✓ 删除空目录: $dir"
    fi
done

echo ""
echo "========================================="
echo "  整理完成!"
echo "========================================="
echo ""
echo "建议执行以下命令查看变更:"
echo "  git status"
echo ""
