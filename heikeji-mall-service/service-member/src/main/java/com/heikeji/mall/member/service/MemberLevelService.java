package com.heikeji.mall.member.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.member.dto.MemberLevelDTO;
import com.heikeji.mall.member.entity.MemberLevel;

import java.util.List;

public interface MemberLevelService extends IService<MemberLevel> {
    
    List<MemberLevelDTO> getAllLevels();
    
    MemberLevelDTO getCurrentLevel(Long userId);
    
    MemberLevelDTO getLevelByPoints(Integer points);
    
    boolean checkAndUpgrade(Long userId, Integer currentPoints);
}
