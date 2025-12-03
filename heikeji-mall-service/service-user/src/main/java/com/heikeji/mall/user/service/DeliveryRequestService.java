package com.heikeji.mall.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.user.dto.DeliveryRequestDTO;
import com.heikeji.mall.user.entity.DeliveryRequest;

/**
 * 配送请求服务接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
public interface DeliveryRequestService extends IService<DeliveryRequest> {
    
    /**
     * 创建配送请求
     *
     * @param deliveryRequest 配送请求信息
     * @return 是否创建成功
     */
    boolean createDeliveryRequest(DeliveryRequest deliveryRequest);
    
    /**
     * 创建配送请求
     *
     * @param deliveryRequestDTO 配送请求信息
     * @return 是否创建成功
     */
    boolean create(DeliveryRequestDTO deliveryRequestDTO);
    
    /**
     * 更新配送请求状态
     *
     * @param requestId 请求ID
     * @param status 新状态
     * @return 是否更新成功
     */
    boolean updateDeliveryStatus(Long requestId, Integer status);
    
    /**
     * 更新配送请求状态
     *
     * @param id 请求ID
     * @param status 新状态
     * @return 是否更新成功
     */
    boolean updateStatus(Long id, Integer status);
    
    /**
     * 查询用户的配送请求列表
     *
     * @param userId 用户ID
     * @return 配送请求列表
     */
    java.util.List<DeliveryRequest> getUserDeliveryRequests(Long userId);
    
    /**
     * 根据用户ID获取配送请求列表
     *
     * @param userId 用户ID
     * @return 配送请求列表
     */
    java.util.List<DeliveryRequest> getByUserId(Long userId);
    
    /**
     * 根据配送员ID获取配送请求列表
     *
     * @param deliveryPersonId 配送员ID
     * @return 配送请求列表
     */
    java.util.List<DeliveryRequest> getByDeliveryPersonId(Long deliveryPersonId);
    
    /**
     * 分配配送员
     *
     * @param id 配送请求ID
     * @param deliveryPersonId 配送员ID
     * @return 是否分配成功
     */
    boolean assignDeliveryPerson(Long id, Long deliveryPersonId);
    
    /**
     * 删除配送请求
     *
     * @param id 配送请求ID
     * @return 是否删除成功
     */
    boolean delete(Long id);
}
