package com.heikeji.mall.user.service;

import com.heikeji.mall.common.Result;
import com.heikeji.mall.user.dto.UserBatchInsertDTO;
import com.heikeji.mall.user.entity.User;

import java.util.List;

/**
 * 用户批量插入服务接口
 * 定义单条和批量数据插入的标准契约
 */
public interface UserBatchInsertService {

    /**
     * 插入单条用户数据
     *
     * @param dto 用户数据传输对象（已通过参数验证）
     * @return 操作结果，成功时返回用户实体（含生成的主键ID）
     */
    Result<User> insertSingle(UserBatchInsertDTO dto);

    /**
     * 批量插入用户数据
     *
     * @param dtoList 用户数据列表（每个元素已通过参数验证）
     * @return 批量操作结果，包含：
     *         - 成功插入的用户列表
     *         - 成功/失败数量统计
     *         - 失败记录的错误详情
     */
    Result<List<User>> insertBatch(List<UserBatchInsertDTO> dtoList);
}
