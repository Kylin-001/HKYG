#!/usr/bin/env python3
import os
import shutil

ROOT_DIR = '/home/zky/HKYG'

# 需要移动的重复文档
DUPLICATE_DOCS = {
    # docs/development/ 中的重复文档
    'docs/development/项目开发计划_更新版.md': 'docs/archive',
    
    # docs/frontend/ 中的重复文档
    'docs/frontend/Frontend-Development-Plan-v2.0.md': 'docs/archive',
    'docs/frontend/optimization-documentation.md': 'docs/archive',
}

def organize_remaining_docs():
    success_count = 0
    fail_count = 0
    
    print("开始整理剩余的重复文档...")
    print("=" * 60)
    
    for src_path_rel, dest_dir_rel in DUPLICATE_DOCS.items():
        src_path = os.path.join(ROOT_DIR, src_path_rel)
        dest_dir = os.path.join(ROOT_DIR, dest_dir_rel)
        filename = os.path.basename(src_path)
        dest_path = os.path.join(dest_dir, filename)
        
        if not os.path.exists(src_path):
            print(f"[跳过] 文件不存在: {src_path_rel}")
            continue
        
        if os.path.exists(dest_path):
            print(f"[跳过] 目标文件已存在: {filename}")
            continue
        
        try:
            shutil.move(src_path, dest_path)
            print(f"[成功] 移动: {src_path_rel} -> {dest_dir_rel}/")
            success_count += 1
        except Exception as e:
            print(f"[失败] 无法移动 {src_path_rel}: {e}")
            fail_count += 1
    
    print("=" * 60)
    print(f"整理完成: 成功 {success_count} 个, 失败 {fail_count} 个")

if __name__ == '__main__':
    organize_remaining_docs()
