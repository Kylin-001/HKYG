package com.heikeji.mall.member.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.member.dto.PointProductDTO;
import com.heikeji.mall.member.dto.PointRecordDTO;
import com.heikeji.mall.member.entity.PointRecord;

import java.util.List;

public interface PointService extends IService<PointRecord> {
    
    Integer getUserPoints(Long userId);
    
    List<PointRecordDTO> getUserPointRecords(Long userId, Integer type);
    
    boolean addPoints(Long userId, Integer points, Integer type, String source, String orderNo, String remark);
    
    boolean deductPoints(Long userId, Integer points, String source, String orderNo, String remark);
    
    List<PointProductDTO> getPointProducts();
    
    PointProductDTO getPointProductDetail(Long productId);
    
    boolean exchangeProduct(Long userId, Long productId);
}
