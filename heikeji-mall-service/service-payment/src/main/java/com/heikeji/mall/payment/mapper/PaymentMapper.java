package com.heikeji.mall.payment.mapper;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.payment.entity.Payment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 支付记录Mapper接口
 */
@Mapper
public interface PaymentMapper extends BaseMapper<Payment> {
    
    /**
     * 根据订单号查询支付记录
     * @param orderNo 订单号
     * @return 支付记录
     */
    Payment selectByOrderNo(String orderNo);
    
    /**
     * 根据支付流水号查询支付记录
     * @param paymentNo 支付流水号
     * @return 支付记录
     */
    Payment selectByPaymentNo(String paymentNo);
    
    /**
     * 批量更新支付状态 - 使用乐观锁
     * @param id 支付记录ID
     * @param status 新状态
     * @param transactionId 交易ID
     * @param payTime 支付时间
     * @param newVersion 新版本号
     * @param oldVersion 旧版本号
     * @return 更新影响的行数
     */
    int updatePaymentStatus(@Param("id") Long id, 
                          @Param("status") Integer status, 
                          @Param("transactionId") String transactionId, 
                          @Param("payTime") Date payTime, 
                          @Param("newVersion") Integer newVersion, 
                          @Param("oldVersion") Integer oldVersion);
    
    /**
     * 批量更新退款信息 - 使用乐观锁
     * @param id 支付记录ID
     * @param refundAmount 退款金额
     * @param refundNo 退款单号
     * @param status 新状态
     * @param updateTime 更新时间
     * @return 更新影响的行数
     */
    int updateRefundInfo(@Param("id") Long id, 
                       @Param("refundAmount") BigDecimal refundAmount, 
                       @Param("refundNo") String refundNo, 
                       @Param("status") Integer status, 
                       @Param("updateTime") Date updateTime);
    
    /**
     * 批量插入支付记录 - 提高批量操作性能
     * @param payments 支付记录列表
     * @return 插入影响的行数
     */
    int batchInsert(@Param("payments") List<Payment> payments);
    
    /**
     * 批量更新支付记录状态 - 用于异步补偿
     * @param ids 支付记录ID列表
     * @param status 目标状态
     * @return 更新影响的行数
     */
    int batchUpdateStatus(@Param("ids") List<Long> ids, @Param("status") Integer status);
    
    /**
     * 分页查询支付记录 - 优化查询性能
     * @param pageNum 页码
     * @param pageSize 每页大小
     * @param userId 用户ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 支付记录列表
     */
    List<Payment> selectPageOptimized(@Param("pageNum") Integer pageNum, 
                                     @Param("pageSize") Integer pageSize, 
                                     @Param("userId") Long userId,
                                     @Param("startTime") Date startTime,
                                     @Param("endTime") Date endTime);
    
    /**
     * 统计支付记录 - 用于报表生成
     * @param userId 用户ID
     * @param paymentType 支付类型
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 统计结果
     */
    BigDecimal sumPaymentAmount(@Param("userId") Long userId,
                              @Param("paymentType") Integer paymentType,
                              @Param("startTime") Date startTime,
                              @Param("endTime") Date endTime);
    
    /**
     * 根据查询条件统计支付金额
     * @param queryWrapper 查询条件
     * @return 支付金额总和
     */
    BigDecimal sumAmount(@Param("ew") LambdaQueryWrapper<Payment> queryWrapper);
    
    /**
     * 按支付类型分组统计
     * @param queryWrapper 查询条件
     * @return 分组统计结果
     */
    List<Map<String, Object>> groupByPaymentType(@Param("ew") LambdaQueryWrapper<Payment> queryWrapper);
}