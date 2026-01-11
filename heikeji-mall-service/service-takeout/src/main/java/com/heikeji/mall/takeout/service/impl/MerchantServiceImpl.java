package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.takeout.entity.Merchant;
import com.heikeji.mall.takeout.mapper.MerchantMapper;
import com.heikeji.mall.takeout.service.MerchantService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

/**
 * 商家服务实现类
 */
@Service
public class MerchantServiceImpl extends ServiceImpl<MerchantMapper, Merchant> implements MerchantService {

    @Override
    public List<Merchant> getActiveMerchants() {
        QueryWrapper<Merchant> wrapper = new QueryWrapper<>();
        wrapper.eq("status", 1) // 营业中
               .orderByDesc("sales");
        return this.list(wrapper);
    }

    @Override
    public Page<Merchant> pageMerchants(Page<Merchant> page) {
        QueryWrapper<Merchant> wrapper = new QueryWrapper<>();
        wrapper.orderByDesc("sales");
        return this.page(page, wrapper);
    }

    @Override
    public List<Merchant> searchMerchants(String keyword) {
        QueryWrapper<Merchant> wrapper = new QueryWrapper<>();
        wrapper.like("name", keyword)
               .or().like("description", keyword)
               .orderByDesc("sales");
        return this.list(wrapper);
    }

    @Override
    public boolean merchantEntry(Merchant merchant) {
        // 设置默认值
        merchant.setRating(BigDecimal.valueOf(5.0)); // 初始评分5.0
        merchant.setSales(0); // 初始销量0
        merchant.setStatus(1); // 初始状态营业中
        merchant.setCreateTime(new Date());
        merchant.setUpdateTime(new Date());
        return this.save(merchant);
    }

    @Override
    public boolean updateMerchantInfo(Merchant merchant) {
        merchant.setUpdateTime(new Date());
        return this.updateById(merchant);
    }

    @Override
    public boolean updateMerchantStatus(Long id, Integer status) {
        // 检查状态合法性
        if (status != 0 && status != 1) {
            return false;
        }
        Merchant merchant = new Merchant();
        merchant.setId(id);
        merchant.setStatus(status);
        merchant.setUpdateTime(new Date());
        return this.updateById(merchant);
    }

    @Override
    public boolean deleteMerchant(Long id) {
        return this.removeById(id);
    }

    @Override
    public Map<String, Object> getMerchantStats(Long merchantId) {
        Map<String, Object> stats = new HashMap<>();
        // 模拟数据，实际应该从数据库查询
        stats.put("totalOrders", 1250);
        stats.put("totalSales", new BigDecimal(89500.75));
        stats.put("avgRating", new BigDecimal(4.8));
        stats.put("activeProducts", 158);
        stats.put("todayOrders", 45);
        stats.put("todaySales", new BigDecimal(3200.50));
        stats.put("totalUsers", 8500);
        return stats;
    }

    @Override
    public Map<String, Object> getMerchantOrderStats(Long merchantId, String startTime, String endTime) {
        Map<String, Object> stats = new HashMap<>();
        // 模拟数据，实际应该从数据库查询
        List<Map<String, Object>> orderTrend = new ArrayList<>();
        orderTrend.add(new HashMap<String, Object>() {{ put("date", "2024-01-01"); put("orders", 35); put("sales", 2500.00); }});
        orderTrend.add(new HashMap<String, Object>() {{ put("date", "2024-01-02"); put("orders", 42); put("sales", 2980.50); }});
        orderTrend.add(new HashMap<String, Object>() {{ put("date", "2024-01-03"); put("orders", 45); put("sales", 3200.75); }});
        orderTrend.add(new HashMap<String, Object>() {{ put("date", "2024-01-04"); put("orders", 38); put("sales", 2750.25); }});
        orderTrend.add(new HashMap<String, Object>() {{ put("date", "2024-01-05"); put("orders", 50); put("sales", 3580.00); }});
        stats.put("orderTrend", orderTrend);
        stats.put("startTime", startTime);
        stats.put("endTime", endTime);
        return stats;
    }

    @Override
    public Map<String, Object> getMerchantSalesStats(Long merchantId, String startTime, String endTime) {
        Map<String, Object> stats = new HashMap<>();
        // 模拟数据，实际应该从数据库查询
        Map<String, Object> categorySales = new HashMap<>();
        categorySales.put("主食", new BigDecimal(45000.00));
        categorySales.put("小吃", new BigDecimal(25000.00));
        categorySales.put("饮品", new BigDecimal(15000.00));
        categorySales.put("其他", new BigDecimal(4500.75));
        stats.put("categorySales", categorySales);
        stats.put("startTime", startTime);
        stats.put("endTime", endTime);
        return stats;
    }

    @Override
    public Map<String, Object> getMerchantRatingStats(Long merchantId) {
        Map<String, Object> stats = new HashMap<>();
        // 模拟数据，实际应该从数据库查询
        Map<String, Integer> ratingDistribution = new HashMap<>();
        ratingDistribution.put("5", 1050);
        ratingDistribution.put("4", 180);
        ratingDistribution.put("3", 15);
        ratingDistribution.put("2", 3);
        ratingDistribution.put("1", 2);
        stats.put("ratingDistribution", ratingDistribution);
        stats.put("totalReviews", 1250);
        stats.put("avgRating", new BigDecimal(4.8));
        return stats;
    }

    @Override
    public boolean batchUpdateMerchantStatus(List<Long> ids, Integer status) {
        // 检查状态合法性
        if (status != 0 && status != 1) {
            return false;
        }
        // 批量更新状态
        for (Long id : ids) {
            updateMerchantStatus(id, status);
        }
        return true;
    }

    @Override
    public Map<String, Object> getMerchantDetailWithStats(Long merchantId) {
        Merchant merchant = this.getById(merchantId);
        if (merchant == null) {
            return null;
        }
        Map<String, Object> detail = new HashMap<>();
        detail.put("merchantInfo", merchant);
        detail.put("stats", getMerchantStats(merchantId));
        return detail;
    }

}