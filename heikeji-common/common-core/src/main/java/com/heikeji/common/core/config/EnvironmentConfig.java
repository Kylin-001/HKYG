package com.heikeji.common.core.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;

/**
 * 环境变量配置处理器，用于从.env文件加载环境变量
 */
@Slf4j
public class EnvironmentConfig implements EnvironmentPostProcessor {

    private static final String DOT_ENV_PREFIX = ".env.";
    private static final String DOT_ENV = ".env";
    private static final String PROFILES_ACTIVE = "spring.profiles.active";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        try {
            // 获取启动的环境配置
            String activeProfile = environment.getProperty(PROFILES_ACTIVE, "dev");
            log.info("当前启动环境: {}", activeProfile);

            // 加载环境变量文件
            loadEnvFile(environment, DOT_ENV);  // 加载通用配置
            loadEnvFile(environment, DOT_ENV_PREFIX + activeProfile);  // 加载特定环境配置
        } catch (Exception e) {
            log.error("鍔犺浇鐜鍙橀噺閰嶇疆澶辫触", e);
        }
    }

    /**
     * 鍔犺浇鐜鍙橀噺鏂囦欢
     */
    private void loadEnvFile(ConfigurableEnvironment environment, String fileName) {
        // 灏濊瘯浠庡涓綅缃姞杞?env鏂囦欢
        String[] searchLocations = new String[]{
                "./" + fileName,  // 褰撳墠宸ヤ綔鐩綍
                System.getProperty("user.dir") + File.separator + fileName,  // 鐢ㄦ埛鐩綍
                "/etc/heikeji/" + fileName,  // Linux鏍囧噯閰嶇疆鐩綍
                "C:/heikeji/config/" + fileName  // Windows鏍囧噯閰嶇疆鐩綍
        };

        for (String location : searchLocations) {
            File envFile = new File(location);
            if (envFile.exists() && envFile.isFile()) {
                try {
                    Properties properties = loadPropertiesFromEnvFile(envFile);
                    if (!properties.isEmpty()) {
                        MutablePropertySources propertySources = environment.getPropertySources();
                        propertySources.addFirst(new PropertiesPropertySource(fileName, properties));
                        log.info("宸叉垚鍔熷姞杞界幆澧冨彉閲忛厤缃枃浠? {}", location);
                        return;
                    }
                } catch (Exception e) {
                    log.warn("鍔犺浇鐜鍙橀噺閰嶇疆鏂囦欢澶辫触: {}", location, e);
                }
            }
        }

        log.info("鏈壘鍒扮幆澧冨彉閲忛厤缃枃浠? {}", fileName);
    }

    /**
     * 浠?env鏂囦欢鍔犺浇灞炴€?     */
    private Properties loadPropertiesFromEnvFile(File envFile) throws IOException {
        Properties properties = new Properties();
        
        Files.lines(Paths.get(envFile.getAbsolutePath()))
                .filter(line -> !line.trim().startsWith("#") && line.contains("="))
                .forEach(line -> {
                    try {
                        // 解析键值对，支持注释
                        String actualLine = line;
                        int commentIndex = line.indexOf('#');
                        if (commentIndex > 0) {
                            actualLine = line.substring(0, commentIndex);
                        }
                        
                        int equalsIndex = actualLine.indexOf('=');
                        if (equalsIndex > 0) {
                            String key = actualLine.substring(0, equalsIndex).trim();
                            String value = actualLine.substring(equalsIndex + 1).trim();
                            
                            // 移除引号
                            if ((value.startsWith("\"") && value.endsWith("\"")) || 
                                (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.substring(1, value.length() - 1);
                            }
                            
                            if (StringUtils.hasText(key)) {
                                properties.setProperty(key, value);
                                // 同时设置到系统环境变量，以便其他组件使用
                                System.setProperty(key, value);
                            }
                        }
                    } catch (Exception e) {
                        log.warn("解析环境变量失败: {}", line, e);
                    }
                });
        
        return properties;
    }
}
