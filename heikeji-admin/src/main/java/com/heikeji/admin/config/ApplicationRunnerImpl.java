package com.heikeji.admin.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 应用启动后执行的初始化操作
 */
@Component
public class ApplicationRunnerImpl implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationRunnerImpl.class);

    @Override
    public void run(ApplicationArguments args) throws Exception {
        logger.info("======= Heikeji Admin 应用启动成功 =======");
        logger.info("访问地址: http://localhost:8081/admin");
        logger.info("API接口地址: http://localhost:8081/admin/api");
        logger.info("初始化SQL脚本: src/main/resources/init.sql");
        logger.info("默认管理员账号: admin / 123456");
        logger.info("======================================");
    }
}
