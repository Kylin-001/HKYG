package com.heikeji.mall.common.message;

/**
 * 数据插入消息回调接口
 *
 * 定义消息消费者的业务逻辑回调，
 * 实现具体的插入操作。
 */
public interface DataInsertMessageCallback {

    /**
     * 接收到单条用户插入消息时调用
     */
    void onUserInsertReceived(DataInsertMessageService.UserInsertMessage message);

    /**
     * 接收到批量插入中的单条数据时调用
     *
     * @param batchId 批次ID
     * @param index   当前索引（从0开始）
     * @param data    数据对象
     */
    void onBatchItemReceived(String batchId, int index, Object data);

    /**
     * 批量处理全部完成时调用
     *
     * @param batchId 批次ID
     * @param result  处理结果统计
     */
    void onBatchCompleted(String batchId, DataInsertMessageService.BatchInsertResult result);

    /**
     * 消息处理失败时的回调
     *
     * @param messageId 消息ID
     * @param error     错误信息
     * @param shouldRetry 是否应该重试
     */
    default void onMessageFailed(String messageId, String error, boolean shouldRetry) {
        // 默认空实现
    }
}
