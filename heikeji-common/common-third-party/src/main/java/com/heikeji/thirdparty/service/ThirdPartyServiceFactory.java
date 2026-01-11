package com.heikeji.thirdparty.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 第三方服务工厂，用于管理和提供不同类型的第三方服务实例
 */
public class ThirdPartyServiceFactory {
    
    // 存储服务实例的映射，key为服务类型，value为服务实例
    private static final Map<String, ThirdPartyService> serviceMap = new ConcurrentHashMap<>();
    
    /**
     * 注册第三方服务
     * @param service 第三方服务实例
     */
    public static void registerService(ThirdPartyService service) {
        if (service != null) {
            String serviceType = service.getServiceType();
            serviceMap.put(serviceType, service);
        }
    }
    
    /**
     * 获取第三方服务实例
     * @param serviceType 服务类型
     * @return 第三方服务实例，如果不存在返回null
     */
    public static ThirdPartyService getService(String serviceType) {
        return serviceMap.get(serviceType);
    }
    
    /**
     * 获取所有已注册的第三方服务类型
     * @return 已注册的服务类型列表
     */
    public static String[] getAllServiceTypes() {
        return serviceMap.keySet().toArray(new String[0]);
    }
    
    /**
     * 检查服务是否已注册
     * @param serviceType 服务类型
     * @return 是否已注册
     */
    public static boolean isServiceRegistered(String serviceType) {
        return serviceMap.containsKey(serviceType);
    }
    
    /**
     * 初始化所有已注册的服务
     * @param configMap 服务配置映射，key为服务类型，value为配置信息
     */
    public static void initAllServices(Map<String, Object> configMap) {
        for (Map.Entry<String, ThirdPartyService> entry : serviceMap.entrySet()) {
            String serviceType = entry.getKey();
            ThirdPartyService service = entry.getValue();
            Object config = configMap.get(serviceType);
            service.init(config);
        }
    }
}
