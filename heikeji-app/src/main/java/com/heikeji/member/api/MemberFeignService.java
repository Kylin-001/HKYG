package com.heikeji.member.api;

import com.heikeji.common.core.domain.MemberDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 会员服务Feign接口
 */
@FeignClient(name = "heikeji-member")
public interface MemberFeignService {

    /**
     * 检查用户是否存在
     */
    @GetMapping("/api/member/check")
    boolean checkUserExists(@RequestParam("userId") Long userId);

    /**
     * 获取用户信息
     */
    @GetMapping("/api/member/info")
    Object getUserInfo(@RequestParam("userId") Long userId);

    /**
     * 根据手机号获取用户信息
     */
    @GetMapping("/api/member/getByPhone")
    MemberDTO getByPhone(@RequestParam("phone") String phone);

    /**
     * 根据ID获取用户信息
     */
    @GetMapping("/api/member/getById")
    MemberDTO getById(@RequestParam("id") Long id);

    /**
     * 注册用户
     */
    @PostMapping("/api/member/register")
    boolean register(@RequestBody MemberDTO memberDTO);
}
