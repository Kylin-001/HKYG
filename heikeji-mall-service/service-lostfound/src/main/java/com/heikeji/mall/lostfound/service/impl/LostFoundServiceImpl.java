package com.heikeji.mall.lostfound.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.lostfound.entity.LostFound;
import com.heikeji.mall.lostfound.mapper.LostFoundMapper;
import com.heikeji.mall.lostfound.service.LostFoundService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * 失物招领服务实现类
 */
@Service
@Slf4j
public class LostFoundServiceImpl extends ServiceImpl<LostFoundMapper, LostFound> implements LostFoundService {

    @Autowired
    private LostFoundMapper lostFoundMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long publishLostFound(LostFound lostFound) {
        // 设置默认值
        lostFound.setStatus(0); // 待审核
        lostFound.setViewCount(0);
        lostFound.setCommentCount(0);
        lostFound.setCreateTime(new Date());
        lostFound.setUpdateTime(new Date());
        lostFound.setDelFlag(0);

        // 保存失物招领信息
        lostFoundMapper.insert(lostFound);
        return lostFound.getId();
    }

    @Override
    public LostFound getLostFoundDetail(Long id) {
        // 先从Redis获取
        String redisKey = "lostfound:detail:" + id;
        LostFound lostFound = (LostFound) redisTemplate.opsForValue().get(redisKey);

        if (lostFound == null) {
            // 从数据库获取
            lostFound = lostFoundMapper.selectById(id);
            if (lostFound != null) {
                // 存入Redis，过期时间1小时
                redisTemplate.opsForValue().set(redisKey, lostFound, 1, TimeUnit.HOURS);
            }
        }

        // 增加浏览量
        increaseViewCount(id);

        return lostFound;
    }

    @Override
    public List<LostFound> getLostFoundList(Map<String, Object> params) {
        // 构建查询条件
        QueryWrapper<LostFound> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("del_flag", 0);
        queryWrapper.eq("status", 1); // 只查询已发布的信息

        // 类型筛选
        if (params.containsKey("type")) {
            queryWrapper.eq("type", params.get("type"));
        }

        // 分类筛选
        if (params.containsKey("categoryId")) {
            queryWrapper.eq("category_id", params.get("categoryId"));
        }

        // 排序
        if (params.containsKey("sort")) {
            String sort = (String) params.get("sort");
            switch (sort) {
                case "newest":
                    queryWrapper.orderByDesc("create_time");
                    break;
                case "hot":
                    queryWrapper.orderByDesc("view_count");
                    break;
                default:
                    queryWrapper.orderByDesc("create_time");
            }
        } else {
            queryWrapper.orderByDesc("create_time");
        }

        return lostFoundMapper.selectList(queryWrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean auditLostFound(Long id, Integer status, String auditRemark) {
        LostFound lostFound = new LostFound();
        lostFound.setId(id);
        lostFound.setStatus(status);
        lostFound.setAuditRemark(auditRemark);
        lostFound.setUpdateTime(new Date());

        int result = lostFoundMapper.updateById(lostFound);

        // 清除Redis缓存
        String redisKey = "lostfound:detail:" + id;
        redisTemplate.delete(redisKey);

        return result > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateLostFoundStatus(Long id, Integer status) {
        LostFound lostFound = new LostFound();
        lostFound.setId(id);
        lostFound.setStatus(status);
        lostFound.setUpdateTime(new Date());

        int result = lostFoundMapper.updateById(lostFound);

        // 清除Redis缓存
        String redisKey = "lostfound:detail:" + id;
        redisTemplate.delete(redisKey);

        return result > 0;
    }

    @Override
    public void increaseViewCount(Long id) {
        // 异步增加浏览量，减少主流程耗时
        new Thread(() -> {
            // 更新数据库
            lostFoundMapper.increaseViewCount(id);

            // 更新Redis缓存
            String redisKey = "lostfound:detail:" + id;
            LostFound lostFound = (LostFound) redisTemplate.opsForValue().get(redisKey);
            if (lostFound != null) {
                lostFound.setViewCount(lostFound.getViewCount() + 1);
                redisTemplate.opsForValue().set(redisKey, lostFound, 1, TimeUnit.HOURS);
            }
        }).start();
    }

    @Override
    public List<LostFound> getHotLostFound(Integer limit) {
        // 先从Redis获取
        String redisKey = "lostfound:hot:" + limit;
        List<LostFound> hotLostFound = (List<LostFound>) redisTemplate.opsForValue().get(redisKey);

        if (hotLostFound == null) {
            // 从数据库获取
            QueryWrapper<LostFound> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("del_flag", 0);
            queryWrapper.eq("status", 1); // 只查询已发布的信息
            queryWrapper.orderByDesc("view_count");
            queryWrapper.last("LIMIT " + limit);

            hotLostFound = lostFoundMapper.selectList(queryWrapper);

            if (hotLostFound != null && !hotLostFound.isEmpty()) {
                // 存入Redis，过期时间1小时
                redisTemplate.opsForValue().set(redisKey, hotLostFound, 1, TimeUnit.HOURS);
            }
        }

        return hotLostFound;
    }

    @Override
    public Map<String, Object> searchLostFound(String keyword, Integer type, Long categoryId, String sort, Integer page, Integer size) {
        // 构建查询条件
        QueryWrapper<LostFound> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("del_flag", 0);
        queryWrapper.eq("status", 1); // 只查询已发布的信息

        // 关键词搜索
        if (keyword != null && !keyword.isEmpty()) {
            queryWrapper.and(wrapper -> wrapper.like("title", keyword).or().like("content", keyword));
        }

        // 类型筛选
        if (type != null) {
            queryWrapper.eq("type", type);
        }

        // 分类筛选
        if (categoryId != null) {
            queryWrapper.eq("category_id", categoryId);
        }

        // 排序
        if (sort != null) {
            switch (sort) {
                case "newest":
                    queryWrapper.orderByDesc("create_time");
                    break;
                case "hot":
                    queryWrapper.orderByDesc("view_count");
                    break;
                default:
                    queryWrapper.orderByDesc("create_time");
            }
        } else {
            queryWrapper.orderByDesc("create_time");
        }

        // 分页查询
        Page<LostFound> pageParam = new Page<>(page, size);
        IPage<LostFound> lostFoundPage = lostFoundMapper.selectPage(pageParam, queryWrapper);

        // 构建返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("records", lostFoundPage.getRecords());
        result.put("total", lostFoundPage.getTotal());
        result.put("pages", lostFoundPage.getPages());
        result.put("current", lostFoundPage.getCurrent());
        result.put("size", lostFoundPage.getSize());

        return result;
    }
}
