// 测试数据文件
export const testUserData = {
  username: 'testuser',
  password: 'testpassword',
  token: 'test_token_123456',
  userId: 1,
  nickname: '测试用户',
  avatar: 'https://example.com/avatar.jpg',
  phone: '13800138000',
}

export const testConfig = {
  user: {
    incompleteToken: 'incomplete_test_token',
  },
}

export const mockProduct = {
  id: 1,
  name: '测试商品',
  description: '这是一个测试商品',
  price: 99.99,
  originalPrice: 199.99,
  categoryId: 1,
  categoryName: '测试分类',
  brandId: 1,
  brandName: '测试品牌',
  mainImage: 'https://example.com/product.jpg',
  images: ['https://example.com/product1.jpg', 'https://example.com/product2.jpg'],
  skuList: [],
  status: 1,
  salesVolume: 50,
  stock: 100,
  isNew: false,
  isHot: false,
  createTime: '2024-01-01 00:00:00',
  updateTime: '2024-01-01 00:00:00',
}

export const recommendedProducts = [
  {
    id: 2,
    name: '推荐商品1',
    description: '推荐商品1描述',
    price: 199.99,
    originalPrice: 299.99,
    categoryId: 1,
    categoryName: '测试分类',
    brandId: 1,
    brandName: '测试品牌',
    mainImage: 'https://example.com/recommend1.jpg',
    images: ['https://example.com/recommend1.jpg'],
    skuList: [],
    status: 1,
    salesVolume: 20,
    stock: 30,
    isNew: false,
    isHot: true,
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00',
  },
  {
    id: 3,
    name: '推荐商品2',
    description: '推荐商品2描述',
    price: 299.99,
    originalPrice: 399.99,
    categoryId: 1,
    categoryName: '测试分类',
    brandId: 1,
    brandName: '测试品牌',
    mainImage: 'https://example.com/recommend2.jpg',
    images: ['https://example.com/recommend2.jpg'],
    skuList: [],
    status: 1,
    salesVolume: 15,
    stock: 25,
    isNew: true,
    isHot: false,
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00',
  },
]

export const inStockProduct = {
  ...mockProduct,
  stock: 50,
}

export const outOfStockProduct = {
  ...mockProduct,
  stock: 0,
}

// 订单测试数据
export const testOrder = {
  id: 1,
  orderNo: '202401010001',
  userId: 1,
  totalAmount: 299.97,
  actualAmount: 279.97,
  status: 1,
  statusText: '待付款',
  createTime: '2024-01-01 10:00:00',
  payTime: null,
  deliveryTime: null,
  finishTime: null,
  products: [
    {
      id: 1,
      productId: 1,
      productName: '测试商品',
      price: 99.99,
      quantity: 1,
      image: 'https://example.com/product.jpg',
    },
    {
      id: 2,
      productId: 2,
      productName: '推荐商品1',
      price: 199.99,
      quantity: 1,
      image: 'https://example.com/recommend1.jpg',
    },
  ],
  address: {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    address: '测试地址123号',
  },
}

// 购物车测试数据
export const testCart = {
  userId: 1,
  items: [
    {
      id: 1,
      productId: 1,
      productName: '测试商品',
      price: 99.99,
      quantity: 2,
      stock: 100,
      image: 'https://example.com/product.jpg',
      selected: true,
    },
    {
      id: 2,
      productId: 2,
      productName: '推荐商品1',
      price: 199.99,
      quantity: 1,
      stock: 30,
      image: 'https://example.com/recommend1.jpg',
      selected: false,
    },
  ],
  totalPrice: 299.98,
  selectedCount: 2,
}

// 分类测试数据
export const testCategories = [
  {
    id: 1,
    name: '测试分类',
    parentId: 0,
    level: 1,
    sort: 1,
    icon: 'https://example.com/category1.png',
    children: [
      {
        id: 2,
        name: '子分类1',
        parentId: 1,
        level: 2,
        sort: 1,
        icon: 'https://example.com/category2.png',
      },
      {
        id: 3,
        name: '子分类2',
        parentId: 1,
        level: 2,
        sort: 2,
        icon: 'https://example.com/category3.png',
      },
    ],
  },
  {
    id: 4,
    name: '测试分类2',
    parentId: 0,
    level: 1,
    sort: 2,
    icon: 'https://example.com/category4.png',
  },
]

// 品牌测试数据
export const testBrands = [
  {
    id: 1,
    name: '测试品牌',
    logo: 'https://example.com/brand1.png',
    sort: 1,
    status: 1,
  },
  {
    id: 2,
    name: '测试品牌2',
    logo: 'https://example.com/brand2.png',
    sort: 2,
    status: 1,
  },
]

// 地址测试数据
export const testAddresses = [
  {
    id: 1,
    userId: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    address: '测试地址123号',
    isDefault: true,
  },
  {
    id: 2,
    userId: 1,
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    address: '测试地址456号',
    isDefault: false,
  },
]

// 优惠券测试数据
export const testCoupons = [
  {
    id: 1,
    name: '满100减10',
    type: 1,
    value: 10,
    minAmount: 100,
    startDate: '2024-01-01 00:00:00',
    endDate: '2024-12-31 23:59:59',
    status: 1,
  },
  {
    id: 2,
    name: '全场9折',
    type: 2,
    value: 90,
    minAmount: 0,
    startDate: '2024-01-01 00:00:00',
    endDate: '2024-12-31 23:59:59',
    status: 1,
  },
]

// 评论测试数据
export const testComments = [
  {
    id: 1,
    productId: 1,
    userId: 1,
    nickname: '测试用户',
    avatar: 'https://example.com/avatar.jpg',
    content: '商品质量很好，非常满意',
    score: 5,
    images: ['https://example.com/comment1.jpg'],
    createTime: '2024-01-02 10:00:00',
  },
  {
    id: 2,
    productId: 1,
    userId: 2,
    nickname: '测试用户2',
    avatar: 'https://example.com/avatar2.jpg',
    content: '商品不错，物流很快',
    score: 4,
    images: [],
    createTime: '2024-01-03 15:00:00',
  },
]

// 统计数据测试数据
export const testStats = {
  sales: {
    total: 100000,
    today: 1000,
    yesterday: 950,
    trend: [1000, 950, 1100, 1200, 1050, 980, 1150],
  },
  orders: {
    total: 1000,
    today: 10,
    yesterday: 9,
    trend: [10, 9, 11, 12, 10, 9, 11],
  },
  users: {
    total: 500,
    today: 5,
    yesterday: 4,
    trend: [5, 4, 6, 7, 5, 4, 6],
  },
  products: {
    total: 200,
    inStock: 180,
    outOfStock: 20,
  },
}
