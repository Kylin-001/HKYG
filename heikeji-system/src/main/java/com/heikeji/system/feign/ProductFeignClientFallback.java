package com.heikeji.system.feign;

import com.heikeji.common.core.domain.R;
import org.springframework.stereotype.Component;

/**
 * 商品服务Feign客户端降级实现
 */
@Component
public class ProductFeignClientFallback implements ProductFeignClient {

    @Override
    public R<Boolean> checkProductExists(Long productId) {
        return R.success(false);
    }

    @Override
    public R<Integer> getProductStock(Long productId) {
        return R.success(0);
    }
    
    @Override
    public R<Integer> getProductCount() {
        return R.success(0);
    }
}
