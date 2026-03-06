package com.heikeji.mall.member.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.member.dto.MemberLevelDTO;
import com.heikeji.mall.member.entity.MemberLevel;
import com.heikeji.mall.member.entity.UserLevelRecord;
import com.heikeji.mall.member.mapper.MemberLevelMapper;
import com.heikeji.mall.member.mapper.UserLevelRecordMapper;
import com.heikeji.mall.member.service.MemberLevelService;
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
public class MemberLevelServiceImpl extends ServiceImpl<MemberLevelMapper, MemberLevel> implements MemberLevelService {

    @Autowired
    private UserLevelRecordMapper userLevelRecordMapper;

    @Autowired
    private PointService pointService;

    @Override
    public List<MemberLevelDTO> getAllLevels() {
        LambdaQueryWrapper<MemberLevel> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MemberLevel::getStatus, 1)
                .orderByAsc(MemberLevel::getSort);

        List<MemberLevel> levels = list(wrapper);

        return levels.stream().map(level -> {
            MemberLevelDTO dto = new MemberLevelDTO();
            BeanUtils.copyProperties(level, dto);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public MemberLevelDTO getCurrentLevel(Long userId) {
        Integer userPoints = pointService.getUserPoints(userId);
        MemberLevel level = getLevelByPointsInternal(userPoints);

        if (level == null) {
            return null;
        }

        MemberLevelDTO dto = new MemberLevelDTO();
        BeanUtils.copyProperties(level, dto);
        dto.setIsCurrent(true);
        return dto;
    }

    @Override
    public MemberLevelDTO getLevelByPoints(Integer points) {
        MemberLevel level = getLevelByPointsInternal(points);

        if (level == null) {
            return null;
        }

        MemberLevelDTO dto = new MemberLevelDTO();
        BeanUtils.copyProperties(level, dto);
        return dto;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean checkAndUpgrade(Long userId, Integer currentPoints) {
        LambdaQueryWrapper<UserLevelRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserLevelRecord::getUserId, userId)
                .orderByDesc(UserLevelRecord::getUpgradeTime)
                .last("LIMIT 1");

        UserLevelRecord lastRecord = userLevelRecordMapper.selectOne(wrapper);

        MemberLevel currentLevel = null;
        if (lastRecord != null) {
            currentLevel = getById(lastRecord.getLevelId());
        }

        MemberLevel newLevel = getLevelByPointsInternal(currentPoints);

        if (newLevel == null) {
            return false;
        }

        if (currentLevel == null) {
            UserLevelRecord record = new UserLevelRecord();
            record.setUserId(userId);
            record.setLevelId(newLevel.getId());
            record.setPoints(currentPoints);
            userLevelRecordMapper.insert(record);

            log.info("用户{}首次成为{}会员，积分：{}", userId, newLevel.getName(), currentPoints);
            return true;
        }

        if (!currentLevel.getId().equals(newLevel.getId()) && 
            currentPoints >= newLevel.getMinPoints()) {
            
            UserLevelRecord record = new UserLevelRecord();
            record.setUserId(userId);
            record.setLevelId(newLevel.getId());
            record.setPoints(currentPoints);
            userLevelRecordMapper.insert(record);

            log.info("用户{}从{}升级为{}会员，积分：{}", userId, currentLevel.getName(), newLevel.getName(), currentPoints);
            return true;
        }

        return false;
    }

    private MemberLevel getLevelByPointsInternal(Integer points) {
        LambdaQueryWrapper<MemberLevel> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MemberLevel::getStatus, 1)
                .le(MemberLevel::getMinPoints, points)
                .and(w -> w.isNull(MemberLevel::getMaxPoints)
                           .or().ge(MemberLevel::getMaxPoints, points))
                .orderByDesc(MemberLevel::getMinPoints)
                .last("LIMIT 1");

        return getOne(wrapper);
    }
}
