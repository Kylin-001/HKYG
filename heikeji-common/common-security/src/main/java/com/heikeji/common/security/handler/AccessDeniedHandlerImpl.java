package com.heikeji.common.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heikeji.common.core.utils.ApiResultUtils;
import com.heikeji.common.core.domain.R;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * 访问被拒绝处理类
 * 用于处理用户没有权限访问某个资源时的异常
 */
@Component
public class AccessDeniedHandlerImpl implements AccessDeniedHandler {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        // 设置响应状态码为403
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        // 设置响应内容类型
        response.setContentType("application/json;charset=utf-8");
        // 获取输出流
        PrintWriter out = response.getWriter();
        // 构建响应结果
        R<String> result = ApiResultUtils.forbidden("用户没有权限访问该资源");
        // 将R对象转换为JSON字符串
        String jsonResult = objectMapper.writeValueAsString(result);
        // 输出响应结果
        out.write(jsonResult);
        // 刷新输出流
        out.flush();
        // 关闭输出流
        out.close();
    }
}
