package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.takeout.entity.Merchant;
import com.heikeji.mall.takeout.mapper.MerchantMapper;
import com.heikeji.mall.takeout.service.MerchantService;
import org.springframework.stereotype.Service;

import java.util.List;

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

}