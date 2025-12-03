package com.heikeji.mall.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.user.entity.DeliveryPerson;
import com.heikeji.mall.user.entity.DeliveryRequest;
import com.heikeji.mall.user.vo.DeliveryPersonVo;
import com.heikeji.mall.user.vo.PageData;

import java.util.List;

/**
 * 配送员服务接口
 * 用于管理配送员信息和相关业务操作
 *
 * @author heikeji
 * @date 2024-12-19
 */
public interface DeliveryPersonService extends IService<DeliveryPerson> {

    /**
     * 注册配送员
     *
     * @param deliveryPerson 配送员信息
     * @return 注册结果
     */
    boolean registerDeliveryPerson(DeliveryPerson deliveryPerson);

    /**
     * 更新配送员信息
     *
     * @param deliveryPerson 配送员信息
     * @return 更新结果
     */
    boolean updateDeliveryPerson(DeliveryPerson deliveryPerson);

    /**
     * 获取配送员详情
     *
     * @param id 配送员ID
     * @return 配送员详情
     */
    DeliveryPerson getDeliveryPersonById(Long id);

    /**
     * 获取配送员详情（包含扩展信息）
     *
     * @param id 配送员ID
     * @return 配送员详情VO
     */
    DeliveryPersonVo getDeliveryPersonVoById(Long id);

    /**
     * 根据用户ID获取配送员信息
     *
     * @param userId 用户ID
     * @return 配送员信息
     */
    DeliveryPerson getDeliveryPersonByUserId(Long userId);

    /**
     * 分页查询配送员列表
     *
     * @param page 页码
     * @param size 每页数量
     * @param status 状态
     * @param keyword 搜索关键词
     * @return 分页结果
     */
    PageData<DeliveryPersonVo> pageDeliveryPersons(Integer page, Integer size, Integer status, String keyword);

    /**
     * 更改配送员状态
     *
     * @param id 配送员ID
     * @param status 状态
     * @return 更改结果
     */
    boolean changeDeliveryPersonStatus(Long id, Integer status);

    /**
     * 审核配送员申请
     *
     * @param requestId 申请ID
     * @param status 审核状态
     * @param remark 审核备注
     * @return 审核结果
     */
    boolean auditDeliveryPerson(Long requestId, Integer status, String remark);

    /**
     * 获取可用配送员列表（用于分配订单）
     *
     * @param lat 纬度
     * @param lng 经度
     * @param count 数量
     * @return 可用配送员列表
     */
    List<DeliveryPersonVo> getAvailableDeliveryPersons(Double lat, Double lng, Integer count);

    /**
     * 更新配送员位置
     *
     * @param deliveryPersonId 配送员ID
     * @param lat 纬度
     * @param lng 经度
     * @return 更新结果
     */
    boolean updateDeliveryPersonLocation(Long deliveryPersonId, Double lat, Double lng);

    /**
     * 获取配送员统计信息
     *
     * @param deliveryPersonId 配送员ID
     * @return 统计信息
     */
    DeliveryPersonVo getDeliveryPersonStatistics(Long deliveryPersonId);
}
