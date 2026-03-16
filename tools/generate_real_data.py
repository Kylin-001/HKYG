#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
黑科易购项目真实数据生成脚本
基于真实高校名称、菜品数据生成更逼真的测试数据
"""

import random
import json
from datetime import datetime, timedelta
from faker import Faker
import pymysql

fake = Faker('zh_CN')

DB_CONFIG = {
    'host': '192.168.186.128',
    'port': 3306,
    'user': 'hkyg',
    'password': 'Mysql@8Root!2025',
    'database': 'heikeji_mall',
    'charset': 'utf8mb4',
    'connect_timeout': 10,
    'read_timeout': 30,
    'write_timeout': 30
}

CAMPUS_DATA = [
    ('哈尔滨工业大学', 'HIT', '黑龙江省', '哈尔滨市', '南岗区', '哈尔滨市南岗区西大直街92号', '985、211双一流高校，工科强校'),
    ('哈尔滨工程大学', 'HEU', '黑龙江省', '哈尔滨市', '南岗区', '哈尔滨市南岗区南通大街145号', '国防七子之一，船舶海洋工程见长'),
    ('东北林业大学', 'NEFU', '黑龙江省', '哈尔滨市', '香坊区', '哈尔滨市香坊区和兴路26号', '211高校，林业工程特色'),
    ('东北农业大学', 'NEAU', '黑龙江省', '哈尔滨市', '香坊区', '哈尔滨市香坊区长江路600号', '农业类重点高校'),
    ('黑龙江大学', 'HLJU', '黑龙江省', '哈尔滨市', '南岗区', '哈尔滨市南岗区学府路74号', '省部共建重点综合大学'),
    ('哈尔滨医科大学', 'HMU', '黑龙江省', '哈尔滨市', '南岗区', '哈尔滨市南岗区保健路157号', '医药类重点高校'),
    ('哈尔滨理工大学', 'HUST', '黑龙江省', '哈尔滨市', '南岗区', '哈尔滨市南岗区学府路52号', '理工类省重点大学'),
    ('哈尔滨师范大学', 'HSFU', '黑龙江省', '哈尔滨市', '利民开发区', '哈尔滨市利民开发区师大路1号', '师范类重点高校'),
    ('哈尔滨商业大学', 'HCU', '黑龙江省', '哈尔滨市', '松北区', '哈尔滨市松北区学海街1号', '财经类省重点大学'),
    ('黑龙江科技大学', 'HKUST', '黑龙江省', '哈尔滨市', '松北区', '哈尔滨市松北区黑科技大学路1号', '工科应用型本科'),
]

MENU_CATEGORIES = {
    '热销推荐': ['招牌推荐', '今日特惠', '学生必点', '好评如潮'],
    '主食': ['盖浇饭', '炒饭', '面条', '水饺', '包子', '煎饼'],
    '特色菜品': ['川菜', '东北菜', '湘菜', '粤菜', '清真'],
    '小吃': ['炸鸡', '薯条', '鸡排', '烤串', '煎饼果子'],
    '饮品': ['奶茶', '果汁', '汽水', '豆浆', '咖啡'],
    '早餐': ['油条', '豆浆', '包子', '煎饼', '鸡蛋灌饼'],
    '夜宵': ['烧烤', '小龙虾', '炒面', '砂锅', '炸串'],
}

DISH_NAMES = {
    '川菜': ['宫保鸡丁', '麻婆豆腐', '水煮肉片', '鱼香肉丝', '回锅肉', '酸菜鱼', '辣子鸡', '毛血旺', '口水鸡', '东坡肉'],
    '东北菜': ['锅包肉', '地三鲜', '酸菜粉丝', '杀猪菜', '小鸡炖蘑菇', '猪肉炖粉条', '酱大骨', '拔丝地瓜', '熘肉段', '红烧肉'],
    '湘菜': ['剁椒鱼头', '辣椒炒肉', '湘西外婆菜', '口味虾', '毛氏红烧肉', '组庵豆腐', '左宗棠鸡', '酸辣鸡胗'],
    '粤菜': ['白切鸡', '烧鸭', '叉烧', '清蒸鱼', '白灼虾', '烤乳猪', '咕噜肉', '盐焗鸡', '潮汕牛肉火锅', '煲仔饭'],
    '西餐': ['汉堡', '牛排', '披萨', '意面', '薯条', '炸鸡块', '三明治', '沙拉', '热狗', '卷饼'],
    '日韩': ['寿司', '拉面', '韩式拌饭', '石锅拌饭', '烤肉', '寿喜烧', '味增汤', '泡菜', '炸鸡', '年糕'],
    '小吃': ['煎饼果子', '鸡蛋灌饼', '手抓饼', '烤冷面', '炸串', '烤面筋', '铁板鱿鱼', '章鱼小丸子', '珍珠奶茶', '冰激凌'],
}

RESTAURANT_NAMES = {
    '中式快餐': ['老北京炸酱面', '兰州拉面', '黄焖鸡米饭', '沙县小吃', '兰州牛肉拉面', '川味小厨', '东北人家', '湘菜馆', '粤式烧腊', '外婆家'],
    '西式快餐': ['麦当劳', '肯德基', '汉堡王', '德克士', '华莱士', '必胜客', '棒约翰', '赛百味', '达美乐', '塔斯汀'],
    '奶茶甜品': ['蜜雪冰城', '古茗', '茶百道', '益禾堂', '书亦烧仙草', '沪上阿姨', '喜茶', '奈雪の茶', '星巴克', '瑞幸咖啡'],
    '特色美食': ['杨国福麻辣烫', '张亮麻辣烫', '骨汤麻辣烫', '黄蜀郎鸡公煲', '美石记石锅拌饭', '烤肉拌饭', '酱香饼', '掉渣饼', '鸡蛋灌饼', '杂粮煎饼'],
    '烧烤夜宵': ['很久以前羊肉串', '木屋烧烤', '很久不见', '江湖烤鱼', '龙虾殿', '烤肉兄弟', '烤翅王', '羊肉串大王', '深夜食堂', '红跑车'],
}

CAMPUS_LOCATIONS = [
    '一期宿舍楼A栋', '一期宿舍楼B栋', '一期宿舍楼C栋',
    '二期宿舍楼A栋', '二期宿舍楼B栋', '二期宿舍楼C栋',
    '三期宿舍楼A栋', '三期宿舍楼B栋', '三期宿舍楼C栋',
    '研究生宿舍楼', '留学生宿舍楼',
    '第一食堂', '第二食堂', '第三食堂', '第四食堂', '第五食堂', '清真食堂',
    '教学楼A座', '教学楼B座', '教学楼C座', '教学楼D座',
    '图书馆', '体育馆', '游泳馆', '操场', '篮球场', '足球场',
    '实验楼', '计算机中心', '行政楼', '大学生活动中心',
]

LOST_FOUND_ITEMS = {
    '失物': [
        ('校园卡', '一卡通', '蓝色'),
        ('钥匙串', '钥匙', '多把'),
        ('雨伞', '雨伞', '黑色'),
        ('钱包', '钱包', '棕色'),
        ('手机', '手机', 'iPhone'),
        ('笔记本电脑', '电脑', 'MacBook'),
        ('眼镜', '眼镜', '黑框'),
        ('手表', '手表', '运动'),
        ('耳机', '耳机', 'AirPods'),
        ('书包', '书包', '黑色'),
    ],
    '招领': [
        ('校园卡', '一卡通', '2023级'),
        ('钥匙串', '钥匙', '卡通'),
        ('雨伞', '雨伞', '透明'),
        ('书籍', '教材', '高数'),
        ('水杯', '水杯', '蓝色'),
        ('充电器', '数据线', 'Type-C'),
        ('U盾', 'U盘', '32G'),
        ('文具', '笔袋', '灰色'),
    ]
}

def get_connection():
    return pymysql.connect(**DB_CONFIG)

def generate_phone():
    prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
               '150', '151', '152', '153', '155', '156', '157', '158', '159',
               '170', '172', '176', '178',
               '180', '181', '182', '183', '184', '185', '186', '187', '188', '189',
               '197', '198', '199']
    return f"{random.choice(prefixes)}{random.randint(10000000, 99999999)}"

def random_date_time(days_ago=0):
    now = datetime.now()
    return now - timedelta(days=days_ago, hours=random.randint(0, 23), minutes=random.randint(0, 59))

def check_and_update_campus(conn, cursor):
    print("更新校园数据...")
    cursor.execute("DELETE FROM campus_notice")
    cursor.execute("DELETE FROM campus")
    conn.commit()

    sql = """INSERT INTO campus (name, code, province, city, district, address, status)
             VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    for name, code, province, city, district, address, desc in CAMPUS_DATA:
        cursor.execute(sql, (name, code, province, city, district, address, 1))
    conn.commit()
    print(f"  已更新 {len(CAMPUS_DATA)} 所高校数据")

    notice_sql = """INSERT INTO campus_notice (title, content, type, publisher, status, view_count)
                    VALUES (%s, %s, %s, %s, %s, %s)"""
    notices = [
        ('2024年春季学期开学通知', '亲爱的同学们，新学期将于3月1日正式开始，请同学们按时返校，注册时间为2月28日-3月1日。', 1, '教务处', 1, random.randint(500, 2000)),
        ('校园美食文化节活动公告', '为丰富校园文化生活，提升校园美食品质，我校将于4月15日举办首届校园美食文化节，届时将有各大食堂特色美食展示，欢迎同学们积极参与。', 2, '后勤集团', 1, random.randint(800, 3000)),
        ('防范网络电信诈骗安全提示', '近期网络电信诈骗案件频发，请广大师生提高警惕，不轻信陌生人，不随意转账汇款，保管好个人财物。如遇可疑情况，请及时拨打保卫处电话。', 3, '保卫处', 1, random.randint(1000, 5000)),
        ('图书馆开放时间调整通知', '为满足广大师生学习需求，图书馆自3月1日起调整开放时间：周一至周五7:00-22:00，周六周日7:00-21:30，法定节假日另行通知。', 1, '图书馆', 1, random.randint(300, 1500)),
        ('校园网络维护通知', '网络中心计划于本周六凌晨2:00-6:00对校园网络进行全面维护，届时部分区域网络可能不稳定，请提前做好相关准备。', 1, '信息中心', 1, random.randint(200, 1000)),
        ('春季就业招聘会邀请函', '黑龙江省2024年春季高校毕业生就业招聘会将于3月20日在我校体育馆举行，届时有300余家用人单位参会，欢迎广大毕业生积极参加。', 2, '就业指导中心', 1, random.randint(600, 2500)),
        ('节约用电倡议书', '为响应国家节能减排号召，建设绿色校园，请同学们离开宿舍时关闭电器设备，杜绝长明灯、长流水现象，共同建设节约型校园。', 3, '后勤集团', 1, random.randint(150, 800)),
    ]
    cursor.executemany(notice_sql, notices)
    conn.commit()
    print(f"  已更新 {len(notices)} 条校园公告")

def check_and_update_merchant(conn, cursor):
    print("更新商家数据...")
    cursor.execute("DELETE FROM takeout_product")
    cursor.execute("DELETE FROM takeout_category")
    cursor.execute("DELETE FROM merchant")
    conn.commit()

    sql = """INSERT INTO merchant (name, description, logo, address, phone, business_hours, min_price, delivery_fee, rating, sales, status)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

    merchants = []
    for i, (category, names) in enumerate(RESTAURANT_NAMES.items()):
        for j, name in enumerate(names[:8]):
            merchant = (
                name,
                f"正宗{category}，价格实惠，品质保证",
                f'/images/merchant/{name}.png',
                random.choice(CAMPUS_LOCATIONS),
                generate_phone(),
                '07:00-22:00',
                round(random.uniform(10, 25), 2),
                round(random.uniform(1.5, 4), 2),
                round(random.uniform(4.3, 4.9), 2),
                random.randint(500, 8000),
                1
            )
            merchants.append(merchant)

    cursor.executemany(sql, merchants)
    conn.commit()
    print(f"  已更新 {len(merchants)} 个商家")

    category_sql = """INSERT INTO takeout_category (merchant_id, name, sort_order, status)
                     VALUES (%s, %s, %s, %s)"""
    categories = []
    for merchant_id in range(1, len(merchants) + 1):
        for sort, category_name in enumerate(['热销推荐', '主食', '特色菜品', '小吃', '饮品'], 1):
            categories.append((merchant_id, category_name, sort, 1))
    cursor.executemany(category_sql, categories)
    conn.commit()
    print(f"  已更新 {len(categories)} 个分类")

    product_sql = """INSERT INTO takeout_product (merchant_id, category_id, name, description, image, price, stock, sales, status)
                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    products = []
    for merchant_id in range(1, len(merchants) + 1):
        base_category_id = (merchant_id - 1) * 5
        cuisine_types = list(DISH_NAMES.keys())
        selected_cuisines = random.sample(cuisine_types, min(3, len(cuisine_types)))

        for cuisine in selected_cuisines:
            dishes = random.sample(DISH_NAMES[cuisine], min(4, len(DISH_NAMES[cuisine])))
            category_id = base_category_id + random.choice([1, 2, 3, 4])
            for dish in dishes:
                products.append((
                    merchant_id,
                    category_id,
                    dish,
                    f"正宗{cuisine}，精选食材，口味鲜美",
                    f'/images/food/{dish}.jpg',
                    round(random.uniform(8, 45), 2),
                    random.randint(50, 200),
                    random.randint(100, 1000),
                    1
                ))

    cursor.executemany(product_sql, products)
    conn.commit()
    print(f"  已更新 {len(products)} 个菜品")

def check_and_update_lost_found(conn, cursor):
    print("更新失物招领数据...")
    cursor.execute("DELETE FROM lost_found")
    conn.commit()

    user_ids = [1]
    sql = """INSERT INTO lost_found
             (user_id, title, content, type, location, time, contact_name, contact_phone, status, view_count)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

    data = []
    for item_type, items in LOST_FOUND_ITEMS.items():
        type_id = 0 if item_type == '失物' else 1
        for item_name, category, detail in items:
            data.append((
                random.choice(user_ids),
                f"{item_type}{item_name}" if item_type == '失物' else f"捡到{item_name}",
                f"{'丢失' if item_type == '失物' else '捡到'}{category}，{detail}，请失主联系领取" if item_type == '招领' else f"寻找{item_name}，{detail}，如有捡到请联系",
                type_id,
                random.choice(CAMPUS_LOCATIONS),
                random_date_time(random.randint(1, 14)),
                fake.name(),
                generate_phone(),
                1,
                random.randint(20, 200)
            ))

    cursor.executemany(sql, data)
    conn.commit()
    print(f"  已更新 {len(data)} 条失物招领信息")

def check_and_update_secondhand(conn, cursor):
    print("更新二手商品数据...")
    cursor.execute("DELETE FROM secondhand_product")
    conn.commit()

    user_ids = [1]
    category_ids = [1, 2, 3, 4, 5, 6, 7, 8]

    sql = """INSERT INTO secondhand_product
             (user_id, category_id, title, description, original_price, sell_price, images, `condition`, status, view_count, favorite_count, contact_phone)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

    secondhand_items = [
        (1, 'iPhone 15 Pro Max 256G', '自用9成新，无任何问题，配件齐全', 8999, 6500),
        (1, 'MacBook Air M2', '轻薄便携，学生首选，无任何划痕', 9499, 7200),
        (1, 'iPad Pro 11寸', '配键盘和笔，学习办公神器', 6999, 4500),
        (1, 'AirPods Pro二代', '降噪耳机，功能正常', 1899, 1200),
        (1, '小米手环8 Pro', '运动健康，功能齐全', 399, 200),
        (2, '高等数学同济版第七版', '教材配套，自学考研必备', 58, 25),
        (2, '线性代数教材', '经典教材，适合各专业', 45, 18),
        (2, '大学英语1-4册', '全套完整，笔记清晰', 80, 35),
        (2, '数据结构与算法', '计算机专业必读', 65, 30),
        (2, '计算机网络原理', '考研复习资料', 55, 22),
        (3, '美的台灯', 'LED护眼，三档调光', 120, 45),
        (3, '床上书桌', '大学生必备，可折叠', 80, 30),
        (3, '收纳箱特大号', '整理衣物被褥', 60, 20),
        (3, '小风扇USB', '静音设计，宿舍可用', 35, 12),
        (3, '保温杯', '316不锈钢，大容量', 80, 35),
        (4, '斯伯丁篮球', '室外室内通用，耐打', 150, 60),
        (4, '尤尼克斯羽毛球拍', '专业级，双拍套装', 280, 120),
        (4, '红双喜乒乓球拍', '含球和拍套', 100, 40),
        (4, '瑜伽垫加厚', '健身必备，材质环保', 70, 25),
        (4, '哑铃一套', '可调节重量，健身塑形', 200, 80),
        (5, '优衣库羽绒服', 'L码，黑色，仅穿两次', 499, 180),
        (5, 'Nike运动鞋', '42码，经典款式', 599, 250),
        (5, 'Adidas运动裤', 'M码，休闲款', 299, 100),
        (5, '牛仔裤', '32码，九成新', 199, 60),
        (5, '纯棉T恤', '多色可选，M码', 89, 25),
        (6, '得力订书机', '省力型，送订书钉', 25, 8),
        (6, '晨光笔芯一盒', '0.5mm黑色，12支', 15, 5),
        (6, 'A4文件夹', '10个装，实用', 20, 7),
        (6, '笔记本子', '活页本，B5尺寸', 12, 4),
        (6, '计算器', '函数计算器，考试必备', 50, 18),
    ]

    data = []
    for category_id, title, desc, original_price, sell_price in secondhand_items:
        data.append((
            random.choice(user_ids),
            category_id,
            title,
            desc,
            original_price,
            sell_price,
            f'/images/secondhand/{title[:5]}.jpg',
            random.randint(2, 4),
            1,
            random.randint(30, 300),
            random.randint(5, 50),
            generate_phone()
        ))

    cursor.executemany(sql, data)
    conn.commit()
    print(f"  已更新 {len(data)} 个二手商品")

def check_and_update_delivery_orders(conn, cursor):
    print("更新配送请求数据...")
    cursor.execute("DELETE FROM delivery_request")
    conn.commit()

    user_ids = [1]
    sql = """INSERT INTO delivery_request
             (request_no, user_id, type, title, description, pickup_location, delivery_location, estimated_price, actual_price, status, delivery_person_id)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

    request_types = [
        (1, '代取快递', '帮忙取一下快递，包裹较小，在菜鸟驿站'),
        (1, '代取外卖', '帮忙从食堂取餐，已付款'),
        (2, '代购商品', '帮忙代购生活用品'),
        (2, '代买饮料', '帮忙买杯奶茶'),
        (3, '代打印', '帮忙打印复习资料'),
        (3, '代占座', '帮忙图书馆占座'),
    ]

    data = []
    for _ in range(50):
        type_info = random.choice(request_types)
        data.append((
            f"REQ{datetime.now().strftime('%Y%m%d%H%M%S')}{random.randint(1000, 9999)}",
            random.choice(user_ids),
            type_info[0],
            type_info[1],
            type_info[2],
            random.choice(CAMPUS_LOCATIONS),
            random.choice(CAMPUS_LOCATIONS),
            round(random.uniform(3, 15), 2),
            round(random.uniform(3, 15), 2),
            random.randint(1, 4),
            random.randint(1, 10) if random.random() > 0.3 else None
        ))

    cursor.executemany(sql, data)
    conn.commit()
    print(f"  已更新 {len(data)} 条配送请求")

def main():
    print("=" * 60)
    print("开始生成更真实的测试数据...")
    print("=" * 60)

    conn = get_connection()
    cursor = conn.cursor()

    try:
        check_and_update_campus(conn, cursor)
        check_and_update_merchant(conn, cursor)
        check_and_update_lost_found(conn, cursor)
        check_and_update_secondhand(conn, cursor)
        check_and_update_delivery_orders(conn, cursor)

        print("\n" + "=" * 60)
        print("真实数据生成完成！")
        print("=" * 60)

    except Exception as e:
        print(f"生成数据时出错: {e}")
        import traceback
        traceback.print_exc()
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    main()
