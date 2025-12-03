package com.heikeji.job.feign.fallback;

import com.heikeji.job.feign.ProductFeignClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 商品服务Feign客户端降级类
 * 用于服务熔断时提供降级处理
 * 
 * @author heikeji
 */
@Component
@Slf4j
public class ProductFeignClientFallback implements ProductFeignClient {

    /**
     * 检查商品库存预警 - 降级实现
     * 
     * @param threshold 库存预警阈值
     * @return 0
     */
    @Override
    public Integer checkStockWarning(Integer threshold) {
        log.error("调用商品服务检查库存预警失败，执行降级处理");
        return 0;
    }

}
