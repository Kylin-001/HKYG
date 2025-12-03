package com.heikeji.app.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.heikeji.app.config.AppVersionConfig;
import com.heikeji.app.model.response.AppResponse;

import java.util.HashMap;
import java.util.Map;

/**
 * 版本控制器
 * 处理APP版本检查和更新功能
 */
@RestController
@RequestMapping("/api/app/version")
@Api(tags = "版本管理")
public class VersionController {

    @Autowired
    private AppVersionConfig appVersionConfig;

    /**
     * 检查APP版本更新
     */
    @GetMapping("/check")
    @ApiOperation("检查版本更新")
    public AppResponse<?> checkVersion(
            @RequestParam String version,
            @RequestParam(defaultValue = "android") String platform) {
        
        // 构建返回数据
        Map<String, Object> data = new HashMap<>();
        data.put("latestVersion", appVersionConfig.getLatest());
        data.put("currentVersion", version);
        data.put("updateDescription", appVersionConfig.getUpdateDescription());
        data.put("forceUpdate", appVersionConfig.isForceUpdate());
        
        // 设置下载地址
        if ("android".equals(platform)) {
            data.put("downloadUrl", appVersionConfig.getAndroidDownloadUrl());
        } else if ("ios".equals(platform)) {
            data.put("downloadUrl", appVersionConfig.getIosDownloadUrl());
        }
        
        // 判断是否需要更新
        boolean needUpdate = compareVersion(version, appVersionConfig.getLatest()) < 0;
        data.put("needUpdate", needUpdate);
        
        // 判断是否最低版本
        boolean needForceUpdate = compareVersion(version, appVersionConfig.getMin()) < 0;
        data.put("needForceUpdate", needForceUpdate);
        
        return AppResponse.success(data);
    }
    
    /**
     * 版本比较
     * @param version1 版本1
     * @param version2 版本2
     * @return version1 < version2 返回 -1
     *         version1 = version2 返回 0
     *         version1 > version2 返回 1
     */
    private int compareVersion(String version1, String version2) {
        if (version1.equals(version2)) {
            return 0;
        }
        
        String[] v1 = version1.split("\\.");
        String[] v2 = version2.split("\\.");
        
        int minLength = Math.min(v1.length, v2.length);
        for (int i = 0; i < minLength; i++) {
            int num1 = Integer.parseInt(v1[i]);
            int num2 = Integer.parseInt(v2[i]);
            
            if (num1 < num2) {
                return -1;
            } else if (num1 > num2) {
                return 1;
            }
        }
        
        // 如果前面的版本号都相同，则长度较长的版本号更大
        if (v1.length < v2.length) {
            return -1;
        } else if (v1.length > v2.length) {
            return 1;
        }
        
        return 0;
    }
}