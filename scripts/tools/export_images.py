#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
导出开题报告中的两张图片
- 系统架构图
- 功能模块图
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_architecture_image():
    """创建系统架构图"""
    # 创建图片
    width = 1000
    height = 750
    img = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(img)

    # 尝试加载中文字体
    try:
        # Windows系统字体路径
        font_paths = [
            "C:/Windows/Fonts/simhei.ttf",
            "C:/Windows/Fonts/simsun.ttc",
            "C:/Windows/Fonts/msyh.ttc",
            "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
            "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc"
        ]
        
        font_title = None
        font_normal = None
        font_small = None
        
        for font_path in font_paths:
            if os.path.exists(font_path):
                font_title = ImageFont.truetype(font_path, 24)
                font_normal = ImageFont.truetype(font_path, 16)
                font_small = ImageFont.truetype(font_path, 14)
                break
        
        if font_title is None:
            raise Exception("No Chinese font found")
            
    except Exception as e:
        print(f"字体加载失败，使用默认字体: {e}")
        font_title = ImageFont.load_default()
        font_normal = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # 绘制标题
    title = "图1 黑科易购系统架构图"
    bbox = draw.textbbox((0, 0), title, font=font_title)
    title_width = bbox[2] - bbox[0]
    draw.text(((width - title_width) // 2, 20), title, fill='black', font=font_title)

    # 定义颜色
    colors = {
        'frontend': '#E3F2FD',
        'gateway': '#FFF3E0', 
        'service': '#E8F5E9',
        'data': '#FCE4EC',
        'infra': '#F3E5F5',
        'border': '#333333',
        'text': '#000000'
    }

    # 绘制函数：绘制矩形框
    def draw_box(x, y, w, h, color, text, font, text_color='black'):
        draw.rectangle([x, y, x+w, y+h], fill=color, outline=colors['border'], width=2)
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        draw.text((x + (w-text_w)//2, y + (h-text_h)//2), text, fill=text_color, font=font)

    # 绘制函数：绘制箭头
    def draw_arrow(x1, y1, x2, y2):
        draw.line([(x1, y1), (x2, y2)], fill='black', width=2)
        # 箭头三角形
        if y2 > y1:  # 向下箭头
            draw.polygon([(x2-5, y2-10), (x2+5, y2-10), (x2, y2)], fill='black')

    start_y = 70
    box_height = 80
    layer_gap = 30

    # 1. 前端层
    layer1_y = start_y
    draw.rectangle([50, layer1_y, 950, layer1_y+box_height], 
                   fill=colors['frontend'], outline=colors['border'], width=2)
    
    # 前端层标题
    draw.text((480, layer1_y+10), "前端层", fill='black', font=font_normal)
    
    # 前端层子模块
    frontend_modules = [
        (100, layer1_y+45, "Web管理端(Vue3)"),
        (380, layer1_y+45, "PC门户端(Vue3)"),
        (660, layer1_y+45, "移动端/小程序(Taro)")
    ]
    for x, y, text in frontend_modules:
        draw_box(x, y, 200, 25, 'white', text, font_small)

    # 箭头
    draw_arrow(500, layer1_y+box_height, 500, layer1_y+box_height+layer_gap)

    # 2. API网关层
    layer2_y = layer1_y + box_height + layer_gap
    draw.rectangle([250, layer2_y, 750, layer2_y+60], 
                   fill=colors['gateway'], outline=colors['border'], width=2)
    draw.text((400, layer2_y+20), "API网关层 (Spring Cloud Gateway)", 
              fill='black', font=font_normal)

    # 箭头
    draw_arrow(500, layer2_y+60, 500, layer2_y+60+layer_gap)

    # 3. 服务层
    layer3_y = layer2_y + 60 + layer_gap
    service_height = 140
    draw.rectangle([50, layer3_y, 950, layer3_y+service_height], 
                   fill=colors['service'], outline=colors['border'], width=2)
    draw.text((460, layer3_y+10), "服务层 (Spring Boot微服务)", 
              fill='black', font=font_normal)

    # 服务模块
    services_row1 = [
        (80, layer3_y+45, "用户服务"),
        (260, layer3_y+45, "商品服务"),
        (440, layer3_y+45, "订单服务"),
        (620, layer3_y+45, "支付服务"),
        (800, layer3_y+45, "营销服务")
    ]
    
    services_row2 = [
        (170, layer3_y+95, "外卖服务"),
        (350, layer3_y+95, "配送服务"),
        (530, layer3_y+95, "校园服务"),
        (710, layer3_y+95, "消息服务")
    ]
    
    for x, y, text in services_row1:
        draw_box(x, y, 130, 35, 'white', text, font_small)
        
    for x, y, text in services_row2:
        draw_box(x, y, 130, 35, 'white', text, font_small)

    # 箭头
    draw_arrow(500, layer3_y+service_height, 500, layer3_y+service_height+layer_gap)

    # 4. 数据层
    layer4_y = layer3_y + service_height + layer_gap
    draw.rectangle([50, layer4_y, 950, layer4_y+box_height], 
                   fill=colors['data'], outline=colors['border'], width=2)
    draw.text((460, layer4_y+10), "数据访问与共享层", fill='black', font=font_normal)
    
    data_modules = [
        (150, layer4_y+45, "MySQL集群"),
        (360, layer4_y+45, "Redis缓存"),
        (570, layer4_y+45, "Elasticsearch"),
        (780, layer4_y+45, "RocketMQ")
    ]
    for x, y, text in data_modules:
        draw_box(x, y, 150, 25, 'white', text, font_small)

    # 箭头
    draw_arrow(500, layer4_y+box_height, 500, layer4_y+box_height+layer_gap)

    # 5. 基础设施层
    layer5_y = layer4_y + box_height + layer_gap
    draw.rectangle([50, layer5_y, 950, layer5_y+box_height], 
                   fill=colors['infra'], outline=colors['border'], width=2)
    draw.text((460, layer5_y+10), "基础设施与运维层", fill='black', font=font_normal)
    
    infra_modules = [
        (150, layer5_y+45, "Docker"),
        (360, layer5_y+45, "Kubernetes"),
        (570, layer5_y+45, "CI/CD"),
        (780, layer5_y+45, "监控告警")
    ]
    for x, y, text in infra_modules:
        draw_box(x, y, 150, 25, 'white', text, font_small)

    # 保存图片
    img_path = "系统架构图.png"
    img.save(img_path, dpi=(300, 300))
    print(f"系统架构图已导出: {img_path}")
    
    return img_path

def create_function_module_image():
    """创建功能模块图"""
    # 创建图片
    width = 1000
    height = 700
    img = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(img)

    # 尝试加载中文字体
    try:
        font_paths = [
            "C:/Windows/Fonts/simhei.ttf",
            "C:/Windows/Fonts/simsun.ttc",
            "C:/Windows/Fonts/msyh.ttc",
            "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
            "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc"
        ]
        
        font_title = None
        font_normal = None
        font_small = None
        
        for font_path in font_paths:
            if os.path.exists(font_path):
                font_title = ImageFont.truetype(font_path, 24)
                font_normal = ImageFont.truetype(font_path, 16)
                font_small = ImageFont.truetype(font_path, 14)
                break
        
        if font_title is None:
            raise Exception("No Chinese font found")
            
    except Exception as e:
        print(f"字体加载失败，使用默认字体: {e}")
        font_title = ImageFont.load_default()
        font_normal = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # 绘制标题
    title = "图2 黑科易购功能模块图"
    bbox = draw.textbbox((0, 0), title, font=font_title)
    title_width = bbox[2] - bbox[0]
    draw.text(((width - title_width) // 2, 20), title, fill='black', font=font_title)

    # 绘制函数
    def draw_box(x, y, w, h, color, text, font, text_color='white'):
        draw.rectangle([x, y, x+w, y+h], fill=color, outline='#333333', width=2)
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        draw.text((x + (w-text_w)//2, y + (h-text_h)//2), text, fill=text_color, font=font)

    def draw_line(x1, y1, x2, y2):
        draw.line([(x1, y1), (x2, y2)], fill='#666666', width=2)

    # 中心平台
    center_x, center_y = 500, 90
    draw_box(center_x-150, center_y-25, 300, 50, '#1976D2', 
             "黑科易购校园服务平台", font_normal)

    # 三大端
    endpoints = [
        (200, 170, "用户端", "#4CAF50"),
        (500, 170, "商家端", "#FF9800"),
        (800, 170, "管理端", "#9C27B0")
    ]

    for x, y, name, color in endpoints:
        draw_box(x-70, y-20, 140, 40, color, name, font_normal)
        # 连接线到中心
        draw_line(center_x, center_y+25, x, y-20)

    # 用户端功能模块
    user_funcs = [
        (80, 240, "微信小程序", "#E8F5E9"),
        (220, 240, "Web端", "#E8F5E9"),
        (80, 290, "商品浏览", "#C8E6C9"),
        (220, 290, "下单支付", "#C8E6C9"),
        (80, 340, "订单跟踪", "#C8E6C9"),
        (220, 340, "个人中心", "#C8E6C9")
    ]
    
    for x, y, text, color in user_funcs:
        draw_box(x, y, 120, 35, color, text, font_small, 'black')
        if y == 240:  # 第一行连接到用户端
            draw_line(200, 190, x+60, y)

    # 商家端功能模块
    merchant_funcs = [
        (380, 240, "商家Web端", "#FFF3E0"),
        (520, 240, "配送APP", "#FFF3E0"),
        (380, 290, "商品管理", "#FFE0B2"),
        (520, 290, "订单处理", "#FFE0B2"),
        (380, 340, "配送管理", "#FFE0B2"),
        (520, 340, "数据统计", "#FFE0B2")
    ]
    
    for x, y, text, color in merchant_funcs:
        draw_box(x, y, 120, 35, color, text, font_small, 'black')
        if y == 240:
            draw_line(500, 190, x+60, y)

    # 管理端功能模块
    admin_funcs = [
        (680, 240, "管理Web端", "#F3E5F5"),
        (820, 240, "数据大屏", "#F3E5F5"),
        (680, 290, "用户管理", "#E1BEE7"),
        (820, 290, "商品审核", "#E1BEE7"),
        (680, 340, "订单监控", "#E1BEE7"),
        (820, 340, "系统配置", "#E1BEE7")
    ]
    
    for x, y, text, color in admin_funcs:
        draw_box(x, y, 120, 35, color, text, font_small, 'black')
        if y == 240:
            draw_line(800, 190, x+60, y)

    # 后端服务层
    service_y = 450
    draw.rectangle([80, service_y, 920, service_y+180], 
                   fill='#E3F2FD', outline='#333333', width=2)
    draw.text((480, service_y+15), "后端微服务层", fill='black', font=font_normal)

    # 后端服务模块
    services = [
        (120, service_y+60, "用户服务"),
        (280, service_y+60, "商品服务"),
        (440, service_y+60, "订单服务"),
        (600, service_y+60, "支付服务"),
        (760, service_y+60, "营销服务"),
        (120, service_y+110, "外卖服务"),
        (280, service_y+110, "配送服务"),
        (440, service_y+110, "校园服务"),
        (600, service_y+110, "消息服务"),
        (760, service_y+110, "搜索服务"),
        (200, service_y+160, "文件服务"),
        (360, service_y+160, "通知服务"),
        (520, service_y+160, "日志服务"),
        (680, service_y+160, "监控服务")
    ]
    
    for x, y, text in services:
        draw_box(x, y, 110, 35, 'white', text, font_small, 'black')

    # 连接线：三大端到后端服务层
    for x in [200, 500, 800]:
        draw_line(x, 375, x, service_y)

    # 保存图片
    img_path = "功能模块图.png"
    img.save(img_path, dpi=(300, 300))
    print(f"功能模块图已导出: {img_path}")
    
    return img_path

def main():
    """主函数"""
    print("开始导出图片...")
    
    # 导出系统架构图
    arch_path = create_architecture_image()
    
    # 导出功能模块图
    func_path = create_function_module_image()
    
    print("\n图片导出完成！")
    print(f"1. {arch_path}")
    print(f"2. {func_path}")

if __name__ == "__main__":
    main()
