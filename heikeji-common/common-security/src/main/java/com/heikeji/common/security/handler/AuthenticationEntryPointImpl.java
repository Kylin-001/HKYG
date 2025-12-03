package com.heikeji.common.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heikeji.common.core.utils.ApiResultUtils;
import com.heikeji.common.core.domain.R;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * 未授权处理类
 * 用于处理用户未登录或登录过期时的异常
 */
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        // 设置响应状态码为401
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        // 设置响应内容类型
        response.setContentType("application/json;charset=utf-8");
        // 获取输出流
        PrintWriter out = response.getWriter();
        // 构建响应结果
        R<String> result = ApiResultUtils.unauthorized("用户未登录或登录已过期，请重新登录");
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
