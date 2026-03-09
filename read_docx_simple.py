#!/usr/bin/env python3
import zipfile
import xml.etree.ElementTree as ET
import sys

def read_docx_text(file_path):
    try:
        docx_zip = zipfile.ZipFile(file_path)
        xml_content = docx_zip.read('word/document.xml')
        root = ET.fromstring(xml_content)
        
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        paragraphs = []
        for paragraph in root.findall('.//w:p', namespaces):
            text_elements = paragraph.findall('.//w:t', namespaces)
            paragraph_text = ''.join([t.text for t in text_elements if t.text])
            if paragraph_text:
                paragraphs.append(paragraph_text)
        
        return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error reading file: {e}"

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python read_docx_simple.py <docx_file_path>')
        sys.exit(1)
    
    file_path = sys.argv[1]
    content = read_docx_text(file_path)
    print(content)
