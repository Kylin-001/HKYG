package com.heikeji.mall.user.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import java.util.ArrayList;
import com.heikeji.mall.user.dto.DeliveryRequestDTO;
import com.heikeji.mall.user.entity.DeliveryRequest;
import com.heikeji.mall.user.mapper.DeliveryRequestMapper;
import com.heikeji.mall.user.service.DeliveryRequestService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 配送请求服务实现类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Service
public class DeliveryRequestServiceImpl extends ServiceImpl<DeliveryRequestMapper, DeliveryRequest> implements DeliveryRequestService {

    @Override
    public boolean createDeliveryRequest(DeliveryRequest deliveryRequest) {
        // 设置默认状态为待处理
        deliveryRequest.setStatus(0);
        // 设置创建时间
        deliveryRequest.setCreateTime(LocalDateTime.now());
        deliveryRequest.setUpdateTime(LocalDateTime.now());
        return save(deliveryRequest);
    }

    @Override
    public boolean updateDeliveryStatus(Long requestId, Integer status) {
        // 更新状态和更新时间
        return lambdaUpdate()
                .eq(DeliveryRequest::getId, requestId)
                .set(DeliveryRequest::getStatus, status)
                .set(DeliveryRequest::getUpdateTime, LocalDateTime.now())
                .update();
    }

    @Override
    public List<DeliveryRequest> getUserDeliveryRequests(Long userId) {
        // 查询用户的所有配送请求，按创建时间倒序排列
        return lambdaQuery()
                .eq(DeliveryRequest::getUserId, userId)
                .orderByDesc(DeliveryRequest::getCreateTime)
                .list();
    }

    @Override
    public boolean create(DeliveryRequestDTO deliveryRequestDTO) {
        DeliveryRequest deliveryRequest = new DeliveryRequest();
        BeanUtils.copyProperties(deliveryRequestDTO, deliveryRequest);
        // 设置默认状态为待处理
        deliveryRequest.setStatus(0);
        // 设置创建时间
        deliveryRequest.setCreateTime(LocalDateTime.now());
        deliveryRequest.setUpdateTime(LocalDateTime.now());
        return save(deliveryRequest);
    }

    @Override
    public boolean updateStatus(Long id, Integer status) {
        // 更新状态和更新时间
        return lambdaUpdate()
                .eq(DeliveryRequest::getId, id)
                .set(DeliveryRequest::getStatus, status)
                .set(DeliveryRequest::getUpdateTime, LocalDateTime.now())
                .update();
    }

    @Override
    public List<DeliveryRequest> getByUserId(Long userId) {
        // 查询用户的所有配送请求，按创建时间倒序排列
        return lambdaQuery()
                .eq(DeliveryRequest::getUserId, userId)
                .orderByDesc(DeliveryRequest::getCreateTime)
                .list();
    }

    @Override
    public List<DeliveryRequest> getByDeliveryPersonId(Long deliveryPersonId) {
        // 由于DeliveryRequest实体类中没有deliveryPersonId字段，这个方法暂时返回空列表
        return new ArrayList<>();
    }

    @Override
    public boolean assignDeliveryPerson(Long id, Long deliveryPersonId) {
        // 由于DeliveryRequest实体类中没有deliveryPersonId字段，这个方法暂时返回false
        return false;
    }

    @Override
    public boolean delete(Long id) {
        // 删除配送请求
        return removeById(id);
    }
}
