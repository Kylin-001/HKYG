// src/mock/___index.bundled_1777217468484_qexcpgr9vo.bundled_1777275554486_myb0w3xv52b.bundled_1777275688292_mcdxuk6mc0j.mjs
function paginate(data, page, pageSize) {
  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const list = data.slice(startIndex, startIndex + pageSize);
  return {
    list,
    total,
    page,
    pageSize,
    totalPages
  };
}
function successResponse(data) {
  return {
    code: 200,
    message: "success",
    data,
    timestamp: Date.now()
  };
}
function generateOrderNo() {
  const now = /* @__PURE__ */ new Date();
  const dateStr = now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, "0") + now.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1e6).toString().padStart(6, "0");
  return `HK${dateStr}${random}`;
}
var categories = [
  { id: "cat1", name: "\u6570\u7801\u7535\u5B50", icon: "laptop", description: "\u624B\u673A\u3001\u7535\u8111\u3001\u5E73\u677F\u7B49\u7535\u5B50\u8BBE\u5907" },
  { id: "cat2", name: "\u56FE\u4E66\u6587\u5177", icon: "book", description: "\u6559\u6750\u3001\u53C2\u8003\u4E66\u3001\u6587\u5177\u7528\u54C1" },
  { id: "cat3", name: "\u751F\u6D3B\u65E5\u7528", icon: "home", description: "\u65E5\u7528\u54C1\u3001\u6536\u7EB3\u3001\u6E05\u6D01\u7528\u54C1" },
  { id: "cat4", name: "\u8FD0\u52A8\u6237\u5916", icon: "basketball", description: "\u8FD0\u52A8\u88C5\u5907\u3001\u6237\u5916\u7528\u54C1" },
  { id: "cat5", name: "\u98DF\u54C1\u996E\u6599", icon: "coffee", description: "\u96F6\u98DF\u3001\u996E\u6599\u3001\u7279\u4EA7" }
];
var products = [
  // 数码电子类 (5个)
  {
    id: "prod001",
    name: "\u534E\u4E3A MateBook D14 \u7B14\u8BB0\u672C\u7535\u8111",
    categoryId: "cat1",
    price: 4299,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop"
    ],
    description: "2024\u6B3E \u534E\u4E3AMateBook D14 14\u82F1\u5BF8\u8F7B\u8584\u672C\uFF0C\u9002\u5408\u5B66\u4E60\u548C\u529E\u516C\u4F7F\u7528",
    detail: "<p><strong>\u4EA7\u54C1\u7279\u70B9\uFF1A</strong></p><ul><li>\u5904\u7406\u5668\uFF1AAMD R5-7530U</li><li>\u5185\u5B58\uFF1A16GB DDR4</li><li>\u786C\u76D8\uFF1A512GB SSD</li><li>\u5C4F\u5E55\uFF1A14\u82F1\u5BF8 1080P IPS</li><li>\u7EED\u822A\uFF1A\u7EA68\u5C0F\u65F6</li></ul>",
    stock: 15,
    sales: 128,
    rating: 4.8,
    reviewCount: 56,
    status: "on_sale",
    tags: ["\u7B14\u8BB0\u672C", "\u534E\u4E3A", "\u5B66\u751F\u4F18\u60E0"],
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-03-20T08:30:00Z"
  },
  {
    id: "prod002",
    name: "\u5C0F\u7C73 Redmi Note 13 Pro \u624B\u673A",
    categoryId: "cat1",
    price: 1599,
    originalPrice: 1899,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop"
    ],
    description: "Redmi Note 13 Pro 5G\u624B\u673A\uFF0C1\u4EBF\u50CF\u7D20\u4E3B\u6444\uFF0C\u6027\u4EF7\u6BD4\u4E4B\u9009",
    detail: "<p>\u642D\u8F7D\u9A81\u9F997s Gen2\u5904\u7406\u5668\uFF0C6.67\u82F1\u5BF8OLED\u5C4F\u5E55\uFF0C5100mAh\u5927\u7535\u6C60\uFF0C67W\u5FEB\u5145</p>",
    stock: 32,
    sales: 256,
    rating: 4.6,
    reviewCount: 128,
    status: "on_sale",
    tags: ["\u624B\u673A", "\u5C0F\u7C73", "5G"],
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-04-01T12:00:00Z"
  },
  {
    id: "prod003",
    name: "iPad \u7B2C10\u4EE3 64GB WiFi\u7248",
    categoryId: "cat1",
    price: 2799,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop"
    ],
    description: "Apple iPad \u7B2C10\u4EE3\uFF0C10.9\u82F1\u5BF8 Liquid Retina\u663E\u793A\u5C4F",
    detail: "<p>A14\u4EFF\u751F\u82AF\u7247\uFF0C\u652F\u6301Apple Pencil\uFF08\u7B2C\u4E00\u4EE3\uFF09\uFF0C\u5168\u5929\u5019\u7535\u6C60\u7EED\u822A</p>",
    stock: 8,
    sales: 89,
    rating: 4.9,
    reviewCount: 45,
    status: "on_sale",
    tags: ["\u5E73\u677F", "\u82F9\u679C", "\u5B66\u4E60\u795E\u5668"],
    createdAt: "2026-01-20T11:00:00Z",
    updatedAt: "2026-03-25T14:20:00Z"
  },
  {
    id: "prod004",
    name: "\u7F57\u6280 MX Master 3S \u65E0\u7EBF\u9F20\u6807",
    categoryId: "cat1",
    price: 599,
    originalPrice: 749,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop"
    ],
    description: "\u4E13\u4E1A\u7EA7\u65E0\u7EBF\u9F20\u6807\uFF0CMagSpeed\u7535\u78C1\u6EDA\u8F6E\uFF0C7000 DPI\u4F20\u611F\u5668",
    detail: "<p>\u9759\u97F3\u70B9\u51FB\uFF0C\u591A\u8BBE\u5907\u8FDE\u63A5\uFF0CUSB-C\u5FEB\u5145\uFF0C70\u5929\u8D85\u957F\u7EED\u822A</p>",
    stock: 45,
    sales: 167,
    rating: 4.7,
    reviewCount: 92,
    status: "on_sale",
    tags: ["\u9F20\u6807", "\u7F57\u6280", "\u529E\u516C\u5916\u8BBE"],
    createdAt: "2026-02-10T15:00:00Z",
    updatedAt: "2026-04-02T09:15:00Z"
  },
  {
    id: "prod005",
    name: "\u6F2B\u6B65\u8005 W820NB \u5934\u6234\u5F0F\u964D\u566A\u8033\u673A",
    categoryId: "cat1",
    price: 269,
    originalPrice: 349,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop"
    ],
    description: "\u4E3B\u52A8\u964D\u566A\u84DD\u7259\u8033\u673A\uFF0CHi-Res\u8BA4\u8BC1\u97F3\u8D28\uFF0C50\u5C0F\u65F6\u957F\u7EED\u822A",
    detail: "<p>\u652F\u6301LDAC\u9AD8\u6E05\u97F3\u9891\u4F20\u8F93\uFF0C\u8212\u9002\u4F69\u6234\u8BBE\u8BA1\uFF0C\u9002\u5408\u957F\u65F6\u95F4\u5B66\u4E60\u4F7F\u7528</p>",
    stock: 28,
    sales: 203,
    rating: 4.5,
    reviewCount: 78,
    status: "on_sale",
    tags: ["\u8033\u673A", "\u964D\u566A", "\u84DD\u7259"],
    createdAt: "2026-02-05T13:30:00Z",
    updatedAt: "2026-03-28T16:45:00Z"
  },
  // 图书文具类 (3个)
  {
    id: "prod006",
    name: "\u9AD8\u7B49\u6570\u5B66\uFF08\u7B2C\u4E03\u7248\uFF09\u540C\u6D4E\u5927\u5B66",
    categoryId: "cat2",
    price: 42,
    originalPrice: 49.8,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop"
    ],
    description: "\u7ECF\u5178\u9AD8\u6570\u6559\u6750\uFF0C\u7406\u5DE5\u79D1\u5B66\u751F\u5FC5\u5907",
    detail: "<p>\u9AD8\u7B49\u6559\u80B2\u51FA\u7248\u793E\u6743\u5A01\u51FA\u7248\uFF0C\u5185\u5BB9\u5168\u9762\u7CFB\u7EDF\uFF0C\u4F8B\u9898\u4E30\u5BCC\u8BE6\u5C3D</p>",
    stock: 120,
    sales: 567,
    rating: 4.9,
    reviewCount: 234,
    status: "on_sale",
    tags: ["\u6559\u6750", "\u6570\u5B66", "\u8003\u7814\u5FC5\u5907"],
    createdAt: "2026-01-01T08:00:00Z",
    updatedAt: "2026-04-05T10:00:00Z"
  },
  {
    id: "prod007",
    name: "\u4E09\u83F1 Uni-ball One \u4E2D\u6027\u7B14\u5957\u88C5\uFF0810\u652F\u88C5\uFF09",
    categoryId: "cat2",
    price: 35,
    originalPrice: 45,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&h=800&fit=crop"
    ],
    description: "\u65E5\u672C\u8FDB\u53E3\u4E2D\u6027\u7B14\uFF0C\u58A8\u6C34\u4E0D\u6D07\u7EB8\uFF0C\u4E66\u5199\u987A\u6ED1",
    detail: "<p>0.5mm\u5B50\u5F39\u5934\uFF0C\u9ED1\u8272\u58A8\u6C34\uFF0C\u9002\u5408\u8003\u8BD5\u548C\u65E5\u5E38\u7B14\u8BB0\u4F7F\u7528</p>",
    stock: 200,
    sales: 890,
    rating: 4.8,
    reviewCount: 356,
    status: "on_sale",
    tags: ["\u7B14", "\u6587\u5177", "\u8003\u8BD5\u7528\u7B14"],
    createdAt: "2026-01-10T09:30:00Z",
    updatedAt: "2026-04-03T11:20:00Z"
  },
  {
    id: "prod008",
    name: "\u56FD\u8A89 Kokuyo \u6D3B\u9875\u672C B5\uFF085\u672C\u88C5\uFF09",
    categoryId: "cat2",
    price: 58,
    originalPrice: 72,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=800&fit=crop"
    ],
    description: "\u65E5\u672C\u56FD\u8A89\u6D3B\u9875\u672C\uFF0C\u53EF\u6362\u82AF\u8BBE\u8BA1\uFF0C\u8010\u7528\u5B9E\u7528",
    detail: "<p>B5\u5C3A\u5BF8\uFF0C26\u5B54\u6D3B\u9875\u5939\uFF0C\u542B80\u5F20\u6A2A\u7EBF\u5185\u9875\uFF0C\u53EF\u81EA\u7531\u589E\u51CF\u7EB8\u5F20</p>",
    stock: 85,
    sales: 423,
    rating: 4.7,
    reviewCount: 178,
    status: "on_sale",
    tags: ["\u7B14\u8BB0\u672C", "\u6D3B\u9875\u672C", "\u56FD\u8A89"],
    createdAt: "2026-01-18T10:15:00Z",
    updatedAt: "2026-03-30T14:00:00Z"
  },
  // 生活日用工 (2个)
  {
    id: "prod009",
    name: "\u5357\u6781\u4EBA \u56DB\u4EF6\u5957\u5E8A\u4E0A\u7528\u54C1\uFF08\u88AB\u5957+\u5E8A\u5355+\u6795\u5957x2\uFF09",
    categoryId: "cat3",
    price: 168,
    originalPrice: 258,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop"
    ],
    description: "\u5BBF\u820D\u5FC5\u5907\u56DB\u4EF6\u5957\uFF0C\u7EAF\u68C9\u6750\u8D28\uFF0C\u4EB2\u80A4\u900F\u6C14",
    detail: "<p>\u9002\u75281.2m/1.5m\u5E8A\uFF0C\u5168\u68C9\u659C\u7EB9\u9762\u6599\uFF0C\u6D3B\u6027\u5370\u67D3\u4E0D\u6613\u892A\u8272</p>",
    stock: 36,
    sales: 289,
    rating: 4.6,
    reviewCount: 145,
    status: "on_sale",
    tags: ["\u5E8A\u54C1", "\u5BBF\u820D", "\u7EAF\u68C9"],
    createdAt: "2026-01-25T11:00:00Z",
    updatedAt: "2026-03-22T09:30:00Z"
  },
  {
    id: "prod010",
    name: "\u516C\u725B \u63D2\u6392 GN-B304U 4\u4F4DUSB\u63D2\u5EA7",
    categoryId: "cat3",
    price: 39,
    originalPrice: 59,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=800&fit=crop"
    ],
    description: "\u5B89\u5168\u63D2\u5EA7\uFF0C\u5E26USB\u5145\u7535\u53E3\uFF0C\u5BBF\u820D\u795E\u5668",
    detail: "<p>4\u4F4D\u63D2\u5B54+3USB\u63A5\u53E3\uFF0C1.8\u7C73\u7EBF\u957F\uFF0C\u8FC7\u8F7D\u4FDD\u62A4\uFF0C\u963B\u71C3\u6750\u6599</p>",
    stock: 150,
    sales: 678,
    rating: 4.8,
    reviewCount: 289,
    status: "on_sale",
    tags: ["\u63D2\u6392", "USB\u5145\u7535", "\u5BBF\u820D\u5FC5\u5907"],
    createdAt: "2026-01-08T08:30:00Z",
    updatedAt: "2026-04-04T15:00:00Z"
  },
  // 运动户外类 (2个)
  {
    id: "prod011",
    name: "\u674E\u5B81 \u7FBD\u6BDB\u7403\u62CD \u5355\u62CD\uFF08\u5DF2\u7A7F\u7EBF\uFF09",
    categoryId: "cat4",
    price: 129,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1622290291468-28e9ecdcade1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1622290291468-28e9ecdcade1?w=800&h=800&fit=crop"
    ],
    description: "\u5168\u78B3\u7D20\u7FBD\u6BDB\u7403\u62CD\uFF0C\u8F7B\u91CF\u5316\u8BBE\u8BA1\uFF0C\u653B\u5B88\u517C\u5907",
    detail: "<p>\u91CD\u91CF\u7EA685g\uFF0C\u5DF2\u7A7F24\u78C5\u7EBF\uFF0C\u9001\u62CD\u5957\u548C\u624B\u80F6\uFF0C\u9002\u5408\u521D\u5B66\u8005\u5230\u8FDB\u9636\u73A9\u5BB6</p>",
    stock: 42,
    sales: 156,
    rating: 4.5,
    reviewCount: 67,
    status: "on_sale",
    tags: ["\u7FBD\u6BDB\u7403", "\u8FD0\u52A8\u5668\u6750", "\u5065\u8EAB"],
    createdAt: "2026-02-08T14:00:00Z",
    updatedAt: "2026-03-27T10:30:00Z"
  },
  {
    id: "prod012",
    name: "\u8FEA\u5361\u4FAC \u53CC\u80A9\u80CC\u5305 20L \u8FD0\u52A8\u4F11\u95F2",
    categoryId: "cat4",
    price: 79,
    originalPrice: 99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop"
    ],
    description: "\u8F7B\u4FBF\u53CC\u80A9\u5305\uFF0C\u591A\u529F\u80FD\u9694\u5C42\uFF0C\u9632\u6C34\u9762\u6599",
    detail: "<p>20L\u5BB9\u91CF\uFF0C\u7535\u8111\u4ED3\u53EF\u653E14\u5BF8\u7B14\u8BB0\u672C\uFF0C\u53CD\u5149\u6761\u8BBE\u8BA1\uFF0C\u591C\u8DD1\u5B89\u5168</p>",
    stock: 68,
    sales: 234,
    rating: 4.4,
    reviewCount: 98,
    status: "on_sale",
    tags: ["\u80CC\u5305", "\u8FD0\u52A8", "\u901A\u52E4"],
    createdAt: "2026-02-12T09:45:00Z",
    updatedAt: "2026-03-29T16:00:00Z"
  },
  // 食品饮料类 (3个)
  {
    id: "prod013",
    name: "\u4E09\u53EA\u677E\u9F20 \u575A\u679C\u793C\u76D2 1kg\u88C5",
    categoryId: "cat5",
    price: 69,
    originalPrice: 99,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=800&fit=crop"
    ],
    description: "\u6DF7\u5408\u575A\u679C\u793C\u76D2\uFF0C\u6BCF\u65E5\u575A\u679C\u8425\u517B\u5747\u8861",
    detail: "<p>\u542B\u8170\u679C\u3001\u5DF4\u65E6\u6728\u3001\u6838\u6843\u3001\u699B\u5B50\u7B498\u79CD\u575A\u679C\uFF0C\u72EC\u7ACB\u5C0F\u5305\u88C5\uFF0C\u65B9\u4FBF\u643A\u5E26</p>",
    stock: 95,
    sales: 445,
    rating: 4.7,
    reviewCount: 198,
    status: "on_sale",
    tags: ["\u96F6\u98DF", "\u575A\u679C", "\u5065\u5EB7\u98DF\u54C1"],
    createdAt: "2026-01-22T10:00:00Z",
    updatedAt: "2026-04-01T08:45:00Z"
  },
  {
    id: "prod014",
    name: "\u5143\u6C14\u68EE\u6797 \u767D\u6843\u6C14\u6CE1\u6C34 480ml*15\u74F6\u6574\u7BB1",
    categoryId: "cat5",
    price: 52,
    originalPrice: 65,
    image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800&h=800&fit=crop"
    ],
    description: "0\u7CD60\u81020\u5361\u6C14\u6CE1\u6C34\uFF0C\u767D\u6843\u5473\u6E05\u723D\u89E3\u817B",
    detail: "<p>\u8D64\u85D3\u7CD6\u9187\u4EE3\u7CD6\uFF0C\u771F\u5B9E\u679C\u6C41\u6DFB\u52A0\uFF0C\u6C14\u6CE1\u53E3\u611F\uFF0C\u590F\u65E5\u5FC5\u5907\u996E\u54C1</p>",
    stock: 180,
    sales: 789,
    rating: 4.6,
    reviewCount: 345,
    status: "on_sale",
    tags: ["\u996E\u6599", "\u6C14\u6CE1\u6C34", "0\u7CD6"],
    createdAt: "2026-01-05T09:00:00Z",
    updatedAt: "2026-04-05T12:30:00Z"
  },
  {
    id: "prod015",
    name: "\u54C8\u5C14\u6EE8\u7EA2\u80A0 \u6B63\u5B97\u54C8\u8089\u8054 500g*2\u888B",
    categoryId: "cat5",
    price: 58,
    originalPrice: 78,
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=800&fit=crop"
    ],
    description: "\u9ED1\u9F99\u6C5F\u7279\u4EA7\u54C8\u5C14\u6EE8\u7EA2\u80A0\uFF0C\u6B63\u5B97\u4FC4\u5F0F\u98CE\u5473",
    detail: "<p>\u767E\u5E74\u8001\u5B57\u53F7\u54C8\u8089\u8054\u51FA\u54C1\uFF0C\u679C\u6728\u718F\u70E4\u5DE5\u827A\uFF0C\u80A5\u7626\u76F8\u95F4\uFF0C\u849C\u9999\u6D53\u90C1</p>",
    stock: 60,
    sales: 334,
    rating: 4.8,
    reviewCount: 167,
    status: "on_sale",
    tags: ["\u7279\u4EA7", "\u7EA2\u80A0", "\u4E1C\u5317\u7F8E\u98DF"],
    createdAt: "2026-01-28T11:30:00Z",
    updatedAt: "2026-03-31T14:15:00Z"
  }
];
var orders = [
  {
    id: "order001",
    orderNo: generateOrderNo(),
    userId: "user001",
    items: [
      { productId: "prod002", productName: "\u5C0F\u7C73 Redmi Note 13 Pro \u624B\u673A", productImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200", price: 1599, quantity: 1, subtotal: 1599 }
    ],
    totalAmount: 1648,
    discountAmount: 0,
    freightAmount: 49,
    payAmount: 1648,
    status: "completed",
    paymentMethod: "wechat",
    paymentTime: "2026-03-15T10:30:00Z",
    shipTime: "2026-03-15T14:00:00Z",
    deliverTime: "2026-03-17T10:00:00Z",
    completeTime: "2026-03-18T09:00:00Z",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "138****8888",
    receiverAddress: "\u9ED1\u9F99\u6C5F\u7701\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u7CD6\u5382\u88571\u53F7 \u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A6\u53F7\u697C301\u5BA4",
    remark: "\u8BF7\u5728\u5DE5\u4F5C\u65F6\u95F4\u914D\u9001",
    createdAt: "2026-03-15T10:25:00Z",
    updatedAt: "2026-03-18T09:00:00Z"
  },
  {
    id: "order002",
    orderNo: generateOrderNo(),
    userId: "user001",
    items: [
      { productId: "prod007", productName: "\u4E09\u83F1 Uni-ball One \u4E2D\u6027\u7B14\u5957\u88C5", productImage: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200", price: 35, quantity: 2, subtotal: 70 },
      { productId: "prod008", productName: "\u56FD\u8A89 Kokuyo \u6D3B\u9875\u672C B5", productImage: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200", price: 58, quantity: 3, subtotal: 174 }
    ],
    totalAmount: 244,
    discountAmount: 10,
    freightAmount: 0,
    payAmount: 234,
    status: "shipped",
    paymentMethod: "alipay",
    paymentTime: "2026-04-02T14:20:00Z",
    shipTime: "2026-04-03T09:00:00Z",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "138****8888",
    receiverAddress: "\u9ED1\u9F99\u6C5F\u7701\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u7CD6\u5382\u88571\u53F7 \u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A6\u53F7\u697C301\u5BA4",
    createdAt: "2026-04-02T14:15:00Z",
    updatedAt: "2026-04-03T09:00:00Z"
  },
  {
    id: "order003",
    orderNo: generateOrderNo(),
    userId: "user001",
    items: [
      { productId: "prod006", productName: "\u9AD8\u7B49\u6570\u5B66\uFF08\u7B2C\u4E03\u7248\uFF09\u540C\u6D4E\u5927\u5B66", productImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200", price: 42, quantity: 1, subtotal: 42 }
    ],
    totalAmount: 42,
    discountAmount: 0,
    freightAmount: 0,
    payAmount: 42,
    status: "paid",
    paymentMethod: "balance",
    paymentTime: "2026-04-05T16:45:00Z",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "138****8888",
    receiverAddress: "\u9ED1\u9F99\u6C5F\u7701\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u7CD6\u5382\u88571\u53F7 \u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 \u56FE\u4E66\u9986\u81EA\u63D0\u70B9",
    remark: "\u56FE\u4E66\u9986\u81EA\u63D0",
    createdAt: "2026-04-05T16:40:00Z",
    updatedAt: "2026-04-05T16:45:00Z"
  },
  {
    id: "order004",
    orderNo: generateOrderNo(),
    userId: "user001",
    items: [
      { productId: "prod013", productName: "\u4E09\u53EA\u677E\u9F20 \u575A\u679C\u793C\u76D2 1kg\u88C5", productImage: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200", price: 69, quantity: 2, subtotal: 138 },
      { productId: "prod014", productName: "\u5143\u6C14\u68EE\u6797 \u767D\u6843\u6C14\u6CE1\u6C34 \u6574\u7BB1", productImage: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=200", price: 52, quantity: 1, subtotal: 52 }
    ],
    totalAmount: 190,
    discountAmount: 15,
    freightAmount: 0,
    payAmount: 175,
    status: "pending",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "138****8888",
    receiverAddress: "\u9ED1\u9F99\u6C5F\u7701\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u7CD6\u5382\u88571\u53F7 \u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A6\u53F7\u697C301\u5BA4",
    createdAt: "2026-04-06T20:30:00Z",
    updatedAt: "2026-04-06T20:30:00Z"
  },
  {
    id: "order005",
    orderNo: generateOrderNo(),
    userId: "user001",
    items: [
      { productId: "prod001", productName: "\u534E\u4E3A MateBook D14 \u7B14\u8BB0\u672C\u7535\u8111", productImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200", price: 4299, quantity: 1, subtotal: 4299 }
    ],
    totalAmount: 4348,
    discountAmount: 200,
    freightAmount: 49,
    payAmount: 4197,
    status: "delivered",
    paymentMethod: "wechat",
    paymentTime: "2026-03-20T11:00:00Z",
    shipTime: "2026-03-20T15:00:00Z",
    deliverTime: "2026-03-22T11:30:00Z",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "138****8888",
    receiverAddress: "\u9ED1\u9F99\u6C5F\u7701\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u7CD6\u5382\u88571\u53F7 \u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A6\u53F7\u697C301\u5BA4",
    createdAt: "2026-03-20T10:50:00Z",
    updatedAt: "2026-03-22T11:30:00Z"
  },
  {
    id: "order006",
    orderNo: generateOrderNo(),
    userId: "user001",
    items: [
      { productId: "prod009", productName: "\u5357\u6781\u4EBA \u56DB\u4EF6\u5957\u5E8A\u4E0A\u7528\u54C1", productImage: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200", price: 168, quantity: 1, subtotal: 168 }
    ],
    totalAmount: 217,
    discountAmount: 0,
    freightAmount: 49,
    payAmount: 217,
    status: "cancelled",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "138****8888",
    receiverAddress: "\u9ED1\u9F99\u6C5F\u7701\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u7CD6\u5382\u88571\u53F7 \u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A6\u53F7\u697C301\u5BA4",
    remark: "\u4E0D\u9700\u8981\u4E86",
    createdAt: "2026-03-10T09:00:00Z",
    updatedAt: "2026-03-10T18:00:00Z"
  },
  {
    id: "order007",
    orderNo: generateOrderNo(),
    userId: "user001",
    items: [
      { productId: "prod004", productName: "\u7F57\u6280 MX Master 3S \u65E0\u7EBF\u9F20\u6807", productImage: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200", price: 599, quantity: 1, subtotal: 599 }
    ],
    totalAmount: 648,
    discountAmount: 50,
    freightAmount: 49,
    payAmount: 598,
    status: "refunding",
    paymentMethod: "alipay",
    paymentTime: "2026-04-01T15:00:00Z",
    shipTime: "2026-04-02T10:00:00Z",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "138****8888",
    receiverAddress: "\u9ED1\u9F99\u6C5F\u7701\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u7CD6\u5382\u88571\u53F7 \u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A6\u53F7\u697C301\u5BA4",
    remark: "\u9F20\u6807\u6EDA\u8F6E\u6709\u95EE\u9898\uFF0C\u7533\u8BF7\u9000\u8D27",
    createdAt: "2026-04-01T14:50:00Z",
    updatedAt: "2026-04-04T10:00:00Z"
  },
  {
    id: "order008",
    orderNo: generateOrderNo(),
    userId: "user001",
    items: [
      { productId: "prod011", productName: "\u674E\u5B81 \u7FBD\u6BDB\u7403\u62CD \u5355\u62CD", productImage: "https://images.unsplash.com/photo-1622290291468-28e9ecdcade1?w=200", price: 129, quantity: 2, subtotal: 258 },
      { productId: "prod012", productName: "\u8FEA\u5361\u4FAC \u53CC\u80A9\u80CC\u5305 20L", productImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200", price: 79, quantity: 1, subtotal: 79 }
    ],
    totalAmount: 337,
    discountAmount: 20,
    freightAmount: 0,
    payAmount: 317,
    status: "completed",
    paymentMethod: "wechat",
    paymentTime: "2026-03-25T13:00:00Z",
    shipTime: "2026-03-25T16:00:00Z",
    deliverTime: "2026-03-27T14:00:00Z",
    completeTime: "2026-03-28T10:00:00Z",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "138****8888",
    receiverAddress: "\u9ED1\u9F99\u6C5F\u7701\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u7CD6\u5382\u88571\u53F7 \u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A6\u53F7\u697C301\u5BA4",
    createdAt: "2026-03-25T12:50:00Z",
    updatedAt: "2026-03-28T10:00:00Z"
  },
  {
    id: "order009",
    orderNo: generateOrderNo(),
    userId: "user001",
    items: [
      { productId: "prod003", productName: "iPad \u7B2C10\u4EE3 64GB WiFi\u7248", productImage: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200", price: 2799, quantity: 1, subtotal: 2799 }
    ],
    totalAmount: 2848,
    discountAmount: 100,
    freightAmount: 49,
    payAmount: 2798,
    status: "shipped",
    paymentMethod: "alipay",
    paymentTime: "2026-04-04T09:30:00Z",
    shipTime: "2026-04-04T14:00:00Z",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "138****8888",
    receiverAddress: "\u9ED1\u9F99\u6C5F\u7701\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u7CD6\u5382\u88571\u53F7 \u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A6\u53F7\u697C301\u5BA4",
    createdAt: "2026-04-04T09:20:00Z",
    updatedAt: "2026-04-04T14:00:00Z"
  },
  {
    id: "order010",
    orderNo: generateOrderNo(),
    userId: "user001",
    items: [
      { productId: "prod005", productName: "\u6F2B\u6B65\u8005 W820NB \u5934\u6234\u5F0F\u964D\u566A\u8033\u673A", productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200", price: 269, quantity: 1, subtotal: 269 },
      { productId: "prod015", productName: "\u54C8\u5C14\u6EE8\u7EA2\u80A0 \u54C8\u8089\u8054 500g*2\u888B", productImage: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200", price: 58, quantity: 2, subtotal: 116 }
    ],
    totalAmount: 385,
    discountAmount: 0,
    freightAmount: 0,
    payAmount: 385,
    status: "paid",
    paymentMethod: "wechat",
    paymentTime: "2026-04-06T11:00:00Z",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "138****8888",
    receiverAddress: "\u9ED1\u9F99\u6C5F\u7701\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u7CD6\u5382\u88571\u53F7 \u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A6\u53F7\u697C301\u5BA4",
    createdAt: "2026-04-06T10:55:00Z",
    updatedAt: "2026-04-06T11:00:00Z"
  }
];
var cartItems = [
  {
    id: "cart001",
    productId: "prod014",
    product: {
      id: "prod014",
      name: "\u5143\u6C14\u68EE\u6797 \u767D\u6843\u6C14\u6CE1\u6C34 480ml*15\u74F6\u6574\u7BB1",
      image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=200",
      price: 52,
      originalPrice: 58,
      stock: 180,
      status: "active"
    },
    quantity: 2,
    selected: true,
    addedAt: "2026-04-05T15:00:00Z",
    updatedAt: "2026-04-05T15:00:00Z"
  },
  {
    id: "cart002",
    productId: "prod013",
    product: {
      id: "prod013",
      name: "\u4E09\u53EA\u677E\u9F20 \u575A\u679C\u793C\u76D2 1kg\u88C5",
      image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200",
      price: 69,
      originalPrice: 89,
      stock: 95,
      status: "active"
    },
    quantity: 1,
    selected: true,
    addedAt: "2026-04-05T15:05:00Z",
    updatedAt: "2026-04-05T15:05:00Z"
  },
  {
    id: "cart003",
    productId: "prod007",
    product: {
      id: "prod007",
      name: "\u4E09\u83F1 Uni-ball One \u4E2D\u6027\u7B14\u5957\u88C5\uFF0810\u652F\u88C5\uFF09",
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200",
      price: 35,
      originalPrice: 45,
      stock: 200,
      status: "active"
    },
    quantity: 3,
    selected: false,
    addedAt: "2026-04-04T20:00:00Z",
    updatedAt: "2026-04-04T20:00:00Z"
  },
  {
    id: "cart004",
    productId: "prod010",
    product: {
      id: "prod010",
      name: "\u516C\u725B \u63D2\u6392 GN-B304U 4\u4F4DUSB\u63D2\u5EA7",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200",
      price: 39,
      originalPrice: 49,
      stock: 150,
      status: "active"
    },
    quantity: 1,
    selected: true,
    addedAt: "2026-04-03T10:30:00Z",
    updatedAt: "2026-04-03T10:30:00Z"
  },
  {
    id: "cart005",
    productId: "prod015",
    product: {
      id: "prod015",
      name: "\u54C8\u5C14\u6EE8\u7EA2\u80A0 \u6B63\u5B97\u54C8\u8089\u8054 500g*2\u888B",
      image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200",
      price: 58,
      originalPrice: 68,
      stock: 60,
      status: "active"
    },
    quantity: 1,
    selected: false,
    addedAt: "2026-04-02T16:00:00Z",
    updatedAt: "2026-04-02T16:00:00Z"
  }
];
var currentUser = {
  id: "user001",
  username: "zhangsan2024",
  nickname: "\u5F20\u540C\u5B66",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  email: "zhangsan@usth.edu.cn",
  phone: "138****8888",
  gender: "male",
  birthday: "2003-05-15",
  studentId: "2022010001",
  college: "\u8BA1\u7B97\u673A\u4E0E\u4FE1\u606F\u5DE5\u7A0B\u5B66\u9662",
  major: "\u8F6F\u4EF6\u5DE5\u7A0B",
  grade: "2022\u7EA7",
  role: "user",
  status: "active",
  balance: 256.8,
  points: 3280,
  level: 3,
  createdAt: "2022-09-01T08:00:00Z",
  updatedAt: "2026-04-06T18:00:00Z"
};
var addresses = [
  {
    id: "addr001",
    userId: "user001",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "13812348888",
    province: "\u9ED1\u9F99\u6C5F\u7701",
    city: "\u54C8\u5C14\u6EE8\u5E02",
    district: "\u677E\u5317\u533A",
    detail: "\u7CD6\u5382\u88571\u53F7 \u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A6\u53F7\u697C301\u5BA4",
    fullAddress: "\u9ED1\u9F99\u6C5F\u7701\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u7CD6\u5382\u88571\u53F7 \u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A6\u53F7\u697C301\u5BA4",
    isDefault: true,
    tag: "\u5B66\u6821",
    createdAt: "2022-09-05T10:00:00Z"
  },
  {
    id: "addr002",
    userId: "user001",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "13812348888",
    province: "\u9ED1\u9F99\u6C5F\u7701",
    city: "\u9F50\u9F50\u54C8\u5C14\u5E02",
    district: "\u9F99\u6C99\u533A",
    detail: "\u6587\u5316\u5927\u88578\u53F7 \u5BB6\u5C5E\u96623\u5355\u5143502",
    fullAddress: "\u9ED1\u9F99\u6C5F\u7701\u9F50\u9F50\u54C8\u5C14\u5E02\u9F99\u6C99\u533A\u6587\u5316\u5927\u88578\u53F7 \u5BB6\u5C5E\u96623\u5355\u5143502",
    isDefault: false,
    tag: "\u5BB6",
    createdAt: "2022-09-05T10:05:00Z"
  },
  {
    id: "addr003",
    userId: "user001",
    receiverName: "\u5F20\u4E09",
    receiverPhone: "13812348888",
    province: "\u9ED1\u9F99\u6C5F\u7701",
    city: "\u54C8\u5C14\u6EE8\u5E02",
    district: "\u5357\u5C97\u533A",
    detail: "\u897F\u5927\u76F4\u885792\u53F7 \u54C8\u5DE5\u5927\u9644\u8FD1",
    fullAddress: "\u9ED1\u9F99\u6C5F\u7701\u54C8\u5C14\u6EE8\u5E02\u5357\u5C97\u533A\u897F\u5927\u76F4\u885792\u53F7 \u54C8\u5DE5\u5927\u9644\u8FD1",
    isDefault: false,
    tag: "\u516C\u53F8",
    createdAt: "2025-06-15T14:30:00Z"
  }
];
var merchants = [
  {
    id: "mer001",
    name: "\u79D1\u5927\u98DF\u5802\u4E00\u697C",
    logo: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=300&fit=crop",
    category: "\u98DF\u5802",
    rating: 4.7,
    reviewCount: 2345,
    monthlySales: 8900,
    deliveryTime: "15-25\u5206\u949F",
    deliveryFee: 0,
    minOrderAmount: 1,
    address: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66A\u533A\u98DF\u5802\u4E00\u697C",
    phone: "0451-88036001",
    openTime: "06:30",
    closeTime: "21:00",
    status: "open",
    tags: ["\u7ECF\u6D4E\u5B9E\u60E0", "\u91CF\u5927\u7BA1\u9971", "\u6821\u56ED\u9996\u9009"],
    announcement: "\u4ECA\u65E5\u65B0\u589E\u7EA2\u70E7\u6392\u9AA8\u5957\u9910\uFF01",
    latitude: 45.7965,
    longitude: 126.6508,
    distance: 0.2
  },
  {
    id: "mer002",
    name: "\u871C\u96EA\u51B0\u57CE\uFF08\u79D1\u5927\u5E97\uFF09",
    logo: "https://images.unsplash.com/photo-1558857563-b371033ba7c2?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1558857563-b371033ba7c2?w=600&h=300&fit=crop",
    category: "\u5976\u8336\u996E\u54C1",
    rating: 4.5,
    reviewCount: 1876,
    monthlySales: 12500,
    deliveryTime: "10-20\u5206\u949F",
    deliveryFee: 2,
    minOrderAmount: 10,
    address: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66B\u533A\u5546\u4E1A\u885712\u53F7",
    phone: "0451-88036123",
    openTime: "09:00",
    closeTime: "22:30",
    status: "open",
    tags: ["\u5E73\u4EF7\u5976\u8336", "\u51B0\u6DC7\u6DCB", "\u5B66\u751F\u6700\u7231"],
    announcement: "\u67E0\u6AAC\u6C34\u7B2C\u4E8C\u676F\u534A\u4EF7\uFF01",
    latitude: 45.7972,
    longitude: 126.6515,
    distance: 0.5
  },
  {
    id: "mer003",
    name: "\u745E\u5E78\u5496\u5561\uFF08\u79D1\u6280\u5927\u53A6\u5E97\uFF09",
    logo: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=300&fit=crop",
    category: "\u5496\u5561",
    rating: 4.6,
    reviewCount: 987,
    monthlySales: 5600,
    deliveryTime: "15-25\u5206\u949F",
    deliveryFee: 3,
    minOrderAmount: 20,
    address: "\u79D1\u6280\u5927\u53A6\u4E00\u5C42\u5927\u5385",
    phone: "0451-88036567",
    openTime: "07:30",
    closeTime: "21:00",
    status: "open",
    tags: ["\u7CBE\u54C1\u5496\u5561", "\u751F\u6930\u62FF\u94C1", "\u63D0\u795E\u9192\u8111"],
    announcement: "\u65B0\u54C1\u4E0A\u5E02\uFF1A\u6A31\u82B1\u8393\u8393\u80F6\u539F\u9178\u5976\u51BB",
    latitude: 45.7958,
    longitude: 126.6495,
    distance: 0.8
  },
  {
    id: "mer004",
    name: "\u6768\u56FD\u798F\u9EBB\u8FA3\u70EB\uFF08\u79D1\u5927\u5E97\uFF09",
    logo: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=300&fit=crop",
    category: "\u9EBB\u8FA3\u70EB",
    rating: 4.4,
    reviewCount: 1567,
    monthlySales: 7200,
    deliveryTime: "20-30\u5206\u949F",
    deliveryFee: 2,
    minOrderAmount: 15,
    address: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66C\u533A\u7F8E\u98DF\u5E7F\u573A3\u53F7",
    phone: "0451-88036234",
    openTime: "10:00",
    closeTime: "22:00",
    status: "open",
    tags: ["\u9EBB\u8FA3\u70EB", "\u81EA\u9009\u83DC\u54C1", "\u53E3\u5473\u6B63\u5B97"],
    announcement: "\u65B0\u7528\u6237\u9996\u5355\u7ACB\u51CF5\u5143",
    latitude: 45.798,
    longitude: 126.652,
    distance: 0.6
  },
  {
    id: "mer005",
    name: "\u9EC4\u7116\u9E21\u7C73\u996D\uFF08\u5B66\u5E9C\u5E97\uFF09",
    logo: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=300&fit=crop",
    category: "\u5FEB\u9910\u7B80\u9910",
    rating: 4.3,
    reviewCount: 1123,
    monthlySales: 4500,
    deliveryTime: "20-30\u5206\u949F",
    deliveryFee: 2,
    minOrderAmount: 12,
    address: "\u5B66\u5E9C\u8DEF\u8F85\u885788\u53F7",
    phone: "0451-88036456",
    openTime: "10:00",
    closeTime: "21:30",
    status: "open",
    tags: ["\u9EC4\u7116\u9E21", "\u4E0B\u996D\u795E\u5668", "\u5206\u91CF\u8DB3"],
    announcement: "",
    latitude: 45.799,
    longitude: 126.653,
    distance: 1.2
  },
  {
    id: "mer006",
    name: "\u6B63\u65B0\u9E21\u6392\uFF08\u79D1\u5927\u5C0F\u5403\u8857\uFF09",
    logo: "https://images.unsplash.com/photo-1626082927389-8cd23f0cfd85?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1626082927389-8cd23f0cfd85?w=600&h=300&fit=crop",
    category: "\u70B8\u9E21\u5C0F\u5403",
    rating: 4.2,
    reviewCount: 890,
    monthlySales: 3800,
    deliveryTime: "15-25\u5206\u949F",
    deliveryFee: 2,
    minOrderAmount: 10,
    address: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66\u4E1C\u95E8\u5C0F\u5403\u885715\u53F7",
    phone: "0451-88036789",
    openTime: "09:30",
    closeTime: "22:00",
    status: "open",
    tags: ["\u9E21\u6392", "\u5C0F\u5403", "\u8FFD\u5267\u5FC5\u5907"],
    announcement: "\u65B0\u54C1\uFF1A\u829D\u58EB\u7206\u6D46\u9E21\u6392\u4E0A\u5E02",
    latitude: 45.7975,
    longitude: 126.6525,
    distance: 0.7
  },
  {
    id: "mer007",
    name: "\u5F20\u4EAE\u9EBB\u8FA3\u62CC\uFF08\u677E\u5317\u5E97\uFF09",
    logo: "https://images.unsplash.com/photo-1582169296194-e4d5444eab9d?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1582169296194-e4d5444eab9d?w=600&h=300&fit=crop",
    category: "\u9EBB\u8FA3\u62CC",
    rating: 4.4,
    reviewCount: 756,
    monthlySales: 3100,
    deliveryTime: "20-30\u5206\u949F",
    deliveryFee: 2,
    minOrderAmount: 15,
    address: "\u677E\u5317\u5927\u9053188\u53F7",
    phone: "0451-88036890",
    openTime: "10:30",
    closeTime: "21:00",
    status: "open",
    tags: ["\u9EBB\u8FA3\u62CC", "\u4E1C\u5317\u7279\u8272", "\u9178\u751C\u8FA3"],
    announcement: "",
    latitude: 45.8,
    longitude: 126.654,
    distance: 1.5
  },
  {
    id: "mer008",
    name: "\u6C99\u53BF\u5C0F\u5403\uFF08\u79D1\u6280\u8DEF\u5E97\uFF09",
    logo: "https://images.unsplash.com/photo-1569058242-647d39ae98b7?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1569058242-647d39ae98b7?w=600&h=300&fit=crop",
    category: "\u4E2D\u5F0F\u5FEB\u9910",
    rating: 4.1,
    reviewCount: 654,
    monthlySales: 2800,
    deliveryTime: "15-25\u5206\u949F",
    deliveryFee: 1,
    minOrderAmount: 8,
    address: "\u79D1\u6280\u8DEF56\u53F7",
    phone: "0451-88036123",
    openTime: "07:00",
    closeTime: "22:00",
    status: "open",
    tags: ["\u84B8\u997A", "\u62CC\u9762", "\u7096\u7F50", "\u5B9E\u60E0"],
    announcement: "\u65E9\u9910\u65F6\u6BB5\u4F9B\u5E94\u5305\u5B50\u8C46\u6D46",
    latitude: 45.796,
    longitude: 126.65,
    distance: 0.4
  }
];
var dishesTemplate = {
  mer001: [
    // 科大食堂
    { id: "dish001", merchantId: "mer001", name: "\u7EA2\u70E7\u6392\u9AA8\u996D", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", price: 15, originalPrice: 18, description: "\u7CBE\u9009\u732A\u808B\u6392\uFF0C\u79D8\u5236\u9171\u6599\u6162\u7096\uFF0C\u914D\u7C73\u996D\u548C\u5C0F\u83DC", category: "\u76D6\u6D47\u996D", sales: 890, rating: 4.8, status: "available", tags: ["\u62DB\u724C", "\u8364\u83DC"] },
    { id: "dish002", merchantId: "mer001", name: "\u5BAB\u4FDD\u9E21\u4E01\u996D", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", price: 12, description: "\u9C9C\u5AE9\u9E21\u8089\u4E01\u914D\u82B1\u751F\u7C73\uFF0C\u5FAE\u8FA3\u723D\u53E3", category: "\u76D6\u6D47\u996D", sales: 756, rating: 4.6, status: "available", tags: ["\u7ECF\u5178", "\u5FAE\u8FA3"] },
    { id: "dish003", merchantId: "mer001", name: "\u9EBB\u5A46\u8C46\u8150\u996D", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400", price: 10, description: "\u5AE9\u6ED1\u8C46\u8150\u914D\u732A\u8089\u672B\uFF0C\u9EBB\u8FA3\u9C9C\u9999", category: "\u76D6\u6D47\u996D", sales: 623, rating: 4.5, status: "available", tags: ["\u7D20\u98DF\u53EF\u9009", "\u4E0B\u996D"] },
    { id: "dish004", merchantId: "mer001", name: "\u897F\u7EA2\u67FF\u9E21\u86CB\u9762", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400", price: 8, description: "\u624B\u5DE5\u62C9\u9762\u914D\u65B0\u9C9C\u756A\u8304\u7092\u86CB\uFF0C\u6C64\u9C9C\u5473\u7F8E", category: "\u9762\u98DF", sales: 534, rating: 4.4, status: "available", tags: ["\u9762\u98DF", "\u6E05\u6DE1"] },
    { id: "dish005", merchantId: "mer001", name: "\u9E21\u817F\u5957\u9910", image: "https://images.unsplash.com/photo-1626082927389-8cd23f0cfd85?w=400", price: 16, originalPrice: 20, description: "\u5927\u9E21\u817F\u914D\u65F6\u852C\u3001\u7C73\u996D\u3001\u7D2B\u83DC\u86CB\u82B1\u6C64", category: "\u5957\u9910", sales: 445, rating: 4.7, status: "available", tags: ["\u8089\u98DF\u8005", "\u8D85\u503C"] },
    { id: "dish006", merchantId: "mer001", name: "\u9178\u8FA3\u571F\u8C46\u4E1D", image: "https://images.unsplash.com/photo-1569058242-647d39ae98b7?w=400", price: 6, description: "\u8106\u5AE9\u571F\u8C46\u4E1D\uFF0C\u9178\u8FA3\u5F00\u80C3", category: "\u5C0F\u7092", sales: 345, rating: 4.3, status: "available", tags: ["\u7D20\u83DC", "\u5F00\u80C3"] }
  ],
  mer002: [
    // 蜜雪冰城
    { id: "dish007", merchantId: "mer002", name: "\u51B0\u9C9C\u67E0\u6AAC\u6C34", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400", price: 4, description: "\u65B0\u9C9C\u67E0\u6AAC+\u7EFF\u8336\uFF0C\u6E05\u723D\u89E3\u817B", category: "\u996E\u54C1", sales: 5678, rating: 4.7, status: "available", tags: ["\u7206\u6B3E", "\u5FC5\u70B9"] },
    { id: "dish008", merchantId: "mer002", name: "\u73CD\u73E0\u5976\u8336", image: "https://images.unsplash.com/photo-1558857563-b371033ba7c2?w=400", price: 7, description: "\u9187\u9999\u7EA2\u8336+Q\u5F39\u73CD\u73E0\uFF0C\u751C\u871C\u987A\u6ED1", category: "\u5976\u8336", sales: 3456, rating: 4.6, status: "available", tags: ["\u7ECF\u5178", "\u751C"] },
    { id: "dish009", merchantId: "mer002", name: "\u8349\u8393\u5723\u4EE3", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", price: 6, description: "\u9999\u8349\u51B0\u6DC7\u6DCB\u914D\u8349\u8393\u679C\u9171+\u8106\u76AE", category: "\u51B0\u6DC7\u6DCB", sales: 2345, rating: 4.5, status: "available", tags: ["\u751C\u54C1", "\u51B0\u51C9"] },
    { id: "dish010", merchantId: "mer002", name: "\u6EE1\u676F\u767E\u9999\u679C", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", price: 10, description: "\u767E\u9999\u679C\u539F\u6C41+\u7EFF\u8336\uFF0C\u7EF4C\u6EE1\u6EE1", category: "\u996E\u54C1", sales: 1890, rating: 4.4, status: "available", tags: ["\u6C34\u679C\u8336", "\u9178\u723D"] }
  ],
  mer003: [
    // 瑞幸咖啡
    { id: "dish011", merchantId: "mer003", name: "\u751F\u6930\u62FF\u94C1", image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400", price: 18, description: "\u539A\u6930\u4E73+\u6D53\u7F29\u5496\u5561\uFF0C\u4E1D\u6ED1\u9999\u9187", category: "\u5496\u5561", sales: 2345, rating: 4.8, status: "available", tags: ["\u62DB\u724C", "\u7206\u6B3E"] },
    { id: "dish012", merchantId: "mer003", name: "\u7F8E\u5F0F\u5496\u5561", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400", price: 15, description: "\u7ECF\u5178\u7F8E\u5F0F\uFF0C\u6D53\u90C1\u9187\u82E6\uFF0C\u63D0\u795E\u9192\u8111", category: "\u5496\u5561", sales: 1567, rating: 4.5, status: "available", tags: ["\u7ECF\u5178", "\u65E0\u5976"] },
    { id: "dish013", merchantId: "mer003", name: "\u6A31\u82B1\u8393\u8393\u80F6\u539F\u9178\u5976\u51BB", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", price: 22, description: "\u5B63\u8282\u9650\u5B9A\uFF0C\u6A31\u82B1\u98CE\u5473+\u8349\u8393+\u80F6\u539F\u86CB\u767D", category: "\u7279\u8C03", sales: 890, rating: 4.6, status: "available", tags: ["\u65B0\u54C1", "\u9650\u5B9A"] }
  ]
};
var secondHandCategories = [
  { id: "shcat1", name: "\u624B\u673A\u6570\u7801", icon: "smartphone", count: 45 },
  { id: "shcat2", name: "\u7535\u8111\u529E\u516C", icon: "laptop", count: 32 },
  { id: "shcat3", name: "\u56FE\u4E66\u6559\u6750", icon: "book", count: 128 },
  { id: "shcat4", name: "\u751F\u6D3B\u5BB6\u7535", icon: "home", count: 28 },
  { id: "shcat5", name: "\u8FD0\u52A8\u5668\u6750", icon: "basketball", count: 19 },
  { id: "shcat6", name: "\u670D\u9970\u978B\u5305", icon: "tshirt", count: 56 },
  { id: "shcat7", name: "\u7F8E\u5986\u62A4\u80A4", icon: "cosmetics", count: 23 },
  { id: "shcat8", name: "\u5176\u4ED6\u95F2\u7F6E", icon: "box", count: 41 }
];
var secondHandItems = [
  {
    id: "item001",
    sellerId: "seller001",
    sellerName: "\u674E\u5B66\u957F",
    sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    title: "\u51FAiPhone 14 Pro Max 256G \u6DF1\u7A7A\u9ED1",
    description: "\u53BB\u5E74\u8D2D\u5165\uFF0C\u4E00\u76F4\u6234\u58F3\u8D34\u819C\u4F7F\u7528\uFF0C\u6210\u827299\u65B0\u3002\u7535\u6C60\u5065\u5EB7\u5EA695%\uFF0C\u65E0\u4EFB\u4F55\u7EF4\u4FEE\u8BB0\u5F55\u3002\u914D\u4EF6\u9F50\u5168\uFF1A\u539F\u88C5\u5145\u7535\u5668+\u6570\u636E\u7EBF+\u8033\u673A+\u76D2\u5B50\u3002\u56E0\u6362\u65B0\u673A\u6240\u4EE5\u51FA\uFF0C\u4EF7\u683C\u53EF\u5C0F\u5200\u3002",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&h=600&fit=crop"
    ],
    categoryId: "shcat1",
    categoryName: "\u624B\u673A\u6570\u7801",
    originalPrice: 9999,
    currentPrice: 5500,
    condition: "almost_new",
    conditionText: "\u51E0\u4E4E\u5168\u65B0",
    negotiable: true,
    location: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A",
    viewCount: 234,
    likeCount: 45,
    chatCount: 28,
    status: "on_sale",
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-04-05T14:30:00Z"
  },
  {
    id: "item002",
    sellerId: "seller002",
    sellerName: "\u738B\u5B66\u59D0",
    sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    title: "\u51FA\u9AD8\u6570\u540C\u6D4E\u4E03\u7248+\u4E60\u9898\u96C6 \u5168\u5957",
    description: "\u8003\u7814\u4E0A\u5CB8\u51FA\u4E66\uFF0C\u9AD8\u6570\u4E0A\u4E0B\u518C+\u7EBF\u6027\u4EE3\u6570+\u6982\u7387\u8BBA\uFF0C\u5168\u90E8\u662F\u6B63\u7248\uFF0C\u6709\u5C11\u91CF\u7B14\u8BB0\u4F46\u4E0D\u5F71\u54CD\u9605\u8BFB\u3002\u8FD8\u9001\u5386\u5E74\u771F\u9898\u5377\u5B50\u3002",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop"
    ],
    categoryId: "shcat3",
    categoryName: "\u56FE\u4E66\u6559\u6750",
    originalPrice: 120,
    currentPrice: 45,
    condition: "lightly_used",
    conditionText: "\u8F7B\u5FAE\u4F7F\u7528\u75D5\u8FF9",
    negotiable: false,
    location: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 \u56FE\u4E66\u9986",
    viewCount: 189,
    likeCount: 67,
    chatCount: 34,
    status: "on_sale",
    createdAt: "2026-03-28T15:00:00Z",
    updatedAt: "2026-04-04T09:00:00Z"
  },
  {
    id: "item003",
    sellerId: "seller003",
    sellerName: "\u8D75\u540C\u5B66",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    title: "\u51FA\u81EA\u884C\u8F66 \u5C71\u5730\u8F66 26\u5BF8 \u4E5D\u6210\u65B0",
    description: "\u5927\u4E8C\u4E70\u7684\u5C71\u5730\u8F66\uFF0C\u9A91\u4E86\u4E0D\u5230\u4E00\u5E74\uFF0C\u56E0\u4E3A\u8981\u5B9E\u4E60\u4E86\u6CA1\u5730\u65B9\u653E\u6240\u4EE5\u51FA\u4E86\u3002\u53D8\u901F\u6B63\u5E38\uFF0C\u5239\u8F66\u7075\u654F\uFF0C\u8F6E\u80CE\u8FD8\u6709\u516B\u6210\u65B0\u3002\u9001\u8F66\u9501\u548C\u6253\u6C14\u7B52\u3002",
    images: [
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=600&fit=crop"
    ],
    categoryId: "shcat5",
    categoryName: "\u8FD0\u52A8\u5668\u6750",
    originalPrice: 800,
    currentPrice: 350,
    condition: "lightly_used",
    conditionText: "\u8F7B\u5FAE\u4F7F\u7528\u75D5\u8FF9",
    negotiable: true,
    location: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 \u8F66\u68DA",
    viewCount: 156,
    likeCount: 23,
    chatCount: 15,
    status: "on_sale",
    createdAt: "2026-03-25T09:00:00Z",
    updatedAt: "2026-04-02T16:00:00Z"
  },
  {
    id: "item004",
    sellerId: "seller004",
    sellerName: "\u9648\u5B66\u957F",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    title: "\u51FA\u8054\u60F3\u62EF\u6551\u8005Y7000P \u6E38\u620F\u672C",
    description: "2023\u6B3E i7-13620H RTX4060 16G\u5185\u5B58 512G\u56FA\u6001\u3002\u73A93A\u5927\u4F5C\u65E0\u538B\u529B\uFF0C\u5403\u9E21\u7A33\u5B9A144\u5E27\u3002\u5916\u89C2\u6709\u8F7B\u5FAE\u4F7F\u7528\u75D5\u8FF9\uFF0C\u6027\u80FD\u5B8C\u7F8E\u8FD0\u884C\u3002\u9001\u539F\u88C5\u7535\u6E90+\u9F20\u6807\u57AB\u3002",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop"
    ],
    categoryId: "shcat2",
    categoryName: "\u7535\u8111\u529E\u516C",
    originalPrice: 8500,
    currentPrice: 5200,
    condition: "lightly_used",
    conditionText: "\u8F7B\u5FAE\u4F7F\u7528\u75D5\u8FF9",
    negotiable: true,
    location: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A",
    viewCount: 345,
    likeCount: 78,
    chatCount: 56,
    status: "on_sale",
    createdAt: "2026-03-20T11:00:00Z",
    updatedAt: "2026-04-06T10:00:00Z"
  },
  {
    id: "item005",
    sellerId: "seller005",
    sellerName: "\u5218\u5B66\u59D0",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    title: "\u51FA\u5C0F\u51B0\u7BB1 93L \u5BBF\u820D\u53EF\u7528",
    description: "\u642C\u5BB6\u5E26\u4E0D\u8D70\uFF0C\u4F4E\u4EF7\u51FA\u3002\u5236\u51B7\u6548\u679C\u597D\uFF0C\u566A\u97F3\u5C0F\uFF0C\u5BBF\u820D\u7528\u521A\u597D\u3002\u4E70\u6765\u624D\u7528\u4E86\u534A\u5E74\uFF0C\u4E5D\u4E94\u6210\u65B0\u3002",
    images: [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=600&fit=crop"
    ],
    categoryId: "shcat4",
    categoryName: "\u751F\u6D3B\u5BB6\u7535",
    originalPrice: 599,
    currentPrice: 280,
    condition: "almost_new",
    conditionText: "\u51E0\u4E4E\u5168\u65B0",
    negotiable: true,
    location: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 C\u533A\u5973\u751F\u5BBF\u820D",
    viewCount: 98,
    likeCount: 34,
    chatCount: 19,
    status: "on_sale",
    createdAt: "2026-03-18T14:00:00Z",
    updatedAt: "2026-04-01T11:30:00Z"
  },
  {
    id: "item006",
    sellerId: "seller006",
    sellerName: "\u5B59\u540C\u5B66",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    title: "\u51FAAirPods Pro 2\u4EE3 \u56FD\u884C\u6B63\u54C1",
    description: "\u4ECA\u5E74\u5E74\u521D\u8D2D\u5165\uFF0C\u53D1\u7968\u9F50\u5168\u3002\u964D\u566A\u6548\u679C\u5F88\u597D\uFF0C\u7A7A\u95F4\u97F3\u9891\u4F53\u9A8C\u5F88\u68D2\u3002\u56E0\u6362\u4E86\u7D22\u5C3C\u5934\u6234\u5F0F\u6240\u4EE5\u51FA\uFF0C\u914D\u4EF6\u5168\u3002",
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop"
    ],
    categoryId: "shcat1",
    categoryName: "\u624B\u673A\u6570\u7801",
    originalPrice: 1899,
    currentPrice: 1200,
    condition: "almost_new",
    conditionText: "\u51E0\u4E4E\u5168\u65B0",
    negotiable: false,
    location: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 B\u533A",
    viewCount: 267,
    likeCount: 56,
    chatCount: 42,
    status: "on_sale",
    createdAt: "2026-03-15T16:00:00Z",
    updatedAt: "2026-04-03T15:00:00Z"
  },
  {
    id: "item007",
    sellerId: "seller007",
    sellerName: "\u5468\u5B66\u957F",
    sellerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    title: "\u51FA\u8003\u7814\u5168\u5957\u8D44\u6599 \u8BA1\u7B97\u673A408",
    description: "\u5DF2\u62DF\u5F55\u53D6\uFF0C\u51FA\u5168\u5957408\u8D44\u6599\uFF1A\u738B\u9053\u56DB\u672C\u4E66+\u914D\u5957\u89C6\u9891+\u771F\u9898+\u7B14\u8BB0\u3002\u5168\u662F\u7CBE\u534E\u6574\u7406\uFF0C\u7701\u53BB\u81EA\u5DF1\u6574\u7406\u7684\u65F6\u95F4\u3002",
    images: [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop"
    ],
    categoryId: "shcat3",
    categoryName: "\u56FE\u4E66\u6559\u6750",
    originalPrice: 300,
    currentPrice: 120,
    condition: "moderately_used",
    conditionText: "\u4E2D\u7B49\u4F7F\u7528\u7A0B\u5EA6",
    negotiable: false,
    location: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 \u56FE\u4E66\u9986\u81EA\u4E60\u5BA4",
    viewCount: 423,
    likeCount: 134,
    chatCount: 89,
    status: "on_sale",
    createdAt: "2026-03-10T09:00:00Z",
    updatedAt: "2026-04-05T18:00:00Z"
  },
  {
    id: "item008",
    sellerId: "seller008",
    sellerName: "\u5434\u540C\u5B66",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    title: "\u51FA\u745C\u4F3D\u57AB \u52A0\u539A\u9632\u6ED1 \u9001\u6536\u7EB3\u888B",
    description: "\u4E70\u4E86\u6CA1\u7EC3\u51E0\u6B21\uFF0C\u57FA\u672C\u5168\u65B0\u3002\u52A0\u539A10mm\uFF0C\u9632\u6ED1\u6548\u679C\u597D\uFF0C\u989C\u8272\u7C89\u7D2B\u8272\u5F88\u597D\u770B\u3002\u9001\u745C\u4F3D\u7816\u548C\u5F39\u529B\u5E26\u3002",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop"
    ],
    categoryId: "shcat5",
    categoryName: "\u8FD0\u52A8\u5668\u6750",
    originalPrice: 89,
    currentPrice: 35,
    condition: "brand_new",
    conditionText: "\u5168\u65B0",
    negotiable: true,
    location: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 \u4F53\u80B2\u9986",
    viewCount: 87,
    likeCount: 23,
    chatCount: 12,
    status: "on_sale",
    createdAt: "2026-03-08T13:00:00Z",
    updatedAt: "2026-03-30T10:00:00Z"
  },
  {
    id: "item009",
    sellerId: "seller009",
    sellerName: "\u90D1\u5B66\u59D0",
    sellerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    title: "\u51FA\u5316\u5986\u54C1\u5957\u88C5 \u5170\u853B\u96C5\u8BD7\u5170\u9EDB\u7B49",
    description: "\u6536\u62FE\u4E1C\u897F\u53D1\u73B0\u597D\u591A\u53EA\u7528\u4E86\u4E00\u70B9\u7684\u62A4\u80A4\u54C1\u548C\u5316\u5986\u54C1\uFF0C\u90FD\u662F\u6B63\u54C1\u4E13\u67DC\u8D2D\u5165\u3002\u5170\u853B\u7C89\u5E95\u6DB2\u7528\u4E861/3\uFF0C\u96C5\u8BD7\u5170\u9EDB\u5C0F\u6837\u5168\u65B0\uFF0C\u8FD8\u6709\u51E0\u4E2A\u53E3\u7EA2\u8BD5\u8272\u4E00\u4E24\u6B21\u3002",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop"
    ],
    categoryId: "shcat7",
    categoryName: "\u7F8E\u5986\u62A4\u80A4",
    originalPrice: 2500,
    currentPrice: 680,
    condition: "lightly_used",
    conditionText: "\u8F7B\u5FAE\u4F7F\u7528\u75D5\u8FF9",
    negotiable: true,
    location: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 C\u533A\u5973\u751F\u5BBF\u820D",
    viewCount: 234,
    likeCount: 89,
    chatCount: 67,
    status: "on_sale",
    createdAt: "2026-03-05T10:00:00Z",
    updatedAt: "2026-04-04T14:00:00Z"
  },
  {
    id: "item010",
    sellerId: "seller010",
    sellerName: "\u9EC4\u5B66\u957F",
    sellerAvatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop",
    title: "\u51FA\u6295\u5F71\u4EEA \u6781\u7C73Z6X \u5BB6\u5EAD\u5F71\u9662",
    description: "\u5728\u5BBF\u820D\u770B\u5267\u592A\u723D\u4E86\uFF0C\u4F46\u662F\u8981\u6BD5\u4E1A\u4E86\u5E26\u4E0D\u8D70\u30021080P\u5206\u8FA8\u7387\uFF0C\u81EA\u52A8\u5BF9\u7126\u68AF\u5F62\u6821\u6B63\uFF0C\u5185\u7F6E\u97F3\u54CD\u6548\u679C\u4E0D\u9519\u3002\u914D\u4EF6\u5168\u3002",
    images: [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&h=600&fit=crop"
    ],
    categoryId: "shcat4",
    categoryName: "\u751F\u6D3B\u5BB6\u7535",
    originalPrice: 3599,
    currentPrice: 1800,
    condition: "lightly_used",
    conditionText: "\u8F7B\u5FAE\u4F7F\u7528\u75D5\u8FF9",
    negotiable: true,
    location: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A\u7537\u751F\u5BBF\u820D",
    viewCount: 178,
    likeCount: 45,
    chatCount: 32,
    status: "on_sale",
    createdAt: "2026-03-02T15:00:00Z",
    updatedAt: "2026-04-02T09:30:00Z"
  },
  {
    id: "item011",
    sellerId: "seller011",
    sellerName: "\u6797\u540C\u5B66",
    sellerAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    title: "\u51FA\u7FBD\u7ED2\u670D \u6CE2\u53F8\u767B\u4E2D\u957F\u6B3E S\u7801",
    description: "\u4E70\u5927\u4E86\u7A7F\u4E0D\u4E86\uFF0C\u540A\u724C\u8FD8\u5728\u3002\u6CE2\u53F8\u767B\u5B98\u65B9\u65D7\u8230\u5E97\u8D2D\u5165\uFF0C\u5145\u7ED2\u91CF\u5F88\u9AD8\uFF0C\u96F6\u4E0B\u4E8C\u5341\u5EA6\u5B8C\u5168\u6CA1\u95EE\u9898\u3002\u9ED1\u8272\u4E2D\u957F\u6B3E\uFF0C\u663E\u7626\u53C8\u4FDD\u6696\u3002",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=600&fit=crop"
    ],
    categoryId: "shcat6",
    categoryName: "\u670D\u9970\u978B\u5305",
    originalPrice: 1299,
    currentPrice: 600,
    condition: "brand_new",
    conditionText: "\u5168\u65B0",
    negotiable: true,
    location: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 B\u533A",
    viewCount: 145,
    likeCount: 38,
    chatCount: 25,
    status: "on_sale",
    createdAt: "2026-02-28T11:00:00Z",
    updatedAt: "2026-04-01T16:00:00Z"
  },
  {
    id: "item012",
    sellerId: "seller012",
    sellerName: "\u9A6C\u5B66\u957F",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    title: "\u51FASwitch\u6E38\u620F\u673A \u65E5\u7248 OLED \u7EED\u822A\u589E\u5F3A",
    description: "\u5E26\u585E\u5C14\u8FBE\u4F20\u8BF4\u65F7\u91CE\u4E4B\u606F+\u9A6C\u91CC\u5965\u8D5B\u8F668+\u52A8\u7269\u68EE\u53CB\u4F1A\u4E09\u4E2A\u6E38\u620F\u5361\u5E26\uFF0C\u8FD8\u6709Pro\u624B\u67C4\u3002\u673A\u5668\u6210\u8272\u5F88\u597D\uFF0C\u65E0\u4EFB\u4F55\u95EE\u9898\u3002",
    images: [
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&h=600&fit=crop"
    ],
    categoryId: "shcat1",
    categoryName: "\u624B\u673A\u6570\u7801",
    originalPrice: 3200,
    currentPrice: 2100,
    condition: "lightly_used",
    conditionText: "\u8F7B\u5FAE\u4F7F\u7528\u75D5\u8FF9",
    negotiable: false,
    location: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66 A\u533A",
    viewCount: 312,
    likeCount: 98,
    chatCount: 73,
    status: "on_sale",
    createdAt: "2026-02-25T14:00:00Z",
    updatedAt: "2026-04-06T08:00:00Z"
  }
];
var forumBoards = [
  { id: "board1", name: "\u6821\u56ED\u751F\u6D3B", description: "\u5206\u4EAB\u6821\u56ED\u65E5\u5E38\u3001\u751F\u6D3B\u7ECF\u9A8C", icon: "school", postCount: 3456, todayPostCount: 23, sortOrder: 1 },
  { id: "board2", name: "\u5B66\u672F\u4EA4\u6D41", description: "\u8BFE\u7A0B\u8BA8\u8BBA\u3001\u5B66\u4E60\u8D44\u6E90\u5206\u4EAB", icon: "book-open", postCount: 2134, todayPostCount: 15, sortOrder: 2 },
  { id: "board3", name: "\u6C42\u804C\u62DB\u8058", description: "\u5B9E\u4E60\u6821\u62DB\u3001\u804C\u573A\u7ECF\u9A8C\u4EA4\u6D41", icon: "briefcase", postCount: 1567, todayPostCount: 8, sortOrder: 3 },
  { id: "board4", name: "\u5931\u7269\u62DB\u9886", description: "\u4E22\u5931\u7269\u54C1\u53D1\u5E03\u3001\u6361\u5230\u7269\u54C1\u767B\u8BB0", icon: "search", postCount: 890, todayPostCount: 5, sortOrder: 4 },
  { id: "board5", name: "\u4E8C\u624B\u4EA4\u6613", description: "\u95F2\u7F6E\u7269\u54C1\u8F6C\u8BA9\u3001\u6C42\u8D2D\u4FE1\u606F", icon: "repeat", postCount: 1234, todayPostCount: 12, sortOrder: 5 },
  { id: "board6", name: "\u60C5\u611F\u6811\u6D1E", description: "\u533F\u540D\u503E\u8BC9\u3001\u60C5\u611F\u4EA4\u6D41", icon: "heart", postCount: 2678, todayPostCount: 18, sortOrder: 6 }
];
var forumPosts = [
  {
    id: "post001",
    authorId: "author001",
    authorName: "\u8BA1\u7B97\u673A\u5C0F\u738B",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    boardId: "board1",
    boardName: "\u6821\u56ED\u751F\u6D3B",
    title: "\u3010\u7ECF\u9A8C\u5206\u4EAB\u3011\u5927\u4E00\u5230\u5927\u56DB\u7684\u751F\u5B58\u6307\u5357\uFF0C\u5EFA\u8BAE\u6536\u85CF\uFF01",
    content: "\u4F5C\u4E3A\u4E00\u4E2A\u5373\u5C06\u6BD5\u4E1A\u7684\u5927\u56DB\u5B66\u957F\uFF0C\u60F3\u7ED9\u5B66\u5F1F\u5B66\u59B9\u4EEC\u4E00\u4E9B\u771F\u8BDA\u7684\u5EFA\u8BAE\uFF1A\n\n1. \u5927\u4E00\uFF1A\u591A\u53C2\u52A0\u793E\u56E2\u6D3B\u52A8\uFF0C\u4F46\u4E0D\u8981\u8D2A\u591A\uFF0C1-2\u4E2A\u8DB3\u591F\n2. \u5927\u4E8C\uFF1A\u5F00\u59CB\u5173\u6CE8\u4E13\u4E1A\u8BFE\uFF0CGPA\u5F88\u91CD\u8981\n3. \u5927\u4E09\uFF1A\u51C6\u5907\u8003\u7814\u6216\u627E\u5B9E\u4E60\uFF0C\u8D8A\u65E9\u8D8A\u597D\n4. \u5927\u56DB\uFF1A\u8BBA\u6587\u8981\u63D0\u524D\u5199\uFF0C\u522B\u62D6\u5230\u6700\u540E\n\n\u5E0C\u671B\u5BF9\u5927\u5BB6\u6709\u5E2E\u52A9\uFF01\u6709\u95EE\u9898\u53EF\u4EE5\u8BC4\u8BBA\u533A\u95EE\u6211~",
    images: [],
    viewCount: 2345,
    likeCount: 456,
    commentCount: 89,
    isTop: true,
    isEssence: true,
    status: "published",
    createdAt: "2026-03-20T10:00:00Z",
    updatedAt: "2026-03-20T10:00:00Z",
    lastReplyAt: "2026-04-06T15:30:00Z"
  },
  {
    id: "post002",
    authorId: "author002",
    authorName: "\u8003\u7814\u515A\u5C0F\u674E",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    boardId: "board2",
    boardName: "\u5B66\u672F\u4EA4\u6D41",
    title: "\u3010\u6C42\u52A9\u3011\u6570\u636E\u7ED3\u6784\u94FE\u8868\u53CD\u8F6C\uFF0C\u9012\u5F52\u548C\u975E\u9012\u5F52\u54EA\u4E2A\u66F4\u597D\uFF1F",
    content: "\u6700\u8FD1\u5728\u590D\u4E60\u6570\u636E\u7ED3\u6784\uFF0C\u770B\u5230\u94FE\u8868\u53CD\u8F6C\u6709\u4E24\u79CD\u5199\u6CD5\uFF1A\u9012\u5F52\u548C\u975E\u9012\u5F52\u3002\n\n\u9012\u5F52\u7248\u672C\u4EE3\u7801\u7B80\u6D01\u4F46\u53EF\u80FD\u6808\u6EA2\u51FA\uFF0C\u975E\u9012\u5F52\u7248\u672C\u9700\u8981\u989D\u5916\u6307\u9488\u64CD\u4F5C\u3002\n\n\u8BF7\u95EE\u5B9E\u9645\u9762\u8BD5\u4E2D\u54EA\u79CD\u66F4\u53D7\u9752\u7750\uFF1F\u6709\u6CA1\u6709\u5927\u4F6C\u80FD\u4ECE\u65F6\u95F4\u548C\u7A7A\u95F4\u590D\u6742\u5EA6\u4E0A\u5206\u6790\u4E00\u4E0B\uFF1F\n\n\u9644\u4E0A\u6211\u7684\u4EE3\u7801\u5B9E\u73B0\uFF0C\u6B22\u8FCE\u6307\u6B63...",
    images: [
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop"
    ],
    viewCount: 876,
    likeCount: 123,
    commentCount: 45,
    isTop: false,
    isEssence: false,
    status: "published",
    createdAt: "2026-04-05T14:00:00Z",
    updatedAt: "2026-04-05T14:00:00Z",
    lastReplyAt: "2026-04-06T09:20:00Z"
  },
  {
    id: "post003",
    authorId: "author003",
    authorName: "HR\u5C0F\u59D0\u59D0",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    boardId: "board3",
    boardName: "\u6C42\u804C\u62DB\u8058",
    title: "\u3010\u6821\u62DB\u3011\u5B57\u8282\u8DF3\u52A82026\u6625\u5B63\u6821\u56ED\u62DB\u8058\u6B63\u5F0F\u542F\u52A8\uFF01",
    content: "\u5404\u4F4D\u540C\u5B66\u597D\uFF01\u5B57\u8282\u8DF3\u52A82026\u6625\u62DB\u5DF2\u7ECF\u542F\u52A8\u5566\uFF01\n\n\u62DB\u8058\u5C97\u4F4D\uFF1A\n- \u540E\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08\uFF08Go/Java/Python\uFF09\n- \u524D\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08\uFF08React/Vue\uFF09\n- \u7B97\u6CD5\u5DE5\u7A0B\u5E08\uFF08NLP/CV/\u63A8\u8350\uFF09\n- \u4EA7\u54C1\u7ECF\u7406\n- \u8FD0\u8425\u4E13\u5458\n\n\u8981\u6C42\uFF1A\u672C\u79D1\u53CA\u4EE5\u4E0A\u5B66\u5386\uFF0C2026\u5C4A\u6BD5\u4E1A\u751F\n\n\u6295\u9012\u65B9\u5F0F\uFF1A\u767B\u5F55\u5B98\u7F51 career.bytedance.com\n\n\u622A\u6B62\u65F6\u95F4\uFF1A2026\u5E744\u670830\u65E5\n\n\u6B22\u8FCE\u5927\u5BB6\u6295\u9012\uFF01",
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop"
    ],
    viewCount: 3456,
    likeCount: 567,
    commentCount: 134,
    isTop: true,
    isEssence: true,
    status: "published",
    createdAt: "2026-04-01T09:00:00Z",
    updatedAt: "2026-04-01T09:00:00Z",
    lastReplyAt: "2026-04-06T16:00:00Z"
  },
  {
    id: "post004",
    authorId: "author004",
    authorName: "\u8FF7\u7CCA\u7684\u5C0F\u5F20",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    boardId: "board4",
    boardName: "\u5931\u7269\u62DB\u9886",
    title: "\u3010\u5BFB\u7269\u3011\u6628\u5929\u5728\u56FE\u4E66\u9986\u4E22\u5931\u4E86\u4E00\u4E2A\u9ED1\u8272\u94B1\u5305\uFF0C\u5185\u6709\u5B66\u751F\u8BC1\u548C\u73B0\u91D1",
    content: "\u6628\u5929\u4E0B\u5348\uFF084\u67085\u65E5\uFF09\u5927\u69823\u70B9\u5DE6\u53F3\u5728\u56FE\u4E66\u9986\u4E09\u697C\u81EA\u4E60\u5BA4\u5B66\u4E60\uFF0C\u8D70\u7684\u65F6\u5019\u5FD8\u8BB0\u62FF\u94B1\u5305\u4E86\u3002\n\n\u94B1\u5305\u7279\u5F81\uFF1A\n- \u9ED1\u8272\u957F\u6B3E\u94B1\u5305\n- \u5185\u6709\u5B66\u751F\u8BC1\uFF08\u59D3\u540D\uFF1A\u5F20\u67D0\uFF0C\u5B66\u53F7\uFF1A2022xxx\uFF09\n- \u8EAB\u4EFD\u8BC1\u4E00\u5F20\n- \u73B0\u91D1\u7EA6200\u5143\n- \u94F6\u884C\u53612\u5F20\n\n\u5982\u6709\u62FE\u5230\u8BF7\u8054\u7CFB\u6211\uFF1A138****8888\uFF0C\u5FC5\u6709\u91CD\u8C22\uFF01\u{1F64F}",
    images: [],
    viewCount: 567,
    likeCount: 34,
    commentCount: 23,
    isTop: false,
    isEssence: false,
    status: "published",
    createdAt: "2026-04-06T08:00:00Z",
    updatedAt: "2026-04-06T08:00:00Z",
    lastReplyAt: "2026-04-06T12:00:00Z"
  },
  {
    id: "post005",
    authorId: "author005",
    authorName: "\u6570\u7801\u8FBE\u4EBA",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    boardId: "board5",
    boardName: "\u4E8C\u624B\u4EA4\u6613",
    title: "\u3010\u51FA\u552E\u3011iPad Air 5 256G WiFi\u7248 \u661F\u5149\u8272 95\u65B0",
    description: "",
    // 兼容字段
    content: "\u56E0\u6362MacBook\u6240\u4EE5\u51FAiPad\uFF0C\u53BB\u5E74\u53CC\u5341\u4E00\u8D2D\u5165\uFF0C\u4E00\u76F4\u5E26\u58F3\u4F7F\u7528\uFF0C\u5C4F\u5E55\u5B8C\u7F8E\u65E0\u5212\u75D5\u3002\n\n\u914D\u7F6E\uFF1AM1\u82AF\u7247 8G\u5185\u5B58 256G\u5B58\u50A8\n\n\u914D\u4EF6\uFF1A\u539F\u88C5\u5145\u7535\u5668+Apple Pencil\u4E8C\u4EE3\uFF08\u53E6\u7B97200\u5143\uFF09\n\n\u4EF7\u683C\uFF1A4200\u5143 \u53EF\u5C0F\u5200\n\n\u6709\u610F\u79C1\u804A\uFF0C\u652F\u6301\u5F53\u9762\u9A8C\u8D27\u4EA4\u6613",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop"
    ].slice(0, 1),
    // 取第一张作为主图
    viewCount: 456,
    likeCount: 67,
    commentCount: 28,
    isTop: false,
    isEssence: false,
    status: "published",
    createdAt: "2026-04-04T15:00:00Z",
    updatedAt: "2026-04-04T15:00:00Z",
    lastReplyAt: "2026-04-05T20:00:00Z"
  },
  {
    id: "post006",
    authorId: "author006",
    authorName: "\u533F\u540D\u7528\u6237",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    boardId: "board6",
    boardName: "\u60C5\u611F\u6811\u6D1E",
    title: "\u3010\u6811\u6D1E\u3011\u5927\u4E09\u4E86\u8FD8\u662F\u5355\u8EAB\uFF0C\u662F\u4E0D\u662F\u6211\u4E0D\u591F\u597D\uFF1F",
    content: "\u9A6C\u4E0A\u5C31\u8981\u5927\u4E09\u4E0B\u4E86\uFF0C\u770B\u7740\u8EAB\u8FB9\u7684\u540C\u5B66\u90FD\u8131\u5355\u4E86\uFF0C\u5FC3\u91CC\u633A\u96BE\u53D7\u7684\u3002\n\n\u6211\u4E0D\u662F\u4E0D\u60F3\u8C08\u604B\u7231\uFF0C\u53EA\u662F\u597D\u50CF\u4E00\u76F4\u6CA1\u6709\u9047\u5230\u5408\u9002\u7684\u4EBA\u3002\u4E5F\u5C1D\u8BD5\u8FC7\u4E3B\u52A8\uFF0C\u4F46\u603B\u662F\u4EE5\u5931\u8D25\u544A\u7EC8\u3002\n\n\u6709\u65F6\u5019\u4F1A\u6000\u7591\u662F\u4E0D\u662F\u81EA\u5DF1\u54EA\u91CC\u4E0D\u591F\u597D\uFF0C\u6216\u8005\u662F\u4E0D\u662F\u7F18\u5206\u8FD8\u6CA1\u5230...\n\n\u6709\u6CA1\u6709\u540C\u6837\u611F\u53D7\u7684\u670B\u53CB\uFF1F\u5927\u5BB6\u662F\u600E\u4E48\u8C03\u6574\u5FC3\u6001\u7684\uFF1F",
    images: [],
    viewCount: 1890,
    likeCount: 345,
    commentCount: 167,
    isTop: false,
    isEssence: false,
    status: "published",
    createdAt: "2026-04-03T21:00:00Z",
    updatedAt: "2026-04-03T21:00:00Z",
    lastReplyAt: "2026-04-06T14:30:00Z"
  },
  {
    id: "post007",
    authorId: "author007",
    authorName: "\u793E\u56E2\u8D1F\u8D23\u4EBA",
    authorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    boardId: "board1",
    boardName: "\u6821\u56ED\u751F\u6D3B",
    title: "\u3010\u6D3B\u52A8\u3011\u6444\u5F71\u793E\u6625\u5B63\u5916\u62CD\u6D3B\u52A8\u62A5\u540D\u5F00\u59CB\uFF01",
    content: "\u5404\u4F4D\u6444\u5F71\u7231\u597D\u8005\u6CE8\u610F\u5566\uFF01\n\n\u672C\u5468\u516D\uFF084\u670812\u65E5\uFF09\u4E0B\u53482\u70B9\uFF0C\u6211\u4EEC\u5C06\u7EC4\u7EC7\u524D\u5F80\u592A\u9633\u5C9B\u98CE\u666F\u533A\u8FDB\u884C\u6625\u5B63\u5916\u62CD\u6D3B\u52A8\u3002\n\n\u6D3B\u52A8\u5B89\u6392\uFF1A\n- 13:30 \u5B66\u6821\u4E1C\u95E8\u96C6\u5408\u51FA\u53D1\n- 14:00-17:00 \u81EA\u7531\u62CD\u6444\u65F6\u95F4\n- 17:00-18:00 \u4F5C\u54C1\u70B9\u8BC4\u4EA4\u6D41\n\n\u6CE8\u610F\u4E8B\u9879\uFF1A\n1. \u81EA\u5907\u76F8\u673A\u6216\u624B\u673A\u5747\u53EF\n2. \u5EFA\u8BAE\u7A7F\u7740\u4FBF\u4E8E\u6D3B\u52A8\u7684\u670D\u88C5\n3. \u6CE8\u610F\u9632\u6652\u548C\u8865\u6C34\n\n\u540D\u989D\u6709\u9650\uFF0C\u5148\u62A5\u5148\u5F97\uFF01\u626B\u7801\u8FDB\u7FA4\u62A5\u540D~",
    images: [
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop"
    ],
    viewCount: 678,
    likeCount: 123,
    commentCount: 56,
    isTop: false,
    isEssence: true,
    status: "published",
    createdAt: "2026-04-06T10:00:00Z",
    updatedAt: "2026-04-06T10:00:00Z",
    lastReplyAt: "2026-04-06T15:00:00Z"
  },
  {
    id: "post008",
    authorId: "author008",
    authorName: "\u5B66\u9738\u7B14\u8BB0",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    boardId: "board2",
    boardName: "\u5B66\u672F\u4EA4\u6D41",
    title: "\u3010\u8D44\u6E90\u5206\u4EAB\u3011\u64CD\u4F5C\u7CFB\u7EDF\u91CD\u70B9\u77E5\u8BC6\u70B9\u6574\u7406\uFF08\u65E0\u507F\u5206\u4EAB\uFF09",
    content: "\u521A\u590D\u4E60\u5B8C\u64CD\u4F5C\u7CFB\u7EDF\uFF0C\u628A\u91CD\u70B9\u6574\u7406\u6210\u4E86\u601D\u7EF4\u5BFC\u56FE\u548C\u7B14\u8BB0\uFF0C\u5206\u4EAB\u7ED9\u9700\u8981\u7684\u540C\u5B66\u3002\n\n\u5185\u5BB9\u5305\u62EC\uFF1A\n1. \u8FDB\u7A0B\u7BA1\u7406\uFF08\u8FDB\u7A0B\u72B6\u6001\u8F6C\u6362\u3001\u8C03\u5EA6\u7B97\u6CD5\u3001\u540C\u6B65\u4E92\u65A5\uFF09\n2. \u5185\u5B58\u7BA1\u7406\uFF08\u5206\u9875\u5206\u6BB5\u3001\u865A\u62DF\u5185\u5B58\u3001\u9875\u9762\u7F6E\u6362\u7B97\u6CD5\uFF09\n3. \u6587\u4EF6\u7CFB\u7EDF\uFF08\u6587\u4EF6\u5B58\u50A8\u3001\u76EE\u5F55\u7ED3\u6784\u3001\u78C1\u76D8\u8C03\u5EA6\uFF09\n4. I/O\u7BA1\u7406\uFF08\u7F13\u51B2\u6280\u672F\u3001\u8BBE\u5907\u5206\u914D\uFF09\n\n\u7B14\u8BB0\u683C\u5F0F\uFF1APDF + XMind\u6E90\u6587\u4EF6\n\n\u83B7\u53D6\u65B9\u5F0F\uFF1A\u8BC4\u8BBA\u533A\u7559\u8A00\u90AE\u7BB1\uFF0C\u6211\u4F1A\u9010\u4E00\u53D1\u9001\n\n\u795D\u5927\u5BB6\u671F\u672B\u987A\u5229\uFF01",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop"
    ],
    viewCount: 1234,
    likeCount: 289,
    commentCount: 98,
    isTop: false,
    isEssence: true,
    status: "published",
    createdAt: "2026-04-02T16:00:00Z",
    updatedAt: "2026-04-02T16:00:00Z",
    lastReplyAt: "2026-04-06T11:00:00Z"
  }
];
var activities = [
  {
    id: "act1",
    title: "\u6625\u5B63\u8FD0\u52A8\u4F1A",
    coverImage: "https://images.unsplash.com/photo-1461896836934-bd45ba8ba9ef?w=600&h=300&fit=crop",
    description: "\u4E00\u5E74\u4E00\u5EA6\u7684\u6625\u5B63\u8FD0\u52A8\u4F1A\u5373\u5C06\u5F00\u5E55\uFF01\u5305\u62EC\u7530\u5F84\u6BD4\u8D5B\u3001\u8DA3\u5473\u8FD0\u52A8\u9879\u76EE\u3001\u56E2\u4F53\u64CD\u8868\u6F14\u7B49\u7CBE\u5F69\u73AF\u8282\u3002\u6B22\u8FCE\u5168\u6821\u5E08\u751F\u79EF\u6781\u53C2\u4E0E\uFF0C\u5C55\u73B0\u9752\u6625\u6D3B\u529B\uFF01",
    category: "sports",
    organizer: "\u4F53\u80B2\u90E8",
    location: "\u4F53\u80B2\u573A",
    startTime: "2026-04-20T08:00:00Z",
    endTime: "2026-04-20T17:00:00Z",
    maxParticipants: 500,
    currentParticipants: 367,
    status: "upcoming",
    fee: 0,
    tags: ["\u8FD0\u52A8", "\u7ADE\u6280", "\u56E2\u4F53"],
    createdAt: "2026-03-15T10:00:00Z",
    updatedAt: "2026-04-05T14:00:00Z"
  },
  {
    id: "act2",
    title: "\u6821\u56ED\u6B4C\u624B\u5927\u8D5B\u51B3\u8D5B",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=300&fit=crop",
    description: "\u7B2C\u5341\u5C4A\u6821\u56ED\u6B4C\u624B\u5927\u8D5B\u603B\u51B3\u8D5B\uFF0C10\u4F4D\u5B9E\u529B\u5531\u5C06\u540C\u53F0\u7ADE\u6280\uFF0C\u66F4\u6709\u795E\u79D8\u5609\u5BBE\u52A9\u9635\u3002\u73B0\u573A\u6295\u7968\u9009\u51FA\u4F60\u5FC3\u4E2D\u7684\u6700\u4F73\u6B4C\u624B\uFF01",
    category: "entertainment",
    organizer: "\u5B66\u751F\u4F1A\u6587\u827A\u90E8",
    location: "\u5927\u5B66\u751F\u6D3B\u52A8\u4E2D\u5FC3\u5927\u793C\u5802",
    startTime: "2026-04-25T19:00:00Z",
    endTime: "2026-04-25T22:00:00Z",
    maxParticipants: 800,
    currentParticipants: 723,
    status: "upcoming",
    fee: 0,
    tags: ["\u97F3\u4E50", "\u624D\u827A", "\u665A\u4F1A"],
    createdAt: "2026-03-20T09:00:00Z",
    updatedAt: "2026-04-04T16:00:00Z"
  },
  {
    id: "act3",
    title: "AI\u4E0E\u672A\u6765\u79D1\u6280\u8BB2\u5EA7",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
    description: "\u7279\u9080\u6E05\u534E\u5927\u5B66\u4EBA\u5DE5\u667A\u80FD\u7814\u7A76\u9662\u6559\u6388\u4E3B\u8BB2\uFF0C\u63A2\u8BA8ChatGPT\u7B49\u5927\u8BED\u8A00\u6A21\u578B\u7684\u53D1\u5C55\u8D8B\u52BF\u53CA\u5176\u5BF9\u793E\u4F1A\u5404\u884C\u4E1A\u7684\u5F71\u54CD\u3002\u73B0\u573A\u4E92\u52A8\u95EE\u7B54\u73AF\u8282\u3002",
    category: "academic",
    organizer: "\u8BA1\u7B97\u673A\u5B66\u9662",
    location: "\u56FE\u4E66\u9986\u62A5\u544A\u5385",
    startTime: "2026-04-18T14:00:00Z",
    endTime: "2026-04-18T16:30:00Z",
    maxParticipants: 300,
    currentParticipants: 278,
    status: "upcoming",
    fee: 0,
    tags: ["AI", "\u8BB2\u5EA7", "\u79D1\u6280"],
    createdAt: "2026-03-25T11:00:00Z",
    updatedAt: "2026-04-03T10:00:00Z"
  },
  {
    id: "act4",
    title: "\u5FD7\u613F\u670D\u52A1\uFF1A\u656C\u8001\u9662\u6170\u95EE\u6F14\u51FA",
    coverImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=300&fit=crop",
    description: "\u524D\u5F80\u677E\u5317\u533A\u656C\u8001\u9662\u8FDB\u884C\u6170\u95EE\u6F14\u51FA\uFF0C\u4E3A\u8001\u4EBA\u4EEC\u5E26\u53BB\u6B4C\u821E\u8868\u6F14\u3001\u76F8\u58F0\u5C0F\u54C1\u7B49\u8282\u76EE\u3002\u4F20\u9012\u6E29\u6696\uFF0C\u5F18\u626C\u5C0A\u8001\u7231\u5E7C\u7684\u4F20\u7EDF\u7F8E\u5FB7\u3002",
    category: "volunteer",
    organizer: "\u9752\u5E74\u5FD7\u613F\u8005\u534F\u4F1A",
    location: "\u677E\u5317\u533A\u4E2D\u5FC3\u656C\u8001\u9662",
    startTime: "2026-04-14T09:00:00Z",
    endTime: "2026-04-14T12:00:00Z",
    maxParticipants: 40,
    currentParticipants: 35,
    status: "upcoming",
    fee: 0,
    tags: ["\u516C\u76CA", "\u5FD7\u613F", "\u656C\u8001"],
    createdAt: "2026-03-28T14:00:00Z",
    updatedAt: "2026-04-02T09:00:00Z"
  },
  {
    id: "act5",
    title: "\u4F20\u7EDF\u6587\u5316\u8282\uFF1A\u6C49\u670D\u6E38\u56ED\u4F1A",
    coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=300&fit=crop",
    description: "\u7A7F\u4E0A\u6C49\u670D\uFF0C\u7A7F\u8D8A\u65F6\u7A7A\uFF01\u6D3B\u52A8\u73B0\u573A\u8BBE\u6709\u53E4\u98CE\u62CD\u7167\u533A\u3001\u4F20\u7EDF\u624B\u5DE5\u827A\u4F53\u9A8C\uFF08\u526A\u7EB8\u3001\u634F\u9762\u4EBA\u3001\u753B\u6247\u9762\uFF09\u3001\u8336\u827A\u8868\u6F14\u3001\u53E4\u5178\u4E50\u5668\u6F14\u594F\u7B49\u3002",
    category: "culture",
    organizer: "\u56FD\u5B66\u793E",
    location: "\u6821\u56ED\u4EBA\u5DE5\u6E56\u7554",
    startTime: "2026-04-27T13:00:00Z",
    endTime: "2026-04-27T17:00:00Z",
    maxParticipants: 200,
    currentParticipants: 156,
    status: "upcoming",
    fee: 10,
    tags: ["\u6C49\u670D", "\u4F20\u7EDF\u6587\u5316", "\u6E38\u56ED\u4F1A"],
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-04-05T11:00:00Z"
  },
  {
    id: "act6",
    title: "\u6625\u5B63\u62DB\u8058\u5BA3\u8BB2\u4F1A\u2014\u2014\u4E92\u8054\u7F51\u5927\u5382\u4E13\u573A",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop",
    description: "\u9080\u8BF7\u5B57\u8282\u8DF3\u52A8\u3001\u817E\u8BAF\u3001\u963F\u91CC\u5DF4\u5DF4\u3001\u7F8E\u56E2\u3001\u767E\u5EA6\u7B49\u77E5\u540D\u4E92\u8054\u7F51\u4F01\u4E1AHR\u548C\u6280\u672F\u8D1F\u8D23\u4EBA\u8FDB\u884C\u5BA3\u8BB2\u548C\u9762\u8BD5\u6307\u5BFC\u3002\u73B0\u573A\u63A5\u6536\u7B80\u5386\uFF0C\u4F18\u79C0\u8005\u53EF\u83B7\u5F97\u76F4\u901A\u9762\u8BD5\u673A\u4F1A\uFF01",
    category: "career",
    organizer: "\u5C31\u4E1A\u6307\u5BFC\u4E2D\u5FC3",
    location: "\u5927\u5B66\u751F\u6D3B\u52A8\u4E2D\u5FC3\u62A5\u544A\u5385",
    startTime: "2026-04-12T14:00:00Z",
    endTime: "2026-04-12T18:00:00Z",
    maxParticipants: 300,
    currentParticipants: 234,
    status: "upcoming",
    fee: 0,
    tags: ["\u62DB\u8058", "\u5B9E\u4E60", "\u6821\u62DB"],
    createdAt: "2026-03-22T09:00:00Z",
    updatedAt: "2026-04-04T15:00:00Z"
  }
];
var index_default = [
  // ==================== 商品相关接口 ====================
  /**
   * 获取商品分类列表
   * GET /api/categories
   */
  {
    url: "/api/categories",
    method: "get",
    response: () => {
      return successResponse(categories);
    }
  },
  /**
   * 获取商品列表（分页）
   * GET /api/products?page=1&pageSize=10&categoryId=&keyword=&sort=
   */
  {
    url: "/api/products",
    method: "get",
    response: ({ query }) => {
      const page = parseInt(query.page || "1");
      const pageSize = parseInt(query.pageSize || "10");
      const categoryId = query.categoryId;
      const keyword = query.keyword?.toLowerCase();
      const sort = query.sort;
      let filteredProducts = [...products];
      if (categoryId && categoryId !== "all") {
        filteredProducts = filteredProducts.filter((p) => p.categoryId === categoryId);
      }
      if (keyword) {
        filteredProducts = filteredProducts.filter(
          (p) => p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword) || p.tags.some((t) => t.toLowerCase().includes(keyword))
        );
      }
      if (sort === "price_asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (sort === "price_desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sort === "sales") {
        filteredProducts.sort((a, b) => b.sales - a.sales);
      } else if (sort === "rating") {
        filteredProducts.sort((a, b) => b.rating - a.rating);
      }
      return successResponse(paginate(filteredProducts, page, pageSize));
    }
  },
  /**
   * 获取推荐商品
   * GET /api/products/recommend?limit=10
   */
  {
    url: "/api/products/recommend",
    method: "get",
    response: ({ query }) => {
      const limit = parseInt(query.limit || "10");
      const recommended = [...products].sort(() => Math.random() - 0.5).slice(0, limit);
      return successResponse(recommended);
    }
  },
  /**
   * 获取热门商品
   * GET /api/products/hot?limit=10
   */
  {
    url: "/api/products/hot",
    method: "get",
    response: ({ query }) => {
      const limit = parseInt(query.limit || "10");
      const hotProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, limit);
      return successResponse(hotProducts);
    }
  },
  /**
   * 获取商品搜索
   * GET /api/products/search?keyword=xxx
   */
  {
    url: "/api/products/search",
    method: "get",
    response: ({ query }) => {
      const keyword = query.keyword?.toLowerCase();
      const page = parseInt(query.page || "1");
      const pageSize = parseInt(query.pageSize || "10");
      let filteredProducts = [...products];
      if (keyword) {
        filteredProducts = filteredProducts.filter(
          (p) => p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword) || p.tags.some((t) => t.toLowerCase().includes(keyword))
        );
      }
      return successResponse(paginate(filteredProducts, page, pageSize));
    }
  },
  /**
   * 获取商品详情
   * GET /api/products/:id
   */
  {
    url: /\/api\/products\/(\w+)/,
    method: "get",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/products\/(\w+)/);
      const id = match ? match[1] : "";
      const product = products.find((p) => p.id === id);
      if (!product) {
        return { code: 404, message: "\u5546\u54C1\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      return successResponse(product);
    }
  },
  // ==================== 订单相关接口 ====================
  /**
   * 获取订单列表（分页）
   * GET /api/orders?page=1&pageSize=10&status=
   */
  {
    url: "/api/orders",
    method: "get",
    response: ({ query }) => {
      const page = parseInt(query.page || "1");
      const pageSize = parseInt(query.pageSize || "10");
      const status = query.status;
      let filteredOrders = [...orders].reverse();
      if (status && status !== "all") {
        filteredOrders = filteredOrders.filter((o) => o.status === status);
      }
      return successResponse(paginate(filteredOrders, page, pageSize));
    }
  },
  /**
   * 获取订单详情
   * GET /api/orders/:id
   */
  {
    url: /\/api\/orders\/(\w+)$/,
    method: "get",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/orders\/(\w+)$/);
      const id = match ? match[1] : "";
      const order = orders.find((o) => o.id === id);
      if (!order) {
        return { code: 404, message: "\u8BA2\u5355\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      return successResponse(order);
    }
  },
  /**
   * 创建订单
   * POST /api/orders
   */
  {
    url: "/api/orders",
    method: "post",
    response: ({ body }) => {
      const newOrder = {
        id: `order${String(orders.length + 1).padStart(3, "0")}`,
        orderNo: generateOrderNo(),
        userId: "user001",
        items: body.items,
        totalAmount: body.totalAmount,
        discountAmount: body.discountAmount || 0,
        freightAmount: body.freightAmount || 0,
        payAmount: body.payAmount,
        status: "pending",
        receiverName: body.receiverName,
        receiverPhone: body.receiverPhone,
        receiverAddress: body.receiverAddress,
        remark: body.remark,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      orders.unshift(newOrder);
      return successResponse(newOrder);
    }
  },
  /**
   * 取消订单
   * PUT /api/orders/:id/cancel
   */
  {
    url: /\/api\/orders\/(\w+)\/cancel$/,
    method: "put",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/orders\/(\w+)\/cancel$/);
      const id = match ? match[1] : "";
      const order = orders.find((o) => o.id === id);
      if (!order) {
        return { code: 404, message: "\u8BA2\u5355\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      if (!["pending", "paid"].includes(order.status)) {
        return { code: 400, message: "\u5F53\u524D\u72B6\u6001\u65E0\u6CD5\u53D6\u6D88", data: null, timestamp: Date.now() };
      }
      order.status = "cancelled";
      order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      return successResponse(order);
    }
  },
  /**
   * 确认收货
   * POST /api/orders/:id/confirm
   */
  {
    url: /\/api\/orders\/(\w+)\/confirm$/,
    method: "post",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/orders\/(\w+)\/confirm$/);
      const id = match ? match[1] : "";
      const order = orders.find((o) => o.id === id);
      if (!order) {
        return { code: 404, message: "\u8BA2\u5355\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      if (order.status !== "shipped" && order.status !== "delivered") {
        return { code: 400, message: "\u5F53\u524D\u72B6\u6001\u65E0\u6CD5\u786E\u8BA4\u6536\u8D27", data: null, timestamp: Date.now() };
      }
      order.status = "completed";
      order.completeTime = (/* @__PURE__ */ new Date()).toISOString();
      order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      return successResponse(order);
    }
  },
  /**
   * 获取订单统计
   * GET /api/orders/stats
   */
  {
    url: "/api/orders/stats",
    method: "get",
    response: () => {
      const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        paid: orders.filter((o) => o.status === "paid").length,
        shipped: orders.filter((o) => o.status === "shipped").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
        completed: orders.filter((o) => o.status === "completed").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
        refunding: orders.filter((o) => o.status === "refunding").length
      };
      return successResponse(stats);
    }
  },
  // ==================== 购物车相关接口 ====================
  /**
   * 获取购物车列表
   * GET /api/cart
   */
  {
    url: "/api/cart",
    method: "get",
    response: () => {
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const selectedItems = cartItems.filter((item) => item.selected);
      const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
      const selectedAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return successResponse({
        items: cartItems,
        totalItems,
        totalAmount,
        selectedCount,
        selectedAmount,
        savedAmount: 0
      });
    }
  },
  /**
   * 添加商品到购物车
   * POST /api/cart
   */
  {
    url: "/api/cart",
    method: "post",
    response: ({ body }) => {
      const product = products.find((p) => p.id === body.productId);
      if (!product) {
        return { code: 404, message: "\u5546\u54C1\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      const existingItem = cartItems.find((item) => item.productId === body.productId);
      if (existingItem) {
        existingItem.quantity += body.quantity || 1;
        existingItem.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        return successResponse(existingItem);
      }
      const newItem = {
        id: `cart${String(cartItems.length + 1).padStart(3, "0")}`,
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          stock: product.stock,
          status: product.status
        },
        quantity: body.quantity || 1,
        selected: true,
        addedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      cartItems.push(newItem);
      return successResponse(newItem);
    }
  },
  /**
   * 更新购物车商品数量
   * PUT /api/cart/:id
   */
  {
    url: /\/api\/cart\/(\w+)$/,
    method: "put",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/cart\/(\w+)$/);
      const id = match ? match[1] : "";
      const { body } = config;
      const item = cartItems.find((i) => i.id === id);
      if (!item) {
        return { code: 404, message: "\u8D2D\u7269\u8F66\u9879\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      item.quantity = body.quantity;
      if (body.selected !== void 0) {
        item.selected = body.selected;
      }
      return successResponse(item);
    }
  },
  /**
   * 删除购物车商品
   * DELETE /api/cart/:id
   */
  {
    url: /\/api\/cart\/(\w+)$/,
    method: "delete",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/cart\/(\w+)$/);
      const id = match ? match[1] : "";
      const index = cartItems.findIndex((i) => i.id === id);
      if (index === -1) {
        return { code: 404, message: "\u8D2D\u7269\u8F66\u9879\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      cartItems.splice(index, 1);
      return successResponse({ message: "\u5220\u9664\u6210\u529F" });
    }
  },
  /**
   * 清空购物车
   * DELETE /api/cart/clear
   */
  {
    url: "/api/cart/clear",
    method: "delete",
    response: () => {
      cartItems.length = 0;
      return successResponse({ message: "\u8D2D\u7269\u8F66\u5DF2\u6E05\u7A7A" });
    }
  },
  // ==================== 用户相关接口 ====================
  /**
   * 获取当前用户信息
   * GET /api/user/info
   */
  {
    url: "/api/user/info",
    method: "get",
    response: () => {
      return successResponse(currentUser);
    }
  },
  /**
   * 更新用户信息
   * PUT /api/user/info
   */
  {
    url: "/api/user/info",
    method: "put",
    response: ({ body }) => {
      Object.assign(currentUser, body);
      currentUser.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      return successResponse(currentUser);
    }
  },
  /**
   * 获取收货地址列表
   * GET /api/addresses
   */
  {
    url: "/api/addresses",
    method: "get",
    response: () => {
      return successResponse(addresses);
    }
  },
  /**
   * 添加收货地址
   * POST /api/addresses
   */
  {
    url: "/api/addresses",
    method: "post",
    response: ({ body }) => {
      const newAddress = {
        id: `addr${String(addresses.length + 1).padStart(3, "0")}`,
        userId: "user001",
        receiverName: body.name || body.receiverName || "",
        receiverPhone: body.phone || body.receiverPhone || "",
        province: body.province || "",
        city: body.city || "",
        district: body.district || "",
        detail: body.detail || body.detailAddress || "",
        fullAddress: `${body.province || ""}${body.city || ""}${body.district || ""}${body.detail || body.detailAddress || ""}`,
        isDefault: body.isDefault || false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (newAddress.isDefault) {
        addresses.forEach((addr) => addr.isDefault = false);
      }
      addresses.push(newAddress);
      return successResponse(newAddress);
    }
  },
  /**
   * 更新收货地址
   * PUT /api/addresses/:id
   */
  {
    url: /\/api\/addresses\/(\w+)$/,
    method: "put",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/addresses\/(\w+)$/);
      const id = match ? match[1] : "";
      const { body } = config;
      const address = addresses.find((a) => a.id === id);
      if (!address) {
        return { code: 404, message: "\u5730\u5740\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      if (body.name) address.receiverName = body.name;
      if (body.receiverName) address.receiverName = body.receiverName;
      if (body.phone) address.receiverPhone = body.phone;
      if (body.receiverPhone) address.receiverPhone = body.receiverPhone;
      if (body.province) address.province = body.province;
      if (body.city) address.city = body.city;
      if (body.district) address.district = body.district;
      if (body.detail) address.detail = body.detail;
      if (body.detailAddress) address.detail = body.detailAddress;
      if (body.isDefault !== void 0) address.isDefault = body.isDefault;
      address.fullAddress = `${address.province}${address.city}${address.district}${address.detail}`;
      if (body.isDefault) {
        addresses.forEach((addr) => {
          if (addr.id !== id) addr.isDefault = false;
        });
      }
      return successResponse(address);
    }
  },
  /**
   * 删除收货地址
   * POST /api/addresses/:id/delete
   */
  {
    url: /\/api\/addresses\/(\w+)\/delete$/,
    method: "post",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/addresses\/(\w+)\/delete$/);
      const id = match ? match[1] : "";
      const index = addresses.findIndex((a) => a.id === id);
      if (index === -1) {
        return { code: 404, message: "\u5730\u5740\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      addresses.splice(index, 1);
      return successResponse({ message: "\u5220\u9664\u6210\u529F" });
    }
  },
  /**
   * 设置默认地址
   * POST /api/addresses/:id/default
   */
  {
    url: /\/api\/addresses\/(\w+)\/default$/,
    method: "post",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/addresses\/(\w+)\/default$/);
      const id = match ? match[1] : "";
      const address = addresses.find((a) => a.id === id);
      if (!address) {
        return { code: 404, message: "\u5730\u5740\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      addresses.forEach((addr) => addr.isDefault = false);
      address.isDefault = true;
      return successResponse(address);
    }
  },
  // ==================== 外卖相关接口 ====================
  /**
   * 获取外卖商家列表
   * GET /api/delivery/merchants?category=&keyword=&sort=
   */
  {
    url: "/api/delivery/merchants",
    method: "get",
    response: ({ query }) => {
      const category = query.category;
      const keyword = query.keyword?.toLowerCase();
      const sort = query.sort;
      let filteredMerchants = [...merchants];
      if (category && category !== "all") {
        filteredMerchants = filteredMerchants.filter((m) => m.category === category);
      }
      if (keyword) {
        filteredMerchants = filteredMerchants.filter(
          (m) => m.name.toLowerCase().includes(keyword) || m.tags.some((t) => t.toLowerCase().includes(keyword))
        );
      }
      if (sort === "rating") {
        filteredMerchants.sort((a, b) => b.rating - a.rating);
      } else if (sort === "sales") {
        filteredMerchants.sort((a, b) => b.monthlySales - a.monthlySales);
      } else if (sort === "distance") {
        filteredMerchants.sort((a, b) => a.distance - b.distance);
      }
      return successResponse(filteredMerchants);
    }
  },
  /**
   * 获取商家详情及菜品
   * GET /api/delivery/merchants/:id
   */
  {
    url: /\/api\/delivery\/merchants\/(\w+)$/,
    method: "get",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/delivery\/merchants\/(\w+)$/);
      const id = match ? match[1] : "";
      const merchant = merchants.find((m) => m.id === id);
      if (!merchant) {
        return { code: 404, message: "\u5546\u5BB6\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      const dishes = dishesTemplate[id] || [];
      return successResponse({ merchant, dishes });
    }
  },
  /**
   * 获取商家分类列表
   * GET /api/delivery/categories
   */
  {
    url: "/api/delivery/categories",
    method: "get",
    response: () => {
      const categories2 = [...new Set(merchants.map((m) => m.category))];
      return successResponse(categories2);
    }
  },
  /**
   * 获取推荐商家
   * GET /api/delivery/merchants/recommend?limit=5
   */
  {
    url: "/api/delivery/merchants/recommend",
    method: "get",
    response: ({ query }) => {
      const limit = parseInt(query.limit || "5");
      const recommended = [...merchants].filter((m) => m.status === "open").sort((a, b) => b.rating - a.rating || b.monthlySales - a.monthlySales).slice(0, limit);
      return successResponse(recommended);
    }
  },
  // ==================== 二手市场相关接口 ====================
  /**
   * 获取二手分类列表
   * GET /api/secondhand/categories
   */
  {
    url: "/api/secondhand/categories",
    method: "get",
    response: () => {
      return successResponse(secondHandCategories);
    }
  },
  /**
   * 获取二手物品列表（分页）
   * GET /api/secondhand/items?page=1&pageSize=10&categoryId=&keyword=&condition=&sort=
   */
  {
    url: "/api/secondhand/items",
    method: "get",
    response: ({ query }) => {
      const page = parseInt(query.page || "1");
      const pageSize = parseInt(query.pageSize || "10");
      const categoryId = query.categoryId;
      const keyword = query.keyword?.toLowerCase();
      const condition = query.condition;
      const sort = query.sort;
      let filteredItems = [...secondHandItems];
      if (categoryId && categoryId !== "all") {
        filteredItems = filteredItems.filter((item) => item.categoryId === categoryId);
      }
      if (keyword) {
        filteredItems = filteredItems.filter(
          (item) => item.title.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword)
        );
      }
      if (condition && condition !== "all") {
        filteredItems = filteredItems.filter((item) => item.condition === condition);
      }
      if (sort === "price_asc") {
        filteredItems.sort((a, b) => a.currentPrice - b.currentPrice);
      } else if (sort === "price_desc") {
        filteredItems.sort((a, b) => b.currentPrice - a.currentPrice);
      } else if (sort === "time") {
        filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      return successResponse(paginate(filteredItems, page, pageSize));
    }
  },
  /**
   * 获取二手物品详情
   * GET /api/secondhand/items/:id
   */
  {
    url: /\/api\/secondhand\/items\/(\w+)$/,
    method: "get",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/secondhand\/items\/(\w+)$/);
      const id = match ? match[1] : "";
      const item = secondHandItems.find((i) => i.id === id);
      if (!item) {
        return { code: 404, message: "\u7269\u54C1\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      item.viewCount++;
      return successResponse(item);
    }
  },
  /**
   * 发布二手物品
   * POST /api/secondhand/items
   */
  {
    url: "/api/secondhand/items",
    method: "post",
    response: ({ body }) => {
      const category = secondHandCategories.find((c) => c.id === body.categoryId);
      const newItem = {
        id: `item${String(secondHandItems.length + 1).padStart(3, "0")}`,
        sellerId: "user001",
        sellerName: currentUser.nickname,
        sellerAvatar: currentUser.avatar,
        ...body,
        categoryName: category?.name || "",
        viewCount: 0,
        likeCount: 0,
        chatCount: 0,
        status: "on_sale",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      secondHandItems.unshift(newItem);
      return successResponse(newItem);
    }
  },
  // ==================== 社区论坛相关接口 ====================
  /**
   * 获取论坛板块列表
   * GET /api/forum/boards
   */
  {
    url: "/api/forum/boards",
    method: "get",
    response: () => {
      return successResponse(forumBoards);
    }
  },
  /**
   * 获取帖子列表（分页）
   * GET /api/forum/posts?page=1&pageSize=10&boardId=&keyword=&sort=
   */
  {
    url: "/api/forum/posts",
    method: "get",
    response: ({ query }) => {
      const page = parseInt(query.page || "1");
      const pageSize = parseInt(query.pageSize || "10");
      const boardId = query.boardId;
      const keyword = query.keyword?.toLowerCase();
      const sort = query.sort;
      let filteredPosts = [...forumPosts];
      if (boardId && boardId !== "all") {
        filteredPosts = filteredPosts.filter((p) => p.boardId === boardId);
      }
      if (keyword) {
        filteredPosts = filteredPosts.filter(
          (p) => p.title.toLowerCase().includes(keyword) || p.content.toLowerCase().includes(keyword)
        );
      }
      if (sort === "time") {
        filteredPosts.sort((a, b) => {
          if (a.isTop !== b.isTop) return b.isTop ? 1 : -1;
          return new Date(b.lastReplyAt || b.createdAt).getTime() - new Date(a.lastReplyAt || a.createdAt).getTime();
        });
      } else {
        filteredPosts.sort((a, b) => {
          if (a.isTop !== b.isTop) return b.isTop ? 1 : -1;
          if (a.isEssence !== b.isEssence) return b.isEssence ? 1 : -1;
          return new Date(b.lastReplyAt || b.createdAt).getTime() - new Date(a.lastReplyAt || a.createdAt).getTime();
        });
      }
      return successResponse(paginate(filteredPosts, page, pageSize));
    }
  },
  /**
   * 获取帖子详情
   * GET /api/forum/posts/:id
   */
  {
    url: /\/api\/forum\/posts\/(\w+)$/,
    method: "get",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/forum\/posts\/(\w+)$/);
      const id = match ? match[1] : "";
      const post = forumPosts.find((p) => p.id === id);
      if (!post) {
        return { code: 404, message: "\u5E16\u5B50\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      post.viewCount++;
      return successResponse(post);
    }
  },
  /**
   * 发布帖子
   * POST /api/forum/posts
   */
  {
    url: "/api/forum/posts",
    method: "post",
    response: ({ body }) => {
      const board = forumBoards.find((b) => b.id === body.boardId);
      const newPost = {
        id: `post${String(forumPosts.length + 1).padStart(3, "0")}`,
        authorId: "user001",
        authorName: currentUser.nickname,
        authorAvatar: currentUser.avatar,
        boardId: body.boardId,
        boardName: board?.name || "",
        title: body.title,
        content: body.content,
        images: body.images || [],
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        isTop: false,
        isEssence: false,
        status: "published",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      forumPosts.unshift(newPost);
      if (board) {
        board.postCount++;
        board.todayPostCount++;
      }
      return successResponse(newPost);
    }
  },
  /**
   * 点赞帖子
   * POST /api/forum/posts/:id/like
   */
  {
    url: /\/api\/forum\/posts\/(\w+)\/like$/,
    method: "post",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/forum\/posts\/(\w+)\/like$/);
      const id = match ? match[1] : "";
      const post = forumPosts.find((p) => p.id === id);
      if (!post) {
        return { code: 404, message: "\u5E16\u5B50\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      post.likeCount++;
      return successResponse({ liked: true, likeCount: post.likeCount });
    }
  },
  // ==================== 社区活动相关接口 ====================
  /**
   * 获取活动列表
   * GET /api/activities?page=1&pageSize=10&category=&status=
   */
  {
    url: "/api/activities",
    method: "get",
    response: ({ query }) => {
      const page = parseInt(query.page || "1");
      const pageSize = parseInt(query.pageSize || "10");
      const category = query.category;
      const status = query.status;
      let filteredActivities = [...activities];
      if (category && category !== "all") {
        filteredActivities = filteredActivities.filter((a) => a.category === category);
      }
      if (status && status !== "all") {
        filteredActivities = filteredActivities.filter((a) => a.status === status);
      }
      filteredActivities.sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      return successResponse(paginate(filteredActivities, page, pageSize));
    }
  },
  /**
   * 获取活动详情
   * GET /api/activities/:id
   */
  {
    url: /\/api\/activities\/(\w+)$/,
    method: "get",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/activities\/(\w+)$/);
      const id = match ? match[1] : "";
      const activity = activities.find((a) => a.id === id);
      if (!activity) {
        return { code: 404, message: "\u6D3B\u52A8\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      return successResponse(activity);
    }
  },
  /**
   * 报名参加活动
   * POST /api/activities/:id/register
   */
  {
    url: /\/api\/activities\/(\w+)\/register$/,
    method: "post",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/activities\/(\w+)\/register$/);
      const id = match ? match[1] : "";
      const activity = activities.find((a) => a.id === id);
      if (!activity) {
        return { code: 404, message: "\u6D3B\u52A8\u4E0D\u5B58\u5728", data: null, timestamp: Date.now() };
      }
      if (activity.currentParticipants >= activity.maxParticipants) {
        return { code: 400, message: "\u540D\u989D\u5DF2\u6EE1", data: null, timestamp: Date.now() };
      }
      activity.currentParticipants++;
      if (!activity.registrants) {
        activity.registrants = [];
      }
      activity.registrants.push({
        userId: "user001",
        userName: currentUser.nickname,
        userAvatar: currentUser.avatar,
        registeredAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      return successResponse({ message: "\u62A5\u540D\u6210\u529F", remaining: activity.maxParticipants - activity.currentParticipants });
    }
  },
  /**
   * 获取活动分类统计
   * GET /api/activities/categories
   */
  {
    url: "/api/activities/categories",
    method: "get",
    response: () => {
      const categories2 = [
        { key: "sports", label: "\u4F53\u80B2\u8FD0\u52A8", count: activities.filter((a) => a.category === "sports").length },
        { key: "entertainment", label: "\u6587\u5A31\u6D3B\u52A8", count: activities.filter((a) => a.category === "entertainment").length },
        { key: "academic", label: "\u5B66\u672F\u8BB2\u5EA7", count: activities.filter((a) => a.category === "academic").length },
        { key: "volunteer", label: "\u5FD7\u613F\u670D\u52A1", count: activities.filter((a) => a.category === "volunteer").length },
        { key: "culture", label: "\u6587\u5316\u6D3B\u52A8", count: activities.filter((a) => a.category === "culture").length },
        { key: "career", label: "\u804C\u4E1A\u53D1\u5C55", count: activities.filter((a) => a.category === "career").length }
      ];
      return successResponse(categories2);
    }
  },
  // ==================== 首页数据聚合接口 ====================
  /**
   * 获取首页所需的所有数据（减少请求次数）
   * GET /api/home/data
   */
  {
    url: "/api/home/data",
    method: "get",
    response: () => {
      const homeData = {
        // 轮播图/Banner
        banners: [
          { id: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=400&fit=crop", title: "\u5F00\u5B66\u5B63\u7279\u60E0 \u6EE1100\u51CF20", link: "/products?promotion=spring" },
          { id: 2, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop", title: "\u6625\u5B63\u8FD0\u52A8\u4F1A\u62A5\u540D\u4E2D", link: "/activities/act1" },
          { id: 3, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=400&fit=crop", title: "\u6570\u7801\u4EA7\u54C1\u9650\u65F6\u6298\u6263", link: "/products?category=cat1" }
        ],
        // 热门商品
        hotProducts: products.slice(0, 8),
        // 推荐商家
        recommendMerchants: merchants.slice(0, 4),
        // 最新帖子
        latestPosts: forumPosts.slice(0, 5),
        // 即将开始的活动
        upcomingActivities: activities.filter((a) => a.status === "upcoming").sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).slice(0, 3),
        // 最新二手
        latestSecondHand: secondHandItems.slice(0, 6)
      };
      return successResponse(homeData);
    }
  },
  /**
   * 搜索接口（全局搜索）
   * GET /api/search?keyword=&type=&page=1&pageSize=10
   */
  {
    url: "/api/search",
    method: "get",
    response: ({ query }) => {
      const keyword = query.keyword?.toLowerCase();
      const type = query.type;
      const page = parseInt(query.page || "1");
      const pageSize = parseInt(query.pageSize || "10");
      if (!keyword) {
        return successResponse({ results: [], total: 0 });
      }
      const results = [];
      if (!type || type === "product") {
        const matchedProducts = products.filter(
          (p) => p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword) || p.tags.some((t) => t.toLowerCase().includes(keyword))
        ).map((p) => ({ type: "product", ...p }));
        results.push(...matchedProducts);
      }
      if (!type || type === "secondhand") {
        const matchedSecondHand = secondHandItems.filter(
          (item) => item.title.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword)
        ).map((item) => ({ type: "secondhand", ...item }));
        results.push(...matchedSecondHand);
      }
      if (!type || type === "post") {
        const matchedPosts = forumPosts.filter(
          (p) => p.title.toLowerCase().includes(keyword) || p.content.toLowerCase().includes(keyword)
        ).map((p) => ({ type: "post", ...p }));
        results.push(...matchedPosts);
      }
      if (!type || type === "merchant") {
        const matchedMerchants = merchants.filter(
          (m) => m.name.toLowerCase().includes(keyword) || m.tags.some((t) => t.toLowerCase().includes(keyword))
        ).map((m) => ({ type: "merchant", ...m }));
        results.push(...matchedMerchants);
      }
      const total = results.length;
      const paginatedResults = results.slice((page - 1) * pageSize, page * pageSize);
      return successResponse({
        list: paginatedResults,
        total,
        page,
        pageSize
      });
    }
  },
  /**
   * 用户登录
   * POST /api/auth/login
   */
  {
    url: "/api/auth/login",
    method: "post",
    response: ({ body }) => {
      const identifier = body.account || body.studentId || body.username || "";
      const password = body.password || "";
      if ((identifier === "admin" || identifier === "admin@usth.edu.cn") && password === "admin123") {
        return successResponse({
          token: "mock-admin-token-" + Date.now(),
          user: { ...currentUser, role: "admin", nickname: "\u7BA1\u7406\u5458" }
        });
      }
      if (body.studentId && /^\d{10,15}$/.test(body.studentId)) {
        return successResponse({
          token: "mock-student-token-" + Date.now(),
          user: {
            ...currentUser,
            studentId: body.studentId,
            nickname: "\u5B66\u751F" + body.studentId.slice(-4)
          }
        });
      }
      return successResponse({
        token: "mock-user-token-" + Date.now(),
        user: currentUser
      });
    }
  },
  /**
   * 用户注册
   * POST /api/auth/register
   */
  {
    url: "/api/auth/register",
    method: "post",
    response: ({ body }) => {
      return successResponse({
        message: "\u6CE8\u518C\u6210\u529F",
        user: {
          id: "user" + Date.now(),
          username: body.username,
          nickname: body.nickname || body.username,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
          role: "user",
          status: "active",
          balance: 0,
          points: 0,
          level: 1,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    }
  },
  /**
   * 获取通知消息列表
   * GET /api/notifications?page=1&pageSize=10&type=
   */
  {
    url: "/api/notifications",
    method: "get",
    response: ({ query }) => {
      const page = parseInt(query.page || "1");
      const pageSize = parseInt(query.pageSize || "10");
      const notifications = [
        {
          id: "noti1",
          type: "order",
          title: "\u8BA2\u5355\u5DF2\u53D1\u8D27",
          content: "\u60A8\u7684\u8BA2\u5355 HK20260413001 \u5DF2\u53D1\u8D27\uFF0C\u9884\u8BA14\u670815\u65E5\u9001\u8FBE\u3002\u7269\u6D41\u5355\u53F7\uFF1ASF1234567890\uFF0C\u8BF7\u7559\u610F\u67E5\u6536\u3002",
          isRead: false,
          createdAt: new Date(Date.now() - 10 * 6e4).toISOString(),
          orderId: "order001"
        },
        {
          id: "noti2",
          type: "promo",
          title: "\u65B0\u7528\u6237\u4E13\u4EAB\u798F\u5229",
          content: "\u606D\u559C\uFF01\u60A8\u7684\u65B0\u4EBA\u4F18\u60E0\u5238\u5DF2\u5230\u8D26\uFF0C\u6EE199\u51CF20\u3001\u6EE1299\u51CF50\uFF0C\u5FEB\u53BB\u4F7F\u7528\u5427~\u4F18\u60E0\u5238\u6709\u6548\u671F\u81F34\u670830\u65E5\u3002",
          isRead: false,
          createdAt: new Date(Date.now() - 30 * 6e4).toISOString()
        },
        {
          id: "noti3",
          type: "system",
          title: "\u8D26\u6237\u5B89\u5168\u63D0\u9192",
          content: "\u68C0\u6D4B\u5230\u60A8\u7684\u8D26\u53F7\u5728\u65B0\u8BBE\u5907\u4E0A\u767B\u5F55\uFF0C\u5982\u975E\u672C\u4EBA\u64CD\u4F5C\u8BF7\u53CA\u65F6\u4FEE\u6539\u5BC6\u7801\u3002\u767B\u5F55\u65F6\u95F4\uFF1A2026-04-13 10:30\uFF0CIP\uFF1A192.168.1.1",
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 36e5).toISOString()
        },
        {
          id: "noti4",
          type: "community",
          title: "\u6709\u4EBA\u56DE\u590D\u4E86\u4F60\u7684\u5E16\u5B50",
          content: '\u5728\u300C\u5206\u4EAB\u4E00\u4E2A\u8D85\u597D\u7528\u7684\u5B66\u4E60APP\u300D\u4E0B\uFF0C\u7528\u6237@\u4EE3\u7801\u4FA0 \u56DE\u590D\u4E86\u4F60\u7684\u8BC4\u8BBA\uFF1A"\u8C22\u8C22\u5206\u4EAB\uFF0C\u786E\u5B9E\u5F88\u597D\u7528\uFF01"',
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 36e5).toISOString(),
          postId: "post001",
          senderId: "user002",
          senderName: "\u4EE3\u7801\u4FA0"
        },
        {
          id: "noti5",
          type: "order",
          title: "\u8BA2\u5355\u5DF2\u5B8C\u6210",
          content: "\u60A8\u7684\u8BA2\u5355 HK20260410003 \u5DF2\u5B8C\u6210\uFF0C\u611F\u8C22\u60A8\u7684\u8D2D\u4E70\uFF01\u6B22\u8FCE\u8BC4\u4EF7\u5546\u54C1\uFF0C\u5206\u4EAB\u60A8\u7684\u4F7F\u7528\u4F53\u9A8C\u3002",
          isRead: true,
          createdAt: new Date(Date.now() - 3 * 24 * 36e5).toISOString(),
          orderId: "order003"
        },
        {
          id: "noti6",
          type: "promo",
          title: "\u9650\u65F6\u79D2\u6740\u6D3B\u52A8\u5F00\u59CB",
          content: "\u60A8\u5173\u6CE8\u7684\u5546\u54C1\u300C\u84DD\u7259\u8033\u673A\u300D\u6B63\u5728\u53C2\u4E0E\u9650\u65F6\u79D2\u6740\uFF0C\u539F\u4EF7199\u5143\uFF0C\u79D2\u6740\u4EF7\u4EC5\u970099\u5143\uFF0C\u9650\u91CF100\u4EF6\uFF01",
          isRead: true,
          createdAt: new Date(Date.now() - 5 * 24 * 36e5).toISOString()
        },
        {
          id: "noti7",
          type: "system",
          title: "\u7CFB\u7EDF\u7EF4\u62A4\u901A\u77E5",
          content: "\u7CFB\u7EDF\u5C06\u4E8E\u4ECA\u665A\u51CC\u66682:00-4:00\u8FDB\u884C\u4F8B\u884C\u7EF4\u62A4\uFF0C\u671F\u95F4\u90E8\u5206\u529F\u80FD\u53EF\u80FD\u65E0\u6CD5\u4F7F\u7528\uFF0C\u8BF7\u63D0\u524D\u505A\u597D\u51C6\u5907\u3002",
          isRead: true,
          createdAt: new Date(Date.now() - 7 * 24 * 36e5).toISOString()
        },
        {
          id: "noti8",
          type: "community",
          title: "\u60A8\u7684\u5E16\u5B50\u88AB\u70B9\u8D5E",
          content: "\u7528\u6237@\u5B66\u9738\u5C0F\u738B \u70B9\u8D5E\u4E86\u60A8\u7684\u5E16\u5B50\u300C\u671F\u672B\u590D\u4E60\u8D44\u6599\u5206\u4EAB\u300D\uFF0C\u76EE\u524D\u5DF2\u6709128\u4EBA\u70B9\u8D5E\u3002",
          isRead: true,
          createdAt: new Date(Date.now() - 10 * 24 * 36e5).toISOString(),
          postId: "post002",
          senderId: "user003",
          senderName: "\u5B66\u9738\u5C0F\u738B"
        }
      ];
      return successResponse(notifications);
    }
  },
  /**
   * 标记消息已读
   * POST /api/notifications/:id/read
   */
  {
    url: /\/api\/notifications\/(\w+)\/read$/,
    method: "post",
    response: (config) => {
      return successResponse({ message: "\u5DF2\u6807\u8BB0\u4E3A\u5DF2\u8BFB" });
    }
  },
  /**
   * 标记全部已读
   * POST /api/notifications/read-all
   */
  {
    url: "/api/notifications/read-all",
    method: "post",
    response: () => {
      return successResponse({ message: "\u5DF2\u5168\u90E8\u6807\u8BB0\u4E3A\u5DF2\u8BFB" });
    }
  },
  /**
   * 获取未读消息数量
   * GET /api/notifications/unread-count
   */
  {
    url: "/api/notifications/unread-count",
    method: "get",
    response: () => {
      return successResponse(3);
    }
  },
  // ==================== 收藏相关接口 ====================
  /**
   * 获取收藏列表
   * GET /api/favorites?type=&page=1
   */
  {
    url: "/api/favorites",
    method: "get",
    response: ({ query }) => {
      const page = parseInt(query.page || "1");
      const pageSize = 10;
      const promotions = ["\u4E701\u90011\u4EF6\u793C", "\u6EE1100\u51CF20", "\u9650\u65F6\u7279\u60E0", "", "", ""];
      const shopNames = ["\u534E\u4E3A\u5B98\u65B9\u65D7\u8230\u5E97", "\u5C0F\u7C73\u4E4B\u5BB6", "\u7F8E\u5986\u4E13\u8425\u5E97", "\u8FD0\u52A8\u6237\u5916\u5E97", "\u56FE\u4E66\u6587\u5177\u5E97", "\u98DF\u54C1\u751F\u9C9C\u5E97"];
      const favorites = products.slice(0, 6).map((product, index) => ({
        id: `fav${String(index + 1).padStart(3, "0")}`,
        type: "product",
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        soldCount: product.sales,
        createdAt: new Date(Date.now() - index * 864e5).toISOString(),
        promotion: promotions[index] || "",
        shopName: shopNames[index] || "\u5B98\u65B9\u5E97\u94FA",
        shopId: `shop${index + 1}`,
        status: index === 2 ? "low_stock" : index === 4 ? "invalid" : "normal"
      }));
      return successResponse({
        list: favorites,
        total: favorites.length
      });
    }
  },
  /**
   * 删除收藏
   * DELETE /api/favorites/:id
   */
  {
    url: /\/api\/favorites\/(\w+)$/,
    method: "delete",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/favorites\/(\w+)$/);
      const id = match ? match[1] : "";
      return successResponse({ message: "\u53D6\u6D88\u6536\u85CF\u6210\u529F", id });
    }
  },
  /**
   * 添加收藏
   * POST /api/favorites
   */
  {
    url: "/api/favorites",
    method: "post",
    response: ({ body }) => {
      return successResponse({
        id: "fav" + Date.now(),
        type: body.type || "product",
        itemId: body.itemId,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        message: "\u6536\u85CF\u6210\u529F"
      });
    }
  },
  // ==================== 购物车相关接口 ====================
  /**
   * 获取购物车列表
   * GET /api/cart
   */
  {
    url: "/api/cart",
    method: "get",
    response: () => {
      const cartItems2 = products.slice(0, 3).map((product, index) => ({
        id: `cart${String(index + 1).padStart(3, "0")}`,
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: Math.floor(Math.random() * 3) + 1,
        selected: index < 2,
        stock: product.stock,
        status: "valid"
      }));
      return successResponse({
        items: cartItems2,
        totalAmount: cartItems2.reduce((sum, item) => sum + item.price * item.quantity, 0),
        totalCount: cartItems2.reduce((sum, item) => sum + item.quantity, 0),
        selectedCount: cartItems2.filter((i) => i.selected).reduce((sum, item) => sum + item.quantity, 0),
        selectedAmount: cartItems2.filter((i) => i.selected).reduce((sum, item) => sum + item.price * item.quantity, 0)
      });
    }
  },
  /**
   * 添加商品到购物车
   * POST /api/cart
   */
  {
    url: "/api/cart",
    method: "post",
    response: ({ body }) => {
      return successResponse({
        id: "cart" + Date.now(),
        productId: body.productId,
        quantity: body.quantity || 1,
        selected: true,
        message: "\u6DFB\u52A0\u6210\u529F"
      });
    }
  },
  /**
   * 更新购物车商品
   * PUT /api/cart/:itemId
   */
  {
    url: /\/api\/cart\/(\w+)$/,
    method: "put",
    response: (config, { body }) => {
      const url = config.url;
      const match = url.match(/\/api\/cart\/(\w+)$/);
      const itemId = match ? match[1] : "";
      return successResponse({
        id: itemId,
        quantity: body.quantity,
        selected: body.selected,
        message: "\u66F4\u65B0\u6210\u529F"
      });
    }
  },
  /**
   * 删除购物车商品
   * DELETE /api/cart/:itemId
   */
  {
    url: /\/api\/cart\/(\w+)$/,
    method: "delete",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/cart\/(\w+)$/);
      const itemId = match ? match[1] : "";
      return successResponse({ message: "\u5220\u9664\u6210\u529F", id: itemId });
    }
  },
  /**
   * 批量删除购物车商品
   * POST /api/cart/batch-remove
   */
  {
    url: "/api/cart/batch-remove",
    method: "post",
    response: ({ body }) => {
      return successResponse({
        message: "\u6279\u91CF\u5220\u9664\u6210\u529F",
        deletedCount: body.itemIds?.length || 0
      });
    }
  },
  /**
   * 全选/取消全选购物车商品
   * POST /api/cart/select-all
   */
  {
    url: "/api/cart/select-all",
    method: "post",
    response: ({ body }) => {
      return successResponse({
        message: body.selected ? "\u5168\u9009\u6210\u529F" : "\u53D6\u6D88\u5168\u9009\u6210\u529F",
        selected: body.selected
      });
    }
  },
  /**
   * 将购物车商品移入收藏夹
   * POST /api/cart/:itemId/move-favorite
   */
  {
    url: /\/api\/cart\/(\w+)\/move-favorite$/,
    method: "post",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/cart\/(\w+)\/move-favorite$/);
      const itemId = match ? match[1] : "";
      return successResponse({
        message: "\u5DF2\u79FB\u5165\u6536\u85CF\u5939",
        itemId,
        favoriteId: "fav" + Date.now()
      });
    }
  },
  /**
   * 清空购物车
   * DELETE /api/cart/clear
   */
  {
    url: "/api/cart/clear",
    method: "delete",
    response: () => {
      return successResponse({ message: "\u8D2D\u7269\u8F66\u5DF2\u6E05\u7A7A" });
    }
  },
  // ==================== 优惠券相关接口 ====================
  /**
   * 获取优惠券列表
   * GET /api/coupons?status=&page=
   */
  {
    url: "/api/coupons",
    method: "get",
    response: ({ query }) => {
      const status = query.status || "available";
      const page = parseInt(query.page || "1");
      const pageSize = parseInt(query.pageSize || "10");
      const coupons = [
        {
          id: "coupon001",
          code: "NEWUSER2026",
          name: "\u65B0\u7528\u6237\u4E13\u4EAB\u5238",
          type: "cash",
          value: 20,
          minOrder: 100,
          status: "available",
          validFrom: "2026-01-01T00:00:00Z",
          validTo: "2026-12-31T23:59:59Z",
          description: "\u65B0\u7528\u6237\u6CE8\u518C\u5373\u53EF\u9886\u53D6",
          scope: "\u5168\u573A\u901A\u7528"
        },
        {
          id: "coupon002",
          code: "FOOD50",
          name: "\u98DF\u54C1\u751F\u9C9C\u5238",
          type: "cash",
          value: 10,
          minOrder: 50,
          status: "available",
          validFrom: "2026-04-01T00:00:00Z",
          validTo: "2026-04-30T23:59:59Z",
          description: "\u9650\u98DF\u54C1\u751F\u9C9C\u7C7B\u5546\u54C1\u4F7F\u7528",
          scope: "\u98DF\u54C1\u751F\u9C9C"
        },
        {
          id: "coupon003",
          code: "DIGITAL200",
          name: "\u6570\u7801\u5BB6\u7535\u5238",
          type: "cash",
          value: 100,
          minOrder: 1e3,
          status: "available",
          validFrom: "2026-04-01T00:00:00Z",
          validTo: "2026-05-15T23:59:59Z",
          description: "\u9650\u6570\u7801\u5BB6\u7535\u7C7B\u5546\u54C1\u4F7F\u7528",
          scope: "\u6570\u7801\u5BB6\u7535"
        },
        {
          id: "coupon004",
          code: "FREESHIP",
          name: "\u514D\u8FD0\u8D39\u5238",
          type: "free_shipping",
          value: 0,
          minOrder: 0,
          status: "available",
          validFrom: "2026-04-01T00:00:00Z",
          validTo: "2026-04-20T23:59:59Z",
          description: "\u5168\u573A\u514D\u8FD0\u8D39",
          scope: "\u5168\u573A\u901A\u7528"
        },
        {
          id: "coupon005",
          code: "DISCOUNT85",
          name: "85\u6298\u6298\u6263\u5238",
          type: "discount",
          value: 8.5,
          minOrder: 200,
          status: "used",
          validFrom: "2026-03-01T00:00:00Z",
          validTo: "2026-03-31T23:59:59Z",
          description: "\u5168\u573A\u5546\u54C185\u6298",
          scope: "\u5168\u573A\u901A\u7528",
          usedAt: "2026-03-15T10:30:00Z"
        },
        {
          id: "coupon006",
          code: "SPRING30",
          name: "\u6625\u5B63\u7279\u60E0\u5238",
          type: "cash",
          value: 30,
          minOrder: 150,
          status: "expired",
          validFrom: "2026-03-01T00:00:00Z",
          validTo: "2026-03-31T23:59:59Z",
          description: "\u6625\u5B63\u9650\u65F6\u7279\u60E0",
          scope: "\u5168\u573A\u901A\u7528"
        }
      ];
      let filteredCoupons = coupons;
      if (status && status !== "all") {
        filteredCoupons = coupons.filter((c) => c.status === status);
      }
      return successResponse(paginate(filteredCoupons, page, pageSize));
    }
  },
  /**
   * 领取优惠券
   * POST /api/coupons/:id/claim
   */
  {
    url: /\/api\/coupons\/(\w+)\/claim$/,
    method: "post",
    response: (config) => {
      const url = config.url;
      const match = url.match(/\/api\/coupons\/(\w+)\/claim$/);
      const id = match ? match[1] : "";
      return successResponse({
        message: "\u9886\u53D6\u6210\u529F",
        couponId: id,
        claimedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  },
  // ==================== 用户头像上传接口 ====================
  /**
   * 上传用户头像
   * POST /api/user/avatar
   */
  {
    url: "/api/user/avatar",
    method: "post",
    response: (req) => {
      const timestamp = Date.now();
      const seed = `user_${timestamp}`;
      return successResponse({
        url: `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&size=200&backgroundColor=b6e3f4`,
        message: "\u5934\u50CF\u4E0A\u4F20\u6210\u529F"
      });
    }
  },
  // ==================== 用户统计接口 ====================
  /**
   * 获取用户个人统计数据
   * GET /api/user/statistics
   */
  {
    url: "/api/user/statistics",
    method: "get",
    response: () => {
      return successResponse({
        postsCount: Math.floor(Math.random() * 50),
        likesReceived: Math.floor(Math.random() * 200),
        ordersCompleted: Math.floor(Math.random() * 30),
        creditScore: 5,
        growthValue: 2680,
        level: "\u9ED1\u79D1\u5927\u5728\u6821\u751F"
      });
    }
  },
  // ==================== 缴费相关接口 ====================
  /**
   * 获取缴费项目列表
   * GET /api/payment/items
   */
  {
    url: "/api/payment/items",
    method: "get",
    response: () => {
      return successResponse([
        {
          id: "item001",
          name: "2024\u5E74\u6625\u5B63\u5B66\u8D39",
          amount: 5500,
          deadline: "2024-03-01",
          type: "tuition",
          status: "unpaid",
          description: "2024\u5E74\u6625\u5B63\u5B66\u671F\u5B66\u8D39"
        },
        {
          id: "item002",
          name: "\u4F4F\u5BBF\u8D39",
          amount: 1200,
          deadline: "2024-03-01",
          type: "accommodation",
          status: "paid",
          paidAt: "2024-02-15",
          description: "2024\u5E74\u6625\u5B63\u5B66\u671F\u4F4F\u5BBF\u8D39"
        },
        {
          id: "item003",
          name: "\u6559\u6750\u8D39",
          amount: 350,
          deadline: "2024-03-10",
          type: "material",
          status: "unpaid",
          description: "2024\u5E74\u6625\u5B63\u5B66\u671F\u6559\u6750\u8D39"
        },
        {
          id: "item004",
          name: "\u4FDD\u9669\u8D39",
          amount: 100,
          deadline: "2024-03-15",
          type: "insurance",
          status: "unpaid",
          description: "2024\u5E74\u5EA6\u5B66\u751F\u4FDD\u9669"
        }
      ]);
    }
  },
  /**
   * 获取单个缴费项目
   * GET /api/payment/items/:id
   */
  {
    url: "/api/payment/items/:id",
    method: "get",
    response: (req) => {
      const { id } = req.params;
      return successResponse({
        id,
        name: "\u7F34\u8D39\u9879\u76EE " + id,
        amount: Math.floor(Math.random() * 5e3) + 500,
        deadline: "2024-03-01",
        type: "tuition",
        status: "unpaid",
        description: "\u7F34\u8D39\u9879\u76EE\u8BE6\u60C5"
      });
    }
  },
  /**
   * 创建缴费订单
   * POST /api/payment/create
   */
  {
    url: "/api/payment/create",
    method: "post",
    response: () => {
      return successResponse({
        paymentUrl: "https://mock-payment.example.com/pay/" + Date.now(),
        orderId: "ORD" + Date.now()
      });
    }
  },
  /**
   * 查询缴费状态
   * GET /api/payment/status/:orderId
   */
  {
    url: "/api/payment/status/:orderId",
    method: "get",
    response: () => {
      return successResponse({
        status: "pending",
        paidAt: null
      });
    }
  },
  /**
   * 获取缴费记录
   * GET /api/payment/records
   */
  {
    url: "/api/payment/records",
    method: "get",
    response: () => {
      return successResponse([
        {
          id: "rec001",
          itemName: "2023\u5E74\u79CB\u5B63\u5B66\u8D39",
          amount: 5500,
          paidAt: "2023-09-01",
          method: "alipay",
          status: "success"
        },
        {
          id: "rec002",
          itemName: "2023\u5E74\u79CB\u5B63\u4F4F\u5BBF\u8D39",
          amount: 1200,
          paidAt: "2023-09-01",
          method: "wechat",
          status: "success"
        },
        {
          id: "rec003",
          itemName: "\u6559\u6750\u8D39",
          amount: 280,
          paidAt: "2023-09-05",
          method: "alipay",
          status: "success"
        }
      ]);
    }
  },
  /**
   * 获取缴费汇总
   * GET /api/payment/summary
   */
  {
    url: "/api/payment/summary",
    method: "get",
    response: () => {
      return successResponse({
        totalAmount: 7150,
        paidAmount: 1200,
        unpaidAmount: 5950,
        overdueAmount: 0,
        itemCount: 4,
        paidCount: 1,
        unpaidCount: 3
      });
    }
  },
  /**
   * 提交绿色通道申请
   * POST /api/payment/green-channel
   */
  {
    url: "/api/payment/green-channel",
    method: "post",
    response: (req) => {
      const data = req.body;
      return successResponse({
        id: "GC" + Date.now(),
        ...data,
        status: "pending",
        submittedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  },
  /**
   * 获取绿色通道申请记录
   * GET /api/payment/green-channel
   */
  {
    url: "/api/payment/green-channel",
    method: "get",
    response: () => {
      return successResponse([
        {
          id: "GC001",
          reason: "\u5BB6\u5EAD\u7ECF\u6D4E\u56F0\u96BE",
          amount: 5500,
          status: "approved",
          submittedAt: "2024-02-20",
          reviewedAt: "2024-02-22",
          reviewerComment: "\u5BA1\u6838\u901A\u8FC7\uFF0C\u8BF7\u6309\u65F6\u7F34\u8D39"
        }
      ]);
    }
  },
  // ==================== 用户资料更新接口 ====================
  /**
   * 更新用户资料
   * PUT /api/user/profile
   */
  {
    url: "/api/user/profile",
    method: "put",
    response: (req) => {
      const data = req.body;
      console.log("[Mock] Update profile:", data);
      return successResponse({
        id: 1,
        username: "student_2022020001",
        email: data.email || "zhangsan@usth.edu.cn",
        phone: data.phone || "138****8888",
        nickname: data.nickname || "\u5F20\u540C\u5B66",
        avatar: data.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=33&size=200",
        gender: data.gender || "male",
        birthday: data.birthday || "2000-01-01",
        studentId: "2022020001",
        school: data.school || "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F\u5B66\u9662",
        major: data.major || "\u8F6F\u4EF6\u5DE5\u7A0B",
        grade: data.grade || "2022\u7EA7",
        role: "user",
        status: "active",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  },
  // ==================== 验证码相关接口 ====================
  /**
   * 发送验证码
   * POST /api/auth/send-code
   */
  {
    url: "/api/auth/send-code",
    method: "post",
    response: (req) => {
      const { target, type } = req.body;
      console.log(`[Mock] \u53D1\u9001\u9A8C\u8BC1\u7801\u5230 ${target}, \u7C7B\u578B: ${type}`);
      return successResponse({
        message: "\u9A8C\u8BC1\u7801\u5DF2\u53D1\u9001",
        target,
        type
      });
    }
  },
  /**
   * 验证验证码
   * POST /api/auth/verify-code
   */
  {
    url: "/api/auth/verify-code",
    method: "post",
    response: (req) => {
      const { target, code } = req.body;
      console.log(`[Mock] \u9A8C\u8BC1\u9A8C\u8BC1\u7801: ${target}, \u7801: ${code}`);
      const isValid = code && code.length === 6 && /^\d{6}$/.test(code);
      return successResponse({
        verified: isValid,
        message: isValid ? "\u9A8C\u8BC1\u6210\u529F" : "\u9A8C\u8BC1\u7801\u9519\u8BEF"
      });
    }
  },
  // ==================== 安全设置相关接口 ====================
  /**
   * 绑定手机号
   * POST /api/user/security/bind-phone
   */
  {
    url: "/api/user/security/bind-phone",
    method: "post",
    response: (req) => {
      const { phone, code } = req.body;
      console.log(`[Mock] \u7ED1\u5B9A\u624B\u673A\u53F7: ${phone}, \u9A8C\u8BC1\u7801: ${code}`);
      return successResponse({
        message: "\u624B\u673A\u53F7\u7ED1\u5B9A\u6210\u529F",
        phone
      });
    }
  },
  /**
   * 绑定邮箱
   * POST /api/user/security/bind-email
   */
  {
    url: "/api/user/security/bind-email",
    method: "post",
    response: (req) => {
      const { email, code } = req.body;
      console.log(`[Mock] \u7ED1\u5B9A\u90AE\u7BB1: ${email}, \u9A8C\u8BC1\u7801: ${code}`);
      return successResponse({
        message: "\u90AE\u7BB1\u7ED1\u5B9A\u6210\u529F",
        email
      });
    }
  }
];
export {
  index_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21vY2svc3JjL21vY2svc3JjL21vY2svc3JjL21vY2svaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiRTpcXFxcUHJvZ3JhbSBGaWxlXFxcXEhLWUdcXFxcaGVpa2VqaS1tYWxsXFxcXGhlaWtlamktd2ViXFxcXHNyY1xcXFxtb2NrXFxcXGluZGV4LnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIkU6XFxcXFByb2dyYW0gRmlsZVxcXFxIS1lHXFxcXGhlaWtlamktbWFsbFxcXFxoZWlrZWppLXdlYlxcXFxzcmNcXFxcbW9ja1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vRTovUHJvZ3JhbSUyMEZpbGUvSEtZRy9oZWlrZWppLW1hbGwvaGVpa2VqaS13ZWIvc3JjL21vY2svaW5kZXgudHNcIjsvKipcclxuICogXHU5RUQxXHU3OUQxXHU1OTI3XHU1NTQ2XHU1N0NFIC0gTW9jayBcdTY1NzBcdTYzNkVcdTdCQTFcdTc0MDZcdTU2NjhcclxuICpcclxuICogXHU2NzJDXHU2NTg3XHU0RUY2XHU2M0QwXHU0RjlCXHU1QjhDXHU2NTc0XHU3Njg0XHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU2QTIxXHU2MkRGXHU2NTcwXHU2MzZFXHVGRjBDXHU1MzA1XHU1NDJCXHU2MjQwXHU2NzA5XHU0RTFBXHU1MkExXHU2QTIxXHU1NzU3XHJcbiAqIFx1NEY3Rlx1NzUyOFx1NTczQVx1NjY2Rlx1RkYxQVx1NTI0RFx1N0FFRlx1NUYwMFx1NTNEMVx1MzAwMVx1NkQ0Qlx1OEJENVx1MzAwMVx1NkYxNFx1NzkzQVxyXG4gKlxyXG4gKiBcdTZDRThcdTYxMEZcdUZGMUFcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdThCRjdcdTc5RkJcdTk2NjRcdTZCNjRcdTY1ODdcdTRFRjZcdTYyMTZcdTc5ODFcdTc1MjggbW9jayBcdTYyRTZcdTYyMkFcdTU2NjhcclxuICovXHJcblxyXG4vLyBpbXBvcnQgeyBNb2NrTWV0aG9kIH0gZnJvbSAndml0ZS1wbHVnaW4tbW9jaycgLy8gXHU1REYyXHU3OTgxXHU3NTI4XHVGRjFBXHU2QTIxXHU1NzU3XHU2NzJBXHU1Qjg5XHU4OEM1XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PSBcdTY3MkNcdTU3MzBcdTdDN0JcdTU3OEJcdTVCOUFcdTRFNDkgPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKiBNb2NrIFx1NjVCOVx1NkNENVx1OTE0RFx1N0Y2RVx1RkYwOFx1N0I4MFx1NTMxNlx1NzI0OFx1RkYwQ1x1NTE3Q1x1NUJCOSB2aXRlLXBsdWdpbi1tb2NrXHVGRjA5ICovXHJcbmludGVyZmFjZSBNb2NrTWV0aG9kIHtcclxuICB1cmw6IHN0cmluZ1xyXG4gIG1ldGhvZD86ICdnZXQnIHwgJ3Bvc3QnIHwgJ3B1dCcgfCAnZGVsZXRlJyB8ICdwYXRjaCdcclxuICByZXNwb25zZTogKCguLi5hcmdzOiBhbnlbXSkgPT4gYW55KVxyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PSBcdTdDN0JcdTU3OEJcdTVCOUFcdTRFNDkgPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKiBcdTU1NDZcdTU0QzFcdTUyMDZcdTdDN0IgKi9cclxuaW50ZXJmYWNlIENhdGVnb3J5IHtcclxuICBpZDogc3RyaW5nXHJcbiAgbmFtZTogc3RyaW5nXHJcbiAgaWNvbjogc3RyaW5nXHJcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmdcclxufVxyXG5cclxuLyoqIFx1NTU0Nlx1NTRDMVx1NEZFMVx1NjA2RiAqL1xyXG5pbnRlcmZhY2UgUHJvZHVjdCB7XHJcbiAgaWQ6IHN0cmluZ1xyXG4gIG5hbWU6IHN0cmluZ1xyXG4gIGNhdGVnb3J5SWQ6IHN0cmluZ1xyXG4gIHByaWNlOiBudW1iZXJcclxuICBvcmlnaW5hbFByaWNlOiBudW1iZXJcclxuICBpbWFnZTogc3RyaW5nXHJcbiAgaW1hZ2VzOiBzdHJpbmdbXVxyXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmdcclxuICBkZXRhaWw6IHN0cmluZ1xyXG4gIHN0b2NrOiBudW1iZXJcclxuICBzYWxlczogbnVtYmVyXHJcbiAgcmF0aW5nOiBudW1iZXJcclxuICByZXZpZXdDb3VudDogbnVtYmVyXHJcbiAgc3RhdHVzOiAnb25fc2FsZScgfCAnb2ZmX3NhbGUnIHwgJ291dF9vZl9zdG9jaydcclxuICB0YWdzOiBzdHJpbmdbXVxyXG4gIGNyZWF0ZWRBdDogc3RyaW5nXHJcbiAgdXBkYXRlZEF0OiBzdHJpbmdcclxufVxyXG5cclxuLyoqIFx1OEJBMlx1NTM1NVx1NzJCNlx1NjAwMSAqL1xyXG50eXBlIE9yZGVyU3RhdHVzID0gJ3BlbmRpbmcnIHwgJ3BhaWQnIHwgJ3NoaXBwZWQnIHwgJ2RlbGl2ZXJlZCcgfCAnY29tcGxldGVkJyB8ICdjYW5jZWxsZWQnIHwgJ3JlZnVuZGluZydcclxuXHJcbi8qKiBcdThCQTJcdTUzNTVcdTk4NzkgKi9cclxuaW50ZXJmYWNlIE9yZGVySXRlbSB7XHJcbiAgcHJvZHVjdElkOiBzdHJpbmdcclxuICBwcm9kdWN0TmFtZTogc3RyaW5nXHJcbiAgcHJvZHVjdEltYWdlOiBzdHJpbmdcclxuICBwcmljZTogbnVtYmVyXHJcbiAgcXVhbnRpdHk6IG51bWJlclxyXG4gIHN1YnRvdGFsOiBudW1iZXJcclxufVxyXG5cclxuLyoqIFx1OEJBMlx1NTM1NVx1NEZFMVx1NjA2RiAqL1xyXG5pbnRlcmZhY2UgT3JkZXIge1xyXG4gIGlkOiBzdHJpbmdcclxuICBvcmRlck5vOiBzdHJpbmdcclxuICB1c2VySWQ6IHN0cmluZ1xyXG4gIGl0ZW1zOiBPcmRlckl0ZW1bXVxyXG4gIHRvdGFsQW1vdW50OiBudW1iZXJcclxuICBkaXNjb3VudEFtb3VudDogbnVtYmVyXHJcbiAgZnJlaWdodEFtb3VudDogbnVtYmVyXHJcbiAgcGF5QW1vdW50OiBudW1iZXJcclxuICBzdGF0dXM6IE9yZGVyU3RhdHVzXHJcbiAgcGF5bWVudE1ldGhvZD86IHN0cmluZ1xyXG4gIHBheW1lbnRUaW1lPzogc3RyaW5nXHJcbiAgc2hpcFRpbWU/OiBzdHJpbmdcclxuICBkZWxpdmVyVGltZT86IHN0cmluZ1xyXG4gIGNvbXBsZXRlVGltZT86IHN0cmluZ1xyXG4gIHJlY2VpdmVyTmFtZTogc3RyaW5nXHJcbiAgcmVjZWl2ZXJQaG9uZTogc3RyaW5nXHJcbiAgcmVjZWl2ZXJBZGRyZXNzOiBzdHJpbmdcclxuICByZW1hcms/OiBzdHJpbmdcclxuICBjcmVhdGVkQXQ6IHN0cmluZ1xyXG4gIHVwZGF0ZWRBdDogc3RyaW5nXHJcbn1cclxuXHJcbi8qKiBcdThEMkRcdTcyNjlcdThGNjZcdTk4NzkgLSBcdTdCMjZcdTU0MDggQ2FydFJlc3BvbnNlIFx1N0M3Qlx1NTc4QiAqL1xyXG5pbnRlcmZhY2UgQ2FydEl0ZW0ge1xyXG4gIGlkOiBzdHJpbmdcclxuICBwcm9kdWN0SWQ6IHN0cmluZ1xyXG4gIHByb2R1Y3Q6IHtcclxuICAgIGlkOiBzdHJpbmdcclxuICAgIG5hbWU6IHN0cmluZ1xyXG4gICAgaW1hZ2U6IHN0cmluZ1xyXG4gICAgcHJpY2U6IG51bWJlclxyXG4gICAgb3JpZ2luYWxQcmljZT86IG51bWJlclxyXG4gICAgc3RvY2s6IG51bWJlclxyXG4gICAgc3RhdHVzOiBzdHJpbmdcclxuICB9XHJcbiAgcXVhbnRpdHk6IG51bWJlclxyXG4gIHNlbGVjdGVkOiBib29sZWFuXHJcbiAgYWRkZWRBdDogc3RyaW5nXHJcbiAgdXBkYXRlZEF0Pzogc3RyaW5nXHJcbn1cclxuXHJcbi8qKiBcdTc1MjhcdTYyMzdcdTRGRTFcdTYwNkYgKi9cclxuaW50ZXJmYWNlIFVzZXIge1xyXG4gIGlkOiBzdHJpbmdcclxuICB1c2VybmFtZTogc3RyaW5nXHJcbiAgbmlja25hbWU6IHN0cmluZ1xyXG4gIGF2YXRhcjogc3RyaW5nXHJcbiAgZW1haWw6IHN0cmluZ1xyXG4gIHBob25lOiBzdHJpbmdcclxuICBnZW5kZXI6ICdtYWxlJyB8ICdmZW1hbGUnXHJcbiAgYmlydGhkYXk/OiBzdHJpbmdcclxuICBzdHVkZW50SWQ6IHN0cmluZ1xyXG4gIGNvbGxlZ2U6IHN0cmluZ1xyXG4gIG1ham9yOiBzdHJpbmdcclxuICBncmFkZTogc3RyaW5nXHJcbiAgcm9sZTogJ3VzZXInIHwgJ2FkbWluJyB8ICdtZXJjaGFudCdcclxuICBzdGF0dXM6ICdhY3RpdmUnIHwgJ2luYWN0aXZlJyB8ICdiYW5uZWQnXHJcbiAgYmFsYW5jZTogbnVtYmVyXHJcbiAgcG9pbnRzOiBudW1iZXJcclxuICBsZXZlbDogbnVtYmVyXHJcbiAgY3JlYXRlZEF0OiBzdHJpbmdcclxuICB1cGRhdGVkQXQ6IHN0cmluZ1xyXG59XHJcblxyXG4vKiogXHU2NTM2XHU4RDI3XHU1NzMwXHU1NzQwICovXHJcbmludGVyZmFjZSBBZGRyZXNzIHtcclxuICBpZDogc3RyaW5nXHJcbiAgdXNlcklkOiBzdHJpbmdcclxuICByZWNlaXZlck5hbWU6IHN0cmluZ1xyXG4gIHJlY2VpdmVyUGhvbmU6IHN0cmluZ1xyXG4gIHByb3ZpbmNlOiBzdHJpbmdcclxuICBjaXR5OiBzdHJpbmdcclxuICBkaXN0cmljdDogc3RyaW5nXHJcbiAgZGV0YWlsOiBzdHJpbmdcclxuICBmdWxsQWRkcmVzczogc3RyaW5nXHJcbiAgaXNEZWZhdWx0OiBib29sZWFuXHJcbiAgdGFnPzogc3RyaW5nXHJcbiAgY3JlYXRlZEF0OiBzdHJpbmdcclxufVxyXG5cclxuLyoqIFx1NTkxNlx1NTM1Nlx1NTU0Nlx1NUJCNiAqL1xyXG5pbnRlcmZhY2UgTWVyY2hhbnQge1xyXG4gIGlkOiBzdHJpbmdcclxuICBuYW1lOiBzdHJpbmdcclxuICBsb2dvOiBzdHJpbmdcclxuICBjb3ZlckltYWdlOiBzdHJpbmdcclxuICBjYXRlZ29yeTogc3RyaW5nXHJcbiAgcmF0aW5nOiBudW1iZXJcclxuICByZXZpZXdDb3VudDogbnVtYmVyXHJcbiAgbW9udGhseVNhbGVzOiBudW1iZXJcclxuICBkZWxpdmVyeVRpbWU6IHN0cmluZ1xyXG4gIGRlbGl2ZXJ5RmVlOiBudW1iZXJcclxuICBtaW5PcmRlckFtb3VudDogbnVtYmVyXHJcbiAgYWRkcmVzczogc3RyaW5nXHJcbiAgcGhvbmU6IHN0cmluZ1xyXG4gIG9wZW5UaW1lOiBzdHJpbmdcclxuICBjbG9zZVRpbWU6IHN0cmluZ1xyXG4gIHN0YXR1czogJ29wZW4nIHwgJ2Nsb3NlZCcgfCAnYnVzeSdcclxuICB0YWdzOiBzdHJpbmdbXVxyXG4gIGFubm91bmNlbWVudD86IHN0cmluZ1xyXG4gIGxhdGl0dWRlOiBudW1iZXJcclxuICBsb25naXR1ZGU6IG51bWJlclxyXG4gIGRpc3RhbmNlOiBudW1iZXJcclxufVxyXG5cclxuLyoqIFx1ODNEQ1x1NTRDMSAqL1xyXG5pbnRlcmZhY2UgRGlzaCB7XHJcbiAgaWQ6IHN0cmluZ1xyXG4gIG1lcmNoYW50SWQ6IHN0cmluZ1xyXG4gIG5hbWU6IHN0cmluZ1xyXG4gIGltYWdlOiBzdHJpbmdcclxuICBwcmljZTogbnVtYmVyXHJcbiAgb3JpZ2luYWxQcmljZT86IG51bWJlclxyXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmdcclxuICBjYXRlZ29yeTogc3RyaW5nXHJcbiAgc2FsZXM6IG51bWJlclxyXG4gIHJhdGluZzogbnVtYmVyXHJcbiAgc3RhdHVzOiAnYXZhaWxhYmxlJyB8ICdzb2xkX291dCcgfCAndW5hdmFpbGFibGUnXHJcbiAgdGFnczogc3RyaW5nW11cclxufVxyXG5cclxuLyoqIFx1NEU4Q1x1NjI0Qlx1NzI2OVx1NTRDMVx1NTIwNlx1N0M3QiAqL1xyXG5pbnRlcmZhY2UgU2Vjb25kSGFuZENhdGVnb3J5IHtcclxuICBpZDogc3RyaW5nXHJcbiAgbmFtZTogc3RyaW5nXHJcbiAgaWNvbjogc3RyaW5nXHJcbiAgY291bnQ6IG51bWJlclxyXG59XHJcblxyXG4vKiogXHU0RThDXHU2MjRCXHU3MjY5XHU1NEMxICovXHJcbmludGVyZmFjZSBTZWNvbmRIYW5kSXRlbSB7XHJcbiAgaWQ6IHN0cmluZ1xyXG4gIHNlbGxlcklkOiBzdHJpbmdcclxuICBzZWxsZXJOYW1lOiBzdHJpbmdcclxuICBzZWxsZXJBdmF0YXI6IHN0cmluZ1xyXG4gIHRpdGxlOiBzdHJpbmdcclxuICBkZXNjcmlwdGlvbjogc3RyaW5nXHJcbiAgaW1hZ2VzOiBzdHJpbmdbXVxyXG4gIGNhdGVnb3J5SWQ6IHN0cmluZ1xyXG4gIGNhdGVnb3J5TmFtZTogc3RyaW5nXHJcbiAgb3JpZ2luYWxQcmljZTogbnVtYmVyXHJcbiAgY3VycmVudFByaWNlOiBudW1iZXJcclxuICBjb25kaXRpb246ICdicmFuZF9uZXcnIHwgJ2FsbW9zdF9uZXcnIHwgJ2xpZ2h0bHlfdXNlZCcgfCAnbW9kZXJhdGVseV91c2VkJyB8ICdoZWF2aWx5X3VzZWQnXHJcbiAgY29uZGl0aW9uVGV4dDogc3RyaW5nXHJcbiAgbmVnb3RpYWJsZTogYm9vbGVhblxyXG4gIGxvY2F0aW9uOiBzdHJpbmdcclxuICB2aWV3Q291bnQ6IG51bWJlclxyXG4gIGxpa2VDb3VudDogbnVtYmVyXHJcbiAgY2hhdENvdW50OiBudW1iZXJcclxuICBzdGF0dXM6ICdvbl9zYWxlJyB8ICdyZXNlcnZlZCcgfCAnc29sZCcgfCAncmVtb3ZlZCdcclxuICBjcmVhdGVkQXQ6IHN0cmluZ1xyXG4gIHVwZGF0ZWRBdDogc3RyaW5nXHJcbn1cclxuXHJcbi8qKiBcdThCQkFcdTU3NUJcdTY3N0ZcdTU3NTcgKi9cclxuaW50ZXJmYWNlIEZvcnVtQm9hcmQge1xyXG4gIGlkOiBzdHJpbmdcclxuICBuYW1lOiBzdHJpbmdcclxuICBkZXNjcmlwdGlvbjogc3RyaW5nXHJcbiAgaWNvbjogc3RyaW5nXHJcbiAgcG9zdENvdW50OiBudW1iZXJcclxuICB0b2RheVBvc3RDb3VudDogbnVtYmVyXHJcbiAgc29ydE9yZGVyOiBudW1iZXJcclxufVxyXG5cclxuLyoqIFx1NUUxNlx1NUI1MCAqL1xyXG5pbnRlcmZhY2UgRm9ydW1Qb3N0IHtcclxuICBpZDogc3RyaW5nXHJcbiAgYXV0aG9ySWQ6IHN0cmluZ1xyXG4gIGF1dGhvck5hbWU6IHN0cmluZ1xyXG4gIGF1dGhvckF2YXRhcjogc3RyaW5nXHJcbiAgYm9hcmRJZDogc3RyaW5nXHJcbiAgYm9hcmROYW1lOiBzdHJpbmdcclxuICB0aXRsZTogc3RyaW5nXHJcbiAgY29udGVudDogc3RyaW5nXHJcbiAgaW1hZ2VzOiBzdHJpbmdbXVxyXG4gIHZpZXdDb3VudDogbnVtYmVyXHJcbiAgbGlrZUNvdW50OiBudW1iZXJcclxuICBjb21tZW50Q291bnQ6IG51bWJlclxyXG4gIGlzVG9wOiBib29sZWFuXHJcbiAgaXNFc3NlbmNlOiBib29sZWFuXHJcbiAgc3RhdHVzOiAncHVibGlzaGVkJyB8ICdkcmFmdCcgfCAnZGVsZXRlZCcgfCAnaGlkZGVuJ1xyXG4gIGNyZWF0ZWRBdDogc3RyaW5nXHJcbiAgdXBkYXRlZEF0OiBzdHJpbmdcclxuICBsYXN0UmVwbHlBdD86IHN0cmluZ1xyXG59XHJcblxyXG4vKiogXHU3OTNFXHU1MzNBXHU2RDNCXHU1MkE4ICovXHJcbmludGVyZmFjZSBBY3Rpdml0eSB7XHJcbiAgaWQ6IHN0cmluZ1xyXG4gIHRpdGxlOiBzdHJpbmdcclxuICBjb3ZlckltYWdlOiBzdHJpbmdcclxuICBkZXNjcmlwdGlvbjogc3RyaW5nXHJcbiAgY2F0ZWdvcnk6ICdzcG9ydHMnIHwgJ2N1bHR1cmUnIHwgJ2FjYWRlbWljJyB8ICd2b2x1bnRlZXInIHwgJ2VudGVydGFpbm1lbnQnIHwgJ2NhcmVlcidcclxuICBvcmdhbml6ZXI6IHN0cmluZ1xyXG4gIGxvY2F0aW9uOiBzdHJpbmdcclxuICBzdGFydFRpbWU6IHN0cmluZ1xyXG4gIGVuZFRpbWU6IHN0cmluZ1xyXG4gIG1heFBhcnRpY2lwYW50czogbnVtYmVyXHJcbiAgY3VycmVudFBhcnRpY2lwYW50czogbnVtYmVyXHJcbiAgc3RhdHVzOiAndXBjb21pbmcnIHwgJ29uZ29pbmcnIHwgJ2NvbXBsZXRlZCcgfCAnY2FuY2VsbGVkJ1xyXG4gIGZlZTogbnVtYmVyXHJcbiAgdGFnczogc3RyaW5nW11cclxuICByZWdpc3RyYW50cz86IEFycmF5PHtcclxuICAgIHVzZXJJZDogc3RyaW5nXHJcbiAgICB1c2VyTmFtZTogc3RyaW5nXHJcbiAgICB1c2VyQXZhdGFyOiBzdHJpbmdcclxuICAgIHJlZ2lzdGVyZWRBdDogc3RyaW5nXHJcbiAgfT5cclxuICBjcmVhdGVkQXQ6IHN0cmluZ1xyXG4gIHVwZGF0ZWRBdDogc3RyaW5nXHJcbn1cclxuXHJcbi8qKiBcdTUyMDZcdTk4NzVcdThCRjdcdTZDNDJcdTUzQzJcdTY1NzAgKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xyXG5pbnRlcmZhY2UgX1BhZ2VQYXJhbXMge1xyXG4gIHBhZ2U6IG51bWJlclxyXG4gIHBhZ2VTaXplOiBudW1iZXJcclxufVxyXG5cclxuLyoqIFx1OTAxQVx1NzUyOFx1NTIwNlx1OTg3NVx1NTRDRFx1NUU5NCAqL1xyXG5pbnRlcmZhY2UgUGFnZVJlc3VsdDxUPiB7XHJcbiAgbGlzdDogVFtdXHJcbiAgdG90YWw6IG51bWJlclxyXG4gIHBhZ2U6IG51bWJlclxyXG4gIHBhZ2VTaXplOiBudW1iZXJcclxuICB0b3RhbFBhZ2VzOiBudW1iZXJcclxufVxyXG5cclxuLyoqIEFQSSBcdTdFREZcdTRFMDBcdTU0Q0RcdTVFOTRcdTY4M0NcdTVGMEYgKi9cclxuaW50ZXJmYWNlIEFwaVJlc3BvbnNlPFQgPSBhbnk+IHtcclxuICBjb2RlOiBudW1iZXJcclxuICBtZXNzYWdlOiBzdHJpbmdcclxuICBkYXRhOiBUXHJcbiAgdGltZXN0YW1wOiBudW1iZXJcclxufVxyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT0gXHU1REU1XHU1MTc3XHU1MUZEXHU2NTcwID09PT09PT09PT09PT09PT09PT09XHJcblxyXG4vKipcclxuICogXHU3NTFGXHU2MjEwXHU1RUY2XHU4RkRGXHVGRjBDXHU2QTIxXHU2MkRGXHU3RjUxXHU3RURDXHU4QkY3XHU2QzQyXHU4MDE3XHU2NUY2XHJcbiAqIEBwYXJhbSBtcyBcdTVFRjZcdThGREZcdTZCRUJcdTc5RDJcdTY1NzBcdUZGMENcdTlFRDhcdThCQTQgMjAwLTUwMG1zIFx1OTY4Rlx1NjczQVxyXG4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xyXG5mdW5jdGlvbiBfZGVsYXkobXM/OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcclxuICBjb25zdCB0aW1lID0gbXMgPz8gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMzAwKSArIDIwMFxyXG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSkpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcdTc1MUZcdTYyMTBcdTUyMDZcdTk4NzVcdTdFRDNcdTY3OUNcclxuICogQHBhcmFtIGRhdGEgXHU1QjhDXHU2NTc0XHU2NTcwXHU2MzZFXHU2NTcwXHU3RUM0XHJcbiAqIEBwYXJhbSBwYWdlIFx1NUY1M1x1NTI0RFx1OTg3NVx1NzgwMVxyXG4gKiBAcGFyYW0gcGFnZVNpemUgXHU2QkNGXHU5ODc1XHU2NTcwXHU5MUNGXHJcbiAqL1xyXG5mdW5jdGlvbiBwYWdpbmF0ZTxUPihkYXRhOiBUW10sIHBhZ2U6IG51bWJlciwgcGFnZVNpemU6IG51bWJlcik6IFBhZ2VSZXN1bHQ8VD4ge1xyXG4gIGNvbnN0IHRvdGFsID0gZGF0YS5sZW5ndGhcclxuICBjb25zdCB0b3RhbFBhZ2VzID0gTWF0aC5jZWlsKHRvdGFsIC8gcGFnZVNpemUpXHJcbiAgY29uc3Qgc3RhcnRJbmRleCA9IChwYWdlIC0gMSkgKiBwYWdlU2l6ZVxyXG4gIGNvbnN0IGxpc3QgPSBkYXRhLnNsaWNlKHN0YXJ0SW5kZXgsIHN0YXJ0SW5kZXggKyBwYWdlU2l6ZSlcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGxpc3QsXHJcbiAgICB0b3RhbCxcclxuICAgIHBhZ2UsXHJcbiAgICBwYWdlU2l6ZSxcclxuICAgIHRvdGFsUGFnZXNcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcdTc1MUZcdTYyMTBcdTdFREZcdTRFMDBcdTYyMTBcdTUyOUZcdTU0Q0RcdTVFOTRcclxuICovXHJcbmZ1bmN0aW9uIHN1Y2Nlc3NSZXNwb25zZTxUPihkYXRhOiBUKTogQXBpUmVzcG9uc2U8VD4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBjb2RlOiAyMDAsXHJcbiAgICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgICBkYXRhLFxyXG4gICAgdGltZXN0YW1wOiBEYXRlLm5vdygpXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogXHU3NTFGXHU2MjEwXHU4QkEyXHU1MzU1XHU3RjE2XHU1M0Y3XHJcbiAqL1xyXG5mdW5jdGlvbiBnZW5lcmF0ZU9yZGVyTm8oKTogc3RyaW5nIHtcclxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXHJcbiAgY29uc3QgZGF0ZVN0ciA9IG5vdy5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgK1xyXG4gICAgKG5vdy5nZXRNb250aCgpICsgMSkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpICtcclxuICAgIG5vdy5nZXREYXRlKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpXHJcbiAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCkudG9TdHJpbmcoKS5wYWRTdGFydCg2LCAnMCcpXHJcbiAgcmV0dXJuIGBISyR7ZGF0ZVN0cn0ke3JhbmRvbX1gXHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09IFx1NTU0Nlx1NTRDMVx1NkEyMVx1NTc1N1x1NjU3MFx1NjM2RSA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLyoqIFx1NTU0Nlx1NTRDMVx1NTIwNlx1N0M3Qlx1NjU3MFx1NjM2RSAqL1xyXG5jb25zdCBjYXRlZ29yaWVzOiBDYXRlZ29yeVtdID0gW1xyXG4gIHsgaWQ6ICdjYXQxJywgbmFtZTogJ1x1NjU3MFx1NzgwMVx1NzUzNVx1NUI1MCcsIGljb246ICdsYXB0b3AnLCBkZXNjcmlwdGlvbjogJ1x1NjI0Qlx1NjczQVx1MzAwMVx1NzUzNVx1ODExMVx1MzAwMVx1NUU3M1x1Njc3Rlx1N0I0OVx1NzUzNVx1NUI1MFx1OEJCRVx1NTkwNycgfSxcclxuICB7IGlkOiAnY2F0MicsIG5hbWU6ICdcdTU2RkVcdTRFNjZcdTY1ODdcdTUxNzcnLCBpY29uOiAnYm9vaycsIGRlc2NyaXB0aW9uOiAnXHU2NTU5XHU2NzUwXHUzMDAxXHU1M0MyXHU4MDAzXHU0RTY2XHUzMDAxXHU2NTg3XHU1MTc3XHU3NTI4XHU1NEMxJyB9LFxyXG4gIHsgaWQ6ICdjYXQzJywgbmFtZTogJ1x1NzUxRlx1NkQzQlx1NjVFNVx1NzUyOCcsIGljb246ICdob21lJywgZGVzY3JpcHRpb246ICdcdTY1RTVcdTc1MjhcdTU0QzFcdTMwMDFcdTY1MzZcdTdFQjNcdTMwMDFcdTZFMDVcdTZEMDFcdTc1MjhcdTU0QzEnIH0sXHJcbiAgeyBpZDogJ2NhdDQnLCBuYW1lOiAnXHU4RkQwXHU1MkE4XHU2MjM3XHU1OTE2JywgaWNvbjogJ2Jhc2tldGJhbGwnLCBkZXNjcmlwdGlvbjogJ1x1OEZEMFx1NTJBOFx1ODhDNVx1NTkwN1x1MzAwMVx1NjIzN1x1NTkxNlx1NzUyOFx1NTRDMScgfSxcclxuICB7IGlkOiAnY2F0NScsIG5hbWU6ICdcdTk4REZcdTU0QzFcdTk5NkVcdTY1OTknLCBpY29uOiAnY29mZmVlJywgZGVzY3JpcHRpb246ICdcdTk2RjZcdTk4REZcdTMwMDFcdTk5NkVcdTY1OTlcdTMwMDFcdTcyNzlcdTRFQTcnIH1cclxuXVxyXG5cclxuLyoqIFx1NTU0Nlx1NTRDMVx1NjU3MFx1NjM2RSAtIFx1N0IyNlx1NTQwOFx1OUVEMVx1NzlEMVx1NTkyN1x1NjgyMVx1NTZFRFx1NTczQVx1NjY2RiAqL1xyXG5jb25zdCBwcm9kdWN0czogUHJvZHVjdFtdID0gW1xyXG4gIC8vIFx1NjU3MFx1NzgwMVx1NzUzNVx1NUI1MFx1N0M3QiAoNVx1NEUyQSlcclxuICB7XHJcbiAgICBpZDogJ3Byb2QwMDEnLFxyXG4gICAgbmFtZTogJ1x1NTM0RVx1NEUzQSBNYXRlQm9vayBEMTQgXHU3QjE0XHU4QkIwXHU2NzJDXHU3NTM1XHU4MTExJyxcclxuICAgIGNhdGVnb3J5SWQ6ICdjYXQxJyxcclxuICAgIHByaWNlOiA0Mjk5LFxyXG4gICAgb3JpZ2luYWxQcmljZTogNDk5OSxcclxuICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTYxODExMzMyMDYtODBjZTliODhhODUzP3c9NDAwJmg9NDAwJmZpdD1jcm9wJyxcclxuICAgIGltYWdlczogW1xyXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTYxODExMzMyMDYtODBjZTliODhhODUzP3c9ODAwJmg9ODAwJmZpdD1jcm9wJyxcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTI1NTQ3NzE5NTcxLWEyZDRhYzg5NDVlMj93PTgwMCZoPTgwMCZmaXQ9Y3JvcCdcclxuICAgIF0sXHJcbiAgICBkZXNjcmlwdGlvbjogJzIwMjRcdTZCM0UgXHU1MzRFXHU0RTNBTWF0ZUJvb2sgRDE0IDE0XHU4MkYxXHU1QkY4XHU4RjdCXHU4NTg0XHU2NzJDXHVGRjBDXHU5MDAyXHU1NDA4XHU1QjY2XHU0RTYwXHU1NDhDXHU1MjlFXHU1MTZDXHU0RjdGXHU3NTI4JyxcclxuICAgIGRldGFpbDogJzxwPjxzdHJvbmc+XHU0RUE3XHU1NEMxXHU3Mjc5XHU3MEI5XHVGRjFBPC9zdHJvbmc+PC9wPjx1bD48bGk+XHU1OTA0XHU3NDA2XHU1NjY4XHVGRjFBQU1EIFI1LTc1MzBVPC9saT48bGk+XHU1MTg1XHU1QjU4XHVGRjFBMTZHQiBERFI0PC9saT48bGk+XHU3ODZDXHU3NkQ4XHVGRjFBNTEyR0IgU1NEPC9saT48bGk+XHU1QzRGXHU1RTU1XHVGRjFBMTRcdTgyRjFcdTVCRjggMTA4MFAgSVBTPC9saT48bGk+XHU3RUVEXHU4MjJBXHVGRjFBXHU3RUE2OFx1NUMwRlx1NjVGNjwvbGk+PC91bD4nLFxyXG4gICAgc3RvY2s6IDE1LFxyXG4gICAgc2FsZXM6IDEyOCxcclxuICAgIHJhdGluZzogNC44LFxyXG4gICAgcmV2aWV3Q291bnQ6IDU2LFxyXG4gICAgc3RhdHVzOiAnb25fc2FsZScsXHJcbiAgICB0YWdzOiBbJ1x1N0IxNFx1OEJCMFx1NjcyQycsICdcdTUzNEVcdTRFM0EnLCAnXHU1QjY2XHU3NTFGXHU0RjE4XHU2MEUwJ10sXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTAxLTE1VDEwOjAwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTAzLTIwVDA4OjMwOjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAncHJvZDAwMicsXHJcbiAgICBuYW1lOiAnXHU1QzBGXHU3QzczIFJlZG1pIE5vdGUgMTMgUHJvIFx1NjI0Qlx1NjczQScsXHJcbiAgICBjYXRlZ29yeUlkOiAnY2F0MScsXHJcbiAgICBwcmljZTogMTU5OSxcclxuICAgIG9yaWdpbmFsUHJpY2U6IDE4OTksXHJcbiAgICBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTExNzA3MTcxNjM0LTVmODk3ZmYwMmFhOT93PTQwMCZoPTQwMCZmaXQ9Y3JvcCcsXHJcbiAgICBpbWFnZXM6IFtcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTExNzA3MTcxNjM0LTVmODk3ZmYwMmFhOT93PTgwMCZoPTgwMCZmaXQ9Y3JvcCdcclxuICAgIF0sXHJcbiAgICBkZXNjcmlwdGlvbjogJ1JlZG1pIE5vdGUgMTMgUHJvIDVHXHU2MjRCXHU2NzNBXHVGRjBDMVx1NEVCRlx1NTBDRlx1N0QyMFx1NEUzQlx1NjQ0NFx1RkYwQ1x1NjAyN1x1NEVGN1x1NkJENFx1NEU0Qlx1OTAwOScsXHJcbiAgICBkZXRhaWw6ICc8cD5cdTY0MkRcdThGN0RcdTlBODFcdTlGOTk3cyBHZW4yXHU1OTA0XHU3NDA2XHU1NjY4XHVGRjBDNi42N1x1ODJGMVx1NUJGOE9MRURcdTVDNEZcdTVFNTVcdUZGMEM1MTAwbUFoXHU1OTI3XHU3NTM1XHU2QzYwXHVGRjBDNjdXXHU1RkVCXHU1MTQ1PC9wPicsXHJcbiAgICBzdG9jazogMzIsXHJcbiAgICBzYWxlczogMjU2LFxyXG4gICAgcmF0aW5nOiA0LjYsXHJcbiAgICByZXZpZXdDb3VudDogMTI4LFxyXG4gICAgc3RhdHVzOiAnb25fc2FsZScsXHJcbiAgICB0YWdzOiBbJ1x1NjI0Qlx1NjczQScsICdcdTVDMEZcdTdDNzMnLCAnNUcnXSxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDItMDFUMDk6MDA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDFUMTI6MDA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdwcm9kMDAzJyxcclxuICAgIG5hbWU6ICdpUGFkIFx1N0IyQzEwXHU0RUUzIDY0R0IgV2lGaVx1NzI0OCcsXHJcbiAgICBjYXRlZ29yeUlkOiAnY2F0MScsXHJcbiAgICBwcmljZTogMjc5OSxcclxuICAgIG9yaWdpbmFsUHJpY2U6IDI5OTksXHJcbiAgICBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTQ0MjQ0MDE1LTBkZjRiM2ZmYzZiMD93PTQwMCZoPTQwMCZmaXQ9Y3JvcCcsXHJcbiAgICBpbWFnZXM6IFtcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTQ0MjQ0MDE1LTBkZjRiM2ZmYzZiMD93PTgwMCZoPTgwMCZmaXQ9Y3JvcCdcclxuICAgIF0sXHJcbiAgICBkZXNjcmlwdGlvbjogJ0FwcGxlIGlQYWQgXHU3QjJDMTBcdTRFRTNcdUZGMEMxMC45XHU4MkYxXHU1QkY4IExpcXVpZCBSZXRpbmFcdTY2M0VcdTc5M0FcdTVDNEYnLFxyXG4gICAgZGV0YWlsOiAnPHA+QTE0XHU0RUZGXHU3NTFGXHU4MkFGXHU3MjQ3XHVGRjBDXHU2NTJGXHU2MzAxQXBwbGUgUGVuY2lsXHVGRjA4XHU3QjJDXHU0RTAwXHU0RUUzXHVGRjA5XHVGRjBDXHU1MTY4XHU1OTI5XHU1MDE5XHU3NTM1XHU2QzYwXHU3RUVEXHU4MjJBPC9wPicsXHJcbiAgICBzdG9jazogOCxcclxuICAgIHNhbGVzOiA4OSxcclxuICAgIHJhdGluZzogNC45LFxyXG4gICAgcmV2aWV3Q291bnQ6IDQ1LFxyXG4gICAgc3RhdHVzOiAnb25fc2FsZScsXHJcbiAgICB0YWdzOiBbJ1x1NUU3M1x1Njc3RicsICdcdTgyRjlcdTY3OUMnLCAnXHU1QjY2XHU0RTYwXHU3OTVFXHU1NjY4J10sXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTAxLTIwVDExOjAwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTAzLTI1VDE0OjIwOjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAncHJvZDAwNCcsXHJcbiAgICBuYW1lOiAnXHU3RjU3XHU2MjgwIE1YIE1hc3RlciAzUyBcdTY1RTBcdTdFQkZcdTlGMjBcdTY4MDcnLFxyXG4gICAgY2F0ZWdvcnlJZDogJ2NhdDEnLFxyXG4gICAgcHJpY2U6IDU5OSxcclxuICAgIG9yaWdpbmFsUHJpY2U6IDc0OSxcclxuICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1Mjc4NjQ1NTA0MTctN2ZkOTFmYzUxYTQ2P3c9NDAwJmg9NDAwJmZpdD1jcm9wJyxcclxuICAgIGltYWdlczogW1xyXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1Mjc4NjQ1NTA0MTctN2ZkOTFmYzUxYTQ2P3c9ODAwJmg9ODAwJmZpdD1jcm9wJ1xyXG4gICAgXSxcclxuICAgIGRlc2NyaXB0aW9uOiAnXHU0RTEzXHU0RTFBXHU3RUE3XHU2NUUwXHU3RUJGXHU5RjIwXHU2ODA3XHVGRjBDTWFnU3BlZWRcdTc1MzVcdTc4QzFcdTZFREFcdThGNkVcdUZGMEM3MDAwIERQSVx1NEYyMFx1NjExRlx1NTY2OCcsXHJcbiAgICBkZXRhaWw6ICc8cD5cdTk3NTlcdTk3RjNcdTcwQjlcdTUxRkJcdUZGMENcdTU5MUFcdThCQkVcdTU5MDdcdThGREVcdTYzQTVcdUZGMENVU0ItQ1x1NUZFQlx1NTE0NVx1RkYwQzcwXHU1OTI5XHU4RDg1XHU5NTdGXHU3RUVEXHU4MjJBPC9wPicsXHJcbiAgICBzdG9jazogNDUsXHJcbiAgICBzYWxlczogMTY3LFxyXG4gICAgcmF0aW5nOiA0LjcsXHJcbiAgICByZXZpZXdDb3VudDogOTIsXHJcbiAgICBzdGF0dXM6ICdvbl9zYWxlJyxcclxuICAgIHRhZ3M6IFsnXHU5RjIwXHU2ODA3JywgJ1x1N0Y1N1x1NjI4MCcsICdcdTUyOUVcdTUxNkNcdTU5MTZcdThCQkUnXSxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDItMTBUMTU6MDA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDJUMDk6MTU6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdwcm9kMDA1JyxcclxuICAgIG5hbWU6ICdcdTZGMkJcdTZCNjVcdTgwMDUgVzgyME5CIFx1NTkzNFx1NjIzNFx1NUYwRlx1OTY0RFx1NTY2QVx1ODAzM1x1NjczQScsXHJcbiAgICBjYXRlZ29yeUlkOiAnY2F0MScsXHJcbiAgICBwcmljZTogMjY5LFxyXG4gICAgb3JpZ2luYWxQcmljZTogMzQ5LFxyXG4gICAgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNTc0MDQyMDkyOC01ZTU2MGMwNmQzMGU/dz00MDAmaD00MDAmZml0PWNyb3AnLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNTc0MDQyMDkyOC01ZTU2MGMwNmQzMGU/dz04MDAmaD04MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgZGVzY3JpcHRpb246ICdcdTRFM0JcdTUyQThcdTk2NERcdTU2NkFcdTg0RERcdTcyNTlcdTgwMzNcdTY3M0FcdUZGMENIaS1SZXNcdThCQTRcdThCQzFcdTk3RjNcdThEMjhcdUZGMEM1MFx1NUMwRlx1NjVGNlx1OTU3Rlx1N0VFRFx1ODIyQScsXHJcbiAgICBkZXRhaWw6ICc8cD5cdTY1MkZcdTYzMDFMREFDXHU5QUQ4XHU2RTA1XHU5N0YzXHU5ODkxXHU0RjIwXHU4RjkzXHVGRjBDXHU4MjEyXHU5MDAyXHU0RjY5XHU2MjM0XHU4QkJFXHU4QkExXHVGRjBDXHU5MDAyXHU1NDA4XHU5NTdGXHU2NUY2XHU5NUY0XHU1QjY2XHU0RTYwXHU0RjdGXHU3NTI4PC9wPicsXHJcbiAgICBzdG9jazogMjgsXHJcbiAgICBzYWxlczogMjAzLFxyXG4gICAgcmF0aW5nOiA0LjUsXHJcbiAgICByZXZpZXdDb3VudDogNzgsXHJcbiAgICBzdGF0dXM6ICdvbl9zYWxlJyxcclxuICAgIHRhZ3M6IFsnXHU4MDMzXHU2NzNBJywgJ1x1OTY0RFx1NTY2QScsICdcdTg0RERcdTcyNTknXSxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDItMDVUMTM6MzA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDMtMjhUMTY6NDU6MDBaJ1xyXG4gIH0sXHJcblxyXG4gIC8vIFx1NTZGRVx1NEU2Nlx1NjU4N1x1NTE3N1x1N0M3QiAoM1x1NEUyQSlcclxuICB7XHJcbiAgICBpZDogJ3Byb2QwMDYnLFxyXG4gICAgbmFtZTogJ1x1OUFEOFx1N0I0OVx1NjU3MFx1NUI2Nlx1RkYwOFx1N0IyQ1x1NEUwM1x1NzI0OFx1RkYwOVx1NTQwQ1x1NkQ0RVx1NTkyN1x1NUI2NicsXHJcbiAgICBjYXRlZ29yeUlkOiAnY2F0MicsXHJcbiAgICBwcmljZTogNDIsXHJcbiAgICBvcmlnaW5hbFByaWNlOiA0OS44LFxyXG4gICAgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU0NDk0Nzk1MC1mYTA3YTk4ZDIzN2Y/dz00MDAmaD00MDAmZml0PWNyb3AnLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU0NDk0Nzk1MC1mYTA3YTk4ZDIzN2Y/dz04MDAmaD04MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgZGVzY3JpcHRpb246ICdcdTdFQ0ZcdTUxNzhcdTlBRDhcdTY1NzBcdTY1NTlcdTY3NTBcdUZGMENcdTc0MDZcdTVERTVcdTc5RDFcdTVCNjZcdTc1MUZcdTVGQzVcdTU5MDcnLFxyXG4gICAgZGV0YWlsOiAnPHA+XHU5QUQ4XHU3QjQ5XHU2NTU5XHU4MEIyXHU1MUZBXHU3MjQ4XHU3OTNFXHU2NzQzXHU1QTAxXHU1MUZBXHU3MjQ4XHVGRjBDXHU1MTg1XHU1QkI5XHU1MTY4XHU5NzYyXHU3Q0ZCXHU3RURGXHVGRjBDXHU0RjhCXHU5ODk4XHU0RTMwXHU1QkNDXHU4QkU2XHU1QzNEPC9wPicsXHJcbiAgICBzdG9jazogMTIwLFxyXG4gICAgc2FsZXM6IDU2NyxcclxuICAgIHJhdGluZzogNC45LFxyXG4gICAgcmV2aWV3Q291bnQ6IDIzNCxcclxuICAgIHN0YXR1czogJ29uX3NhbGUnLFxyXG4gICAgdGFnczogWydcdTY1NTlcdTY3NTAnLCAnXHU2NTcwXHU1QjY2JywgJ1x1ODAwM1x1NzgxNFx1NUZDNVx1NTkwNyddLFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wMS0wMVQwODowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wNVQxMDowMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ3Byb2QwMDcnLFxyXG4gICAgbmFtZTogJ1x1NEUwOVx1ODNGMSBVbmktYmFsbCBPbmUgXHU0RTJEXHU2MDI3XHU3QjE0XHU1OTU3XHU4OEM1XHVGRjA4MTBcdTY1MkZcdTg4QzVcdUZGMDknLFxyXG4gICAgY2F0ZWdvcnlJZDogJ2NhdDInLFxyXG4gICAgcHJpY2U6IDM1LFxyXG4gICAgb3JpZ2luYWxQcmljZTogNDUsXHJcbiAgICBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTgzNDg1MDg4MDM0LTY5N2I1YmM1NGNjZD93PTQwMCZoPTQwMCZmaXQ9Y3JvcCcsXHJcbiAgICBpbWFnZXM6IFtcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTgzNDg1MDg4MDM0LTY5N2I1YmM1NGNjZD93PTgwMCZoPTgwMCZmaXQ9Y3JvcCdcclxuICAgIF0sXHJcbiAgICBkZXNjcmlwdGlvbjogJ1x1NjVFNVx1NjcyQ1x1OEZEQlx1NTNFM1x1NEUyRFx1NjAyN1x1N0IxNFx1RkYwQ1x1NThBOFx1NkMzNFx1NEUwRFx1NkQwN1x1N0VCOFx1RkYwQ1x1NEU2Nlx1NTE5OVx1OTg3QVx1NkVEMScsXHJcbiAgICBkZXRhaWw6ICc8cD4wLjVtbVx1NUI1MFx1NUYzOVx1NTkzNFx1RkYwQ1x1OUVEMVx1ODI3Mlx1NThBOFx1NkMzNFx1RkYwQ1x1OTAwMlx1NTQwOFx1ODAwM1x1OEJENVx1NTQ4Q1x1NjVFNVx1NUUzOFx1N0IxNFx1OEJCMFx1NEY3Rlx1NzUyODwvcD4nLFxyXG4gICAgc3RvY2s6IDIwMCxcclxuICAgIHNhbGVzOiA4OTAsXHJcbiAgICByYXRpbmc6IDQuOCxcclxuICAgIHJldmlld0NvdW50OiAzNTYsXHJcbiAgICBzdGF0dXM6ICdvbl9zYWxlJyxcclxuICAgIHRhZ3M6IFsnXHU3QjE0JywgJ1x1NjU4N1x1NTE3NycsICdcdTgwMDNcdThCRDVcdTc1MjhcdTdCMTQnXSxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDEtMTBUMDk6MzA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDNUMTE6MjA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdwcm9kMDA4JyxcclxuICAgIG5hbWU6ICdcdTU2RkRcdThBODkgS29rdXlvIFx1NkQzQlx1OTg3NVx1NjcyQyBCNVx1RkYwODVcdTY3MkNcdTg4QzVcdUZGMDknLFxyXG4gICAgY2F0ZWdvcnlJZDogJ2NhdDInLFxyXG4gICAgcHJpY2U6IDU4LFxyXG4gICAgb3JpZ2luYWxQcmljZTogNzIsXHJcbiAgICBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTMxMzQ2ODc4Mzc3LWE1YmUyMDg4OGU1Nz93PTQwMCZoPTQwMCZmaXQ9Y3JvcCcsXHJcbiAgICBpbWFnZXM6IFtcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTMxMzQ2ODc4Mzc3LWE1YmUyMDg4OGU1Nz93PTgwMCZoPTgwMCZmaXQ9Y3JvcCdcclxuICAgIF0sXHJcbiAgICBkZXNjcmlwdGlvbjogJ1x1NjVFNVx1NjcyQ1x1NTZGRFx1OEE4OVx1NkQzQlx1OTg3NVx1NjcyQ1x1RkYwQ1x1NTNFRlx1NjM2Mlx1ODJBRlx1OEJCRVx1OEJBMVx1RkYwQ1x1ODAxMFx1NzUyOFx1NUI5RVx1NzUyOCcsXHJcbiAgICBkZXRhaWw6ICc8cD5CNVx1NUMzQVx1NUJGOFx1RkYwQzI2XHU1QjU0XHU2RDNCXHU5ODc1XHU1OTM5XHVGRjBDXHU1NDJCODBcdTVGMjBcdTZBMkFcdTdFQkZcdTUxODVcdTk4NzVcdUZGMENcdTUzRUZcdTgxRUFcdTc1MzFcdTU4OUVcdTUxQ0ZcdTdFQjhcdTVGMjA8L3A+JyxcclxuICAgIHN0b2NrOiA4NSxcclxuICAgIHNhbGVzOiA0MjMsXHJcbiAgICByYXRpbmc6IDQuNyxcclxuICAgIHJldmlld0NvdW50OiAxNzgsXHJcbiAgICBzdGF0dXM6ICdvbl9zYWxlJyxcclxuICAgIHRhZ3M6IFsnXHU3QjE0XHU4QkIwXHU2NzJDJywgJ1x1NkQzQlx1OTg3NVx1NjcyQycsICdcdTU2RkRcdThBODknXSxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDEtMThUMTA6MTU6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDMtMzBUMTQ6MDA6MDBaJ1xyXG4gIH0sXHJcblxyXG4gIC8vIFx1NzUxRlx1NkQzQlx1NjVFNVx1NzUyOFx1NURFNSAoMlx1NEUyQSlcclxuICB7XHJcbiAgICBpZDogJ3Byb2QwMDknLFxyXG4gICAgbmFtZTogJ1x1NTM1N1x1Njc4MVx1NEVCQSBcdTU2REJcdTRFRjZcdTU5NTdcdTVFOEFcdTRFMEFcdTc1MjhcdTU0QzFcdUZGMDhcdTg4QUJcdTU5NTcrXHU1RThBXHU1MzU1K1x1Njc5NVx1NTk1N3gyXHVGRjA5JyxcclxuICAgIGNhdGVnb3J5SWQ6ICdjYXQzJyxcclxuICAgIHByaWNlOiAxNjgsXHJcbiAgICBvcmlnaW5hbFByaWNlOiAyNTgsXHJcbiAgICBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTIyNzcxNzM5ODQ0LTZhOWY2ZDVmMTRhZj93PTQwMCZoPTQwMCZmaXQ9Y3JvcCcsXHJcbiAgICBpbWFnZXM6IFtcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTIyNzcxNzM5ODQ0LTZhOWY2ZDVmMTRhZj93PTgwMCZoPTgwMCZmaXQ9Y3JvcCdcclxuICAgIF0sXHJcbiAgICBkZXNjcmlwdGlvbjogJ1x1NUJCRlx1ODIwRFx1NUZDNVx1NTkwN1x1NTZEQlx1NEVGNlx1NTk1N1x1RkYwQ1x1N0VBRlx1NjhDOVx1Njc1MFx1OEQyOFx1RkYwQ1x1NEVCMlx1ODBBNFx1OTAwRlx1NkMxNCcsXHJcbiAgICBkZXRhaWw6ICc8cD5cdTkwMDJcdTc1MjgxLjJtLzEuNW1cdTVFOEFcdUZGMENcdTUxNjhcdTY4QzlcdTY1OUNcdTdFQjlcdTk3NjJcdTY1OTlcdUZGMENcdTZEM0JcdTYwMjdcdTUzNzBcdTY3RDNcdTRFMERcdTY2MTNcdTg5MkFcdTgyNzI8L3A+JyxcclxuICAgIHN0b2NrOiAzNixcclxuICAgIHNhbGVzOiAyODksXHJcbiAgICByYXRpbmc6IDQuNixcclxuICAgIHJldmlld0NvdW50OiAxNDUsXHJcbiAgICBzdGF0dXM6ICdvbl9zYWxlJyxcclxuICAgIHRhZ3M6IFsnXHU1RThBXHU1NEMxJywgJ1x1NUJCRlx1ODIwRCcsICdcdTdFQUZcdTY4QzknXSxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDEtMjVUMTE6MDA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDMtMjJUMDk6MzA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdwcm9kMDEwJyxcclxuICAgIG5hbWU6ICdcdTUxNkNcdTcyNUIgXHU2M0QyXHU2MzkyIEdOLUIzMDRVIDRcdTRGNERVU0JcdTYzRDJcdTVFQTcnLFxyXG4gICAgY2F0ZWdvcnlJZDogJ2NhdDMnLFxyXG4gICAgcHJpY2U6IDM5LFxyXG4gICAgb3JpZ2luYWxQcmljZTogNTksXHJcbiAgICBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTU4NjE4NjY2LWZjZDI1Yzg1ZjgyZT93PTQwMCZoPTQwMCZmaXQ9Y3JvcCcsXHJcbiAgICBpbWFnZXM6IFtcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTU4NjE4NjY2LWZjZDI1Yzg1ZjgyZT93PTgwMCZoPTgwMCZmaXQ9Y3JvcCdcclxuICAgIF0sXHJcbiAgICBkZXNjcmlwdGlvbjogJ1x1NUI4OVx1NTE2OFx1NjNEMlx1NUVBN1x1RkYwQ1x1NUUyNlVTQlx1NTE0NVx1NzUzNVx1NTNFM1x1RkYwQ1x1NUJCRlx1ODIwRFx1Nzk1RVx1NTY2OCcsXHJcbiAgICBkZXRhaWw6ICc8cD40XHU0RjREXHU2M0QyXHU1QjU0KzNVU0JcdTYzQTVcdTUzRTNcdUZGMEMxLjhcdTdDNzNcdTdFQkZcdTk1N0ZcdUZGMENcdThGQzdcdThGN0RcdTRGRERcdTYyQTRcdUZGMENcdTk2M0JcdTcxQzNcdTY3NTBcdTY1OTk8L3A+JyxcclxuICAgIHN0b2NrOiAxNTAsXHJcbiAgICBzYWxlczogNjc4LFxyXG4gICAgcmF0aW5nOiA0LjgsXHJcbiAgICByZXZpZXdDb3VudDogMjg5LFxyXG4gICAgc3RhdHVzOiAnb25fc2FsZScsXHJcbiAgICB0YWdzOiBbJ1x1NjNEMlx1NjM5MicsICdVU0JcdTUxNDVcdTc1MzUnLCAnXHU1QkJGXHU4MjBEXHU1RkM1XHU1OTA3J10sXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTAxLTA4VDA4OjMwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTA0VDE1OjAwOjAwWidcclxuICB9LFxyXG5cclxuICAvLyBcdThGRDBcdTUyQThcdTYyMzdcdTU5MTZcdTdDN0IgKDJcdTRFMkEpXHJcbiAge1xyXG4gICAgaWQ6ICdwcm9kMDExJyxcclxuICAgIG5hbWU6ICdcdTY3NEVcdTVCODEgXHU3RkJEXHU2QkRCXHU3NDAzXHU2MkNEIFx1NTM1NVx1NjJDRFx1RkYwOFx1NURGMlx1N0E3Rlx1N0VCRlx1RkYwOScsXHJcbiAgICBjYXRlZ29yeUlkOiAnY2F0NCcsXHJcbiAgICBwcmljZTogMTI5LFxyXG4gICAgb3JpZ2luYWxQcmljZTogMTk5LFxyXG4gICAgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYyMjI5MDI5MTQ2OC0yOGU5ZWNkY2FkZTE/dz00MDAmaD00MDAmZml0PWNyb3AnLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYyMjI5MDI5MTQ2OC0yOGU5ZWNkY2FkZTE/dz04MDAmaD04MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgZGVzY3JpcHRpb246ICdcdTUxNjhcdTc4QjNcdTdEMjBcdTdGQkRcdTZCREJcdTc0MDNcdTYyQ0RcdUZGMENcdThGN0JcdTkxQ0ZcdTUzMTZcdThCQkVcdThCQTFcdUZGMENcdTY1M0JcdTVCODhcdTUxN0NcdTU5MDcnLFxyXG4gICAgZGV0YWlsOiAnPHA+XHU5MUNEXHU5MUNGXHU3RUE2ODVnXHVGRjBDXHU1REYyXHU3QTdGMjRcdTc4QzVcdTdFQkZcdUZGMENcdTkwMDFcdTYyQ0RcdTU5NTdcdTU0OENcdTYyNEJcdTgwRjZcdUZGMENcdTkwMDJcdTU0MDhcdTUyMURcdTVCNjZcdTgwMDVcdTUyMzBcdThGREJcdTk2MzZcdTczQTlcdTVCQjY8L3A+JyxcclxuICAgIHN0b2NrOiA0MixcclxuICAgIHNhbGVzOiAxNTYsXHJcbiAgICByYXRpbmc6IDQuNSxcclxuICAgIHJldmlld0NvdW50OiA2NyxcclxuICAgIHN0YXR1czogJ29uX3NhbGUnLFxyXG4gICAgdGFnczogWydcdTdGQkRcdTZCREJcdTc0MDMnLCAnXHU4RkQwXHU1MkE4XHU1NjY4XHU2NzUwJywgJ1x1NTA2NVx1OEVBQiddLFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wMi0wOFQxNDowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wMy0yN1QxMDozMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ3Byb2QwMTInLFxyXG4gICAgbmFtZTogJ1x1OEZFQVx1NTM2MVx1NEZBQyBcdTUzQ0NcdTgwQTlcdTgwQ0NcdTUzMDUgMjBMIFx1OEZEMFx1NTJBOFx1NEYxMVx1OTVGMicsXHJcbiAgICBjYXRlZ29yeUlkOiAnY2F0NCcsXHJcbiAgICBwcmljZTogNzksXHJcbiAgICBvcmlnaW5hbFByaWNlOiA5OSxcclxuICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTMwNjI0MDctOThlZWI2NGM2YTYyP3c9NDAwJmg9NDAwJmZpdD1jcm9wJyxcclxuICAgIGltYWdlczogW1xyXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTMwNjI0MDctOThlZWI2NGM2YTYyP3c9ODAwJmg9ODAwJmZpdD1jcm9wJ1xyXG4gICAgXSxcclxuICAgIGRlc2NyaXB0aW9uOiAnXHU4RjdCXHU0RkJGXHU1M0NDXHU4MEE5XHU1MzA1XHVGRjBDXHU1OTFBXHU1MjlGXHU4MEZEXHU5Njk0XHU1QzQyXHVGRjBDXHU5NjMyXHU2QzM0XHU5NzYyXHU2NTk5JyxcclxuICAgIGRldGFpbDogJzxwPjIwTFx1NUJCOVx1OTFDRlx1RkYwQ1x1NzUzNVx1ODExMVx1NEVEM1x1NTNFRlx1NjUzRTE0XHU1QkY4XHU3QjE0XHU4QkIwXHU2NzJDXHVGRjBDXHU1M0NEXHU1MTQ5XHU2NzYxXHU4QkJFXHU4QkExXHVGRjBDXHU1OTFDXHU4REQxXHU1Qjg5XHU1MTY4PC9wPicsXHJcbiAgICBzdG9jazogNjgsXHJcbiAgICBzYWxlczogMjM0LFxyXG4gICAgcmF0aW5nOiA0LjQsXHJcbiAgICByZXZpZXdDb3VudDogOTgsXHJcbiAgICBzdGF0dXM6ICdvbl9zYWxlJyxcclxuICAgIHRhZ3M6IFsnXHU4MENDXHU1MzA1JywgJ1x1OEZEMFx1NTJBOCcsICdcdTkwMUFcdTUyRTQnXSxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDItMTJUMDk6NDU6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDMtMjlUMTY6MDA6MDBaJ1xyXG4gIH0sXHJcblxyXG4gIC8vIFx1OThERlx1NTRDMVx1OTk2RVx1NjU5OVx1N0M3QiAoM1x1NEUyQSlcclxuICB7XHJcbiAgICBpZDogJ3Byb2QwMTMnLFxyXG4gICAgbmFtZTogJ1x1NEUwOVx1NTNFQVx1Njc3RVx1OUYyMCBcdTU3NUFcdTY3OUNcdTc5M0NcdTc2RDIgMWtnXHU4OEM1JyxcclxuICAgIGNhdGVnb3J5SWQ6ICdjYXQ1JyxcclxuICAgIHByaWNlOiA2OSxcclxuICAgIG9yaWdpbmFsUHJpY2U6IDk5LFxyXG4gICAgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU5OTU5OTgxMDc2OS1iY2RlNWExNjBkMzI/dz00MDAmaD00MDAmZml0PWNyb3AnLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU5OTU5OTgxMDc2OS1iY2RlNWExNjBkMzI/dz04MDAmaD04MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgZGVzY3JpcHRpb246ICdcdTZERjdcdTU0MDhcdTU3NUFcdTY3OUNcdTc5M0NcdTc2RDJcdUZGMENcdTZCQ0ZcdTY1RTVcdTU3NUFcdTY3OUNcdTg0MjVcdTUxN0JcdTU3NDdcdTg4NjEnLFxyXG4gICAgZGV0YWlsOiAnPHA+XHU1NDJCXHU4MTcwXHU2NzlDXHUzMDAxXHU1REY0XHU2NUU2XHU2NzI4XHUzMDAxXHU2ODM4XHU2ODQzXHUzMDAxXHU2OTlCXHU1QjUwXHU3QjQ5OFx1NzlDRFx1NTc1QVx1Njc5Q1x1RkYwQ1x1NzJFQ1x1N0FDQlx1NUMwRlx1NTMwNVx1ODhDNVx1RkYwQ1x1NjVCOVx1NEZCRlx1NjQzQVx1NUUyNjwvcD4nLFxyXG4gICAgc3RvY2s6IDk1LFxyXG4gICAgc2FsZXM6IDQ0NSxcclxuICAgIHJhdGluZzogNC43LFxyXG4gICAgcmV2aWV3Q291bnQ6IDE5OCxcclxuICAgIHN0YXR1czogJ29uX3NhbGUnLFxyXG4gICAgdGFnczogWydcdTk2RjZcdTk4REYnLCAnXHU1NzVBXHU2NzlDJywgJ1x1NTA2NVx1NUVCN1x1OThERlx1NTRDMSddLFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wMS0yMlQxMDowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wMVQwODo0NTowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ3Byb2QwMTQnLFxyXG4gICAgbmFtZTogJ1x1NTE0M1x1NkMxNFx1NjhFRVx1Njc5NyBcdTc2N0RcdTY4NDNcdTZDMTRcdTZDRTFcdTZDMzQgNDgwbWwqMTVcdTc0RjZcdTY1NzRcdTdCQjEnLFxyXG4gICAgY2F0ZWdvcnlJZDogJ2NhdDUnLFxyXG4gICAgcHJpY2U6IDUyLFxyXG4gICAgb3JpZ2luYWxQcmljZTogNjUsXHJcbiAgICBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNjI1NzcyNDUyODU5LTFjMDNkNWJmMTEzNz93PTQwMCZoPTQwMCZmaXQ9Y3JvcCcsXHJcbiAgICBpbWFnZXM6IFtcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNjI1NzcyNDUyODU5LTFjMDNkNWJmMTEzNz93PTgwMCZoPTgwMCZmaXQ9Y3JvcCdcclxuICAgIF0sXHJcbiAgICBkZXNjcmlwdGlvbjogJzBcdTdDRDYwXHU4MTAyMFx1NTM2MVx1NkMxNFx1NkNFMVx1NkMzNFx1RkYwQ1x1NzY3RFx1Njg0M1x1NTQ3M1x1NkUwNVx1NzIzRFx1ODlFM1x1ODE3QicsXHJcbiAgICBkZXRhaWw6ICc8cD5cdThENjRcdTg1RDNcdTdDRDZcdTkxODdcdTRFRTNcdTdDRDZcdUZGMENcdTc3MUZcdTVCOUVcdTY3OUNcdTZDNDFcdTZERkJcdTUyQTBcdUZGMENcdTZDMTRcdTZDRTFcdTUzRTNcdTYxMUZcdUZGMENcdTU5MEZcdTY1RTVcdTVGQzVcdTU5MDdcdTk5NkVcdTU0QzE8L3A+JyxcclxuICAgIHN0b2NrOiAxODAsXHJcbiAgICBzYWxlczogNzg5LFxyXG4gICAgcmF0aW5nOiA0LjYsXHJcbiAgICByZXZpZXdDb3VudDogMzQ1LFxyXG4gICAgc3RhdHVzOiAnb25fc2FsZScsXHJcbiAgICB0YWdzOiBbJ1x1OTk2RVx1NjU5OScsICdcdTZDMTRcdTZDRTFcdTZDMzQnLCAnMFx1N0NENiddLFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wMS0wNVQwOTowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wNVQxMjozMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ3Byb2QwMTUnLFxyXG4gICAgbmFtZTogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1N0VBMlx1ODBBMCBcdTZCNjNcdTVCOTdcdTU0QzhcdTgwODlcdTgwNTQgNTAwZyoyXHU4ODhCJyxcclxuICAgIGNhdGVnb3J5SWQ6ICdjYXQ1JyxcclxuICAgIHByaWNlOiA1OCxcclxuICAgIG9yaWdpbmFsUHJpY2U6IDc4LFxyXG4gICAgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYwNzYyMzgxNDA3NS1lNTFkZjFiZGM4MmY/dz00MDAmaD00MDAmZml0PWNyb3AnLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYwNzYyMzgxNDA3NS1lNTFkZjFiZGM4MmY/dz04MDAmaD04MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgZGVzY3JpcHRpb246ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTcyNzlcdTRFQTdcdTU0QzhcdTVDMTRcdTZFRThcdTdFQTJcdTgwQTBcdUZGMENcdTZCNjNcdTVCOTdcdTRGQzRcdTVGMEZcdTk4Q0VcdTU0NzMnLFxyXG4gICAgZGV0YWlsOiAnPHA+XHU3NjdFXHU1RTc0XHU4MDAxXHU1QjU3XHU1M0Y3XHU1NEM4XHU4MDg5XHU4MDU0XHU1MUZBXHU1NEMxXHVGRjBDXHU2NzlDXHU2NzI4XHU3MThGXHU3MEU0XHU1REU1XHU4MjdBXHVGRjBDXHU4MEE1XHU3NjI2XHU3NkY4XHU5NUY0XHVGRjBDXHU4NDlDXHU5OTk5XHU2RDUzXHU5MEMxPC9wPicsXHJcbiAgICBzdG9jazogNjAsXHJcbiAgICBzYWxlczogMzM0LFxyXG4gICAgcmF0aW5nOiA0LjgsXHJcbiAgICByZXZpZXdDb3VudDogMTY3LFxyXG4gICAgc3RhdHVzOiAnb25fc2FsZScsXHJcbiAgICB0YWdzOiBbJ1x1NzI3OVx1NEVBNycsICdcdTdFQTJcdTgwQTAnLCAnXHU0RTFDXHU1MzE3XHU3RjhFXHU5OERGJ10sXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTAxLTI4VDExOjMwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTAzLTMxVDE0OjE1OjAwWidcclxuICB9XHJcbl1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09IFx1OEJBMlx1NTM1NVx1NkEyMVx1NTc1N1x1NjU3MFx1NjM2RSA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuY29uc3Qgb3JkZXJzOiBPcmRlcltdID0gW1xyXG4gIHtcclxuICAgIGlkOiAnb3JkZXIwMDEnLFxyXG4gICAgb3JkZXJObzogZ2VuZXJhdGVPcmRlck5vKCksXHJcbiAgICB1c2VySWQ6ICd1c2VyMDAxJyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgcHJvZHVjdElkOiAncHJvZDAwMicsIHByb2R1Y3ROYW1lOiAnXHU1QzBGXHU3QzczIFJlZG1pIE5vdGUgMTMgUHJvIFx1NjI0Qlx1NjczQScsIHByb2R1Y3RJbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTExNzA3MTcxNjM0LTVmODk3ZmYwMmFhOT93PTIwMCcsIHByaWNlOiAxNTk5LCBxdWFudGl0eTogMSwgc3VidG90YWw6IDE1OTkgfVxyXG4gICAgXSxcclxuICAgIHRvdGFsQW1vdW50OiAxNjQ4LFxyXG4gICAgZGlzY291bnRBbW91bnQ6IDAsXHJcbiAgICBmcmVpZ2h0QW1vdW50OiA0OSxcclxuICAgIHBheUFtb3VudDogMTY0OCxcclxuICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXHJcbiAgICBwYXltZW50TWV0aG9kOiAnd2VjaGF0JyxcclxuICAgIHBheW1lbnRUaW1lOiAnMjAyNi0wMy0xNVQxMDozMDowMFonLFxyXG4gICAgc2hpcFRpbWU6ICcyMDI2LTAzLTE1VDE0OjAwOjAwWicsXHJcbiAgICBkZWxpdmVyVGltZTogJzIwMjYtMDMtMTdUMTA6MDA6MDBaJyxcclxuICAgIGNvbXBsZXRlVGltZTogJzIwMjYtMDMtMThUMDk6MDA6MDBaJyxcclxuICAgIHJlY2VpdmVyTmFtZTogJ1x1NUYyMFx1NEUwOScsXHJcbiAgICByZWNlaXZlclBob25lOiAnMTM4KioqKjg4ODgnLFxyXG4gICAgcmVjZWl2ZXJBZGRyZXNzOiAnXHU5RUQxXHU5Rjk5XHU2QzVGXHU3NzAxXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU3Q0Q2XHU1MzgyXHU4ODU3MVx1NTNGNyBcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjYgQVx1NTMzQTZcdTUzRjdcdTY5N0MzMDFcdTVCQTQnLFxyXG4gICAgcmVtYXJrOiAnXHU4QkY3XHU1NzI4XHU1REU1XHU0RjVDXHU2NUY2XHU5NUY0XHU5MTREXHU5MDAxJyxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDMtMTVUMTA6MjU6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDMtMThUMDk6MDA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdvcmRlcjAwMicsXHJcbiAgICBvcmRlck5vOiBnZW5lcmF0ZU9yZGVyTm8oKSxcclxuICAgIHVzZXJJZDogJ3VzZXIwMDEnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBwcm9kdWN0SWQ6ICdwcm9kMDA3JywgcHJvZHVjdE5hbWU6ICdcdTRFMDlcdTgzRjEgVW5pLWJhbGwgT25lIFx1NEUyRFx1NjAyN1x1N0IxNFx1NTk1N1x1ODhDNScsIHByb2R1Y3RJbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTgzNDg1MDg4MDM0LTY5N2I1YmM1NGNjZD93PTIwMCcsIHByaWNlOiAzNSwgcXVhbnRpdHk6IDIsIHN1YnRvdGFsOiA3MCB9LFxyXG4gICAgICB7IHByb2R1Y3RJZDogJ3Byb2QwMDgnLCBwcm9kdWN0TmFtZTogJ1x1NTZGRFx1OEE4OSBLb2t1eW8gXHU2RDNCXHU5ODc1XHU2NzJDIEI1JywgcHJvZHVjdEltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MzEzNDY4NzgzNzctYTViZTIwODg4ZTU3P3c9MjAwJywgcHJpY2U6IDU4LCBxdWFudGl0eTogMywgc3VidG90YWw6IDE3NCB9XHJcbiAgICBdLFxyXG4gICAgdG90YWxBbW91bnQ6IDI0NCxcclxuICAgIGRpc2NvdW50QW1vdW50OiAxMCxcclxuICAgIGZyZWlnaHRBbW91bnQ6IDAsXHJcbiAgICBwYXlBbW91bnQ6IDIzNCxcclxuICAgIHN0YXR1czogJ3NoaXBwZWQnLFxyXG4gICAgcGF5bWVudE1ldGhvZDogJ2FsaXBheScsXHJcbiAgICBwYXltZW50VGltZTogJzIwMjYtMDQtMDJUMTQ6MjA6MDBaJyxcclxuICAgIHNoaXBUaW1lOiAnMjAyNi0wNC0wM1QwOTowMDowMFonLFxyXG4gICAgcmVjZWl2ZXJOYW1lOiAnXHU1RjIwXHU0RTA5JyxcclxuICAgIHJlY2VpdmVyUGhvbmU6ICcxMzgqKioqODg4OCcsXHJcbiAgICByZWNlaXZlckFkZHJlc3M6ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc3MDFcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTdDRDZcdTUzODJcdTg4NTcxXHU1M0Y3IFx1OUVEMVx1OUY5OVx1NkM1Rlx1NzlEMVx1NjI4MFx1NTkyN1x1NUI2NiBBXHU1MzNBNlx1NTNGN1x1Njk3QzMwMVx1NUJBNCcsXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTA0LTAyVDE0OjE1OjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTAzVDA5OjAwOjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAnb3JkZXIwMDMnLFxyXG4gICAgb3JkZXJObzogZ2VuZXJhdGVPcmRlck5vKCksXHJcbiAgICB1c2VySWQ6ICd1c2VyMDAxJyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgcHJvZHVjdElkOiAncHJvZDAwNicsIHByb2R1Y3ROYW1lOiAnXHU5QUQ4XHU3QjQ5XHU2NTcwXHU1QjY2XHVGRjA4XHU3QjJDXHU0RTAzXHU3MjQ4XHVGRjA5XHU1NDBDXHU2RDRFXHU1OTI3XHU1QjY2JywgcHJvZHVjdEltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NDQ5NDc5NTAtZmEwN2E5OGQyMzdmP3c9MjAwJywgcHJpY2U6IDQyLCBxdWFudGl0eTogMSwgc3VidG90YWw6IDQyIH1cclxuICAgIF0sXHJcbiAgICB0b3RhbEFtb3VudDogNDIsXHJcbiAgICBkaXNjb3VudEFtb3VudDogMCxcclxuICAgIGZyZWlnaHRBbW91bnQ6IDAsXHJcbiAgICBwYXlBbW91bnQ6IDQyLFxyXG4gICAgc3RhdHVzOiAncGFpZCcsXHJcbiAgICBwYXltZW50TWV0aG9kOiAnYmFsYW5jZScsXHJcbiAgICBwYXltZW50VGltZTogJzIwMjYtMDQtMDVUMTY6NDU6MDBaJyxcclxuICAgIHJlY2VpdmVyTmFtZTogJ1x1NUYyMFx1NEUwOScsXHJcbiAgICByZWNlaXZlclBob25lOiAnMTM4KioqKjg4ODgnLFxyXG4gICAgcmVjZWl2ZXJBZGRyZXNzOiAnXHU5RUQxXHU5Rjk5XHU2QzVGXHU3NzAxXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU3Q0Q2XHU1MzgyXHU4ODU3MVx1NTNGNyBcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjYgXHU1NkZFXHU0RTY2XHU5OTg2XHU4MUVBXHU2M0QwXHU3MEI5JyxcclxuICAgIHJlbWFyazogJ1x1NTZGRVx1NEU2Nlx1OTk4Nlx1ODFFQVx1NjNEMCcsXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTA0LTA1VDE2OjQwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTA1VDE2OjQ1OjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAnb3JkZXIwMDQnLFxyXG4gICAgb3JkZXJObzogZ2VuZXJhdGVPcmRlck5vKCksXHJcbiAgICB1c2VySWQ6ICd1c2VyMDAxJyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgcHJvZHVjdElkOiAncHJvZDAxMycsIHByb2R1Y3ROYW1lOiAnXHU0RTA5XHU1M0VBXHU2NzdFXHU5RjIwIFx1NTc1QVx1Njc5Q1x1NzkzQ1x1NzZEMiAxa2dcdTg4QzUnLCBwcm9kdWN0SW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU5OTU5OTgxMDc2OS1iY2RlNWExNjBkMzI/dz0yMDAnLCBwcmljZTogNjksIHF1YW50aXR5OiAyLCBzdWJ0b3RhbDogMTM4IH0sXHJcbiAgICAgIHsgcHJvZHVjdElkOiAncHJvZDAxNCcsIHByb2R1Y3ROYW1lOiAnXHU1MTQzXHU2QzE0XHU2OEVFXHU2Nzk3IFx1NzY3RFx1Njg0M1x1NkMxNFx1NkNFMVx1NkMzNCBcdTY1NzRcdTdCQjEnLCBwcm9kdWN0SW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYyNTc3MjQ1Mjg1OS0xYzAzZDViZjExMzc/dz0yMDAnLCBwcmljZTogNTIsIHF1YW50aXR5OiAxLCBzdWJ0b3RhbDogNTIgfVxyXG4gICAgXSxcclxuICAgIHRvdGFsQW1vdW50OiAxOTAsXHJcbiAgICBkaXNjb3VudEFtb3VudDogMTUsXHJcbiAgICBmcmVpZ2h0QW1vdW50OiAwLFxyXG4gICAgcGF5QW1vdW50OiAxNzUsXHJcbiAgICBzdGF0dXM6ICdwZW5kaW5nJyxcclxuICAgIHJlY2VpdmVyTmFtZTogJ1x1NUYyMFx1NEUwOScsXHJcbiAgICByZWNlaXZlclBob25lOiAnMTM4KioqKjg4ODgnLFxyXG4gICAgcmVjZWl2ZXJBZGRyZXNzOiAnXHU5RUQxXHU5Rjk5XHU2QzVGXHU3NzAxXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU3Q0Q2XHU1MzgyXHU4ODU3MVx1NTNGNyBcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjYgQVx1NTMzQTZcdTUzRjdcdTY5N0MzMDFcdTVCQTQnLFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wNC0wNlQyMDozMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wNlQyMDozMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ29yZGVyMDA1JyxcclxuICAgIG9yZGVyTm86IGdlbmVyYXRlT3JkZXJObygpLFxyXG4gICAgdXNlcklkOiAndXNlcjAwMScsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHByb2R1Y3RJZDogJ3Byb2QwMDEnLCBwcm9kdWN0TmFtZTogJ1x1NTM0RVx1NEUzQSBNYXRlQm9vayBEMTQgXHU3QjE0XHU4QkIwXHU2NzJDXHU3NTM1XHU4MTExJywgcHJvZHVjdEltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTYxODExMzMyMDYtODBjZTliODhhODUzP3c9MjAwJywgcHJpY2U6IDQyOTksIHF1YW50aXR5OiAxLCBzdWJ0b3RhbDogNDI5OSB9XHJcbiAgICBdLFxyXG4gICAgdG90YWxBbW91bnQ6IDQzNDgsXHJcbiAgICBkaXNjb3VudEFtb3VudDogMjAwLFxyXG4gICAgZnJlaWdodEFtb3VudDogNDksXHJcbiAgICBwYXlBbW91bnQ6IDQxOTcsXHJcbiAgICBzdGF0dXM6ICdkZWxpdmVyZWQnLFxyXG4gICAgcGF5bWVudE1ldGhvZDogJ3dlY2hhdCcsXHJcbiAgICBwYXltZW50VGltZTogJzIwMjYtMDMtMjBUMTE6MDA6MDBaJyxcclxuICAgIHNoaXBUaW1lOiAnMjAyNi0wMy0yMFQxNTowMDowMFonLFxyXG4gICAgZGVsaXZlclRpbWU6ICcyMDI2LTAzLTIyVDExOjMwOjAwWicsXHJcbiAgICByZWNlaXZlck5hbWU6ICdcdTVGMjBcdTRFMDknLFxyXG4gICAgcmVjZWl2ZXJQaG9uZTogJzEzOCoqKio4ODg4JyxcclxuICAgIHJlY2VpdmVyQWRkcmVzczogJ1x1OUVEMVx1OUY5OVx1NkM1Rlx1NzcwMVx1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1N0NENlx1NTM4Mlx1ODg1NzFcdTUzRjcgXHU5RUQxXHU5Rjk5XHU2QzVGXHU3OUQxXHU2MjgwXHU1OTI3XHU1QjY2IEFcdTUzM0E2XHU1M0Y3XHU2OTdDMzAxXHU1QkE0JyxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDMtMjBUMTA6NTA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDMtMjJUMTE6MzA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdvcmRlcjAwNicsXHJcbiAgICBvcmRlck5vOiBnZW5lcmF0ZU9yZGVyTm8oKSxcclxuICAgIHVzZXJJZDogJ3VzZXIwMDEnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBwcm9kdWN0SWQ6ICdwcm9kMDA5JywgcHJvZHVjdE5hbWU6ICdcdTUzNTdcdTY3ODFcdTRFQkEgXHU1NkRCXHU0RUY2XHU1OTU3XHU1RThBXHU0RTBBXHU3NTI4XHU1NEMxJywgcHJvZHVjdEltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjI3NzE3Mzk4NDQtNmE5ZjZkNWYxNGFmP3c9MjAwJywgcHJpY2U6IDE2OCwgcXVhbnRpdHk6IDEsIHN1YnRvdGFsOiAxNjggfVxyXG4gICAgXSxcclxuICAgIHRvdGFsQW1vdW50OiAyMTcsXHJcbiAgICBkaXNjb3VudEFtb3VudDogMCxcclxuICAgIGZyZWlnaHRBbW91bnQ6IDQ5LFxyXG4gICAgcGF5QW1vdW50OiAyMTcsXHJcbiAgICBzdGF0dXM6ICdjYW5jZWxsZWQnLFxyXG4gICAgcmVjZWl2ZXJOYW1lOiAnXHU1RjIwXHU0RTA5JyxcclxuICAgIHJlY2VpdmVyUGhvbmU6ICcxMzgqKioqODg4OCcsXHJcbiAgICByZWNlaXZlckFkZHJlc3M6ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc3MDFcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTdDRDZcdTUzODJcdTg4NTcxXHU1M0Y3IFx1OUVEMVx1OUY5OVx1NkM1Rlx1NzlEMVx1NjI4MFx1NTkyN1x1NUI2NiBBXHU1MzNBNlx1NTNGN1x1Njk3QzMwMVx1NUJBNCcsXHJcbiAgICByZW1hcms6ICdcdTRFMERcdTk3MDBcdTg5ODFcdTRFODYnLFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wMy0xMFQwOTowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wMy0xMFQxODowMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ29yZGVyMDA3JyxcclxuICAgIG9yZGVyTm86IGdlbmVyYXRlT3JkZXJObygpLFxyXG4gICAgdXNlcklkOiAndXNlcjAwMScsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHByb2R1Y3RJZDogJ3Byb2QwMDQnLCBwcm9kdWN0TmFtZTogJ1x1N0Y1N1x1NjI4MCBNWCBNYXN0ZXIgM1MgXHU2NUUwXHU3RUJGXHU5RjIwXHU2ODA3JywgcHJvZHVjdEltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1Mjc4NjQ1NTA0MTctN2ZkOTFmYzUxYTQ2P3c9MjAwJywgcHJpY2U6IDU5OSwgcXVhbnRpdHk6IDEsIHN1YnRvdGFsOiA1OTkgfVxyXG4gICAgXSxcclxuICAgIHRvdGFsQW1vdW50OiA2NDgsXHJcbiAgICBkaXNjb3VudEFtb3VudDogNTAsXHJcbiAgICBmcmVpZ2h0QW1vdW50OiA0OSxcclxuICAgIHBheUFtb3VudDogNTk4LFxyXG4gICAgc3RhdHVzOiAncmVmdW5kaW5nJyxcclxuICAgIHBheW1lbnRNZXRob2Q6ICdhbGlwYXknLFxyXG4gICAgcGF5bWVudFRpbWU6ICcyMDI2LTA0LTAxVDE1OjAwOjAwWicsXHJcbiAgICBzaGlwVGltZTogJzIwMjYtMDQtMDJUMTA6MDA6MDBaJyxcclxuICAgIHJlY2VpdmVyTmFtZTogJ1x1NUYyMFx1NEUwOScsXHJcbiAgICByZWNlaXZlclBob25lOiAnMTM4KioqKjg4ODgnLFxyXG4gICAgcmVjZWl2ZXJBZGRyZXNzOiAnXHU5RUQxXHU5Rjk5XHU2QzVGXHU3NzAxXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU3Q0Q2XHU1MzgyXHU4ODU3MVx1NTNGNyBcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjYgQVx1NTMzQTZcdTUzRjdcdTY5N0MzMDFcdTVCQTQnLFxyXG4gICAgcmVtYXJrOiAnXHU5RjIwXHU2ODA3XHU2RURBXHU4RjZFXHU2NzA5XHU5NUVFXHU5ODk4XHVGRjBDXHU3NTMzXHU4QkY3XHU5MDAwXHU4RDI3JyxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDQtMDFUMTQ6NTA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDRUMTA6MDA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdvcmRlcjAwOCcsXHJcbiAgICBvcmRlck5vOiBnZW5lcmF0ZU9yZGVyTm8oKSxcclxuICAgIHVzZXJJZDogJ3VzZXIwMDEnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBwcm9kdWN0SWQ6ICdwcm9kMDExJywgcHJvZHVjdE5hbWU6ICdcdTY3NEVcdTVCODEgXHU3RkJEXHU2QkRCXHU3NDAzXHU2MkNEIFx1NTM1NVx1NjJDRCcsIHByb2R1Y3RJbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNjIyMjkwMjkxNDY4LTI4ZTllY2RjYWRlMT93PTIwMCcsIHByaWNlOiAxMjksIHF1YW50aXR5OiAyLCBzdWJ0b3RhbDogMjU4IH0sXHJcbiAgICAgIHsgcHJvZHVjdElkOiAncHJvZDAxMicsIHByb2R1Y3ROYW1lOiAnXHU4RkVBXHU1MzYxXHU0RkFDIFx1NTNDQ1x1ODBBOVx1ODBDQ1x1NTMwNSAyMEwnLCBwcm9kdWN0SW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1MzA2MjQwNy05OGVlYjY0YzZhNjI/dz0yMDAnLCBwcmljZTogNzksIHF1YW50aXR5OiAxLCBzdWJ0b3RhbDogNzkgfVxyXG4gICAgXSxcclxuICAgIHRvdGFsQW1vdW50OiAzMzcsXHJcbiAgICBkaXNjb3VudEFtb3VudDogMjAsXHJcbiAgICBmcmVpZ2h0QW1vdW50OiAwLFxyXG4gICAgcGF5QW1vdW50OiAzMTcsXHJcbiAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxyXG4gICAgcGF5bWVudE1ldGhvZDogJ3dlY2hhdCcsXHJcbiAgICBwYXltZW50VGltZTogJzIwMjYtMDMtMjVUMTM6MDA6MDBaJyxcclxuICAgIHNoaXBUaW1lOiAnMjAyNi0wMy0yNVQxNjowMDowMFonLFxyXG4gICAgZGVsaXZlclRpbWU6ICcyMDI2LTAzLTI3VDE0OjAwOjAwWicsXHJcbiAgICBjb21wbGV0ZVRpbWU6ICcyMDI2LTAzLTI4VDEwOjAwOjAwWicsXHJcbiAgICByZWNlaXZlck5hbWU6ICdcdTVGMjBcdTRFMDknLFxyXG4gICAgcmVjZWl2ZXJQaG9uZTogJzEzOCoqKio4ODg4JyxcclxuICAgIHJlY2VpdmVyQWRkcmVzczogJ1x1OUVEMVx1OUY5OVx1NkM1Rlx1NzcwMVx1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1N0NENlx1NTM4Mlx1ODg1NzFcdTUzRjcgXHU5RUQxXHU5Rjk5XHU2QzVGXHU3OUQxXHU2MjgwXHU1OTI3XHU1QjY2IEFcdTUzM0E2XHU1M0Y3XHU2OTdDMzAxXHU1QkE0JyxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDMtMjVUMTI6NTA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDMtMjhUMTA6MDA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdvcmRlcjAwOScsXHJcbiAgICBvcmRlck5vOiBnZW5lcmF0ZU9yZGVyTm8oKSxcclxuICAgIHVzZXJJZDogJ3VzZXIwMDEnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBwcm9kdWN0SWQ6ICdwcm9kMDAzJywgcHJvZHVjdE5hbWU6ICdpUGFkIFx1N0IyQzEwXHU0RUUzIDY0R0IgV2lGaVx1NzI0OCcsIHByb2R1Y3RJbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTQ0MjQ0MDE1LTBkZjRiM2ZmYzZiMD93PTIwMCcsIHByaWNlOiAyNzk5LCBxdWFudGl0eTogMSwgc3VidG90YWw6IDI3OTkgfVxyXG4gICAgXSxcclxuICAgIHRvdGFsQW1vdW50OiAyODQ4LFxyXG4gICAgZGlzY291bnRBbW91bnQ6IDEwMCxcclxuICAgIGZyZWlnaHRBbW91bnQ6IDQ5LFxyXG4gICAgcGF5QW1vdW50OiAyNzk4LFxyXG4gICAgc3RhdHVzOiAnc2hpcHBlZCcsXHJcbiAgICBwYXltZW50TWV0aG9kOiAnYWxpcGF5JyxcclxuICAgIHBheW1lbnRUaW1lOiAnMjAyNi0wNC0wNFQwOTozMDowMFonLFxyXG4gICAgc2hpcFRpbWU6ICcyMDI2LTA0LTA0VDE0OjAwOjAwWicsXHJcbiAgICByZWNlaXZlck5hbWU6ICdcdTVGMjBcdTRFMDknLFxyXG4gICAgcmVjZWl2ZXJQaG9uZTogJzEzOCoqKio4ODg4JyxcclxuICAgIHJlY2VpdmVyQWRkcmVzczogJ1x1OUVEMVx1OUY5OVx1NkM1Rlx1NzcwMVx1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1N0NENlx1NTM4Mlx1ODg1NzFcdTUzRjcgXHU5RUQxXHU5Rjk5XHU2QzVGXHU3OUQxXHU2MjgwXHU1OTI3XHU1QjY2IEFcdTUzM0E2XHU1M0Y3XHU2OTdDMzAxXHU1QkE0JyxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDQtMDRUMDk6MjA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDRUMTQ6MDA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdvcmRlcjAxMCcsXHJcbiAgICBvcmRlck5vOiBnZW5lcmF0ZU9yZGVyTm8oKSxcclxuICAgIHVzZXJJZDogJ3VzZXIwMDEnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyBwcm9kdWN0SWQ6ICdwcm9kMDA1JywgcHJvZHVjdE5hbWU6ICdcdTZGMkJcdTZCNjVcdTgwMDUgVzgyME5CIFx1NTkzNFx1NjIzNFx1NUYwRlx1OTY0RFx1NTY2QVx1ODAzM1x1NjczQScsIHByb2R1Y3RJbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA1NzQwNDIwOTI4LTVlNTYwYzA2ZDMwZT93PTIwMCcsIHByaWNlOiAyNjksIHF1YW50aXR5OiAxLCBzdWJ0b3RhbDogMjY5IH0sXHJcbiAgICAgIHsgcHJvZHVjdElkOiAncHJvZDAxNScsIHByb2R1Y3ROYW1lOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU3RUEyXHU4MEEwIFx1NTRDOFx1ODA4OVx1ODA1NCA1MDBnKjJcdTg4OEInLCBwcm9kdWN0SW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYwNzYyMzgxNDA3NS1lNTFkZjFiZGM4MmY/dz0yMDAnLCBwcmljZTogNTgsIHF1YW50aXR5OiAyLCBzdWJ0b3RhbDogMTE2IH1cclxuICAgIF0sXHJcbiAgICB0b3RhbEFtb3VudDogMzg1LFxyXG4gICAgZGlzY291bnRBbW91bnQ6IDAsXHJcbiAgICBmcmVpZ2h0QW1vdW50OiAwLFxyXG4gICAgcGF5QW1vdW50OiAzODUsXHJcbiAgICBzdGF0dXM6ICdwYWlkJyxcclxuICAgIHBheW1lbnRNZXRob2Q6ICd3ZWNoYXQnLFxyXG4gICAgcGF5bWVudFRpbWU6ICcyMDI2LTA0LTA2VDExOjAwOjAwWicsXHJcbiAgICByZWNlaXZlck5hbWU6ICdcdTVGMjBcdTRFMDknLFxyXG4gICAgcmVjZWl2ZXJQaG9uZTogJzEzOCoqKio4ODg4JyxcclxuICAgIHJlY2VpdmVyQWRkcmVzczogJ1x1OUVEMVx1OUY5OVx1NkM1Rlx1NzcwMVx1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1N0NENlx1NTM4Mlx1ODg1NzFcdTUzRjcgXHU5RUQxXHU5Rjk5XHU2QzVGXHU3OUQxXHU2MjgwXHU1OTI3XHU1QjY2IEFcdTUzM0E2XHU1M0Y3XHU2OTdDMzAxXHU1QkE0JyxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDQtMDZUMTA6NTU6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDZUMTE6MDA6MDBaJ1xyXG4gIH1cclxuXVxyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT0gXHU4RDJEXHU3MjY5XHU4RjY2XHU2QTIxXHU1NzU3XHU2NTcwXHU2MzZFID09PT09PT09PT09PT09PT09PT09XHJcblxyXG5jb25zdCBjYXJ0SXRlbXM6IENhcnRJdGVtW10gPSBbXHJcbiAge1xyXG4gICAgaWQ6ICdjYXJ0MDAxJyxcclxuICAgIHByb2R1Y3RJZDogJ3Byb2QwMTQnLFxyXG4gICAgcHJvZHVjdDoge1xyXG4gICAgICBpZDogJ3Byb2QwMTQnLFxyXG4gICAgICBuYW1lOiAnXHU1MTQzXHU2QzE0XHU2OEVFXHU2Nzk3IFx1NzY3RFx1Njg0M1x1NkMxNFx1NkNFMVx1NkMzNCA0ODBtbCoxNVx1NzRGNlx1NjU3NFx1N0JCMScsXHJcbiAgICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MjU3NzI0NTI4NTktMWMwM2Q1YmYxMTM3P3c9MjAwJyxcclxuICAgICAgcHJpY2U6IDUyLFxyXG4gICAgICBvcmlnaW5hbFByaWNlOiA1OCxcclxuICAgICAgc3RvY2s6IDE4MCxcclxuICAgICAgc3RhdHVzOiAnYWN0aXZlJ1xyXG4gICAgfSxcclxuICAgIHF1YW50aXR5OiAyLFxyXG4gICAgc2VsZWN0ZWQ6IHRydWUsXHJcbiAgICBhZGRlZEF0OiAnMjAyNi0wNC0wNVQxNTowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wNVQxNTowMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ2NhcnQwMDInLFxyXG4gICAgcHJvZHVjdElkOiAncHJvZDAxMycsXHJcbiAgICBwcm9kdWN0OiB7XHJcbiAgICAgIGlkOiAncHJvZDAxMycsXHJcbiAgICAgIG5hbWU6ICdcdTRFMDlcdTUzRUFcdTY3N0VcdTlGMjAgXHU1NzVBXHU2NzlDXHU3OTNDXHU3NkQyIDFrZ1x1ODhDNScsXHJcbiAgICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1OTk1OTk4MTA3NjktYmNkZTVhMTYwZDMyP3c9MjAwJyxcclxuICAgICAgcHJpY2U6IDY5LFxyXG4gICAgICBvcmlnaW5hbFByaWNlOiA4OSxcclxuICAgICAgc3RvY2s6IDk1LFxyXG4gICAgICBzdGF0dXM6ICdhY3RpdmUnXHJcbiAgICB9LFxyXG4gICAgcXVhbnRpdHk6IDEsXHJcbiAgICBzZWxlY3RlZDogdHJ1ZSxcclxuICAgIGFkZGVkQXQ6ICcyMDI2LTA0LTA1VDE1OjA1OjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTA1VDE1OjA1OjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAnY2FydDAwMycsXHJcbiAgICBwcm9kdWN0SWQ6ICdwcm9kMDA3JyxcclxuICAgIHByb2R1Y3Q6IHtcclxuICAgICAgaWQ6ICdwcm9kMDA3JyxcclxuICAgICAgbmFtZTogJ1x1NEUwOVx1ODNGMSBVbmktYmFsbCBPbmUgXHU0RTJEXHU2MDI3XHU3QjE0XHU1OTU3XHU4OEM1XHVGRjA4MTBcdTY1MkZcdTg4QzVcdUZGMDknLFxyXG4gICAgICBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTgzNDg1MDg4MDM0LTY5N2I1YmM1NGNjZD93PTIwMCcsXHJcbiAgICAgIHByaWNlOiAzNSxcclxuICAgICAgb3JpZ2luYWxQcmljZTogNDUsXHJcbiAgICAgIHN0b2NrOiAyMDAsXHJcbiAgICAgIHN0YXR1czogJ2FjdGl2ZSdcclxuICAgIH0sXHJcbiAgICBxdWFudGl0eTogMyxcclxuICAgIHNlbGVjdGVkOiBmYWxzZSxcclxuICAgIGFkZGVkQXQ6ICcyMDI2LTA0LTA0VDIwOjAwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTA0VDIwOjAwOjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAnY2FydDAwNCcsXHJcbiAgICBwcm9kdWN0SWQ6ICdwcm9kMDEwJyxcclxuICAgIHByb2R1Y3Q6IHtcclxuICAgICAgaWQ6ICdwcm9kMDEwJyxcclxuICAgICAgbmFtZTogJ1x1NTE2Q1x1NzI1QiBcdTYzRDJcdTYzOTIgR04tQjMwNFUgNFx1NEY0RFVTQlx1NjNEMlx1NUVBNycsXHJcbiAgICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTg2MTg2NjYtZmNkMjVjODVmODJlP3c9MjAwJyxcclxuICAgICAgcHJpY2U6IDM5LFxyXG4gICAgICBvcmlnaW5hbFByaWNlOiA0OSxcclxuICAgICAgc3RvY2s6IDE1MCxcclxuICAgICAgc3RhdHVzOiAnYWN0aXZlJ1xyXG4gICAgfSxcclxuICAgIHF1YW50aXR5OiAxLFxyXG4gICAgc2VsZWN0ZWQ6IHRydWUsXHJcbiAgICBhZGRlZEF0OiAnMjAyNi0wNC0wM1QxMDozMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wM1QxMDozMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ2NhcnQwMDUnLFxyXG4gICAgcHJvZHVjdElkOiAncHJvZDAxNScsXHJcbiAgICBwcm9kdWN0OiB7XHJcbiAgICAgIGlkOiAncHJvZDAxNScsXHJcbiAgICAgIG5hbWU6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTdFQTJcdTgwQTAgXHU2QjYzXHU1Qjk3XHU1NEM4XHU4MDg5XHU4MDU0IDUwMGcqMlx1ODg4QicsXHJcbiAgICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDc2MjM4MTQwNzUtZTUxZGYxYmRjODJmP3c9MjAwJyxcclxuICAgICAgcHJpY2U6IDU4LFxyXG4gICAgICBvcmlnaW5hbFByaWNlOiA2OCxcclxuICAgICAgc3RvY2s6IDYwLFxyXG4gICAgICBzdGF0dXM6ICdhY3RpdmUnXHJcbiAgICB9LFxyXG4gICAgcXVhbnRpdHk6IDEsXHJcbiAgICBzZWxlY3RlZDogZmFsc2UsXHJcbiAgICBhZGRlZEF0OiAnMjAyNi0wNC0wMlQxNjowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wMlQxNjowMDowMFonXHJcbiAgfVxyXG5dXHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PSBcdTc1MjhcdTYyMzdcdTZBMjFcdTU3NTdcdTY1NzBcdTYzNkUgPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmNvbnN0IGN1cnJlbnRVc2VyOiBVc2VyID0ge1xyXG4gIGlkOiAndXNlcjAwMScsXHJcbiAgdXNlcm5hbWU6ICd6aGFuZ3NhbjIwMjQnLFxyXG4gIG5pY2tuYW1lOiAnXHU1RjIwXHU1NDBDXHU1QjY2JyxcclxuICBhdmF0YXI6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUzNTcxMzg3NTAwMi1kMWQwY2YzNzdmZGU/dz0yMDAmaD0yMDAmZml0PWNyb3AnLFxyXG4gIGVtYWlsOiAnemhhbmdzYW5AdXN0aC5lZHUuY24nLFxyXG4gIHBob25lOiAnMTM4KioqKjg4ODgnLFxyXG4gIGdlbmRlcjogJ21hbGUnLFxyXG4gIGJpcnRoZGF5OiAnMjAwMy0wNS0xNScsXHJcbiAgc3R1ZGVudElkOiAnMjAyMjAxMDAwMScsXHJcbiAgY29sbGVnZTogJ1x1OEJBMVx1N0I5N1x1NjczQVx1NEUwRVx1NEZFMVx1NjA2Rlx1NURFNVx1N0EwQlx1NUI2Nlx1OTY2MicsXHJcbiAgbWFqb3I6ICdcdThGNkZcdTRFRjZcdTVERTVcdTdBMEInLFxyXG4gIGdyYWRlOiAnMjAyMlx1N0VBNycsXHJcbiAgcm9sZTogJ3VzZXInLFxyXG4gIHN0YXR1czogJ2FjdGl2ZScsXHJcbiAgYmFsYW5jZTogMjU2LjgwLFxyXG4gIHBvaW50czogMzI4MCxcclxuICBsZXZlbDogMyxcclxuICBjcmVhdGVkQXQ6ICcyMDIyLTA5LTAxVDA4OjAwOjAwWicsXHJcbiAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wNlQxODowMDowMFonXHJcbn1cclxuXHJcbmNvbnN0IGFkZHJlc3NlczogQWRkcmVzc1tdID0gW1xyXG4gIHtcclxuICAgIGlkOiAnYWRkcjAwMScsXHJcbiAgICB1c2VySWQ6ICd1c2VyMDAxJyxcclxuICAgIHJlY2VpdmVyTmFtZTogJ1x1NUYyMFx1NEUwOScsXHJcbiAgICByZWNlaXZlclBob25lOiAnMTM4MTIzNDg4ODgnLFxyXG4gICAgcHJvdmluY2U6ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc3MDEnLFxyXG4gICAgY2l0eTogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMicsXHJcbiAgICBkaXN0cmljdDogJ1x1Njc3RVx1NTMxN1x1NTMzQScsXHJcbiAgICBkZXRhaWw6ICdcdTdDRDZcdTUzODJcdTg4NTcxXHU1M0Y3IFx1OUVEMVx1OUY5OVx1NkM1Rlx1NzlEMVx1NjI4MFx1NTkyN1x1NUI2NiBBXHU1MzNBNlx1NTNGN1x1Njk3QzMwMVx1NUJBNCcsXHJcbiAgICBmdWxsQWRkcmVzczogJ1x1OUVEMVx1OUY5OVx1NkM1Rlx1NzcwMVx1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1N0NENlx1NTM4Mlx1ODg1NzFcdTUzRjcgXHU5RUQxXHU5Rjk5XHU2QzVGXHU3OUQxXHU2MjgwXHU1OTI3XHU1QjY2IEFcdTUzM0E2XHU1M0Y3XHU2OTdDMzAxXHU1QkE0JyxcclxuICAgIGlzRGVmYXVsdDogdHJ1ZSxcclxuICAgIHRhZzogJ1x1NUI2Nlx1NjgyMScsXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDIyLTA5LTA1VDEwOjAwOjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAnYWRkcjAwMicsXHJcbiAgICB1c2VySWQ6ICd1c2VyMDAxJyxcclxuICAgIHJlY2VpdmVyTmFtZTogJ1x1NUYyMFx1NEUwOScsXHJcbiAgICByZWNlaXZlclBob25lOiAnMTM4MTIzNDg4ODgnLFxyXG4gICAgcHJvdmluY2U6ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc3MDEnLFxyXG4gICAgY2l0eTogJ1x1OUY1MFx1OUY1MFx1NTRDOFx1NUMxNFx1NUUwMicsXHJcbiAgICBkaXN0cmljdDogJ1x1OUY5OVx1NkM5OVx1NTMzQScsXHJcbiAgICBkZXRhaWw6ICdcdTY1ODdcdTUzMTZcdTU5MjdcdTg4NTc4XHU1M0Y3IFx1NUJCNlx1NUM1RVx1OTY2MjNcdTUzNTVcdTUxNDM1MDInLFxyXG4gICAgZnVsbEFkZHJlc3M6ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc3MDFcdTlGNTBcdTlGNTBcdTU0QzhcdTVDMTRcdTVFMDJcdTlGOTlcdTZDOTlcdTUzM0FcdTY1ODdcdTUzMTZcdTU5MjdcdTg4NTc4XHU1M0Y3IFx1NUJCNlx1NUM1RVx1OTY2MjNcdTUzNTVcdTUxNDM1MDInLFxyXG4gICAgaXNEZWZhdWx0OiBmYWxzZSxcclxuICAgIHRhZzogJ1x1NUJCNicsXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDIyLTA5LTA1VDEwOjA1OjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAnYWRkcjAwMycsXHJcbiAgICB1c2VySWQ6ICd1c2VyMDAxJyxcclxuICAgIHJlY2VpdmVyTmFtZTogJ1x1NUYyMFx1NEUwOScsXHJcbiAgICByZWNlaXZlclBob25lOiAnMTM4MTIzNDg4ODgnLFxyXG4gICAgcHJvdmluY2U6ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc3MDEnLFxyXG4gICAgY2l0eTogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMicsXHJcbiAgICBkaXN0cmljdDogJ1x1NTM1N1x1NUM5N1x1NTMzQScsXHJcbiAgICBkZXRhaWw6ICdcdTg5N0ZcdTU5MjdcdTc2RjRcdTg4NTc5Mlx1NTNGNyBcdTU0QzhcdTVERTVcdTU5MjdcdTk2NDRcdThGRDEnLFxyXG4gICAgZnVsbEFkZHJlc3M6ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc3MDFcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTUzNTdcdTVDOTdcdTUzM0FcdTg5N0ZcdTU5MjdcdTc2RjRcdTg4NTc5Mlx1NTNGNyBcdTU0QzhcdTVERTVcdTU5MjdcdTk2NDRcdThGRDEnLFxyXG4gICAgaXNEZWZhdWx0OiBmYWxzZSxcclxuICAgIHRhZzogJ1x1NTE2Q1x1NTNGOCcsXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI1LTA2LTE1VDE0OjMwOjAwWidcclxuICB9XHJcbl1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09IFx1NTkxNlx1NTM1Nlx1NkEyMVx1NTc1N1x1NjU3MFx1NjM2RSA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuLyoqIFx1NTkxNlx1NTM1Nlx1NTU0Nlx1NUJCNlx1NjU3MFx1NjM2RSAtIFx1OUVEMVx1NzlEMVx1NTkyN1x1NTQ2OFx1OEZCOVx1NTU0Nlx1NUJCNiAqL1xyXG5jb25zdCBtZXJjaGFudHM6IE1lcmNoYW50W10gPSBbXHJcbiAge1xyXG4gICAgaWQ6ICdtZXIwMDEnLFxyXG4gICAgbmFtZTogJ1x1NzlEMVx1NTkyN1x1OThERlx1NTgwMlx1NEUwMFx1Njk3QycsXHJcbiAgICBsb2dvOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTU5Mzk1OTQtNThkN2NiNTYxYWQxP3c9MjAwJmg9MjAwJmZpdD1jcm9wJyxcclxuICAgIGNvdmVySW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1NTkzOTU5NC01OGQ3Y2I1NjFhZDE/dz02MDAmaD0zMDAmZml0PWNyb3AnLFxyXG4gICAgY2F0ZWdvcnk6ICdcdTk4REZcdTU4MDInLFxyXG4gICAgcmF0aW5nOiA0LjcsXHJcbiAgICByZXZpZXdDb3VudDogMjM0NSxcclxuICAgIG1vbnRobHlTYWxlczogODkwMCxcclxuICAgIGRlbGl2ZXJ5VGltZTogJzE1LTI1XHU1MjA2XHU5NDlGJyxcclxuICAgIGRlbGl2ZXJ5RmVlOiAwLFxyXG4gICAgbWluT3JkZXJBbW91bnQ6IDEsXHJcbiAgICBhZGRyZXNzOiAnXHU5RUQxXHU5Rjk5XHU2QzVGXHU3OUQxXHU2MjgwXHU1OTI3XHU1QjY2QVx1NTMzQVx1OThERlx1NTgwMlx1NEUwMFx1Njk3QycsXHJcbiAgICBwaG9uZTogJzA0NTEtODgwMzYwMDEnLFxyXG4gICAgb3BlblRpbWU6ICcwNjozMCcsXHJcbiAgICBjbG9zZVRpbWU6ICcyMTowMCcsXHJcbiAgICBzdGF0dXM6ICdvcGVuJyxcclxuICAgIHRhZ3M6IFsnXHU3RUNGXHU2RDRFXHU1QjlFXHU2MEUwJywgJ1x1OTFDRlx1NTkyN1x1N0JBMVx1OTk3MScsICdcdTY4MjFcdTU2RURcdTk5OTZcdTkwMDknXSxcclxuICAgIGFubm91bmNlbWVudDogJ1x1NEVDQVx1NjVFNVx1NjVCMFx1NTg5RVx1N0VBMlx1NzBFN1x1NjM5Mlx1OUFBOFx1NTk1N1x1OTkxMFx1RkYwMScsXHJcbiAgICBsYXRpdHVkZTogNDUuNzk2NSxcclxuICAgIGxvbmdpdHVkZTogMTI2LjY1MDgsXHJcbiAgICBkaXN0YW5jZTogMC4yXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ21lcjAwMicsXHJcbiAgICBuYW1lOiAnXHU4NzFDXHU5NkVBXHU1MUIwXHU1N0NFXHVGRjA4XHU3OUQxXHU1OTI3XHU1RTk3XHVGRjA5JyxcclxuICAgIGxvZ286ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1ODg1NzU2My1iMzcxMDMzYmE3YzI/dz0yMDAmaD0yMDAmZml0PWNyb3AnLFxyXG4gICAgY292ZXJJbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTU4ODU3NTYzLWIzNzEwMzNiYTdjMj93PTYwMCZoPTMwMCZmaXQ9Y3JvcCcsXHJcbiAgICBjYXRlZ29yeTogJ1x1NTk3Nlx1ODMzNlx1OTk2RVx1NTRDMScsXHJcbiAgICByYXRpbmc6IDQuNSxcclxuICAgIHJldmlld0NvdW50OiAxODc2LFxyXG4gICAgbW9udGhseVNhbGVzOiAxMjUwMCxcclxuICAgIGRlbGl2ZXJ5VGltZTogJzEwLTIwXHU1MjA2XHU5NDlGJyxcclxuICAgIGRlbGl2ZXJ5RmVlOiAyLFxyXG4gICAgbWluT3JkZXJBbW91bnQ6IDEwLFxyXG4gICAgYWRkcmVzczogJ1x1OUVEMVx1OUY5OVx1NkM1Rlx1NzlEMVx1NjI4MFx1NTkyN1x1NUI2NkJcdTUzM0FcdTU1NDZcdTRFMUFcdTg4NTcxMlx1NTNGNycsXHJcbiAgICBwaG9uZTogJzA0NTEtODgwMzYxMjMnLFxyXG4gICAgb3BlblRpbWU6ICcwOTowMCcsXHJcbiAgICBjbG9zZVRpbWU6ICcyMjozMCcsXHJcbiAgICBzdGF0dXM6ICdvcGVuJyxcclxuICAgIHRhZ3M6IFsnXHU1RTczXHU0RUY3XHU1OTc2XHU4MzM2JywgJ1x1NTFCMFx1NkRDN1x1NkRDQicsICdcdTVCNjZcdTc1MUZcdTY3MDBcdTcyMzEnXSxcclxuICAgIGFubm91bmNlbWVudDogJ1x1NjdFMFx1NkFBQ1x1NkMzNFx1N0IyQ1x1NEU4Q1x1Njc2Rlx1NTM0QVx1NEVGN1x1RkYwMScsXHJcbiAgICBsYXRpdHVkZTogNDUuNzk3MixcclxuICAgIGxvbmdpdHVkZTogMTI2LjY1MTUsXHJcbiAgICBkaXN0YW5jZTogMC41XHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ21lcjAwMycsXHJcbiAgICBuYW1lOiAnXHU3NDVFXHU1RTc4XHU1NDk2XHU1NTYxXHVGRjA4XHU3OUQxXHU2MjgwXHU1OTI3XHU1M0E2XHU1RTk3XHVGRjA5JyxcclxuICAgIGxvZ286ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxMTkyMDE3MDAzMy1mODM5NjkyNGMzNDg/dz0yMDAmaD0yMDAmZml0PWNyb3AnLFxyXG4gICAgY292ZXJJbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTExOTIwMTcwMDMzLWY4Mzk2OTI0YzM0OD93PTYwMCZoPTMwMCZmaXQ9Y3JvcCcsXHJcbiAgICBjYXRlZ29yeTogJ1x1NTQ5Nlx1NTU2MScsXHJcbiAgICByYXRpbmc6IDQuNixcclxuICAgIHJldmlld0NvdW50OiA5ODcsXHJcbiAgICBtb250aGx5U2FsZXM6IDU2MDAsXHJcbiAgICBkZWxpdmVyeVRpbWU6ICcxNS0yNVx1NTIwNlx1OTQ5RicsXHJcbiAgICBkZWxpdmVyeUZlZTogMyxcclxuICAgIG1pbk9yZGVyQW1vdW50OiAyMCxcclxuICAgIGFkZHJlc3M6ICdcdTc5RDFcdTYyODBcdTU5MjdcdTUzQTZcdTRFMDBcdTVDNDJcdTU5MjdcdTUzODUnLFxyXG4gICAgcGhvbmU6ICcwNDUxLTg4MDM2NTY3JyxcclxuICAgIG9wZW5UaW1lOiAnMDc6MzAnLFxyXG4gICAgY2xvc2VUaW1lOiAnMjE6MDAnLFxyXG4gICAgc3RhdHVzOiAnb3BlbicsXHJcbiAgICB0YWdzOiBbJ1x1N0NCRVx1NTRDMVx1NTQ5Nlx1NTU2MScsICdcdTc1MUZcdTY5MzBcdTYyRkZcdTk0QzEnLCAnXHU2M0QwXHU3OTVFXHU5MTkyXHU4MTExJ10sXHJcbiAgICBhbm5vdW5jZW1lbnQ6ICdcdTY1QjBcdTU0QzFcdTRFMEFcdTVFMDJcdUZGMUFcdTZBMzFcdTgyQjFcdTgzOTNcdTgzOTNcdTgwRjZcdTUzOUZcdTkxNzhcdTU5NzZcdTUxQkInLFxyXG4gICAgbGF0aXR1ZGU6IDQ1Ljc5NTgsXHJcbiAgICBsb25naXR1ZGU6IDEyNi42NDk1LFxyXG4gICAgZGlzdGFuY2U6IDAuOFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdtZXIwMDQnLFxyXG4gICAgbmFtZTogJ1x1Njc2OFx1NTZGRFx1Nzk4Rlx1OUVCQlx1OEZBM1x1NzBFQlx1RkYwOFx1NzlEMVx1NTkyN1x1NUU5N1x1RkYwOScsXHJcbiAgICBsb2dvOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1Njk3MTgyMTIxNjUtM2E4Mjc4ZDVmNjI0P3c9MjAwJmg9MjAwJmZpdD1jcm9wJyxcclxuICAgIGNvdmVySW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU2OTcxODIxMjE2NS0zYTgyNzhkNWY2MjQ/dz02MDAmaD0zMDAmZml0PWNyb3AnLFxyXG4gICAgY2F0ZWdvcnk6ICdcdTlFQkJcdThGQTNcdTcwRUInLFxyXG4gICAgcmF0aW5nOiA0LjQsXHJcbiAgICByZXZpZXdDb3VudDogMTU2NyxcclxuICAgIG1vbnRobHlTYWxlczogNzIwMCxcclxuICAgIGRlbGl2ZXJ5VGltZTogJzIwLTMwXHU1MjA2XHU5NDlGJyxcclxuICAgIGRlbGl2ZXJ5RmVlOiAyLFxyXG4gICAgbWluT3JkZXJBbW91bnQ6IDE1LFxyXG4gICAgYWRkcmVzczogJ1x1OUVEMVx1OUY5OVx1NkM1Rlx1NzlEMVx1NjI4MFx1NTkyN1x1NUI2NkNcdTUzM0FcdTdGOEVcdTk4REZcdTVFN0ZcdTU3M0EzXHU1M0Y3JyxcclxuICAgIHBob25lOiAnMDQ1MS04ODAzNjIzNCcsXHJcbiAgICBvcGVuVGltZTogJzEwOjAwJyxcclxuICAgIGNsb3NlVGltZTogJzIyOjAwJyxcclxuICAgIHN0YXR1czogJ29wZW4nLFxyXG4gICAgdGFnczogWydcdTlFQkJcdThGQTNcdTcwRUInLCAnXHU4MUVBXHU5MDA5XHU4M0RDXHU1NEMxJywgJ1x1NTNFM1x1NTQ3M1x1NkI2M1x1NUI5NyddLFxyXG4gICAgYW5ub3VuY2VtZW50OiAnXHU2NUIwXHU3NTI4XHU2MjM3XHU5OTk2XHU1MzU1XHU3QUNCXHU1MUNGNVx1NTE0MycsXHJcbiAgICBsYXRpdHVkZTogNDUuNzk4MCxcclxuICAgIGxvbmdpdHVkZTogMTI2LjY1MjAsXHJcbiAgICBkaXN0YW5jZTogMC42XHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ21lcjAwNScsXHJcbiAgICBuYW1lOiAnXHU5RUM0XHU3MTE2XHU5RTIxXHU3QzczXHU5OTZEXHVGRjA4XHU1QjY2XHU1RTlDXHU1RTk3XHVGRjA5JyxcclxuICAgIGxvZ286ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYwMzEzMzg3Mjg3OC02ODRmMjA4ZmI4NGI/dz0yMDAmaD0yMDAmZml0PWNyb3AnLFxyXG4gICAgY292ZXJJbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNjAzMTMzODcyODc4LTY4NGYyMDhmYjg0Yj93PTYwMCZoPTMwMCZmaXQ9Y3JvcCcsXHJcbiAgICBjYXRlZ29yeTogJ1x1NUZFQlx1OTkxMFx1N0I4MFx1OTkxMCcsXHJcbiAgICByYXRpbmc6IDQuMyxcclxuICAgIHJldmlld0NvdW50OiAxMTIzLFxyXG4gICAgbW9udGhseVNhbGVzOiA0NTAwLFxyXG4gICAgZGVsaXZlcnlUaW1lOiAnMjAtMzBcdTUyMDZcdTk0OUYnLFxyXG4gICAgZGVsaXZlcnlGZWU6IDIsXHJcbiAgICBtaW5PcmRlckFtb3VudDogMTIsXHJcbiAgICBhZGRyZXNzOiAnXHU1QjY2XHU1RTlDXHU4REVGXHU4Rjg1XHU4ODU3ODhcdTUzRjcnLFxyXG4gICAgcGhvbmU6ICcwNDUxLTg4MDM2NDU2JyxcclxuICAgIG9wZW5UaW1lOiAnMTA6MDAnLFxyXG4gICAgY2xvc2VUaW1lOiAnMjE6MzAnLFxyXG4gICAgc3RhdHVzOiAnb3BlbicsXHJcbiAgICB0YWdzOiBbJ1x1OUVDNFx1NzExNlx1OUUyMScsICdcdTRFMEJcdTk5NkRcdTc5NUVcdTU2NjgnLCAnXHU1MjA2XHU5MUNGXHU4REIzJ10sXHJcbiAgICBhbm5vdW5jZW1lbnQ6ICcnLFxyXG4gICAgbGF0aXR1ZGU6IDQ1Ljc5OTAsXHJcbiAgICBsb25naXR1ZGU6IDEyNi42NTMwLFxyXG4gICAgZGlzdGFuY2U6IDEuMlxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdtZXIwMDYnLFxyXG4gICAgbmFtZTogJ1x1NkI2M1x1NjVCMFx1OUUyMVx1NjM5Mlx1RkYwOFx1NzlEMVx1NTkyN1x1NUMwRlx1NTQwM1x1ODg1N1x1RkYwOScsXHJcbiAgICBsb2dvOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MjYwODI5MjczODktOGNkMjNmMGNmZDg1P3c9MjAwJmg9MjAwJmZpdD1jcm9wJyxcclxuICAgIGNvdmVySW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYyNjA4MjkyNzM4OS04Y2QyM2YwY2ZkODU/dz02MDAmaD0zMDAmZml0PWNyb3AnLFxyXG4gICAgY2F0ZWdvcnk6ICdcdTcwQjhcdTlFMjFcdTVDMEZcdTU0MDMnLFxyXG4gICAgcmF0aW5nOiA0LjIsXHJcbiAgICByZXZpZXdDb3VudDogODkwLFxyXG4gICAgbW9udGhseVNhbGVzOiAzODAwLFxyXG4gICAgZGVsaXZlcnlUaW1lOiAnMTUtMjVcdTUyMDZcdTk0OUYnLFxyXG4gICAgZGVsaXZlcnlGZWU6IDIsXHJcbiAgICBtaW5PcmRlckFtb3VudDogMTAsXHJcbiAgICBhZGRyZXNzOiAnXHU5RUQxXHU5Rjk5XHU2QzVGXHU3OUQxXHU2MjgwXHU1OTI3XHU1QjY2XHU0RTFDXHU5NUU4XHU1QzBGXHU1NDAzXHU4ODU3MTVcdTUzRjcnLFxyXG4gICAgcGhvbmU6ICcwNDUxLTg4MDM2Nzg5JyxcclxuICAgIG9wZW5UaW1lOiAnMDk6MzAnLFxyXG4gICAgY2xvc2VUaW1lOiAnMjI6MDAnLFxyXG4gICAgc3RhdHVzOiAnb3BlbicsXHJcbiAgICB0YWdzOiBbJ1x1OUUyMVx1NjM5MicsICdcdTVDMEZcdTU0MDMnLCAnXHU4RkZEXHU1MjY3XHU1RkM1XHU1OTA3J10sXHJcbiAgICBhbm5vdW5jZW1lbnQ6ICdcdTY1QjBcdTU0QzFcdUZGMUFcdTgyOURcdTU4RUJcdTcyMDZcdTZENDZcdTlFMjFcdTYzOTJcdTRFMEFcdTVFMDInLFxyXG4gICAgbGF0aXR1ZGU6IDQ1Ljc5NzUsXHJcbiAgICBsb25naXR1ZGU6IDEyNi42NTI1LFxyXG4gICAgZGlzdGFuY2U6IDAuN1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdtZXIwMDcnLFxyXG4gICAgbmFtZTogJ1x1NUYyMFx1NEVBRVx1OUVCQlx1OEZBM1x1NjJDQ1x1RkYwOFx1Njc3RVx1NTMxN1x1NUU5N1x1RkYwOScsXHJcbiAgICBsb2dvOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1ODIxNjkyOTYxOTQtZTRkNTQ0NGVhYjlkP3c9MjAwJmg9MjAwJmZpdD1jcm9wJyxcclxuICAgIGNvdmVySW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU4MjE2OTI5NjE5NC1lNGQ1NDQ0ZWFiOWQ/dz02MDAmaD0zMDAmZml0PWNyb3AnLFxyXG4gICAgY2F0ZWdvcnk6ICdcdTlFQkJcdThGQTNcdTYyQ0MnLFxyXG4gICAgcmF0aW5nOiA0LjQsXHJcbiAgICByZXZpZXdDb3VudDogNzU2LFxyXG4gICAgbW9udGhseVNhbGVzOiAzMTAwLFxyXG4gICAgZGVsaXZlcnlUaW1lOiAnMjAtMzBcdTUyMDZcdTk0OUYnLFxyXG4gICAgZGVsaXZlcnlGZWU6IDIsXHJcbiAgICBtaW5PcmRlckFtb3VudDogMTUsXHJcbiAgICBhZGRyZXNzOiAnXHU2NzdFXHU1MzE3XHU1OTI3XHU5MDUzMTg4XHU1M0Y3JyxcclxuICAgIHBob25lOiAnMDQ1MS04ODAzNjg5MCcsXHJcbiAgICBvcGVuVGltZTogJzEwOjMwJyxcclxuICAgIGNsb3NlVGltZTogJzIxOjAwJyxcclxuICAgIHN0YXR1czogJ29wZW4nLFxyXG4gICAgdGFnczogWydcdTlFQkJcdThGQTNcdTYyQ0MnLCAnXHU0RTFDXHU1MzE3XHU3Mjc5XHU4MjcyJywgJ1x1OTE3OFx1NzUxQ1x1OEZBMyddLFxyXG4gICAgYW5ub3VuY2VtZW50OiAnJyxcclxuICAgIGxhdGl0dWRlOiA0NS44MDAwLFxyXG4gICAgbG9uZ2l0dWRlOiAxMjYuNjU0MCxcclxuICAgIGRpc3RhbmNlOiAxLjVcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAnbWVyMDA4JyxcclxuICAgIG5hbWU6ICdcdTZDOTlcdTUzQkZcdTVDMEZcdTU0MDNcdUZGMDhcdTc5RDFcdTYyODBcdThERUZcdTVFOTdcdUZGMDknLFxyXG4gICAgbG9nbzogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTY5MDU4MjQyLTY0N2QzOWFlOThiNz93PTIwMCZoPTIwMCZmaXQ9Y3JvcCcsXHJcbiAgICBjb3ZlckltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NjkwNTgyNDItNjQ3ZDM5YWU5OGI3P3c9NjAwJmg9MzAwJmZpdD1jcm9wJyxcclxuICAgIGNhdGVnb3J5OiAnXHU0RTJEXHU1RjBGXHU1RkVCXHU5OTEwJyxcclxuICAgIHJhdGluZzogNC4xLFxyXG4gICAgcmV2aWV3Q291bnQ6IDY1NCxcclxuICAgIG1vbnRobHlTYWxlczogMjgwMCxcclxuICAgIGRlbGl2ZXJ5VGltZTogJzE1LTI1XHU1MjA2XHU5NDlGJyxcclxuICAgIGRlbGl2ZXJ5RmVlOiAxLFxyXG4gICAgbWluT3JkZXJBbW91bnQ6IDgsXHJcbiAgICBhZGRyZXNzOiAnXHU3OUQxXHU2MjgwXHU4REVGNTZcdTUzRjcnLFxyXG4gICAgcGhvbmU6ICcwNDUxLTg4MDM2MTIzJyxcclxuICAgIG9wZW5UaW1lOiAnMDc6MDAnLFxyXG4gICAgY2xvc2VUaW1lOiAnMjI6MDAnLFxyXG4gICAgc3RhdHVzOiAnb3BlbicsXHJcbiAgICB0YWdzOiBbJ1x1ODRCOFx1OTk3QScsICdcdTYyQ0NcdTk3NjInLCAnXHU3MDk2XHU3RjUwJywgJ1x1NUI5RVx1NjBFMCddLFxyXG4gICAgYW5ub3VuY2VtZW50OiAnXHU2NUU5XHU5OTEwXHU2NUY2XHU2QkI1XHU0RjlCXHU1RTk0XHU1MzA1XHU1QjUwXHU4QzQ2XHU2RDQ2JyxcclxuICAgIGxhdGl0dWRlOiA0NS43OTYwLFxyXG4gICAgbG9uZ2l0dWRlOiAxMjYuNjUwMCxcclxuICAgIGRpc3RhbmNlOiAwLjRcclxuICB9XHJcbl1cclxuXHJcbi8qKiBcdTgzRENcdTU0QzFcdTZBMjFcdTY3N0ZcdTY1NzBcdTYzNkUgKi9cclxuY29uc3QgZGlzaGVzVGVtcGxhdGU6IFJlY29yZDxzdHJpbmcsIERpc2hbXT4gPSB7XHJcbiAgbWVyMDAxOiBbIC8vIFx1NzlEMVx1NTkyN1x1OThERlx1NTgwMlxyXG4gICAgeyBpZDogJ2Rpc2gwMDEnLCBtZXJjaGFudElkOiAnbWVyMDAxJywgbmFtZTogJ1x1N0VBMlx1NzBFN1x1NjM5Mlx1OUFBOFx1OTk2RCcsIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NDYwNjk5MDEtYmE5NTk5YTdlNjNjP3c9NDAwJywgcHJpY2U6IDE1LCBvcmlnaW5hbFByaWNlOiAxOCwgZGVzY3JpcHRpb246ICdcdTdDQkVcdTkwMDlcdTczMkFcdTgwOEJcdTYzOTJcdUZGMENcdTc5RDhcdTUyMzZcdTkxNzFcdTY1OTlcdTYxNjJcdTcwOTZcdUZGMENcdTkxNERcdTdDNzNcdTk5NkRcdTU0OENcdTVDMEZcdTgzREMnLCBjYXRlZ29yeTogJ1x1NzZENlx1NkQ0N1x1OTk2RCcsIHNhbGVzOiA4OTAsIHJhdGluZzogNC44LCBzdGF0dXM6ICdhdmFpbGFibGUnIGFzIGNvbnN0LCB0YWdzOiBbJ1x1NjJEQlx1NzI0QycsICdcdTgzNjRcdTgzREMnXSB9LFxyXG4gICAgeyBpZDogJ2Rpc2gwMDInLCBtZXJjaGFudElkOiAnbWVyMDAxJywgbmFtZTogJ1x1NUJBQlx1NEZERFx1OUUyMVx1NEUwMVx1OTk2RCcsIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDMxMzM4NzI4NzgtNjg0ZjIwOGZiODRiP3c9NDAwJywgcHJpY2U6IDEyLCBkZXNjcmlwdGlvbjogJ1x1OUM5Q1x1NUFFOVx1OUUyMVx1ODA4OVx1NEUwMVx1OTE0RFx1ODJCMVx1NzUxRlx1N0M3M1x1RkYwQ1x1NUZBRVx1OEZBM1x1NzIzRFx1NTNFMycsIGNhdGVnb3J5OiAnXHU3NkQ2XHU2RDQ3XHU5OTZEJywgc2FsZXM6IDc1NiwgcmF0aW5nOiA0LjYsIHN0YXR1czogJ2F2YWlsYWJsZScgYXMgY29uc3QsIHRhZ3M6IFsnXHU3RUNGXHU1MTc4JywgJ1x1NUZBRVx1OEZBMyddIH0sXHJcbiAgICB7IGlkOiAnZGlzaDAwMycsIG1lcmNoYW50SWQ6ICdtZXIwMDEnLCBuYW1lOiAnXHU5RUJCXHU1QTQ2XHU4QzQ2XHU4MTUwXHU5OTZEJywgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU4Mjg3ODgyNjYyOS0yOWI3YWQxY2RjNDM/dz00MDAnLCBwcmljZTogMTAsIGRlc2NyaXB0aW9uOiAnXHU1QUU5XHU2RUQxXHU4QzQ2XHU4MTUwXHU5MTREXHU3MzJBXHU4MDg5XHU2NzJCXHVGRjBDXHU5RUJCXHU4RkEzXHU5QzlDXHU5OTk5JywgY2F0ZWdvcnk6ICdcdTc2RDZcdTZENDdcdTk5NkQnLCBzYWxlczogNjIzLCByYXRpbmc6IDQuNSwgc3RhdHVzOiAnYXZhaWxhYmxlJyBhcyBjb25zdCwgdGFnczogWydcdTdEMjBcdTk4REZcdTUzRUZcdTkwMDknLCAnXHU0RTBCXHU5OTZEJ10gfSxcclxuICAgIHsgaWQ6ICdkaXNoMDA0JywgbWVyY2hhbnRJZDogJ21lcjAwMScsIG5hbWU6ICdcdTg5N0ZcdTdFQTJcdTY3RkZcdTlFMjFcdTg2Q0JcdTk3NjInLCBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTY5NzE4MjEyMTY1LTNhODI3OGQ1ZjYyND93PTQwMCcsIHByaWNlOiA4LCBkZXNjcmlwdGlvbjogJ1x1NjI0Qlx1NURFNVx1NjJDOVx1OTc2Mlx1OTE0RFx1NjVCMFx1OUM5Q1x1NzU2QVx1ODMwNFx1NzA5Mlx1ODZDQlx1RkYwQ1x1NkM2NFx1OUM5Q1x1NTQ3M1x1N0Y4RScsIGNhdGVnb3J5OiAnXHU5NzYyXHU5OERGJywgc2FsZXM6IDUzNCwgcmF0aW5nOiA0LjQsIHN0YXR1czogJ2F2YWlsYWJsZScgYXMgY29uc3QsIHRhZ3M6IFsnXHU5NzYyXHU5OERGJywgJ1x1NkUwNVx1NkRFMSddIH0sXHJcbiAgICB7IGlkOiAnZGlzaDAwNScsIG1lcmNoYW50SWQ6ICdtZXIwMDEnLCBuYW1lOiAnXHU5RTIxXHU4MTdGXHU1OTU3XHU5OTEwJywgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYyNjA4MjkyNzM4OS04Y2QyM2YwY2ZkODU/dz00MDAnLCBwcmljZTogMTYsIG9yaWdpbmFsUHJpY2U6IDIwLCBkZXNjcmlwdGlvbjogJ1x1NTkyN1x1OUUyMVx1ODE3Rlx1OTE0RFx1NjVGNlx1ODUyQ1x1MzAwMVx1N0M3M1x1OTk2RFx1MzAwMVx1N0QyQlx1ODNEQ1x1ODZDQlx1ODJCMVx1NkM2NCcsIGNhdGVnb3J5OiAnXHU1OTU3XHU5OTEwJywgc2FsZXM6IDQ0NSwgcmF0aW5nOiA0LjcsIHN0YXR1czogJ2F2YWlsYWJsZScgYXMgY29uc3QsIHRhZ3M6IFsnXHU4MDg5XHU5OERGXHU4MDA1JywgJ1x1OEQ4NVx1NTAzQyddIH0sXHJcbiAgICB7IGlkOiAnZGlzaDAwNicsIG1lcmNoYW50SWQ6ICdtZXIwMDEnLCBuYW1lOiAnXHU5MTc4XHU4RkEzXHU1NzFGXHU4QzQ2XHU0RTFEJywgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU2OTA1ODI0Mi02NDdkMzlhZTk4Yjc/dz00MDAnLCBwcmljZTogNiwgZGVzY3JpcHRpb246ICdcdTgxMDZcdTVBRTlcdTU3MUZcdThDNDZcdTRFMURcdUZGMENcdTkxNzhcdThGQTNcdTVGMDBcdTgwQzMnLCBjYXRlZ29yeTogJ1x1NUMwRlx1NzA5MicsIHNhbGVzOiAzNDUsIHJhdGluZzogNC4zLCBzdGF0dXM6ICdhdmFpbGFibGUnIGFzIGNvbnN0LCB0YWdzOiBbJ1x1N0QyMFx1ODNEQycsICdcdTVGMDBcdTgwQzMnXSB9XHJcbiAgXSxcclxuICBtZXIwMDI6IFsgLy8gXHU4NzFDXHU5NkVBXHU1MUIwXHU1N0NFXHJcbiAgICB7IGlkOiAnZGlzaDAwNycsIG1lcmNoYW50SWQ6ICdtZXIwMDInLCBuYW1lOiAnXHU1MUIwXHU5QzlDXHU2N0UwXHU2QUFDXHU2QzM0JywgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxMzU1ODE2MTI5My1jZGFmNzY1ZWQyZmQ/dz00MDAnLCBwcmljZTogNCwgZGVzY3JpcHRpb246ICdcdTY1QjBcdTlDOUNcdTY3RTBcdTZBQUMrXHU3RUZGXHU4MzM2XHVGRjBDXHU2RTA1XHU3MjNEXHU4OUUzXHU4MTdCJywgY2F0ZWdvcnk6ICdcdTk5NkVcdTU0QzEnLCBzYWxlczogNTY3OCwgcmF0aW5nOiA0LjcsIHN0YXR1czogJ2F2YWlsYWJsZScgYXMgY29uc3QsIHRhZ3M6IFsnXHU3MjA2XHU2QjNFJywgJ1x1NUZDNVx1NzBCOSddIH0sXHJcbiAgICB7IGlkOiAnZGlzaDAwOCcsIG1lcmNoYW50SWQ6ICdtZXIwMDInLCBuYW1lOiAnXHU3M0NEXHU3M0UwXHU1OTc2XHU4MzM2JywgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1ODg1NzU2My1iMzcxMDMzYmE3YzI/dz00MDAnLCBwcmljZTogNywgZGVzY3JpcHRpb246ICdcdTkxODdcdTk5OTlcdTdFQTJcdTgzMzYrUVx1NUYzOVx1NzNDRFx1NzNFMFx1RkYwQ1x1NzUxQ1x1ODcxQ1x1OTg3QVx1NkVEMScsIGNhdGVnb3J5OiAnXHU1OTc2XHU4MzM2Jywgc2FsZXM6IDM0NTYsIHJhdGluZzogNC42LCBzdGF0dXM6ICdhdmFpbGFibGUnIGFzIGNvbnN0LCB0YWdzOiBbJ1x1N0VDRlx1NTE3OCcsICdcdTc1MUMnXSB9LFxyXG4gICAgeyBpZDogJ2Rpc2gwMDknLCBtZXJjaGFudElkOiAnbWVyMDAyJywgbmFtZTogJ1x1ODM0OVx1ODM5M1x1NTcyM1x1NEVFMycsIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NjM4MDUwNDItNzY4NGMwMTllMWNiP3c9NDAwJywgcHJpY2U6IDYsIGRlc2NyaXB0aW9uOiAnXHU5OTk5XHU4MzQ5XHU1MUIwXHU2REM3XHU2RENCXHU5MTREXHU4MzQ5XHU4MzkzXHU2NzlDXHU5MTcxK1x1ODEwNlx1NzZBRScsIGNhdGVnb3J5OiAnXHU1MUIwXHU2REM3XHU2RENCJywgc2FsZXM6IDIzNDUsIHJhdGluZzogNC41LCBzdGF0dXM6ICdhdmFpbGFibGUnIGFzIGNvbnN0LCB0YWdzOiBbJ1x1NzUxQ1x1NTRDMScsICdcdTUxQjBcdTUxQzknXSB9LFxyXG4gICAgeyBpZDogJ2Rpc2gwMTAnLCBtZXJjaGFudElkOiAnbWVyMDAyJywgbmFtZTogJ1x1NkVFMVx1Njc2Rlx1NzY3RVx1OTk5OVx1Njc5QycsIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTY2NzkzNDMtYzczMDZjMTk3NmJjP3c9NDAwJywgcHJpY2U6IDEwLCBkZXNjcmlwdGlvbjogJ1x1NzY3RVx1OTk5OVx1Njc5Q1x1NTM5Rlx1NkM0MStcdTdFRkZcdTgzMzZcdUZGMENcdTdFRjRDXHU2RUUxXHU2RUUxJywgY2F0ZWdvcnk6ICdcdTk5NkVcdTU0QzEnLCBzYWxlczogMTg5MCwgcmF0aW5nOiA0LjQsIHN0YXR1czogJ2F2YWlsYWJsZScgYXMgY29uc3QsIHRhZ3M6IFsnXHU2QzM0XHU2NzlDXHU4MzM2JywgJ1x1OTE3OFx1NzIzRCddIH1cclxuICBdLFxyXG4gIG1lcjAwMzogWyAvLyBcdTc0NUVcdTVFNzhcdTU0OTZcdTU1NjFcclxuICAgIHsgaWQ6ICdkaXNoMDExJywgbWVyY2hhbnRJZDogJ21lcjAwMycsIG5hbWU6ICdcdTc1MUZcdTY5MzBcdTYyRkZcdTk0QzEnLCBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTExOTIwMTcwMDMzLWY4Mzk2OTI0YzM0OD93PTQwMCcsIHByaWNlOiAxOCwgZGVzY3JpcHRpb246ICdcdTUzOUFcdTY5MzBcdTRFNzMrXHU2RDUzXHU3RjI5XHU1NDk2XHU1NTYxXHVGRjBDXHU0RTFEXHU2RUQxXHU5OTk5XHU5MTg3JywgY2F0ZWdvcnk6ICdcdTU0OTZcdTU1NjEnLCBzYWxlczogMjM0NSwgcmF0aW5nOiA0LjgsIHN0YXR1czogJ2F2YWlsYWJsZScgYXMgY29uc3QsIHRhZ3M6IFsnXHU2MkRCXHU3MjRDJywgJ1x1NzIwNlx1NkIzRSddIH0sXHJcbiAgICB7IGlkOiAnZGlzaDAxMicsIG1lcmNoYW50SWQ6ICdtZXIwMDMnLCBuYW1lOiAnXHU3RjhFXHU1RjBGXHU1NDk2XHU1NTYxJywgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwOTA0MjIzOTg2MC1mNTUwY2U3MTBiOTM/dz00MDAnLCBwcmljZTogMTUsIGRlc2NyaXB0aW9uOiAnXHU3RUNGXHU1MTc4XHU3RjhFXHU1RjBGXHVGRjBDXHU2RDUzXHU5MEMxXHU5MTg3XHU4MkU2XHVGRjBDXHU2M0QwXHU3OTVFXHU5MTkyXHU4MTExJywgY2F0ZWdvcnk6ICdcdTU0OTZcdTU1NjEnLCBzYWxlczogMTU2NywgcmF0aW5nOiA0LjUsIHN0YXR1czogJ2F2YWlsYWJsZScgYXMgY29uc3QsIHRhZ3M6IFsnXHU3RUNGXHU1MTc4JywgJ1x1NjVFMFx1NTk3NiddIH0sXHJcbiAgICB7IGlkOiAnZGlzaDAxMycsIG1lcmNoYW50SWQ6ICdtZXIwMDMnLCBuYW1lOiAnXHU2QTMxXHU4MkIxXHU4MzkzXHU4MzkzXHU4MEY2XHU1MzlGXHU5MTc4XHU1OTc2XHU1MUJCJywgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ4ODQ3NzE4MTk0Ni02NDI4YTAyOTE3Nzc/dz00MDAnLCBwcmljZTogMjIsIGRlc2NyaXB0aW9uOiAnXHU1QjYzXHU4MjgyXHU5NjUwXHU1QjlBXHVGRjBDXHU2QTMxXHU4MkIxXHU5OENFXHU1NDczK1x1ODM0OVx1ODM5MytcdTgwRjZcdTUzOUZcdTg2Q0JcdTc2N0QnLCBjYXRlZ29yeTogJ1x1NzI3OVx1OEMwMycsIHNhbGVzOiA4OTAsIHJhdGluZzogNC42LCBzdGF0dXM6ICdhdmFpbGFibGUnIGFzIGNvbnN0LCB0YWdzOiBbJ1x1NjVCMFx1NTRDMScsICdcdTk2NTBcdTVCOUEnXSB9XHJcbiAgXVxyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PSBcdTRFOENcdTYyNEJcdTVFMDJcdTU3M0FcdTZBMjFcdTU3NTdcdTY1NzBcdTYzNkUgPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKiBcdTRFOENcdTYyNEJcdTcyNjlcdTU0QzFcdTUyMDZcdTdDN0IgKi9cclxuY29uc3Qgc2Vjb25kSGFuZENhdGVnb3JpZXM6IFNlY29uZEhhbmRDYXRlZ29yeVtdID0gW1xyXG4gIHsgaWQ6ICdzaGNhdDEnLCBuYW1lOiAnXHU2MjRCXHU2NzNBXHU2NTcwXHU3ODAxJywgaWNvbjogJ3NtYXJ0cGhvbmUnLCBjb3VudDogNDUgfSxcclxuICB7IGlkOiAnc2hjYXQyJywgbmFtZTogJ1x1NzUzNVx1ODExMVx1NTI5RVx1NTE2QycsIGljb246ICdsYXB0b3AnLCBjb3VudDogMzIgfSxcclxuICB7IGlkOiAnc2hjYXQzJywgbmFtZTogJ1x1NTZGRVx1NEU2Nlx1NjU1OVx1Njc1MCcsIGljb246ICdib29rJywgY291bnQ6IDEyOCB9LFxyXG4gIHsgaWQ6ICdzaGNhdDQnLCBuYW1lOiAnXHU3NTFGXHU2RDNCXHU1QkI2XHU3NTM1JywgaWNvbjogJ2hvbWUnLCBjb3VudDogMjggfSxcclxuICB7IGlkOiAnc2hjYXQ1JywgbmFtZTogJ1x1OEZEMFx1NTJBOFx1NTY2OFx1Njc1MCcsIGljb246ICdiYXNrZXRiYWxsJywgY291bnQ6IDE5IH0sXHJcbiAgeyBpZDogJ3NoY2F0NicsIG5hbWU6ICdcdTY3MERcdTk5NzBcdTk3OEJcdTUzMDUnLCBpY29uOiAndHNoaXJ0JywgY291bnQ6IDU2IH0sXHJcbiAgeyBpZDogJ3NoY2F0NycsIG5hbWU6ICdcdTdGOEVcdTU5ODZcdTYyQTRcdTgwQTQnLCBpY29uOiAnY29zbWV0aWNzJywgY291bnQ6IDIzIH0sXHJcbiAgeyBpZDogJ3NoY2F0OCcsIG5hbWU6ICdcdTUxNzZcdTRFRDZcdTk1RjJcdTdGNkUnLCBpY29uOiAnYm94JywgY291bnQ6IDQxIH1cclxuXVxyXG5cclxuLyoqIFx1NEU4Q1x1NjI0Qlx1NzI2OVx1NTRDMVx1NjU3MFx1NjM2RSAqL1xyXG5jb25zdCBzZWNvbmRIYW5kSXRlbXM6IFNlY29uZEhhbmRJdGVtW10gPSBbXHJcbiAge1xyXG4gICAgaWQ6ICdpdGVtMDAxJyxcclxuICAgIHNlbGxlcklkOiAnc2VsbGVyMDAxJyxcclxuICAgIHNlbGxlck5hbWU6ICdcdTY3NEVcdTVCNjZcdTk1N0YnLFxyXG4gICAgc2VsbGVyQXZhdGFyOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzIwOTk2NDU3ODUtNTY1OGFiZjRmZjRlP3c9MTAwJmg9MTAwJmZpdD1jcm9wJyxcclxuICAgIHRpdGxlOiAnXHU1MUZBaVBob25lIDE0IFBybyBNYXggMjU2RyBcdTZERjFcdTdBN0FcdTlFRDEnLFxyXG4gICAgZGVzY3JpcHRpb246ICdcdTUzQkJcdTVFNzRcdThEMkRcdTUxNjVcdUZGMENcdTRFMDBcdTc2RjRcdTYyMzRcdTU4RjNcdThEMzRcdTgxOUNcdTRGN0ZcdTc1MjhcdUZGMENcdTYyMTBcdTgyNzI5OVx1NjVCMFx1MzAwMlx1NzUzNVx1NkM2MFx1NTA2NVx1NUVCN1x1NUVBNjk1JVx1RkYwQ1x1NjVFMFx1NEVGQlx1NEY1NVx1N0VGNFx1NEZFRVx1OEJCMFx1NUY1NVx1MzAwMlx1OTE0RFx1NEVGNlx1OUY1MFx1NTE2OFx1RkYxQVx1NTM5Rlx1ODhDNVx1NTE0NVx1NzUzNVx1NTY2OCtcdTY1NzBcdTYzNkVcdTdFQkYrXHU4MDMzXHU2NzNBK1x1NzZEMlx1NUI1MFx1MzAwMlx1NTZFMFx1NjM2Mlx1NjVCMFx1NjczQVx1NjI0MFx1NEVFNVx1NTFGQVx1RkYwQ1x1NEVGN1x1NjgzQ1x1NTNFRlx1NUMwRlx1NTIwMFx1MzAwMicsXHJcbiAgICBpbWFnZXM6IFtcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTExNzA3MTcxNjM0LTVmODk3ZmYwMmFhOT93PTYwMCZoPTYwMCZmaXQ9Y3JvcCcsXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU5MTMzNzY3Njg4Ny1hMjE3YTY5NzBhOGE/dz02MDAmaD02MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgY2F0ZWdvcnlJZDogJ3NoY2F0MScsXHJcbiAgICBjYXRlZ29yeU5hbWU6ICdcdTYyNEJcdTY3M0FcdTY1NzBcdTc4MDEnLFxyXG4gICAgb3JpZ2luYWxQcmljZTogOTk5OSxcclxuICAgIGN1cnJlbnRQcmljZTogNTUwMCxcclxuICAgIGNvbmRpdGlvbjogJ2FsbW9zdF9uZXcnIGFzIGNvbnN0LFxyXG4gICAgY29uZGl0aW9uVGV4dDogJ1x1NTFFMFx1NEU0RVx1NTE2OFx1NjVCMCcsXHJcbiAgICBuZWdvdGlhYmxlOiB0cnVlLFxyXG4gICAgbG9jYXRpb246ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjYgQVx1NTMzQScsXHJcbiAgICB2aWV3Q291bnQ6IDIzNCxcclxuICAgIGxpa2VDb3VudDogNDUsXHJcbiAgICBjaGF0Q291bnQ6IDI4LFxyXG4gICAgc3RhdHVzOiAnb25fc2FsZScgYXMgY29uc3QsXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTA0LTAxVDEwOjAwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTA1VDE0OjMwOjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAnaXRlbTAwMicsXHJcbiAgICBzZWxsZXJJZDogJ3NlbGxlcjAwMicsXHJcbiAgICBzZWxsZXJOYW1lOiAnXHU3MzhCXHU1QjY2XHU1OUQwJyxcclxuICAgIHNlbGxlckF2YXRhcjogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDM4NzYxNjgxMDMzLTY0NjFmZmFkOGQ4MD93PTEwMCZoPTEwMCZmaXQ9Y3JvcCcsXHJcbiAgICB0aXRsZTogJ1x1NTFGQVx1OUFEOFx1NjU3MFx1NTQwQ1x1NkQ0RVx1NEUwM1x1NzI0OCtcdTRFNjBcdTk4OThcdTk2QzYgXHU1MTY4XHU1OTU3JyxcclxuICAgIGRlc2NyaXB0aW9uOiAnXHU4MDAzXHU3ODE0XHU0RTBBXHU1Q0I4XHU1MUZBXHU0RTY2XHVGRjBDXHU5QUQ4XHU2NTcwXHU0RTBBXHU0RTBCXHU1MThDK1x1N0VCRlx1NjAyN1x1NEVFM1x1NjU3MCtcdTY5ODJcdTczODdcdThCQkFcdUZGMENcdTUxNjhcdTkwRThcdTY2MkZcdTZCNjNcdTcyNDhcdUZGMENcdTY3MDlcdTVDMTFcdTkxQ0ZcdTdCMTRcdThCQjBcdTRGNDZcdTRFMERcdTVGNzFcdTU0Q0RcdTk2MDVcdThCRkJcdTMwMDJcdThGRDhcdTkwMDFcdTUzODZcdTVFNzRcdTc3MUZcdTk4OThcdTUzNzdcdTVCNTBcdTMwMDInLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU0NDk0Nzk1MC1mYTA3YTk4ZDIzN2Y/dz02MDAmaD02MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgY2F0ZWdvcnlJZDogJ3NoY2F0MycsXHJcbiAgICBjYXRlZ29yeU5hbWU6ICdcdTU2RkVcdTRFNjZcdTY1NTlcdTY3NTAnLFxyXG4gICAgb3JpZ2luYWxQcmljZTogMTIwLFxyXG4gICAgY3VycmVudFByaWNlOiA0NSxcclxuICAgIGNvbmRpdGlvbjogJ2xpZ2h0bHlfdXNlZCcgYXMgY29uc3QsXHJcbiAgICBjb25kaXRpb25UZXh0OiAnXHU4RjdCXHU1RkFFXHU0RjdGXHU3NTI4XHU3NUQ1XHU4RkY5JyxcclxuICAgIG5lZ290aWFibGU6IGZhbHNlLFxyXG4gICAgbG9jYXRpb246ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjYgXHU1NkZFXHU0RTY2XHU5OTg2JyxcclxuICAgIHZpZXdDb3VudDogMTg5LFxyXG4gICAgbGlrZUNvdW50OiA2NyxcclxuICAgIGNoYXRDb3VudDogMzQsXHJcbiAgICBzdGF0dXM6ICdvbl9zYWxlJyBhcyBjb25zdCxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDMtMjhUMTU6MDA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDRUMDk6MDA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdpdGVtMDAzJyxcclxuICAgIHNlbGxlcklkOiAnc2VsbGVyMDAzJyxcclxuICAgIHNlbGxlck5hbWU6ICdcdThENzVcdTU0MENcdTVCNjYnLFxyXG4gICAgc2VsbGVyQXZhdGFyOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDcwMDMyMTExNjktMGExZGQ3MjI4ZjJkP3c9MTAwJmg9MTAwJmZpdD1jcm9wJyxcclxuICAgIHRpdGxlOiAnXHU1MUZBXHU4MUVBXHU4ODRDXHU4RjY2IFx1NUM3MVx1NTczMFx1OEY2NiAyNlx1NUJGOCBcdTRFNURcdTYyMTBcdTY1QjAnLFxyXG4gICAgZGVzY3JpcHRpb246ICdcdTU5MjdcdTRFOENcdTRFNzBcdTc2ODRcdTVDNzFcdTU3MzBcdThGNjZcdUZGMENcdTlBOTFcdTRFODZcdTRFMERcdTUyMzBcdTRFMDBcdTVFNzRcdUZGMENcdTU2RTBcdTRFM0FcdTg5ODFcdTVCOUVcdTRFNjBcdTRFODZcdTZDQTFcdTU3MzBcdTY1QjlcdTY1M0VcdTYyNDBcdTRFRTVcdTUxRkFcdTRFODZcdTMwMDJcdTUzRDhcdTkwMUZcdTZCNjNcdTVFMzhcdUZGMENcdTUyMzlcdThGNjZcdTcwNzVcdTY1NEZcdUZGMENcdThGNkVcdTgwQ0VcdThGRDhcdTY3MDlcdTUxNkJcdTYyMTBcdTY1QjBcdTMwMDJcdTkwMDFcdThGNjZcdTk1MDFcdTU0OENcdTYyNTNcdTZDMTRcdTdCNTJcdTMwMDInLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU3MTA2ODMxNjM0NC03NWJjNzZmNzc4OTA/dz02MDAmaD02MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgY2F0ZWdvcnlJZDogJ3NoY2F0NScsXHJcbiAgICBjYXRlZ29yeU5hbWU6ICdcdThGRDBcdTUyQThcdTU2NjhcdTY3NTAnLFxyXG4gICAgb3JpZ2luYWxQcmljZTogODAwLFxyXG4gICAgY3VycmVudFByaWNlOiAzNTAsXHJcbiAgICBjb25kaXRpb246ICdsaWdodGx5X3VzZWQnIGFzIGNvbnN0LFxyXG4gICAgY29uZGl0aW9uVGV4dDogJ1x1OEY3Qlx1NUZBRVx1NEY3Rlx1NzUyOFx1NzVENVx1OEZGOScsXHJcbiAgICBuZWdvdGlhYmxlOiB0cnVlLFxyXG4gICAgbG9jYXRpb246ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjYgXHU4RjY2XHU2OERBJyxcclxuICAgIHZpZXdDb3VudDogMTU2LFxyXG4gICAgbGlrZUNvdW50OiAyMyxcclxuICAgIGNoYXRDb3VudDogMTUsXHJcbiAgICBzdGF0dXM6ICdvbl9zYWxlJyBhcyBjb25zdCxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDMtMjVUMDk6MDA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDJUMTY6MDA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdpdGVtMDA0JyxcclxuICAgIHNlbGxlcklkOiAnc2VsbGVyMDA0JyxcclxuICAgIHNlbGxlck5hbWU6ICdcdTk2NDhcdTVCNjZcdTk1N0YnLFxyXG4gICAgc2VsbGVyQXZhdGFyOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDA2NDg3Njc3OTEtMDBkY2M5OTRhNDNlP3c9MTAwJmg9MTAwJmZpdD1jcm9wJyxcclxuICAgIHRpdGxlOiAnXHU1MUZBXHU4MDU0XHU2MEYzXHU2MkVGXHU2NTUxXHU4MDA1WTcwMDBQIFx1NkUzOFx1NjIwRlx1NjcyQycsXHJcbiAgICBkZXNjcmlwdGlvbjogJzIwMjNcdTZCM0UgaTctMTM2MjBIIFJUWDQwNjAgMTZHXHU1MTg1XHU1QjU4IDUxMkdcdTU2RkFcdTYwMDFcdTMwMDJcdTczQTkzQVx1NTkyN1x1NEY1Q1x1NjVFMFx1NTM4Qlx1NTI5Qlx1RkYwQ1x1NTQwM1x1OUUyMVx1N0EzM1x1NUI5QTE0NFx1NUUyN1x1MzAwMlx1NTkxNlx1ODlDMlx1NjcwOVx1OEY3Qlx1NUZBRVx1NEY3Rlx1NzUyOFx1NzVENVx1OEZGOVx1RkYwQ1x1NjAyN1x1ODBGRFx1NUI4Q1x1N0Y4RVx1OEZEMFx1ODg0Q1x1MzAwMlx1OTAwMVx1NTM5Rlx1ODhDNVx1NzUzNVx1NkU5MCtcdTlGMjBcdTY4MDdcdTU3QUJcdTMwMDInLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ5NjE4MTEzMzIwNi04MGNlOWI4OGE4NTM/dz02MDAmaD02MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgY2F0ZWdvcnlJZDogJ3NoY2F0MicsXHJcbiAgICBjYXRlZ29yeU5hbWU6ICdcdTc1MzVcdTgxMTFcdTUyOUVcdTUxNkMnLFxyXG4gICAgb3JpZ2luYWxQcmljZTogODUwMCxcclxuICAgIGN1cnJlbnRQcmljZTogNTIwMCxcclxuICAgIGNvbmRpdGlvbjogJ2xpZ2h0bHlfdXNlZCcgYXMgY29uc3QsXHJcbiAgICBjb25kaXRpb25UZXh0OiAnXHU4RjdCXHU1RkFFXHU0RjdGXHU3NTI4XHU3NUQ1XHU4RkY5JyxcclxuICAgIG5lZ290aWFibGU6IHRydWUsXHJcbiAgICBsb2NhdGlvbjogJ1x1OUVEMVx1OUY5OVx1NkM1Rlx1NzlEMVx1NjI4MFx1NTkyN1x1NUI2NiBBXHU1MzNBJyxcclxuICAgIHZpZXdDb3VudDogMzQ1LFxyXG4gICAgbGlrZUNvdW50OiA3OCxcclxuICAgIGNoYXRDb3VudDogNTYsXHJcbiAgICBzdGF0dXM6ICdvbl9zYWxlJyBhcyBjb25zdCxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDMtMjBUMTE6MDA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDZUMTA6MDA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdpdGVtMDA1JyxcclxuICAgIHNlbGxlcklkOiAnc2VsbGVyMDA1JyxcclxuICAgIHNlbGxlck5hbWU6ICdcdTUyMThcdTVCNjZcdTU5RDAnLFxyXG4gICAgc2VsbGVyQXZhdGFyOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NDQwMDUzMTMtOTRkZGYwMjg2ZGYyP3c9MTAwJmg9MTAwJmZpdD1jcm9wJyxcclxuICAgIHRpdGxlOiAnXHU1MUZBXHU1QzBGXHU1MUIwXHU3QkIxIDkzTCBcdTVCQkZcdTgyMERcdTUzRUZcdTc1MjgnLFxyXG4gICAgZGVzY3JpcHRpb246ICdcdTY0MkNcdTVCQjZcdTVFMjZcdTRFMERcdThENzBcdUZGMENcdTRGNEVcdTRFRjdcdTUxRkFcdTMwMDJcdTUyMzZcdTUxQjdcdTY1NDhcdTY3OUNcdTU5N0RcdUZGMENcdTU2NkFcdTk3RjNcdTVDMEZcdUZGMENcdTVCQkZcdTgyMERcdTc1MjhcdTUyMUFcdTU5N0RcdTMwMDJcdTRFNzBcdTY3NjVcdTYyNERcdTc1MjhcdTRFODZcdTUzNEFcdTVFNzRcdUZGMENcdTRFNURcdTRFOTRcdTYyMTBcdTY1QjBcdTMwMDInLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU3MTE3NTQ0Mzg4MC00OWUxZDI1YjJiYzU/dz02MDAmaD02MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgY2F0ZWdvcnlJZDogJ3NoY2F0NCcsXHJcbiAgICBjYXRlZ29yeU5hbWU6ICdcdTc1MUZcdTZEM0JcdTVCQjZcdTc1MzUnLFxyXG4gICAgb3JpZ2luYWxQcmljZTogNTk5LFxyXG4gICAgY3VycmVudFByaWNlOiAyODAsXHJcbiAgICBjb25kaXRpb246ICdhbG1vc3RfbmV3JyBhcyBjb25zdCxcclxuICAgIGNvbmRpdGlvblRleHQ6ICdcdTUxRTBcdTRFNEVcdTUxNjhcdTY1QjAnLFxyXG4gICAgbmVnb3RpYWJsZTogdHJ1ZSxcclxuICAgIGxvY2F0aW9uOiAnXHU5RUQxXHU5Rjk5XHU2QzVGXHU3OUQxXHU2MjgwXHU1OTI3XHU1QjY2IENcdTUzM0FcdTU5NzNcdTc1MUZcdTVCQkZcdTgyMEQnLFxyXG4gICAgdmlld0NvdW50OiA5OCxcclxuICAgIGxpa2VDb3VudDogMzQsXHJcbiAgICBjaGF0Q291bnQ6IDE5LFxyXG4gICAgc3RhdHVzOiAnb25fc2FsZScgYXMgY29uc3QsXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTAzLTE4VDE0OjAwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTAxVDExOjMwOjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAnaXRlbTAwNicsXHJcbiAgICBzZWxsZXJJZDogJ3NlbGxlcjAwNicsXHJcbiAgICBzZWxsZXJOYW1lOiAnXHU1QjU5XHU1NDBDXHU1QjY2JyxcclxuICAgIHNlbGxlckF2YXRhcjogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA2Nzk0Nzc4MjAyLWNhZDg0Y2Y0NWYxZD93PTEwMCZoPTEwMCZmaXQ9Y3JvcCcsXHJcbiAgICB0aXRsZTogJ1x1NTFGQUFpclBvZHMgUHJvIDJcdTRFRTMgXHU1NkZEXHU4ODRDXHU2QjYzXHU1NEMxJyxcclxuICAgIGRlc2NyaXB0aW9uOiAnXHU0RUNBXHU1RTc0XHU1RTc0XHU1MjFEXHU4RDJEXHU1MTY1XHVGRjBDXHU1M0QxXHU3OTY4XHU5RjUwXHU1MTY4XHUzMDAyXHU5NjREXHU1NjZBXHU2NTQ4XHU2NzlDXHU1Rjg4XHU1OTdEXHVGRjBDXHU3QTdBXHU5NUY0XHU5N0YzXHU5ODkxXHU0RjUzXHU5QThDXHU1Rjg4XHU2OEQyXHUzMDAyXHU1NkUwXHU2MzYyXHU0RTg2XHU3RDIyXHU1QzNDXHU1OTM0XHU2MjM0XHU1RjBGXHU2MjQwXHU0RUU1XHU1MUZBXHVGRjBDXHU5MTREXHU0RUY2XHU1MTY4XHUzMDAyJyxcclxuICAgIGltYWdlczogW1xyXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE2MDAyOTQwMzc2ODEtYzgwYjRjYjViNDM0P3c9NjAwJmg9NjAwJmZpdD1jcm9wJ1xyXG4gICAgXSxcclxuICAgIGNhdGVnb3J5SWQ6ICdzaGNhdDEnLFxyXG4gICAgY2F0ZWdvcnlOYW1lOiAnXHU2MjRCXHU2NzNBXHU2NTcwXHU3ODAxJyxcclxuICAgIG9yaWdpbmFsUHJpY2U6IDE4OTksXHJcbiAgICBjdXJyZW50UHJpY2U6IDEyMDAsXHJcbiAgICBjb25kaXRpb246ICdhbG1vc3RfbmV3JyBhcyBjb25zdCxcclxuICAgIGNvbmRpdGlvblRleHQ6ICdcdTUxRTBcdTRFNEVcdTUxNjhcdTY1QjAnLFxyXG4gICAgbmVnb3RpYWJsZTogZmFsc2UsXHJcbiAgICBsb2NhdGlvbjogJ1x1OUVEMVx1OUY5OVx1NkM1Rlx1NzlEMVx1NjI4MFx1NTkyN1x1NUI2NiBCXHU1MzNBJyxcclxuICAgIHZpZXdDb3VudDogMjY3LFxyXG4gICAgbGlrZUNvdW50OiA1NixcclxuICAgIGNoYXRDb3VudDogNDIsXHJcbiAgICBzdGF0dXM6ICdvbl9zYWxlJyBhcyBjb25zdCxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDMtMTVUMTY6MDA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDNUMTU6MDA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdpdGVtMDA3JyxcclxuICAgIHNlbGxlcklkOiAnc2VsbGVyMDA3JyxcclxuICAgIHNlbGxlck5hbWU6ICdcdTU0NjhcdTVCNjZcdTk1N0YnLFxyXG4gICAgc2VsbGVyQXZhdGFyOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MTkwODUzNjA3NTMtYWYwMTE5ZjdjYmU3P3c9MTAwJmg9MTAwJmZpdD1jcm9wJyxcclxuICAgIHRpdGxlOiAnXHU1MUZBXHU4MDAzXHU3ODE0XHU1MTY4XHU1OTU3XHU4RDQ0XHU2NTk5IFx1OEJBMVx1N0I5N1x1NjczQTQwOCcsXHJcbiAgICBkZXNjcmlwdGlvbjogJ1x1NURGMlx1NjJERlx1NUY1NVx1NTNENlx1RkYwQ1x1NTFGQVx1NTE2OFx1NTk1NzQwOFx1OEQ0NFx1NjU5OVx1RkYxQVx1NzM4Qlx1OTA1M1x1NTZEQlx1NjcyQ1x1NEU2NitcdTkxNERcdTU5NTdcdTg5QzZcdTk4OTErXHU3NzFGXHU5ODk4K1x1N0IxNFx1OEJCMFx1MzAwMlx1NTE2OFx1NjYyRlx1N0NCRVx1NTM0RVx1NjU3NFx1NzQwNlx1RkYwQ1x1NzcwMVx1NTNCQlx1ODFFQVx1NURGMVx1NjU3NFx1NzQwNlx1NzY4NFx1NjVGNlx1OTVGNFx1MzAwMicsXHJcbiAgICBpbWFnZXM6IFtcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTMyMDEyMTk3MjY3LWRhODRkMTI3ZTc2NT93PTYwMCZoPTYwMCZmaXQ9Y3JvcCdcclxuICAgIF0sXHJcbiAgICBjYXRlZ29yeUlkOiAnc2hjYXQzJyxcclxuICAgIGNhdGVnb3J5TmFtZTogJ1x1NTZGRVx1NEU2Nlx1NjU1OVx1Njc1MCcsXHJcbiAgICBvcmlnaW5hbFByaWNlOiAzMDAsXHJcbiAgICBjdXJyZW50UHJpY2U6IDEyMCxcclxuICAgIGNvbmRpdGlvbjogJ21vZGVyYXRlbHlfdXNlZCcgYXMgY29uc3QsXHJcbiAgICBjb25kaXRpb25UZXh0OiAnXHU0RTJEXHU3QjQ5XHU0RjdGXHU3NTI4XHU3QTBCXHU1RUE2JyxcclxuICAgIG5lZ290aWFibGU6IGZhbHNlLFxyXG4gICAgbG9jYXRpb246ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjYgXHU1NkZFXHU0RTY2XHU5OTg2XHU4MUVBXHU0RTYwXHU1QkE0JyxcclxuICAgIHZpZXdDb3VudDogNDIzLFxyXG4gICAgbGlrZUNvdW50OiAxMzQsXHJcbiAgICBjaGF0Q291bnQ6IDg5LFxyXG4gICAgc3RhdHVzOiAnb25fc2FsZScgYXMgY29uc3QsXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTAzLTEwVDA5OjAwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTA1VDE4OjAwOjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAnaXRlbTAwOCcsXHJcbiAgICBzZWxsZXJJZDogJ3NlbGxlcjAwOCcsXHJcbiAgICBzZWxsZXJOYW1lOiAnXHU1NDM0XHU1NDBDXHU1QjY2JyxcclxuICAgIHNlbGxlckF2YXRhcjogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTM0NTI4NzQxNzc1LTUzOTk0YTY5ZGFlYj93PTEwMCZoPTEwMCZmaXQ9Y3JvcCcsXHJcbiAgICB0aXRsZTogJ1x1NTFGQVx1NzQ1Q1x1NEYzRFx1NTdBQiBcdTUyQTBcdTUzOUFcdTk2MzJcdTZFRDEgXHU5MDAxXHU2NTM2XHU3RUIzXHU4ODhCJyxcclxuICAgIGRlc2NyaXB0aW9uOiAnXHU0RTcwXHU0RTg2XHU2Q0ExXHU3RUMzXHU1MUUwXHU2QjIxXHVGRjBDXHU1N0ZBXHU2NzJDXHU1MTY4XHU2NUIwXHUzMDAyXHU1MkEwXHU1MzlBMTBtbVx1RkYwQ1x1OTYzMlx1NkVEMVx1NjU0OFx1Njc5Q1x1NTk3RFx1RkYwQ1x1OTg5Q1x1ODI3Mlx1N0M4OVx1N0QyQlx1ODI3Mlx1NUY4OFx1NTk3RFx1NzcwQlx1MzAwMlx1OTAwMVx1NzQ1Q1x1NEYzRFx1NzgxNlx1NTQ4Q1x1NUYzOVx1NTI5Qlx1NUUyNlx1MzAwMicsXHJcbiAgICBpbWFnZXM6IFtcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNjAxOTI1MjYwMzY4LWFlMmY4M2NmOGI3Zj93PTYwMCZoPTYwMCZmaXQ9Y3JvcCdcclxuICAgIF0sXHJcbiAgICBjYXRlZ29yeUlkOiAnc2hjYXQ1JyxcclxuICAgIGNhdGVnb3J5TmFtZTogJ1x1OEZEMFx1NTJBOFx1NTY2OFx1Njc1MCcsXHJcbiAgICBvcmlnaW5hbFByaWNlOiA4OSxcclxuICAgIGN1cnJlbnRQcmljZTogMzUsXHJcbiAgICBjb25kaXRpb246ICdicmFuZF9uZXcnIGFzIGNvbnN0LFxyXG4gICAgY29uZGl0aW9uVGV4dDogJ1x1NTE2OFx1NjVCMCcsXHJcbiAgICBuZWdvdGlhYmxlOiB0cnVlLFxyXG4gICAgbG9jYXRpb246ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjYgXHU0RjUzXHU4MEIyXHU5OTg2JyxcclxuICAgIHZpZXdDb3VudDogODcsXHJcbiAgICBsaWtlQ291bnQ6IDIzLFxyXG4gICAgY2hhdENvdW50OiAxMixcclxuICAgIHN0YXR1czogJ29uX3NhbGUnIGFzIGNvbnN0LFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wMy0wOFQxMzowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wMy0zMFQxMDowMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ2l0ZW0wMDknLFxyXG4gICAgc2VsbGVySWQ6ICdzZWxsZXIwMDknLFxyXG4gICAgc2VsbGVyTmFtZTogJ1x1OTBEMVx1NUI2Nlx1NTlEMCcsXHJcbiAgICBzZWxsZXJBdmF0YXI6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU4MDQ4OTk0NDc2MS0xNWExOWQ2NTQ5NTY/dz0xMDAmaD0xMDAmZml0PWNyb3AnLFxyXG4gICAgdGl0bGU6ICdcdTUxRkFcdTUzMTZcdTU5ODZcdTU0QzFcdTU5NTdcdTg4QzUgXHU1MTcwXHU4NTNCXHU5NkM1XHU4QkQ3XHU1MTcwXHU5RURCXHU3QjQ5JyxcclxuICAgIGRlc2NyaXB0aW9uOiAnXHU2NTM2XHU2MkZFXHU0RTFDXHU4OTdGXHU1M0QxXHU3M0IwXHU1OTdEXHU1OTFBXHU1M0VBXHU3NTI4XHU0RTg2XHU0RTAwXHU3MEI5XHU3Njg0XHU2MkE0XHU4MEE0XHU1NEMxXHU1NDhDXHU1MzE2XHU1OTg2XHU1NEMxXHVGRjBDXHU5MEZEXHU2NjJGXHU2QjYzXHU1NEMxXHU0RTEzXHU2N0RDXHU4RDJEXHU1MTY1XHUzMDAyXHU1MTcwXHU4NTNCXHU3Qzg5XHU1RTk1XHU2REIyXHU3NTI4XHU0RTg2MS8zXHVGRjBDXHU5NkM1XHU4QkQ3XHU1MTcwXHU5RURCXHU1QzBGXHU2ODM3XHU1MTY4XHU2NUIwXHVGRjBDXHU4RkQ4XHU2NzA5XHU1MUUwXHU0RTJBXHU1M0UzXHU3RUEyXHU4QkQ1XHU4MjcyXHU0RTAwXHU0RTI0XHU2QjIxXHUzMDAyJyxcclxuICAgIGltYWdlczogW1xyXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1OTY0NjI1MDIyNzgtMjdiZmRjNDAzMzQ4P3c9NjAwJmg9NjAwJmZpdD1jcm9wJ1xyXG4gICAgXSxcclxuICAgIGNhdGVnb3J5SWQ6ICdzaGNhdDcnLFxyXG4gICAgY2F0ZWdvcnlOYW1lOiAnXHU3RjhFXHU1OTg2XHU2MkE0XHU4MEE0JyxcclxuICAgIG9yaWdpbmFsUHJpY2U6IDI1MDAsXHJcbiAgICBjdXJyZW50UHJpY2U6IDY4MCxcclxuICAgIGNvbmRpdGlvbjogJ2xpZ2h0bHlfdXNlZCcgYXMgY29uc3QsXHJcbiAgICBjb25kaXRpb25UZXh0OiAnXHU4RjdCXHU1RkFFXHU0RjdGXHU3NTI4XHU3NUQ1XHU4RkY5JyxcclxuICAgIG5lZ290aWFibGU6IHRydWUsXHJcbiAgICBsb2NhdGlvbjogJ1x1OUVEMVx1OUY5OVx1NkM1Rlx1NzlEMVx1NjI4MFx1NTkyN1x1NUI2NiBDXHU1MzNBXHU1OTczXHU3NTFGXHU1QkJGXHU4MjBEJyxcclxuICAgIHZpZXdDb3VudDogMjM0LFxyXG4gICAgbGlrZUNvdW50OiA4OSxcclxuICAgIGNoYXRDb3VudDogNjcsXHJcbiAgICBzdGF0dXM6ICdvbl9zYWxlJyBhcyBjb25zdCxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDMtMDVUMTA6MDA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDRUMTQ6MDA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdpdGVtMDEwJyxcclxuICAgIHNlbGxlcklkOiAnc2VsbGVyMDEwJyxcclxuICAgIHNlbGxlck5hbWU6ICdcdTlFQzRcdTVCNjZcdTk1N0YnLFxyXG4gICAgc2VsbGVyQXZhdGFyOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NjM0NTMwOTExODUtNjE1ODIwNDRkNTU2P3c9MTAwJmg9MTAwJmZpdD1jcm9wJyxcclxuICAgIHRpdGxlOiAnXHU1MUZBXHU2Mjk1XHU1RjcxXHU0RUVBIFx1Njc4MVx1N0M3M1o2WCBcdTVCQjZcdTVFQURcdTVGNzFcdTk2NjInLFxyXG4gICAgZGVzY3JpcHRpb246ICdcdTU3MjhcdTVCQkZcdTgyMERcdTc3MEJcdTUyNjdcdTU5MkFcdTcyM0RcdTRFODZcdUZGMENcdTRGNDZcdTY2MkZcdTg5ODFcdTZCRDVcdTRFMUFcdTRFODZcdTVFMjZcdTRFMERcdThENzBcdTMwMDIxMDgwUFx1NTIwNlx1OEZBOFx1NzM4N1x1RkYwQ1x1ODFFQVx1NTJBOFx1NUJGOVx1NzEyNlx1NjhBRlx1NUY2Mlx1NjgyMVx1NkI2M1x1RkYwQ1x1NTE4NVx1N0Y2RVx1OTdGM1x1NTRDRFx1NjU0OFx1Njc5Q1x1NEUwRFx1OTUxOVx1MzAwMlx1OTE0RFx1NEVGNlx1NTE2OFx1MzAwMicsXHJcbiAgICBpbWFnZXM6IFtcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTg1MDYwNTQ0ODEyLTZiNDU3NDJkNzYyZj93PTYwMCZoPTYwMCZmaXQ9Y3JvcCdcclxuICAgIF0sXHJcbiAgICBjYXRlZ29yeUlkOiAnc2hjYXQ0JyxcclxuICAgIGNhdGVnb3J5TmFtZTogJ1x1NzUxRlx1NkQzQlx1NUJCNlx1NzUzNScsXHJcbiAgICBvcmlnaW5hbFByaWNlOiAzNTk5LFxyXG4gICAgY3VycmVudFByaWNlOiAxODAwLFxyXG4gICAgY29uZGl0aW9uOiAnbGlnaHRseV91c2VkJyBhcyBjb25zdCxcclxuICAgIGNvbmRpdGlvblRleHQ6ICdcdThGN0JcdTVGQUVcdTRGN0ZcdTc1MjhcdTc1RDVcdThGRjknLFxyXG4gICAgbmVnb3RpYWJsZTogdHJ1ZSxcclxuICAgIGxvY2F0aW9uOiAnXHU5RUQxXHU5Rjk5XHU2QzVGXHU3OUQxXHU2MjgwXHU1OTI3XHU1QjY2IEFcdTUzM0FcdTc1MzdcdTc1MUZcdTVCQkZcdTgyMEQnLFxyXG4gICAgdmlld0NvdW50OiAxNzgsXHJcbiAgICBsaWtlQ291bnQ6IDQ1LFxyXG4gICAgY2hhdENvdW50OiAzMixcclxuICAgIHN0YXR1czogJ29uX3NhbGUnIGFzIGNvbnN0LFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wMy0wMlQxNTowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wMlQwOTozMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ2l0ZW0wMTEnLFxyXG4gICAgc2VsbGVySWQ6ICdzZWxsZXIwMTEnLFxyXG4gICAgc2VsbGVyTmFtZTogJ1x1Njc5N1x1NTQwQ1x1NUI2NicsXHJcbiAgICBzZWxsZXJBdmF0YXI6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUzMTc0NjAyMDc5OC1lNjk1M2M2ZThlMDQ/dz0xMDAmaD0xMDAmZml0PWNyb3AnLFxyXG4gICAgdGl0bGU6ICdcdTUxRkFcdTdGQkRcdTdFRDJcdTY3MEQgXHU2Q0UyXHU1M0Y4XHU3NjdCXHU0RTJEXHU5NTdGXHU2QjNFIFNcdTc4MDEnLFxyXG4gICAgZGVzY3JpcHRpb246ICdcdTRFNzBcdTU5MjdcdTRFODZcdTdBN0ZcdTRFMERcdTRFODZcdUZGMENcdTU0MEFcdTcyNENcdThGRDhcdTU3MjhcdTMwMDJcdTZDRTJcdTUzRjhcdTc2N0JcdTVCOThcdTY1QjlcdTY1RDdcdTgyMzBcdTVFOTdcdThEMkRcdTUxNjVcdUZGMENcdTUxNDVcdTdFRDJcdTkxQ0ZcdTVGODhcdTlBRDhcdUZGMENcdTk2RjZcdTRFMEJcdTRFOENcdTUzNDFcdTVFQTZcdTVCOENcdTUxNjhcdTZDQTFcdTk1RUVcdTk4OThcdTMwMDJcdTlFRDFcdTgyNzJcdTRFMkRcdTk1N0ZcdTZCM0VcdUZGMENcdTY2M0VcdTc2MjZcdTUzQzhcdTRGRERcdTY2OTZcdTMwMDInLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUzOTUzMzAxODQ0Ny02M2ZjY2UyNjc4ZTM/dz02MDAmaD02MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgY2F0ZWdvcnlJZDogJ3NoY2F0NicsXHJcbiAgICBjYXRlZ29yeU5hbWU6ICdcdTY3MERcdTk5NzBcdTk3OEJcdTUzMDUnLFxyXG4gICAgb3JpZ2luYWxQcmljZTogMTI5OSxcclxuICAgIGN1cnJlbnRQcmljZTogNjAwLFxyXG4gICAgY29uZGl0aW9uOiAnYnJhbmRfbmV3JyBhcyBjb25zdCxcclxuICAgIGNvbmRpdGlvblRleHQ6ICdcdTUxNjhcdTY1QjAnLFxyXG4gICAgbmVnb3RpYWJsZTogdHJ1ZSxcclxuICAgIGxvY2F0aW9uOiAnXHU5RUQxXHU5Rjk5XHU2QzVGXHU3OUQxXHU2MjgwXHU1OTI3XHU1QjY2IEJcdTUzM0EnLFxyXG4gICAgdmlld0NvdW50OiAxNDUsXHJcbiAgICBsaWtlQ291bnQ6IDM4LFxyXG4gICAgY2hhdENvdW50OiAyNSxcclxuICAgIHN0YXR1czogJ29uX3NhbGUnIGFzIGNvbnN0LFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wMi0yOFQxMTowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wMVQxNjowMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ2l0ZW0wMTInLFxyXG4gICAgc2VsbGVySWQ6ICdzZWxsZXIwMTInLFxyXG4gICAgc2VsbGVyTmFtZTogJ1x1OUE2Q1x1NUI2Nlx1OTU3RicsXHJcbiAgICBzZWxsZXJBdmF0YXI6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNzAwMzIxMTE2OS0wYTFkZDcyMjhmMmQ/dz0xMDAmaD0xMDAmZml0PWNyb3AnLFxyXG4gICAgdGl0bGU6ICdcdTUxRkFTd2l0Y2hcdTZFMzhcdTYyMEZcdTY3M0EgXHU2NUU1XHU3MjQ4IE9MRUQgXHU3RUVEXHU4MjJBXHU1ODlFXHU1RjNBJyxcclxuICAgIGRlc2NyaXB0aW9uOiAnXHU1RTI2XHU1ODVFXHU1QzE0XHU4RkJFXHU0RjIwXHU4QkY0XHU2NUY3XHU5MUNFXHU0RTRCXHU2MDZGK1x1OUE2Q1x1OTFDQ1x1NTk2NVx1OEQ1Qlx1OEY2NjgrXHU1MkE4XHU3MjY5XHU2OEVFXHU1M0NCXHU0RjFBXHU0RTA5XHU0RTJBXHU2RTM4XHU2MjBGXHU1MzYxXHU1RTI2XHVGRjBDXHU4RkQ4XHU2NzA5UHJvXHU2MjRCXHU2N0M0XHUzMDAyXHU2NzNBXHU1NjY4XHU2MjEwXHU4MjcyXHU1Rjg4XHU1OTdEXHVGRjBDXHU2NUUwXHU0RUZCXHU0RjU1XHU5NUVFXHU5ODk4XHUzMDAyJyxcclxuICAgIGltYWdlczogW1xyXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NzgzMDM1MTI1OTctODFlNmNjMTU1YjNlP3c9NjAwJmg9NjAwJmZpdD1jcm9wJ1xyXG4gICAgXSxcclxuICAgIGNhdGVnb3J5SWQ6ICdzaGNhdDEnLFxyXG4gICAgY2F0ZWdvcnlOYW1lOiAnXHU2MjRCXHU2NzNBXHU2NTcwXHU3ODAxJyxcclxuICAgIG9yaWdpbmFsUHJpY2U6IDMyMDAsXHJcbiAgICBjdXJyZW50UHJpY2U6IDIxMDAsXHJcbiAgICBjb25kaXRpb246ICdsaWdodGx5X3VzZWQnIGFzIGNvbnN0LFxyXG4gICAgY29uZGl0aW9uVGV4dDogJ1x1OEY3Qlx1NUZBRVx1NEY3Rlx1NzUyOFx1NzVENVx1OEZGOScsXHJcbiAgICBuZWdvdGlhYmxlOiBmYWxzZSxcclxuICAgIGxvY2F0aW9uOiAnXHU5RUQxXHU5Rjk5XHU2QzVGXHU3OUQxXHU2MjgwXHU1OTI3XHU1QjY2IEFcdTUzM0EnLFxyXG4gICAgdmlld0NvdW50OiAzMTIsXHJcbiAgICBsaWtlQ291bnQ6IDk4LFxyXG4gICAgY2hhdENvdW50OiA3MyxcclxuICAgIHN0YXR1czogJ29uX3NhbGUnIGFzIGNvbnN0LFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wMi0yNVQxNDowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wNlQwODowMDowMFonXHJcbiAgfVxyXG5dXHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PSBcdTc5M0VcdTUzM0FcdThCQkFcdTU3NUJcdTZBMjFcdTU3NTdcdTY1NzBcdTYzNkUgPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbi8qKiBcdThCQkFcdTU3NUJcdTY3N0ZcdTU3NTdcdTY1NzBcdTYzNkUgKi9cclxuY29uc3QgZm9ydW1Cb2FyZHM6IEZvcnVtQm9hcmRbXSA9IFtcclxuICB7IGlkOiAnYm9hcmQxJywgbmFtZTogJ1x1NjgyMVx1NTZFRFx1NzUxRlx1NkQzQicsIGRlc2NyaXB0aW9uOiAnXHU1MjA2XHU0RUFCXHU2ODIxXHU1NkVEXHU2NUU1XHU1RTM4XHUzMDAxXHU3NTFGXHU2RDNCXHU3RUNGXHU5QThDJywgaWNvbjogJ3NjaG9vbCcsIHBvc3RDb3VudDogMzQ1NiwgdG9kYXlQb3N0Q291bnQ6IDIzLCBzb3J0T3JkZXI6IDEgfSxcclxuICB7IGlkOiAnYm9hcmQyJywgbmFtZTogJ1x1NUI2Nlx1NjcyRlx1NEVBNFx1NkQ0MScsIGRlc2NyaXB0aW9uOiAnXHU4QkZFXHU3QTBCXHU4QkE4XHU4QkJBXHUzMDAxXHU1QjY2XHU0RTYwXHU4RDQ0XHU2RTkwXHU1MjA2XHU0RUFCJywgaWNvbjogJ2Jvb2stb3BlbicsIHBvc3RDb3VudDogMjEzNCwgdG9kYXlQb3N0Q291bnQ6IDE1LCBzb3J0T3JkZXI6IDIgfSxcclxuICB7IGlkOiAnYm9hcmQzJywgbmFtZTogJ1x1NkM0Mlx1ODA0Q1x1NjJEQlx1ODA1OCcsIGRlc2NyaXB0aW9uOiAnXHU1QjlFXHU0RTYwXHU2ODIxXHU2MkRCXHUzMDAxXHU4MDRDXHU1NzNBXHU3RUNGXHU5QThDXHU0RUE0XHU2RDQxJywgaWNvbjogJ2JyaWVmY2FzZScsIHBvc3RDb3VudDogMTU2NywgdG9kYXlQb3N0Q291bnQ6IDgsIHNvcnRPcmRlcjogMyB9LFxyXG4gIHsgaWQ6ICdib2FyZDQnLCBuYW1lOiAnXHU1OTMxXHU3MjY5XHU2MkRCXHU5ODg2JywgZGVzY3JpcHRpb246ICdcdTRFMjJcdTU5MzFcdTcyNjlcdTU0QzFcdTUzRDFcdTVFMDNcdTMwMDFcdTYzNjFcdTUyMzBcdTcyNjlcdTU0QzFcdTc2N0JcdThCQjAnLCBpY29uOiAnc2VhcmNoJywgcG9zdENvdW50OiA4OTAsIHRvZGF5UG9zdENvdW50OiA1LCBzb3J0T3JkZXI6IDQgfSxcclxuICB7IGlkOiAnYm9hcmQ1JywgbmFtZTogJ1x1NEU4Q1x1NjI0Qlx1NEVBNFx1NjYxMycsIGRlc2NyaXB0aW9uOiAnXHU5NUYyXHU3RjZFXHU3MjY5XHU1NEMxXHU4RjZDXHU4QkE5XHUzMDAxXHU2QzQyXHU4RDJEXHU0RkUxXHU2MDZGJywgaWNvbjogJ3JlcGVhdCcsIHBvc3RDb3VudDogMTIzNCwgdG9kYXlQb3N0Q291bnQ6IDEyLCBzb3J0T3JkZXI6IDUgfSxcclxuICB7IGlkOiAnYm9hcmQ2JywgbmFtZTogJ1x1NjBDNVx1NjExRlx1NjgxMVx1NkQxRScsIGRlc2NyaXB0aW9uOiAnXHU1MzNGXHU1NDBEXHU1MDNFXHU4QkM5XHUzMDAxXHU2MEM1XHU2MTFGXHU0RUE0XHU2RDQxJywgaWNvbjogJ2hlYXJ0JywgcG9zdENvdW50OiAyNjc4LCB0b2RheVBvc3RDb3VudDogMTgsIHNvcnRPcmRlcjogNiB9XHJcbl1cclxuXHJcbi8qKiBcdTVFMTZcdTVCNTBcdTY1NzBcdTYzNkUgKi9cclxuY29uc3QgZm9ydW1Qb3N0czogRm9ydW1Qb3N0W10gPSBbXHJcbiAge1xyXG4gICAgaWQ6ICdwb3N0MDAxJyxcclxuICAgIGF1dGhvcklkOiAnYXV0aG9yMDAxJyxcclxuICAgIGF1dGhvck5hbWU6ICdcdThCQTFcdTdCOTdcdTY3M0FcdTVDMEZcdTczOEInLFxyXG4gICAgYXV0aG9yQXZhdGFyOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NzIwOTk2NDU3ODUtNTY1OGFiZjRmZjRlP3c9MTAwJmg9MTAwJmZpdD1jcm9wJyxcclxuICAgIGJvYXJkSWQ6ICdib2FyZDEnLFxyXG4gICAgYm9hcmROYW1lOiAnXHU2ODIxXHU1NkVEXHU3NTFGXHU2RDNCJyxcclxuICAgIHRpdGxlOiAnXHUzMDEwXHU3RUNGXHU5QThDXHU1MjA2XHU0RUFCXHUzMDExXHU1OTI3XHU0RTAwXHU1MjMwXHU1OTI3XHU1NkRCXHU3Njg0XHU3NTFGXHU1QjU4XHU2MzA3XHU1MzU3XHVGRjBDXHU1RUZBXHU4QkFFXHU2NTM2XHU4NUNGXHVGRjAxJyxcclxuICAgIGNvbnRlbnQ6ICdcdTRGNUNcdTRFM0FcdTRFMDBcdTRFMkFcdTUzNzNcdTVDMDZcdTZCRDVcdTRFMUFcdTc2ODRcdTU5MjdcdTU2REJcdTVCNjZcdTk1N0ZcdUZGMENcdTYwRjNcdTdFRDlcdTVCNjZcdTVGMUZcdTVCNjZcdTU5QjlcdTRFRUNcdTRFMDBcdTRFOUJcdTc3MUZcdThCREFcdTc2ODRcdTVFRkFcdThCQUVcdUZGMUFcXG5cXG4xLiBcdTU5MjdcdTRFMDBcdUZGMUFcdTU5MUFcdTUzQzJcdTUyQTBcdTc5M0VcdTU2RTJcdTZEM0JcdTUyQThcdUZGMENcdTRGNDZcdTRFMERcdTg5ODFcdThEMkFcdTU5MUFcdUZGMEMxLTJcdTRFMkFcdThEQjNcdTU5MUZcXG4yLiBcdTU5MjdcdTRFOENcdUZGMUFcdTVGMDBcdTU5Q0JcdTUxNzNcdTZDRThcdTRFMTNcdTRFMUFcdThCRkVcdUZGMENHUEFcdTVGODhcdTkxQ0RcdTg5ODFcXG4zLiBcdTU5MjdcdTRFMDlcdUZGMUFcdTUxQzZcdTU5MDdcdTgwMDNcdTc4MTRcdTYyMTZcdTYyN0VcdTVCOUVcdTRFNjBcdUZGMENcdThEOEFcdTY1RTlcdThEOEFcdTU5N0RcXG40LiBcdTU5MjdcdTU2REJcdUZGMUFcdThCQkFcdTY1ODdcdTg5ODFcdTYzRDBcdTUyNERcdTUxOTlcdUZGMENcdTUyMkJcdTYyRDZcdTUyMzBcdTY3MDBcdTU0MEVcXG5cXG5cdTVFMENcdTY3MUJcdTVCRjlcdTU5MjdcdTVCQjZcdTY3MDlcdTVFMkVcdTUyQTlcdUZGMDFcdTY3MDlcdTk1RUVcdTk4OThcdTUzRUZcdTRFRTVcdThCQzRcdThCQkFcdTUzM0FcdTk1RUVcdTYyMTF+JyxcclxuICAgIGltYWdlczogW10sXHJcbiAgICB2aWV3Q291bnQ6IDIzNDUsXHJcbiAgICBsaWtlQ291bnQ6IDQ1NixcclxuICAgIGNvbW1lbnRDb3VudDogODksXHJcbiAgICBpc1RvcDogdHJ1ZSxcclxuICAgIGlzRXNzZW5jZTogdHJ1ZSxcclxuICAgIHN0YXR1czogJ3B1Ymxpc2hlZCcgYXMgY29uc3QsXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTAzLTIwVDEwOjAwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTAzLTIwVDEwOjAwOjAwWicsXHJcbiAgICBsYXN0UmVwbHlBdDogJzIwMjYtMDQtMDZUMTU6MzA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdwb3N0MDAyJyxcclxuICAgIGF1dGhvcklkOiAnYXV0aG9yMDAyJyxcclxuICAgIGF1dGhvck5hbWU6ICdcdTgwMDNcdTc4MTRcdTUxNUFcdTVDMEZcdTY3NEUnLFxyXG4gICAgYXV0aG9yQXZhdGFyOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0Mzg3NjE2ODEwMzMtNjQ2MWZmYWQ4ZDgwP3c9MTAwJmg9MTAwJmZpdD1jcm9wJyxcclxuICAgIGJvYXJkSWQ6ICdib2FyZDInLFxyXG4gICAgYm9hcmROYW1lOiAnXHU1QjY2XHU2NzJGXHU0RUE0XHU2RDQxJyxcclxuICAgIHRpdGxlOiAnXHUzMDEwXHU2QzQyXHU1MkE5XHUzMDExXHU2NTcwXHU2MzZFXHU3RUQzXHU2Nzg0XHU5NEZFXHU4ODY4XHU1M0NEXHU4RjZDXHVGRjBDXHU5MDEyXHU1RjUyXHU1NDhDXHU5NzVFXHU5MDEyXHU1RjUyXHU1NEVBXHU0RTJBXHU2NkY0XHU1OTdEXHVGRjFGJyxcclxuICAgIGNvbnRlbnQ6ICdcdTY3MDBcdThGRDFcdTU3MjhcdTU5MERcdTRFNjBcdTY1NzBcdTYzNkVcdTdFRDNcdTY3ODRcdUZGMENcdTc3MEJcdTUyMzBcdTk0RkVcdTg4NjhcdTUzQ0RcdThGNkNcdTY3MDlcdTRFMjRcdTc5Q0RcdTUxOTlcdTZDRDVcdUZGMUFcdTkwMTJcdTVGNTJcdTU0OENcdTk3NUVcdTkwMTJcdTVGNTJcdTMwMDJcXG5cXG5cdTkwMTJcdTVGNTJcdTcyNDhcdTY3MkNcdTRFRTNcdTc4MDFcdTdCODBcdTZEMDFcdTRGNDZcdTUzRUZcdTgwRkRcdTY4MDhcdTZFQTJcdTUxRkFcdUZGMENcdTk3NUVcdTkwMTJcdTVGNTJcdTcyNDhcdTY3MkNcdTk3MDBcdTg5ODFcdTk4OURcdTU5MTZcdTYzMDdcdTk0ODhcdTY0Q0RcdTRGNUNcdTMwMDJcXG5cXG5cdThCRjdcdTk1RUVcdTVCOUVcdTk2NDVcdTk3NjJcdThCRDVcdTRFMkRcdTU0RUFcdTc5Q0RcdTY2RjRcdTUzRDdcdTk3NTJcdTc3NTBcdUZGMUZcdTY3MDlcdTZDQTFcdTY3MDlcdTU5MjdcdTRGNkNcdTgwRkRcdTRFQ0VcdTY1RjZcdTk1RjRcdTU0OENcdTdBN0FcdTk1RjRcdTU5MERcdTY3NDJcdTVFQTZcdTRFMEFcdTUyMDZcdTY3OTBcdTRFMDBcdTRFMEJcdUZGMUZcXG5cXG5cdTk2NDRcdTRFMEFcdTYyMTFcdTc2ODRcdTRFRTNcdTc4MDFcdTVCOUVcdTczQjBcdUZGMENcdTZCMjJcdThGQ0VcdTYzMDdcdTZCNjMuLi4nLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxNTg3OTIxODM2Ny04NDY2ZDkxMGFhYTQ/dz02MDAmaD00MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgdmlld0NvdW50OiA4NzYsXHJcbiAgICBsaWtlQ291bnQ6IDEyMyxcclxuICAgIGNvbW1lbnRDb3VudDogNDUsXHJcbiAgICBpc1RvcDogZmFsc2UsXHJcbiAgICBpc0Vzc2VuY2U6IGZhbHNlLFxyXG4gICAgc3RhdHVzOiAncHVibGlzaGVkJyBhcyBjb25zdCxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDQtMDVUMTQ6MDA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDVUMTQ6MDA6MDBaJyxcclxuICAgIGxhc3RSZXBseUF0OiAnMjAyNi0wNC0wNlQwOToyMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ3Bvc3QwMDMnLFxyXG4gICAgYXV0aG9ySWQ6ICdhdXRob3IwMDMnLFxyXG4gICAgYXV0aG9yTmFtZTogJ0hSXHU1QzBGXHU1OUQwXHU1OUQwJyxcclxuICAgIGF1dGhvckF2YXRhcjogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTQ0MDA1MzEzLTk0ZGRmMDI4NmRmMj93PTEwMCZoPTEwMCZmaXQ9Y3JvcCcsXHJcbiAgICBib2FyZElkOiAnYm9hcmQzJyxcclxuICAgIGJvYXJkTmFtZTogJ1x1NkM0Mlx1ODA0Q1x1NjJEQlx1ODA1OCcsXHJcbiAgICB0aXRsZTogJ1x1MzAxMFx1NjgyMVx1NjJEQlx1MzAxMVx1NUI1N1x1ODI4Mlx1OERGM1x1NTJBODIwMjZcdTY2MjVcdTVCNjNcdTY4MjFcdTU2RURcdTYyREJcdTgwNThcdTZCNjNcdTVGMEZcdTU0MkZcdTUyQThcdUZGMDEnLFxyXG4gICAgY29udGVudDogJ1x1NTQwNFx1NEY0RFx1NTQwQ1x1NUI2Nlx1NTk3RFx1RkYwMVx1NUI1N1x1ODI4Mlx1OERGM1x1NTJBODIwMjZcdTY2MjVcdTYyREJcdTVERjJcdTdFQ0ZcdTU0MkZcdTUyQThcdTU1NjZcdUZGMDFcXG5cXG5cdTYyREJcdTgwNThcdTVDOTdcdTRGNERcdUZGMUFcXG4tIFx1NTQwRVx1N0FFRlx1NUYwMFx1NTNEMVx1NURFNVx1N0EwQlx1NUUwOFx1RkYwOEdvL0phdmEvUHl0aG9uXHVGRjA5XFxuLSBcdTUyNERcdTdBRUZcdTVGMDBcdTUzRDFcdTVERTVcdTdBMEJcdTVFMDhcdUZGMDhSZWFjdC9WdWVcdUZGMDlcXG4tIFx1N0I5N1x1NkNENVx1NURFNVx1N0EwQlx1NUUwOFx1RkYwOE5MUC9DVi9cdTYzQThcdTgzNTBcdUZGMDlcXG4tIFx1NEVBN1x1NTRDMVx1N0VDRlx1NzQwNlxcbi0gXHU4RkQwXHU4NDI1XHU0RTEzXHU1NDU4XFxuXFxuXHU4OTgxXHU2QzQyXHVGRjFBXHU2NzJDXHU3OUQxXHU1M0NBXHU0RUU1XHU0RTBBXHU1QjY2XHU1Mzg2XHVGRjBDMjAyNlx1NUM0QVx1NkJENVx1NEUxQVx1NzUxRlxcblxcblx1NjI5NVx1OTAxMlx1NjVCOVx1NUYwRlx1RkYxQVx1NzY3Qlx1NUY1NVx1NUI5OFx1N0Y1MSBjYXJlZXIuYnl0ZWRhbmNlLmNvbVxcblxcblx1NjIyQVx1NkI2Mlx1NjVGNlx1OTVGNFx1RkYxQTIwMjZcdTVFNzQ0XHU2NzA4MzBcdTY1RTVcXG5cXG5cdTZCMjJcdThGQ0VcdTU5MjdcdTVCQjZcdTYyOTVcdTkwMTJcdUZGMDEnLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1MjY2NDczMC1kMzA3Y2E4ODQ5Nzg/dz02MDAmaD0zMDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgdmlld0NvdW50OiAzNDU2LFxyXG4gICAgbGlrZUNvdW50OiA1NjcsXHJcbiAgICBjb21tZW50Q291bnQ6IDEzNCxcclxuICAgIGlzVG9wOiB0cnVlLFxyXG4gICAgaXNFc3NlbmNlOiB0cnVlLFxyXG4gICAgc3RhdHVzOiAncHVibGlzaGVkJyBhcyBjb25zdCxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDQtMDFUMDk6MDA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDFUMDk6MDA6MDBaJyxcclxuICAgIGxhc3RSZXBseUF0OiAnMjAyNi0wNC0wNlQxNjowMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ3Bvc3QwMDQnLFxyXG4gICAgYXV0aG9ySWQ6ICdhdXRob3IwMDQnLFxyXG4gICAgYXV0aG9yTmFtZTogJ1x1OEZGN1x1N0NDQVx1NzY4NFx1NUMwRlx1NUYyMCcsXHJcbiAgICBhdXRob3JBdmF0YXI6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUwNzAwMzIxMTE2OS0wYTFkZDcyMjhmMmQ/dz0xMDAmaD0xMDAmZml0PWNyb3AnLFxyXG4gICAgYm9hcmRJZDogJ2JvYXJkNCcsXHJcbiAgICBib2FyZE5hbWU6ICdcdTU5MzFcdTcyNjlcdTYyREJcdTk4ODYnLFxyXG4gICAgdGl0bGU6ICdcdTMwMTBcdTVCRkJcdTcyNjlcdTMwMTFcdTY2MjhcdTU5MjlcdTU3MjhcdTU2RkVcdTRFNjZcdTk5ODZcdTRFMjJcdTU5MzFcdTRFODZcdTRFMDBcdTRFMkFcdTlFRDFcdTgyNzJcdTk0QjFcdTUzMDVcdUZGMENcdTUxODVcdTY3MDlcdTVCNjZcdTc1MUZcdThCQzFcdTU0OENcdTczQjBcdTkxRDEnLFxyXG4gICAgY29udGVudDogJ1x1NjYyOFx1NTkyOVx1NEUwQlx1NTM0OFx1RkYwODRcdTY3MDg1XHU2NUU1XHVGRjA5XHU1OTI3XHU2OTgyM1x1NzBCOVx1NURFNlx1NTNGM1x1NTcyOFx1NTZGRVx1NEU2Nlx1OTk4Nlx1NEUwOVx1Njk3Q1x1ODFFQVx1NEU2MFx1NUJBNFx1NUI2Nlx1NEU2MFx1RkYwQ1x1OEQ3MFx1NzY4NFx1NjVGNlx1NTAxOVx1NUZEOFx1OEJCMFx1NjJGRlx1OTRCMVx1NTMwNVx1NEU4Nlx1MzAwMlxcblxcblx1OTRCMVx1NTMwNVx1NzI3OVx1NUY4MVx1RkYxQVxcbi0gXHU5RUQxXHU4MjcyXHU5NTdGXHU2QjNFXHU5NEIxXHU1MzA1XFxuLSBcdTUxODVcdTY3MDlcdTVCNjZcdTc1MUZcdThCQzFcdUZGMDhcdTU5RDNcdTU0MERcdUZGMUFcdTVGMjBcdTY3RDBcdUZGMENcdTVCNjZcdTUzRjdcdUZGMUEyMDIyeHh4XHVGRjA5XFxuLSBcdThFQUJcdTRFRkRcdThCQzFcdTRFMDBcdTVGMjBcXG4tIFx1NzNCMFx1OTFEMVx1N0VBNjIwMFx1NTE0M1xcbi0gXHU5NEY2XHU4ODRDXHU1MzYxMlx1NUYyMFxcblxcblx1NTk4Mlx1NjcwOVx1NjJGRVx1NTIzMFx1OEJGN1x1ODA1NFx1N0NGQlx1NjIxMVx1RkYxQTEzOCoqKio4ODg4XHVGRjBDXHU1RkM1XHU2NzA5XHU5MUNEXHU4QzIyXHVGRjAxXHVEODNEXHVERTRGJyxcclxuICAgIGltYWdlczogW10sXHJcbiAgICB2aWV3Q291bnQ6IDU2NyxcclxuICAgIGxpa2VDb3VudDogMzQsXHJcbiAgICBjb21tZW50Q291bnQ6IDIzLFxyXG4gICAgaXNUb3A6IGZhbHNlLFxyXG4gICAgaXNFc3NlbmNlOiBmYWxzZSxcclxuICAgIHN0YXR1czogJ3B1Ymxpc2hlZCcgYXMgY29uc3QsXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTA0LTA2VDA4OjAwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTA2VDA4OjAwOjAwWicsXHJcbiAgICBsYXN0UmVwbHlBdDogJzIwMjYtMDQtMDZUMTI6MDA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdwb3N0MDA1JyxcclxuICAgIGF1dGhvcklkOiAnYXV0aG9yMDA1JyxcclxuICAgIGF1dGhvck5hbWU6ICdcdTY1NzBcdTc4MDFcdThGQkVcdTRFQkEnLFxyXG4gICAgYXV0aG9yQXZhdGFyOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MDA2NDg3Njc3OTEtMDBkY2M5OTRhNDNlP3c9MTAwJmg9MTAwJmZpdD1jcm9wJyxcclxuICAgIGJvYXJkSWQ6ICdib2FyZDUnLFxyXG4gICAgYm9hcmROYW1lOiAnXHU0RThDXHU2MjRCXHU0RUE0XHU2NjEzJyxcclxuICAgIHRpdGxlOiAnXHUzMDEwXHU1MUZBXHU1NTJFXHUzMDExaVBhZCBBaXIgNSAyNTZHIFdpRmlcdTcyNDggXHU2NjFGXHU1MTQ5XHU4MjcyIDk1XHU2NUIwJyxcclxuICAgIGRlc2NyaXB0aW9uOiAnJywgLy8gXHU1MTdDXHU1QkI5XHU1QjU3XHU2QkI1XHJcbiAgICBjb250ZW50OiAnXHU1NkUwXHU2MzYyTWFjQm9va1x1NjI0MFx1NEVFNVx1NTFGQWlQYWRcdUZGMENcdTUzQkJcdTVFNzRcdTUzQ0NcdTUzNDFcdTRFMDBcdThEMkRcdTUxNjVcdUZGMENcdTRFMDBcdTc2RjRcdTVFMjZcdTU4RjNcdTRGN0ZcdTc1MjhcdUZGMENcdTVDNEZcdTVFNTVcdTVCOENcdTdGOEVcdTY1RTBcdTUyMTJcdTc1RDVcdTMwMDJcXG5cXG5cdTkxNERcdTdGNkVcdUZGMUFNMVx1ODJBRlx1NzI0NyA4R1x1NTE4NVx1NUI1OCAyNTZHXHU1QjU4XHU1MEE4XFxuXFxuXHU5MTREXHU0RUY2XHVGRjFBXHU1MzlGXHU4OEM1XHU1MTQ1XHU3NTM1XHU1NjY4K0FwcGxlIFBlbmNpbFx1NEU4Q1x1NEVFM1x1RkYwOFx1NTNFNlx1N0I5NzIwMFx1NTE0M1x1RkYwOVxcblxcblx1NEVGN1x1NjgzQ1x1RkYxQTQyMDBcdTUxNDMgXHU1M0VGXHU1QzBGXHU1MjAwXFxuXFxuXHU2NzA5XHU2MTBGXHU3OUMxXHU4MDRBXHVGRjBDXHU2NTJGXHU2MzAxXHU1RjUzXHU5NzYyXHU5QThDXHU4RDI3XHU0RUE0XHU2NjEzJyxcclxuICAgIGltYWdlczogW1xyXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NDQyNDQwMTUtMGRmNGIzZmZjNmIwP3c9NjAwJmg9NjAwJmZpdD1jcm9wJyxcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTQ0MjQ0MDE1LTBkZjRiM2ZmYzZiMD93PTYwMCZoPTYwMCZmaXQ9Y3JvcCdcclxuICAgIF0uc2xpY2UoMCwgMSksIC8vIFx1NTNENlx1N0IyQ1x1NEUwMFx1NUYyMFx1NEY1Q1x1NEUzQVx1NEUzQlx1NTZGRVxyXG4gICAgdmlld0NvdW50OiA0NTYsXHJcbiAgICBsaWtlQ291bnQ6IDY3LFxyXG4gICAgY29tbWVudENvdW50OiAyOCxcclxuICAgIGlzVG9wOiBmYWxzZSxcclxuICAgIGlzRXNzZW5jZTogZmFsc2UsXHJcbiAgICBzdGF0dXM6ICdwdWJsaXNoZWQnIGFzIGNvbnN0LFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wNC0wNFQxNTowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wNFQxNTowMDowMFonLFxyXG4gICAgbGFzdFJlcGx5QXQ6ICcyMDI2LTA0LTA1VDIwOjAwOjAwWidcclxuICB9IGFzIEZvcnVtUG9zdCxcclxuICB7XHJcbiAgICBpZDogJ3Bvc3QwMDYnLFxyXG4gICAgYXV0aG9ySWQ6ICdhdXRob3IwMDYnLFxyXG4gICAgYXV0aG9yTmFtZTogJ1x1NTMzRlx1NTQwRFx1NzUyOFx1NjIzNycsXHJcbiAgICBhdXRob3JBdmF0YXI6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUzNTcxMzg3NTAwMi1kMWQwY2YzNzdmZGU/dz0xMDAmaD0xMDAmZml0PWNyb3AnLFxyXG4gICAgYm9hcmRJZDogJ2JvYXJkNicsXHJcbiAgICBib2FyZE5hbWU6ICdcdTYwQzVcdTYxMUZcdTY4MTFcdTZEMUUnLFxyXG4gICAgdGl0bGU6ICdcdTMwMTBcdTY4MTFcdTZEMUVcdTMwMTFcdTU5MjdcdTRFMDlcdTRFODZcdThGRDhcdTY2MkZcdTUzNTVcdThFQUJcdUZGMENcdTY2MkZcdTRFMERcdTY2MkZcdTYyMTFcdTRFMERcdTU5MUZcdTU5N0RcdUZGMUYnLFxyXG4gICAgY29udGVudDogJ1x1OUE2Q1x1NEUwQVx1NUMzMVx1ODk4MVx1NTkyN1x1NEUwOVx1NEUwQlx1NEU4Nlx1RkYwQ1x1NzcwQlx1Nzc0MFx1OEVBQlx1OEZCOVx1NzY4NFx1NTQwQ1x1NUI2Nlx1OTBGRFx1ODEzMVx1NTM1NVx1NEU4Nlx1RkYwQ1x1NUZDM1x1OTFDQ1x1NjMzQVx1OTZCRVx1NTNEN1x1NzY4NFx1MzAwMlxcblxcblx1NjIxMVx1NEUwRFx1NjYyRlx1NEUwRFx1NjBGM1x1OEMwOFx1NjA0Qlx1NzIzMVx1RkYwQ1x1NTNFQVx1NjYyRlx1NTk3RFx1NTBDRlx1NEUwMFx1NzZGNFx1NkNBMVx1NjcwOVx1OTA0N1x1NTIzMFx1NTQwOFx1OTAwMlx1NzY4NFx1NEVCQVx1MzAwMlx1NEU1Rlx1NUMxRFx1OEJENVx1OEZDN1x1NEUzQlx1NTJBOFx1RkYwQ1x1NEY0Nlx1NjAzQlx1NjYyRlx1NEVFNVx1NTkzMVx1OEQyNVx1NTQ0QVx1N0VDOFx1MzAwMlxcblxcblx1NjcwOVx1NjVGNlx1NTAxOVx1NEYxQVx1NjAwMFx1NzU5MVx1NjYyRlx1NEUwRFx1NjYyRlx1ODFFQVx1NURGMVx1NTRFQVx1OTFDQ1x1NEUwRFx1NTkxRlx1NTk3RFx1RkYwQ1x1NjIxNlx1ODAwNVx1NjYyRlx1NEUwRFx1NjYyRlx1N0YxOFx1NTIwNlx1OEZEOFx1NkNBMVx1NTIzMC4uLlxcblxcblx1NjcwOVx1NkNBMVx1NjcwOVx1NTQwQ1x1NjgzN1x1NjExRlx1NTNEN1x1NzY4NFx1NjcwQlx1NTNDQlx1RkYxRlx1NTkyN1x1NUJCNlx1NjYyRlx1NjAwRVx1NEU0OFx1OEMwM1x1NjU3NFx1NUZDM1x1NjAwMVx1NzY4NFx1RkYxRicsXHJcbiAgICBpbWFnZXM6IFtdLFxyXG4gICAgdmlld0NvdW50OiAxODkwLFxyXG4gICAgbGlrZUNvdW50OiAzNDUsXHJcbiAgICBjb21tZW50Q291bnQ6IDE2NyxcclxuICAgIGlzVG9wOiBmYWxzZSxcclxuICAgIGlzRXNzZW5jZTogZmFsc2UsXHJcbiAgICBzdGF0dXM6ICdwdWJsaXNoZWQnIGFzIGNvbnN0LFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wNC0wM1QyMTowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wM1QyMTowMDowMFonLFxyXG4gICAgbGFzdFJlcGx5QXQ6ICcyMDI2LTA0LTA2VDE0OjMwOjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAncG9zdDAwNycsXHJcbiAgICBhdXRob3JJZDogJ2F1dGhvcjAwNycsXHJcbiAgICBhdXRob3JOYW1lOiAnXHU3OTNFXHU1NkUyXHU4RDFGXHU4RDIzXHU0RUJBJyxcclxuICAgIGF1dGhvckF2YXRhcjogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTE5MDg1MzYwNzUzLWFmMDExOWY3Y2JlNz93PTEwMCZoPTEwMCZmaXQ9Y3JvcCcsXHJcbiAgICBib2FyZElkOiAnYm9hcmQxJyxcclxuICAgIGJvYXJkTmFtZTogJ1x1NjgyMVx1NTZFRFx1NzUxRlx1NkQzQicsXHJcbiAgICB0aXRsZTogJ1x1MzAxMFx1NkQzQlx1NTJBOFx1MzAxMVx1NjQ0NFx1NUY3MVx1NzkzRVx1NjYyNVx1NUI2M1x1NTkxNlx1NjJDRFx1NkQzQlx1NTJBOFx1NjJBNVx1NTQwRFx1NUYwMFx1NTlDQlx1RkYwMScsXHJcbiAgICBjb250ZW50OiAnXHU1NDA0XHU0RjREXHU2NDQ0XHU1RjcxXHU3MjMxXHU1OTdEXHU4MDA1XHU2Q0U4XHU2MTBGXHU1NTY2XHVGRjAxXFxuXFxuXHU2NzJDXHU1NDY4XHU1MTZEXHVGRjA4NFx1NjcwODEyXHU2NUU1XHVGRjA5XHU0RTBCXHU1MzQ4Mlx1NzBCOVx1RkYwQ1x1NjIxMVx1NEVFQ1x1NUMwNlx1N0VDNFx1N0VDN1x1NTI0RFx1NUY4MFx1NTkyQVx1OTYzM1x1NUM5Qlx1OThDRVx1NjY2Rlx1NTMzQVx1OEZEQlx1ODg0Q1x1NjYyNVx1NUI2M1x1NTkxNlx1NjJDRFx1NkQzQlx1NTJBOFx1MzAwMlxcblxcblx1NkQzQlx1NTJBOFx1NUI4OVx1NjM5Mlx1RkYxQVxcbi0gMTM6MzAgXHU1QjY2XHU2ODIxXHU0RTFDXHU5NUU4XHU5NkM2XHU1NDA4XHU1MUZBXHU1M0QxXFxuLSAxNDowMC0xNzowMCBcdTgxRUFcdTc1MzFcdTYyQ0RcdTY0NDRcdTY1RjZcdTk1RjRcXG4tIDE3OjAwLTE4OjAwIFx1NEY1Q1x1NTRDMVx1NzBCOVx1OEJDNFx1NEVBNFx1NkQ0MVxcblxcblx1NkNFOFx1NjEwRlx1NEU4Qlx1OTg3OVx1RkYxQVxcbjEuIFx1ODFFQVx1NTkwN1x1NzZGOFx1NjczQVx1NjIxNlx1NjI0Qlx1NjczQVx1NTc0N1x1NTNFRlxcbjIuIFx1NUVGQVx1OEJBRVx1N0E3Rlx1Nzc0MFx1NEZCRlx1NEU4RVx1NkQzQlx1NTJBOFx1NzY4NFx1NjcwRFx1ODhDNVxcbjMuIFx1NkNFOFx1NjEwRlx1OTYzMlx1NjY1Mlx1NTQ4Q1x1ODg2NVx1NkMzNFxcblxcblx1NTQwRFx1OTg5RFx1NjcwOVx1OTY1MFx1RkYwQ1x1NTE0OFx1NjJBNVx1NTE0OFx1NUY5N1x1RkYwMVx1NjI2Qlx1NzgwMVx1OEZEQlx1N0ZBNFx1NjJBNVx1NTQwRH4nLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTQ1MjU4NzkyNTE0OC1jZTU0NGU3N2U3MGQ/dz02MDAmaD00MDAmZml0PWNyb3AnXHJcbiAgICBdLFxyXG4gICAgdmlld0NvdW50OiA2NzgsXHJcbiAgICBsaWtlQ291bnQ6IDEyMyxcclxuICAgIGNvbW1lbnRDb3VudDogNTYsXHJcbiAgICBpc1RvcDogZmFsc2UsXHJcbiAgICBpc0Vzc2VuY2U6IHRydWUsXHJcbiAgICBzdGF0dXM6ICdwdWJsaXNoZWQnIGFzIGNvbnN0LFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wNC0wNlQxMDowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wNlQxMDowMDowMFonLFxyXG4gICAgbGFzdFJlcGx5QXQ6ICcyMDI2LTA0LTA2VDE1OjAwOjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAncG9zdDAwOCcsXHJcbiAgICBhdXRob3JJZDogJ2F1dGhvcjAwOCcsXHJcbiAgICBhdXRob3JOYW1lOiAnXHU1QjY2XHU5NzM4XHU3QjE0XHU4QkIwJyxcclxuICAgIGF1dGhvckF2YXRhcjogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTM0NTI4NzQxNzc1LTUzOTk0YTY5ZGFlYj93PTEwMCZoPTEwMCZmaXQ9Y3JvcCcsXHJcbiAgICBib2FyZElkOiAnYm9hcmQyJyxcclxuICAgIGJvYXJkTmFtZTogJ1x1NUI2Nlx1NjcyRlx1NEVBNFx1NkQ0MScsXHJcbiAgICB0aXRsZTogJ1x1MzAxMFx1OEQ0NFx1NkU5MFx1NTIwNlx1NEVBQlx1MzAxMVx1NjRDRFx1NEY1Q1x1N0NGQlx1N0VERlx1OTFDRFx1NzBCOVx1NzdFNVx1OEJDNlx1NzBCOVx1NjU3NFx1NzQwNlx1RkYwOFx1NjVFMFx1NTA3Rlx1NTIwNlx1NEVBQlx1RkYwOScsXHJcbiAgICBjb250ZW50OiAnXHU1MjFBXHU1OTBEXHU0RTYwXHU1QjhDXHU2NENEXHU0RjVDXHU3Q0ZCXHU3RURGXHVGRjBDXHU2MjhBXHU5MUNEXHU3MEI5XHU2NTc0XHU3NDA2XHU2MjEwXHU0RTg2XHU2MDFEXHU3RUY0XHU1QkZDXHU1NkZFXHU1NDhDXHU3QjE0XHU4QkIwXHVGRjBDXHU1MjA2XHU0RUFCXHU3RUQ5XHU5NzAwXHU4OTgxXHU3Njg0XHU1NDBDXHU1QjY2XHUzMDAyXFxuXFxuXHU1MTg1XHU1QkI5XHU1MzA1XHU2MkVDXHVGRjFBXFxuMS4gXHU4RkRCXHU3QTBCXHU3QkExXHU3NDA2XHVGRjA4XHU4RkRCXHU3QTBCXHU3MkI2XHU2MDAxXHU4RjZDXHU2MzYyXHUzMDAxXHU4QzAzXHU1RUE2XHU3Qjk3XHU2Q0Q1XHUzMDAxXHU1NDBDXHU2QjY1XHU0RTkyXHU2NUE1XHVGRjA5XFxuMi4gXHU1MTg1XHU1QjU4XHU3QkExXHU3NDA2XHVGRjA4XHU1MjA2XHU5ODc1XHU1MjA2XHU2QkI1XHUzMDAxXHU4NjVBXHU2MkRGXHU1MTg1XHU1QjU4XHUzMDAxXHU5ODc1XHU5NzYyXHU3RjZFXHU2MzYyXHU3Qjk3XHU2Q0Q1XHVGRjA5XFxuMy4gXHU2NTg3XHU0RUY2XHU3Q0ZCXHU3RURGXHVGRjA4XHU2NTg3XHU0RUY2XHU1QjU4XHU1MEE4XHUzMDAxXHU3NkVFXHU1RjU1XHU3RUQzXHU2Nzg0XHUzMDAxXHU3OEMxXHU3NkQ4XHU4QzAzXHU1RUE2XHVGRjA5XFxuNC4gSS9PXHU3QkExXHU3NDA2XHVGRjA4XHU3RjEzXHU1MUIyXHU2MjgwXHU2NzJGXHUzMDAxXHU4QkJFXHU1OTA3XHU1MjA2XHU5MTREXHVGRjA5XFxuXFxuXHU3QjE0XHU4QkIwXHU2ODNDXHU1RjBGXHVGRjFBUERGICsgWE1pbmRcdTZFOTBcdTY1ODdcdTRFRjZcXG5cXG5cdTgzQjdcdTUzRDZcdTY1QjlcdTVGMEZcdUZGMUFcdThCQzRcdThCQkFcdTUzM0FcdTc1NTlcdThBMDBcdTkwQUVcdTdCQjFcdUZGMENcdTYyMTFcdTRGMUFcdTkwMTBcdTRFMDBcdTUzRDFcdTkwMDFcXG5cXG5cdTc5NURcdTU5MjdcdTVCQjZcdTY3MUZcdTY3MkJcdTk4N0FcdTUyMjlcdUZGMDEnLFxyXG4gICAgaW1hZ2VzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUxNzg0MjY0NTc2Ny1jNjM5MDQyNzc3ZGI/dz02MDAmaD00MDAmZml0PWNyb3AnLFxyXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MTU4NzkyMTgzNjctODQ2NmQ5MTBhYWE0P3c9NjAwJmg9NDAwJmZpdD1jcm9wJ1xyXG4gICAgXSxcclxuICAgIHZpZXdDb3VudDogMTIzNCxcclxuICAgIGxpa2VDb3VudDogMjg5LFxyXG4gICAgY29tbWVudENvdW50OiA5OCxcclxuICAgIGlzVG9wOiBmYWxzZSxcclxuICAgIGlzRXNzZW5jZTogdHJ1ZSxcclxuICAgIHN0YXR1czogJ3B1Ymxpc2hlZCcgYXMgY29uc3QsXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTA0LTAyVDE2OjAwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTAyVDE2OjAwOjAwWicsXHJcbiAgICBsYXN0UmVwbHlBdDogJzIwMjYtMDQtMDZUMTE6MDA6MDBaJ1xyXG4gIH1cclxuXVxyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT0gXHU3OTNFXHU1MzNBXHU2RDNCXHU1MkE4XHU2QTIxXHU1NzU3XHU2NTcwXHU2MzZFID09PT09PT09PT09PT09PT09LS0tXHJcblxyXG5jb25zdCBhY3Rpdml0aWVzOiBBY3Rpdml0eVtdID0gW1xyXG4gIHtcclxuICAgIGlkOiAnYWN0MScsXHJcbiAgICB0aXRsZTogJ1x1NjYyNVx1NUI2M1x1OEZEMFx1NTJBOFx1NEYxQScsXHJcbiAgICBjb3ZlckltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NjE4OTY4MzY5MzQtYmQ0NWJhOGJhOWVmP3c9NjAwJmg9MzAwJmZpdD1jcm9wJyxcclxuICAgIGRlc2NyaXB0aW9uOiAnXHU0RTAwXHU1RTc0XHU0RTAwXHU1RUE2XHU3Njg0XHU2NjI1XHU1QjYzXHU4RkQwXHU1MkE4XHU0RjFBXHU1MzczXHU1QzA2XHU1RjAwXHU1RTU1XHVGRjAxXHU1MzA1XHU2MkVDXHU3NTMwXHU1Rjg0XHU2QkQ0XHU4RDVCXHUzMDAxXHU4REEzXHU1NDczXHU4RkQwXHU1MkE4XHU5ODc5XHU3NkVFXHUzMDAxXHU1NkUyXHU0RjUzXHU2NENEXHU4ODY4XHU2RjE0XHU3QjQ5XHU3Q0JFXHU1RjY5XHU3M0FGXHU4MjgyXHUzMDAyXHU2QjIyXHU4RkNFXHU1MTY4XHU2ODIxXHU1RTA4XHU3NTFGXHU3OUVGXHU2NzgxXHU1M0MyXHU0RTBFXHVGRjBDXHU1QzU1XHU3M0IwXHU5NzUyXHU2NjI1XHU2RDNCXHU1MjlCXHVGRjAxJyxcclxuICAgIGNhdGVnb3J5OiAnc3BvcnRzJyBhcyBjb25zdCxcclxuICAgIG9yZ2FuaXplcjogJ1x1NEY1M1x1ODBCMlx1OTBFOCcsXHJcbiAgICBsb2NhdGlvbjogJ1x1NEY1M1x1ODBCMlx1NTczQScsXHJcbiAgICBzdGFydFRpbWU6ICcyMDI2LTA0LTIwVDA4OjAwOjAwWicsXHJcbiAgICBlbmRUaW1lOiAnMjAyNi0wNC0yMFQxNzowMDowMFonLFxyXG4gICAgbWF4UGFydGljaXBhbnRzOiA1MDAsXHJcbiAgICBjdXJyZW50UGFydGljaXBhbnRzOiAzNjcsXHJcbiAgICBzdGF0dXM6ICd1cGNvbWluZycgYXMgY29uc3QsXHJcbiAgICBmZWU6IDAsXHJcbiAgICB0YWdzOiBbJ1x1OEZEMFx1NTJBOCcsICdcdTdBREVcdTYyODAnLCAnXHU1NkUyXHU0RjUzJ10sXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTAzLTE1VDEwOjAwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTA1VDE0OjAwOjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAnYWN0MicsXHJcbiAgICB0aXRsZTogJ1x1NjgyMVx1NTZFRFx1NkI0Q1x1NjI0Qlx1NTkyN1x1OEQ1Qlx1NTFCM1x1OEQ1QicsXHJcbiAgICBjb3ZlckltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTMyMjU0NTcxMjQtYTNlYjE2MWZmYTVmP3c9NjAwJmg9MzAwJmZpdD1jcm9wJyxcclxuICAgIGRlc2NyaXB0aW9uOiAnXHU3QjJDXHU1MzQxXHU1QzRBXHU2ODIxXHU1NkVEXHU2QjRDXHU2MjRCXHU1OTI3XHU4RDVCXHU2MDNCXHU1MUIzXHU4RDVCXHVGRjBDMTBcdTRGNERcdTVCOUVcdTUyOUJcdTU1MzFcdTVDMDZcdTU0MENcdTUzRjBcdTdBREVcdTYyODBcdUZGMENcdTY2RjRcdTY3MDlcdTc5NUVcdTc5RDhcdTU2MDlcdTVCQkVcdTUyQTlcdTk2MzVcdTMwMDJcdTczQjBcdTU3M0FcdTYyOTVcdTc5NjhcdTkwMDlcdTUxRkFcdTRGNjBcdTVGQzNcdTRFMkRcdTc2ODRcdTY3MDBcdTRGNzNcdTZCNENcdTYyNEJcdUZGMDEnLFxyXG4gICAgY2F0ZWdvcnk6ICdlbnRlcnRhaW5tZW50JyBhcyBjb25zdCxcclxuICAgIG9yZ2FuaXplcjogJ1x1NUI2Nlx1NzUxRlx1NEYxQVx1NjU4N1x1ODI3QVx1OTBFOCcsXHJcbiAgICBsb2NhdGlvbjogJ1x1NTkyN1x1NUI2Nlx1NzUxRlx1NkQzQlx1NTJBOFx1NEUyRFx1NUZDM1x1NTkyN1x1NzkzQ1x1NTgwMicsXHJcbiAgICBzdGFydFRpbWU6ICcyMDI2LTA0LTI1VDE5OjAwOjAwWicsXHJcbiAgICBlbmRUaW1lOiAnMjAyNi0wNC0yNVQyMjowMDowMFonLFxyXG4gICAgbWF4UGFydGljaXBhbnRzOiA4MDAsXHJcbiAgICBjdXJyZW50UGFydGljaXBhbnRzOiA3MjMsXHJcbiAgICBzdGF0dXM6ICd1cGNvbWluZycgYXMgY29uc3QsXHJcbiAgICBmZWU6IDAsXHJcbiAgICB0YWdzOiBbJ1x1OTdGM1x1NEU1MCcsICdcdTYyNERcdTgyN0EnLCAnXHU2NjVBXHU0RjFBJ10sXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTAzLTIwVDA5OjAwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTA0VDE2OjAwOjAwWidcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAnYWN0MycsXHJcbiAgICB0aXRsZTogJ0FJXHU0RTBFXHU2NzJBXHU2NzY1XHU3OUQxXHU2MjgwXHU4QkIyXHU1RUE3JyxcclxuICAgIGNvdmVySW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTY3NzQ0MjEzNjAxOS0yMTc4MGVjYWQ5OTU/dz02MDAmaD0zMDAmZml0PWNyb3AnLFxyXG4gICAgZGVzY3JpcHRpb246ICdcdTcyNzlcdTkwODBcdTZFMDVcdTUzNEVcdTU5MjdcdTVCNjZcdTRFQkFcdTVERTVcdTY2N0FcdTgwRkRcdTc4MTRcdTdBNzZcdTk2NjJcdTY1NTlcdTYzODhcdTRFM0JcdThCQjJcdUZGMENcdTYzQTJcdThCQThDaGF0R1BUXHU3QjQ5XHU1OTI3XHU4QkVEXHU4QTAwXHU2QTIxXHU1NzhCXHU3Njg0XHU1M0QxXHU1QzU1XHU4RDhCXHU1MkJGXHU1M0NBXHU1MTc2XHU1QkY5XHU3OTNFXHU0RjFBXHU1NDA0XHU4ODRDXHU0RTFBXHU3Njg0XHU1RjcxXHU1NENEXHUzMDAyXHU3M0IwXHU1NzNBXHU0RTkyXHU1MkE4XHU5NUVFXHU3QjU0XHU3M0FGXHU4MjgyXHUzMDAyJyxcclxuICAgIGNhdGVnb3J5OiAnYWNhZGVtaWMnIGFzIGNvbnN0LFxyXG4gICAgb3JnYW5pemVyOiAnXHU4QkExXHU3Qjk3XHU2NzNBXHU1QjY2XHU5NjYyJyxcclxuICAgIGxvY2F0aW9uOiAnXHU1NkZFXHU0RTY2XHU5OTg2XHU2MkE1XHU1NDRBXHU1Mzg1JyxcclxuICAgIHN0YXJ0VGltZTogJzIwMjYtMDQtMThUMTQ6MDA6MDBaJyxcclxuICAgIGVuZFRpbWU6ICcyMDI2LTA0LTE4VDE2OjMwOjAwWicsXHJcbiAgICBtYXhQYXJ0aWNpcGFudHM6IDMwMCxcclxuICAgIGN1cnJlbnRQYXJ0aWNpcGFudHM6IDI3OCxcclxuICAgIHN0YXR1czogJ3VwY29taW5nJyBhcyBjb25zdCxcclxuICAgIGZlZTogMCxcclxuICAgIHRhZ3M6IFsnQUknLCAnXHU4QkIyXHU1RUE3JywgJ1x1NzlEMVx1NjI4MCddLFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wMy0yNVQxMTowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wM1QxMDowMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ2FjdDQnLFxyXG4gICAgdGl0bGU6ICdcdTVGRDdcdTYxM0ZcdTY3MERcdTUyQTFcdUZGMUFcdTY1NkNcdTgwMDFcdTk2NjJcdTYxNzBcdTk1RUVcdTZGMTRcdTUxRkEnLFxyXG4gICAgY292ZXJJbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTU5MDI3NjE1LWNkNDYyODkwMmQ0YT93PTYwMCZoPTMwMCZmaXQ9Y3JvcCcsXHJcbiAgICBkZXNjcmlwdGlvbjogJ1x1NTI0RFx1NUY4MFx1Njc3RVx1NTMxN1x1NTMzQVx1NjU2Q1x1ODAwMVx1OTY2Mlx1OEZEQlx1ODg0Q1x1NjE3MFx1OTVFRVx1NkYxNFx1NTFGQVx1RkYwQ1x1NEUzQVx1ODAwMVx1NEVCQVx1NEVFQ1x1NUUyNlx1NTNCQlx1NkI0Q1x1ODIxRVx1ODg2OFx1NkYxNFx1MzAwMVx1NzZGOFx1NThGMFx1NUMwRlx1NTRDMVx1N0I0OVx1ODI4Mlx1NzZFRVx1MzAwMlx1NEYyMFx1OTAxMlx1NkUyOVx1NjY5Nlx1RkYwQ1x1NUYxOFx1NjI2Q1x1NUMwQVx1ODAwMVx1NzIzMVx1NUU3Q1x1NzY4NFx1NEYyMFx1N0VERlx1N0Y4RVx1NUZCN1x1MzAwMicsXHJcbiAgICBjYXRlZ29yeTogJ3ZvbHVudGVlcicgYXMgY29uc3QsXHJcbiAgICBvcmdhbml6ZXI6ICdcdTk3NTJcdTVFNzRcdTVGRDdcdTYxM0ZcdTgwMDVcdTUzNEZcdTRGMUEnLFxyXG4gICAgbG9jYXRpb246ICdcdTY3N0VcdTUzMTdcdTUzM0FcdTRFMkRcdTVGQzNcdTY1NkNcdTgwMDFcdTk2NjInLFxyXG4gICAgc3RhcnRUaW1lOiAnMjAyNi0wNC0xNFQwOTowMDowMFonLFxyXG4gICAgZW5kVGltZTogJzIwMjYtMDQtMTRUMTI6MDA6MDBaJyxcclxuICAgIG1heFBhcnRpY2lwYW50czogNDAsXHJcbiAgICBjdXJyZW50UGFydGljaXBhbnRzOiAzNSxcclxuICAgIHN0YXR1czogJ3VwY29taW5nJyBhcyBjb25zdCxcclxuICAgIGZlZTogMCxcclxuICAgIHRhZ3M6IFsnXHU1MTZDXHU3NkNBJywgJ1x1NUZEN1x1NjEzRicsICdcdTY1NkNcdTgwMDEnXSxcclxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDMtMjhUMTQ6MDA6MDBaJyxcclxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDQtMDJUMDk6MDA6MDBaJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6ICdhY3Q1JyxcclxuICAgIHRpdGxlOiAnXHU0RjIwXHU3RURGXHU2NTg3XHU1MzE2XHU4MjgyXHVGRjFBXHU2QzQ5XHU2NzBEXHU2RTM4XHU1NkVEXHU0RjFBJyxcclxuICAgIGNvdmVySW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUzMzE3NDA3MjU0NS03YTRiNmFkN2E2YzM/dz02MDAmaD0zMDAmZml0PWNyb3AnLFxyXG4gICAgZGVzY3JpcHRpb246ICdcdTdBN0ZcdTRFMEFcdTZDNDlcdTY3MERcdUZGMENcdTdBN0ZcdThEOEFcdTY1RjZcdTdBN0FcdUZGMDFcdTZEM0JcdTUyQThcdTczQjBcdTU3M0FcdThCQkVcdTY3MDlcdTUzRTRcdTk4Q0VcdTYyQ0RcdTcxNjdcdTUzM0FcdTMwMDFcdTRGMjBcdTdFREZcdTYyNEJcdTVERTVcdTgyN0FcdTRGNTNcdTlBOENcdUZGMDhcdTUyNkFcdTdFQjhcdTMwMDFcdTYzNEZcdTk3NjJcdTRFQkFcdTMwMDFcdTc1M0JcdTYyNDdcdTk3NjJcdUZGMDlcdTMwMDFcdTgzMzZcdTgyN0FcdTg4NjhcdTZGMTRcdTMwMDFcdTUzRTRcdTUxNzhcdTRFNTBcdTU2NjhcdTZGMTRcdTU5NEZcdTdCNDlcdTMwMDInLFxyXG4gICAgY2F0ZWdvcnk6ICdjdWx0dXJlJyBhcyBjb25zdCxcclxuICAgIG9yZ2FuaXplcjogJ1x1NTZGRFx1NUI2Nlx1NzkzRScsXHJcbiAgICBsb2NhdGlvbjogJ1x1NjgyMVx1NTZFRFx1NEVCQVx1NURFNVx1NkU1Nlx1NzU1NCcsXHJcbiAgICBzdGFydFRpbWU6ICcyMDI2LTA0LTI3VDEzOjAwOjAwWicsXHJcbiAgICBlbmRUaW1lOiAnMjAyNi0wNC0yN1QxNzowMDowMFonLFxyXG4gICAgbWF4UGFydGljaXBhbnRzOiAyMDAsXHJcbiAgICBjdXJyZW50UGFydGljaXBhbnRzOiAxNTYsXHJcbiAgICBzdGF0dXM6ICd1cGNvbWluZycgYXMgY29uc3QsXHJcbiAgICBmZWU6IDEwLFxyXG4gICAgdGFnczogWydcdTZDNDlcdTY3MEQnLCAnXHU0RjIwXHU3RURGXHU2NTg3XHU1MzE2JywgJ1x1NkUzOFx1NTZFRFx1NEYxQSddLFxyXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wNC0wMVQxMDowMDowMFonLFxyXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wNC0wNVQxMTowMDowMFonXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogJ2FjdDYnLFxyXG4gICAgdGl0bGU6ICdcdTY2MjVcdTVCNjNcdTYyREJcdTgwNThcdTVCQTNcdThCQjJcdTRGMUFcdTIwMTRcdTIwMTRcdTRFOTJcdTgwNTRcdTdGNTFcdTU5MjdcdTUzODJcdTRFMTNcdTU3M0EnLFxyXG4gICAgY292ZXJJbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTUyNjY0NzMwLWQzMDdjYTg4NDk3OD93PTYwMCZoPTMwMCZmaXQ9Y3JvcCcsXHJcbiAgICBkZXNjcmlwdGlvbjogJ1x1OTA4MFx1OEJGN1x1NUI1N1x1ODI4Mlx1OERGM1x1NTJBOFx1MzAwMVx1ODE3RVx1OEJBRlx1MzAwMVx1OTYzRlx1OTFDQ1x1NURGNFx1NURGNFx1MzAwMVx1N0Y4RVx1NTZFMlx1MzAwMVx1NzY3RVx1NUVBNlx1N0I0OVx1NzdFNVx1NTQwRFx1NEU5Mlx1ODA1NFx1N0Y1MVx1NEYwMVx1NEUxQUhSXHU1NDhDXHU2MjgwXHU2NzJGXHU4RDFGXHU4RDIzXHU0RUJBXHU4RkRCXHU4ODRDXHU1QkEzXHU4QkIyXHU1NDhDXHU5NzYyXHU4QkQ1XHU2MzA3XHU1QkZDXHUzMDAyXHU3M0IwXHU1NzNBXHU2M0E1XHU2NTM2XHU3QjgwXHU1Mzg2XHVGRjBDXHU0RjE4XHU3OUMwXHU4MDA1XHU1M0VGXHU4M0I3XHU1Rjk3XHU3NkY0XHU5MDFBXHU5NzYyXHU4QkQ1XHU2NzNBXHU0RjFBXHVGRjAxJyxcclxuICAgIGNhdGVnb3J5OiAnY2FyZWVyJyBhcyBjb25zdCxcclxuICAgIG9yZ2FuaXplcjogJ1x1NUMzMVx1NEUxQVx1NjMwN1x1NUJGQ1x1NEUyRFx1NUZDMycsXHJcbiAgICBsb2NhdGlvbjogJ1x1NTkyN1x1NUI2Nlx1NzUxRlx1NkQzQlx1NTJBOFx1NEUyRFx1NUZDM1x1NjJBNVx1NTQ0QVx1NTM4NScsXHJcbiAgICBzdGFydFRpbWU6ICcyMDI2LTA0LTEyVDE0OjAwOjAwWicsXHJcbiAgICBlbmRUaW1lOiAnMjAyNi0wNC0xMlQxODowMDowMFonLFxyXG4gICAgbWF4UGFydGljaXBhbnRzOiAzMDAsXHJcbiAgICBjdXJyZW50UGFydGljaXBhbnRzOiAyMzQsXHJcbiAgICBzdGF0dXM6ICd1cGNvbWluZycgYXMgY29uc3QsXHJcbiAgICBmZWU6IDAsXHJcbiAgICB0YWdzOiBbJ1x1NjJEQlx1ODA1OCcsICdcdTVCOUVcdTRFNjAnLCAnXHU2ODIxXHU2MkRCJ10sXHJcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTAzLTIyVDA5OjAwOjAwWicsXHJcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA0LTA0VDE1OjAwOjAwWidcclxuICB9XHJcbl1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09IE1vY2sgQVBJIFx1NUI5QVx1NEU0OSA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgW1xyXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFx1NTU0Nlx1NTRDMVx1NzZGOFx1NTE3M1x1NjNBNVx1NTNFMyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTU1NDZcdTU0QzFcdTUyMDZcdTdDN0JcdTUyMTdcdTg4NjhcclxuICAgKiBHRVQgL2FwaS9jYXRlZ29yaWVzXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9jYXRlZ29yaWVzJyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKCkgPT4ge1xyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKGNhdGVnb3JpZXMpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU4M0I3XHU1M0Q2XHU1NTQ2XHU1NEMxXHU1MjE3XHU4ODY4XHVGRjA4XHU1MjA2XHU5ODc1XHVGRjA5XHJcbiAgICogR0VUIC9hcGkvcHJvZHVjdHM/cGFnZT0xJnBhZ2VTaXplPTEwJmNhdGVnb3J5SWQ9JmtleXdvcmQ9JnNvcnQ9XHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9wcm9kdWN0cycsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICh7IHF1ZXJ5IH06IHsgcXVlcnk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSkgPT4ge1xyXG4gICAgICBjb25zdCBwYWdlID0gcGFyc2VJbnQocXVlcnkucGFnZSB8fCAnMScpXHJcbiAgICAgIGNvbnN0IHBhZ2VTaXplID0gcGFyc2VJbnQocXVlcnkucGFnZVNpemUgfHwgJzEwJylcclxuICAgICAgY29uc3QgY2F0ZWdvcnlJZCA9IHF1ZXJ5LmNhdGVnb3J5SWRcclxuICAgICAgY29uc3Qga2V5d29yZCA9IHF1ZXJ5LmtleXdvcmQ/LnRvTG93ZXJDYXNlKClcclxuICAgICAgY29uc3Qgc29ydCA9IHF1ZXJ5LnNvcnRcclxuXHJcbiAgICAgIGxldCBmaWx0ZXJlZFByb2R1Y3RzID0gWy4uLnByb2R1Y3RzXVxyXG5cclxuICAgICAgLy8gXHU1MjA2XHU3QzdCXHU3QjVCXHU5MDA5XHJcbiAgICAgIGlmIChjYXRlZ29yeUlkICYmIGNhdGVnb3J5SWQgIT09ICdhbGwnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRQcm9kdWN0cyA9IGZpbHRlcmVkUHJvZHVjdHMuZmlsdGVyKHAgPT4gcC5jYXRlZ29yeUlkID09PSBjYXRlZ29yeUlkKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBcdTUxNzNcdTk1MkVcdThCQ0RcdTY0MUNcdTdEMjJcclxuICAgICAgaWYgKGtleXdvcmQpIHtcclxuICAgICAgICBmaWx0ZXJlZFByb2R1Y3RzID0gZmlsdGVyZWRQcm9kdWN0cy5maWx0ZXIocCA9PlxyXG4gICAgICAgICAgcC5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHxcclxuICAgICAgICAgIHAuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fFxyXG4gICAgICAgICAgcC50YWdzLnNvbWUodCA9PiB0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBcdTYzOTJcdTVFOEZcclxuICAgICAgaWYgKHNvcnQgPT09ICdwcmljZV9hc2MnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRQcm9kdWN0cy5zb3J0KChhLCBiKSA9PiBhLnByaWNlIC0gYi5wcmljZSlcclxuICAgICAgfSBlbHNlIGlmIChzb3J0ID09PSAncHJpY2VfZGVzYycpIHtcclxuICAgICAgICBmaWx0ZXJlZFByb2R1Y3RzLnNvcnQoKGEsIGIpID0+IGIucHJpY2UgLSBhLnByaWNlKVxyXG4gICAgICB9IGVsc2UgaWYgKHNvcnQgPT09ICdzYWxlcycpIHtcclxuICAgICAgICBmaWx0ZXJlZFByb2R1Y3RzLnNvcnQoKGEsIGIpID0+IGIuc2FsZXMgLSBhLnNhbGVzKVxyXG4gICAgICB9IGVsc2UgaWYgKHNvcnQgPT09ICdyYXRpbmcnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRQcm9kdWN0cy5zb3J0KChhLCBiKSA9PiBiLnJhdGluZyAtIGEucmF0aW5nKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHBhZ2luYXRlKGZpbHRlcmVkUHJvZHVjdHMsIHBhZ2UsIHBhZ2VTaXplKSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTYzQThcdTgzNTBcdTU1NDZcdTU0QzFcclxuICAgKiBHRVQgL2FwaS9wcm9kdWN0cy9yZWNvbW1lbmQ/bGltaXQ9MTBcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL3Byb2R1Y3RzL3JlY29tbWVuZCcsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICh7IHF1ZXJ5IH06IHsgcXVlcnk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSkgPT4ge1xyXG4gICAgICBjb25zdCBsaW1pdCA9IHBhcnNlSW50KHF1ZXJ5LmxpbWl0IHx8ICcxMCcpXHJcbiAgICAgIGNvbnN0IHJlY29tbWVuZGVkID0gWy4uLnByb2R1Y3RzXVxyXG4gICAgICAgIC5zb3J0KCgpID0+IE1hdGgucmFuZG9tKCkgLSAwLjUpXHJcbiAgICAgICAgLnNsaWNlKDAsIGxpbWl0KVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHJlY29tbWVuZGVkKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1ODNCN1x1NTNENlx1NzBFRFx1OTVFOFx1NTU0Nlx1NTRDMVxyXG4gICAqIEdFVCAvYXBpL3Byb2R1Y3RzL2hvdD9saW1pdD0xMFxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvcHJvZHVjdHMvaG90JyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKHsgcXVlcnkgfTogeyBxdWVyeTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IGxpbWl0ID0gcGFyc2VJbnQocXVlcnkubGltaXQgfHwgJzEwJylcclxuICAgICAgY29uc3QgaG90UHJvZHVjdHMgPSBbLi4ucHJvZHVjdHNdXHJcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGIuc2FsZXMgLSBhLnNhbGVzKVxyXG4gICAgICAgIC5zbGljZSgwLCBsaW1pdClcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZShob3RQcm9kdWN0cylcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTU1NDZcdTU0QzFcdTY0MUNcdTdEMjJcclxuICAgKiBHRVQgL2FwaS9wcm9kdWN0cy9zZWFyY2g/a2V5d29yZD14eHhcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL3Byb2R1Y3RzL3NlYXJjaCcsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICh7IHF1ZXJ5IH06IHsgcXVlcnk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSkgPT4ge1xyXG4gICAgICBjb25zdCBrZXl3b3JkID0gcXVlcnkua2V5d29yZD8udG9Mb3dlckNhc2UoKVxyXG4gICAgICBjb25zdCBwYWdlID0gcGFyc2VJbnQocXVlcnkucGFnZSB8fCAnMScpXHJcbiAgICAgIGNvbnN0IHBhZ2VTaXplID0gcGFyc2VJbnQocXVlcnkucGFnZVNpemUgfHwgJzEwJylcclxuICAgICAgbGV0IGZpbHRlcmVkUHJvZHVjdHMgPSBbLi4ucHJvZHVjdHNdXHJcbiAgICAgIGlmIChrZXl3b3JkKSB7XHJcbiAgICAgICAgZmlsdGVyZWRQcm9kdWN0cyA9IGZpbHRlcmVkUHJvZHVjdHMuZmlsdGVyKHAgPT5cclxuICAgICAgICAgIHAubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8XHJcbiAgICAgICAgICBwLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHxcclxuICAgICAgICAgIHAudGFncy5zb21lKHQgPT4gdC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpKVxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHBhZ2luYXRlKGZpbHRlcmVkUHJvZHVjdHMsIHBhZ2UsIHBhZ2VTaXplKSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTU1NDZcdTU0QzFcdThCRTZcdTYwQzVcclxuICAgKiBHRVQgL2FwaS9wcm9kdWN0cy86aWRcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6IC9cXC9hcGlcXC9wcm9kdWN0c1xcLyhcXHcrKS8sXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6IChjb25maWc6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBjb25maWcudXJsIGFzIHN0cmluZ1xyXG4gICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvYXBpXFwvcHJvZHVjdHNcXC8oXFx3KykvKVxyXG4gICAgICBjb25zdCBpZCA9IG1hdGNoID8gbWF0Y2hbMV0gOiAnJ1xyXG4gICAgICBjb25zdCBwcm9kdWN0ID0gcHJvZHVjdHMuZmluZChwID0+IHAuaWQgPT09IGlkKVxyXG4gICAgICBpZiAoIXByb2R1Y3QpIHtcclxuICAgICAgICByZXR1cm4geyBjb2RlOiA0MDQsIG1lc3NhZ2U6ICdcdTU1NDZcdTU0QzFcdTRFMERcdTVCNThcdTU3MjgnLCBkYXRhOiBudWxsLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UocHJvZHVjdClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBcdThCQTJcdTUzNTVcdTc2RjhcdTUxNzNcdTYzQTVcdTUzRTMgPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgLyoqXHJcbiAgICogXHU4M0I3XHU1M0Q2XHU4QkEyXHU1MzU1XHU1MjE3XHU4ODY4XHVGRjA4XHU1MjA2XHU5ODc1XHVGRjA5XHJcbiAgICogR0VUIC9hcGkvb3JkZXJzP3BhZ2U9MSZwYWdlU2l6ZT0xMCZzdGF0dXM9XHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9vcmRlcnMnLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9OiB7IHF1ZXJ5OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0pID0+IHtcclxuICAgICAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHF1ZXJ5LnBhZ2UgfHwgJzEnKVxyXG4gICAgICBjb25zdCBwYWdlU2l6ZSA9IHBhcnNlSW50KHF1ZXJ5LnBhZ2VTaXplIHx8ICcxMCcpXHJcbiAgICAgIGNvbnN0IHN0YXR1cyA9IHF1ZXJ5LnN0YXR1c1xyXG5cclxuICAgICAgbGV0IGZpbHRlcmVkT3JkZXJzID0gWy4uLm9yZGVyc10ucmV2ZXJzZSgpXHJcblxyXG4gICAgICAvLyBcdTcyQjZcdTYwMDFcdTdCNUJcdTkwMDlcclxuICAgICAgaWYgKHN0YXR1cyAmJiBzdGF0dXMgIT09ICdhbGwnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRPcmRlcnMgPSBmaWx0ZXJlZE9yZGVycy5maWx0ZXIobyA9PiBvLnN0YXR1cyA9PT0gc3RhdHVzKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHBhZ2luYXRlKGZpbHRlcmVkT3JkZXJzLCBwYWdlLCBwYWdlU2l6ZSkpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU4M0I3XHU1M0Q2XHU4QkEyXHU1MzU1XHU4QkU2XHU2MEM1XHJcbiAgICogR0VUIC9hcGkvb3JkZXJzLzppZFxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogL1xcL2FwaVxcL29yZGVyc1xcLyhcXHcrKSQvLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoY29uZmlnOiBhbnkpID0+IHtcclxuICAgICAgY29uc3QgdXJsID0gY29uZmlnLnVybCBhcyBzdHJpbmdcclxuICAgICAgY29uc3QgbWF0Y2ggPSB1cmwubWF0Y2goL1xcL2FwaVxcL29yZGVyc1xcLyhcXHcrKSQvKVxyXG4gICAgICBjb25zdCBpZCA9IG1hdGNoID8gbWF0Y2hbMV0gOiAnJ1xyXG4gICAgICBjb25zdCBvcmRlciA9IG9yZGVycy5maW5kKG8gPT4gby5pZCA9PT0gaWQpXHJcbiAgICAgIGlmICghb3JkZXIpIHtcclxuICAgICAgICByZXR1cm4geyBjb2RlOiA0MDQsIG1lc3NhZ2U6ICdcdThCQTJcdTUzNTVcdTRFMERcdTVCNThcdTU3MjgnLCBkYXRhOiBudWxsLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2Uob3JkZXIpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU1MjFCXHU1RUZBXHU4QkEyXHU1MzU1XHJcbiAgICogUE9TVCAvYXBpL29yZGVyc1xyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvb3JkZXJzJyxcclxuICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgcmVzcG9uc2U6ICh7IGJvZHkgfTogeyBib2R5OiBhbnkgfSkgPT4ge1xyXG4gICAgICBjb25zdCBuZXdPcmRlcjogT3JkZXIgPSB7XHJcbiAgICAgICAgaWQ6IGBvcmRlciR7U3RyaW5nKG9yZGVycy5sZW5ndGggKyAxKS5wYWRTdGFydCgzLCAnMCcpfWAsXHJcbiAgICAgICAgb3JkZXJObzogZ2VuZXJhdGVPcmRlck5vKCksXHJcbiAgICAgICAgdXNlcklkOiAndXNlcjAwMScsXHJcbiAgICAgICAgaXRlbXM6IGJvZHkuaXRlbXMsXHJcbiAgICAgICAgdG90YWxBbW91bnQ6IGJvZHkudG90YWxBbW91bnQsXHJcbiAgICAgICAgZGlzY291bnRBbW91bnQ6IGJvZHkuZGlzY291bnRBbW91bnQgfHwgMCxcclxuICAgICAgICBmcmVpZ2h0QW1vdW50OiBib2R5LmZyZWlnaHRBbW91bnQgfHwgMCxcclxuICAgICAgICBwYXlBbW91bnQ6IGJvZHkucGF5QW1vdW50LFxyXG4gICAgICAgIHN0YXR1czogJ3BlbmRpbmcnLFxyXG4gICAgICAgIHJlY2VpdmVyTmFtZTogYm9keS5yZWNlaXZlck5hbWUsXHJcbiAgICAgICAgcmVjZWl2ZXJQaG9uZTogYm9keS5yZWNlaXZlclBob25lLFxyXG4gICAgICAgIHJlY2VpdmVyQWRkcmVzczogYm9keS5yZWNlaXZlckFkZHJlc3MsXHJcbiAgICAgICAgcmVtYXJrOiBib2R5LnJlbWFyayxcclxuICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxyXG4gICAgICB9XHJcbiAgICAgIG9yZGVycy51bnNoaWZ0KG5ld09yZGVyKVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKG5ld09yZGVyKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NTNENlx1NkQ4OFx1OEJBMlx1NTM1NVxyXG4gICAqIFBVVCAvYXBpL29yZGVycy86aWQvY2FuY2VsXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAvXFwvYXBpXFwvb3JkZXJzXFwvKFxcdyspXFwvY2FuY2VsJC8sXHJcbiAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgcmVzcG9uc2U6IChjb25maWc6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBjb25maWcudXJsIGFzIHN0cmluZ1xyXG4gICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvYXBpXFwvb3JkZXJzXFwvKFxcdyspXFwvY2FuY2VsJC8pXHJcbiAgICAgIGNvbnN0IGlkID0gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnXHJcbiAgICAgIGNvbnN0IG9yZGVyID0gb3JkZXJzLmZpbmQobyA9PiBvLmlkID09PSBpZClcclxuICAgICAgaWYgKCFvcmRlcikge1xyXG4gICAgICAgIHJldHVybiB7IGNvZGU6IDQwNCwgbWVzc2FnZTogJ1x1OEJBMlx1NTM1NVx1NEUwRFx1NUI1OFx1NTcyOCcsIGRhdGE6IG51bGwsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFbJ3BlbmRpbmcnLCAncGFpZCddLmluY2x1ZGVzKG9yZGVyLnN0YXR1cykpIHtcclxuICAgICAgICByZXR1cm4geyBjb2RlOiA0MDAsIG1lc3NhZ2U6ICdcdTVGNTNcdTUyNERcdTcyQjZcdTYwMDFcdTY1RTBcdTZDRDVcdTUzRDZcdTZEODgnLCBkYXRhOiBudWxsLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfVxyXG4gICAgICB9XHJcbiAgICAgIG9yZGVyLnN0YXR1cyA9ICdjYW5jZWxsZWQnXHJcbiAgICAgIG9yZGVyLnVwZGF0ZWRBdCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKG9yZGVyKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1Nzg2RVx1OEJBNFx1NjUzNlx1OEQyN1xyXG4gICAqIFBPU1QgL2FwaS9vcmRlcnMvOmlkL2NvbmZpcm1cclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6IC9cXC9hcGlcXC9vcmRlcnNcXC8oXFx3KylcXC9jb25maXJtJC8sXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoY29uZmlnOiBhbnkpID0+IHtcclxuICAgICAgY29uc3QgdXJsID0gY29uZmlnLnVybCBhcyBzdHJpbmdcclxuICAgICAgY29uc3QgbWF0Y2ggPSB1cmwubWF0Y2goL1xcL2FwaVxcL29yZGVyc1xcLyhcXHcrKVxcL2NvbmZpcm0kLylcclxuICAgICAgY29uc3QgaWQgPSBtYXRjaCA/IG1hdGNoWzFdIDogJydcclxuICAgICAgY29uc3Qgb3JkZXIgPSBvcmRlcnMuZmluZChvID0+IG8uaWQgPT09IGlkKVxyXG4gICAgICBpZiAoIW9yZGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgY29kZTogNDA0LCBtZXNzYWdlOiAnXHU4QkEyXHU1MzU1XHU0RTBEXHU1QjU4XHU1NzI4JywgZGF0YTogbnVsbCwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBcdTY1MkZcdTYzMDEgJ3NoaXBwZWQnIChcdTUyNERcdTdBRUZcdTcyQjZcdTYwMDEpIFx1NTQ4QyAnZGVsaXZlcmVkJyAoXHU1NDBFXHU3QUVGXHU3MkI2XHU2MDAxKVxyXG4gICAgICBpZiAob3JkZXIuc3RhdHVzICE9PSAnc2hpcHBlZCcgJiYgb3JkZXIuc3RhdHVzICE9PSAnZGVsaXZlcmVkJykge1xyXG4gICAgICAgIHJldHVybiB7IGNvZGU6IDQwMCwgbWVzc2FnZTogJ1x1NUY1M1x1NTI0RFx1NzJCNlx1NjAwMVx1NjVFMFx1NkNENVx1Nzg2RVx1OEJBNFx1NjUzNlx1OEQyNycsIGRhdGE6IG51bGwsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9XHJcbiAgICAgIH1cclxuICAgICAgb3JkZXIuc3RhdHVzID0gJ2NvbXBsZXRlZCdcclxuICAgICAgb3JkZXIuY29tcGxldGVUaW1lID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgICAgIG9yZGVyLnVwZGF0ZWRBdCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKG9yZGVyKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1ODNCN1x1NTNENlx1OEJBMlx1NTM1NVx1N0VERlx1OEJBMVxyXG4gICAqIEdFVCAvYXBpL29yZGVycy9zdGF0c1xyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvb3JkZXJzL3N0YXRzJyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKCkgPT4ge1xyXG4gICAgICBjb25zdCBzdGF0cyA9IHtcclxuICAgICAgICB0b3RhbDogb3JkZXJzLmxlbmd0aCxcclxuICAgICAgICBwZW5kaW5nOiBvcmRlcnMuZmlsdGVyKG8gPT4gby5zdGF0dXMgPT09ICdwZW5kaW5nJykubGVuZ3RoLFxyXG4gICAgICAgIHBhaWQ6IG9yZGVycy5maWx0ZXIobyA9PiBvLnN0YXR1cyA9PT0gJ3BhaWQnKS5sZW5ndGgsXHJcbiAgICAgICAgc2hpcHBlZDogb3JkZXJzLmZpbHRlcihvID0+IG8uc3RhdHVzID09PSAnc2hpcHBlZCcpLmxlbmd0aCxcclxuICAgICAgICBkZWxpdmVyZWQ6IG9yZGVycy5maWx0ZXIobyA9PiBvLnN0YXR1cyA9PT0gJ2RlbGl2ZXJlZCcpLmxlbmd0aCxcclxuICAgICAgICBjb21wbGV0ZWQ6IG9yZGVycy5maWx0ZXIobyA9PiBvLnN0YXR1cyA9PT0gJ2NvbXBsZXRlZCcpLmxlbmd0aCxcclxuICAgICAgICBjYW5jZWxsZWQ6IG9yZGVycy5maWx0ZXIobyA9PiBvLnN0YXR1cyA9PT0gJ2NhbmNlbGxlZCcpLmxlbmd0aCxcclxuICAgICAgICByZWZ1bmRpbmc6IG9yZGVycy5maWx0ZXIobyA9PiBvLnN0YXR1cyA9PT0gJ3JlZnVuZGluZycpLmxlbmd0aFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2Uoc3RhdHMpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gXHU4RDJEXHU3MjY5XHU4RjY2XHU3NkY4XHU1MTczXHU2M0E1XHU1M0UzID09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIC8qKlxyXG4gICAqIFx1ODNCN1x1NTNENlx1OEQyRFx1NzI2OVx1OEY2Nlx1NTIxN1x1ODg2OFxyXG4gICAqIEdFVCAvYXBpL2NhcnRcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NhcnQnLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRvdGFsSXRlbXMgPSBjYXJ0SXRlbXMucmVkdWNlKChzdW0sIGl0ZW0pID0+IHN1bSArIGl0ZW0ucXVhbnRpdHksIDApXHJcbiAgICAgIGNvbnN0IHRvdGFsQW1vdW50ID0gY2FydEl0ZW1zLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiBzdW0gKyBpdGVtLnByaWNlICogaXRlbS5xdWFudGl0eSwgMClcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IGNhcnRJdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnNlbGVjdGVkKVxyXG4gICAgICBjb25zdCBzZWxlY3RlZENvdW50ID0gc2VsZWN0ZWRJdGVtcy5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gc3VtICsgaXRlbS5xdWFudGl0eSwgMClcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRBbW91bnQgPSBzZWxlY3RlZEl0ZW1zLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiBzdW0gKyBpdGVtLnByaWNlICogaXRlbS5xdWFudGl0eSwgMClcclxuXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2Uoe1xyXG4gICAgICAgIGl0ZW1zOiBjYXJ0SXRlbXMsXHJcbiAgICAgICAgdG90YWxJdGVtcyxcclxuICAgICAgICB0b3RhbEFtb3VudCxcclxuICAgICAgICBzZWxlY3RlZENvdW50LFxyXG4gICAgICAgIHNlbGVjdGVkQW1vdW50LFxyXG4gICAgICAgIHNhdmVkQW1vdW50OiAwXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU2REZCXHU1MkEwXHU1NTQ2XHU1NEMxXHU1MjMwXHU4RDJEXHU3MjY5XHU4RjY2XHJcbiAgICogUE9TVCAvYXBpL2NhcnRcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NhcnQnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKHsgYm9keSB9OiB7IGJvZHk6IGFueSB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKHAgPT4gcC5pZCA9PT0gYm9keS5wcm9kdWN0SWQpXHJcbiAgICAgIGlmICghcHJvZHVjdCkge1xyXG4gICAgICAgIHJldHVybiB7IGNvZGU6IDQwNCwgbWVzc2FnZTogJ1x1NTU0Nlx1NTRDMVx1NEUwRFx1NUI1OFx1NTcyOCcsIGRhdGE6IG51bGwsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NjYyRlx1NTQyNlx1NURGMlx1NTcyOFx1OEQyRFx1NzI2OVx1OEY2Nlx1NEUyRFxyXG4gICAgICBjb25zdCBleGlzdGluZ0l0ZW0gPSBjYXJ0SXRlbXMuZmluZChpdGVtID0+IGl0ZW0ucHJvZHVjdElkID09PSBib2R5LnByb2R1Y3RJZClcclxuICAgICAgaWYgKGV4aXN0aW5nSXRlbSkge1xyXG4gICAgICAgIGV4aXN0aW5nSXRlbS5xdWFudGl0eSArPSBib2R5LnF1YW50aXR5IHx8IDFcclxuICAgICAgICBleGlzdGluZ0l0ZW0udXBkYXRlZEF0ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZShleGlzdGluZ0l0ZW0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG5ld0l0ZW06IENhcnRJdGVtID0ge1xyXG4gICAgICAgIGlkOiBgY2FydCR7U3RyaW5nKGNhcnRJdGVtcy5sZW5ndGggKyAxKS5wYWRTdGFydCgzLCAnMCcpfWAsXHJcbiAgICAgICAgcHJvZHVjdElkOiBwcm9kdWN0LmlkLFxyXG4gICAgICAgIHByb2R1Y3Q6IHtcclxuICAgICAgICAgIGlkOiBwcm9kdWN0LmlkLFxyXG4gICAgICAgICAgbmFtZTogcHJvZHVjdC5uYW1lLFxyXG4gICAgICAgICAgaW1hZ2U6IHByb2R1Y3QuaW1hZ2UsXHJcbiAgICAgICAgICBwcmljZTogcHJvZHVjdC5wcmljZSxcclxuICAgICAgICAgIG9yaWdpbmFsUHJpY2U6IHByb2R1Y3Qub3JpZ2luYWxQcmljZSxcclxuICAgICAgICAgIHN0b2NrOiBwcm9kdWN0LnN0b2NrLFxyXG4gICAgICAgICAgc3RhdHVzOiBwcm9kdWN0LnN0YXR1c1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcXVhbnRpdHk6IGJvZHkucXVhbnRpdHkgfHwgMSxcclxuICAgICAgICBzZWxlY3RlZDogdHJ1ZSxcclxuICAgICAgICBhZGRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXHJcbiAgICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcclxuICAgICAgfVxyXG4gICAgICBjYXJ0SXRlbXMucHVzaChuZXdJdGVtKVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKG5ld0l0ZW0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU2NkY0XHU2NUIwXHU4RDJEXHU3MjY5XHU4RjY2XHU1NTQ2XHU1NEMxXHU2NTcwXHU5MUNGXHJcbiAgICogUFVUIC9hcGkvY2FydC86aWRcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6IC9cXC9hcGlcXC9jYXJ0XFwvKFxcdyspJC8sXHJcbiAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgcmVzcG9uc2U6IChjb25maWc6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBjb25maWcudXJsIGFzIHN0cmluZzsgY29uc3QgbWF0Y2ggPSB1cmwubWF0Y2goL1xcL2FwaVxcL2NhcnRcXC8oXFx3KykkLyk7IGNvbnN0IGlkID0gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnXHJcbiAgICAgIGNvbnN0IHsgYm9keSB9ID0gY29uZmlnXHJcbiAgICAgIGNvbnN0IGl0ZW0gPSBjYXJ0SXRlbXMuZmluZChpID0+IGkuaWQgPT09IGlkKVxyXG4gICAgICBpZiAoIWl0ZW0pIHtcclxuICAgICAgICByZXR1cm4geyBjb2RlOiA0MDQsIG1lc3NhZ2U6ICdcdThEMkRcdTcyNjlcdThGNjZcdTk4NzlcdTRFMERcdTVCNThcdTU3MjgnLCBkYXRhOiBudWxsLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfVxyXG4gICAgICB9XHJcbiAgICAgIGl0ZW0ucXVhbnRpdHkgPSBib2R5LnF1YW50aXR5XHJcbiAgICAgIGlmIChib2R5LnNlbGVjdGVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpdGVtLnNlbGVjdGVkID0gYm9keS5zZWxlY3RlZFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoaXRlbSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTUyMjBcdTk2NjRcdThEMkRcdTcyNjlcdThGNjZcdTU1NDZcdTU0QzFcclxuICAgKiBERUxFVEUgL2FwaS9jYXJ0LzppZFxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogL1xcL2FwaVxcL2NhcnRcXC8oXFx3KykkLyxcclxuICAgIG1ldGhvZDogJ2RlbGV0ZScsXHJcbiAgICByZXNwb25zZTogKGNvbmZpZzogYW55KSA9PiB7XHJcbiAgICAgIGNvbnN0IHVybCA9IGNvbmZpZy51cmwgYXMgc3RyaW5nOyBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvYXBpXFwvY2FydFxcLyhcXHcrKSQvKTsgY29uc3QgaWQgPSBtYXRjaCA/IG1hdGNoWzFdIDogJydcclxuICAgICAgY29uc3QgaW5kZXggPSBjYXJ0SXRlbXMuZmluZEluZGV4KGkgPT4gaS5pZCA9PT0gaWQpXHJcbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm4geyBjb2RlOiA0MDQsIG1lc3NhZ2U6ICdcdThEMkRcdTcyNjlcdThGNjZcdTk4NzlcdTRFMERcdTVCNThcdTU3MjgnLCBkYXRhOiBudWxsLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfVxyXG4gICAgICB9XHJcbiAgICAgIGNhcnRJdGVtcy5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoeyBtZXNzYWdlOiAnXHU1MjIwXHU5NjY0XHU2MjEwXHU1MjlGJyB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NkUwNVx1N0E3QVx1OEQyRFx1NzI2OVx1OEY2NlxyXG4gICAqIERFTEVURSAvYXBpL2NhcnQvY2xlYXJcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NhcnQvY2xlYXInLFxyXG4gICAgbWV0aG9kOiAnZGVsZXRlJyxcclxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XHJcbiAgICAgIGNhcnRJdGVtcy5sZW5ndGggPSAwXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoeyBtZXNzYWdlOiAnXHU4RDJEXHU3MjY5XHU4RjY2XHU1REYyXHU2RTA1XHU3QTdBJyB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFx1NzUyOFx1NjIzN1x1NzZGOFx1NTE3M1x1NjNBNVx1NTNFMyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTVGNTNcdTUyNERcdTc1MjhcdTYyMzdcdTRGRTFcdTYwNkZcclxuICAgKiBHRVQgL2FwaS91c2VyL2luZm9cclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL3VzZXIvaW5mbycsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZShjdXJyZW50VXNlcilcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTY2RjRcdTY1QjBcdTc1MjhcdTYyMzdcdTRGRTFcdTYwNkZcclxuICAgKiBQVVQgL2FwaS91c2VyL2luZm9cclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL3VzZXIvaW5mbycsXHJcbiAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgcmVzcG9uc2U6ICh7IGJvZHkgfTogeyBib2R5OiBhbnkgfSkgPT4ge1xyXG4gICAgICBPYmplY3QuYXNzaWduKGN1cnJlbnRVc2VyLCBib2R5KVxyXG4gICAgICBjdXJyZW50VXNlci51cGRhdGVkQXQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZShjdXJyZW50VXNlcilcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTY1MzZcdThEMjdcdTU3MzBcdTU3NDBcdTUyMTdcdTg4NjhcclxuICAgKiBHRVQgL2FwaS9hZGRyZXNzZXNcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2FkZHJlc3NlcycsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZShhZGRyZXNzZXMpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU2REZCXHU1MkEwXHU2NTM2XHU4RDI3XHU1NzMwXHU1NzQwXHJcbiAgICogUE9TVCAvYXBpL2FkZHJlc3Nlc1xyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvYWRkcmVzc2VzJyxcclxuICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgcmVzcG9uc2U6ICh7IGJvZHkgfTogeyBib2R5OiBhbnkgfSkgPT4ge1xyXG4gICAgICBjb25zdCBuZXdBZGRyZXNzOiBBZGRyZXNzID0ge1xyXG4gICAgICAgIGlkOiBgYWRkciR7U3RyaW5nKGFkZHJlc3Nlcy5sZW5ndGggKyAxKS5wYWRTdGFydCgzLCAnMCcpfWAsXHJcbiAgICAgICAgdXNlcklkOiAndXNlcjAwMScsXHJcbiAgICAgICAgcmVjZWl2ZXJOYW1lOiBib2R5Lm5hbWUgfHwgYm9keS5yZWNlaXZlck5hbWUgfHwgJycsXHJcbiAgICAgICAgcmVjZWl2ZXJQaG9uZTogYm9keS5waG9uZSB8fCBib2R5LnJlY2VpdmVyUGhvbmUgfHwgJycsXHJcbiAgICAgICAgcHJvdmluY2U6IGJvZHkucHJvdmluY2UgfHwgJycsXHJcbiAgICAgICAgY2l0eTogYm9keS5jaXR5IHx8ICcnLFxyXG4gICAgICAgIGRpc3RyaWN0OiBib2R5LmRpc3RyaWN0IHx8ICcnLFxyXG4gICAgICAgIGRldGFpbDogYm9keS5kZXRhaWwgfHwgYm9keS5kZXRhaWxBZGRyZXNzIHx8ICcnLFxyXG4gICAgICAgIGZ1bGxBZGRyZXNzOiBgJHtib2R5LnByb3ZpbmNlIHx8ICcnfSR7Ym9keS5jaXR5IHx8ICcnfSR7Ym9keS5kaXN0cmljdCB8fCAnJ30ke2JvZHkuZGV0YWlsIHx8IGJvZHkuZGV0YWlsQWRkcmVzcyB8fCAnJ31gLFxyXG4gICAgICAgIGlzRGVmYXVsdDogYm9keS5pc0RlZmF1bHQgfHwgZmFsc2UsXHJcbiAgICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gXHU1OTgyXHU2NzlDXHU4QkJFXHU0RTNBXHU5RUQ4XHU4QkE0XHU1NzMwXHU1NzQwXHVGRjBDXHU1M0Q2XHU2RDg4XHU1MTc2XHU0RUQ2XHU5RUQ4XHU4QkE0XHJcbiAgICAgIGlmIChuZXdBZGRyZXNzLmlzRGVmYXVsdCkge1xyXG4gICAgICAgIGFkZHJlc3Nlcy5mb3JFYWNoKGFkZHIgPT4gYWRkci5pc0RlZmF1bHQgPSBmYWxzZSlcclxuICAgICAgfVxyXG5cclxuICAgICAgYWRkcmVzc2VzLnB1c2gobmV3QWRkcmVzcylcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZShuZXdBZGRyZXNzKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NjZGNFx1NjVCMFx1NjUzNlx1OEQyN1x1NTczMFx1NTc0MFxyXG4gICAqIFBVVCAvYXBpL2FkZHJlc3Nlcy86aWRcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6IC9cXC9hcGlcXC9hZGRyZXNzZXNcXC8oXFx3KykkLyxcclxuICAgIG1ldGhvZDogJ3B1dCcsXHJcbiAgICByZXNwb25zZTogKGNvbmZpZzogYW55KSA9PiB7XHJcbiAgICAgIGNvbnN0IHVybCA9IGNvbmZpZy51cmwgYXMgc3RyaW5nOyBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvYXBpXFwvYWRkcmVzc2VzXFwvKFxcdyspJC8pOyBjb25zdCBpZCA9IG1hdGNoID8gbWF0Y2hbMV0gOiAnJ1xyXG4gICAgICBjb25zdCB7IGJvZHkgfSA9IGNvbmZpZ1xyXG4gICAgICBjb25zdCBhZGRyZXNzID0gYWRkcmVzc2VzLmZpbmQoYSA9PiBhLmlkID09PSBpZClcclxuICAgICAgaWYgKCFhZGRyZXNzKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgY29kZTogNDA0LCBtZXNzYWdlOiAnXHU1NzMwXHU1NzQwXHU0RTBEXHU1QjU4XHU1NzI4JywgZGF0YTogbnVsbCwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gXHU1MTdDXHU1QkI5XHU0RTBEXHU1NDBDXHU1QjU3XHU2QkI1XHU1NDBEXHJcbiAgICAgIGlmIChib2R5Lm5hbWUpIGFkZHJlc3MucmVjZWl2ZXJOYW1lID0gYm9keS5uYW1lXHJcbiAgICAgIGlmIChib2R5LnJlY2VpdmVyTmFtZSkgYWRkcmVzcy5yZWNlaXZlck5hbWUgPSBib2R5LnJlY2VpdmVyTmFtZVxyXG4gICAgICBpZiAoYm9keS5waG9uZSkgYWRkcmVzcy5yZWNlaXZlclBob25lID0gYm9keS5waG9uZVxyXG4gICAgICBpZiAoYm9keS5yZWNlaXZlclBob25lKSBhZGRyZXNzLnJlY2VpdmVyUGhvbmUgPSBib2R5LnJlY2VpdmVyUGhvbmVcclxuICAgICAgaWYgKGJvZHkucHJvdmluY2UpIGFkZHJlc3MucHJvdmluY2UgPSBib2R5LnByb3ZpbmNlXHJcbiAgICAgIGlmIChib2R5LmNpdHkpIGFkZHJlc3MuY2l0eSA9IGJvZHkuY2l0eVxyXG4gICAgICBpZiAoYm9keS5kaXN0cmljdCkgYWRkcmVzcy5kaXN0cmljdCA9IGJvZHkuZGlzdHJpY3RcclxuICAgICAgaWYgKGJvZHkuZGV0YWlsKSBhZGRyZXNzLmRldGFpbCA9IGJvZHkuZGV0YWlsXHJcbiAgICAgIGlmIChib2R5LmRldGFpbEFkZHJlc3MpIGFkZHJlc3MuZGV0YWlsID0gYm9keS5kZXRhaWxBZGRyZXNzXHJcbiAgICAgIGlmIChib2R5LmlzRGVmYXVsdCAhPT0gdW5kZWZpbmVkKSBhZGRyZXNzLmlzRGVmYXVsdCA9IGJvZHkuaXNEZWZhdWx0XHJcbiAgICAgIFxyXG4gICAgICBhZGRyZXNzLmZ1bGxBZGRyZXNzID0gYCR7YWRkcmVzcy5wcm92aW5jZX0ke2FkZHJlc3MuY2l0eX0ke2FkZHJlc3MuZGlzdHJpY3R9JHthZGRyZXNzLmRldGFpbH1gXHJcblxyXG4gICAgICBpZiAoYm9keS5pc0RlZmF1bHQpIHtcclxuICAgICAgICBhZGRyZXNzZXMuZm9yRWFjaChhZGRyID0+IHtcclxuICAgICAgICAgIGlmIChhZGRyLmlkICE9PSBpZCkgYWRkci5pc0RlZmF1bHQgPSBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoYWRkcmVzcylcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTUyMjBcdTk2NjRcdTY1MzZcdThEMjdcdTU3MzBcdTU3NDBcclxuICAgKiBQT1NUIC9hcGkvYWRkcmVzc2VzLzppZC9kZWxldGVcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6IC9cXC9hcGlcXC9hZGRyZXNzZXNcXC8oXFx3KylcXC9kZWxldGUkLyxcclxuICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgcmVzcG9uc2U6IChjb25maWc6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBjb25maWcudXJsIGFzIHN0cmluZzsgY29uc3QgbWF0Y2ggPSB1cmwubWF0Y2goL1xcL2FwaVxcL2FkZHJlc3Nlc1xcLyhcXHcrKVxcL2RlbGV0ZSQvKTsgY29uc3QgaWQgPSBtYXRjaCA/IG1hdGNoWzFdIDogJydcclxuICAgICAgY29uc3QgaW5kZXggPSBhZGRyZXNzZXMuZmluZEluZGV4KGEgPT4gYS5pZCA9PT0gaWQpXHJcbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm4geyBjb2RlOiA0MDQsIG1lc3NhZ2U6ICdcdTU3MzBcdTU3NDBcdTRFMERcdTVCNThcdTU3MjgnLCBkYXRhOiBudWxsLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfVxyXG4gICAgICB9XHJcbiAgICAgIGFkZHJlc3Nlcy5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoeyBtZXNzYWdlOiAnXHU1MjIwXHU5NjY0XHU2MjEwXHU1MjlGJyB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1OEJCRVx1N0Y2RVx1OUVEOFx1OEJBNFx1NTczMFx1NTc0MFxyXG4gICAqIFBPU1QgL2FwaS9hZGRyZXNzZXMvOmlkL2RlZmF1bHRcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6IC9cXC9hcGlcXC9hZGRyZXNzZXNcXC8oXFx3KylcXC9kZWZhdWx0JC8sXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoY29uZmlnOiBhbnkpID0+IHtcclxuICAgICAgY29uc3QgdXJsID0gY29uZmlnLnVybCBhcyBzdHJpbmc7IGNvbnN0IG1hdGNoID0gdXJsLm1hdGNoKC9cXC9hcGlcXC9hZGRyZXNzZXNcXC8oXFx3KylcXC9kZWZhdWx0JC8pOyBjb25zdCBpZCA9IG1hdGNoID8gbWF0Y2hbMV0gOiAnJ1xyXG4gICAgICBjb25zdCBhZGRyZXNzID0gYWRkcmVzc2VzLmZpbmQoYSA9PiBhLmlkID09PSBpZClcclxuICAgICAgaWYgKCFhZGRyZXNzKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgY29kZTogNDA0LCBtZXNzYWdlOiAnXHU1NzMwXHU1NzQwXHU0RTBEXHU1QjU4XHU1NzI4JywgZGF0YTogbnVsbCwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH1cclxuICAgICAgfVxyXG4gICAgICBhZGRyZXNzZXMuZm9yRWFjaChhZGRyID0+IGFkZHIuaXNEZWZhdWx0ID0gZmFsc2UpXHJcbiAgICAgIGFkZHJlc3MuaXNEZWZhdWx0ID0gdHJ1ZVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKGFkZHJlc3MpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gXHU1OTE2XHU1MzU2XHU3NkY4XHU1MTczXHU2M0E1XHU1M0UzID09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIC8qKlxyXG4gICAqIFx1ODNCN1x1NTNENlx1NTkxNlx1NTM1Nlx1NTU0Nlx1NUJCNlx1NTIxN1x1ODg2OFxyXG4gICAqIEdFVCAvYXBpL2RlbGl2ZXJ5L21lcmNoYW50cz9jYXRlZ29yeT0ma2V5d29yZD0mc29ydD1cclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2RlbGl2ZXJ5L21lcmNoYW50cycsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICh7IHF1ZXJ5IH06IHsgcXVlcnk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSkgPT4ge1xyXG4gICAgICBjb25zdCBjYXRlZ29yeSA9IHF1ZXJ5LmNhdGVnb3J5XHJcbiAgICAgIGNvbnN0IGtleXdvcmQgPSBxdWVyeS5rZXl3b3JkPy50b0xvd2VyQ2FzZSgpXHJcbiAgICAgIGNvbnN0IHNvcnQgPSBxdWVyeS5zb3J0XHJcblxyXG4gICAgICBsZXQgZmlsdGVyZWRNZXJjaGFudHMgPSBbLi4ubWVyY2hhbnRzXVxyXG5cclxuICAgICAgLy8gXHU1MjA2XHU3QzdCXHU3QjVCXHU5MDA5XHJcbiAgICAgIGlmIChjYXRlZ29yeSAmJiBjYXRlZ29yeSAhPT0gJ2FsbCcpIHtcclxuICAgICAgICBmaWx0ZXJlZE1lcmNoYW50cyA9IGZpbHRlcmVkTWVyY2hhbnRzLmZpbHRlcihtID0+IG0uY2F0ZWdvcnkgPT09IGNhdGVnb3J5KVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBcdTUxNzNcdTk1MkVcdThCQ0RcdTY0MUNcdTdEMjJcclxuICAgICAgaWYgKGtleXdvcmQpIHtcclxuICAgICAgICBmaWx0ZXJlZE1lcmNoYW50cyA9IGZpbHRlcmVkTWVyY2hhbnRzLmZpbHRlcihtID0+XHJcbiAgICAgICAgICBtLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fFxyXG4gICAgICAgICAgbS50YWdzLnNvbWUodCA9PiB0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBcdTYzOTJcdTVFOEZcclxuICAgICAgaWYgKHNvcnQgPT09ICdyYXRpbmcnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRNZXJjaGFudHMuc29ydCgoYSwgYikgPT4gYi5yYXRpbmcgLSBhLnJhdGluZylcclxuICAgICAgfSBlbHNlIGlmIChzb3J0ID09PSAnc2FsZXMnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRNZXJjaGFudHMuc29ydCgoYSwgYikgPT4gYi5tb250aGx5U2FsZXMgLSBhLm1vbnRobHlTYWxlcylcclxuICAgICAgfSBlbHNlIGlmIChzb3J0ID09PSAnZGlzdGFuY2UnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRNZXJjaGFudHMuc29ydCgoYSwgYikgPT4gYS5kaXN0YW5jZSAtIGIuZGlzdGFuY2UpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoZmlsdGVyZWRNZXJjaGFudHMpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU4M0I3XHU1M0Q2XHU1NTQ2XHU1QkI2XHU4QkU2XHU2MEM1XHU1M0NBXHU4M0RDXHU1NEMxXHJcbiAgICogR0VUIC9hcGkvZGVsaXZlcnkvbWVyY2hhbnRzLzppZFxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogL1xcL2FwaVxcL2RlbGl2ZXJ5XFwvbWVyY2hhbnRzXFwvKFxcdyspJC8sXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6IChjb25maWc6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBjb25maWcudXJsIGFzIHN0cmluZzsgY29uc3QgbWF0Y2ggPSB1cmwubWF0Y2goL1xcL2FwaVxcL2RlbGl2ZXJ5XFwvbWVyY2hhbnRzXFwvKFxcdyspJC8pOyBjb25zdCBpZCA9IG1hdGNoID8gbWF0Y2hbMV0gOiAnJ1xyXG4gICAgICBjb25zdCBtZXJjaGFudCA9IG1lcmNoYW50cy5maW5kKG0gPT4gbS5pZCA9PT0gaWQpXHJcbiAgICAgIGlmICghbWVyY2hhbnQpIHtcclxuICAgICAgICByZXR1cm4geyBjb2RlOiA0MDQsIG1lc3NhZ2U6ICdcdTU1NDZcdTVCQjZcdTRFMERcdTVCNThcdTU3MjgnLCBkYXRhOiBudWxsLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGRpc2hlcyA9IGRpc2hlc1RlbXBsYXRlW2lkXSB8fCBbXVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHsgbWVyY2hhbnQsIGRpc2hlcyB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1ODNCN1x1NTNENlx1NTU0Nlx1NUJCNlx1NTIwNlx1N0M3Qlx1NTIxN1x1ODg2OFxyXG4gICAqIEdFVCAvYXBpL2RlbGl2ZXJ5L2NhdGVnb3JpZXNcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2RlbGl2ZXJ5L2NhdGVnb3JpZXMnLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBbLi4ubmV3IFNldChtZXJjaGFudHMubWFwKG0gPT4gbS5jYXRlZ29yeSkpXVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKGNhdGVnb3JpZXMpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU4M0I3XHU1M0Q2XHU2M0E4XHU4MzUwXHU1NTQ2XHU1QkI2XHJcbiAgICogR0VUIC9hcGkvZGVsaXZlcnkvbWVyY2hhbnRzL3JlY29tbWVuZD9saW1pdD01XHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9kZWxpdmVyeS9tZXJjaGFudHMvcmVjb21tZW5kJyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKHsgcXVlcnkgfTogeyBxdWVyeTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IGxpbWl0ID0gcGFyc2VJbnQocXVlcnkubGltaXQgfHwgJzUnKVxyXG4gICAgICBjb25zdCByZWNvbW1lbmRlZCA9IFsuLi5tZXJjaGFudHNdXHJcbiAgICAgICAgLmZpbHRlcihtID0+IG0uc3RhdHVzID09PSAnb3BlbicpXHJcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGIucmF0aW5nIC0gYS5yYXRpbmcgfHwgYi5tb250aGx5U2FsZXMgLSBhLm1vbnRobHlTYWxlcylcclxuICAgICAgICAuc2xpY2UoMCwgbGltaXQpXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UocmVjb21tZW5kZWQpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gXHU0RThDXHU2MjRCXHU1RTAyXHU1NzNBXHU3NkY4XHU1MTczXHU2M0E1XHU1M0UzID09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIC8qKlxyXG4gICAqIFx1ODNCN1x1NTNENlx1NEU4Q1x1NjI0Qlx1NTIwNlx1N0M3Qlx1NTIxN1x1ODg2OFxyXG4gICAqIEdFVCAvYXBpL3NlY29uZGhhbmQvY2F0ZWdvcmllc1xyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvc2Vjb25kaGFuZC9jYXRlZ29yaWVzJyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKCkgPT4ge1xyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHNlY29uZEhhbmRDYXRlZ29yaWVzKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1ODNCN1x1NTNENlx1NEU4Q1x1NjI0Qlx1NzI2OVx1NTRDMVx1NTIxN1x1ODg2OFx1RkYwOFx1NTIwNlx1OTg3NVx1RkYwOVxyXG4gICAqIEdFVCAvYXBpL3NlY29uZGhhbmQvaXRlbXM/cGFnZT0xJnBhZ2VTaXplPTEwJmNhdGVnb3J5SWQ9JmtleXdvcmQ9JmNvbmRpdGlvbj0mc29ydD1cclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL3NlY29uZGhhbmQvaXRlbXMnLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9OiB7IHF1ZXJ5OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0pID0+IHtcclxuICAgICAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHF1ZXJ5LnBhZ2UgfHwgJzEnKVxyXG4gICAgICBjb25zdCBwYWdlU2l6ZSA9IHBhcnNlSW50KHF1ZXJ5LnBhZ2VTaXplIHx8ICcxMCcpXHJcbiAgICAgIGNvbnN0IGNhdGVnb3J5SWQgPSBxdWVyeS5jYXRlZ29yeUlkXHJcbiAgICAgIGNvbnN0IGtleXdvcmQgPSBxdWVyeS5rZXl3b3JkPy50b0xvd2VyQ2FzZSgpXHJcbiAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHF1ZXJ5LmNvbmRpdGlvblxyXG4gICAgICBjb25zdCBzb3J0ID0gcXVlcnkuc29ydFxyXG5cclxuICAgICAgbGV0IGZpbHRlcmVkSXRlbXMgPSBbLi4uc2Vjb25kSGFuZEl0ZW1zXVxyXG5cclxuICAgICAgLy8gXHU1MjA2XHU3QzdCXHU3QjVCXHU5MDA5XHJcbiAgICAgIGlmIChjYXRlZ29yeUlkICYmIGNhdGVnb3J5SWQgIT09ICdhbGwnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRJdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5jYXRlZ29yeUlkID09PSBjYXRlZ29yeUlkKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBcdTUxNzNcdTk1MkVcdThCQ0RcdTY0MUNcdTdEMjJcclxuICAgICAgaWYgKGtleXdvcmQpIHtcclxuICAgICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaXRlbSA9PlxyXG4gICAgICAgICAgaXRlbS50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8XHJcbiAgICAgICAgICBpdGVtLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZClcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFx1NjIxMFx1ODI3Mlx1N0I1Qlx1OTAwOVxyXG4gICAgICBpZiAoY29uZGl0aW9uICYmIGNvbmRpdGlvbiAhPT0gJ2FsbCcpIHtcclxuICAgICAgICBmaWx0ZXJlZEl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLmNvbmRpdGlvbiA9PT0gY29uZGl0aW9uKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBcdTYzOTJcdTVFOEZcclxuICAgICAgaWYgKHNvcnQgPT09ICdwcmljZV9hc2MnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRJdGVtcy5zb3J0KChhLCBiKSA9PiBhLmN1cnJlbnRQcmljZSAtIGIuY3VycmVudFByaWNlKVxyXG4gICAgICB9IGVsc2UgaWYgKHNvcnQgPT09ICdwcmljZV9kZXNjJykge1xyXG4gICAgICAgIGZpbHRlcmVkSXRlbXMuc29ydCgoYSwgYikgPT4gYi5jdXJyZW50UHJpY2UgLSBhLmN1cnJlbnRQcmljZSlcclxuICAgICAgfSBlbHNlIGlmIChzb3J0ID09PSAndGltZScpIHtcclxuICAgICAgICBmaWx0ZXJlZEl0ZW1zLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGIuY3JlYXRlZEF0KS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShhLmNyZWF0ZWRBdCkuZ2V0VGltZSgpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHBhZ2luYXRlKGZpbHRlcmVkSXRlbXMsIHBhZ2UsIHBhZ2VTaXplKSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTRFOENcdTYyNEJcdTcyNjlcdTU0QzFcdThCRTZcdTYwQzVcclxuICAgKiBHRVQgL2FwaS9zZWNvbmRoYW5kL2l0ZW1zLzppZFxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogL1xcL2FwaVxcL3NlY29uZGhhbmRcXC9pdGVtc1xcLyhcXHcrKSQvLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoY29uZmlnOiBhbnkpID0+IHtcclxuICAgICAgY29uc3QgdXJsID0gY29uZmlnLnVybCBhcyBzdHJpbmc7IGNvbnN0IG1hdGNoID0gdXJsLm1hdGNoKC9cXC9hcGlcXC9zZWNvbmRoYW5kXFwvaXRlbXNcXC8oXFx3KykkLyk7IGNvbnN0IGlkID0gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnXHJcbiAgICAgIGNvbnN0IGl0ZW0gPSBzZWNvbmRIYW5kSXRlbXMuZmluZChpID0+IGkuaWQgPT09IGlkKVxyXG4gICAgICBpZiAoIWl0ZW0pIHtcclxuICAgICAgICByZXR1cm4geyBjb2RlOiA0MDQsIG1lc3NhZ2U6ICdcdTcyNjlcdTU0QzFcdTRFMERcdTVCNThcdTU3MjgnLCBkYXRhOiBudWxsLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIFx1NkEyMVx1NjJERlx1NkQ0Rlx1ODlDOFx1OTFDRlx1NTg5RVx1NTJBMFxyXG4gICAgICBpdGVtLnZpZXdDb3VudCsrXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoaXRlbSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTUzRDFcdTVFMDNcdTRFOENcdTYyNEJcdTcyNjlcdTU0QzFcclxuICAgKiBQT1NUIC9hcGkvc2Vjb25kaGFuZC9pdGVtc1xyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvc2Vjb25kaGFuZC9pdGVtcycsXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH06IHsgYm9keTogYW55IH0pID0+IHtcclxuICAgICAgY29uc3QgY2F0ZWdvcnkgPSBzZWNvbmRIYW5kQ2F0ZWdvcmllcy5maW5kKGMgPT4gYy5pZCA9PT0gYm9keS5jYXRlZ29yeUlkKVxyXG4gICAgICBjb25zdCBuZXdJdGVtOiBTZWNvbmRIYW5kSXRlbSA9IHtcclxuICAgICAgICBpZDogYGl0ZW0ke1N0cmluZyhzZWNvbmRIYW5kSXRlbXMubGVuZ3RoICsgMSkucGFkU3RhcnQoMywgJzAnKX1gLFxyXG4gICAgICAgIHNlbGxlcklkOiAndXNlcjAwMScsXHJcbiAgICAgICAgc2VsbGVyTmFtZTogY3VycmVudFVzZXIubmlja25hbWUsXHJcbiAgICAgICAgc2VsbGVyQXZhdGFyOiBjdXJyZW50VXNlci5hdmF0YXIsXHJcbiAgICAgICAgLi4uYm9keSxcclxuICAgICAgICBjYXRlZ29yeU5hbWU6IGNhdGVnb3J5Py5uYW1lIHx8ICcnLFxyXG4gICAgICAgIHZpZXdDb3VudDogMCxcclxuICAgICAgICBsaWtlQ291bnQ6IDAsXHJcbiAgICAgICAgY2hhdENvdW50OiAwLFxyXG4gICAgICAgIHN0YXR1czogJ29uX3NhbGUnLFxyXG4gICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgICAgIH1cclxuICAgICAgc2Vjb25kSGFuZEl0ZW1zLnVuc2hpZnQobmV3SXRlbSlcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZShuZXdJdGVtKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFx1NzkzRVx1NTMzQVx1OEJCQVx1NTc1Qlx1NzZGOFx1NTE3M1x1NjNBNVx1NTNFMyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdThCQkFcdTU3NUJcdTY3N0ZcdTU3NTdcdTUyMTdcdTg4NjhcclxuICAgKiBHRVQgL2FwaS9mb3J1bS9ib2FyZHNcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2ZvcnVtL2JvYXJkcycsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZShmb3J1bUJvYXJkcylcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTVFMTZcdTVCNTBcdTUyMTdcdTg4NjhcdUZGMDhcdTUyMDZcdTk4NzVcdUZGMDlcclxuICAgKiBHRVQgL2FwaS9mb3J1bS9wb3N0cz9wYWdlPTEmcGFnZVNpemU9MTAmYm9hcmRJZD0ma2V5d29yZD0mc29ydD1cclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2ZvcnVtL3Bvc3RzJyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKHsgcXVlcnkgfTogeyBxdWVyeTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHBhZ2UgPSBwYXJzZUludChxdWVyeS5wYWdlIHx8ICcxJylcclxuICAgICAgY29uc3QgcGFnZVNpemUgPSBwYXJzZUludChxdWVyeS5wYWdlU2l6ZSB8fCAnMTAnKVxyXG4gICAgICBjb25zdCBib2FyZElkID0gcXVlcnkuYm9hcmRJZFxyXG4gICAgICBjb25zdCBrZXl3b3JkID0gcXVlcnkua2V5d29yZD8udG9Mb3dlckNhc2UoKVxyXG4gICAgICBjb25zdCBzb3J0ID0gcXVlcnkuc29ydFxyXG5cclxuICAgICAgbGV0IGZpbHRlcmVkUG9zdHMgPSBbLi4uZm9ydW1Qb3N0c11cclxuXHJcbiAgICAgIC8vIFx1Njc3Rlx1NTc1N1x1N0I1Qlx1OTAwOVxyXG4gICAgICBpZiAoYm9hcmRJZCAmJiBib2FyZElkICE9PSAnYWxsJykge1xyXG4gICAgICAgIGZpbHRlcmVkUG9zdHMgPSBmaWx0ZXJlZFBvc3RzLmZpbHRlcihwID0+IHAuYm9hcmRJZCA9PT0gYm9hcmRJZClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gXHU1MTczXHU5NTJFXHU4QkNEXHU2NDFDXHU3RDIyXHJcbiAgICAgIGlmIChrZXl3b3JkKSB7XHJcbiAgICAgICAgZmlsdGVyZWRQb3N0cyA9IGZpbHRlcmVkUG9zdHMuZmlsdGVyKHAgPT5cclxuICAgICAgICAgIHAudGl0bGUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fFxyXG4gICAgICAgICAgcC5jb250ZW50LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZClcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFx1NjM5Mlx1NUU4Rlx1RkYwOFx1N0Y2RVx1OTg3Nlx1NEYxOFx1NTE0OFx1RkYwOVxyXG4gICAgICBpZiAoc29ydCA9PT0gJ3RpbWUnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRQb3N0cy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICBpZiAoYS5pc1RvcCAhPT0gYi5pc1RvcCkgcmV0dXJuIGIuaXNUb3AgPyAxIDogLTFcclxuICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShiLmxhc3RSZXBseUF0IHx8IGIuY3JlYXRlZEF0KS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShhLmxhc3RSZXBseUF0IHx8IGEuY3JlYXRlZEF0KS5nZXRUaW1lKClcclxuICAgICAgICB9KVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIFx1OUVEOFx1OEJBNFx1NjM5Mlx1NUU4Rlx1RkYxQVx1N0Y2RVx1OTg3NiA+IFx1N0NCRVx1NTM0RSA+IFx1NjcwMFx1NjVCMFx1NTZERVx1NTkwRFxyXG4gICAgICAgIGZpbHRlcmVkUG9zdHMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgaWYgKGEuaXNUb3AgIT09IGIuaXNUb3ApIHJldHVybiBiLmlzVG9wID8gMSA6IC0xXHJcbiAgICAgICAgICBpZiAoYS5pc0Vzc2VuY2UgIT09IGIuaXNFc3NlbmNlKSByZXR1cm4gYi5pc0Vzc2VuY2UgPyAxIDogLTFcclxuICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShiLmxhc3RSZXBseUF0IHx8IGIuY3JlYXRlZEF0KS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShhLmxhc3RSZXBseUF0IHx8IGEuY3JlYXRlZEF0KS5nZXRUaW1lKClcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHBhZ2luYXRlKGZpbHRlcmVkUG9zdHMsIHBhZ2UsIHBhZ2VTaXplKSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTVFMTZcdTVCNTBcdThCRTZcdTYwQzVcclxuICAgKiBHRVQgL2FwaS9mb3J1bS9wb3N0cy86aWRcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6IC9cXC9hcGlcXC9mb3J1bVxcL3Bvc3RzXFwvKFxcdyspJC8sXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6IChjb25maWc6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBjb25maWcudXJsIGFzIHN0cmluZzsgY29uc3QgbWF0Y2ggPSB1cmwubWF0Y2goL1xcL2FwaVxcL2ZvcnVtXFwvcG9zdHNcXC8oXFx3KykkLyk7IGNvbnN0IGlkID0gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnXHJcbiAgICAgIGNvbnN0IHBvc3QgPSBmb3J1bVBvc3RzLmZpbmQocCA9PiBwLmlkID09PSBpZClcclxuICAgICAgaWYgKCFwb3N0KSB7XHJcbiAgICAgICAgcmV0dXJuIHsgY29kZTogNDA0LCBtZXNzYWdlOiAnXHU1RTE2XHU1QjUwXHU0RTBEXHU1QjU4XHU1NzI4JywgZGF0YTogbnVsbCwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBcdTZBMjFcdTYyREZcdTZENEZcdTg5QzhcdTkxQ0ZcdTU4OUVcdTUyQTBcclxuICAgICAgcG9zdC52aWV3Q291bnQrK1xyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHBvc3QpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU1M0QxXHU1RTAzXHU1RTE2XHU1QjUwXHJcbiAgICogUE9TVCAvYXBpL2ZvcnVtL3Bvc3RzXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9mb3J1bS9wb3N0cycsXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH06IHsgYm9keTogYW55IH0pID0+IHtcclxuICAgICAgY29uc3QgYm9hcmQgPSBmb3J1bUJvYXJkcy5maW5kKGIgPT4gYi5pZCA9PT0gYm9keS5ib2FyZElkKVxyXG4gICAgICBjb25zdCBuZXdQb3N0OiBGb3J1bVBvc3QgPSB7XHJcbiAgICAgICAgaWQ6IGBwb3N0JHtTdHJpbmcoZm9ydW1Qb3N0cy5sZW5ndGggKyAxKS5wYWRTdGFydCgzLCAnMCcpfWAsXHJcbiAgICAgICAgYXV0aG9ySWQ6ICd1c2VyMDAxJyxcclxuICAgICAgICBhdXRob3JOYW1lOiBjdXJyZW50VXNlci5uaWNrbmFtZSxcclxuICAgICAgICBhdXRob3JBdmF0YXI6IGN1cnJlbnRVc2VyLmF2YXRhcixcclxuICAgICAgICBib2FyZElkOiBib2R5LmJvYXJkSWQsXHJcbiAgICAgICAgYm9hcmROYW1lOiBib2FyZD8ubmFtZSB8fCAnJyxcclxuICAgICAgICB0aXRsZTogYm9keS50aXRsZSxcclxuICAgICAgICBjb250ZW50OiBib2R5LmNvbnRlbnQsXHJcbiAgICAgICAgaW1hZ2VzOiBib2R5LmltYWdlcyB8fCBbXSxcclxuICAgICAgICB2aWV3Q291bnQ6IDAsXHJcbiAgICAgICAgbGlrZUNvdW50OiAwLFxyXG4gICAgICAgIGNvbW1lbnRDb3VudDogMCxcclxuICAgICAgICBpc1RvcDogZmFsc2UsXHJcbiAgICAgICAgaXNFc3NlbmNlOiBmYWxzZSxcclxuICAgICAgICBzdGF0dXM6ICdwdWJsaXNoZWQnLFxyXG4gICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgICAgIH1cclxuICAgICAgZm9ydW1Qb3N0cy51bnNoaWZ0KG5ld1Bvc3QpXHJcblxyXG4gICAgICAvLyBcdTY2RjRcdTY1QjBcdTY3N0ZcdTU3NTdcdTVFMTZcdTVCNTBcdTY1NzBcclxuICAgICAgaWYgKGJvYXJkKSB7XHJcbiAgICAgICAgYm9hcmQucG9zdENvdW50KytcclxuICAgICAgICBib2FyZC50b2RheVBvc3RDb3VudCsrXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UobmV3UG9zdClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTcwQjlcdThENUVcdTVFMTZcdTVCNTBcclxuICAgKiBQT1NUIC9hcGkvZm9ydW0vcG9zdHMvOmlkL2xpa2VcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6IC9cXC9hcGlcXC9mb3J1bVxcL3Bvc3RzXFwvKFxcdyspXFwvbGlrZSQvLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKGNvbmZpZzogYW55KSA9PiB7XHJcbiAgICAgIGNvbnN0IHVybCA9IGNvbmZpZy51cmwgYXMgc3RyaW5nOyBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvYXBpXFwvZm9ydW1cXC9wb3N0c1xcLyhcXHcrKVxcL2xpa2UkLyk7IGNvbnN0IGlkID0gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnXHJcbiAgICAgIGNvbnN0IHBvc3QgPSBmb3J1bVBvc3RzLmZpbmQocCA9PiBwLmlkID09PSBpZClcclxuICAgICAgaWYgKCFwb3N0KSB7XHJcbiAgICAgICAgcmV0dXJuIHsgY29kZTogNDA0LCBtZXNzYWdlOiAnXHU1RTE2XHU1QjUwXHU0RTBEXHU1QjU4XHU1NzI4JywgZGF0YTogbnVsbCwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH1cclxuICAgICAgfVxyXG4gICAgICBwb3N0Lmxpa2VDb3VudCsrXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoeyBsaWtlZDogdHJ1ZSwgbGlrZUNvdW50OiBwb3N0Lmxpa2VDb3VudCB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFx1NzkzRVx1NTMzQVx1NkQzQlx1NTJBOFx1NzZGOFx1NTE3M1x1NjNBNVx1NTNFMyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTZEM0JcdTUyQThcdTUyMTdcdTg4NjhcclxuICAgKiBHRVQgL2FwaS9hY3Rpdml0aWVzP3BhZ2U9MSZwYWdlU2l6ZT0xMCZjYXRlZ29yeT0mc3RhdHVzPVxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvYWN0aXZpdGllcycsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICh7IHF1ZXJ5IH06IHsgcXVlcnk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSkgPT4ge1xyXG4gICAgICBjb25zdCBwYWdlID0gcGFyc2VJbnQocXVlcnkucGFnZSB8fCAnMScpXHJcbiAgICAgIGNvbnN0IHBhZ2VTaXplID0gcGFyc2VJbnQocXVlcnkucGFnZVNpemUgfHwgJzEwJylcclxuICAgICAgY29uc3QgY2F0ZWdvcnkgPSBxdWVyeS5jYXRlZ29yeVxyXG4gICAgICBjb25zdCBzdGF0dXMgPSBxdWVyeS5zdGF0dXNcclxuXHJcbiAgICAgIGxldCBmaWx0ZXJlZEFjdGl2aXRpZXMgPSBbLi4uYWN0aXZpdGllc11cclxuXHJcbiAgICAgIC8vIFx1NTIwNlx1N0M3Qlx1N0I1Qlx1OTAwOVxyXG4gICAgICBpZiAoY2F0ZWdvcnkgJiYgY2F0ZWdvcnkgIT09ICdhbGwnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRBY3Rpdml0aWVzID0gZmlsdGVyZWRBY3Rpdml0aWVzLmZpbHRlcihhID0+IGEuY2F0ZWdvcnkgPT09IGNhdGVnb3J5KVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBcdTcyQjZcdTYwMDFcdTdCNUJcdTkwMDlcclxuICAgICAgaWYgKHN0YXR1cyAmJiBzdGF0dXMgIT09ICdhbGwnKSB7XHJcbiAgICAgICAgZmlsdGVyZWRBY3Rpdml0aWVzID0gZmlsdGVyZWRBY3Rpdml0aWVzLmZpbHRlcihhID0+IGEuc3RhdHVzID09PSBzdGF0dXMpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFx1NjMwOVx1NUYwMFx1NTlDQlx1NjVGNlx1OTVGNFx1NjM5Mlx1NUU4Rlx1RkYwOFx1NjcwMFx1OEZEMVx1NzY4NFx1NTcyOFx1NTI0RFx1RkYwOVxyXG4gICAgICBmaWx0ZXJlZEFjdGl2aXRpZXMuc29ydCgoYSwgYikgPT5cclxuICAgICAgICBuZXcgRGF0ZShhLnN0YXJ0VGltZSkuZ2V0VGltZSgpIC0gbmV3IERhdGUoYi5zdGFydFRpbWUpLmdldFRpbWUoKVxyXG4gICAgICApXHJcblxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHBhZ2luYXRlKGZpbHRlcmVkQWN0aXZpdGllcywgcGFnZSwgcGFnZVNpemUpKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1ODNCN1x1NTNENlx1NkQzQlx1NTJBOFx1OEJFNlx1NjBDNVxyXG4gICAqIEdFVCAvYXBpL2FjdGl2aXRpZXMvOmlkXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAvXFwvYXBpXFwvYWN0aXZpdGllc1xcLyhcXHcrKSQvLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoY29uZmlnOiBhbnkpID0+IHtcclxuICAgICAgY29uc3QgdXJsID0gY29uZmlnLnVybCBhcyBzdHJpbmc7IGNvbnN0IG1hdGNoID0gdXJsLm1hdGNoKC9cXC9hcGlcXC9hY3Rpdml0aWVzXFwvKFxcdyspJC8pOyBjb25zdCBpZCA9IG1hdGNoID8gbWF0Y2hbMV0gOiAnJ1xyXG4gICAgICBjb25zdCBhY3Rpdml0eSA9IGFjdGl2aXRpZXMuZmluZChhID0+IGEuaWQgPT09IGlkKVxyXG4gICAgICBpZiAoIWFjdGl2aXR5KSB7XHJcbiAgICAgICAgcmV0dXJuIHsgY29kZTogNDA0LCBtZXNzYWdlOiAnXHU2RDNCXHU1MkE4XHU0RTBEXHU1QjU4XHU1NzI4JywgZGF0YTogbnVsbCwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKGFjdGl2aXR5KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NjJBNVx1NTQwRFx1NTNDMlx1NTJBMFx1NkQzQlx1NTJBOFxyXG4gICAqIFBPU1QgL2FwaS9hY3Rpdml0aWVzLzppZC9yZWdpc3RlclxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogL1xcL2FwaVxcL2FjdGl2aXRpZXNcXC8oXFx3KylcXC9yZWdpc3RlciQvLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKGNvbmZpZzogYW55KSA9PiB7XHJcbiAgICAgIGNvbnN0IHVybCA9IGNvbmZpZy51cmwgYXMgc3RyaW5nOyBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvYXBpXFwvYWN0aXZpdGllc1xcLyhcXHcrKVxcL3JlZ2lzdGVyJC8pOyBjb25zdCBpZCA9IG1hdGNoID8gbWF0Y2hbMV0gOiAnJ1xyXG4gICAgICBjb25zdCBhY3Rpdml0eSA9IGFjdGl2aXRpZXMuZmluZChhID0+IGEuaWQgPT09IGlkKVxyXG4gICAgICBpZiAoIWFjdGl2aXR5KSB7XHJcbiAgICAgICAgcmV0dXJuIHsgY29kZTogNDA0LCBtZXNzYWdlOiAnXHU2RDNCXHU1MkE4XHU0RTBEXHU1QjU4XHU1NzI4JywgZGF0YTogbnVsbCwgdGltZXN0YW1wOiBEYXRlLm5vdygpIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoYWN0aXZpdHkuY3VycmVudFBhcnRpY2lwYW50cyA+PSBhY3Rpdml0eS5tYXhQYXJ0aWNpcGFudHMpIHtcclxuICAgICAgICByZXR1cm4geyBjb2RlOiA0MDAsIG1lc3NhZ2U6ICdcdTU0MERcdTk4OURcdTVERjJcdTZFRTEnLCBkYXRhOiBudWxsLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfVxyXG4gICAgICB9XHJcbiAgICAgIGFjdGl2aXR5LmN1cnJlbnRQYXJ0aWNpcGFudHMrK1xyXG5cclxuICAgICAgLy8gXHU2QTIxXHU2MkRGXHU2REZCXHU1MkEwXHU2MkE1XHU1NDBEXHU4MDA1XHJcbiAgICAgIGlmICghYWN0aXZpdHkucmVnaXN0cmFudHMpIHtcclxuICAgICAgICBhY3Rpdml0eS5yZWdpc3RyYW50cyA9IFtdXHJcbiAgICAgIH1cclxuICAgICAgYWN0aXZpdHkucmVnaXN0cmFudHMucHVzaCh7XHJcbiAgICAgICAgdXNlcklkOiAndXNlcjAwMScsXHJcbiAgICAgICAgdXNlck5hbWU6IGN1cnJlbnRVc2VyLm5pY2tuYW1lLFxyXG4gICAgICAgIHVzZXJBdmF0YXI6IGN1cnJlbnRVc2VyLmF2YXRhcixcclxuICAgICAgICByZWdpc3RlcmVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZSh7IG1lc3NhZ2U6ICdcdTYyQTVcdTU0MERcdTYyMTBcdTUyOUYnLCByZW1haW5pbmc6IGFjdGl2aXR5Lm1heFBhcnRpY2lwYW50cyAtIGFjdGl2aXR5LmN1cnJlbnRQYXJ0aWNpcGFudHMgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTZEM0JcdTUyQThcdTUyMDZcdTdDN0JcdTdFREZcdThCQTFcclxuICAgKiBHRVQgL2FwaS9hY3Rpdml0aWVzL2NhdGVnb3JpZXNcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2FjdGl2aXRpZXMvY2F0ZWdvcmllcycsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcclxuICAgICAgY29uc3QgY2F0ZWdvcmllcyA9IFtcclxuICAgICAgICB7IGtleTogJ3Nwb3J0cycsIGxhYmVsOiAnXHU0RjUzXHU4MEIyXHU4RkQwXHU1MkE4JywgY291bnQ6IGFjdGl2aXRpZXMuZmlsdGVyKGEgPT4gYS5jYXRlZ29yeSA9PT0gJ3Nwb3J0cycpLmxlbmd0aCB9LFxyXG4gICAgICAgIHsga2V5OiAnZW50ZXJ0YWlubWVudCcsIGxhYmVsOiAnXHU2NTg3XHU1QTMxXHU2RDNCXHU1MkE4JywgY291bnQ6IGFjdGl2aXRpZXMuZmlsdGVyKGEgPT4gYS5jYXRlZ29yeSA9PT0gJ2VudGVydGFpbm1lbnQnKS5sZW5ndGggfSxcclxuICAgICAgICB7IGtleTogJ2FjYWRlbWljJywgbGFiZWw6ICdcdTVCNjZcdTY3MkZcdThCQjJcdTVFQTcnLCBjb3VudDogYWN0aXZpdGllcy5maWx0ZXIoYSA9PiBhLmNhdGVnb3J5ID09PSAnYWNhZGVtaWMnKS5sZW5ndGggfSxcclxuICAgICAgICB7IGtleTogJ3ZvbHVudGVlcicsIGxhYmVsOiAnXHU1RkQ3XHU2MTNGXHU2NzBEXHU1MkExJywgY291bnQ6IGFjdGl2aXRpZXMuZmlsdGVyKGEgPT4gYS5jYXRlZ29yeSA9PT0gJ3ZvbHVudGVlcicpLmxlbmd0aCB9LFxyXG4gICAgICAgIHsga2V5OiAnY3VsdHVyZScsIGxhYmVsOiAnXHU2NTg3XHU1MzE2XHU2RDNCXHU1MkE4JywgY291bnQ6IGFjdGl2aXRpZXMuZmlsdGVyKGEgPT4gYS5jYXRlZ29yeSA9PT0gJ2N1bHR1cmUnKS5sZW5ndGggfSxcclxuICAgICAgICB7IGtleTogJ2NhcmVlcicsIGxhYmVsOiAnXHU4MDRDXHU0RTFBXHU1M0QxXHU1QzU1JywgY291bnQ6IGFjdGl2aXRpZXMuZmlsdGVyKGEgPT4gYS5jYXRlZ29yeSA9PT0gJ2NhcmVlcicpLmxlbmd0aCB9XHJcbiAgICAgIF1cclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZShjYXRlZ29yaWVzKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFx1OTk5Nlx1OTg3NVx1NjU3MFx1NjM2RVx1ODA1QVx1NTQwOFx1NjNBNVx1NTNFMyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTk5OTZcdTk4NzVcdTYyNDBcdTk3MDBcdTc2ODRcdTYyNDBcdTY3MDlcdTY1NzBcdTYzNkVcdUZGMDhcdTUxQ0ZcdTVDMTFcdThCRjdcdTZDNDJcdTZCMjFcdTY1NzBcdUZGMDlcclxuICAgKiBHRVQgL2FwaS9ob21lL2RhdGFcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2hvbWUvZGF0YScsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcclxuICAgICAgY29uc3QgaG9tZURhdGEgPSB7XHJcbiAgICAgICAgLy8gXHU4RjZFXHU2NEFEXHU1NkZFL0Jhbm5lclxyXG4gICAgICAgIGJhbm5lcnM6IFtcclxuICAgICAgICAgIHsgaWQ6IDEsIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MjMyNzUzMzU2ODQtMzc4OThiNmJhZjMwP3c9MTIwMCZoPTQwMCZmaXQ9Y3JvcCcsIHRpdGxlOiAnXHU1RjAwXHU1QjY2XHU1QjYzXHU3Mjc5XHU2MEUwIFx1NkVFMTEwMFx1NTFDRjIwJywgbGluazogJy9wcm9kdWN0cz9wcm9tb3Rpb249c3ByaW5nJyB9LFxyXG4gICAgICAgICAgeyBpZDogMiwgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1MjY2NDczMC1kMzA3Y2E4ODQ5Nzg/dz0xMjAwJmg9NDAwJmZpdD1jcm9wJywgdGl0bGU6ICdcdTY2MjVcdTVCNjNcdThGRDBcdTUyQThcdTRGMUFcdTYyQTVcdTU0MERcdTRFMkQnLCBsaW5rOiAnL2FjdGl2aXRpZXMvYWN0MScgfSxcclxuICAgICAgICAgIHsgaWQ6IDMsIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTYxODExMzMyMDYtODBjZTliODhhODUzP3c9MTIwMCZoPTQwMCZmaXQ9Y3JvcCcsIHRpdGxlOiAnXHU2NTcwXHU3ODAxXHU0RUE3XHU1NEMxXHU5NjUwXHU2NUY2XHU2Mjk4XHU2MjYzJywgbGluazogJy9wcm9kdWN0cz9jYXRlZ29yeT1jYXQxJyB9XHJcbiAgICAgICAgXSxcclxuXHJcbiAgICAgICAgLy8gXHU3MEVEXHU5NUU4XHU1NTQ2XHU1NEMxXHJcbiAgICAgICAgaG90UHJvZHVjdHM6IHByb2R1Y3RzLnNsaWNlKDAsIDgpLFxyXG5cclxuICAgICAgICAvLyBcdTYzQThcdTgzNTBcdTU1NDZcdTVCQjZcclxuICAgICAgICByZWNvbW1lbmRNZXJjaGFudHM6IG1lcmNoYW50cy5zbGljZSgwLCA0KSxcclxuXHJcbiAgICAgICAgLy8gXHU2NzAwXHU2NUIwXHU1RTE2XHU1QjUwXHJcbiAgICAgICAgbGF0ZXN0UG9zdHM6IGZvcnVtUG9zdHMuc2xpY2UoMCwgNSksXHJcblxyXG4gICAgICAgIC8vIFx1NTM3M1x1NUMwNlx1NUYwMFx1NTlDQlx1NzY4NFx1NkQzQlx1NTJBOFxyXG4gICAgICAgIHVwY29taW5nQWN0aXZpdGllczogYWN0aXZpdGllc1xyXG4gICAgICAgICAgLmZpbHRlcihhID0+IGEuc3RhdHVzID09PSAndXBjb21pbmcnKVxyXG4gICAgICAgICAgLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGEuc3RhcnRUaW1lKS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShiLnN0YXJ0VGltZSkuZ2V0VGltZSgpKVxyXG4gICAgICAgICAgLnNsaWNlKDAsIDMpLFxyXG5cclxuICAgICAgICAvLyBcdTY3MDBcdTY1QjBcdTRFOENcdTYyNEJcclxuICAgICAgICBsYXRlc3RTZWNvbmRIYW5kOiBzZWNvbmRIYW5kSXRlbXMuc2xpY2UoMCwgNilcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKGhvbWVEYXRhKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NjQxQ1x1N0QyMlx1NjNBNVx1NTNFM1x1RkYwOFx1NTE2OFx1NUM0MFx1NjQxQ1x1N0QyMlx1RkYwOVxyXG4gICAqIEdFVCAvYXBpL3NlYXJjaD9rZXl3b3JkPSZ0eXBlPSZwYWdlPTEmcGFnZVNpemU9MTBcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL3NlYXJjaCcsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICh7IHF1ZXJ5IH06IHsgcXVlcnk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSkgPT4ge1xyXG4gICAgICBjb25zdCBrZXl3b3JkID0gcXVlcnkua2V5d29yZD8udG9Mb3dlckNhc2UoKVxyXG4gICAgICBjb25zdCB0eXBlID0gcXVlcnkudHlwZVxyXG4gICAgICBjb25zdCBwYWdlID0gcGFyc2VJbnQocXVlcnkucGFnZSB8fCAnMScpXHJcbiAgICAgIGNvbnN0IHBhZ2VTaXplID0gcGFyc2VJbnQocXVlcnkucGFnZVNpemUgfHwgJzEwJylcclxuXHJcbiAgICAgIGlmICgha2V5d29yZCkge1xyXG4gICAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoeyByZXN1bHRzOiBbXSwgdG90YWw6IDAgfSlcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcmVzdWx0czogYW55W10gPSBbXVxyXG5cclxuICAgICAgLy8gXHU2NDFDXHU3RDIyXHU1NTQ2XHU1NEMxXHJcbiAgICAgIGlmICghdHlwZSB8fCB0eXBlID09PSAncHJvZHVjdCcpIHtcclxuICAgICAgICBjb25zdCBtYXRjaGVkUHJvZHVjdHMgPSBwcm9kdWN0cy5maWx0ZXIocCA9PlxyXG4gICAgICAgICAgcC5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkgfHxcclxuICAgICAgICAgIHAuZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSB8fFxyXG4gICAgICAgICAgcC50YWdzLnNvbWUodCA9PiB0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZCkpXHJcbiAgICAgICAgKS5tYXAocCA9PiAoeyB0eXBlOiAncHJvZHVjdCcsIC4uLnAgfSkpXHJcbiAgICAgICAgcmVzdWx0cy5wdXNoKC4uLm1hdGNoZWRQcm9kdWN0cylcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gXHU2NDFDXHU3RDIyXHU0RThDXHU2MjRCXHJcbiAgICAgIGlmICghdHlwZSB8fCB0eXBlID09PSAnc2Vjb25kaGFuZCcpIHtcclxuICAgICAgICBjb25zdCBtYXRjaGVkU2Vjb25kSGFuZCA9IHNlY29uZEhhbmRJdGVtcy5maWx0ZXIoaXRlbSA9PlxyXG4gICAgICAgICAgaXRlbS50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8XHJcbiAgICAgICAgICBpdGVtLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoa2V5d29yZClcclxuICAgICAgICApLm1hcChpdGVtID0+ICh7IHR5cGU6ICdzZWNvbmRoYW5kJywgLi4uaXRlbSB9KSlcclxuICAgICAgICByZXN1bHRzLnB1c2goLi4ubWF0Y2hlZFNlY29uZEhhbmQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFx1NjQxQ1x1N0QyMlx1NUUxNlx1NUI1MFxyXG4gICAgICBpZiAoIXR5cGUgfHwgdHlwZSA9PT0gJ3Bvc3QnKSB7XHJcbiAgICAgICAgY29uc3QgbWF0Y2hlZFBvc3RzID0gZm9ydW1Qb3N0cy5maWx0ZXIocCA9PlxyXG4gICAgICAgICAgcC50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8XHJcbiAgICAgICAgICBwLmNvbnRlbnQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKVxyXG4gICAgICAgICkubWFwKHAgPT4gKHsgdHlwZTogJ3Bvc3QnLCAuLi5wIH0pKVxyXG4gICAgICAgIHJlc3VsdHMucHVzaCguLi5tYXRjaGVkUG9zdHMpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFx1NjQxQ1x1N0QyMlx1NTU0Nlx1NUJCNlxyXG4gICAgICBpZiAoIXR5cGUgfHwgdHlwZSA9PT0gJ21lcmNoYW50Jykge1xyXG4gICAgICAgIGNvbnN0IG1hdGNoZWRNZXJjaGFudHMgPSBtZXJjaGFudHMuZmlsdGVyKG0gPT5cclxuICAgICAgICAgIG0ubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGtleXdvcmQpIHx8XHJcbiAgICAgICAgICBtLnRhZ3Muc29tZSh0ID0+IHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhrZXl3b3JkKSlcclxuICAgICAgICApLm1hcChtID0+ICh7IHR5cGU6ICdtZXJjaGFudCcsIC4uLm0gfSkpXHJcbiAgICAgICAgcmVzdWx0cy5wdXNoKC4uLm1hdGNoZWRNZXJjaGFudHMpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHRvdGFsID0gcmVzdWx0cy5sZW5ndGhcclxuICAgICAgY29uc3QgcGFnaW5hdGVkUmVzdWx0cyA9IHJlc3VsdHMuc2xpY2UoKHBhZ2UgLSAxKSAqIHBhZ2VTaXplLCBwYWdlICogcGFnZVNpemUpXHJcblxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICBsaXN0OiBwYWdpbmF0ZWRSZXN1bHRzLFxyXG4gICAgICAgIHRvdGFsLFxyXG4gICAgICAgIHBhZ2UsXHJcbiAgICAgICAgcGFnZVNpemVcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTc1MjhcdTYyMzdcdTc2N0JcdTVGNTVcclxuICAgKiBQT1NUIC9hcGkvYXV0aC9sb2dpblxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvYXV0aC9sb2dpbicsXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH06IHsgYm9keTogYW55IH0pID0+IHtcclxuICAgICAgLy8gXHU2NTJGXHU2MzAxXHU1OTFBXHU3OUNEXHU3NjdCXHU1RjU1XHU1QjU3XHU2QkI1OiBhY2NvdW50KFx1OEQyNlx1NTNGNyksIHN0dWRlbnRJZChcdTVCNjZcdTUzRjcpLCB1c2VybmFtZShcdTc1MjhcdTYyMzdcdTU0MEQpXHJcbiAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSBib2R5LmFjY291bnQgfHwgYm9keS5zdHVkZW50SWQgfHwgYm9keS51c2VybmFtZSB8fCAnJ1xyXG4gICAgICBjb25zdCBwYXNzd29yZCA9IGJvZHkucGFzc3dvcmQgfHwgJydcclxuXHJcbiAgICAgIC8vIFx1NkEyMVx1NjJERlx1NzY3Qlx1NUY1NVx1OUE4Q1x1OEJDMSAtIFx1N0JBMVx1NzQwNlx1NTQ1OFx1OEQyNlx1NTNGN1xyXG4gICAgICBpZiAoKGlkZW50aWZpZXIgPT09ICdhZG1pbicgfHwgaWRlbnRpZmllciA9PT0gJ2FkbWluQHVzdGguZWR1LmNuJykgJiYgcGFzc3dvcmQgPT09ICdhZG1pbjEyMycpIHtcclxuICAgICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICAgIHRva2VuOiAnbW9jay1hZG1pbi10b2tlbi0nICsgRGF0ZS5ub3coKSxcclxuICAgICAgICAgIHVzZXI6IHsgLi4uY3VycmVudFVzZXIsIHJvbGU6ICdhZG1pbicsIG5pY2tuYW1lOiAnXHU3QkExXHU3NDA2XHU1NDU4JyB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gXHU2QTIxXHU2MkRGXHU1QjY2XHU1M0Y3XHU3NjdCXHU1RjU1XHJcbiAgICAgIGlmIChib2R5LnN0dWRlbnRJZCAmJiAvXlxcZHsxMCwxNX0kLy50ZXN0KGJvZHkuc3R1ZGVudElkKSkge1xyXG4gICAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2Uoe1xyXG4gICAgICAgICAgdG9rZW46ICdtb2NrLXN0dWRlbnQtdG9rZW4tJyArIERhdGUubm93KCksXHJcbiAgICAgICAgICB1c2VyOiB7XHJcbiAgICAgICAgICAgIC4uLmN1cnJlbnRVc2VyLFxyXG4gICAgICAgICAgICBzdHVkZW50SWQ6IGJvZHkuc3R1ZGVudElkLFxyXG4gICAgICAgICAgICBuaWNrbmFtZTogJ1x1NUI2Nlx1NzUxRicgKyBib2R5LnN0dWRlbnRJZC5zbGljZSgtNClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBcdTlFRDhcdThCQTRcdThGRDRcdTU2REVcdTY2NkVcdTkwMUFcdTc1MjhcdTYyMzdcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZSh7XHJcbiAgICAgICAgdG9rZW46ICdtb2NrLXVzZXItdG9rZW4tJyArIERhdGUubm93KCksXHJcbiAgICAgICAgdXNlcjogY3VycmVudFVzZXJcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTc1MjhcdTYyMzdcdTZDRThcdTUxOENcclxuICAgKiBQT1NUIC9hcGkvYXV0aC9yZWdpc3RlclxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvYXV0aC9yZWdpc3RlcicsXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBib2R5IH06IHsgYm9keTogYW55IH0pID0+IHtcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZSh7XHJcbiAgICAgICAgbWVzc2FnZTogJ1x1NkNFOFx1NTE4Q1x1NjIxMFx1NTI5RicsXHJcbiAgICAgICAgdXNlcjoge1xyXG4gICAgICAgICAgaWQ6ICd1c2VyJyArIERhdGUubm93KCksXHJcbiAgICAgICAgICB1c2VybmFtZTogYm9keS51c2VybmFtZSxcclxuICAgICAgICAgIG5pY2tuYW1lOiBib2R5Lm5pY2tuYW1lIHx8IGJvZHkudXNlcm5hbWUsXHJcbiAgICAgICAgICBhdmF0YXI6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUzNTcxMzg3NTAwMi1kMWQwY2YzNzdmZGU/dz0yMDAmaD0yMDAmZml0PWNyb3AnLFxyXG4gICAgICAgICAgcm9sZTogJ3VzZXInLFxyXG4gICAgICAgICAgc3RhdHVzOiAnYWN0aXZlJyxcclxuICAgICAgICAgIGJhbGFuY2U6IDAsXHJcbiAgICAgICAgICBwb2ludHM6IDAsXHJcbiAgICAgICAgICBsZXZlbDogMSxcclxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1ODNCN1x1NTNENlx1OTAxQVx1NzdFNVx1NkQ4OFx1NjA2Rlx1NTIxN1x1ODg2OFxyXG4gICAqIEdFVCAvYXBpL25vdGlmaWNhdGlvbnM/cGFnZT0xJnBhZ2VTaXplPTEwJnR5cGU9XHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9ub3RpZmljYXRpb25zJyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKHsgcXVlcnkgfTogeyBxdWVyeTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9KSA9PiB7XHJcbiAgICAgIGNvbnN0IHBhZ2UgPSBwYXJzZUludChxdWVyeS5wYWdlIHx8ICcxJylcclxuICAgICAgY29uc3QgcGFnZVNpemUgPSBwYXJzZUludChxdWVyeS5wYWdlU2l6ZSB8fCAnMTAnKVxyXG5cclxuICAgICAgY29uc3Qgbm90aWZpY2F0aW9ucyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ25vdGkxJyxcclxuICAgICAgICAgIHR5cGU6ICdvcmRlcicsXHJcbiAgICAgICAgICB0aXRsZTogJ1x1OEJBMlx1NTM1NVx1NURGMlx1NTNEMVx1OEQyNycsXHJcbiAgICAgICAgICBjb250ZW50OiAnXHU2MEE4XHU3Njg0XHU4QkEyXHU1MzU1IEhLMjAyNjA0MTMwMDEgXHU1REYyXHU1M0QxXHU4RDI3XHVGRjBDXHU5ODg0XHU4QkExNFx1NjcwODE1XHU2NUU1XHU5MDAxXHU4RkJFXHUzMDAyXHU3MjY5XHU2RDQxXHU1MzU1XHU1M0Y3XHVGRjFBU0YxMjM0NTY3ODkwXHVGRjBDXHU4QkY3XHU3NTU5XHU2MTBGXHU2N0U1XHU2NTM2XHUzMDAyJyxcclxuICAgICAgICAgIGlzUmVhZDogZmFsc2UsXHJcbiAgICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAxMCAqIDYwMDAwKS50b0lTT1N0cmluZygpLFxyXG4gICAgICAgICAgb3JkZXJJZDogJ29yZGVyMDAxJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdub3RpMicsXHJcbiAgICAgICAgICB0eXBlOiAncHJvbW8nLFxyXG4gICAgICAgICAgdGl0bGU6ICdcdTY1QjBcdTc1MjhcdTYyMzdcdTRFMTNcdTRFQUJcdTc5OEZcdTUyMjknLFxyXG4gICAgICAgICAgY29udGVudDogJ1x1NjA2RFx1NTU5Q1x1RkYwMVx1NjBBOFx1NzY4NFx1NjVCMFx1NEVCQVx1NEYxOFx1NjBFMFx1NTIzOFx1NURGMlx1NTIzMFx1OEQyNlx1RkYwQ1x1NkVFMTk5XHU1MUNGMjBcdTMwMDFcdTZFRTEyOTlcdTUxQ0Y1MFx1RkYwQ1x1NUZFQlx1NTNCQlx1NEY3Rlx1NzUyOFx1NTQyN35cdTRGMThcdTYwRTBcdTUyMzhcdTY3MDlcdTY1NDhcdTY3MUZcdTgxRjM0XHU2NzA4MzBcdTY1RTVcdTMwMDInLFxyXG4gICAgICAgICAgaXNSZWFkOiBmYWxzZSxcclxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDMwICogNjAwMDApLnRvSVNPU3RyaW5nKClcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnbm90aTMnLFxyXG4gICAgICAgICAgdHlwZTogJ3N5c3RlbScsXHJcbiAgICAgICAgICB0aXRsZTogJ1x1OEQyNlx1NjIzN1x1NUI4OVx1NTE2OFx1NjNEMFx1OTE5MicsXHJcbiAgICAgICAgICBjb250ZW50OiAnXHU2OEMwXHU2RDRCXHU1MjMwXHU2MEE4XHU3Njg0XHU4RDI2XHU1M0Y3XHU1NzI4XHU2NUIwXHU4QkJFXHU1OTA3XHU0RTBBXHU3NjdCXHU1RjU1XHVGRjBDXHU1OTgyXHU5NzVFXHU2NzJDXHU0RUJBXHU2NENEXHU0RjVDXHU4QkY3XHU1M0NBXHU2NUY2XHU0RkVFXHU2NTM5XHU1QkM2XHU3ODAxXHUzMDAyXHU3NjdCXHU1RjU1XHU2NUY2XHU5NUY0XHVGRjFBMjAyNi0wNC0xMyAxMDozMFx1RkYwQ0lQXHVGRjFBMTkyLjE2OC4xLjEnLFxyXG4gICAgICAgICAgaXNSZWFkOiBmYWxzZSxcclxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDIgKiAzNjAwMDAwKS50b0lTT1N0cmluZygpXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ25vdGk0JyxcclxuICAgICAgICAgIHR5cGU6ICdjb21tdW5pdHknLFxyXG4gICAgICAgICAgdGl0bGU6ICdcdTY3MDlcdTRFQkFcdTU2REVcdTU5MERcdTRFODZcdTRGNjBcdTc2ODRcdTVFMTZcdTVCNTAnLFxyXG4gICAgICAgICAgY29udGVudDogJ1x1NTcyOFx1MzAwQ1x1NTIwNlx1NEVBQlx1NEUwMFx1NEUyQVx1OEQ4NVx1NTk3RFx1NzUyOFx1NzY4NFx1NUI2Nlx1NEU2MEFQUFx1MzAwRFx1NEUwQlx1RkYwQ1x1NzUyOFx1NjIzN0BcdTRFRTNcdTc4MDFcdTRGQTAgXHU1NkRFXHU1OTBEXHU0RTg2XHU0RjYwXHU3Njg0XHU4QkM0XHU4QkJBXHVGRjFBXCJcdThDMjJcdThDMjJcdTUyMDZcdTRFQUJcdUZGMENcdTc4NkVcdTVCOUVcdTVGODhcdTU5N0RcdTc1MjhcdUZGMDFcIicsXHJcbiAgICAgICAgICBpc1JlYWQ6IHRydWUsXHJcbiAgICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNCAqIDM2MDAwMDApLnRvSVNPU3RyaW5nKCksXHJcbiAgICAgICAgICBwb3N0SWQ6ICdwb3N0MDAxJyxcclxuICAgICAgICAgIHNlbmRlcklkOiAndXNlcjAwMicsXHJcbiAgICAgICAgICBzZW5kZXJOYW1lOiAnXHU0RUUzXHU3ODAxXHU0RkEwJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdub3RpNScsXHJcbiAgICAgICAgICB0eXBlOiAnb3JkZXInLFxyXG4gICAgICAgICAgdGl0bGU6ICdcdThCQTJcdTUzNTVcdTVERjJcdTVCOENcdTYyMTAnLFxyXG4gICAgICAgICAgY29udGVudDogJ1x1NjBBOFx1NzY4NFx1OEJBMlx1NTM1NSBISzIwMjYwNDEwMDAzIFx1NURGMlx1NUI4Q1x1NjIxMFx1RkYwQ1x1NjExRlx1OEMyMlx1NjBBOFx1NzY4NFx1OEQyRFx1NEU3MFx1RkYwMVx1NkIyMlx1OEZDRVx1OEJDNFx1NEVGN1x1NTU0Nlx1NTRDMVx1RkYwQ1x1NTIwNlx1NEVBQlx1NjBBOFx1NzY4NFx1NEY3Rlx1NzUyOFx1NEY1M1x1OUE4Q1x1MzAwMicsXHJcbiAgICAgICAgICBpc1JlYWQ6IHRydWUsXHJcbiAgICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKERhdGUubm93KCkgLSAzICogMjQgKiAzNjAwMDAwKS50b0lTT1N0cmluZygpLFxyXG4gICAgICAgICAgb3JkZXJJZDogJ29yZGVyMDAzJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdub3RpNicsXHJcbiAgICAgICAgICB0eXBlOiAncHJvbW8nLFxyXG4gICAgICAgICAgdGl0bGU6ICdcdTk2NTBcdTY1RjZcdTc5RDJcdTY3NDBcdTZEM0JcdTUyQThcdTVGMDBcdTU5Q0InLFxyXG4gICAgICAgICAgY29udGVudDogJ1x1NjBBOFx1NTE3M1x1NkNFOFx1NzY4NFx1NTU0Nlx1NTRDMVx1MzAwQ1x1ODRERFx1NzI1OVx1ODAzM1x1NjczQVx1MzAwRFx1NkI2M1x1NTcyOFx1NTNDMlx1NEUwRVx1OTY1MFx1NjVGNlx1NzlEMlx1Njc0MFx1RkYwQ1x1NTM5Rlx1NEVGNzE5OVx1NTE0M1x1RkYwQ1x1NzlEMlx1Njc0MFx1NEVGN1x1NEVDNVx1OTcwMDk5XHU1MTQzXHVGRjBDXHU5NjUwXHU5MUNGMTAwXHU0RUY2XHVGRjAxJyxcclxuICAgICAgICAgIGlzUmVhZDogdHJ1ZSxcclxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDUgKiAyNCAqIDM2MDAwMDApLnRvSVNPU3RyaW5nKClcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnbm90aTcnLFxyXG4gICAgICAgICAgdHlwZTogJ3N5c3RlbScsXHJcbiAgICAgICAgICB0aXRsZTogJ1x1N0NGQlx1N0VERlx1N0VGNFx1NjJBNFx1OTAxQVx1NzdFNScsXHJcbiAgICAgICAgICBjb250ZW50OiAnXHU3Q0ZCXHU3RURGXHU1QzA2XHU0RThFXHU0RUNBXHU2NjVBXHU1MUNDXHU2NjY4MjowMC00OjAwXHU4RkRCXHU4ODRDXHU0RjhCXHU4ODRDXHU3RUY0XHU2MkE0XHVGRjBDXHU2NzFGXHU5NUY0XHU5MEU4XHU1MjA2XHU1MjlGXHU4MEZEXHU1M0VGXHU4MEZEXHU2NUUwXHU2Q0Q1XHU0RjdGXHU3NTI4XHVGRjBDXHU4QkY3XHU2M0QwXHU1MjREXHU1MDVBXHU1OTdEXHU1MUM2XHU1OTA3XHUzMDAyJyxcclxuICAgICAgICAgIGlzUmVhZDogdHJ1ZSxcclxuICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDcgKiAyNCAqIDM2MDAwMDApLnRvSVNPU3RyaW5nKClcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnbm90aTgnLFxyXG4gICAgICAgICAgdHlwZTogJ2NvbW11bml0eScsXHJcbiAgICAgICAgICB0aXRsZTogJ1x1NjBBOFx1NzY4NFx1NUUxNlx1NUI1MFx1ODhBQlx1NzBCOVx1OEQ1RScsXHJcbiAgICAgICAgICBjb250ZW50OiAnXHU3NTI4XHU2MjM3QFx1NUI2Nlx1OTczOFx1NUMwRlx1NzM4QiBcdTcwQjlcdThENUVcdTRFODZcdTYwQThcdTc2ODRcdTVFMTZcdTVCNTBcdTMwMENcdTY3MUZcdTY3MkJcdTU5MERcdTRFNjBcdThENDRcdTY1OTlcdTUyMDZcdTRFQUJcdTMwMERcdUZGMENcdTc2RUVcdTUyNERcdTVERjJcdTY3MDkxMjhcdTRFQkFcdTcwQjlcdThENUVcdTMwMDInLFxyXG4gICAgICAgICAgaXNSZWFkOiB0cnVlLFxyXG4gICAgICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMTAgKiAyNCAqIDM2MDAwMDApLnRvSVNPU3RyaW5nKCksXHJcbiAgICAgICAgICBwb3N0SWQ6ICdwb3N0MDAyJyxcclxuICAgICAgICAgIHNlbmRlcklkOiAndXNlcjAwMycsXHJcbiAgICAgICAgICBzZW5kZXJOYW1lOiAnXHU1QjY2XHU5NzM4XHU1QzBGXHU3MzhCJ1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG5cclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZShub3RpZmljYXRpb25zKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NjgwN1x1OEJCMFx1NkQ4OFx1NjA2Rlx1NURGMlx1OEJGQlxyXG4gICAqIFBPU1QgL2FwaS9ub3RpZmljYXRpb25zLzppZC9yZWFkXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAvXFwvYXBpXFwvbm90aWZpY2F0aW9uc1xcLyhcXHcrKVxcL3JlYWQkLyxcclxuICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgcmVzcG9uc2U6IChjb25maWc6IGFueSkgPT4ge1xyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHsgbWVzc2FnZTogJ1x1NURGMlx1NjgwN1x1OEJCMFx1NEUzQVx1NURGMlx1OEJGQicgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTY4MDdcdThCQjBcdTUxNjhcdTkwRThcdTVERjJcdThCRkJcclxuICAgKiBQT1NUIC9hcGkvbm90aWZpY2F0aW9ucy9yZWFkLWFsbFxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvbm90aWZpY2F0aW9ucy9yZWFkLWFsbCcsXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoeyBtZXNzYWdlOiAnXHU1REYyXHU1MTY4XHU5MEU4XHU2ODA3XHU4QkIwXHU0RTNBXHU1REYyXHU4QkZCJyB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1ODNCN1x1NTNENlx1NjcyQVx1OEJGQlx1NkQ4OFx1NjA2Rlx1NjU3MFx1OTFDRlxyXG4gICAqIEdFVCAvYXBpL25vdGlmaWNhdGlvbnMvdW5yZWFkLWNvdW50XHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9ub3RpZmljYXRpb25zL3VucmVhZC1jb3VudCcsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZSgzKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFx1NjUzNlx1ODVDRlx1NzZGOFx1NTE3M1x1NjNBNVx1NTNFMyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTY1MzZcdTg1Q0ZcdTUyMTdcdTg4NjhcclxuICAgKiBHRVQgL2FwaS9mYXZvcml0ZXM/dHlwZT0mcGFnZT0xXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9mYXZvcml0ZXMnLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoeyBxdWVyeSB9OiB7IHF1ZXJ5OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0pID0+IHtcclxuICAgICAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHF1ZXJ5LnBhZ2UgfHwgJzEnKVxyXG4gICAgICBjb25zdCBwYWdlU2l6ZSA9IDEwXHJcblxyXG4gICAgICAvLyBcdTZBMjFcdTYyREZcdTY1MzZcdTg1Q0ZcdTY1NzBcdTYzNkUgLSBcdTU3RkFcdTRFOEVcdTU1NDZcdTU0QzFcdTY1NzBcdTYzNkVcdTc1MUZcdTYyMTBcclxuICAgICAgY29uc3QgcHJvbW90aW9ucyA9IFsnXHU0RTcwMVx1OTAwMTFcdTRFRjZcdTc5M0MnLCAnXHU2RUUxMTAwXHU1MUNGMjAnLCAnXHU5NjUwXHU2NUY2XHU3Mjc5XHU2MEUwJywgJycsICcnLCAnJ11cclxuICAgICAgY29uc3Qgc2hvcE5hbWVzID0gWydcdTUzNEVcdTRFM0FcdTVCOThcdTY1QjlcdTY1RDdcdTgyMzBcdTVFOTcnLCAnXHU1QzBGXHU3QzczXHU0RTRCXHU1QkI2JywgJ1x1N0Y4RVx1NTk4Nlx1NEUxM1x1ODQyNVx1NUU5NycsICdcdThGRDBcdTUyQThcdTYyMzdcdTU5MTZcdTVFOTcnLCAnXHU1NkZFXHU0RTY2XHU2NTg3XHU1MTc3XHU1RTk3JywgJ1x1OThERlx1NTRDMVx1NzUxRlx1OUM5Q1x1NUU5NyddXHJcblxyXG4gICAgICBjb25zdCBmYXZvcml0ZXMgPSBwcm9kdWN0cy5zbGljZSgwLCA2KS5tYXAoKHByb2R1Y3QsIGluZGV4KSA9PiAoe1xyXG4gICAgICAgIGlkOiBgZmF2JHtTdHJpbmcoaW5kZXggKyAxKS5wYWRTdGFydCgzLCAnMCcpfWAsXHJcbiAgICAgICAgdHlwZTogJ3Byb2R1Y3QnLFxyXG4gICAgICAgIG5hbWU6IHByb2R1Y3QubmFtZSxcclxuICAgICAgICBpbWFnZTogcHJvZHVjdC5pbWFnZSxcclxuICAgICAgICBwcmljZTogcHJvZHVjdC5wcmljZSxcclxuICAgICAgICBvcmlnaW5hbFByaWNlOiBwcm9kdWN0Lm9yaWdpbmFsUHJpY2UsXHJcbiAgICAgICAgc29sZENvdW50OiBwcm9kdWN0LnNhbGVzLFxyXG4gICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIGluZGV4ICogODY0MDAwMDApLnRvSVNPU3RyaW5nKCksXHJcbiAgICAgICAgcHJvbW90aW9uOiBwcm9tb3Rpb25zW2luZGV4XSB8fCAnJyxcclxuICAgICAgICBzaG9wTmFtZTogc2hvcE5hbWVzW2luZGV4XSB8fCAnXHU1Qjk4XHU2NUI5XHU1RTk3XHU5NEZBJyxcclxuICAgICAgICBzaG9wSWQ6IGBzaG9wJHtpbmRleCArIDF9YCxcclxuICAgICAgICBzdGF0dXM6IGluZGV4ID09PSAyID8gJ2xvd19zdG9jaycgOiAoaW5kZXggPT09IDQgPyAnaW52YWxpZCcgOiAnbm9ybWFsJylcclxuICAgICAgfSkpXHJcblxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICBsaXN0OiBmYXZvcml0ZXMsXHJcbiAgICAgICAgdG90YWw6IGZhdm9yaXRlcy5sZW5ndGhcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTUyMjBcdTk2NjRcdTY1MzZcdTg1Q0ZcclxuICAgKiBERUxFVEUgL2FwaS9mYXZvcml0ZXMvOmlkXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAvXFwvYXBpXFwvZmF2b3JpdGVzXFwvKFxcdyspJC8sXHJcbiAgICBtZXRob2Q6ICdkZWxldGUnLFxyXG4gICAgcmVzcG9uc2U6IChjb25maWc6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBjb25maWcudXJsIGFzIHN0cmluZ1xyXG4gICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvYXBpXFwvZmF2b3JpdGVzXFwvKFxcdyspJC8pXHJcbiAgICAgIGNvbnN0IGlkID0gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnXHJcblxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHsgbWVzc2FnZTogJ1x1NTNENlx1NkQ4OFx1NjUzNlx1ODVDRlx1NjIxMFx1NTI5RicsIGlkIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU2REZCXHU1MkEwXHU2NTM2XHU4NUNGXHJcbiAgICogUE9TVCAvYXBpL2Zhdm9yaXRlc1xyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvZmF2b3JpdGVzJyxcclxuICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgcmVzcG9uc2U6ICh7IGJvZHkgfTogeyBib2R5OiBhbnkgfSkgPT4ge1xyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICBpZDogJ2ZhdicgKyBEYXRlLm5vdygpLFxyXG4gICAgICAgIHR5cGU6IGJvZHkudHlwZSB8fCAncHJvZHVjdCcsXHJcbiAgICAgICAgaXRlbUlkOiBib2R5Lml0ZW1JZCxcclxuICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICBtZXNzYWdlOiAnXHU2NTM2XHU4NUNGXHU2MjEwXHU1MjlGJ1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFx1OEQyRFx1NzI2OVx1OEY2Nlx1NzZGOFx1NTE3M1x1NjNBNVx1NTNFMyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdThEMkRcdTcyNjlcdThGNjZcdTUyMTdcdTg4NjhcclxuICAgKiBHRVQgL2FwaS9jYXJ0XHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9jYXJ0JyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKCkgPT4ge1xyXG4gICAgICBjb25zdCBjYXJ0SXRlbXMgPSBwcm9kdWN0cy5zbGljZSgwLCAzKS5tYXAoKHByb2R1Y3QsIGluZGV4KSA9PiAoe1xyXG4gICAgICAgIGlkOiBgY2FydCR7U3RyaW5nKGluZGV4ICsgMSkucGFkU3RhcnQoMywgJzAnKX1gLFxyXG4gICAgICAgIHByb2R1Y3RJZDogcHJvZHVjdC5pZCxcclxuICAgICAgICBuYW1lOiBwcm9kdWN0Lm5hbWUsXHJcbiAgICAgICAgaW1hZ2U6IHByb2R1Y3QuaW1hZ2UsXHJcbiAgICAgICAgcHJpY2U6IHByb2R1Y3QucHJpY2UsXHJcbiAgICAgICAgb3JpZ2luYWxQcmljZTogcHJvZHVjdC5vcmlnaW5hbFByaWNlLFxyXG4gICAgICAgIHF1YW50aXR5OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAzKSArIDEsXHJcbiAgICAgICAgc2VsZWN0ZWQ6IGluZGV4IDwgMixcclxuICAgICAgICBzdG9jazogcHJvZHVjdC5zdG9jayxcclxuICAgICAgICBzdGF0dXM6ICd2YWxpZCdcclxuICAgICAgfSkpXHJcblxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICBpdGVtczogY2FydEl0ZW1zLFxyXG4gICAgICAgIHRvdGFsQW1vdW50OiBjYXJ0SXRlbXMucmVkdWNlKChzdW0sIGl0ZW0pID0+IHN1bSArIGl0ZW0ucHJpY2UgKiBpdGVtLnF1YW50aXR5LCAwKSxcclxuICAgICAgICB0b3RhbENvdW50OiBjYXJ0SXRlbXMucmVkdWNlKChzdW0sIGl0ZW0pID0+IHN1bSArIGl0ZW0ucXVhbnRpdHksIDApLFxyXG4gICAgICAgIHNlbGVjdGVkQ291bnQ6IGNhcnRJdGVtcy5maWx0ZXIoaSA9PiBpLnNlbGVjdGVkKS5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gc3VtICsgaXRlbS5xdWFudGl0eSwgMCksXHJcbiAgICAgICAgc2VsZWN0ZWRBbW91bnQ6IGNhcnRJdGVtcy5maWx0ZXIoaSA9PiBpLnNlbGVjdGVkKS5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gc3VtICsgaXRlbS5wcmljZSAqIGl0ZW0ucXVhbnRpdHksIDApXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU2REZCXHU1MkEwXHU1NTQ2XHU1NEMxXHU1MjMwXHU4RDJEXHU3MjY5XHU4RjY2XHJcbiAgICogUE9TVCAvYXBpL2NhcnRcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL2NhcnQnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKHsgYm9keSB9OiB7IGJvZHk6IGFueSB9KSA9PiB7XHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2Uoe1xyXG4gICAgICAgIGlkOiAnY2FydCcgKyBEYXRlLm5vdygpLFxyXG4gICAgICAgIHByb2R1Y3RJZDogYm9keS5wcm9kdWN0SWQsXHJcbiAgICAgICAgcXVhbnRpdHk6IGJvZHkucXVhbnRpdHkgfHwgMSxcclxuICAgICAgICBzZWxlY3RlZDogdHJ1ZSxcclxuICAgICAgICBtZXNzYWdlOiAnXHU2REZCXHU1MkEwXHU2MjEwXHU1MjlGJ1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NjZGNFx1NjVCMFx1OEQyRFx1NzI2OVx1OEY2Nlx1NTU0Nlx1NTRDMVxyXG4gICAqIFBVVCAvYXBpL2NhcnQvOml0ZW1JZFxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogL1xcL2FwaVxcL2NhcnRcXC8oXFx3KykkLyxcclxuICAgIG1ldGhvZDogJ3B1dCcsXHJcbiAgICByZXNwb25zZTogKGNvbmZpZzogYW55LCB7IGJvZHkgfTogeyBib2R5OiBhbnkgfSkgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBjb25maWcudXJsIGFzIHN0cmluZ1xyXG4gICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvYXBpXFwvY2FydFxcLyhcXHcrKSQvKVxyXG4gICAgICBjb25zdCBpdGVtSWQgPSBtYXRjaCA/IG1hdGNoWzFdIDogJydcclxuXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2Uoe1xyXG4gICAgICAgIGlkOiBpdGVtSWQsXHJcbiAgICAgICAgcXVhbnRpdHk6IGJvZHkucXVhbnRpdHksXHJcbiAgICAgICAgc2VsZWN0ZWQ6IGJvZHkuc2VsZWN0ZWQsXHJcbiAgICAgICAgbWVzc2FnZTogJ1x1NjZGNFx1NjVCMFx1NjIxMFx1NTI5RidcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTUyMjBcdTk2NjRcdThEMkRcdTcyNjlcdThGNjZcdTU1NDZcdTU0QzFcclxuICAgKiBERUxFVEUgL2FwaS9jYXJ0LzppdGVtSWRcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6IC9cXC9hcGlcXC9jYXJ0XFwvKFxcdyspJC8sXHJcbiAgICBtZXRob2Q6ICdkZWxldGUnLFxyXG4gICAgcmVzcG9uc2U6IChjb25maWc6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBjb25maWcudXJsIGFzIHN0cmluZ1xyXG4gICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvYXBpXFwvY2FydFxcLyhcXHcrKSQvKVxyXG4gICAgICBjb25zdCBpdGVtSWQgPSBtYXRjaCA/IG1hdGNoWzFdIDogJydcclxuXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoeyBtZXNzYWdlOiAnXHU1MjIwXHU5NjY0XHU2MjEwXHU1MjlGJywgaWQ6IGl0ZW1JZCB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NjI3OVx1OTFDRlx1NTIyMFx1OTY2NFx1OEQyRFx1NzI2OVx1OEY2Nlx1NTU0Nlx1NTRDMVxyXG4gICAqIFBPU1QgL2FwaS9jYXJ0L2JhdGNoLXJlbW92ZVxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY2FydC9iYXRjaC1yZW1vdmUnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKHsgYm9keSB9OiB7IGJvZHk6IGFueSB9KSA9PiB7XHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2Uoe1xyXG4gICAgICAgIG1lc3NhZ2U6ICdcdTYyNzlcdTkxQ0ZcdTUyMjBcdTk2NjRcdTYyMTBcdTUyOUYnLFxyXG4gICAgICAgIGRlbGV0ZWRDb3VudDogYm9keS5pdGVtSWRzPy5sZW5ndGggfHwgMFxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NTE2OFx1OTAwOS9cdTUzRDZcdTZEODhcdTUxNjhcdTkwMDlcdThEMkRcdTcyNjlcdThGNjZcdTU1NDZcdTU0QzFcclxuICAgKiBQT1NUIC9hcGkvY2FydC9zZWxlY3QtYWxsXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9jYXJ0L3NlbGVjdC1hbGwnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKHsgYm9keSB9OiB7IGJvZHk6IGFueSB9KSA9PiB7XHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2Uoe1xyXG4gICAgICAgIG1lc3NhZ2U6IGJvZHkuc2VsZWN0ZWQgPyAnXHU1MTY4XHU5MDA5XHU2MjEwXHU1MjlGJyA6ICdcdTUzRDZcdTZEODhcdTUxNjhcdTkwMDlcdTYyMTBcdTUyOUYnLFxyXG4gICAgICAgIHNlbGVjdGVkOiBib2R5LnNlbGVjdGVkXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU1QzA2XHU4RDJEXHU3MjY5XHU4RjY2XHU1NTQ2XHU1NEMxXHU3OUZCXHU1MTY1XHU2NTM2XHU4NUNGXHU1OTM5XHJcbiAgICogUE9TVCAvYXBpL2NhcnQvOml0ZW1JZC9tb3ZlLWZhdm9yaXRlXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAvXFwvYXBpXFwvY2FydFxcLyhcXHcrKVxcL21vdmUtZmF2b3JpdGUkLyxcclxuICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgcmVzcG9uc2U6IChjb25maWc6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCB1cmwgPSBjb25maWcudXJsIGFzIHN0cmluZ1xyXG4gICAgICBjb25zdCBtYXRjaCA9IHVybC5tYXRjaCgvXFwvYXBpXFwvY2FydFxcLyhcXHcrKVxcL21vdmUtZmF2b3JpdGUkLylcclxuICAgICAgY29uc3QgaXRlbUlkID0gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnXHJcblxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICBtZXNzYWdlOiAnXHU1REYyXHU3OUZCXHU1MTY1XHU2NTM2XHU4NUNGXHU1OTM5JyxcclxuICAgICAgICBpdGVtSWQsXHJcbiAgICAgICAgZmF2b3JpdGVJZDogJ2ZhdicgKyBEYXRlLm5vdygpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU2RTA1XHU3QTdBXHU4RDJEXHU3MjY5XHU4RjY2XHJcbiAgICogREVMRVRFIC9hcGkvY2FydC9jbGVhclxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY2FydC9jbGVhcicsXHJcbiAgICBtZXRob2Q6ICdkZWxldGUnLFxyXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZSh7IG1lc3NhZ2U6ICdcdThEMkRcdTcyNjlcdThGNjZcdTVERjJcdTZFMDVcdTdBN0EnIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gXHU0RjE4XHU2MEUwXHU1MjM4XHU3NkY4XHU1MTczXHU2M0E1XHU1M0UzID09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIC8qKlxyXG4gICAqIFx1ODNCN1x1NTNENlx1NEYxOFx1NjBFMFx1NTIzOFx1NTIxN1x1ODg2OFxyXG4gICAqIEdFVCAvYXBpL2NvdXBvbnM/c3RhdHVzPSZwYWdlPVxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvY291cG9ucycsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICh7IHF1ZXJ5IH06IHsgcXVlcnk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSkgPT4ge1xyXG4gICAgICBjb25zdCBzdGF0dXMgPSBxdWVyeS5zdGF0dXMgfHwgJ2F2YWlsYWJsZSdcclxuICAgICAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHF1ZXJ5LnBhZ2UgfHwgJzEnKVxyXG4gICAgICBjb25zdCBwYWdlU2l6ZSA9IHBhcnNlSW50KHF1ZXJ5LnBhZ2VTaXplIHx8ICcxMCcpXHJcblxyXG4gICAgICAvLyBcdTZBMjFcdTYyREZcdTRGMThcdTYwRTBcdTUyMzhcdTY1NzBcdTYzNkVcclxuICAgICAgY29uc3QgY291cG9ucyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2NvdXBvbjAwMScsXHJcbiAgICAgICAgICBjb2RlOiAnTkVXVVNFUjIwMjYnLFxyXG4gICAgICAgICAgbmFtZTogJ1x1NjVCMFx1NzUyOFx1NjIzN1x1NEUxM1x1NEVBQlx1NTIzOCcsXHJcbiAgICAgICAgICB0eXBlOiAnY2FzaCcsXHJcbiAgICAgICAgICB2YWx1ZTogMjAsXHJcbiAgICAgICAgICBtaW5PcmRlcjogMTAwLFxyXG4gICAgICAgICAgc3RhdHVzOiAnYXZhaWxhYmxlJyxcclxuICAgICAgICAgIHZhbGlkRnJvbTogJzIwMjYtMDEtMDFUMDA6MDA6MDBaJyxcclxuICAgICAgICAgIHZhbGlkVG86ICcyMDI2LTEyLTMxVDIzOjU5OjU5WicsXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NjVCMFx1NzUyOFx1NjIzN1x1NkNFOFx1NTE4Q1x1NTM3M1x1NTNFRlx1OTg4Nlx1NTNENicsXHJcbiAgICAgICAgICBzY29wZTogJ1x1NTE2OFx1NTczQVx1OTAxQVx1NzUyOCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnY291cG9uMDAyJyxcclxuICAgICAgICAgIGNvZGU6ICdGT09ENTAnLFxyXG4gICAgICAgICAgbmFtZTogJ1x1OThERlx1NTRDMVx1NzUxRlx1OUM5Q1x1NTIzOCcsXHJcbiAgICAgICAgICB0eXBlOiAnY2FzaCcsXHJcbiAgICAgICAgICB2YWx1ZTogMTAsXHJcbiAgICAgICAgICBtaW5PcmRlcjogNTAsXHJcbiAgICAgICAgICBzdGF0dXM6ICdhdmFpbGFibGUnLFxyXG4gICAgICAgICAgdmFsaWRGcm9tOiAnMjAyNi0wNC0wMVQwMDowMDowMFonLFxyXG4gICAgICAgICAgdmFsaWRUbzogJzIwMjYtMDQtMzBUMjM6NTk6NTlaJyxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU5NjUwXHU5OERGXHU1NEMxXHU3NTFGXHU5QzlDXHU3QzdCXHU1NTQ2XHU1NEMxXHU0RjdGXHU3NTI4JyxcclxuICAgICAgICAgIHNjb3BlOiAnXHU5OERGXHU1NEMxXHU3NTFGXHU5QzlDJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdjb3Vwb24wMDMnLFxyXG4gICAgICAgICAgY29kZTogJ0RJR0lUQUwyMDAnLFxyXG4gICAgICAgICAgbmFtZTogJ1x1NjU3MFx1NzgwMVx1NUJCNlx1NzUzNVx1NTIzOCcsXHJcbiAgICAgICAgICB0eXBlOiAnY2FzaCcsXHJcbiAgICAgICAgICB2YWx1ZTogMTAwLFxyXG4gICAgICAgICAgbWluT3JkZXI6IDEwMDAsXHJcbiAgICAgICAgICBzdGF0dXM6ICdhdmFpbGFibGUnLFxyXG4gICAgICAgICAgdmFsaWRGcm9tOiAnMjAyNi0wNC0wMVQwMDowMDowMFonLFxyXG4gICAgICAgICAgdmFsaWRUbzogJzIwMjYtMDUtMTVUMjM6NTk6NTlaJyxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnXHU5NjUwXHU2NTcwXHU3ODAxXHU1QkI2XHU3NTM1XHU3QzdCXHU1NTQ2XHU1NEMxXHU0RjdGXHU3NTI4JyxcclxuICAgICAgICAgIHNjb3BlOiAnXHU2NTcwXHU3ODAxXHU1QkI2XHU3NTM1J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdjb3Vwb24wMDQnLFxyXG4gICAgICAgICAgY29kZTogJ0ZSRUVTSElQJyxcclxuICAgICAgICAgIG5hbWU6ICdcdTUxNERcdThGRDBcdThEMzlcdTUyMzgnLFxyXG4gICAgICAgICAgdHlwZTogJ2ZyZWVfc2hpcHBpbmcnLFxyXG4gICAgICAgICAgdmFsdWU6IDAsXHJcbiAgICAgICAgICBtaW5PcmRlcjogMCxcclxuICAgICAgICAgIHN0YXR1czogJ2F2YWlsYWJsZScsXHJcbiAgICAgICAgICB2YWxpZEZyb206ICcyMDI2LTA0LTAxVDAwOjAwOjAwWicsXHJcbiAgICAgICAgICB2YWxpZFRvOiAnMjAyNi0wNC0yMFQyMzo1OTo1OVonLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTUxNjhcdTU3M0FcdTUxNERcdThGRDBcdThEMzknLFxyXG4gICAgICAgICAgc2NvcGU6ICdcdTUxNjhcdTU3M0FcdTkwMUFcdTc1MjgnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2NvdXBvbjAwNScsXHJcbiAgICAgICAgICBjb2RlOiAnRElTQ09VTlQ4NScsXHJcbiAgICAgICAgICBuYW1lOiAnODVcdTYyOThcdTYyOThcdTYyNjNcdTUyMzgnLFxyXG4gICAgICAgICAgdHlwZTogJ2Rpc2NvdW50JyxcclxuICAgICAgICAgIHZhbHVlOiA4LjUsXHJcbiAgICAgICAgICBtaW5PcmRlcjogMjAwLFxyXG4gICAgICAgICAgc3RhdHVzOiAndXNlZCcsXHJcbiAgICAgICAgICB2YWxpZEZyb206ICcyMDI2LTAzLTAxVDAwOjAwOjAwWicsXHJcbiAgICAgICAgICB2YWxpZFRvOiAnMjAyNi0wMy0zMVQyMzo1OTo1OVonLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdcdTUxNjhcdTU3M0FcdTU1NDZcdTU0QzE4NVx1NjI5OCcsXHJcbiAgICAgICAgICBzY29wZTogJ1x1NTE2OFx1NTczQVx1OTAxQVx1NzUyOCcsXHJcbiAgICAgICAgICB1c2VkQXQ6ICcyMDI2LTAzLTE1VDEwOjMwOjAwWidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnY291cG9uMDA2JyxcclxuICAgICAgICAgIGNvZGU6ICdTUFJJTkczMCcsXHJcbiAgICAgICAgICBuYW1lOiAnXHU2NjI1XHU1QjYzXHU3Mjc5XHU2MEUwXHU1MjM4JyxcclxuICAgICAgICAgIHR5cGU6ICdjYXNoJyxcclxuICAgICAgICAgIHZhbHVlOiAzMCxcclxuICAgICAgICAgIG1pbk9yZGVyOiAxNTAsXHJcbiAgICAgICAgICBzdGF0dXM6ICdleHBpcmVkJyxcclxuICAgICAgICAgIHZhbGlkRnJvbTogJzIwMjYtMDMtMDFUMDA6MDA6MDBaJyxcclxuICAgICAgICAgIHZhbGlkVG86ICcyMDI2LTAzLTMxVDIzOjU5OjU5WicsXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1x1NjYyNVx1NUI2M1x1OTY1MFx1NjVGNlx1NzI3OVx1NjBFMCcsXHJcbiAgICAgICAgICBzY29wZTogJ1x1NTE2OFx1NTczQVx1OTAxQVx1NzUyOCdcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuXHJcbiAgICAgIC8vIFx1NjgzOVx1NjM2RVx1NzJCNlx1NjAwMVx1N0I1Qlx1OTAwOVxyXG4gICAgICBsZXQgZmlsdGVyZWRDb3Vwb25zID0gY291cG9uc1xyXG4gICAgICBpZiAoc3RhdHVzICYmIHN0YXR1cyAhPT0gJ2FsbCcpIHtcclxuICAgICAgICBmaWx0ZXJlZENvdXBvbnMgPSBjb3Vwb25zLmZpbHRlcihjID0+IGMuc3RhdHVzID09PSBzdGF0dXMpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UocGFnaW5hdGUoZmlsdGVyZWRDb3Vwb25zLCBwYWdlLCBwYWdlU2l6ZSkpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU5ODg2XHU1M0Q2XHU0RjE4XHU2MEUwXHU1MjM4XHJcbiAgICogUE9TVCAvYXBpL2NvdXBvbnMvOmlkL2NsYWltXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAvXFwvYXBpXFwvY291cG9uc1xcLyhcXHcrKVxcL2NsYWltJC8sXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAoY29uZmlnOiBhbnkpID0+IHtcclxuICAgICAgY29uc3QgdXJsID0gY29uZmlnLnVybCBhcyBzdHJpbmdcclxuICAgICAgY29uc3QgbWF0Y2ggPSB1cmwubWF0Y2goL1xcL2FwaVxcL2NvdXBvbnNcXC8oXFx3KylcXC9jbGFpbSQvKVxyXG4gICAgICBjb25zdCBpZCA9IG1hdGNoID8gbWF0Y2hbMV0gOiAnJ1xyXG5cclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZSh7XHJcbiAgICAgICAgbWVzc2FnZTogJ1x1OTg4Nlx1NTNENlx1NjIxMFx1NTI5RicsXHJcbiAgICAgICAgY291cG9uSWQ6IGlkLFxyXG4gICAgICAgIGNsYWltZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gXHU3NTI4XHU2MjM3XHU1OTM0XHU1MENGXHU0RTBBXHU0RjIwXHU2M0E1XHU1M0UzID09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NEUwQVx1NEYyMFx1NzUyOFx1NjIzN1x1NTkzNFx1NTBDRlxyXG4gICAqIFBPU1QgL2FwaS91c2VyL2F2YXRhclxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvdXNlci9hdmF0YXInLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKHJlcTogYW55KSA9PiB7XHJcbiAgICAgIC8vIFx1NkEyMVx1NjJERlx1NTkzNFx1NTBDRlx1NEUwQVx1NEYyMFx1NjIxMFx1NTI5Rlx1RkYwQ1x1OEZENFx1NTZERVx1NEUwMFx1NEUyQVx1NTdGQVx1NEU4RVx1NjVGNlx1OTVGNFx1NjIzM1x1NzY4NFx1NTUyRlx1NEUwMFx1NTkzNFx1NTBDRlVSTFxyXG4gICAgICAvLyBcdTRGN0ZcdTc1MjggZGljZWJlYXIgXHU3Njg0XHU1MjFEXHU1OUNCXHU1OTM0XHU1MENGIEFQSVx1RkYwQ1x1NTdGQVx1NEU4RVx1NjVGNlx1OTVGNFx1NjIzM1x1NzUxRlx1NjIxMFx1NEUwRFx1NTQwQ1x1NTkzNFx1NTBDRlxyXG4gICAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXHJcbiAgICAgIGNvbnN0IHNlZWQgPSBgdXNlcl8ke3RpbWVzdGFtcH1gXHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2Uoe1xyXG4gICAgICAgIHVybDogYGh0dHBzOi8vYXBpLmRpY2ViZWFyLmNvbS83LngvaW5pdGlhbHMvc3ZnP3NlZWQ9JHtzZWVkfSZzaXplPTIwMCZiYWNrZ3JvdW5kQ29sb3I9YjZlM2Y0YCxcclxuICAgICAgICBtZXNzYWdlOiAnXHU1OTM0XHU1MENGXHU0RTBBXHU0RjIwXHU2MjEwXHU1MjlGJ1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFx1NzUyOFx1NjIzN1x1N0VERlx1OEJBMVx1NjNBNVx1NTNFMyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAvKipcclxuICAgKiBcdTgzQjdcdTUzRDZcdTc1MjhcdTYyMzdcdTRFMkFcdTRFQkFcdTdFREZcdThCQTFcdTY1NzBcdTYzNkVcclxuICAgKiBHRVQgL2FwaS91c2VyL3N0YXRpc3RpY3NcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL3VzZXIvc3RhdGlzdGljcycsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZSh7XHJcbiAgICAgICAgcG9zdHNDb3VudDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTApLFxyXG4gICAgICAgIGxpa2VzUmVjZWl2ZWQ6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIwMCksXHJcbiAgICAgICAgb3JkZXJzQ29tcGxldGVkOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAzMCksXHJcbiAgICAgICAgY3JlZGl0U2NvcmU6IDUuMCxcclxuICAgICAgICBncm93dGhWYWx1ZTogMjY4MCxcclxuICAgICAgICBsZXZlbDogJ1x1OUVEMVx1NzlEMVx1NTkyN1x1NTcyOFx1NjgyMVx1NzUxRidcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBcdTdGMzRcdThEMzlcdTc2RjhcdTUxNzNcdTYzQTVcdTUzRTMgPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgLyoqXHJcbiAgICogXHU4M0I3XHU1M0Q2XHU3RjM0XHU4RDM5XHU5ODc5XHU3NkVFXHU1MjE3XHU4ODY4XHJcbiAgICogR0VUIC9hcGkvcGF5bWVudC9pdGVtc1xyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvcGF5bWVudC9pdGVtcycsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZShbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdpdGVtMDAxJyxcclxuICAgICAgICAgIG5hbWU6ICcyMDI0XHU1RTc0XHU2NjI1XHU1QjYzXHU1QjY2XHU4RDM5JyxcclxuICAgICAgICAgIGFtb3VudDogNTUwMCxcclxuICAgICAgICAgIGRlYWRsaW5lOiAnMjAyNC0wMy0wMScsXHJcbiAgICAgICAgICB0eXBlOiAndHVpdGlvbicsXHJcbiAgICAgICAgICBzdGF0dXM6ICd1bnBhaWQnLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICcyMDI0XHU1RTc0XHU2NjI1XHU1QjYzXHU1QjY2XHU2NzFGXHU1QjY2XHU4RDM5J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdpdGVtMDAyJyxcclxuICAgICAgICAgIG5hbWU6ICdcdTRGNEZcdTVCQkZcdThEMzknLFxyXG4gICAgICAgICAgYW1vdW50OiAxMjAwLFxyXG4gICAgICAgICAgZGVhZGxpbmU6ICcyMDI0LTAzLTAxJyxcclxuICAgICAgICAgIHR5cGU6ICdhY2NvbW1vZGF0aW9uJyxcclxuICAgICAgICAgIHN0YXR1czogJ3BhaWQnLFxyXG4gICAgICAgICAgcGFpZEF0OiAnMjAyNC0wMi0xNScsXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJzIwMjRcdTVFNzRcdTY2MjVcdTVCNjNcdTVCNjZcdTY3MUZcdTRGNEZcdTVCQkZcdThEMzknXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2l0ZW0wMDMnLFxyXG4gICAgICAgICAgbmFtZTogJ1x1NjU1OVx1Njc1MFx1OEQzOScsXHJcbiAgICAgICAgICBhbW91bnQ6IDM1MCxcclxuICAgICAgICAgIGRlYWRsaW5lOiAnMjAyNC0wMy0xMCcsXHJcbiAgICAgICAgICB0eXBlOiAnbWF0ZXJpYWwnLFxyXG4gICAgICAgICAgc3RhdHVzOiAndW5wYWlkJyxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnMjAyNFx1NUU3NFx1NjYyNVx1NUI2M1x1NUI2Nlx1NjcxRlx1NjU1OVx1Njc1MFx1OEQzOSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnaXRlbTAwNCcsXHJcbiAgICAgICAgICBuYW1lOiAnXHU0RkREXHU5NjY5XHU4RDM5JyxcclxuICAgICAgICAgIGFtb3VudDogMTAwLFxyXG4gICAgICAgICAgZGVhZGxpbmU6ICcyMDI0LTAzLTE1JyxcclxuICAgICAgICAgIHR5cGU6ICdpbnN1cmFuY2UnLFxyXG4gICAgICAgICAgc3RhdHVzOiAndW5wYWlkJyxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnMjAyNFx1NUU3NFx1NUVBNlx1NUI2Nlx1NzUxRlx1NEZERFx1OTY2OSdcclxuICAgICAgICB9XHJcbiAgICAgIF0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU4M0I3XHU1M0Q2XHU1MzU1XHU0RTJBXHU3RjM0XHU4RDM5XHU5ODc5XHU3NkVFXHJcbiAgICogR0VUIC9hcGkvcGF5bWVudC9pdGVtcy86aWRcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL3BheW1lbnQvaXRlbXMvOmlkJyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKHJlcTogYW55KSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXNcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZSh7XHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAgbmFtZTogJ1x1N0YzNFx1OEQzOVx1OTg3OVx1NzZFRSAnICsgaWQsXHJcbiAgICAgICAgYW1vdW50OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1MDAwKSArIDUwMCxcclxuICAgICAgICBkZWFkbGluZTogJzIwMjQtMDMtMDEnLFxyXG4gICAgICAgIHR5cGU6ICd0dWl0aW9uJyxcclxuICAgICAgICBzdGF0dXM6ICd1bnBhaWQnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnXHU3RjM0XHU4RDM5XHU5ODc5XHU3NkVFXHU4QkU2XHU2MEM1J1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NTIxQlx1NUVGQVx1N0YzNFx1OEQzOVx1OEJBMlx1NTM1NVxyXG4gICAqIFBPU1QgL2FwaS9wYXltZW50L2NyZWF0ZVxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvcGF5bWVudC9jcmVhdGUnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKCkgPT4ge1xyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICBwYXltZW50VXJsOiAnaHR0cHM6Ly9tb2NrLXBheW1lbnQuZXhhbXBsZS5jb20vcGF5LycgKyBEYXRlLm5vdygpLFxyXG4gICAgICAgIG9yZGVySWQ6ICdPUkQnICsgRGF0ZS5ub3coKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NjdFNVx1OEJFMlx1N0YzNFx1OEQzOVx1NzJCNlx1NjAwMVxyXG4gICAqIEdFVCAvYXBpL3BheW1lbnQvc3RhdHVzLzpvcmRlcklkXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9wYXltZW50L3N0YXR1cy86b3JkZXJJZCcsXHJcbiAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgcmVzcG9uc2U6ICgpID0+IHtcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZSh7XHJcbiAgICAgICAgc3RhdHVzOiAncGVuZGluZycsXHJcbiAgICAgICAgcGFpZEF0OiBudWxsXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU4M0I3XHU1M0Q2XHU3RjM0XHU4RDM5XHU4QkIwXHU1RjU1XHJcbiAgICogR0VUIC9hcGkvcGF5bWVudC9yZWNvcmRzXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9wYXltZW50L3JlY29yZHMnLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAncmVjMDAxJyxcclxuICAgICAgICAgIGl0ZW1OYW1lOiAnMjAyM1x1NUU3NFx1NzlDQlx1NUI2M1x1NUI2Nlx1OEQzOScsXHJcbiAgICAgICAgICBhbW91bnQ6IDU1MDAsXHJcbiAgICAgICAgICBwYWlkQXQ6ICcyMDIzLTA5LTAxJyxcclxuICAgICAgICAgIG1ldGhvZDogJ2FsaXBheScsXHJcbiAgICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICdyZWMwMDInLFxyXG4gICAgICAgICAgaXRlbU5hbWU6ICcyMDIzXHU1RTc0XHU3OUNCXHU1QjYzXHU0RjRGXHU1QkJGXHU4RDM5JyxcclxuICAgICAgICAgIGFtb3VudDogMTIwMCxcclxuICAgICAgICAgIHBhaWRBdDogJzIwMjMtMDktMDEnLFxyXG4gICAgICAgICAgbWV0aG9kOiAnd2VjaGF0JyxcclxuICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ3JlYzAwMycsXHJcbiAgICAgICAgICBpdGVtTmFtZTogJ1x1NjU1OVx1Njc1MFx1OEQzOScsXHJcbiAgICAgICAgICBhbW91bnQ6IDI4MCxcclxuICAgICAgICAgIHBhaWRBdDogJzIwMjMtMDktMDUnLFxyXG4gICAgICAgICAgbWV0aG9kOiAnYWxpcGF5JyxcclxuICAgICAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnXHJcbiAgICAgICAgfVxyXG4gICAgICBdKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1ODNCN1x1NTNENlx1N0YzNFx1OEQzOVx1NkM0N1x1NjAzQlxyXG4gICAqIEdFVCAvYXBpL3BheW1lbnQvc3VtbWFyeVxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvcGF5bWVudC9zdW1tYXJ5JyxcclxuICAgIG1ldGhvZDogJ2dldCcsXHJcbiAgICByZXNwb25zZTogKCkgPT4ge1xyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICB0b3RhbEFtb3VudDogNzE1MCxcclxuICAgICAgICBwYWlkQW1vdW50OiAxMjAwLFxyXG4gICAgICAgIHVucGFpZEFtb3VudDogNTk1MCxcclxuICAgICAgICBvdmVyZHVlQW1vdW50OiAwLFxyXG4gICAgICAgIGl0ZW1Db3VudDogNCxcclxuICAgICAgICBwYWlkQ291bnQ6IDEsXHJcbiAgICAgICAgdW5wYWlkQ291bnQ6IDNcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBcdTYzRDBcdTRFQTRcdTdFRkZcdTgyNzJcdTkwMUFcdTkwNTNcdTc1MzNcdThCRjdcclxuICAgKiBQT1NUIC9hcGkvcGF5bWVudC9ncmVlbi1jaGFubmVsXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9wYXltZW50L2dyZWVuLWNoYW5uZWwnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKHJlcTogYW55KSA9PiB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSByZXEuYm9keVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICBpZDogJ0dDJyArIERhdGUubm93KCksXHJcbiAgICAgICAgLi4uZGF0YSxcclxuICAgICAgICBzdGF0dXM6ICdwZW5kaW5nJyxcclxuICAgICAgICBzdWJtaXR0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogXHU4M0I3XHU1M0Q2XHU3RUZGXHU4MjcyXHU5MDFBXHU5MDUzXHU3NTMzXHU4QkY3XHU4QkIwXHU1RjU1XHJcbiAgICogR0VUIC9hcGkvcGF5bWVudC9ncmVlbi1jaGFubmVsXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9wYXltZW50L2dyZWVuLWNoYW5uZWwnLFxyXG4gICAgbWV0aG9kOiAnZ2V0JyxcclxuICAgIHJlc3BvbnNlOiAoKSA9PiB7XHJcbiAgICAgIHJldHVybiBzdWNjZXNzUmVzcG9uc2UoW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAnR0MwMDEnLFxyXG4gICAgICAgICAgcmVhc29uOiAnXHU1QkI2XHU1RUFEXHU3RUNGXHU2RDRFXHU1NkYwXHU5NkJFJyxcclxuICAgICAgICAgIGFtb3VudDogNTUwMCxcclxuICAgICAgICAgIHN0YXR1czogJ2FwcHJvdmVkJyxcclxuICAgICAgICAgIHN1Ym1pdHRlZEF0OiAnMjAyNC0wMi0yMCcsXHJcbiAgICAgICAgICByZXZpZXdlZEF0OiAnMjAyNC0wMi0yMicsXHJcbiAgICAgICAgICByZXZpZXdlckNvbW1lbnQ6ICdcdTVCQTFcdTY4MzhcdTkwMUFcdThGQzdcdUZGMENcdThCRjdcdTYzMDlcdTY1RjZcdTdGMzRcdThEMzknXHJcbiAgICAgICAgfVxyXG4gICAgICBdKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFx1NzUyOFx1NjIzN1x1OEQ0NFx1NjU5OVx1NjZGNFx1NjVCMFx1NjNBNVx1NTNFMyA9PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAvKipcclxuICAgKiBcdTY2RjRcdTY1QjBcdTc1MjhcdTYyMzdcdThENDRcdTY1OTlcclxuICAgKiBQVVQgL2FwaS91c2VyL3Byb2ZpbGVcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL3VzZXIvcHJvZmlsZScsXHJcbiAgICBtZXRob2Q6ICdwdXQnLFxyXG4gICAgcmVzcG9uc2U6IChyZXE6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCBkYXRhID0gcmVxLmJvZHlcclxuICAgICAgY29uc29sZS5sb2coJ1tNb2NrXSBVcGRhdGUgcHJvZmlsZTonLCBkYXRhKVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICBpZDogMSxcclxuICAgICAgICB1c2VybmFtZTogJ3N0dWRlbnRfMjAyMjAyMDAwMScsXHJcbiAgICAgICAgZW1haWw6IGRhdGEuZW1haWwgfHwgJ3poYW5nc2FuQHVzdGguZWR1LmNuJyxcclxuICAgICAgICBwaG9uZTogZGF0YS5waG9uZSB8fCAnMTM4KioqKjg4ODgnLFxyXG4gICAgICAgIG5pY2tuYW1lOiBkYXRhLm5pY2tuYW1lIHx8ICdcdTVGMjBcdTU0MENcdTVCNjYnLFxyXG4gICAgICAgIGF2YXRhcjogZGF0YS5hdmF0YXIgfHwgJ2h0dHBzOi8vYXBpLmRpY2ViZWFyLmNvbS83LngvYXZhdGFhYXJzL3N2Zz9zZWVkPTMzJnNpemU9MjAwJyxcclxuICAgICAgICBnZW5kZXI6IGRhdGEuZ2VuZGVyIHx8ICdtYWxlJyxcclxuICAgICAgICBiaXJ0aGRheTogZGF0YS5iaXJ0aGRheSB8fCAnMjAwMC0wMS0wMScsXHJcbiAgICAgICAgc3R1ZGVudElkOiAnMjAyMjAyMDAwMScsXHJcbiAgICAgICAgc2Nob29sOiBkYXRhLnNjaG9vbCB8fCAnXHU4QkExXHU3Qjk3XHU2NzNBXHU3OUQxXHU1QjY2XHU0RTBFXHU2MjgwXHU2NzJGXHU1QjY2XHU5NjYyJyxcclxuICAgICAgICBtYWpvcjogZGF0YS5tYWpvciB8fCAnXHU4RjZGXHU0RUY2XHU1REU1XHU3QTBCJyxcclxuICAgICAgICBncmFkZTogZGF0YS5ncmFkZSB8fCAnMjAyMlx1N0VBNycsXHJcbiAgICAgICAgcm9sZTogJ3VzZXInLFxyXG4gICAgICAgIHN0YXR1czogJ2FjdGl2ZScsXHJcbiAgICAgICAgY3JlYXRlZEF0OiAnMjAyNC0wMS0wMVQwMDowMDowMFonLFxyXG4gICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gXHU5QThDXHU4QkMxXHU3ODAxXHU3NkY4XHU1MTczXHU2M0E1XHU1M0UzID09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIC8qKlxyXG4gICAqIFx1NTNEMVx1OTAwMVx1OUE4Q1x1OEJDMVx1NzgwMVxyXG4gICAqIFBPU1QgL2FwaS9hdXRoL3NlbmQtY29kZVxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvYXV0aC9zZW5kLWNvZGUnLFxyXG4gICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICByZXNwb25zZTogKHJlcTogYW55KSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgdGFyZ2V0LCB0eXBlIH0gPSByZXEuYm9keVxyXG4gICAgICBjb25zb2xlLmxvZyhgW01vY2tdIFx1NTNEMVx1OTAwMVx1OUE4Q1x1OEJDMVx1NzgwMVx1NTIzMCAke3RhcmdldH0sIFx1N0M3Qlx1NTc4QjogJHt0eXBlfWApXHJcbiAgICAgIC8vIFx1NkEyMVx1NjJERlx1NTNEMVx1OTAwMVx1OUE4Q1x1OEJDMVx1NzgwMVx1NjIxMFx1NTI5RlxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICBtZXNzYWdlOiAnXHU5QThDXHU4QkMxXHU3ODAxXHU1REYyXHU1M0QxXHU5MDAxJyxcclxuICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgdHlwZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1OUE4Q1x1OEJDMVx1OUE4Q1x1OEJDMVx1NzgwMVxyXG4gICAqIFBPU1QgL2FwaS9hdXRoL3ZlcmlmeS1jb2RlXHJcbiAgICovXHJcbiAge1xyXG4gICAgdXJsOiAnL2FwaS9hdXRoL3ZlcmlmeS1jb2RlJyxcclxuICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgcmVzcG9uc2U6IChyZXE6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCB7IHRhcmdldCwgY29kZSB9ID0gcmVxLmJvZHlcclxuICAgICAgY29uc29sZS5sb2coYFtNb2NrXSBcdTlBOENcdThCQzFcdTlBOENcdThCQzFcdTc4MDE6ICR7dGFyZ2V0fSwgXHU3ODAxOiAke2NvZGV9YClcclxuICAgICAgLy8gXHU2QTIxXHU2MkRGXHU5QThDXHU4QkMxXHU2MjEwXHU1MjlGXHVGRjA4XHU0RUZCXHU0RjU1Nlx1NEY0RFx1NjU3MFx1NUI1N1x1OTBGRFx1OTAxQVx1OEZDN1x1RkYwOVxyXG4gICAgICBjb25zdCBpc1ZhbGlkID0gY29kZSAmJiBjb2RlLmxlbmd0aCA9PT0gNiAmJiAvXlxcZHs2fSQvLnRlc3QoY29kZSlcclxuICAgICAgcmV0dXJuIHN1Y2Nlc3NSZXNwb25zZSh7XHJcbiAgICAgICAgdmVyaWZpZWQ6IGlzVmFsaWQsXHJcbiAgICAgICAgbWVzc2FnZTogaXNWYWxpZCA/ICdcdTlBOENcdThCQzFcdTYyMTBcdTUyOUYnIDogJ1x1OUE4Q1x1OEJDMVx1NzgwMVx1OTUxOVx1OEJFRidcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBcdTVCODlcdTUxNjhcdThCQkVcdTdGNkVcdTc2RjhcdTUxNzNcdTYzQTVcdTUzRTMgPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgLyoqXHJcbiAgICogXHU3RUQxXHU1QjlBXHU2MjRCXHU2NzNBXHU1M0Y3XHJcbiAgICogUE9TVCAvYXBpL3VzZXIvc2VjdXJpdHkvYmluZC1waG9uZVxyXG4gICAqL1xyXG4gIHtcclxuICAgIHVybDogJy9hcGkvdXNlci9zZWN1cml0eS9iaW5kLXBob25lJyxcclxuICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgcmVzcG9uc2U6IChyZXE6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCB7IHBob25lLCBjb2RlIH0gPSByZXEuYm9keVxyXG4gICAgICBjb25zb2xlLmxvZyhgW01vY2tdIFx1N0VEMVx1NUI5QVx1NjI0Qlx1NjczQVx1NTNGNzogJHtwaG9uZX0sIFx1OUE4Q1x1OEJDMVx1NzgwMTogJHtjb2RlfWApXHJcbiAgICAgIC8vIFx1NkEyMVx1NjJERlx1N0VEMVx1NUI5QVx1NjIxMFx1NTI5RlxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICBtZXNzYWdlOiAnXHU2MjRCXHU2NzNBXHU1M0Y3XHU3RUQxXHU1QjlBXHU2MjEwXHU1MjlGJyxcclxuICAgICAgICBwaG9uZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFx1N0VEMVx1NUI5QVx1OTBBRVx1N0JCMVxyXG4gICAqIFBPU1QgL2FwaS91c2VyL3NlY3VyaXR5L2JpbmQtZW1haWxcclxuICAgKi9cclxuICB7XHJcbiAgICB1cmw6ICcvYXBpL3VzZXIvc2VjdXJpdHkvYmluZC1lbWFpbCcsXHJcbiAgICBtZXRob2Q6ICdwb3N0JyxcclxuICAgIHJlc3BvbnNlOiAocmVxOiBhbnkpID0+IHtcclxuICAgICAgY29uc3QgeyBlbWFpbCwgY29kZSB9ID0gcmVxLmJvZHlcclxuICAgICAgY29uc29sZS5sb2coYFtNb2NrXSBcdTdFRDFcdTVCOUFcdTkwQUVcdTdCQjE6ICR7ZW1haWx9LCBcdTlBOENcdThCQzFcdTc4MDE6ICR7Y29kZX1gKVxyXG4gICAgICByZXR1cm4gc3VjY2Vzc1Jlc3BvbnNlKHtcclxuICAgICAgICBtZXNzYWdlOiAnXHU5MEFFXHU3QkIxXHU3RUQxXHU1QjlBXHU2MjEwXHU1MjlGJyxcclxuICAgICAgICBlbWFpbFxyXG4g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QUNGOzs7Ozs7RUFRQTtJQUNFLEtBQUs7SUFDTCxRQUFRO0lBQ1IsVUFBVSxDQUFDLFFBQWE7QUFDdEIsWUFBTSxPQUFPLElBQUk7QUFDakIsY0FBUSxJQUFJLDBCQUEwQixJQUFJO0FBQzFDLGFBQU8sZ0JBQWdCO1FBQ3JCLElBQUk7UUFDSixVQUFVO1FBQ1YsT0FBTyxLQUFLLFNBQVM7UUFDckIsT0FBTyxLQUFLLFNBQVM7UUFDckIsVUFBVSxLQUFLLFlBQVk7UUFDM0IsUUFBUSxLQUFLLFVBQVU7UUFDdkIsUUFBUSxLQUFLLFVBQVU7UUFDdkIsVUFBVSxLQUFLLFlBQVk7UUFDM0IsV0FBVztRQUNYLFFBQVEsS0FBSyxVQUFVO1FBQ3ZCLE9BQU8sS0FBSyxTQUFTO1FBQ3JCLE9BQU8sS0FBSyxTQUFTO1FBQ3JCLE1BQU07UUFDTixRQUFRO1FBQ1IsV0FBVztRQUNYLFlBQVcsb0JBQUksS0FBSyxHQUFFLFlBQVk7TUFDcEMsQ0FBQztJQUNIO0VBQ0Y7Ozs7OztFQVFBO0lBQ0UsS0FBSztJQUNMLFFBQVE7SUFDUixVQUFVLENBQUMsUUFBYTtBQUN0QixZQUFNLEVBQUUsUUFBUSxLQUFLLElBQUksSUFBSTtBQUM3QixjQUFRLElBQUksK0NBQWlCLE1BQU0sbUJBQVMsSUFBSSxFQUFFO0FBRWxELGFBQU8sZ0JBQWdCO1FBQ3JCLFNBQVM7UUFDVDtRQUNBO01BQ0YsQ0FBQztJQUNIO0VBQ0Y7Ozs7O0VBTUE7SUFDRSxLQUFLO0lBQ0wsUUFBUTtJQUNSLFVBQVUsQ0FBQyxRQUFhO0FBQ3RCLFlBQU0sRUFBRSxRQUFRLEtBQUssSUFBSSxJQUFJO0FBQzdCLGNBQVEsSUFBSSwwQ0FBaUIsTUFBTSxhQUFRLElBQUksRUFBRTtBQUVqRCxZQUFNLFVBQVUsUUFBUSxLQUFLLFdBQVcsS0FBSyxVQUFVLEtBQUssSUFBSTtBQUNoRSxhQUFPLGdCQUFnQjtRQUNyQixVQUFVO1FBQ1YsU0FBUyxVQUFVLDZCQUFTO01BQzlCLENBQUM7SUFDSDtFQUNGOzs7Ozs7RUFRQTtJQUNFLEtBQUs7SUFDTCxRQUFRO0lBQ1IsVUFBVSxDQUFDLFFBQWE7QUFDdEIsWUFBTSxFQUFFLE9BQU8sS0FBSyxJQUFJLElBQUk7QUFDNUIsY0FBUSxJQUFJLDBDQUFpQixLQUFLLHlCQUFVLElBQUksRUFBRTtBQUVsRCxhQUFPLGdCQUFnQjtRQUNyQixTQUFTO1FBQ1Q7TUFDRixDQUFDO0lBQ0g7RUFDRjs7Ozs7RUFNQTtJQUNFLEtBQUs7SUFDTCxRQUFRO0lBQ1IsVUFBVSxDQUFDLFFBQWE7QUFDdEIsWUFBTSxFQUFFLE9BQU8sS0FBSyxJQUFJLElBQUk7QUFDNUIsY0FBUSxJQUFJLG9DQUFnQixLQUFLLHlCQUFVLElBQUksRUFBRTtBQUNqRCxhQUFPLGdCQUFnQjtRQUNyQixTQUFTO1FBQ1Q7TUFDRixDQUFDO0lBQ0g7RUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogWyJjYXRlZ29yaWVzIiwgImNhcnRJdGVtcyJdCn0K
