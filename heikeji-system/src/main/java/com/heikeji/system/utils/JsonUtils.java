package com.heikeji.system.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import java.lang.reflect.Type;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * JSON工具类
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public class JsonUtils {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    static {
        // 日期时间序列化配置
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        
        // LocalDateTime序列化和反序列化
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        // LocalDate序列化和反序列化
        javaTimeModule.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        javaTimeModule.addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        
        // Long类型序列化，解决前端JavaScript处理大整数精度丢失问题
        javaTimeModule.addSerializer(Long.class, ToStringSerializer.instance);
        javaTimeModule.addSerializer(Long.TYPE, ToStringSerializer.instance);
        javaTimeModule.addSerializer(BigInteger.class, ToStringSerializer.instance);
        
        OBJECT_MAPPER.registerModule(javaTimeModule);
        
        // 忽略未知属性
        OBJECT_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        // 禁用日期序列化为时间戳
        OBJECT_MAPPER.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        
        // 美化输出
        OBJECT_MAPPER.configure(SerializationFeature.INDENT_OUTPUT, false);
    }

    /**
     * 将对象转换为JSON字符串
     *
     * @param object 对象
     * @return JSON字符串
     */
    public static String toJson(Object object) {
        if (object == null) {
            return null;
        }
        try {
            return OBJECT_MAPPER.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            LogUtils.error(LogUtils.getLogger(JsonUtils.class), "JSON序列化失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 将对象转换为格式化的JSON字符串
     *
     * @param object 对象
     * @return 格式化的JSON字符串
     */
    public static String toPrettyJson(Object object) {
        if (object == null) {
            return null;
        }
        try {
            return OBJECT_MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(object);
        } catch (JsonProcessingException e) {
            LogUtils.error(LogUtils.getLogger(JsonUtils.class), "JSON序列化失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 将JSON字符串转换对象
     *
     * @param json  JSON字符串
     * @param clazz 目标类
     * @param <T> 泛型参数
     * @return 转换后的对象
     */
    public static <T> T parseObject(String json, Class<T> clazz) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return OBJECT_MAPPER.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            LogUtils.error(LogUtils.getLogger(JsonUtils.class), "JSON反序列化失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 将JSON字符串转换对象（支持复杂泛型类型）
     *
     * @param json JSON字符串
     * @param type 类型
     * @param <T> 泛型参数
     * @return 转换后的对象
     */
    public static <T> T parseObject(String json, Type type) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return OBJECT_MAPPER.readValue(json, OBJECT_MAPPER.getTypeFactory().constructType(type));
        } catch (JsonProcessingException e) {
            LogUtils.error(LogUtils.getLogger(JsonUtils.class), "JSON反序列化失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 将JSON字符串转换为List
     *
     * @param json  JSON字符串
     * @param clazz 元素类
     * @param <T> 泛型参数
     * @return List对象
     */
    public static <T> List<T> parseArray(String json, Class<T> clazz) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return OBJECT_MAPPER.readValue(json, OBJECT_MAPPER.getTypeFactory().constructCollectionType(List.class, clazz));
        } catch (JsonProcessingException e) {
            LogUtils.error(LogUtils.getLogger(JsonUtils.class), "JSON反序列化失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 将JSON字符串转换为Map
     *
     * @param json JSON字符串
     * @return Map对象
     */
    public static Map<String, Object> parseMap(String json) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return OBJECT_MAPPER.readValue(json, OBJECT_MAPPER.getTypeFactory().constructMapType(Map.class, String.class, Object.class));
        } catch (JsonProcessingException e) {
            LogUtils.error(LogUtils.getLogger(JsonUtils.class), "JSON反序列化失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 将对象转换为Map
     *
     * @param object 对象
     * @return Map对象
     */
    public static Map<String, Object> toMap(Object object) {
        if (object == null) {
            return null;
        }
        try {
            return OBJECT_MAPPER.convertValue(object, Map.class);
        } catch (Exception e) {
            LogUtils.error(LogUtils.getLogger(JsonUtils.class), "对象转换为Map失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 检查JSON字符串是否有效
     *
     * @param json JSON字符串
     * @return 是否有效
     */
    public static boolean isValid(String json) {
        if (json == null || json.isEmpty()) {
            return false;
        }
        try {
            OBJECT_MAPPER.readTree(json);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
