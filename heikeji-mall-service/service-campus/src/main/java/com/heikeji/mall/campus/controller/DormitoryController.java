package com.heikeji.mall.campus.controller;

import com.heikeji.mall.campus.entity.*;
import com.heikeji.mall.campus.service.DormitoryService;
import com.heikeji.common.core.domain.R;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 宿舍管理Controller
 */
@RestController
@RequestMapping("/api/campus/dormitory")
@RequiredArgsConstructor
public class DormitoryController {

    private final DormitoryService dormitoryService;

    /**
     * 获取当前用户的宿舍信息
     */
    @GetMapping("/info")
    public R<Dormitory> getDormitoryInfo(@RequestAttribute("userId") Long userId) {
        Dormitory dormitory = dormitoryService.getDormitoryByStudentId(userId);
        return R.ok(dormitory);
    }

    /**
     * 获取宿舍列表（管理员）
     */
    @GetMapping("/list")
    public R<List<Dormitory>> listDormitories(
            @RequestParam(required = false) String building,
            @RequestParam(required = false) String status) {
        List<Dormitory> list = dormitoryService.listDormitories(building, status);
        return R.ok(list);
    }

    /**
     * 添加宿舍
     */
    @PostMapping
    public R<Void> addDormitory(@RequestBody Dormitory dormitory) {
        dormitoryService.addDormitory(dormitory);
        return R.ok();
    }

    /**
     * 更新宿舍
     */
    @PutMapping("/{id}")
    public R<Void> updateDormitory(@PathVariable Long id, @RequestBody Dormitory dormitory) {
        dormitory.setId(id);
        dormitoryService.updateDormitory(dormitory);
        return R.ok();
    }

    /**
     * 删除宿舍
     */
    @DeleteMapping("/{id}")
    public R<Void> deleteDormitory(@PathVariable Long id) {
        dormitoryService.deleteDormitory(id);
        return R.ok();
    }

    // ==================== 报修管理 ====================

    /**
     * 提交报修
     */
    @PostMapping("/repairs")
    public R<DormitoryRepair> submitRepair(
            @RequestAttribute("userId") Long userId,
            @RequestBody DormitoryRepair repair) {
        DormitoryRepair result = dormitoryService.submitRepair(userId, repair);
        return R.ok(result);
    }

    /**
     * 获取报修列表
     */
    @GetMapping("/repairs")
    public R<List<DormitoryRepair>> getRepairs(
            @RequestAttribute("userId") Long userId,
            @RequestParam(required = false) String status) {
        List<DormitoryRepair> list = dormitoryService.getRepairs(userId, status);
        return R.ok(list);
    }

    /**
     * 获取所有报修列表（管理员）
     */
    @GetMapping("/repairs/all")
    public R<List<DormitoryRepair>> getAllRepairs(
            @RequestParam(required = false) String status) {
        List<DormitoryRepair> list = dormitoryService.getAllRepairs(status);
        return R.ok(list);
    }

    /**
     * 派单处理
     */
    @PostMapping("/repairs/{id}/assign")
    public R<Void> assignRepair(@PathVariable Long id, @RequestBody Map<String, String> params) {
        dormitoryService.assignRepair(id, params.get("handler"));
        return R.ok();
    }

    /**
     * 完成报修
     */
    @PostMapping("/repairs/{id}/complete")
    public R<Void> completeRepair(@PathVariable Long id, @RequestBody Map<String, String> params) {
        dormitoryService.completeRepair(id, params.get("result"));
        return R.ok();
    }

    // ==================== 电费水费充值 ====================

    /**
     * 电费充值
     */
    @PostMapping("/electric/recharge")
    public R<Map<String, BigDecimal>> rechargeElectric(
            @RequestAttribute("userId") Long userId,
            @RequestBody Map<String, BigDecimal> params) {
        BigDecimal amount = params.get("amount");
        BigDecimal balance = dormitoryService.rechargeElectric(userId, amount);
        return R.ok(Map.of("balance", balance));
    }

    /**
     * 水费充值
     */
    @PostMapping("/water/recharge")
    public R<Map<String, BigDecimal>> rechargeWater(
            @RequestAttribute("userId") Long userId,
            @RequestBody Map<String, BigDecimal> params) {
        BigDecimal amount = params.get("amount");
        BigDecimal balance = dormitoryService.rechargeWater(userId, amount);
        return R.ok(Map.of("balance", balance));
    }

    // ==================== 门禁记录 ====================

    /**
     * 获取门禁记录
     */
    @GetMapping("/access-records")
    public R<List<DormitoryAccessRecord>> getAccessRecords(
            @RequestAttribute("userId") Long userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        List<DormitoryAccessRecord> list = dormitoryService.getAccessRecords(userId, startDate, endDate, limit);
        return R.ok(list);
    }

    // ==================== 卫生评分 ====================

    /**
     * 获取卫生评分记录
     */
    @GetMapping("/hygiene-records")
    public R<List<DormitoryHygieneRecord>> getHygieneRecords(@RequestAttribute("userId") Long userId) {
        List<DormitoryHygieneRecord> list = dormitoryService.getHygieneRecords(userId);
        return R.ok(list);
    }

    /**
     * 录入卫生评分（管理员）
     */
    @PostMapping("/hygiene-records")
    public R<Void> addHygieneRecord(@RequestBody DormitoryHygieneRecord record) {
        dormitoryService.addHygieneRecord(record);
        return R.ok();
    }

    // ==================== 临时密码 ====================

    /**
     * 生成临时密码
     */
    @PostMapping("/temp-password")
    public R<DormitoryTempPassword> generateTempPassword(
            @RequestAttribute("userId") Long userId,
            @RequestBody Map<String, Object> params) {
        Integer validHours = (Integer) params.getOrDefault("validHours", 4);
        Integer usageLimit = (Integer) params.getOrDefault("usageLimit", 3);
        String purpose = (String) params.get("purpose");
        DormitoryTempPassword password = dormitoryService.generateTempPassword(userId, validHours, usageLimit, purpose);
        return R.ok(password);
    }

    /**
     * 获取临时密码列表
     */
    @GetMapping("/temp-passwords")
    public R<List<DormitoryTempPassword>> getTempPasswords(@RequestAttribute("userId") Long userId) {
        List<DormitoryTempPassword> list = dormitoryService.getTempPasswords(userId);
        return R.ok(list);
    }

    /**
     * 禁用临时密码
     */
    @PostMapping("/temp-passwords/{id}/disable")
    public R<Void> disableTempPassword(@PathVariable Long id) {
        dormitoryService.disableTempPassword(id);
        return R.ok();
    }

    // ==================== 访客管理 ====================

    /**
     * 提交访客申请
     */
    @PostMapping("/visitors")
    public R<DormitoryVisitor> submitVisitor(
            @RequestAttribute("userId") Long userId,
            @RequestBody DormitoryVisitor visitor) {
        DormitoryVisitor result = dormitoryService.submitVisitor(userId, visitor);
        return R.ok(result);
    }

    /**
     * 获取访客记录
     */
    @GetMapping("/visitors")
    public R<List<DormitoryVisitor>> getVisitorRecords(@RequestAttribute("userId") Long userId) {
        List<DormitoryVisitor> list = dormitoryService.getVisitorRecords(userId);
        return R.ok(list);
    }

    /**
     * 获取所有访客记录（管理员）
     */
    @GetMapping("/visitors/all")
    public R<List<DormitoryVisitor>> getAllVisitorRecords(@RequestParam(required = false) String status) {
        List<DormitoryVisitor> list = dormitoryService.getAllVisitorRecords(status);
        return R.ok(list);
    }

    /**
     * 审批访客申请
     */
    @PostMapping("/visitors/{id}/approve")
    public R<Void> approveVisitor(
            @PathVariable Long id,
            @RequestAttribute("userId") Long adminId,
            @RequestBody Map<String, String> params) {
        dormitoryService.approveVisitor(id, adminId, params.get("remark"));
        return R.ok();
    }

    /**
     * 拒绝访客申请
     */
    @PostMapping("/visitors/{id}/reject")
    public R<Void> rejectVisitor(
            @PathVariable Long id,
            @RequestAttribute("userId") Long adminId,
            @RequestBody Map<String, String> params) {
        dormitoryService.rejectVisitor(id, adminId, params.get("remark"));
        return R.ok();
    }

    /**
     * 取消访客申请
     */
    @PostMapping("/visitors/{id}/cancel")
    public R<Void> cancelVisitor(@PathVariable Long id) {
        dormitoryService.cancelVisitor(id);
        return R.ok();
    }

    // ==================== 宿舍调换 ====================

    /**
     * 提交宿舍调换申请
     */
    @PostMapping("/swap-requests")
    public R<DormitorySwapRequest> submitDormSwap(
            @RequestAttribute("userId") Long userId,
            @RequestBody DormitorySwapRequest request) {
        DormitorySwapRequest result = dormitoryService.submitDormSwap(userId, request);
        return R.ok(result);
    }

    /**
     * 获取宿舍调换申请列表
     */
    @GetMapping("/swap-requests")
    public R<List<DormitorySwapRequest>> getDormSwapRequests(@RequestAttribute("userId") Long userId) {
        List<DormitorySwapRequest> list = dormitoryService.getDormSwapRequests(userId);
        return R.ok(list);
    }

    /**
     * 取消宿舍调换申请
     */
    @PostMapping("/swap-requests/{id}/cancel")
    public R<Void> cancelDormSwap(@PathVariable Long id) {
        dormitoryService.cancelDormSwap(id);
        return R.ok();
    }

    // ==================== 晚归记录 ====================

    /**
     * 获取晚归记录
     */
    @GetMapping("/late-returns")
    public R<List<DormitoryLateReturn>> getLateReturnRecords(
            @RequestAttribute("userId") Long userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<DormitoryLateReturn> list = dormitoryService.getLateReturnRecords(userId, startDate, endDate);
        return R.ok(list);
    }

    /**
     * 提交晚归说明
     */
    @PostMapping("/late-returns/{id}/report")
    public R<Void> reportLateReturn(
            @PathVariable Long id,
            @RequestBody Map<String, String> params) {
        dormitoryService.reportLateReturn(id, params.get("reason"));
        return R.ok();
    }

    // ==================== 费用账单 ====================

    /**
     * 获取费用账单
     */
    @GetMapping("/bills")
    public R<List<DormitoryBill>> getDormBills(
            @RequestAttribute("userId") Long userId,
            @RequestParam(required = false) String type) {
        List<DormitoryBill> list = dormitoryService.getDormBills(userId, type);
        return R.ok(list);
    }

    /**
     * 获取账单详情
     */
    @GetMapping("/bills/{id}")
    public R<DormitoryBill> getDormBillDetail(@PathVariable Long id) {
        DormitoryBill bill = dormitoryService.getDormBillDetail(id);
        return R.ok(bill);
    }
}
