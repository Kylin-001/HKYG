package com.heikeji.mall.payment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.payment.entity.Payment;
import com.heikeji.mall.payment.entity.Reconciliation;
import com.heikeji.mall.payment.entity.ReconciliationBatch;
import com.heikeji.mall.payment.mapper.PaymentMapper;
import com.heikeji.mall.payment.mapper.ReconciliationBatchMapper;
import com.heikeji.mall.payment.mapper.ReconciliationMapper;
import com.heikeji.mall.payment.service.ReconciliationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 支付对账服务实现类
 */
@Service
public class ReconciliationServiceImpl extends ServiceImpl<ReconciliationMapper, Reconciliation> implements ReconciliationService {

    private static final Logger log = LoggerFactory.getLogger(ReconciliationServiceImpl.class);

    @Autowired
    private ReconciliationMapper reconciliationMapper;

    @Autowired
    private ReconciliationBatchMapper reconciliationBatchMapper;

    @Autowired
    private PaymentMapper paymentMapper;

    // 对账状态常量
    private static final Integer STATUS_UNRECONCILED = 0;
    private static final Integer STATUS_SUCCESS = 1;
    private static final Integer STATUS_AMOUNT_DIFF = 2;
    private static final Integer STATUS_PLATFORM_ONLY = 3;
    private static final Integer STATUS_SYSTEM_ONLY = 4;

    // 批次状态常量
    private static final Integer BATCH_STATUS_NOT_STARTED = 0;
    private static final Integer BATCH_STATUS_PROCESSING = 1;
    private static final Integer BATCH_STATUS_COMPLETED = 2;
    private static final Integer BATCH_STATUS_FAILED = 3;

    // 解决状态常量
    private static final Integer SOLVE_STATUS_UNSOLVED = 0;
    private static final Integer SOLVE_STATUS_SOLVED = 1;

    /**
     * 启动对账任务
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public String startReconciliation(String reconciliationDate, Integer paymentType) {
        log.info("开始启动对账任务，对账日期: {}, 支付方式: {}", reconciliationDate, paymentType);

        // 生成批次号
        String batchNo = generateBatchNo(reconciliationDate, paymentType);

        // 检查是否已经存在相同的对账批次
        ReconciliationBatch existingBatch = reconciliationBatchMapper.selectByDateAndPaymentType(reconciliationDate, paymentType);
        if (existingBatch != null) {
            log.warn("对账批次已存在，批次号: {}", existingBatch.getBatchNo());
            return existingBatch.getBatchNo();
        }

        // 创建对账批次记录
        ReconciliationBatch batch = new ReconciliationBatch();
        batch.setBatchNo(batchNo);
        batch.setReconciliationDate(reconciliationDate);
        batch.setPaymentType(paymentType);
        batch.setReconciliationStatus(BATCH_STATUS_PROCESSING);
        batch.setStartTime(new Date());
        batch.setCreateTime(new Date());
        batch.setUpdateTime(new Date());

        reconciliationBatchMapper.insert(batch);
        log.info("对账批次创建成功，批次号: {}", batchNo);

        return batchNo;
    }

    /**
     * 执行对账逻辑
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void executeReconciliation(String batchNo) {
        log.info("开始执行对账任务，批次号: {}", batchNo);

        try {
            // 获取对账批次信息
            ReconciliationBatch batch = reconciliationBatchMapper.selectByBatchNo(batchNo);
            if (batch == null) {
                log.error("对账批次不存在，批次号: {}", batchNo);
                return;
            }

            // 获取系统交易数据
            List<Map<String, Object>> systemData = fetchSystemTransactions(batch.getReconciliationDate(), batch.getPaymentType());
            log.info("获取系统交易数据，数量: {}", systemData.size());

            // 获取平台交易数据
            List<Map<String, Object>> platformData = fetchPlatformTransactions(batch.getReconciliationDate(), batch.getPaymentType());
            log.info("获取平台交易数据，数量: {}", platformData.size());

            // 更新批次统计信息
            batch.setSystemTransactionCount(systemData.size());
            batch.setPlatformTransactionCount(platformData.size());

            // 计算系统交易总金额
            BigDecimal systemTotalAmount = systemData.stream()
                    .map(item -> (BigDecimal) item.get("amount"))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            batch.setSystemTotalAmount(systemTotalAmount);

            // 计算平台交易总金额
            BigDecimal platformTotalAmount = platformData.stream()
                    .map(item -> (BigDecimal) item.get("amount"))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            batch.setPlatformTotalAmount(platformTotalAmount);

            // 执行数据比对
            matchTransactions(systemData, platformData, batchNo);

            // 统计对账结果
            Integer successCount = reconciliationMapper.countByStatus(batchNo, STATUS_SUCCESS);
            Integer failCount = reconciliationMapper.countByStatus(batchNo, STATUS_AMOUNT_DIFF) +
                    reconciliationMapper.countByStatus(batchNo, STATUS_PLATFORM_ONLY) +
                    reconciliationMapper.countByStatus(batchNo, STATUS_SYSTEM_ONLY);

            batch.setSuccessCount(successCount);
            batch.setFailCount(failCount);
            batch.setReconciliationStatus(BATCH_STATUS_COMPLETED);
            batch.setEndTime(new Date());
            batch.setUpdateTime(new Date());

            reconciliationBatchMapper.updateById(batch);
            log.info("对账任务执行完成，批次号: {}, 成功: {}, 失败: {}", batchNo, successCount, failCount);

        } catch (Exception e) {
            log.error("对账任务执行失败，批次号: {}", batchNo, e);
            // 更新批次状态为失败
            ReconciliationBatch batch = reconciliationBatchMapper.selectByBatchNo(batchNo);
            if (batch != null) {
                batch.setReconciliationStatus(BATCH_STATUS_FAILED);
                batch.setEndTime(new Date());
                batch.setUpdateTime(new Date());
                reconciliationBatchMapper.updateById(batch);
            }
        }
    }

    /**
     * 获取平台交易数据
     */
    @Autowired
    private WechatPaymentStrategy wechatPaymentStrategy;

    @Autowired
    private AlipayPaymentStrategy alipayPaymentStrategy;

    @Override
    public List<Map<String, Object>> fetchPlatformTransactions(String date, Integer paymentType) {
        log.info("获取平台交易数据，日期: {}, 支付方式: {}", date, paymentType);

        List<Map<String, Object>> transactions = new ArrayList<>();

        try {
            if (paymentType == 1) { // 微信支付
                // 调用微信支付API下载对账单
                transactions = fetchWechatPlatformTransactions(date);
            } else if (paymentType == 3) { // 支付宝支付
                // 调用支付宝支付API下载对账单
                transactions = fetchAlipayPlatformTransactions(date);
            } else if (paymentType == 2) { // 余额支付
                // 余额支付不需要从外部平台获取数据
                log.info("余额支付跳过平台数据获取");
            }
        } catch (Exception e) {
            log.error("获取平台交易数据失败，日期: {}, 支付方式: {}", date, paymentType, e);
        }

        return transactions;
    }

    /**
     * 获取微信支付平台交易数据
     */
    private List<Map<String, Object>> fetchWechatPlatformTransactions(String date) {
        log.info("获取微信支付平台交易数据，日期: {}", date);
        List<Map<String, Object>> transactions = new ArrayList<>();

        try {
            // 调用微信支付API下载对账单
            // 实际应使用微信支付SDK的downloadBill方法
            // 这里简化实现，模拟获取数据
            // 示例：WxPayDownloadBillResult billResult = wxPayService.downloadBill(request);
            
            // 模拟微信支付平台返回的交易数据
            // 实际应该解析微信支付对账单格式
            Map<String, Object> transaction1 = new HashMap<>();
            transaction1.put("transactionId", "WX" + System.currentTimeMillis());
            transaction1.put("outTradeNo", "ORDER" + System.currentTimeMillis());
            transaction1.put("amount", new BigDecimal(100));
            transaction1.put("timeEnd", date + " 10:00:00");
            transactions.add(transaction1);
            
            Map<String, Object> transaction2 = new HashMap<>();
            transaction2.put("transactionId", "WX" + (System.currentTimeMillis() + 1));
            transaction2.put("outTradeNo", "ORDER" + (System.currentTimeMillis() + 1));
            transaction2.put("amount", new BigDecimal(200));
            transaction2.put("timeEnd", date + " 11:00:00");
            transactions.add(transaction2);
            
        } catch (Exception e) {
            log.error("获取微信支付平台交易数据失败", e);
        }
        
        return transactions;
    }

    /**
     * 获取支付宝支付平台交易数据
     */
    private List<Map<String, Object>> fetchAlipayPlatformTransactions(String date) {
        log.info("获取支付宝支付平台交易数据，日期: {}", date);
        List<Map<String, Object>> transactions = new ArrayList<>();

        try {
            // 调用支付宝支付API下载对账单
            // 实际应使用支付宝SDK的downloadBill方法
            // 这里简化实现，模拟获取数据
            // 示例：AlipayDataDataserviceBillDownloadurlQueryResponse response = alipayClient.execute(request);
            
            // 模拟支付宝支付平台返回的交易数据
            // 实际应该解析支付宝对账单格式
            Map<String, Object> transaction1 = new HashMap<>();
            transaction1.put("transactionId", "ALIPAY" + System.currentTimeMillis());
            transaction1.put("outTradeNo", "ORDER" + System.currentTimeMillis());
            transaction1.put("amount", new BigDecimal(150));
            transaction1.put("timeEnd", date + " 12:00:00");
            transactions.add(transaction1);
            
            Map<String, Object> transaction2 = new HashMap<>();
            transaction2.put("transactionId", "ALIPAY" + (System.currentTimeMillis() + 1));
            transaction2.put("outTradeNo", "ORDER" + (System.currentTimeMillis() + 1));
            transaction2.put("amount", new BigDecimal(250));
            transaction2.put("timeEnd", date + " 13:00:00");
            transactions.add(transaction2);
            
        } catch (Exception e) {
            log.error("获取支付宝支付平台交易数据失败", e);
        }
        
        return transactions;
    }

    /**
     * 获取系统交易数据
     */
    @Override
    public List<Map<String, Object>> fetchSystemTransactions(String date, Integer paymentType) {
        log.info("获取系统交易数据，日期: {}, 支付方式: {}", date, paymentType);

        // 从数据库查询指定日期的支付记录
        QueryWrapper<Payment> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("payment_type", paymentType)
                .eq("status", 1) // 已支付状态
                .ge("create_time", date + " 00:00:00")
                .le("create_time", date + " 23:59:59");

        List<Payment> paymentList = paymentMapper.selectList(queryWrapper);

        // 转换为Map格式
        return paymentList.stream().map(payment -> {
            Map<String, Object> transaction = new HashMap<>();
            transaction.put("paymentNo", payment.getPaymentNo());
            transaction.put("transactionId", payment.getTransactionId());
            transaction.put("orderNo", payment.getOrderNo());
            transaction.put("amount", payment.getAmount());
            transaction.put("payTime", payment.getPayTime());
            return transaction;
        }).collect(Collectors.toList());
    }

    /**
     * 进行数据比对
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void matchTransactions(List<Map<String, Object>> systemData, 
                                 List<Map<String, Object>> platformData, 
                                 String batchNo) {
        log.info("开始数据比对，系统数据: {}, 平台数据: {}", systemData.size(), platformData.size());

        // 创建交易ID到平台数据的映射
        Map<String, Map<String, Object>> platformMap = platformData.stream()
                .collect(Collectors.toMap(
                        item -> (String) item.get("transactionId"),
                        item -> item,
                        (v1, v2) -> v1 // 处理重复键
                ));

        // 创建支付流水号到系统数据的映射
        Map<String, Map<String, Object>> systemMap = systemData.stream()
                .collect(Collectors.toMap(
                        item -> (String) item.get("paymentNo"),
                        item -> item,
                        (v1, v2) -> v1
                ));

        List<Reconciliation> reconciliationList = new ArrayList<>();

        // 比对系统数据和平台数据
        for (Map<String, Object> systemItem : systemData) {
            String paymentNo = (String) systemItem.get("paymentNo");
            String transactionId = (String) systemItem.get("transactionId");
            BigDecimal systemAmount = (BigDecimal) systemItem.get("amount");

            Reconciliation reconciliation = new Reconciliation();
            reconciliation.setBatchNo(batchNo);
            reconciliation.setPaymentNo(paymentNo);
            reconciliation.setTransactionId(transactionId);
            reconciliation.setOrderNo((String) systemItem.get("orderNo"));
            reconciliation.setOrderAmount(systemAmount);
            reconciliation.setActualAmount(systemAmount);
            reconciliation.setCreateTime(new Date());
            reconciliation.setUpdateTime(new Date());

            // 检查平台是否有对应的交易
            if (transactionId != null && platformMap.containsKey(transactionId)) {
                Map<String, Object> platformItem = platformMap.remove(transactionId);
                BigDecimal platformAmount = (BigDecimal) platformItem.get("amount");
                reconciliation.setPlatformAmount(platformAmount);

                // 比对金额
                if (systemAmount.compareTo(platformAmount) == 0) {
                    reconciliation.setReconciliationStatus(STATUS_SUCCESS);
                } else {
                    reconciliation.setReconciliationStatus(STATUS_AMOUNT_DIFF);
                    reconciliation.setDiffAmount(systemAmount.subtract(platformAmount));
                    reconciliation.setErrorReason("金额不一致");
                }
            } else {
                // 平台没有对应交易
                reconciliation.setReconciliationStatus(STATUS_SYSTEM_ONLY);
                reconciliation.setPlatformAmount(BigDecimal.ZERO);
                reconciliation.setDiffAmount(systemAmount);
                reconciliation.setErrorReason("本系统有平台无");
            }

            reconciliationList.add(reconciliation);
        }

        // 处理平台有但系统没有的交易
        for (Map<String, Object> platformItem : platformMap.values()) {
            String transactionId = (String) platformItem.get("transactionId");
            BigDecimal platformAmount = (BigDecimal) platformItem.get("amount");

            Reconciliation reconciliation = new Reconciliation();
            reconciliation.setBatchNo(batchNo);
            reconciliation.setTransactionId(transactionId);
            reconciliation.setPlatformAmount(platformAmount);
            reconciliation.setReconciliationStatus(STATUS_PLATFORM_ONLY);
            reconciliation.setOrderAmount(BigDecimal.ZERO);
            reconciliation.setActualAmount(BigDecimal.ZERO);
            reconciliation.setDiffAmount(platformAmount.negate());
            reconciliation.setErrorReason("平台有本系统无");
            reconciliation.setCreateTime(new Date());
            reconciliation.setUpdateTime(new Date());

            reconciliationList.add(reconciliation);
        }

        // 批量插入对账记录
        if (!reconciliationList.isEmpty()) {
            reconciliationMapper.batchInsert(reconciliationList);
            log.info("对账记录插入完成，数量: {}", reconciliationList.size());
        }
    }

    /**
     * 处理对账差异
     */
    @Override
    public void handleReconciliationDiff(List<Reconciliation> diffList, String batchNo) {
        log.info("处理对账差异，差异数量: {}", diffList.size());

        // 这里可以实现自动处理差异的逻辑
        // 例如：发送告警通知、创建工单等
        for (Reconciliation diff : diffList) {
            log.warn("对账差异: 批次号={}, 支付流水号={}, 状态={}, 差异金额={}",
                    batchNo, diff.getPaymentNo(), diff.getReconciliationStatus(), diff.getDiffAmount());
        }
    }

    /**
     * 生成对账报表
     */
    @Override
    public Map<String, Object> generateReconciliationReport(String batchNo) {
        log.info("生成对账报表，批次号: {}", batchNo);

        Map<String, Object> report = new HashMap<>();

        // 获取批次信息
        ReconciliationBatch batch = reconciliationBatchMapper.selectByBatchNo(batchNo);
        if (batch == null) {
            log.error("批次不存在，批次号: {}", batchNo);
            return report;
        }

        report.put("batchNo", batch.getBatchNo());
        report.put("reconciliationDate", batch.getReconciliationDate());
        report.put("paymentType", batch.getPaymentType());
        report.put("systemTransactionCount", batch.getSystemTransactionCount());
        report.put("systemTotalAmount", batch.getSystemTotalAmount());
        report.put("platformTransactionCount", batch.getPlatformTransactionCount());
        report.put("platformTotalAmount", batch.getPlatformTotalAmount());
        report.put("successCount", batch.getSuccessCount());
        report.put("failCount", batch.getFailCount());
        report.put("reconciliationStatus", batch.getReconciliationStatus());
        report.put("startTime", batch.getStartTime());
        report.put("endTime", batch.getEndTime());

        // 获取详细的差异信息
        List<Reconciliation> diffs = reconciliationMapper.selectByBatchNoAndStatus(batchNo, STATUS_AMOUNT_DIFF);
        diffs.addAll(reconciliationMapper.selectByBatchNoAndStatus(batchNo, STATUS_PLATFORM_ONLY));
        diffs.addAll(reconciliationMapper.selectByBatchNoAndStatus(batchNo, STATUS_SYSTEM_ONLY));
        report.put("diffDetails", diffs);

        return report;
    }

    /**
     * 导出对账数据
     */
    @Override
    public String exportReconciliationData(String batchNo) {
        log.info("导出对账数据，批次号: {}", batchNo);

        // 获取对账记录
        List<Reconciliation> records = reconciliationMapper.selectByBatchNo(batchNo);
        
        // 生成CSV文件
        String exportPath = "/tmp/reconciliation_" + batchNo + ".csv";
        try (FileWriter writer = new FileWriter(exportPath)) {
            // 写入表头
            writer.write("批次号,对账日期,支付方式,支付流水号,交易号,订单号,订单金额,实际金额,平台金额,对账状态,差异金额,错误原因\n");

            // 写入数据
            for (Reconciliation record : records) {
                writer.write(String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n",
                        record.getBatchNo(),
                        record.getReconciliationDate(),
                        record.getPaymentType(),
                        record.getPaymentNo(),
                        record.getTransactionId(),
                        record.getOrderNo(),
                        record.getOrderAmount(),
                        record.getActualAmount(),
                        record.getPlatformAmount(),
                        getStatusText(record.getReconciliationStatus()),
                        record.getDiffAmount(),
                        record.getErrorReason()));
            }

            log.info("对账数据导出成功，路径: {}", exportPath);
            return exportPath;
        } catch (IOException e) {
            log.error("导出对账数据失败", e);
            return null;
        }
    }

    /**
     * 查询对账批次详情
     */
    @Override
    public ReconciliationBatch getBatchByNo(String batchNo) {
        return reconciliationBatchMapper.selectByBatchNo(batchNo);
    }

    /**
     * 查询对账记录列表
     */
    @Override
    public List<Reconciliation> getReconciliationList(String batchNo, Integer status) {
        if (status == null) {
            return reconciliationMapper.selectByBatchNo(batchNo);
        }
        return reconciliationMapper.selectByBatchNoAndStatus(batchNo, status);
    }

    /**
     * 解决对账差异
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void solveReconciliationDiff(Long id, String solution, String solver) {
        log.info("解决对账差异，ID: {}, 解决人: {}", id, solver);

        reconciliationMapper.updateSolveStatus(id, SOLVE_STATUS_SOLVED, solution, solver, new Date());
    }

    /**
     * 查询未解决的对账差异
     */
    @Override
    public List<Reconciliation> getUnresolvedDiffs(Integer limit) {
        return reconciliationMapper.selectUnresolvedDiff(limit);
    }

    /**
     * 手动触发对账
     */
    @Override
    public String triggerManualReconciliation(String startDate, String endDate, Integer paymentType) {
        log.info("手动触发对账，开始日期: {}, 结束日期: {}, 支付方式: {}", startDate, endDate, paymentType);

        // 这里可以实现手动触发对账的逻辑
        // 例如：创建异步任务执行对账
        String taskId = "MANUAL_" + System.currentTimeMillis();
        
        // 模拟异步执行
        new Thread(() -> {
            try {
                // 遍历日期执行对账
                Date start = new SimpleDateFormat("yyyy-MM-dd").parse(startDate);
                Date end = new SimpleDateFormat("yyyy-MM-dd").parse(endDate);
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(start);

                while (!calendar.getTime().after(end)) {
                    String dateStr = new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime());
                    String batchNo = startReconciliation(dateStr, paymentType);
                    executeReconciliation(batchNo);
                    
                    // 下一天
                    calendar.add(Calendar.DAY_OF_MONTH, 1);
                }
            } catch (Exception e) {
                log.error("手动对账执行失败", e);
            }
        }).start();

        return taskId;
    }

    /**
     * 查询对账统计信息
     */
    @Override
    public Map<String, Object> getReconciliationStatistics(String startDate, String endDate) {
        log.info("查询对账统计信息，开始日期: {}, 结束日期: {}", startDate, endDate);

        return reconciliationMapper.countReconciliationDiff(startDate, endDate);
    }

    /**
     * 生成批次号
     */
    private String generateBatchNo(String date, Integer paymentType) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        String dateStr = sdf.format(new Date());
        String randomStr = String.format("%06d", new Random().nextInt(1000000));
        return "RCB" + dateStr + paymentType + randomStr;
    }

    /**
     * 获取状态文本
     */
    private String getStatusText(Integer status) {
        switch (status) {
            case 0: return "未对账";
            case 1: return "对账成功";
            case 2: return "金额不符";
            case 3: return "平台有本系统无";
            case 4: return "本系统有平台无";
            default: return "未知状态";
        }
    }
}