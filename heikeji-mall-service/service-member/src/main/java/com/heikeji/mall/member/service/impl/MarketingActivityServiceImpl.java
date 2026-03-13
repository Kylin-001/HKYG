package com.heikeji.mall.member.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.member.dto.MarketingActivityDTO;
import com.heikeji.mall.member.entity.MarketingActivity;
import com.heikeji.mall.member.entity.UserActivityRecord;
import com.heikeji.mall.member.mapper.MarketingActivityMapper;
import com.heikeji.mall.member.mapper.UserActivityRecordMapper;
import com.heikeji.mall.member.service.MarketingActivityService;
import com.heikeji.mall.member.service.PointService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MarketingActivityServiceImpl extends ServiceImpl<MarketingActivityMapper, MarketingActivity> implements MarketingActivityService {

    @Autowired
    private UserActivityRecordMapper userActivityRecordMapper;

    @Autowired
    private PointService pointService;

    @Autowired
    private com.heikeji.mall.member.mapper.MarketingActivityMapper marketingActivityMapper;

    @Override
    public List<MarketingActivityDTO> getAvailableActivities(Long userId) {
        LambdaQueryWrapper<MarketingActivity> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(MarketingActivity::getStatus, 0, 1)
                .le(MarketingActivity::getStartTime, LocalDateTime.now())
                .ge(MarketingActivity::getEndTime, LocalDateTime.now())
                .orderByDesc(MarketingActivity::getCreateTime);

        List<MarketingActivity> activities = marketingActivityMapper.selectList(wrapper);

        return activities.stream().map(activity -> {
            MarketingActivityDTO dto = new MarketingActivityDTO();
            BeanUtils.copyProperties(activity, dto);

            LambdaQueryWrapper<UserActivityRecord> recordWrapper = new LambdaQueryWrapper<>();
            recordWrapper.eq(UserActivityRecord::getUserId, userId)
                    .eq(UserActivityRecord::getActivityId, activity.getId());
            UserActivityRecord record = userActivityRecordMapper.selectOne(recordWrapper);

            dto.setCanParticipate(record == null);
            dto.setIsCompleted(record != null && record.getStatus() == 1);

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public MarketingActivityDTO getActivityDetail(Long activityId, Long userId) {
        MarketingActivity activity = marketingActivityMapper.selectById(activityId);
        if (activity == null) {
            throw new RuntimeException("营销活动不存在");
        }

        MarketingActivityDTO dto = new MarketingActivityDTO();
        BeanUtils.copyProperties(activity, dto);

        LambdaQueryWrapper<UserActivityRecord> recordWrapper = new LambdaQueryWrapper<>();
        recordWrapper.eq(UserActivityRecord::getUserId, userId)
                .eq(UserActivityRecord::getActivityId, activityId);
        UserActivityRecord record = userActivityRecordMapper.selectOne(recordWrapper);

        dto.setCanParticipate(record == null);
        dto.setIsCompleted(record != null && record.getStatus() == 1);

        return dto;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean participateActivity(Long activityId, Long userId) {
        MarketingActivity activity = marketingActivityMapper.selectById(activityId);
        if (activity == null) {
            throw new RuntimeException("营销活动不存在");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(activity.getStartTime()) || now.isAfter(activity.getEndTime())) {
            throw new RuntimeException("活动不在参与时间范围内");
        }

        if (activity.getStatus() != 1) {
            throw new RuntimeException("活动未开始或已结束");
        }

        LambdaQueryWrapper<UserActivityRecord> recordWrapper = new LambdaQueryWrapper<>();
        recordWrapper.eq(UserActivityRecord::getUserId, userId)
                .eq(UserActivityRecord::getActivityId, activityId);
        UserActivityRecord existingRecord = userActivityRecordMapper.selectOne(recordWrapper);

        if (existingRecord != null) {
            throw new RuntimeException("已参与过该活动");
        }

        UserActivityRecord record = new UserActivityRecord();
        record.setUserId(userId);
        record.setActivityId(activityId);
        record.setStatus(0);
        userActivityRecordMapper.insert(record);

        log.info("用户{}参与营销活动{}成功", userId, activityId);
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean completeActivity(Long activityId, Long userId) {
        MarketingActivity activity = marketingActivityMapper.selectById(activityId);
        if (activity == null) {
            throw new RuntimeException("营销活动不存在");
        }

        LambdaQueryWrapper<UserActivityRecord> recordWrapper = new LambdaQueryWrapper<>();
        recordWrapper.eq(UserActivityRecord::getUserId, userId)
                .eq(UserActivityRecord::getActivityId, activityId);
        UserActivityRecord record = userActivityRecordMapper.selectOne(recordWrapper);

        if (record == null) {
            throw new RuntimeException("未参与该活动");
        }

        if (record.getStatus() == 1) {
            throw new RuntimeException("活动已完成");
        }

        record.setStatus(1);
        record.setCompleteTime(LocalDateTime.now());
        userActivityRecordMapper.updateById(record);

        if (activity.getType() == 2) {
            pointService.addPoints(userId, 100, 3, "活动奖励", null, "完成营销活动：" + activity.getName());
        }

        log.info("用户{}完成营销活动{}成功", userId, activityId);
        return true;
    }
}
