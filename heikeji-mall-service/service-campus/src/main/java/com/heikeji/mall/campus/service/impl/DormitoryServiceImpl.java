package com.heikeji.mall.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heikeji.mall.campus.config.DormitoryWebSocketHandler;
import com.heikeji.mall.campus.entity.*;
import com.heikeji.mall.campus.mapper.*;
import com.heikeji.mall.campus.service.DormitoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 宿舍管理Service实现类
 */
@Service
@RequiredArgsConstructor
public class DormitoryServiceImpl implements DormitoryService {

    private final DormitoryMapper dormitoryMapper;
    private final DormitoryStudentMapper dormitoryStudentMapper;
    private final DormitoryRepairMapper repairMapper;
    private final DormitoryAccessRecordMapper accessRecordMapper;
    private final DormitoryHygieneRecordMapper hygieneRecordMapper;
    private final DormitoryTempPasswordMapper tempPasswordMapper;
    private final DormitoryVisitorMapper visitorMapper;
    private final DormitorySwapRequestMapper swapRequestMapper;
    private final DormitoryLateReturnMapper lateReturnMapper;
    private final DormitoryBillMapper billMapper;

    @Override
    public Dormitory getDormitoryByStudentId(Long studentId) {
        // 获取学生当前宿舍关联
        LambdaQueryWrapper<DormitoryStudent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DormitoryStudent::getStudentId, studentId)
               .eq(DormitoryStudent::getStatus, 1)
               .orderByDesc(DormitoryStudent::getCreateTime)
               .last("LIMIT 1");
        DormitoryStudent relation = dormitoryStudentMapper.selectOne(wrapper);
        
        if (relation == null) {
            return null;
        }
        
        return dormitoryMapper.selectById(relation.getDormitoryId());
    }

    @Override
    public List<Dormitory> listDormitories(String building, String status) {
        LambdaQueryWrapper<Dormitory> wrapper = new LambdaQueryWrapper<>();
        if (building != null && !building.isEmpty()) {
            wrapper.eq(Dormitory::getBuilding, building);
        }
        if (status != null && !status.isEmpty()) {
            wrapper.eq(Dormitory::getStatus, status);
        }
        return dormitoryMapper.selectList(wrapper);
    }

    @Override
    @Transactional
    public void addDormitory(Dormitory dormitory) {
        dormitory.setCreateTime(new Date());
        dormitory.setUpdateTime(new Date());
        dormitory.setCurrentOccupancy(0);
        dormitory.setElectricBalance(BigDecimal.ZERO);
        dormitory.setWaterBalance(BigDecimal.ZERO);
        dormitory.setStatus(1);
        dormitoryMapper.insert(dormitory);
    }

    @Override
    @Transactional
    public void updateDormitory(Dormitory dormitory) {
        dormitory.setUpdateTime(new Date());
        dormitoryMapper.updateById(dormitory);
    }

    @Override
    @Transactional
    public void deleteDormitory(Long id) {
        dormitoryMapper.deleteById(id);
    }

    // ==================== 报修管理 ====================

    @Override
    @Transactional
    public DormitoryRepair submitRepair(Long studentId, DormitoryRepair repair) {
        // 生成工单号
        String ticketNo = generateTicketNo();
        repair.setTicketNo(ticketNo);
        repair.setStudentId(studentId);
        repair.setStatus("pending");
        repair.setSubmittedAt(new Date());
        repair.setCreateTime(new Date());
        repair.setUpdateTime(new Date());
        
        // 获取学生宿舍信息
        Dormitory dormitory = getDormitoryByStudentId(studentId);
        if (dormitory != null) {
            repair.setDormitoryId(dormitory.getId());
        }
        
        repairMapper.insert(repair);
        
        // WebSocket推送通知给管理员
        Map<String, Object> repairInfo = new HashMap<>();
        repairInfo.put("id", repair.getId());
        repairInfo.put("ticketNo", repair.getTicketNo());
        repairInfo.put("title", repair.getTitle());
        repairInfo.put("type", repair.getType());
        repairInfo.put("location", repair.getDormitoryId());
        DormitoryWebSocketHandler.broadcast(Map.of(
            "type", "new_repair",
            "title", "新报修工单",
            "message", "收到新的报修申请：" + repair.getTitle(),
            "data", repairInfo
        ));
        
        return repair;
    }

    @Override
    public List<DormitoryRepair> getRepairs(Long studentId, String status) {
        LambdaQueryWrapper<DormitoryRepair> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DormitoryRepair::getStudentId, studentId);
        if (status != null && !status.isEmpty()) {
            wrapper.eq(DormitoryRepair::getStatus, status);
        }
        wrapper.orderByDesc(DormitoryRepair::getCreateTime);
        return repairMapper.selectList(wrapper);
    }

    @Override
    public List<DormitoryRepair> getAllRepairs(String status) {
        LambdaQueryWrapper<DormitoryRepair> wrapper = new LambdaQueryWrapper<>();
        if (status != null && !status.isEmpty()) {
            wrapper.eq(DormitoryRepair::getStatus, status);
        }
        wrapper.orderByDesc(DormitoryRepair::getCreateTime);
        return repairMapper.selectList(wrapper);
    }

    @Override
    @Transactional
    public void assignRepair(Long id, String handler) {
        DormitoryRepair repair = repairMapper.selectById(id);
        if (repair == null) {
            throw new RuntimeException("报修记录不存在");
        }
        
        repair.setHandler(handler);
        repair.setStatus("processing");
        repair.setUpdateTime(new Date());
        repairMapper.updateById(repair);
        
        // WebSocket推送进度更新给学生
        Map<String, Object> progressInfo = new HashMap<>();
        progressInfo.put("id", repair.getId());
        progressInfo.put("ticketNo", repair.getTicketNo());
        progressInfo.put("status", "processing");
        progressInfo.put("handler", handler);
        progressInfo.put("message", "您的报修已派单，处理人：" + handler);
        DormitoryWebSocketHandler.sendRepairProgress(repair.getStudentId().toString(), progressInfo);
    }

    @Override
    @Transactional
    public void completeRepair(Long id, String result) {
        DormitoryRepair repair = repairMapper.selectById(id);
        if (repair == null) {
            throw new RuntimeException("报修记录不存在");
        }
        
        repair.setResult(result);
        repair.setStatus("completed");
        repair.setCompletedAt(new Date());
        repair.setUpdateTime(new Date());
        repairMapper.updateById(repair);
        
        // WebSocket推送进度更新给学生
        Map<String, Object> progressInfo = new HashMap<>();
        progressInfo.put("id", repair.getId());
        progressInfo.put("ticketNo", repair.getTicketNo());
        progressInfo.put("status", "completed");
        progressInfo.put("result", result);
        progressInfo.put("message", "您的报修已处理完成");
        DormitoryWebSocketHandler.sendRepairProgress(repair.getStudentId().toString(), progressInfo);
    }

    // ==================== 电费水费 ====================

    @Override
    @Transactional
    public BigDecimal rechargeElectric(Long studentId, BigDecimal amount) {
        Dormitory dormitory = getDormitoryByStudentId(studentId);
        if (dormitory == null) {
            throw new RuntimeException("未找到宿舍信息");
        }
        
        BigDecimal newBalance = dormitory.getElectricBalance().add(amount);
        dormitory.setElectricBalance(newBalance);
        dormitory.setUpdateTime(new Date());
        dormitoryMapper.updateById(dormitory);
        
        // 创建账单记录
        createBill(studentId, dormitory.getId(), "electricity", "电费充值", amount);
        
        return newBalance;
    }

    @Override
    @Transactional
    public BigDecimal rechargeWater(Long studentId, BigDecimal amount) {
        Dormitory dormitory = getDormitoryByStudentId(studentId);
        if (dormitory == null) {
            throw new RuntimeException("未找到宿舍信息");
        }
        
        BigDecimal newBalance = dormitory.getWaterBalance().add(amount);
        dormitory.setWaterBalance(newBalance);
        dormitory.setUpdateTime(new Date());
        dormitoryMapper.updateById(dormitory);
        
        // 创建账单记录
        createBill(studentId, dormitory.getId(), "water", "水费充值", amount);
        
        return newBalance;
    }

    // ==================== 门禁记录 ====================

    @Override
    public List<DormitoryAccessRecord> getAccessRecords(Long studentId, String startDate, String endDate, Integer limit) {
        LambdaQueryWrapper<DormitoryAccessRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DormitoryAccessRecord::getStudentId, studentId);
        if (startDate != null && !startDate.isEmpty()) {
            wrapper.ge(DormitoryAccessRecord::getTime, startDate);
        }
        if (endDate != null && !endDate.isEmpty()) {
            wrapper.le(DormitoryAccessRecord::getTime, endDate);
        }
        wrapper.orderByDesc(DormitoryAccessRecord::getTime);
        if (limit != null && limit > 0) {
            wrapper.last("LIMIT " + limit);
        }
        return accessRecordMapper.selectList(wrapper);
    }

    // ==================== 卫生评分 ====================

    @Override
    public List<DormitoryHygieneRecord> getHygieneRecords(Long studentId) {
        // 获取学生宿舍
        Dormitory dormitory = getDormitoryByStudentId(studentId);
        if (dormitory == null) {
            return new ArrayList<>();
        }
        
        LambdaQueryWrapper<DormitoryHygieneRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DormitoryHygieneRecord::getDormitoryId, dormitory.getId());
        wrapper.orderByDesc(DormitoryHygieneRecord::getCreateTime);
        return hygieneRecordMapper.selectList(wrapper);
    }

    @Override
    @Transactional
    public void addHygieneRecord(DormitoryHygieneRecord record) {
        record.setCreateTime(new Date());
        hygieneRecordMapper.insert(record);
    }

    // ==================== 临时密码 ====================

    @Override
    @Transactional
    public DormitoryTempPassword generateTempPassword(Long studentId, Integer validHours, Integer usageLimit, String purpose) {
        DormitoryTempPassword password = new DormitoryTempPassword();
        password.setStudentId(studentId);
        password.setCode(generateTempCode());
        password.setValidFrom(new Date());
        
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.HOUR, validHours);
        password.setValidTo(cal.getTime());
        
        password.setUsageLimit(usageLimit);
        password.setUsageCount(0);
        password.setStatus("active");
        password.setPurpose(purpose);
        password.setCreateTime(new Date());
        
        tempPasswordMapper.insert(password);
        return password;
    }

    @Override
    public List<DormitoryTempPassword> getTempPasswords(Long studentId) {
        LambdaQueryWrapper<DormitoryTempPassword> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DormitoryTempPassword::getStudentId, studentId)
               .eq(DormitoryTempPassword::getStatus, "active")
               .ge(DormitoryTempPassword::getValidTo, new Date())
               .orderByDesc(DormitoryTempPassword::getCreateTime);
        return tempPasswordMapper.selectList(wrapper);
    }

    @Override
    @Transactional
    public void disableTempPassword(Long id) {
        DormitoryTempPassword password = new DormitoryTempPassword();
        password.setId(id);
        password.setStatus("disabled");
        tempPasswordMapper.updateById(password);
    }

    // ==================== 访客管理 ====================

    @Override
    @Transactional
    public DormitoryVisitor submitVisitor(Long studentId, DormitoryVisitor visitor) {
        visitor.setStudentId(studentId);
        visitor.setStatus("pending");
        visitor.setCreateTime(new Date());
        
        // 获取学生宿舍
        Dormitory dormitory = getDormitoryByStudentId(studentId);
        if (dormitory != null) {
            visitor.setDormitoryId(dormitory.getId());
        }
        
        visitorMapper.insert(visitor);
        return visitor;
    }

    @Override
    public List<DormitoryVisitor> getVisitorRecords(Long studentId) {
        LambdaQueryWrapper<DormitoryVisitor> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DormitoryVisitor::getStudentId, studentId);
        wrapper.orderByDesc(DormitoryVisitor::getCreateTime);
        return visitorMapper.selectList(wrapper);
    }

    @Override
    public List<DormitoryVisitor> getAllVisitorRecords(String status) {
        LambdaQueryWrapper<DormitoryVisitor> wrapper = new LambdaQueryWrapper<>();
        if (status != null && !status.isEmpty()) {
            wrapper.eq(DormitoryVisitor::getStatus, status);
        }
        wrapper.orderByDesc(DormitoryVisitor::getCreateTime);
        return visitorMapper.selectList(wrapper);
    }

    @Override
    @Transactional
    public void approveVisitor(Long id, Long adminId, String remark) {
        DormitoryVisitor visitor = new DormitoryVisitor();
        visitor.setId(id);
        visitor.setStatus("approved");
        visitor.setApprovedBy(adminId.toString());
        visitor.setApprovedAt(new Date());
        visitor.setRemark(remark);
        visitorMapper.updateById(visitor);
    }

    @Override
    @Transactional
    public void rejectVisitor(Long id, Long adminId, String remark) {
        DormitoryVisitor visitor = new DormitoryVisitor();
        visitor.setId(id);
        visitor.setStatus("rejected");
        visitor.setApprovedBy(adminId.toString());
        visitor.setApprovedAt(new Date());
        visitor.setRemark(remark);
        visitorMapper.updateById(visitor);
    }

    @Override
    @Transactional
    public void cancelVisitor(Long id) {
        DormitoryVisitor visitor = new DormitoryVisitor();
        visitor.setId(id);
        visitor.setStatus("rejected");
        visitorMapper.updateById(visitor);
    }

    // ==================== 宿舍调换 ====================

    @Override
    @Transactional
    public DormitorySwapRequest submitDormSwap(Long studentId, DormitorySwapRequest request) {
        request.setStudentId(studentId);
        request.setStatus("pending");
        request.setCreateTime(new Date());
        
        // 获取当前宿舍
        Dormitory currentDorm = getDormitoryByStudentId(studentId);
        if (currentDorm != null) {
            request.setCurrentDormitoryId(currentDorm.getId());
            request.setCurrentDorm(currentDorm.getBuilding());
            request.setCurrentRoom(currentDorm.getRoom());
        }
        
        swapRequestMapper.insert(request);
        return request;
    }

    @Override
    public List<DormitorySwapRequest> getDormSwapRequests(Long studentId) {
        LambdaQueryWrapper<DormitorySwapRequest> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DormitorySwapRequest::getStudentId, studentId);
        wrapper.orderByDesc(DormitorySwapRequest::getCreateTime);
        return swapRequestMapper.selectList(wrapper);
    }

    @Override
    @Transactional
    public void cancelDormSwap(Long id) {
        DormitorySwapRequest request = new DormitorySwapRequest();
        request.setId(id);
        request.setStatus("rejected");
        swapRequestMapper.updateById(request);
    }

    // ==================== 晚归记录 ====================

    @Override
    public List<DormitoryLateReturn> getLateReturnRecords(Long studentId, String startDate, String endDate) {
        LambdaQueryWrapper<DormitoryLateReturn> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DormitoryLateReturn::getStudentId, studentId);
        if (startDate != null && !startDate.isEmpty()) {
            wrapper.ge(DormitoryLateReturn::getDate, startDate);
        }
        if (endDate != null && !endDate.isEmpty()) {
            wrapper.le(DormitoryLateReturn::getDate, endDate);
        }
        wrapper.orderByDesc(DormitoryLateReturn::getDate);
        return lateReturnMapper.selectList(wrapper);
    }

    @Override
    @Transactional
    public void reportLateReturn(Long id, String reason) {
        DormitoryLateReturn record = new DormitoryLateReturn();
        record.setId(id);
        record.setReason(reason);
        record.setStatus("reported");
        lateReturnMapper.updateById(record);
    }

    // ==================== 费用账单 ====================

    @Override
    public List<DormitoryBill> getDormBills(Long studentId, String type) {
        LambdaQueryWrapper<DormitoryBill> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DormitoryBill::getStudentId, studentId);
        if (type != null && !type.isEmpty()) {
            wrapper.eq(DormitoryBill::getType, type);
        }
        wrapper.orderByDesc(DormitoryBill::getCreateTime);
        return billMapper.selectList(wrapper);
    }

    @Override
    public DormitoryBill getDormBillDetail(Long id) {
        return billMapper.selectById(id);
    }

    // ==================== 私有方法 ====================

    private String generateTicketNo() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        String date = sdf.format(new Date());
        String random = String.format("%04d", new Random().nextInt(10000));
        return "BX" + date + random;
    }

    private String generateTempCode() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    private void createBill(Long studentId, Long dormitoryId, String type, String title, BigDecimal amount) {
        DormitoryBill bill = new DormitoryBill();
        bill.setStudentId(studentId);
        bill.setDormitoryId(dormitoryId);
        bill.setType(type);
        bill.setTitle(title);
        bill.setAmount(amount);
        bill.setStatus("paid");
        bill.setPaidAt(new Date());
        bill.setCreateTime(new Date());
        billMapper.insert(bill);
    }
}
