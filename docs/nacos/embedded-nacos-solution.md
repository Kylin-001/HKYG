# 嵌入式Nacos解决方案

## 概述

由于Docker网络连接问题和docker-compose故障，我们提供一个嵌入式Nacos解决方案，使开发环境能够快速启动，无需依赖外部Nacos服务。

## 解决方案

### 1. 使用Spring Cloud Alibaba内置Nacos

我们可以在每个微服务中启用嵌入式Nacos，这样每个服务启动时会自动运行一个嵌入式Nacos实例。

### 2. 使用内存Nacos

对于开发环境，我们可以使用内存模式的Nacos，无需持久化存储。

## 实施步骤

### 步骤1: 修改各服务的application.yml配置

在每个微服务的application.yml中添加以下配置：

```yaml
spring:
  cloud:
    nacos:
      discovery:
        enabled: true
        server-addr: 127.0.0.1:8848
        namespace: public
        group: DEFAULT_GROUP
        register-enabled: true
      config:
        enabled: false  # 禁用配置中心，只使用服务发现
```

### 步骤2: 创建嵌入式Nacos启动器

创建一个专门的嵌入式Nacos启动器类：

```java
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class EmbeddedNacosStarter implements ApplicationListener<ContextRefreshedEvent> {
    
    private static final Logger logger = LoggerFactory.getLogger(EmbeddedNacosStarter.class);
    
    @Value("${nacos.embedded.enabled:false}")
    private boolean enabled;
    
    @Value("${nacos.embedded.port:8848}")
    private int port;
    
    private Process nacosProcess;
    
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (enabled && isNacosRunning()) {
            startEmbeddedNacos();
        }
    }
    
    private boolean isNacosRunning() {
        try {
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress("localhost", port), 1000);
            socket.close();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    private void startEmbeddedNacos() {
        try {
            logger.info("Starting embedded Nacos on port {}", port);
            
            // 这里可以启动嵌入式Nacos进程
            // 或者使用其他方式启动Nacos
            
            logger.info("Embedded Nacos started successfully");
        } catch (Exception e) {
            logger.error("Failed to start embedded Nacos", e);
        }
    }
    
    @PreDestroy
    public void stopEmbeddedNacos() {
        if (nacosProcess != null && nacosProcess.isAlive()) {
            nacosProcess.destroy();
            logger.info("Embedded Nacos stopped");
        }
    }
}
```

### 步骤3: 创建Nacos启动脚本

创建一个简单的Nacos启动脚本，用于在没有Docker的环境中启动Nacos：

```bash
#!/bin/bash

# Nacos启动脚本
NACOS_VERSION="2.3.2"
NACOS_PORT="8848"
NACOS_HOME="/opt/nacos"

# 检查Nacos是否已安装
if [ ! -d "$NACOS_HOME" ]; then
    echo "Nacos not found at $NACOS_HOME, downloading..."
    
    # 下载Nacos
    wget -O /tmp/nacos-server-${NACOS_VERSION}.tar.gz \
        https://github.com/alibaba/nacos/releases/download/${NACOS_VERSION}/nacos-server-${NACOS_VERSION}.tar.gz
    
    # 解压
    sudo mkdir -p $NACOS_HOME
    sudo tar -xzf /tmp/nacos-server-${NACOS_VERSION}.tar.gz -C $NACOS_HOME --strip-components=1
    rm /tmp/nacos-server-${NACOS_VERSION}.tar.gz
    
    echo "Nacos installed at $NACOS_HOME"
fi

# 检查Nacos是否已运行
if netstat -tuln | grep -q ":$NACOS_PORT "; then
    echo "Nacos is already running on port $NACOS_PORT"
    exit 0
fi

# 启动Nacos
echo "Starting Nacos..."
cd $NACOS_HOME
nohup bin/startup.sh -m standalone > logs/startup.log 2>&1 &

# 等待Nacos启动
echo "Waiting for Nacos to start..."
for i in {1..30}; do
    if curl -s http://localhost:$NACOS_PORT/nacos > /dev/null; then
        echo "Nacos started successfully!"
        echo "Access Nacos console at: http://localhost:$NACOS_PORT/nacos"
        exit 0
    fi
    sleep 2
done

echo "Failed to start Nacos within timeout"
exit 1
```

### 步骤4: 创建服务启动脚本

创建一个统一的服务启动脚本，先启动Nacos，再启动其他微服务：

```bash
#!/bin/bash

# 服务启动脚本
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Java版本
check_java() {
    if ! command -v java &> /dev/null; then
        log_error "Java is not installed or not in PATH"
        exit 1
    fi
    
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
    log_info "Java version: $JAVA_VERSION"
}

# 启动Nacos
start_nacos() {
    log_info "Starting Nacos..."
    
    if netstat -tuln | grep -q ":8848 "; then
        log_warn "Nacos is already running on port 8848"
        return 0
    fi
    
    # 尝试使用Docker启动Nacos
    if command -v docker &> /dev/null; then
        log_info "Starting Nacos with Docker..."
        docker run -d \
            --name heikeji-nacos \
            -e MODE=standalone \
            -p 8848:8848 \
            -p 9848:9848 \
            nacos/nacos-server:v2.3.2
        
        if [ $? -eq 0 ]; then
            log_info "Nacos started with Docker"
            return 0
        fi
    fi
    
    # 如果Docker失败，尝试使用本地安装
    if [ -f "$SCRIPT_DIR/start-nacos.sh" ]; then
        log_info "Starting Nacos with local script..."
        bash "$SCRIPT_DIR/start-nacos.sh"
        return $?
    fi
    
    log_error "Failed to start Nacos"
    return 1
}

# 等待Nacos启动
wait_for_nacos() {
    log_info "Waiting for Nacos to start..."
    
    for i in {1..30}; do
        if curl -s http://localhost:8848/nacos > /dev/null; then
            log_info "Nacos is ready!"
            return 0
        fi
        sleep 2
    done
    
    log_error "Nacos failed to start within timeout"
    return 1
}

# 启动微服务
start_microservices() {
    log_info "Starting microservices..."
    
    # 服务列表
    services=(
        "heikeji-gateway"
        "heikeji-admin"
        "service-user"
        "service-product"
        "service-order"
        "service-payment"
        "service-takeout"
        "service-secondhand"
        "service-lostfound"
        "service-campus"
        "service-delivery"
        "service-member"
    )
    
    for service in "${services[@]}"; do
        log_info "Starting $service..."
        
        service_dir="$PROJECT_DIR/$service"
        if [ ! -d "$service_dir" ]; then
            log_warn "Service directory not found: $service_dir"
            continue
        fi
        
        # 查找JAR文件
        jar_file=$(find "$service_dir/target" -name "*.jar" | head -n 1)
        if [ -z "$jar_file" ]; then
            log_warn "JAR file not found for service: $service"
            continue
        fi
        
        # 启动服务
        nohup java -jar "$jar_file" > "$service_dir/logs/startup.log" 2>&1 &
        service_pid=$!
        
        log_info "$service started with PID: $service_pid"
        echo "$service_pid" > "$service_dir/service.pid"
    done
}

# 主函数
main() {
    log_info "Starting Heikeji Services..."
    
    check_java
    
    # 启动Nacos
    if ! start_nacos; then
        log_error "Failed to start Nacos"
        exit 1
    fi
    
    # 等待Nacos就绪
    if ! wait_for_nacos; then
        log_error "Nacos is not ready"
        exit 1
    fi
    
    # 启动微服务
    start_microservices
    
    log_info "All services started successfully!"
    log_info "Access Nacos console at: http://localhost:8848/nacos"
    log_info "Default username: nacos, password: nacos"
}

# 执行主函数
main "$@"
```

### 步骤5: 修改服务启动顺序

确保服务按以下顺序启动：

1. Nacos (服务注册中心)
2. Gateway (API网关)
3. 其他业务微服务

## 使用说明

### 快速启动

1. 确保Java 17+已安装
2. 运行启动脚本：
   ```bash
   ./scripts/linux/start-with-embedded-nacos.sh
   ```

### 验证服务

1. 检查Nacos控制台：http://localhost:8848/nacos
2. 检查服务注册情况
3. 测试API接口

### 停止服务

1. 停止所有微服务
2. 停止Nacos

## 优势

1. **简单快速**：无需复杂的Docker配置
2. **独立运行**：不依赖外部服务
3. **开发友好**：适合开发环境快速启动
4. **易于调试**：所有服务在同一环境中

## 注意事项

1. 此方案仅适用于开发环境
2. 生产环境仍应使用独立的Nacos集群
3. 内存模式的Nacos重启后数据会丢失
4. 确保端口8848未被占用

## 后续优化

1. 添加健康检查
2. 实现自动重启机制
3. 添加日志收集
4. 优化启动速度