package com.heikeji.mall.member.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.member.dto.PointProductDTO;
import com.heikeji.mall.member.dto.PointRecordDTO;
import com.heikeji.mall.member.entity.PointProduct;
import com.heikeji.mall.member.entity.PointRecord;
import com.heikeji.mall.member.mapper.PointProductMapper;
import com.heikeji.mall.member.mapper.PointRecordMapper;
import com.heikeji.mall.member.service.PointService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PointServiceImpl extends ServiceImpl<PointRecordMapper, PointRecord> implements PointService {

    @Autowired
    private PointProductMapper pointProductMapper;

    @Override
    public Integer getUserPoints(Long userId) {
        LambdaQueryWrapper<PointRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PointRecord::getUserId, userId)
                .orderByDesc(PointRecord::getCreateTime)
                .last("LIMIT 1");

        PointRecord lastRecord = getOne(wrapper);
        return lastRecord != null ? lastRecord.getBalance() : 0;
    }

    @Override
    public List<PointRecordDTO> getUserPointRecords(Long userId, Integer type) {
        LambdaQueryWrapper<PointRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PointRecord::getUserId, userId);
        if (type != null && type > 0) {
            wrapper.eq(PointRecord::getType, type);
        }
        wrapper.orderByDesc(PointRecord::getCreateTime);

        List<PointRecord> records = list(wrapper);

        return records.stream().map(record -> {
            PointRecordDTO dto = new PointRecordDTO();
            BeanUtils.copyProperties(record, dto);
            dto.setTypeText(getTypeText(record.getType()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean addPoints(Long userId, Integer points, Integer type, String source, String orderNo, String remark) {
        if (points == null || points <= 0) {
            throw new RuntimeException("积分必须大于0");
        }

        Integer currentBalance = getUserPoints(userId);
        Integer newBalance = currentBalance + points;

        PointRecord record = new PointRecord();
        record.setUserId(userId);
        record.setPoints(points);
        record.setBalance(newBalance);
        record.setType(type);
        record.setSource(source);
        record.setOrderNo(orderNo);
        record.setRemark(remark);

        save(record);

        log.info("用户{}增加积分{}，当前余额：{}", userId, points, newBalance);
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deductPoints(Long userId, Integer points, String source, String orderNo, String remark) {
        if (points == null || points <= 0) {
            throw new RuntimeException("积分必须大于0");
        }

        Integer currentBalance = getUserPoints(userId);
        if (currentBalance < points) {
            throw new RuntimeException("积分不足");
        }

        Integer newBalance = currentBalance - points;

        PointRecord record = new PointRecord();
        record.setUserId(userId);
        record.setPoints(-points);
        record.setBalance(newBalance);
        record.setType(4);
        record.setSource(source);
        record.setOrderNo(orderNo);
        record.setRemark(remark);

        save(record);

        log.info("用户{}扣除积分{}，当前余额：{}", userId, points, newBalance);
        return true;
    }

    @Override
    public List<PointProductDTO> getPointProducts() {
        LambdaQueryWrapper<PointProduct> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PointProduct::getStatus, 1)
                .orderByDesc(PointProduct::getCreateTime);

        List<PointProduct> products = pointProductMapper.selectList(wrapper);

        return products.stream().map(product -> {
            PointProductDTO dto = new PointProductDTO();
            BeanUtils.copyProperties(product, dto);
            dto.setCanExchange(product.getStock() > 0);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public PointProductDTO getPointProductDetail(Long productId) {
        PointProduct product = pointProductMapper.selectById(productId);
        if (product == null) {
            throw new RuntimeException("积分商品不存在");
        }

        PointProductDTO dto = new PointProductDTO();
        BeanUtils.copyProperties(product, dto);
        dto.setCanExchange(product.getStock() > 0);
        return dto;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean exchangeProduct(Long userId, Long productId) {
        PointProduct product = pointProductMapper.selectById(productId);
        if (product == null) {
            throw new RuntimeException("积分商品不存在");
        }

        if (product.getStatus() != 1) {
            throw new RuntimeException("积分商品已下架");
        }

        if (product.getStock() <= 0) {
            throw new RuntimeException("积分商品库存不足");
        }

        Integer userPoints = getUserPoints(userId);
        if (userPoints < product.getPoints()) {
            throw new RuntimeException("积分不足");
        }

        deductPoints(userId, product.getPoints(), "积分兑换", null, "兑换商品：" + product.getName());

        product.setStock(product.getStock() - 1);
        product.setSoldCount(product.getSoldCount() + 1);
        pointProductMapper.updateById(product);

        log.info("用户{}兑换积分商品{}成功，消耗积分：{}", userId, productId, product.getPoints());
        return true;
    }

    private String getTypeText(Integer type) {
        switch (type) {
            case 1:
                return "订单消费";
            case 2:
                return "签到";
            case 3:
                return "活动奖励";
            case 4:
                return "积分兑换";
            case 5:
                return "系统调整";
            default:
                return "其他";
        }
    }
}
