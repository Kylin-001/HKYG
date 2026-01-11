package com.heikeji.common.core.validation.validator;

import com.heikeji.common.core.validation.annotation.StudentNo;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Set;

/**
 * 学号校验器测试类
 * 测试StudentNoValidator的各种校验场景
 */
public class StudentNoValidatorTest {

    private Validator validator;

    @BeforeEach
    public void setup() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    /**
     * 测试有效学号格式
     */
    @Test
    public void testValidStudentNo() {
        // 测试纯数字格式
        TestBean bean1 = new TestBean();
        bean1.setStudentNo("2021001001");
        Set<ConstraintViolation<TestBean>> violations1 = validator.validate(bean1);
        assertTrue(violations1.isEmpty(), "纯数字格式学号应该通过校验");

        // 测试字母前缀格式
        TestBean bean2 = new TestBean();
        bean2.setStudentNo("USTH2021001");
        Set<ConstraintViolation<TestBean>> violations2 = validator.validate(bean2);
        assertTrue(violations2.isEmpty(), "字母前缀格式学号应该通过校验");
    }

    /**
     * 测试无效学号格式
     */
    @Test
    public void testInvalidStudentNo() {
        // 测试太短的学号
        TestBean bean1 = new TestBean();
        bean1.setStudentNo("12345");
        Set<ConstraintViolation<TestBean>> violations1 = validator.validate(bean1);
        assertFalse(violations1.isEmpty(), "太短的学号应该校验失败");

        // 测试包含特殊字符的学号
        TestBean bean2 = new TestBean();
        bean2.setStudentNo("2021001@001");
        Set<ConstraintViolation<TestBean>> violations2 = validator.validate(bean2);
        assertFalse(violations2.isEmpty(), "包含特殊字符的学号应该校验失败");

        // 测试纯字母的学号
        TestBean bean3 = new TestBean();
        bean3.setStudentNo("ABCDEF");
        Set<ConstraintViolation<TestBean>> violations3 = validator.validate(bean3);
        assertFalse(violations3.isEmpty(), "纯字母的学号应该校验失败");

        // 测试数字开头、字母结尾的学号
        TestBean bean4 = new TestBean();
        bean4.setStudentNo("2021001A");
        Set<ConstraintViolation<TestBean>> violations4 = validator.validate(bean4);
        assertFalse(violations4.isEmpty(), "数字开头、字母结尾的学号应该校验失败");
    }

    /**
     * 测试空值校验
     */
    @Test
    public void testNullValue() {
        // 测试不允许空值的情况
        TestBean bean1 = new TestBean();
        bean1.setStudentNo(null);
        Set<ConstraintViolation<TestBean>> violations1 = validator.validate(bean1);
        assertFalse(violations1.isEmpty(), "不允许空值时，null应该校验失败");

        // 测试允许空值的情况
        TestAllowEmptyBean bean2 = new TestAllowEmptyBean();
        bean2.setStudentNo(null);
        Set<ConstraintViolation<TestAllowEmptyBean>> violations2 = validator.validate(bean2);
        assertTrue(violations2.isEmpty(), "允许空值时，null应该通过校验");
    }

    /**
     * 测试类，用于验证默认的StudentNo注解（不允许空值）
     */
    private static class TestBean {
        @StudentNo
        private String studentNo;

        public void setStudentNo(String studentNo) {
            this.studentNo = studentNo;
        }
    }

    /**
     * 测试类，用于验证允许空值的StudentNo注解
     */
    private static class TestAllowEmptyBean {
        @StudentNo(allowEmpty = true)
        private String studentNo;

        public void setStudentNo(String studentNo) {
            this.studentNo = studentNo;
        }
    }
}