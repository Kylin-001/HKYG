package com.heikeji.common.core.aspect;

import cn.hutool.core.text.StrMatcher;
import cn.hutool.core.text.StrPool;
import cn.hutool.core.util.EscapeUtil;
import com.heikeji.common.core.annotation.ParamValidation;
import com.heikeji.common.core.annotation.SqlInjectionCheck;
import com.heikeji.common.core.web.ApiResult;
import com.heikeji.common.core.web.ApiResultUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 参数校验切面
 * 
 * @author Administrator
 * @date 2024年01月01日
 */
@Aspect
@Component
@Order(1) // 设置为最高优先级
public class ParamValidateAspect {

    private static final Logger log = LoggerFactory.getLogger(ParamValidateAspect.class);

    /**
     * 执行的环绕通知
     */
    @Around("@annotation(com.heikeji.common.core.annotation.ParamValidation)")
    public Object executeValidate(ProceedingJoinPoint joinPoint) throws Throwable {
        // 获取方法
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Object[] args = joinPoint.getArgs();
        
        // 检查是否需要SQL注入检查
        if (method.isAnnotationPresent(SqlInjectionCheck.class)) {
            List<String> injectionWarnings = checkSqlInjection(args);
            if (!injectionWarnings.isEmpty()) {
                log.warn("检测到潜在的SQL注入攻击: {}", injectionWarnings);
                return ApiResultUtils.error("检测到非法参数，请检查输入内容");
            }
        }
        
        // 这里可以添加其他参数校验逻辑
        
        // 执行原方法
        return joinPoint.proceed();
    }

    /**
     * 执行SQL注入检查
     */
    private List<String> checkSqlInjection(Object[] args) {
        List<String> warnings = new ArrayList<>();
        
        // SQL注入攻击的常见关键字
        String[] dangerousKeywords = {
            "select", "insert", "update", "delete", "drop", "create", "alter", "exec",
            "script", "javascript:", "vbscript:", "onload", "onerror", "<script>",
            "union", "or", "and", "1=1", "true or", "' or ", "1' or ", "--", "/*", "*/"
        };
        
        for (Object arg : args) {
            if (arg == null) continue;
            
            String argStr = arg.toString();
            
            // 检查是否包含危险关键词
            for (String keyword : dangerousKeywords) {
                if (argStr.toLowerCase().contains(keyword.toLowerCase())) {
                    warnings.add(String.format("参数中包含潜在危险的SQL关键词: %s", keyword));
                }
            }
            
            // 检查是否包含特殊字符模式
            if (isSuspiciousPattern(argStr)) {
                warnings.add(String.format("参数包含可疑的字符模式: %s", argStr));
            }
        }
        
        return warnings;
    }

    /**
     * 检查可疑模式
     */
    private boolean isSuspiciousPattern(String input) {
        // 常见的可疑模式
        String[] patterns = {
            // 注释符
            "--.*",
            "/\\*.*\\*/",
            "//.*",
            "#.*",
            
            // SQL关键字模式
            "select.*from",
            "insert.*into",
            "update.*set",
            "delete.*from",
            "drop.*table",
            "create.*table",
            "union.*select",
            
            // 逻辑运算符
            "or\\s+['\"\\d].*['\"\\d]",
            "and\\s+['\"\\d].*['\"\\d]",
            
            // 脚本标签
            "<script[^>]*>.*</script>",
            "javascript:",
            "vbscript:",
            
            // 特殊字符组合
            "['\"].*['\"].*['\"].*['\"]",
            "\\\\x[0-9a-fA-F]{2}",
            
            // 函数调用
            "\\b(charlength|char)\\(",
            "\\b(substring|mid|left|right)\\(",
            "\\b(ascii|char)\\(",
            
            // 系统表/函数访问
            "information_schema",
            "sys\\.",
            "master\\.",
            "xp_cmdshell",
            "sp_executesql"
        };
        
        for (String pattern : patterns) {
            if (input.matches("(?i)" + pattern)) {
                return true;
            }
        }
        
        return false;
    }
}