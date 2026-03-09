import os
import zipfile
import xml.etree.ElementTree as ET

def read_docx_text(docx_path):
    if not os.path.exists(docx_path):
        print("文件不存在")
        return
    
    try:
        with zipfile.ZipFile(docx_path) as zf:
            # 检查word/document.xml是否存在
            if 'word/document.xml' not in zf.namelist():
                print("无法找到文档内容")
                return
            
            with zf.open('word/document.xml') as f:
                xml_content = f.read()
            
            # 解析XML
            root = ET.fromstring(xml_content)
            
            # MS Word XML命名空间
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            # 提取所有文本
            text = ''
            for elem in root.findall('.//w:t', ns):
                text += elem.text or ''
            
            print("文档内容预览（前2000字符）：")
            print(text[:2000])
            if len(text) > 2000:
                print(f"...（文档总长度：{len(text)}字符）")
                
    except Exception as e:
        print(f"读取文件时出错：{e}")

# 调用函数读取文件
docx_path = '/home/heikeji/heikeji-mall/2025届本科毕业设计（论文）开题报告模版 .docx'
read_docx_text(docx_path)
