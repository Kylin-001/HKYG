package com.heikeji.mall.user.component;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 密码强度验证组件测试
 * 
 * @author heikeji
 * @date 2024-12-19
 */
@ExtendWith(MockitoExtension.class)
public class PasswordStrengthCheckerTest {

    private PasswordStrengthChecker passwordStrengthChecker;
    
    @BeforeEach
    void setUp() {
        passwordStrengthChecker = new PasswordStrengthChecker();
    }

    @Test
    public void testEmptyPassword() {
        PasswordStrengthChecker.StrengthLevel result = passwordStrengthChecker.checkPasswordStrength("");
        assertEquals(PasswordStrengthChecker.StrengthLevel.WEAK, result);
    }

    @Test
    public void testNullPassword() {
        PasswordStrengthChecker.StrengthLevel result = passwordStrengthChecker.checkPasswordStrength(null);
        assertEquals(PasswordStrengthChecker.StrengthLevel.WEAK, result);
    }

    @Test
    public void testWeakPassword() {
        PasswordStrengthChecker.StrengthLevel result = passwordStrengthChecker.checkPasswordStrength("123456");
        assertEquals(PasswordStrengthChecker.StrengthLevel.WEAK, result);
    }

    @Test
    public void testSimplePassword() {
        PasswordStrengthChecker.StrengthLevel result = passwordStrengthChecker.checkPasswordStrength("password");
        assertEquals(PasswordStrengthChecker.StrengthLevel.WEAK, result);
    }

    @Test
    public void testMediumPassword() {
        PasswordStrengthChecker.StrengthLevel result = passwordStrengthChecker.checkPasswordStrength("Password123");
        assertEquals(PasswordStrengthChecker.StrengthLevel.MEDIUM, result);
    }

    @Test
    public void testStrongPassword() {
        PasswordStrengthChecker.StrengthLevel result = passwordStrengthChecker.checkPasswordStrength("StrongPass@123");
        assertEquals(PasswordStrengthChecker.StrengthLevel.STRONG, result);
    }

    @Test
    public void testVeryStrongPassword() {
        PasswordStrengthChecker.StrengthLevel result = passwordStrengthChecker.checkPasswordStrength("MyVeryStrongPassword@2024!");
        assertEquals(PasswordStrengthChecker.StrengthLevel.STRONG, result);
    }

    @Test
    public void testGenerateStrongPassword() {
        String generatedPassword = passwordStrengthChecker.generateStrongPassword();
        
        // 检查密码长度
        assertTrue(generatedPassword.length() >= 12);
        
        // 检查是否包含大写字母
        assertTrue(generatedPassword.chars().anyMatch(Character::isUpperCase));
        
        // 检查是否包含小写字母
        assertTrue(generatedPassword.chars().anyMatch(Character::isLowerCase));
        
        // 检查是否包含数字
        assertTrue(generatedPassword.chars().anyMatch(Character::isDigit));
        
        // 检查是否包含特殊字符
        assertTrue(generatedPassword.chars().anyMatch(ch -> "!@#$%^&*()_+-=[]{}|;:,.<>?".indexOf(ch) >= 0));
    }

    @Test
    public void testValidatePassword() {
        // 测试无效密码
        assertFalse(passwordStrengthChecker.validatePassword("123456")); // 长度不足
        assertFalse(passwordStrengthChecker.validatePassword("password")); // 只有小写字母
        assertFalse(passwordStrengthChecker.validatePassword("PASSWORD")); // 只有大写字母
        assertFalse(passwordStrengthChecker.validatePassword("12345678")); // 只有数字
        
        // 测试有效密码
        assertTrue(passwordStrengthChecker.validatePassword("Password123")); // 包含大写字母、小写字母和数字
        assertTrue(passwordStrengthChecker.validatePassword("password@123")); // 包含小写字母、数字和特殊字符
        assertTrue(passwordStrengthChecker.validatePassword("Password@123")); // 包含三种字符类型
    }
}