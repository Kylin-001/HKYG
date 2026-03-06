package com.heikeji.mall.member.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.member.dto.MarketingActivityDTO;
import com.heikeji.mall.member.entity.MarketingActivity;

import java.util.List;

public interface MarketingActivityService extends IService<MarketingActivity> {
    
    List<MarketingActivityDTO> getAvailableActivities(Long userId);
    
    MarketingActivityDTO getActivityDetail(Long activityId, Long userId);
    
    boolean participateActivity(Long activityId, Long userId);
    
    boolean completeActivity(Long activityId, Long userId);
}
