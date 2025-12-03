package com.heikeji.mall.order.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis Plus閰嶇疆绫? */
@Configuration
@MapperScan("com.heikeji.mall.order.mapper")
public class MyBatisPlusConfig {

    /**
     * 鍒嗛〉鎻掍欢閰嶇疆
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        PaginationInnerInterceptor paginationInterceptor = new PaginationInnerInterceptor();
        // 璁剧疆璇锋眰鐨勯〉闈㈠ぇ浜庢渶澶ч〉鍚庢搷浣滐紝true璋冨洖鍒伴椤碉紝false缁х画璇锋眰锛岄粯璁alse
        paginationInterceptor.setOverflow(false);
        // 璁剧疆鏈€澶у崟椤甸檺鍒舵暟閲?        paginationInterceptor.setMaxLimit(100L);
        // 璁剧疆鏁版嵁搴撶被鍨?        paginationInterceptor.setDbType(DbType.MYSQL);
        interceptor.addInnerInterceptor(paginationInterceptor);
        return interceptor;
    }
}
