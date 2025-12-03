package com.heikeji.job.service;

/**
 * 定时任务服务接口
 * 
 * @author heikeji
 */
public interface JobService {

    /**
     * 执行订单自动取消任务
     */
    void executeOrderAutoCancel();

    /**
     * 执行订单自动确认收货任务
     */
    void executeOrderAutoConfirm();

    /**
     * 执行商品库存预警任务
     */
    void executeProductStockWarning();

    /**
     * 执行日志清理任务
     */
    void executeLogCleanup();

    /**
     * 执行数据统计任务
     */
    void executeDataStatistics();

    /**
     * 执行外卖柜超时释放任务
     */
    void executeDeliveryLockerTimeoutRelease();

}
