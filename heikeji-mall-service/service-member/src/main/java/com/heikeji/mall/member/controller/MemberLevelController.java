package com.heikeji.mall.member.controller;

import com.heikeji.mall.common.core.result.Result;
import com.heikeji.mall.member.dto.MemberLevelDTO;
import com.heikeji.mall.member.service.MemberLevelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/member/level")
@Tag(name = "会员等级管理", description = "会员等级相关接口")
public class MemberLevelController {

    @Autowired
    private MemberLevelService memberLevelService;

    @GetMapping("/list")
    @Operation(summary = "获取所有会员等级")
    public Result<List<MemberLevelDTO>> getAllLevels() {
        List<MemberLevelDTO> levels = memberLevelService.getAllLevels();
        return Result.success(levels);
    }

    @GetMapping("/current")
    @Operation(summary = "获取用户当前等级")
    public Result<MemberLevelDTO> getCurrentLevel(
            @Parameter(description = "用户ID") @RequestParam Long userId) {
        MemberLevelDTO level = memberLevelService.getCurrentLevel(userId);
        return Result.success(level);
    }

    @GetMapping("/check")
    @Operation(summary = "检查并升级会员等级")
    public Result<Boolean> checkAndUpgrade(
            @Parameter(description = "用户ID") @RequestParam Long userId,
            @Parameter(description = "当前积分") @RequestParam Integer currentPoints) {
        boolean upgraded = memberLevelService.checkAndUpgrade(userId, currentPoints);
        return Result.success(upgraded);
    }
}
