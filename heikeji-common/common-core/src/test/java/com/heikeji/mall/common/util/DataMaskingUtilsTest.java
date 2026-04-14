package com.heikeji.mall.common.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 数据脱敏工具类单元测试
 *
 * 测试覆盖所有脱敏方法的各种边界情况
 */
class DataMaskingUtilsTest {

    @ParameterizedTest
    @CsvSource({
            "13812345678, 138****5678",
            "15900001111, 159****1111",
            "18666668888, 186****8888",
            "19987654321, 199****4321"
    })
    @DisplayName("手机号脱敏 - 正常格式")
    void testMaskPhone_ValidFormat(String phone, String expected) {
        assertEquals(expected, DataMaskingUtils.maskPhone(phone));
    }

    @Test
    @DisplayName("手机号脱敏 - 过短号码")
    void testMaskPhone_TooShort() {
        assertEquals("****", DataMaskingUtils.maskPhone("138"));
        assertEquals("****", DataMaskingUtils.maskPhone(""));
    }

    @Test
    @DisplayName("手机号脱敏 - null值")
    void testMaskPhone_Null() {
        assertNull(DataMaskingUtils.maskPhone(null));
    }

    @ParameterizedTest
    @CsvSource({
            "test@example.com, tes***@example.com",
            "ab@gmail.com, ab***@gmail.com",
            "longusername@company.com, lon***@company.com"
    })
    @DisplayName("邮箱脱敏 - 正常格式")
    void testMaskEmail_ValidFormat(String email, String expected) {
        assertEquals(expected, DataMaskingUtils.maskEmail(email));
    }

    @Test
    @DisplayName("邮箱脱敏 - 无效格式")
    void testMaskEmail_InvalidFormat() {
        assertEquals("***@***", DataMaskingUtils.maskEmail("invalid"));
    }

    @ParameterizedTest
    @CsvSource({
            "110101199001011234, 110101********1234",
            "320102198512345678, 320102********5678"
    })
    @DisplayName("身份证号脱敏 - 18位")
    void testMaskIdCard_18Digits(String idCard, String expected) {
        assertEquals(expected, DataMaskingUtils.maskIdCard(idCard));
    }

    @Test
    @DisplayName("身份证号脱敏 - 15位")
    void testMaskIdCard_15Digits() {
        assertEquals("110101*****2345", DataMaskingUtils.maskIdCard("1101019001012345"));
    }

    @ParameterizedTest
    @CsvSource({
            "6222021234567890123, '6222 **** **** 0123'",
            "6228480402564890018, '6228 **** **** 0018'"
    })
    @DisplayName("银行卡号脱敏")
    void testMaskBankCard(String cardNo, String expected) {
        assertEquals(expected, DataMaskingUtils.maskBankCard(cardNo));
    }

    @ParameterizedTest
    @CsvSource({
            "张三, 张*",
            "李四, 李**",
            "欧阳锋, 欧阳**"
    })
    @DisplayName("中文姓名脱敏")
    void testMaskChineseName(String name, String expected) {
        assertEquals(expected, DataMaskingUtils.maskChineseName(name));
    }

    @Test
    @DisplayName("中文姓名脱敏 - 单字姓名")
    void testMaskChineseName_SingleChar() {
        assertEquals("*", DataMaskingUtils.maskChineseName("王"));
    }

    @Test
    @DisplayName("地址脱敏")
    void testMaskAddress() {
        String address = "北京市海淀区中关村大街1号";
        String masked = DataMaskingUtils.maskAddress(address);
        assertTrue(masked.contains("******"));
        assertFalse(masked.equals(address));
    }

    @Test
    @DisplayName("密码隐藏")
    void testMaskPassword() {
        assertEquals("******", DataMaskingUtils.maskPassword());
    }

    @Test
    @DisplayName("自动识别脱敏 - 手机号")
    void testAutoMask_PhoneNumber() {
        assertEquals("139****5678", DataMaskingUtils.autoMask("13912345678"));
    }

    @Test
    @DisplayName("自动识别脱敏 - 邮箱")
    void testAutoMask_Email() {
        assertTrue(DataMaskingUtils.autoMask("user@test.com").contains("***@"));
    }

    @Test
    @DisplayName("自动识别脱敏 - 身份证")
    void testAutoMask_IdCard() {
        assertTrue(DataMaskingUtils.autoMask("110101199001011234").contains("********"));
    }

    @NullAndEmptySource
    @ParameterizedTest
    @DisplayName("null和空值处理")
    void testAutoMask_NullAndEmpty(String input) {
        assertEquals(input, DataMaskingUtils.autoMask(input));
    }

    @ValueSource(strings = {"普通文本", "hello world", "ABC123"})
    @ParameterizedTest
    @DisplayName("非敏感数据不脱敏")
    void testAutoMask_NonSensitiveData(String data) {
        assertEquals(data, DataMaskingUtils.autoMask(data));
    }
}
