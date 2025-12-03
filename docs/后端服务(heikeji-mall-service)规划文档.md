# 黑科易购后端服务(heikeji-mall-service)规划文档

## 1. 后端服务概述

黑科易购后端服务是为黑龙江科技大学定制的校园综合服务平台的核心业务逻辑层，采用微服务架构设计。本规划旨在通过技术栈升级和架构优化，提升系统性能、可扩展性和安全性，同时实现符合黑科大特色的校园服务功能。

## 2. 技术栈升级

### 2.1 核心技术升级

| 技术 | 旧版本 | 新版本 | 升级理由 |
|------|--------|--------|----------|
| Java | 1.8 | 17 | 长期支持版本，性能提升，新特性支持 |
| Spring Boot | 2.7.14 | 3.3.x | 支持Java 17，性能优化，新特性 |
| Spring Cloud | 2021.x | 2023.x | 微服务生态更新，支持Spring Boot 3.x |
| MyBatis Plus | 3.5.5 | 3.5.6+ | 兼容性更新，性能优化 |
| MySQL | 8.0+ | 8.3.x | 性能提升，新特性支持 |
| Redis | 5.0+ | 7.2.x | 性能提升，内存优化，新数据结构 |
| Nacos | 2.0+ | 2.4.x | 服务发现和配置管理增强 |
| JWT | 0.12.x | 0.12.5+ | 安全性更新，新特性支持 |

### 2.2 新增技术栈

- **SpringDoc OpenAPI 2.0+**: 替代Swagger 2，支持Spring Boot 3.x
- **Resilience4j**: 替代Hystrix，提供断路器、限流器等容错机制
- **Quartz 2.3.x**: 定时任务调度
- **Elasticsearch 8.x**: 全文搜索，日志分析
- **MinIO**: 对象存储，用于存储图片、视频等静态资源
- **SkyWalking/Apache Pinpoint**: 分布式追踪和性能监控
- **Prometheus + Grafana**: 监控和告警
- **Lombok 1.18.x**: 减少样板代码
- **MapStruct**: 对象映射，减少手动转换代码

## 3. 微服务架构优化

### 3.1 服务模块调整

```
heikeji-mall-service/
├── service-user/           # 用户服务
│   ├── src/main/java/com/heikeji/user/
│   │   ├── api/           # 接口层
│   │   ├── service/       # 业务逻辑层
│   │   ├── mapper/        # 数据访问层
│   │   ├── entity/        # 实体类
│   │   ├── dto/           # 数据传输对象
│   │   ├── campus/        # 校园用户特色功能
│   │   └── config/        # 配置类
├── service-product/        # 商品服务
│   ├── src/main/java/com/heikeji/product/
│   │   ├── api/
│   │   ├── service/
│   │   ├── mapper/
│   │   ├── entity/
│   │   ├── dto/
│   │   └── category/      # 校园特色商品分类
├── service-order/          # 订单服务
│   ├── src/main/java/com/heikeji/order/
│   │   ├── api/
│   │   ├── service/
│   │   ├── mapper/
│   │   ├── entity/
│   │   └── dto/
├── service-delivery/       # 配送服务
│   ├── src/main/java/com/heikeji/delivery/
│   │   ├── api/
│   │   ├── service/
│   │   ├── mapper/
│   │   ├── entity/
│   │   ├── dto/
│   │   └── campus/        # 校园快递代取服务
├── service-takeout/        # 外卖服务
│   ├── src/main/java/com/heikeji/takeout/
│   │   ├── api/
│   │   ├── service/
│   │   ├── mapper/
│   │   ├── entity/
│   │   ├── dto/
│   │   └── canteen/       # 食堂外卖功能
├── service-payment/        # 支付服务
│   ├── src/main/java/com/heikeji/payment/
│   │   ├── api/
│   │   ├── service/
│   │   ├── mapper/
│   │   ├── entity/
│   │   └── dto/
├── service-campus/         # 校园信息服务
│   ├── src/main/java/com/heikeji/campus/
│   │   ├── api/
│   │   ├── service/
│   │   ├── mapper/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── map/           # 校园地图服务
│   │   └── notice/        # 校园公告服务
├── service-community/      # 新增校园社区服务
│   ├── src/main/java/com/heikeji/community/
│   │   ├── api/
│   │   ├── service/
│   │   ├── mapper/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── secondhand/    # 二手市场
│   │   ├── lostfound/     # 失物招领
│   │   └── activity/      # 校园活动
└── service-search/         # 新增搜索服务
    ├── src/main/java/com/heikeji/search/
        ├── api/
        ├── service/
        └── config/        # Elasticsearch配置
```

### 3.2 服务间通信优化

- **同步通信**: REST API + OpenFeign
- **异步通信**: Spring Cloud Stream + Kafka
- **事件驱动**: 采用事件驱动架构处理跨服务业务流程
- **服务网格**: 考虑引入Istio管理服务通信

### 3.3 服务治理增强

- **服务注册与发现**: 基于Nacos的服务注册与发现
- **配置中心**: Nacos Config集中管理配置
- **熔断降级**: 使用Resilience4j实现熔断、限流、重试机制
- **网关路由**: Spring Cloud Gateway动态路由和过滤器
- **负载均衡**: Spring Cloud LoadBalancer实现智能负载均衡

## 4. 核心服务模块详细设计

### 4.1 用户服务(service-user)增强

#### 4.1.1 校园用户体系

```java
@Entity
@Data
@TableName("campus_user")
public class CampusUser extends BaseEntity {
    private Long id;
    private String username;          // 用户名
    private String password;          // 密码(加密)
    private String studentId;         // 学号
    private String college;           // 学院
    private String major;             // 专业
    private String className;         // 班级
    private String dormitory;         // 宿舍
    private Integer userType;         // 用户类型(1:学生,2:教职工,3:商家,4:配送员)
    private String phone;             // 手机号
    private String avatar;            // 头像
    private Integer status;           // 状态(0:禁用,1:启用)
    private Date lastLoginTime;       // 最后登录时间
    // 关联字段
    private List<CampusAddress> addresses; // 校园地址列表
}
```

#### 4.1.2 校园统一身份认证集成

```java
@Service
public class CampusAuthService {
    @Value("${campus.auth.url}")
    private String authUrl;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private UserService userService;
    
    /**
     * 校园统一身份认证登录
     */
    public LoginResult campusAuthLogin(String username, String password) {
        // 调用校园统一身份认证接口
        CampusAuthRequest request = new CampusAuthRequest(username, password);
        CampusAuthResponse response = restTemplate.postForObject(authUrl + "/login", request, CampusAuthResponse.class);
        
        if (response != null && response.isSuccess()) {
            // 认证成功，获取用户信息
            CampusUserInfo campusUserInfo = response.getUserInfo();
            // 同步或创建校园用户
            return userService.syncCampusUser(campusUserInfo);
        }
        throw new AuthException("校园认证失败");
    }
}
```

#### 4.1.3 校园地址管理

```java
@Service
public class CampusAddressService {
    @Autowired
    private CampusAddressMapper addressMapper;
    
    /**
     * 保存校园地址
     */
    public CampusAddress saveCampusAddress(CampusAddress address) {
        // 验证校园地址有效性
        validateCampusAddress(address);
        addressMapper.insert(address);
        return address;
    }
    
    /**
     * 获取用户的校园地址列表
     */
    public List<CampusAddress> getUserCampusAddresses(Long userId) {
        return addressMapper.selectByUserId(userId);
    }
}
```

### 4.2 外卖服务(service-takeout)优化

#### 4.2.1 食堂管理

```java
@Entity
@Data
@TableName("campus_canteen")
public class CampusCanteen extends BaseEntity {
    private Long id;
    private String name;              // 食堂名称
    private String location;          // 位置
    private String description;       // 描述
    private String openingHours;      // 营业时间
    private String contactPhone;      // 联系电话
    private String imageUrl;          // 图片
    private Double rating;            // 评分
    private Integer status;           // 状态(0:关闭,1:营业中)
    // 关联字段
    private List<CanteenStall> stalls; // 档口列表
}
```

#### 4.2.2 智能点餐服务

```java
@Service
public class SmartOrderService {
    @Autowired
    private CanteenService canteenService;
    
    @Autowired
    private OrderService orderService;
    
    /**
     * 智能推荐用餐时间
     */
    public DiningTimeRecommendation recommendDiningTime(Long canteenId) {
        // 基于历史数据和当前时间分析用餐高峰
        List<OrderStatistics> statistics = orderService.getOrderStatisticsByCanteen(canteenId);
        // 计算推荐用餐时间
        return calculateOptimalDiningTime(statistics);
    }
    
    /**
     * 保温配送设置
     */
    public void setInsulatedDelivery(Order order, boolean insulated) {
        if (insulated) {
            // 添加保温配送费用
            order.setDeliveryFee(order.getDeliveryFee() + 2.0);
            order.setSpecialRequirements(order.getSpecialRequirements() + "[需要保温配送]");
        }
    }
}
```

### 4.3 配送服务(service-delivery)增强

#### 4.3.1 快递代取服务

```java
@Entity
@Data
@TableName("express_order")
public class ExpressOrder extends BaseEntity {
    private Long id;
    private Long userId;              // 用户ID
    private Long deliverymanId;       // 配送员ID
    private String expressCompany;    // 快递公司
    private String trackingNumber;    // 快递单号
    private String pickupLocation;    // 取件地点
    private String deliveryLocation;  // 送达地点
    private Double fee;               // 费用
    private Integer status;           // 状态(1:待接单,2:已接单,3:已取件,4:已送达,5:已完成,6:已取消)
    private String notes;             // 备注
    private Date pickupTime;          // 取件时间
    private Date deliveryTime;        // 送达时间
}
```

```java
@Service
public class ExpressDeliveryService {
    @Autowired
    private ExpressOrderMapper orderMapper;
    
    @Autowired
    private RedisTemplate redisTemplate;
    
    /**
     * 创建快递代取订单
     */
    public ExpressOrder createExpressOrder(ExpressOrderDTO orderDTO) {
        ExpressOrder order = new ExpressOrder();
        // 设置订单信息
        BeanUtils.copyProperties(orderDTO, order);
        order.setStatus(ExpressOrderStatus.PENDING);
        order.setCreateTime(new Date());
        
        orderMapper.insert(order);
        
        // 发布订单创建事件，通知附近配送员
        redisTemplate.convertAndSend("express:order:created", JSON.toJSONString(order));
        
        return order;
    }
    
    /**
     * 智能匹配配送员
     */
    public List<Deliveryman> matchDeliverymen(Double latitude, Double longitude) {
        // 获取附近500米范围内的配送员
        String redisKey = String.format("deliveryman:nearby:%s:%s", latitude, longitude);
        return redisTemplate.opsForGeo()
            .radius("deliveryman:locations", new Circle(new Point(longitude, latitude), new Distance(500, Metrics.METERS)))
            .getContent().stream()
            .map(member -> JSON.parseObject(member.getName(), Deliveryman.class))
            .collect(Collectors.toList());
    }
}
```

### 4.4 校园服务(service-campus)全新设计

#### 4.4.1 校园地图服务

```java
@Service
public class CampusMapService {
    @Autowired
    private CampusLocationMapper locationMapper;
    
    /**
     * 获取校园地图数据
     */
    public CampusMapData getCampusMapData() {
        CampusMapData mapData = new CampusMapData();
        // 获取校园建筑
        mapData.setBuildings(locationMapper.selectBuildings());
        // 获取校园道路
        mapData.setRoads(locationMapper.selectRoads());
        // 获取服务点
        mapData.setServicePoints(locationMapper.selectServicePoints());
        return mapData;
    }
    
    /**
     * 路径规划
     */
    public PathPlanResult planRoute(Double startLat, Double startLng, Double endLat, Double endLng) {
        // 基于校园地图数据进行路径规划
        return routePlanner.calculateRoute(startLat, startLng, endLat, endLng);
    }
}
```

#### 4.4.2 校园公告服务

```java
@Service
public class CampusNoticeService {
    @Autowired
    private CampusNoticeMapper noticeMapper;
    
    @Autowired
    private ElasticsearchOperations esOperations;
    
    /**
     * 发布校园公告
     */
    @Transactional
    public CampusNotice publishNotice(CampusNotice notice) {
        notice.setPublishTime(new Date());
        notice.setStatus(NoticeStatus.PUBLISHED);
        noticeMapper.insert(notice);
        
        // 同步到Elasticsearch用于搜索
        esOperations.save(convertToEsEntity(notice));
        
        // 推送通知给用户
        pushNoticeNotification(notice);
        
        return notice;
    }
    
    /**
     * 搜索校园公告
     */
    public Page<CampusNotice> searchNotices(String keyword, Integer page, Integer size) {
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery();
        if (StringUtils.hasText(keyword)) {
            queryBuilder.must(QueryBuilders.multiMatchQuery(keyword, "title", "content"));
        }
        
        NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(queryBuilder)
            .withSort(SortBuilders.fieldSort("publishTime").order(SortOrder.DESC))
            .withPageable(PageRequest.of(page - 1, size))
            .build();
        
        return esOperations.search(searchQuery, CampusNoticeEs.class)
            .map(this::convertToEntity)
            .map(pageResult -> new PageImpl<>(pageResult.getContent(), pageResult.getPageable(), pageResult.getTotalElements()));
    }
}
```

### 4.5 新增社区服务(service-community)

#### 4.5.1 二手市场服务

```java
@Service
public class SecondhandMarketService {
    @Autowired
    private SecondhandItemMapper itemMapper;
    
    @Autowired
    private RedisTemplate redisTemplate;
    
    /**
     * 发布二手商品
     */
    public SecondhandItem publishItem(SecondhandItem item) {
        item.setPublishTime(new Date());
        item.setStatus(ItemStatus.ACTIVE);
        item.setViewCount(0);
        itemMapper.insert(item);
        
        // 缓存热门商品
        updateHotItemsCache();
        
        return item;
    }
    
    /**
     * 获取推荐商品
     */
    public List<SecondhandItem> getRecommendedItems(Long userId) {
        // 基于用户兴趣和浏览历史推荐
        List<String> categories = getUserInterestedCategories(userId);
        return itemMapper.selectRecommendedItems(categories, 10);
    }
}
```

#### 4.5.2 失物招领服务

```java
@Service
public class LostFoundService {
    @Autowired
    private LostFoundMapper lostFoundMapper;
    
    /**
     * 发布失物招领信息
     */
    public LostFoundItem publishItem(LostFoundItem item) {
        item.setPublishTime(new Date());
        item.setStatus(ItemStatus.ACTIVE);
        lostFoundMapper.insert(item);
        
        // 尝试匹配可能的失主/拾主
        matchRelatedItems(item);
        
        return item;
    }
    
    /**
     * 智能匹配相关信息
     */
    private void matchRelatedItems(LostFoundItem newItem) {
        List<LostFoundItem> relatedItems = lostFoundMapper.selectRelatedItems(
            newItem.getType() == ItemType.LOST ? ItemType.FOUND : ItemType.LOST,
            newItem.getLocation(),
            newItem.getCategory());
        
        // 发送匹配通知
        for (LostFoundItem item : relatedItems) {
            sendMatchNotification(newItem, item);
        }
    }
}
```

## 5. 数据库与数据访问层优化

### 5.1 数据源配置优化

```java
@Configuration
@EnableTransactionManagement
public class DataSourceConfig {
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        // 连接池优化配置
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        config.setIdleTimeout(30000);
        config.setConnectionTimeout(30000);
        config.setMaxLifetime(1800000);
        return new HikariDataSource(config);
    }
    
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 分页插件
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        // 乐观锁插件
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        return interceptor;
    }
}
```

### 5.2 数据访问层设计模式

- **Repository模式**: 统一的数据访问接口
- **QueryDSL/MyBatis Plus**: 简化查询构建
- **缓存策略**: 二级缓存 + Redis分布式缓存
- **读写分离**: 主从复制，读操作走从库

## 6. 性能优化方案

### 6.1 缓存策略

```java
@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .withCacheConfiguration("userCache", 
                RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(1)))
            .withCacheConfiguration("productCache", 
                RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(30)))
            .build();
    }
}
```

### 6.2 异步处理

```java
@Configuration
@EnableAsync
public class AsyncConfig {
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("AsyncTask-");
        executor.initialize();
        return executor;
    }
}

@Service
public class AsyncService {
    @Async("taskExecutor")
    public CompletableFuture<Void> sendNotification(String userId, String message) {
        // 异步发送通知
        notificationService.send(userId, message);
        return CompletableFuture.completedFuture(null);
    }
}
```

### 6.3 数据库优化

- **索引优化**: 合理创建和使用索引
- **查询优化**: 避免全表扫描，优化JOIN查询
- **批量操作**: 使用批量插入和更新
- **分库分表**: 考虑按业务模块分库，大表分表
- **定时清理**: 定期清理过期数据

## 7. 安全加固方案

### 7.1 认证授权增强

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(corsFilter(), JwtAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
```

### 7.2 接口安全

- **请求频率限制**: 基于Redis的限流机制
- **参数验证**: 使用Jakarta Bean Validation
- **防SQL注入**: 使用参数化查询
- **XSS防护**: 输入输出过滤
- **敏感信息脱敏**: 日志和响应中的敏感信息处理

### 7.3 数据安全

- **数据加密**: 敏感数据加密存储
- **传输安全**: HTTPS加密传输
- **备份恢复**: 定期数据备份和恢复演练
- **审计日志**: 关键操作日志记录

## 8. 与校园系统集成

### 8.1 统一身份认证集成

- **CAS协议**: 支持CAS单点登录
- **OAuth2/OpenID Connect**: 支持现代认证协议
- **API对接**: 与校园现有认证系统对接

### 8.2 数据同步方案

```java
@Service
@EnableScheduling
public class CampusDataSyncService {
    @Autowired
    private CampusApiClient campusApiClient;
    
    @Autowired
    private UserService userService;
    
    /**
     * 定时同步校园用户数据
     */
    @Scheduled(cron = "0 0 1 * * ?")  // 每天凌晨1点执行
    public void syncCampusUserData() {
        try {
            // 调用校园API获取用户数据
            PageResult<CampusUserData> userData = campusApiClient.getUsers(1, 1000);
            // 同步数据
            userService.syncUserData(userData.getData());
            
            // 处理分页
            for (int i = 2; i <= userData.getTotalPages(); i++) {
                PageResult<CampusUserData> nextPage = campusApiClient.getUsers(i, 1000);
                userService.syncUserData(nextPage.getData());
            }
        } catch (Exception e) {
            log.error("同步校园用户数据失败", e);
            // 发送告警通知
            alertService.sendAlert("数据同步失败", "校园用户数据同步失败，请检查");
        }
    }
}
```

## 9. 监控与运维

### 9.1 监控系统

- **应用监控**: Spring Boot Actuator + Prometheus + Grafana
- **日志管理**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **分布式追踪**: SkyWalking
- **健康检查**: 自定义健康检查端点

### 9.2 告警机制

- **阈值告警**: 基于指标阈值的告警
- **异常告警**: 异常日志和错误监控
- **自动恢复**: 部分故障的自动恢复机制

### 9.3 运维自动化

- **CI/CD**: Jenkins Pipeline自动构建部署
- **容器化**: Docker + Kubernetes编排
- **配置管理**: Ansible自动化配置
- **灰度发布**: 支持灰度发布和回滚

## 10. 实施计划

### 10.1 第一阶段: 基础设施升级 (3周)
- 升级Java和Spring Boot版本
- 重构公共模块
- 配置中心和服务发现优化

### 10.2 第二阶段: 核心服务改造 (6周)
- 用户服务增强
- 商品和订单服务优化
- 支付服务升级

### 10.3 第三阶段: 校园特色服务开发 (8周)
- 食堂外卖功能开发
- 快递代取服务实现
- 校园服务模块开发
- 社区服务模块开发

### 10.4 第四阶段: 性能优化和安全加固 (4周)
- 缓存策略优化
- 数据库性能调优
- 安全加固和漏洞修复

### 10.5 第五阶段: 集成测试和上线 (3周)
- 系统集成测试
- 性能测试
- 灰度发布
- 正式上线

## 11. 风险评估

### 11.1 技术风险
- **技术栈升级兼容性**: 确保Java 17和Spring Boot 3.x的兼容性
- **微服务复杂性**: 服务间依赖和通信管理
- **性能挑战**: 高峰期并发处理能力

### 11.2 集成风险
- **校园系统对接**: 与校园现有系统集成的复杂性
- **数据同步**: 数据一致性和实时性保障

### 11.3 应对策略
- **分阶段实施**: 逐步升级和改造
- **充分测试**: 单元测试、集成测试、性能测试
- **回滚机制**: 完善的备份和回滚方案
- **监控预警**: 建立完善的监控和告警体系

---

本规划文档详细描述了黑科易购后端服务的技术升级、架构优化和功能增强方案，旨在打造一个高性能、可扩展、安全可靠的校园服务平台后端系统。通过合理的微服务设计和校园特色功能实现，为黑龙江科技大学师生提供优质的校园服务体验。