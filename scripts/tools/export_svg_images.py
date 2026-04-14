#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
导出开题报告中的两张图片为SVG格式
SVG格式可在浏览器中打开，不依赖系统字体
"""

def create_architecture_svg():
    """创建系统架构图SVG"""
    svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="1000" height="750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
    </marker>
  </defs>
  
  <!-- 背景 -->
  <rect width="1000" height="750" fill="white"/>
  
  <!-- 标题 -->
  <text x="500" y="40" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="24" 
        font-weight="bold" text-anchor="middle" fill="#333">图1 黑科易购系统架构图</text>
  
  <!-- 1. 前端层 -->
  <rect x="50" y="70" width="900" height="100" fill="#E3F2FD" stroke="#333" stroke-width="2"/>
  <text x="500" y="95" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="18" 
        font-weight="bold" text-anchor="middle" fill="#333">前端层</text>
  
  <!-- 前端子模块 -->
  <rect x="100" y="115" width="220" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="210" y="140" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">Web管理端(Vue3)</text>
  
  <rect x="390" y="115" width="220" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="500" y="140" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">PC门户端(Vue3)</text>
  
  <rect x="680" y="115" width="220" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="790" y="140" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">移动端/小程序(Taro)</text>
  
  <!-- 箭头1 -->
  <line x1="500" y1="170" x2="500" y2="200" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- 2. API网关层 -->
  <rect x="250" y="200" width="500" height="70" fill="#FFF3E0" stroke="#333" stroke-width="2"/>
  <text x="500" y="240" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="16" 
        text-anchor="middle" fill="#333">API网关层 (Spring Cloud Gateway)</text>
  
  <!-- 箭头2 -->
  <line x1="500" y1="270" x2="500" y2="300" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- 3. 服务层 -->
  <rect x="50" y="300" width="900" height="180" fill="#E8F5E9" stroke="#333" stroke-width="2"/>
  <text x="500" y="325" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="18" 
        font-weight="bold" text-anchor="middle" fill="#333">服务层 (Spring Boot微服务)</text>
  
  <!-- 服务模块第1行 -->
  <rect x="80" y="350" width="140" height="45" fill="white" stroke="#333" stroke-width="1"/>
  <text x="150" y="378" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">用户服务</text>
  
  <rect x="260" y="350" width="140" height="45" fill="white" stroke="#333" stroke-width="1"/>
  <text x="330" y="378" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">商品服务</text>
  
  <rect x="440" y="350" width="140" height="45" fill="white" stroke="#333" stroke-width="1"/>
  <text x="510" y="378" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">订单服务</text>
  
  <rect x="620" y="350" width="140" height="45" fill="white" stroke="#333" stroke-width="1"/>
  <text x="690" y="378" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">支付服务</text>
  
  <rect x="800" y="350" width="130" height="45" fill="white" stroke="#333" stroke-width="1"/>
  <text x="865" y="378" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">营销服务</text>
  
  <!-- 服务模块第2行 -->
  <rect x="170" y="410" width="140" height="45" fill="white" stroke="#333" stroke-width="1"/>
  <text x="240" y="438" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">外卖服务</text>
  
  <rect x="350" y="410" width="140" height="45" fill="white" stroke="#333" stroke-width="1"/>
  <text x="420" y="438" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">配送服务</text>
  
  <rect x="530" y="410" width="140" height="45" fill="white" stroke="#333" stroke-width="1"/>
  <text x="600" y="438" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">校园服务</text>
  
  <rect x="710" y="410" width="140" height="45" fill="white" stroke="#333" stroke-width="1"/>
  <text x="780" y="438" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">消息服务</text>
  
  <!-- 箭头3 -->
  <line x1="500" y1="480" x2="500" y2="510" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- 4. 数据层 -->
  <rect x="50" y="510" width="900" height="100" fill="#FCE4EC" stroke="#333" stroke-width="2"/>
  <text x="500" y="535" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="18" 
        font-weight="bold" text-anchor="middle" fill="#333">数据访问与共享层</text>
  
  <rect x="150" y="560" width="160" height="35" fill="white" stroke="#333" stroke-width="1"/>
  <text x="230" y="583" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">MySQL集群</text>
  
  <rect x="370" y="560" width="160" height="35" fill="white" stroke="#333" stroke-width="1"/>
  <text x="450" y="583" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">Redis缓存</text>
  
  <rect x="590" y="560" width="160" height="35" fill="white" stroke="#333" stroke-width="1"/>
  <text x="670" y="583" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">Elasticsearch</text>
  
  <rect x="780" y="560" width="140" height="35" fill="white" stroke="#333" stroke-width="1"/>
  <text x="850" y="583" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">RocketMQ</text>
  
  <!-- 箭头4 -->
  <line x1="500" y1="610" x2="500" y2="640" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- 5. 基础设施层 -->
  <rect x="50" y="640" width="900" height="100" fill="#F3E5F5" stroke="#333" stroke-width="2"/>
  <text x="500" y="665" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="18" 
        font-weight="bold" text-anchor="middle" fill="#333">基础设施与运维层</text>
  
  <rect x="150" y="690" width="160" height="35" fill="white" stroke="#333" stroke-width="1"/>
  <text x="230" y="713" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">Docker</text>
  
  <rect x="370" y="690" width="160" height="35" fill="white" stroke="#333" stroke-width="1"/>
  <text x="450" y="713" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">Kubernetes</text>
  
  <rect x="590" y="690" width="160" height="35" fill="white" stroke="#333" stroke-width="1"/>
  <text x="670" y="713" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">CI/CD</text>
  
  <rect x="780" y="690" width="140" height="35" fill="white" stroke="#333" stroke-width="1"/>
  <text x="850" y="713" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="14" 
        text-anchor="middle" fill="#333">监控告警</text>
</svg>'''
    
    filename = "系统架构图.svg"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"系统架构图已导出: {filename}")
    return filename

def create_function_module_svg():
    """创建功能模块图SVG"""
    svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="1000" height="700" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <rect width="1000" height="700" fill="white"/>
  
  <!-- 标题 -->
  <text x="500" y="40" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="24" 
        font-weight="bold" text-anchor="middle" fill="#333">图2 黑科易购功能模块图</text>
  
  <!-- 中心平台 -->
  <rect x="300" y="70" width="400" height="50" fill="#1976D2" stroke="#333" stroke-width="2" rx="5"/>
  <text x="500" y="102" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="18" 
        font-weight="bold" text-anchor="middle" fill="white">黑科易购校园服务平台</text>
  
  <!-- 三大端 -->
  <!-- 用户端 -->
  <rect x="130" y="160" width="140" height="45" fill="#4CAF50" stroke="#333" stroke-width="2" rx="5"/>
  <text x="200" y="190" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="16" 
        font-weight="bold" text-anchor="middle" fill="white">用户端</text>
  <line x1="500" y1="120" x2="200" y2="160" stroke="#666" stroke-width="2"/>
  
  <!-- 商家端 -->
  <rect x="430" y="160" width="140" height="45" fill="#FF9800" stroke="#333" stroke-width="2" rx="5"/>
  <text x="500" y="190" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="16" 
        font-weight="bold" text-anchor="middle" fill="white">商家端</text>
  <line x1="500" y1="120" x2="500" y2="160" stroke="#666" stroke-width="2"/>
  
  <!-- 管理端 -->
  <rect x="730" y="160" width="140" height="45" fill="#9C27B0" stroke="#333" stroke-width="2" rx="5"/>
  <text x="800" y="190" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="16" 
        font-weight="bold" text-anchor="middle" fill="white">管理端</text>
  <line x1="500" y1="120" x2="800" y2="160" stroke="#666" stroke-width="2"/>
  
  <!-- 用户端功能模块 -->
  <rect x="80" y="240" width="120" height="40" fill="#E8F5E9" stroke="#333" stroke-width="1"/>
  <text x="140" y="265" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">微信小程序</text>
  <line x1="200" y1="205" x2="140" y2="240" stroke="#666" stroke-width="1"/>
  
  <rect x="220" y="240" width="120" height="40" fill="#E8F5E9" stroke="#333" stroke-width="1"/>
  <text x="280" y="265" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">Web端</text>
  <line x1="200" y1="205" x2="280" y2="240" stroke="#666" stroke-width="1"/>
  
  <rect x="80" y="300" width="120" height="40" fill="#C8E6C9" stroke="#333" stroke-width="1"/>
  <text x="140" y="325" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">商品浏览</text>
  
  <rect x="220" y="300" width="120" height="40" fill="#C8E6C9" stroke="#333" stroke-width="1"/>
  <text x="280" y="325" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">下单支付</text>
  
  <rect x="80" y="360" width="120" height="40" fill="#C8E6C9" stroke="#333" stroke-width="1"/>
  <text x="140" y="385" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">订单跟踪</text>
  
  <rect x="220" y="360" width="120" height="40" fill="#C8E6C9" stroke="#333" stroke-width="1"/>
  <text x="280" y="385" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">个人中心</text>
  
  <!-- 商家端功能模块 -->
  <rect x="380" y="240" width="120" height="40" fill="#FFF3E0" stroke="#333" stroke-width="1"/>
  <text x="440" y="265" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">商家Web端</text>
  <line x1="500" y1="205" x2="440" y2="240" stroke="#666" stroke-width="1"/>
  
  <rect x="520" y="240" width="120" height="40" fill="#FFF3E0" stroke="#333" stroke-width="1"/>
  <text x="580" y="265" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">配送APP</text>
  <line x1="500" y1="205" x2="580" y2="240" stroke="#666" stroke-width="1"/>
  
  <rect x="380" y="300" width="120" height="40" fill="#FFE0B2" stroke="#333" stroke-width="1"/>
  <text x="440" y="325" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">商品管理</text>
  
  <rect x="520" y="300" width="120" height="40" fill="#FFE0B2" stroke="#333" stroke-width="1"/>
  <text x="580" y="325" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">订单处理</text>
  
  <rect x="380" y="360" width="120" height="40" fill="#FFE0B2" stroke="#333" stroke-width="1"/>
  <text x="440" y="385" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">配送管理</text>
  
  <rect x="520" y="360" width="120" height="40" fill="#FFE0B2" stroke="#333" stroke-width="1"/>
  <text x="580" y="385" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">数据统计</text>
  
  <!-- 管理端功能模块 -->
  <rect x="680" y="240" width="120" height="40" fill="#F3E5F5" stroke="#333" stroke-width="1"/>
  <text x="740" y="265" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">管理Web端</text>
  <line x1="800" y1="205" x2="740" y2="240" stroke="#666" stroke-width="1"/>
  
  <rect x="820" y="240" width="120" height="40" fill="#F3E5F5" stroke="#333" stroke-width="1"/>
  <text x="880" y="265" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">数据大屏</text>
  <line x1="800" y1="205" x2="880" y2="240" stroke="#666" stroke-width="1"/>
  
  <rect x="680" y="300" width="120" height="40" fill="#E1BEE7" stroke="#333" stroke-width="1"/>
  <text x="740" y="325" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">用户管理</text>
  
  <rect x="820" y="300" width="120" height="40" fill="#E1BEE7" stroke="#333" stroke-width="1"/>
  <text x="880" y="325" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">商品审核</text>
  
  <rect x="680" y="360" width="120" height="40" fill="#E1BEE7" stroke="#333" stroke-width="1"/>
  <text x="740" y="385" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">订单监控</text>
  
  <rect x="820" y="360" width="120" height="40" fill="#E1BEE7" stroke="#333" stroke-width="1"/>
  <text x="880" y="385" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">系统配置</text>
  
  <!-- 后端服务层 -->
  <rect x="80" y="460" width="840" height="220" fill="#E3F2FD" stroke="#333" stroke-width="2" rx="5"/>
  <text x="500" y="490" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="18" 
        font-weight="bold" text-anchor="middle" fill="#333">后端微服务层</text>
  
  <!-- 连接线 -->
  <line x1="200" y1="400" x2="200" y2="460" stroke="#666" stroke-width="2"/>
  <line x1="500" y1="400" x2="500" y2="460" stroke="#666" stroke-width="2"/>
  <line x1="800" y1="400" x2="800" y2="460" stroke="#666" stroke-width="2"/>
  
  <!-- 后端服务模块第1行 -->
  <rect x="120" y="520" width="110" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="175" y="545" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">用户服务</text>
  
  <rect x="280" y="520" width="110" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="335" y="545" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">商品服务</text>
  
  <rect x="440" y="520" width="110" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="495" y="545" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">订单服务</text>
  
  <rect x="600" y="520" width="110" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="655" y="545" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">支付服务</text>
  
  <rect x="760" y="520" width="110" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="815" y="545" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">营销服务</text>
  
  <!-- 后端服务模块第2行 -->
  <rect x="120" y="580" width="110" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="175" y="605" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">外卖服务</text>
  
  <rect x="280" y="580" width="110" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="335" y="605" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">配送服务</text>
  
  <rect x="440" y="580" width="110" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="495" y="605" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">校园服务</text>
  
  <rect x="600" y="580" width="110" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="655" y="605" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">消息服务</text>
  
  <rect x="760" y="580" width="110" height="40" fill="white" stroke="#333" stroke-width="1"/>
  <text x="815" y="605" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="13" 
        text-anchor="middle" fill="#333">搜索服务</text>
  
  <!-- 后端服务模块第3行 -->
  <rect x="200" y="640" width="110" height="30" fill="white" stroke="#333" stroke-width="1"/>
  <text x="255" y="660" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="12" 
        text-anchor="middle" fill="#333">文件服务</text>
  
  <rect x="360" y="640" width="110" height="30" fill="white" stroke="#333" stroke-width="1"/>
  <text x="415" y="660" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="12" 
        text-anchor="middle" fill="#333">通知服务</text>
  
  <rect x="520" y="640" width="110" height="30" fill="white" stroke="#333" stroke-width="1"/>
  <text x="575" y="660" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="12" 
        text-anchor="middle" fill="#333">日志服务</text>
  
  <rect x="680" y="640" width="110" height="30" fill="white" stroke="#333" stroke-width="1"/>
  <text x="735" y="660" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="12" 
        text-anchor="middle" fill="#333">监控服务</text>
</svg>'''
    
    filename = "功能模块图.svg"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"功能模块图已导出: {filename}")
    return filename

def main():
    """主函数"""
    print("开始导出SVG图片...")
    
    # 导出系统架构图
    arch_path = create_architecture_svg()
    
    # 导出功能模块图
    func_path = create_function_module_svg()
    
    print("\nSVG图片导出完成！")
    print(f"1. {arch_path}")
    print(f"2. {func_path}")
    print("\n提示：SVG文件可以直接用浏览器打开查看")

if __name__ == "__main__":
    main()
