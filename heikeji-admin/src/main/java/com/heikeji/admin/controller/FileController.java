package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.entity.FileRecord;
import com.heikeji.admin.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * 文件管理控制器
 */
@Tag(name = "文件管理")
@RestController
@RequestMapping("/api/file")
public class FileController {

    @Autowired
    private FileService fileService;

    /**
     * 分页查询文件列表
     */
    @Operation(summary = "分页查询文件列表")
    @GetMapping("/list")
    public R list(@Parameter(description = "查询参数") @RequestParam Map<String, Object> params) {
        Map<String, Object> result = fileService.pageFile(params);
        return R.ok().data(result);
    }

    /**
     * 根据ID获取文件详情
     */
    @Operation(summary = "根据ID获取文件详情")
    @GetMapping("/{id}")
    public R getById(@Parameter(description = "文件ID") @PathVariable("id") Long id) {
        FileRecord file = fileService.getFileById(id);
        if (file == null) {
            return R.error(404, "文件不存在");
        }
        return R.ok().data(file);
    }

    /**
     * 上传文件
     */
    @Operation(summary = "上传文件")
    @PostMapping("/upload")
    public R upload(
            @Parameter(description = "文件") @RequestParam("file") MultipartFile file,
            @Parameter(description = "模块名称") @RequestParam(defaultValue = "default") String module,
            @Parameter(description = "用户ID") @RequestParam(defaultValue = "1") Long userId,
            @Parameter(description = "用户名") @RequestParam(defaultValue = "admin") String userName) {
        try {
            FileRecord record = fileService.uploadFile(file, module, userId, userName);
            return R.ok("上传成功").data(record);
        } catch (RuntimeException e) {
            return R.error(500, e.getMessage());
        }
    }

    /**
     * 批量上传文件
     */
    @Operation(summary = "批量上传文件")
    @PostMapping("/batchUpload")
    public R batchUpload(
            @Parameter(description = "文件列表") @RequestParam("files") MultipartFile[] files,
            @Parameter(description = "模块名称") @RequestParam(defaultValue = "default") String module,
            @Parameter(description = "用户ID") @RequestParam(defaultValue = "1") Long userId,
            @Parameter(description = "用户名") @RequestParam(defaultValue = "admin") String userName) {
        try {
            List<FileRecord> records = fileService.batchUploadFile(files, module, userId, userName);
            return R.ok("批量上传成功").data(records);
        } catch (RuntimeException e) {
            return R.error(500, e.getMessage());
        }
    }

    /**
     * 删除文件
     */
    @Operation(summary = "删除文件")
    @DeleteMapping("/{id}")
    public R delete(@Parameter(description = "文件ID") @PathVariable("id") Long id) {
        try {
            boolean success = fileService.deleteFile(id);
            if (success) {
                return R.ok("删除成功");
            } else {
                return R.error(500, "删除失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "删除失败");
        }
    }

    /**
     * 批量删除文件
     */
    @Operation(summary = "批量删除文件")
    @DeleteMapping("/batch")
    public R batchDelete(@Parameter(description = "文件ID列表") @RequestBody List<Long> ids) {
        try {
            if (ids == null || ids.isEmpty()) {
                return R.error(400, "请选择要删除的文件");
            }
            boolean success = fileService.batchDeleteFile(ids);
            if (success) {
                return R.ok("批量删除成功");
            } else {
                return R.error(500, "批量删除失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "批量删除失败");
        }
    }

    /**
     * 更新文件状态
     */
    @Operation(summary = "更新文件状态")
    @PutMapping("/{id}/status")
    public R updateStatus(@Parameter(description = "文件ID") @PathVariable("id") Long id,
                          @Parameter(description = "状态 0禁用 1启用") @RequestParam Integer status) {
        try {
            boolean success = fileService.updateFileStatus(id, status);
            if (success) {
                return R.ok("修改状态成功");
            } else {
                return R.error(500, "修改状态失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "修改状态失败");
        }
    }

    /**
     * 按文件类型统计
     */
    @Operation(summary = "按文件类型统计")
    @GetMapping("/statistics/type")
    public R countByFileType() {
        List<Map<String, Object>> result = fileService.countByFileType();
        return R.ok().data(result);
    }

    /**
     * 按模块统计
     */
    @Operation(summary = "按模块统计")
    @GetMapping("/statistics/module")
    public R countByModule() {
        List<Map<String, Object>> result = fileService.countByModule();
        return R.ok().data(result);
    }

    /**
     * 统计总文件大小
     */
    @Operation(summary = "统计总文件大小")
    @GetMapping("/statistics/size")
    public R sumFileSize() {
        Long size = fileService.sumFileSize();
        return R.ok().data(size != null ? size : 0);
    }
}
