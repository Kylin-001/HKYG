package com.heikeji.system.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 日志工具类
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public class LogUtils {

    /**
     * 获取日志记录器
     *
     * @param clazz 类
     * @return 日志记录器
     */
    public static Logger getLogger(Class<?> clazz) {
        return LoggerFactory.getLogger(clazz);
    }

    /**
     * 获取日志记录器
     *
     * @param name 名称
     * @return 日志记录器
     */
    public static Logger getLogger(String name) {
        return LoggerFactory.getLogger(name);
    }

    /**
     * 记录debug级别日志
     *
     * @param logger 日志记录器
     * @param message 消息
     */
    public static void debug(Logger logger, String message) {
        if (logger.isDebugEnabled()) {
            logger.debug(message);
        }
    }

    /**
     * 记录debug级别日志
     *
     * @param logger 日志记录器
     * @param message 消息
     * @param args 参数
     */
    public static void debug(Logger logger, String message, Object... args) {
        if (logger.isDebugEnabled()) {
            logger.debug(message, args);
        }
    }

    /**
     * 记录info级别日志
     *
     * @param logger 日志记录器
     * @param message 消息
     */
    public static void info(Logger logger, String message) {
        if (logger.isInfoEnabled()) {
            logger.info(message);
        }
    }

    /**
     * 记录info级别日志
     *
     * @param logger 日志记录器
     * @param message 消息
     * @param args 参数
     */
    public static void info(Logger logger, String message, Object... args) {
        if (logger.isInfoEnabled()) {
            logger.info(message, args);
        }
    }

    /**
     * 记录warn级别日志
     *
     * @param logger 日志记录器
     * @param message 消息
     */
    public static void warn(Logger logger, String message) {
        logger.warn(message);
    }

    /**
     * 记录warn级别日志
     *
     * @param logger 日志记录器
     * @param message 消息
     * @param args 参数
     */
    public static void warn(Logger logger, String message, Object... args) {
        logger.warn(message, args);
    }

    /**
     * 记录error级别日志
     *
     * @param logger 日志记录器
     * @param message 消息
     */
    public static void error(Logger logger, String message) {
        logger.error(message);
    }

    /**
     * 记录error级别日志
     *
     * @param logger 日志记录器
     * @param message 消息
     * @param args 参数
     */
    public static void error(Logger logger, String message, Object... args) {
        logger.error(message, args);
    }

    /**
     * 记录error级别日志
     *
     * @param logger 日志记录器
     * @param message 消息
     * @param throwable 异常
     */
    public static void error(Logger logger, String message, Throwable throwable) {
        logger.error(message, throwable);
    }
}
