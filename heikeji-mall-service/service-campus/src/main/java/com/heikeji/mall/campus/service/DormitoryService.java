package com.heikeji.mall.campus.service;

import com.heikeji.mall.campus.entity.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 宿舍管理Service接口
 */
public interface DormitoryService {

    // ==================== 宿舍基本信息 ====================
    Dormitory getDormitoryByStudentId(Long studentId);
    List<Dormitory> listDormitories(String building, String status);
    void addDormitory(Dormitory dormitory);
    void updateDormitory(Dormitory dormitory);
    void deleteDormitory(Long id);

    // ==================== 报修管理 ====================
    DormitoryRepair submitRepair(Long studentId, DormitoryRepair repair);
    List<DormitoryRepair> getRepairs(Long studentId, String status);
    List<DormitoryRepair> getAllRepairs(String status);
    void assignRepair(Long id, String handler);
    void completeRepair(Long id, String result);

    // ==================== 电费水费 ====================
    BigDecimal rechargeElectric(Long studentId, BigDecimal amount);
    BigDecimal rechargeWater(Long studentId, BigDecimal amount);

    // ==================== 门禁记录 ====================
    List<DormitoryAccessRecord> getAccessRecords(Long studentId, String startDate, String endDate, Integer limit);

    // ==================== 卫生评分 ====================
    List<DormitoryHygieneRecord> getHygieneRecords(Long studentId);
    void addHygieneRecord(DormitoryHygieneRecord record);

    // ==================== 临时密码 ====================
    DormitoryTempPassword generateTempPassword(Long studentId, Integer validHours, Integer usageLimit, String purpose);
    List<DormitoryTempPassword> getTempPasswords(Long studentId);
    void disableTempPassword(Long id);

    // ==================== 访客管理 ====================
    DormitoryVisitor submitVisitor(Long studentId, DormitoryVisitor visitor);
    List<DormitoryVisitor> getVisitorRecords(Long studentId);
    List<DormitoryVisitor> getAllVisitorRecords(String status);
    void approveVisitor(Long id, Long adminId, String remark);
    void rejectVisitor(Long id, Long adminId, String remark);
    void cancelVisitor(Long id);

    // ==================== 宿舍调换 ====================
    DormitorySwapRequest submitDormSwap(Long studentId, DormitorySwapRequest request);
    List<DormitorySwapRequest> getDormSwapRequests(Long studentId);
    void cancelDormSwap(Long id);

    // ==================== 晚归记录 ====================
    List<DormitoryLateReturn> getLateReturnRecords(Long studentId, String startDate, String endDate);
    void reportLateReturn(Long id, String reason);

    // ==================== 费用账单 ====================
    List<DormitoryBill> getDormBills(Long studentId, String type);
    DormitoryBill getDormBillDetail(Long id);
}
