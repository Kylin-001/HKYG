#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
黑科易购项目测试数据生成脚本
用于生成符合项目业务需求的测试数据并导入数据库
"""

import random
import json
from datetime import datetime, timedelta
from faker import Faker
import pymysql

fake = Faker('zh_CN')

def random_date_time(months_ago=0, days_ago=0):
    now = datetime.now()
    if months_ago > 0:
        days = months_ago * 30
    else:
        days = days_ago
    return now - timedelta(days=days)

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

def get_connection():
    return pymysql.connect(**DB_CONFIG)

def generate_phone():
    return f"1{random.randint(3, 9)}{random.randint(100000000, 999999999)}"

def generate_order_no():
    return f"ORD{datetime.now().strftime('%Y%m%d%H%M%S')}{random.randint(1000, 9999)}"

def generate_request_no():
    return f"REQ{datetime.now().strftime('%Y%m%d%H%M%S')}{random.randint(1000, 9999)}"

def insert_user_login_history(conn, cursor, user_ids, count=50):
    print("生成用户登录历史数据...")
    sql = """INSERT INTO user_login_history
             (user_id, login_account, login_ip, login_location, browser, os, login_status, login_time, device)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    data = []
    for _ in range(count):
        user_id = random.choice(user_ids)
        data.append((
            user_id,
            f"user{user_id}",
            fake.ipv4(),
            fake.city(),
            random.choice(['Chrome', 'Firefox', 'Safari', 'Edge']),
            random.choice(['Windows', 'macOS', 'Android', 'iOS']),
            random.choice([1, 1, 1, 0]),
            random_date_time(months_ago=3),
            random.choice(['PC', 'Mobile', 'Tablet'])
        ))
    cursor.executemany(sql, data)
    conn.commit()
    print(f"  已插入 {count} 条记录")

def insert_campus(conn, cursor):
    print("生成校园数据...")
    cursor.execute("SELECT COUNT(*) FROM campus")
    if cursor.fetchone()[0] > 0:
        print("  校园数据已存在，跳过")
        return [1, 2, 3, 4, 5]
    sql = """INSERT IGNORE INTO campus (name, code, province, city, district, address, status)
             VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    campuses = [
        ('黑科技大学', 'HKUST', '黑龙江省', '哈尔滨市', '南岗区', '哈尔滨市南岗区学府路52号', 1),
        ('哈工程大学', 'HEU', '黑龙江省', '哈尔滨市', '南岗区', '哈尔滨市南岗区南通大街145号', 1),
        ('哈尔滨工业大学', 'HIT', '黑龙江省', '哈尔滨市', '南岗区', '哈尔滨市南岗区西大直街92号', 1),
        ('东北林业大学', 'NEFU', '黑龙江省', '哈尔滨市', '香坊区', '哈尔滨市香坊区和兴路26号', 1),
        ('东北农业大学', 'NEAU', '黑龙江省', '哈尔滨市', '香坊区', '哈尔滨市香坊区长江路600号', 1),
    ]
    cursor.executemany(sql, campuses)
    conn.commit()
    return [1, 2, 3, 4, 5]

def insert_campus_notice(conn, cursor, campus_ids):
    print("生成校园公告数据...")
    cursor.execute("SELECT COUNT(*) FROM campus_notice")
    if cursor.fetchone()[0] > 0:
        print("  校园公告数据已存在，跳过")
        return
    sql = """INSERT IGNORE INTO campus_notice (title, content, type, publisher, status, view_count)
             VALUES (%s, %s, %s, %s, %s, %s)"""
    notices = [
        ('关于2024年春季学期开学通知', '亲爱的同学们，新学期即将开始，请按时返校...', 1, '教务处', 1, random.randint(100, 500)),
        ('校园美食节活动公告', '本周五将举办校园美食节，欢迎各位同学参加...', 2, '学生会', 1, random.randint(200, 800)),
        ('防范网络诈骗安全提示', '近期网络诈骗案件频发，请各位同学提高警惕...', 3, '保卫处', 1, random.randint(300, 1000)),
        ('图书馆开放时间调整', '为方便同学们学习，图书馆开放时间进行调整...', 1, '图书馆', 1, random.randint(150, 600)),
        ('校园网络维护通知', '本周六进行网络维护，届时部分区域网络可能不稳定...', 1, '信息中心', 1, random.randint(80, 300)),
    ]
    cursor.executemany(sql, notices)
    conn.commit()

def insert_member_level(conn, cursor):
    print("生成会员等级数据...")
    cursor.execute("SELECT COUNT(*) FROM member_level")
    if cursor.fetchone()[0] > 0:
        print("  会员等级数据已存在，跳过")
        return [1, 2, 3, 4, 5]
    sql = """INSERT IGNORE INTO member_level (name, level, min_points, discount, icon, description, status)
             VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    levels = [
        ('普通会员', 1, 0, 1.00, '/icons/level1.png', '普通会员', 1),
        ('铜牌会员', 2, 500, 0.98, '/icons/level2.png', '铜牌会员享受98折', 1),
        ('银牌会员', 3, 2000, 0.95, '/icons/level3.png', '银牌会员享受95折', 1),
        ('金牌会员', 4, 5000, 0.92, '/icons/level4.png', '金牌会员享受92折', 1),
        ('钻石会员', 5, 10000, 0.88, '/icons/level5.png', '钻石会员享受88折', 1),
    ]
    cursor.executemany(sql, levels)
    conn.commit()
    return [1, 2, 3, 4, 5]

def insert_point_rule(conn, cursor):
    print("生成积分规则数据...")
    cursor.execute("SELECT COUNT(*) FROM point_rule")
    if cursor.fetchone()[0] > 0:
        print("  积分规则数据已存在，跳过")
        return
    sql = """INSERT IGNORE INTO point_rule (rule_key, rule_name, points, description, status)
             VALUES (%s, %s, %s, %s, %s)"""
    rules = [
        ('daily_signin', '每日签到', 10, '每日签到获得10积分', 1),
        ('consume', '消费积分', 1, '消费1元获得1积分', 1),
        ('order_complete', '完成订单', 50, '完成订单获得50积分', 1),
        ('comment', '评价奖励', 20, '订单评价获得20积分', 1),
        ('invite_friend', '邀请好友', 100, '邀请新用户注册获得100积分', 1),
        ('exchange_coupon', '优惠券兑换', -100, '100积分兑换优惠券', 1),
    ]
    cursor.executemany(sql, rules)
    conn.commit()

def insert_point_product(conn, cursor):
    print("生成积分商品数据...")
    cursor.execute("SELECT COUNT(*) FROM point_product")
    if cursor.fetchone()[0] > 0:
        print("  积分商品数据已存在，跳过")
        return
    sql = """INSERT IGNORE INTO point_product (name, description, image, points, stock, exchange_count, status)
             VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    products = [
        ('蓝牙耳机', '无线蓝牙耳机，音质清晰', '/images/points/earphone.jpg', 500, 20, 5, 1),
        ('充电宝', '10000mAh大容量充电宝', '/images/points/powerbank.jpg', 300, 30, 10, 1),
        ('雨伞', '折叠晴雨伞，轻便易携带', '/images/points/umbrella.jpg', 200, 50, 15, 1),
        ('水杯', '保温水杯，多色可选', '/images/points/cup.jpg', 150, 40, 20, 1),
        ('笔记本', '精美笔记本，实用又好看', '/images/points/notebook.jpg', 100, 100, 30, 1),
        ('U盘', '32GB USB3.0U盘', '/images/points/udisk.jpg', 250, 25, 8, 1),
    ]
    cursor.executemany(sql, products)
    conn.commit()

def insert_coupon(conn, cursor):
    print("生成优惠券数据...")
    cursor.execute("SELECT COUNT(*) FROM coupon")
    if cursor.fetchone()[0] > 0:
        print("  优惠券数据已存在，跳过")
        return [1, 2, 3, 4, 5]
    sql = """INSERT IGNORE INTO coupon (name, type, value, min_amount, total_count, received_count, used_count, valid_from, valid_to, status)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    now = datetime.now()
    coupons = [
        ('新人满减券', 1, 10.00, 50.00, 1000, 200, 50, now, now + timedelta(days=30), 1),
        ('5元无门槛券', 3, 5.00, 0.00, 2000, 500, 100, now, now + timedelta(days=15), 1),
        ('满20减3', 1, 3.00, 20.00, 5000, 1000, 300, now, now + timedelta(days=7), 1),
        ('8折折扣券', 2, 0.80, 30.00, 2000, 400, 80, now, now + timedelta(days=14), 1),
        ('满50减15', 1, 15.00, 50.00, 1000, 150, 30, now, now + timedelta(days=30), 1),
    ]
    cursor.executemany(sql, coupons)
    conn.commit()
    return [1, 2, 3, 4, 5]

def insert_user_coupon(conn, cursor, user_ids, coupon_ids, count=100):
    print("生成用户优惠券数据...")
    sql = """INSERT INTO user_coupon (user_id, coupon_id, status, create_time)
             VALUES (%s, %s, %s, %s)"""
    data = []
    for _ in range(count):
        data.append((
            random.choice(user_ids),
            random.choice(coupon_ids),
            random.choice([1, 1, 1, 2]),
            random_date_time(days_ago=30)
        ))
    cursor.executemany(sql, data)
    conn.commit()
    print(f"  已插入 {count} 条记录")

def insert_merchant(conn, cursor):
    print("生成商家数据...")
    cursor.execute("SELECT COUNT(*) FROM merchant")
    if cursor.fetchone()[0] > 0:
        print("  商家数据已存在，跳过")
        return [1, 2, 3, 4, 5, 6, 7, 8]
    sql = """INSERT IGNORE INTO merchant (name, description, logo, address, phone, business_hours, min_price, delivery_fee, rating, sales, status)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    merchants = [
        ('麦当劳', '经典西式快餐', '/images/merchant/mcdonalds.png', '学府路52号', '0451-88888888', '07:00-22:00', 20.00, 3.00, 4.80, 5000, 1),
        ('肯德基', '香脆可口的炸鸡', '/images/merchant/kfc.png', '南通大街145号', '0451-87777777', '07:00-23:00', 25.00, 3.00, 4.75, 4500, 1),
        ('黄焖鸡米饭', '特色黄焖鸡', '/images/merchant/huangmen.png', '和兴路26号', '0451-86666666', '10:00-21:00', 15.00, 2.00, 4.60, 3000, 1),
        ('兰州拉面', '正宗西北拉面', '/images/merchant/lanzhou.png', '长江路600号', '0451-85555555', '06:00-22:00', 12.00, 2.00, 4.70, 3500, 1),
        ('沙县小吃', '经济实惠选择', '/images/merchant/shaxian.png', '西大直街92号', '0451-84444444', '06:00-23:00', 10.00, 1.50, 4.50, 4000, 1),
        ('杨国福麻辣烫', '麻辣鲜香', '/images/merchant/yangguofu.png', '学府路52号', '0451-83333333', '10:00-22:00', 18.00, 2.50, 4.65, 2800, 1),
        ('益禾堂', '奶茶甜品', '/images/merchant/yihetang.png', '南通大街145号', '0451-82222222', '09:00-23:00', 15.00, 2.00, 4.80, 3200, 1),
        ('正新鸡排', '香脆鸡排', '/images/merchant/zhengxin.png', '和兴路26号', '0451-81111111', '10:00-22:00', 12.00, 1.50, 4.55, 2500, 1),
    ]
    cursor.executemany(sql, merchants)
    conn.commit()
    return [1, 2, 3, 4, 5, 6, 7, 8]

def insert_takeout_category(conn, cursor, merchant_ids):
    print("生成外卖分类数据...")
    cursor.execute("SELECT COUNT(*) FROM takeout_category")
    if cursor.fetchone()[0] > 0:
        print("  外卖分类数据已存在，跳过")
        return list(range(1, len(merchant_ids) * 4 + 1))
    sql = """INSERT IGNORE INTO takeout_category (merchant_id, name, sort_order, status)
             VALUES (%s, %s, %s, %s)"""
    data = []
    for merchant_id in merchant_ids:
        categories = [
            (merchant_id, '热销推荐', 1, 1),
            (merchant_id, '主食', 2, 1),
            (merchant_id, '小吃', 3, 1),
            (merchant_id, '饮料', 4, 1),
        ]
        data.extend(categories)
    cursor.executemany(sql, data)
    conn.commit()
    return list(range(1, len(merchant_ids) * 4 + 1))

def insert_takeout_product(conn, cursor, merchant_ids, category_ids):
    print("生成外卖商品数据...")
    cursor.execute("SELECT COUNT(*) FROM takeout_product")
    if cursor.fetchone()[0] > 0:
        print("  外卖商品数据已存在，跳过")
        return list(range(1, 25))
    sql = """INSERT IGNORE INTO takeout_product (merchant_id, category_id, name, description, image, price, stock, sales, status)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    products = [
        (1, 1, '巨无霸套餐', '经典巨无霸搭配薯条可乐', '/images/food/burger_set.jpg', 35.00, 100, 500, 1),
        (1, 2, '香辣鸡腿堡', '香辣鸡腿汉堡', '/images/food/spicy_chicken.jpg', 18.00, 100, 300, 1),
        (1, 3, '薯条(大)', '金黄酥脆薯条', '/images/food/fries.jpg', 12.00, 100, 400, 1),
        (1, 4, '可口可乐(大)', '冰爽可口可乐', '/images/food/coke.jpg', 8.00, 100, 350, 1),
        (2, 5, '香辣鸡翅', '香辣诱人的鸡翅', '/images/food/spicy_wing.jpg', 15.00, 100, 280, 1),
        (2, 6, '奥尔良烤鸡腿饭', '奥尔良风味烤鸡腿', '/images/food/chicken_rice.jpg', 22.00, 100, 250, 1),
        (2, 7, '鸡米花', '酥脆鸡米花', '/images/food/nuggets.jpg', 12.00, 100, 200, 1),
        (2, 8, '奶茶', '香浓奶茶', '/images/food/milk_tea.jpg', 10.00, 100, 180, 1),
        (3, 9, '黄焖鸡套餐', '黄焖鸡米饭套餐', '/images/food/huangmen_chicken.jpg', 25.00, 50, 400, 1),
        (3, 10, '黄焖排骨', '黄焖排骨米饭', '/images/food/huangmen_ribs.jpg', 28.00, 50, 350, 1),
        (3, 11, '卤蛋', '秘制卤蛋', '/images/food/egg.jpg', 3.00, 100, 300, 1),
        (4, 13, '牛肉拉面', '正宗兰州牛肉拉面', '/images/food/beef_noodles.jpg', 18.00, 100, 500, 1),
        (4, 14, '羊肉拉面', '鲜美羊肉拉面', '/images/food/lamb_noodles.jpg', 22.00, 100, 400, 1),
        (4, 15, '牛肉饼', '香脆牛肉饼', '/images/food/beef_cake.jpg', 8.00, 100, 250, 1),
        (5, 17, '拌面', '特色拌面', '/images/food/mixed_noodles.jpg', 12.00, 100, 300, 1),
        (5, 18, '蒸饺', '手工蒸饺', '/images/food/dumpling.jpg', 15.00, 100, 280, 1),
        (5, 19, '炒饭', '扬州炒饭', '/images/food/fried_rice.jpg', 15.00, 100, 320, 1),
        (6, 21, '麻辣烫套餐', '按称重计算', '/images/food/malatang.jpg', 20.00, 50, 450, 1),
        (6, 22, '麻辣拌', '特色麻辣拌', '/images/food/malaban.jpg', 18.00, 50, 380, 1),
        (7, 25, '烤奶', '招牌烤奶', '/images/food/roasted_milk.jpg', 12.00, 100, 400, 1),
        (7, 26, '芝士奶盖', '浓郁芝士奶盖', '/images/food/cheese_tea.jpg', 15.00, 100, 350, 1),
        (7, 27, '水果茶', '新鲜水果茶', '/images/food/fruit_tea.jpg', 18.00, 100, 300, 1),
        (8, 29, '大份鸡排', '香脆大鸡排', '/images/food/chicken_strip.jpg', 12.00, 100, 500, 1),
        (8, 31, '骨肉相连', '香辣骨肉相连', '/images/food/bone_meat.jpg', 8.00, 100, 350, 1),
    ]
    cursor.executemany(sql, products)
    conn.commit()
    return list(range(1, 25))

def insert_takeout_locker(conn, cursor):
    print("生成外卖柜数据...")
    cursor.execute("SELECT COUNT(*) FROM takeout_locker")
    if cursor.fetchone()[0] > 0:
        print("  外卖柜数据已存在，跳过")
        return list(range(1, 13))
    sql = """INSERT IGNORE INTO takeout_locker (locker_no, location, status)
             VALUES (%s, %s, %s)"""
    lockers = [
        ('L001', '一期宿舍楼A栋1楼', 1),
        ('L002', '一期宿舍楼A栋2楼', 1),
        ('L003', '一期宿舍楼B栋1楼', 1),
        ('L004', '一期宿舍楼B栋2楼', 1),
        ('L005', '二期宿舍楼C栋1楼', 1),
        ('L006', '二期宿舍楼C栋2楼', 1),
        ('L007', '三期宿舍楼D栋1楼', 1),
        ('L008', '三期宿舍楼D栋2楼', 1),
        ('L009', '食堂1楼大厅', 1),
        ('L010', '食堂2楼大厅', 1),
        ('L011', '图书馆1楼', 1),
        ('L012', '体育馆1楼', 1),
    ]
    cursor.executemany(sql, lockers)
    conn.commit()
    return list(range(1, 13))

def insert_secondhand_category(conn, cursor):
    print("生成二手分类数据...")
    cursor.execute("SELECT COUNT(*) FROM secondhand_category")
    if cursor.fetchone()[0] > 0:
        print("  二手分类数据已存在，跳过")
        return [1, 2, 3, 4, 5, 6, 7, 8]
    sql = """INSERT IGNORE INTO secondhand_category (name, parent_id, sort_order, status)
             VALUES (%s, %s, %s, %s)"""
    categories = [
        ('电子产品', 0, 1, 1),
        ('图书教材', 0, 2, 1),
        ('生活用品', 0, 3, 1),
        ('运动器材', 0, 4, 1),
        ('服装鞋帽', 0, 5, 1),
        ('文具办公', 0, 6, 1),
        ('美妆个护', 0, 7, 1),
        ('其他', 0, 8, 1),
    ]
    cursor.executemany(sql, categories)
    conn.commit()
    return [1, 2, 3, 4, 5, 6, 7, 8]

def insert_secondhand_product(conn, cursor, user_ids, category_ids):
    print("生成二手商品数据...")
    cursor.execute("SELECT COUNT(*) FROM secondhand_product")
    if cursor.fetchone()[0] > 0:
        print("  二手商品数据已存在，跳过")
        return
    sql = """INSERT IGNORE INTO secondhand_product
             (user_id, category_id, title, description, original_price, sell_price, images, `condition`, status, view_count, favorite_count, contact_phone)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    data = []
    titles = [
        'iPhone13 Pro Max 95新', 'ThinkPad笔记本', '小米平板5', 'AirPods Pro',
        '高等数学教材', '大学英语教材', '计算机基础', '数据结构与算法',
        '台灯', '收纳箱', '床上桌', '电风扇',
        '篮球', '羽毛球拍', '乒乓球拍', '瑜伽垫',
        '冬季棉服', '运动鞋', '牛仔裤', 'T恤',
        '笔记本', '水性笔', '文件夹', '订书机',
        '护肤品套装', '化妆品', '面膜', '洗发水',
    ]
    for i, title in enumerate(titles):
        data.append((
            random.choice(user_ids),
            random.choice(category_ids),
            title,
            f'{title}，九成新，使用时间不长，质量良好',
            random.randint(50, 5000),
            random.randint(20, 2500),
            '/images/secondhand/item' + str(i+1) + '.jpg',
            random.choice([1, 2, 3, 4]),
            random.choice([1, 1, 1, 2]),
            random.randint(10, 200),
            random.randint(0, 50),
            generate_phone()
        ))
    cursor.executemany(sql, data)
    conn.commit()
    print(f"  已插入 {len(titles)} 条记录")

def insert_delivery_person(conn, cursor, user_ids):
    print("生成配送员数据...")
    cursor.execute("SELECT COUNT(*) FROM delivery_person")
    if cursor.fetchone()[0] > 0:
        print("  配送员数据已存在，跳过")
        return list(range(1, 11))
    sql = """INSERT IGNORE INTO delivery_person (user_id, name, phone, id_card, avatar, status, rating, total_orders, total_distance, balance)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    data = []
    for i in range(10):
        user_id = user_ids[i] if i < len(user_ids) else random.choice(user_ids)
        data.append((
            user_id,
            fake.name(),
            generate_phone(),
            f'{random.randint(110000, 659999)}{random.randint(19500101, 20031231)}{random.randint(1000, 9999)}',
            f'/images/avatar/delivery_{i+1}.jpg',
            1,
            round(random.uniform(4.5, 5.0), 2),
            random.randint(100, 1000),
            round(random.uniform(500, 5000), 2),
            round(random.uniform(100, 2000), 2)
        ))
    cursor.executemany(sql, data)
    conn.commit()
    return list(range(1, 11))

def insert_delivery_user(conn, cursor, user_ids):
    print("生成配送用户数据...")
    cursor.execute("SELECT COUNT(*) FROM delivery_user")
    if cursor.fetchone()[0] > 0:
        print("  配送用户数据已存在，跳过")
        return list(range(1, 6))
    sql = """INSERT IGNORE INTO delivery_user (user_id, real_name, phone, avatar, status, rating, total_delivery)
             VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    data = []
    for i in range(5):
        user_id = user_ids[i] if i < len(user_ids) else random.choice(user_ids)
        data.append((
            user_id,
            fake.name(),
            generate_phone(),
            f'/images/avatar/user_{i+1}.jpg',
            1,
            round(random.uniform(4.5, 5.0), 2),
            random.randint(50, 500)
        ))
    cursor.executemany(sql, data)
    conn.commit()
    return list(range(1, 6))

def insert_delivery_request(conn, cursor, user_ids, delivery_person_ids):
    print("生成配送请求数据...")
    cursor.execute("SELECT COUNT(*) FROM delivery_request")
    if cursor.fetchone()[0] > 0:
        print("  配送请求数据已存在，跳过")
        return
    sql = """INSERT IGNORE INTO delivery_request
             (request_no, user_id, type, title, description, pickup_location, delivery_location, estimated_price, actual_price, status, delivery_person_id)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    data = []
    types = [
        ('代取快递', '请帮忙取一下快递，包裹较小'),
        ('代购商品', '帮忙代购一些生活用品'),
        ('代办服务', '帮忙代打印材料'),
    ]
    for _ in range(30):
        type_idx = random.randint(0, 2)
        data.append((
            generate_request_no(),
            random.choice(user_ids),
            type_idx + 1,
            types[type_idx][0],
            types[type_idx][1],
            fake.address(),
            fake.address(),
            round(random.uniform(5, 30), 2),
            round(random.uniform(5, 30), 2),
            random.choice([1, 2, 3, 4]),
            random.choice(delivery_person_ids) if random.random() > 0.3 else None
        ))
    cursor.executemany(sql, data)
    conn.commit()
    print(f"  已插入 30 条记录")

def insert_takeout_order(conn, cursor, user_ids, merchant_ids, delivery_person_ids, product_ids):
    print("生成外卖订单数据...")
    cursor.execute("SELECT COUNT(*) FROM takeout_order")
    if cursor.fetchone()[0] > 0:
        print("  外卖订单数据已存在，跳过")
        return list(range(1, 51))
    sql = """INSERT IGNORE INTO takeout_order
             (order_no, user_id, merchant_id, total_amount, delivery_fee, discount_amount, actual_amount, status, delivery_address, delivery_phone, delivery_name, delivery_person_id, pickup_code)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    data = []
    for _ in range(50):
        merchant_id = random.choice(merchant_ids)
        total = round(random.uniform(20, 80), 2)
        delivery_fee = 2.0
        discount = round(random.uniform(0, 10), 2)
        data.append((
            generate_order_no(),
            random.choice(user_ids),
            merchant_id,
            total,
            delivery_fee,
            discount,
            round(total + delivery_fee - discount, 2),
            random.choice([3, 4, 4, 4]),
            fake.address(),
            generate_phone(),
            fake.name(),
            random.choice(delivery_person_ids),
            f"{random.randint(1000, 9999)}"
        ))
    cursor.executemany(sql, data)
    conn.commit()
    return list(range(1, 51))

def insert_takeout_order_item(conn, cursor, order_ids, product_ids):
    print("生成外卖订单明细数据...")
    cursor.execute("SELECT COUNT(*) FROM takeout_order_item")
    if cursor.fetchone()[0] > 0:
        print("  外卖订单明细数据已存在，跳过")
        return
    sql = """INSERT INTO takeout_order_item
             (order_id, product_id, product_name, product_image, price, quantity, subtotal)
             VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    data = []
    product_names = ['巨无霸套餐', '香辣鸡腿堡', '薯条(大)', '可口可乐(大)', '香辣鸡翅',
                     '奥尔良烤鸡腿饭', '黄焖鸡套餐', '牛肉拉面', '烤奶', '大份鸡排']
    for order_id in order_ids[:30]:
        for _ in range(random.randint(1, 3)):
            product_id = random.choice(product_ids)
            price = round(random.uniform(8, 35), 2)
            quantity = random.randint(1, 2)
            data.append((
                order_id,
                product_id,
                random.choice(product_names),
                f'/images/food/item{product_id}.jpg',
                price,
                quantity,
                round(price * quantity, 2)
            ))
    cursor.executemany(sql, data)
    conn.commit()
    print(f"  已插入 {len(data)} 条记录")

def insert_lost_found(conn, cursor, user_ids):
    print("生成失物招领数据...")
    cursor.execute("SELECT COUNT(*) FROM lost_found")
    if cursor.fetchone()[0] > 0:
        print("  失物招领数据已存在，跳过")
        return
    sql = """INSERT IGNORE INTO lost_found
             (user_id, title, content, type, location, time, contact_name, contact_phone, status, view_count)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    data = []
    lost_items = [
        ('捡到校园卡', '捡到一张校园卡，请失主联系领取', 1, '食堂一楼'),
        ('丢失黑色钱包', '在图书馆丢失黑色钱包一个', 0, '图书馆三楼'),
        ('捡到钥匙串', '捡到钥匙串一串', 1, '教学楼A座'),
        ('丢失雨伞', '蓝色雨伞丢失在教室', 0, '教学楼B座'),
        ('捡到耳机', '捡到无线耳机一副', 1, '体育馆'),
    ]
    for item in lost_items:
        data.append((
            random.choice(user_ids),
            item[0],
            item[1],
            item[2],
            item[3],
            random_date_time(days_ago=14),
            fake.name(),
            generate_phone(),
            random.choice([1, 1, 1, 2]),
            random.randint(10, 100)
        ))
    cursor.executemany(sql, data)
    conn.commit()
    print(f"  已插入 {len(lost_items)} 条记录")

def insert_product_comment(conn, cursor, user_ids, product_ids):
    print("生成商品评价数据...")
    cursor.execute("SELECT COUNT(*) FROM product_comment")
    if cursor.fetchone()[0] > 0:
        print("  商品评价数据已存在，跳过")
        return
    sql = """INSERT IGNORE INTO product_comment
             (product_id, user_id, rating, content, images, like_count, status)
             VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    data = []
    comments = [
        '商品很好用，赞一个！', '性价比很高，推荐购买', '配送速度快，包装完好',
        '味道不错，会再次购买', '质量一般般吧', '老板服务态度好',
        '非常满意的一次购物体验', '商品和描述一致', '下次还会来',
    ]
    for _ in range(30):
        data.append((
            random.choice(product_ids),
            random.choice(user_ids),
            random.randint(3, 5),
            random.choice(comments),
            '/images/comment/' + str(random.randint(1, 10)) + '.jpg',
            random.randint(0, 20),
            1
        ))
    cursor.executemany(sql, data)
    conn.commit()
    print(f"  已插入 30 条记录")

def insert_order_review(conn, cursor, user_ids, product_ids):
    print("生成订单评价数据...")
    cursor.execute("SELECT COUNT(*) FROM order_review")
    if cursor.fetchone()[0] > 0:
        print("  订单评价数据已存在，跳过")
        return
    try:
        sql = """INSERT IGNORE INTO order_review
                 (order_no, user_id, product_id, rating, content)
                 VALUES (%s, %s, %s, %s, %s)"""
        data = []
        for _ in range(20):
            data.append((
                generate_order_no(),
                random.choice(user_ids),
                random.choice(product_ids),
                random.randint(4, 5),
                random.choice(['好评！', '非常满意', '服务周到', '值得推荐'])
            ))
        cursor.executemany(sql, data)
        conn.commit()
        print(f"  已插入 20 条记录")
    except Exception as e:
        print(f"  订单评价数据插入失败: {e}")
        conn.rollback()

def insert_member_receive_address(conn, cursor, user_ids):
    print("生成会员收货地址数据...")
    cursor.execute("SELECT COUNT(*) FROM member_receive_address")
    if cursor.fetchone()[0] > 0:
        print("  会员收货地址数据已存在，跳过")
        return
    sql = """INSERT IGNORE INTO member_receive_address
             (user_id, consignee, phone, province, city, district, detail_address, is_default)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
    data = []
    for user_id in user_ids[:20]:
        data.append((
            user_id,
            fake.name(),
            generate_phone(),
            '黑龙江省',
            '哈尔滨市',
            random.choice(['南岗区', '香坊区', '道里区', '道外区']),
            f'{fake.street_address()} {random.randint(1, 30)}栋 {random.randint(101, 2999)}室',
            1 if random.random() > 0.3 else 0
        ))
    cursor.executemany(sql, data)
    conn.commit()
    print(f"  已插入 {len(data)} 条记录")

def insert_point_record(conn, cursor, user_ids):
    print("生成积分记录数据...")
    cursor.execute("SELECT COUNT(*) FROM point_record")
    if cursor.fetchone()[0] > 0:
        print("  积分记录数据已存在，跳过")
        return
    sql = """INSERT IGNORE INTO point_record
             (user_id, type, points, balance, description)
             VALUES (%s, %s, %s, %s, %s)"""
    data = []
    types = [
        (1, '每日签到奖励'),
        (2, '消费获得积分'),
        (3, '充值获得积分'),
        (4, '积分兑换商品'),
    ]
    for user_id in user_ids:
        for _ in range(random.randint(1, 5)):
            type_info = random.choice(types)
            data.append((
                user_id,
                type_info[0],
                random.randint(10, 500) * (1 if type_info[0] in [1, 2, 3] else -1),
                random.randint(100, 5000),
                type_info[1]
            ))
    cursor.executemany(sql, data)
    conn.commit()
    print(f"  已插入 {len(data)} 条记录")

def get_existing_user_ids(cursor):
    cursor.execute("SELECT id FROM user LIMIT 50")
    return [row[0] for row in cursor.fetchall()]

def main():
    print("=" * 50)
    print("开始生成测试数据...")
    print("=" * 50)

    conn = get_connection()
    cursor = conn.cursor()

    try:
        user_ids = get_existing_user_ids(cursor)
        if not user_ids:
            print("错误：数据库中没有用户数据，请先确保user表有数据")
            return

        print(f"\n获取到 {len(user_ids)} 个现有用户ID")

        campus_ids = insert_campus(conn, cursor)
        insert_campus_notice(conn, cursor, campus_ids)

        member_level_ids = insert_member_level(conn, cursor)
        insert_point_rule(conn, cursor)
        insert_point_product(conn, cursor)

        coupon_ids = insert_coupon(conn, cursor)
        insert_user_coupon(conn, cursor, user_ids, coupon_ids, 100)

        merchant_ids = insert_merchant(conn, cursor)
        category_ids = insert_takeout_category(conn, cursor, merchant_ids)
        product_ids = insert_takeout_product(conn, cursor, merchant_ids, category_ids)
        locker_ids = insert_takeout_locker(conn, cursor)

        secondhand_category_ids = insert_secondhand_category(conn, cursor)
        insert_secondhand_product(conn, cursor, user_ids, secondhand_category_ids)

        delivery_person_ids = insert_delivery_person(conn, cursor, user_ids)
        insert_delivery_request(conn, cursor, user_ids, delivery_person_ids)

        delivery_user_ids = insert_delivery_user(conn, cursor, user_ids)

        order_ids = insert_takeout_order(conn, cursor, user_ids, merchant_ids, delivery_person_ids, product_ids)
        insert_takeout_order_item(conn, cursor, order_ids, product_ids)

        insert_lost_found(conn, cursor, user_ids)
        insert_product_comment(conn, cursor, user_ids, product_ids[:10])
        insert_order_review(conn, cursor, user_ids, product_ids[:10])

        insert_member_receive_address(conn, cursor, user_ids)

        insert_point_record(conn, cursor, user_ids)

        insert_user_login_history(conn, cursor, user_ids, 50)

        print("\n" + "=" * 50)
        print("测试数据生成完成！")
        print("=" * 50)

    except Exception as e:
        print(f"生成数据时出错: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    main()
