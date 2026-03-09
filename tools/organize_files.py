#!/usr/bin/env python3
import os
import shutil

# 项目根目录
ROOT_DIR = '/home/zky/HKYG'

# 文件映射：源文件 -> 目标目录
FILE_MAPPINGS = {
    # 文档类 - 归档重复文档
    'FINAL_PROJECT_SUMMARY.md': 'docs/archive',
    'PROJECT_COMPLETION_FINAL_SUMMARY.md': 'docs/archive',
    'PROJECT_COMPLETION_REPORT.md': 'docs/archive',
    'PROJECT_COMPLETION_SUMMARY.md': 'docs/archive',
    
    # 文档类 - Nacos文档
    'NACOS_QUICK_START_GUIDE.md': 'docs/nacos',
    'NACOS_ALTERNATIVE_SOLUTIONS.md': 'docs/nacos',
    
    # 文档类 - 项目状态
    'PROJECT_STATUS.md': 'docs/project-status',
    'CURRENT_STATUS_AND_NEXT_STEPS.md': 'docs/project-status',
    'NEW_FEATURES_DEVELOPMENT_REPORT.md': 'docs/project-status',
    
    # 文档类 - 其他
    'PRODUCTION_DEPLOYMENT_STANDARD.md': 'docs',
    
    # 配置文件
    'checkstyle-pom.xml': 'config',
    'checkstyle.xml': 'config',
    'header.txt': 'config',
    'heikeji-mall-nginx.conf': 'config',
    'nginx.conf': 'config',
    
    # 工具文件
    'complete-fix.js': 'tools',
    'generate_bcrypt_password.java': 'tools',
    'generate_bcrypt_password.py': 'tools',
    'generate_password.xml': 'tools',
    'read_docx.py': 'tools',
    'static-server.js': 'tools',
    
    # 测试文件
    'test_api.java': 'test',
    'test_api_detailed.java': 'test',
    'test_courier_api.java': 'test',
    'test-integration.js': 'test',
    'test_integration.js': 'test',
}

def organize_files():
    success_count = 0
    fail_count = 0
    skip_count = 0
    
    print("开始整理文件...")
    print("=" * 60)
    
    for filename, target_dir in FILE_MAPPINGS.items():
        src_path = os.path.join(ROOT_DIR, filename)
        dest_dir = os.path.join(ROOT_DIR, target_dir)
        dest_path = os.path.join(dest_dir, filename)
        
        if not os.path.exists(src_path):
            print(f"[跳过] 文件不存在: {filename}")
            skip_count += 1
            continue
        
        if os.path.exists(dest_path):
            print(f"[跳过] 目标文件已存在: {filename}")
            skip_count += 1
            continue
        
        try:
            shutil.move(src_path, dest_path)
            print(f"[成功] 移动: {filename} -> {target_dir}/")
            success_count += 1
        except Exception as e:
            print(f"[失败] 无法移动 {filename}: {e}")
            fail_count += 1
    
    print("=" * 60)
    print(f"整理完成: 成功 {success_count} 个, 失败 {fail_count} 个, 跳过 {skip_count} 个")

if __name__ == '__main__':
    organize_files()
