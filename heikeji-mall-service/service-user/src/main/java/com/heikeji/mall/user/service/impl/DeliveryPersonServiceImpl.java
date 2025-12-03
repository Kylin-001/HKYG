package com.heikeji.mall.user.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.user.entity.DeliveryPerson;
import com.heikeji.mall.user.mapper.DeliveryPersonMapper;
import com.heikeji.mall.user.service.DeliveryPersonService;
import com.heikeji.mall.user.vo.DeliveryPersonVo;
import com.heikeji.mall.user.vo.PageData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 配送员服务实现类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Slf4j
@Service
public class DeliveryPersonServiceImpl extends ServiceImpl<DeliveryPersonMapper, DeliveryPerson> implements DeliveryPersonService {

    @Override
    public boolean registerDeliveryPerson(DeliveryPerson deliveryPerson) {
        return this.save(deliveryPerson);
    }

    @Override
    public boolean updateDeliveryPerson(DeliveryPerson deliveryPerson) {
        return this.updateById(deliveryPerson);
    }

    @Override
    public DeliveryPerson getDeliveryPersonById(Long id) {
        return this.getById(id);
    }

    @Override
    public DeliveryPersonVo getDeliveryPersonVoById(Long id) {
        // TODO: 实现配送员详情VO转换逻辑
        return null;
    }

    @Override
    public DeliveryPerson getDeliveryPersonByUserId(Long userId) {
        return this.lambdaQuery().eq(DeliveryPerson::getUserId, userId).one();
    }

    @Override
    public PageData<DeliveryPersonVo> pageDeliveryPersons(Integer page, Integer size, Integer status, String keyword) {
        // TODO: 实现分页查询配送员列表
        return null;
    }

    @Override
    public boolean changeDeliveryPersonStatus(Long id, Integer status) {
        return this.lambdaUpdate()
                .eq(DeliveryPerson::getId, id)
                .set(DeliveryPerson::getStatus, status)
                .update();
    }

    @Override
    public boolean auditDeliveryPerson(Long requestId, Integer status, String remark) {
        // TODO: 实现审核配送员申请逻辑
        return false;
    }

    @Override
    public List<DeliveryPersonVo> getAvailableDeliveryPersons(Double lat, Double lng, Integer count) {
        // TODO: 实现获取可用配送员列表逻辑
        return null;
    }

    @Override
    public boolean updateDeliveryPersonLocation(Long deliveryPersonId, Double lat, Double lng) {
        // TODO: 实现更新配送员位置逻辑
        return false;
    }

    @Override
    public DeliveryPersonVo getDeliveryPersonStatistics(Long deliveryPersonId) {
        // TODO: 实现获取配送员统计信息逻辑
        return null;
    }
}
