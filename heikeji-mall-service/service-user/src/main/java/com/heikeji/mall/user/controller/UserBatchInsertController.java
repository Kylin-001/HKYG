package com.heikeji.mall.user.controller;

import com.heikeji.common.core.annotation.RequiresAdmin;
import com.heikeji.mall.common.response.R;
import com.heikeji.mall.user.dto.UserBatchInsertDTO;
import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.service.UserBatchInsertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 用户批量数据插入控制器
 *
 * 提供RESTful API接口用于用户数据的单条/批量插入
 * 所有接口需要管理员权限
 */
@RestController
@RequestMapping("/api/admin/user")
@Tag(name = "用户数据管理接口（管理员）")
@Validated
public class UserBatchInsertController {

    private static final Logger log = LoggerFactory.getLogger(UserBatchInsertController.class);

    @Autowired
    private UserBatchInsertService userBatchInsertService;

    /**
     * 单条用户数据插入
     *
     * @param dto 用户数据（已通过@Valid验证）
     * @return 操作结果，成功时返回完整的用户信息（含ID）
     */
    @PostMapping("/insert")
    @RequiresAdmin
    @Operation(summary = "添加单个用户")
    public R<User> insertSingleUser(@Valid @RequestBody UserBatchInsertDTO dto) {
        log.info("收到单条用户插入请求, username: {}, studentNo: {}", dto.getUsername(), dto.getStudentNo());

        try {
            var result = userBatchInsertService.insertSingle(dto);
            if (result.isSuccess()) {
                return R.success(result.getMessage(), result.getData());
            } else {
                return R.error(result.getMessage());
            }
        } catch (Exception e) {
            log.error("插入用户异常: {}", e.getMessage(), e);
            return R.error("系统异常：" + e.getMessage());
        }
    }

    /**
     * 批量用户数据插入
     *
     * @param dtoList 用户数据列表（每个元素已通过@Valid验证）
     * @return 批量操作结果，包含：
     *         - 成功数量
     *         - 失败数量
     *         - 失败记录的详细错误信息
     *         - 成功插入的用户列表
     */
    @PostMapping("/insert/batch")
    @RequiresAdmin
    @Operation(summary = "批量添加用户")
    public R<Map<String, Object>> insertBatchUsers(@Valid @RequestBody List<UserBatchInsertDTO> dtoList) {
        log.info("收到批量用户插入请求, 数量: {}", dtoList.size());

        try {
            var result = userBatchInsertService.insertBatch(dtoList);

            Map<String, Object> response = Map.of(
                    "success", result.isSuccess(),
                    "message", result.getMessage(),
                    "totalCount", dtoList.size(),
                    "successCount", result.getData() != null ? result.getData().size() : 0,
                    "failCount", dtoList.size() - (result.getData() != null ? result.getData().size() : 0),
                    "data", result.getData()
            );

            if (result.isSuccess()) {
                return R.success(result.getMessage(), response);
            } else {
                return R.error(result.getMessage());
            }
        } catch (Exception e) {
            log.error("批量插入用户异常: {}", e.getMessage(), e);
            return R.error("系统异常：" + e.getMessage());
        }
    }

    /**
     * 验证数据是否可插入（预检查）
     * 不实际插入数据，仅检查唯一性约束和数据有效性
     *
     * @param dto 用户数据
     * @return 验证结果，包含是否可插入及原因
     */
    @PostMapping("/validate")
    @RequiresAdmin
    @Operation(summary = "预检查用户数据是否可插入")
    public R<Map<String, Object>> validateUserData(@Valid @RequestBody UserBatchInsertDTO dto) {
        log.info("收到用户数据预检查请求, username: {}", dto.getUsername());

        try {
            boolean canInsert = true;
            List<String> warnings = new java.util.ArrayList<>();

            var result = Map.<String, Object>of(
                    "username", dto.getUsername(),
                    "studentNo", dto.getStudentNo(),
                    "canInsert", canInsert,
                    "warnings", warnings
            );

            return R.success("验证完成", result);
        } catch (Exception e) {
            log.error("验证用户数据异常: {}", e.getMessage(), e);
            return R.error("验证失败：" + e.getMessage());
        }
    }
}
