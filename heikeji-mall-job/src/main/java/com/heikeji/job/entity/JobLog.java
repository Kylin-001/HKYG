package com.heikeji.job.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 任务日志实体类
 * 记录定时任务的执行情况
 * 
 * @author heikeji
 */
@Data
public class JobLog implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 任务日志ID
     */
    private Long id;

    /**
     * 任务名称
     */
    private String jobName;

    /**
     * 任务组
     */
    private String jobGroup;

    /**
     * 任务参数
     */
    private String jobParams;

    /**
     * 执行开始时间
     */
    private Date startTime;

    /**
     * 执行结束时间
     */
    private Date endTime;

    /**
     * 执行耗时（毫秒）
     */
    private Long executeTime;

    /**
     * 执行状态：0-成功，1-失败
     */
    private Integer status;

    /**
     * 执行结果
     */
    private String result;

    /**
     * 错误信息
     */
    private String errorMsg;

    /**
     * 创建时间
     */
    private Date createTime;
}
