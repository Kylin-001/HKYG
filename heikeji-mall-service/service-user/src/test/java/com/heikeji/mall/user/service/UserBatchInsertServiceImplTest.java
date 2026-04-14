package com.heikeji.mall.user.service;

import com.heikeji.mall.common.Result;
import com.heikeji.mall.user.dto.UserBatchInsertDTO;
import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.mapper.UserMapper;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * 用户批量插入服务单元测试
 *
 * 测试覆盖：
 * 1. 单条插入 - 成功/失败场景
 * 2. 批量插入 - 全成功/全失败/部分成功
 * 3. 数据验证 - 唯一性约束
 * 4. 异常处理 - 各种异常情况
 * 5. 边界条件 - 空数据、超大数据量
 */
class UserBatchInsertServiceImplTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserBatchInsertServiceImpl service;

    private AutoCloseable mocks;

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
    }

    @AfterEach
    void tearDown() throws Exception {
        if (mocks != null) {
            mocks.close();
        }
    }

    @Test
    @DisplayName("单条插入 - 成功场景")
    void testInsertSingle_Success() {
        when(userMapper.exists(any())).thenReturn(false);
        when(userMapper.insert(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            ReflectionTestUtils.setField(user, "id", 100L);
            return 1;
        });

        UserBatchInsertDTO dto = createValidUserDTO("testuser", "2026001001");

        Result<User> result = service.insertSingle(dto);

        assertTrue(result.isSuccess());
        assertNotNull(result.getData());
        assertEquals(100L, result.getData().getId());
        assertEquals("testuser", result.getData().getUsername());

        verify(passwordEncoder, times(1)).encode("TestPassword123");
        verify(userMapper, times(1)).insert(any(User.class));
    }

    @Test
    @DisplayName("单条插入 - 用户名重复")
    void testInsertSingle_DuplicateUsername() {
        when(userMapper.exists(any())).thenReturn(true);

        UserBatchInsertDTO dto = createValidUserDTO("existing_user", "2026001001");

        assertThrows(RuntimeException.class, () -> service.insertSingle(dto));
    }

    @Test
    @DisplayName("单条插入 - 学号重复")
    void testInsertSingle_DuplicateStudentNo() {
        when(userMapper.exists(any()))
                .thenReturn(false)
                .thenReturn(true);

        UserBatchInsertDTO dto = createValidUserDTO("new_user", "existing_student_no");

        assertThrows(DuplicateKeyException.class, () -> service.insertSingle(dto));
    }

    @Test
    @DisplayName("批量插入 - 全部成功")
    void testInsertBatch_AllSuccess() {
        when(userMapper.exists(any())).thenReturn(false);
        when(userMapper.insert(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            ReflectionTestUtils.setField(user, "id", System.currentTimeMillis());
            return 1;
        });

        List<UserBatchInsertDTO> dtos = Arrays.asList(
                createValidUserDTO("batch1", "2026010001"),
                createValidUserDTO("batch2", "2026010002"),
                createValidUserDTO("batch3", "2026010003")
        );

        Result<List<User>> result = service.insertBatch(dtos);

        assertTrue(result.isSuccess());
        assertNotNull(result.getData());
        assertEquals(3, result.getData().size());
        verify(userMapper, times(3)).insert(any(User.class));
    }

    @Test
    @DisplayName("批量插入 - 部分成功")
    void testInsertBatch_PartialSuccess() {
        when(userMapper.exists(any()))
                .thenReturn(false)
                .thenReturn(true)
                .thenReturn(false);
        when(userMapper.insert(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            ReflectionTestUtils.setField(user, "id", System.currentTimeMillis());
            return 1;
        });

        List<UserBatchInsertDTO> dtos = Arrays.asList(
                createValidUserDTO("ok1", "2026010001"),
                createValidUserDTO("dup_user", "2026010002"),
                createValidUserDTO("ok2", "2026010003")
        );

        Result<List<User>> result = service.insertBatch(dtos);

        assertTrue(result.isSuccess());
        assertEquals(2, result.getData().size());
        assertTrue(result.getMessage().contains("部分成功"));
        assertTrue(result.getMessage().contains("失败1条"));
    }

    @Test
    @DisplayName("批量插入 - 空列表")
    void testInsertBatch_EmptyList() {
        Result<List<User>> result = service.insertBatch(new ArrayList<>());

        assertFalse(result.isSuccess());
        assertTrue(result.getMessage().contains("不能为空"));
    }

    @Test
    @DisplayName("批量插入 - 超过最大数量限制")
    void testInsertBatch_ExceedsMaxSize() {
        List<UserBatchInsertDTO> largeList = new ArrayList<>();
        for (int i = 0; i < 101; i++) {
            largeList.add(createValidUserDTO("user" + i, "2026010" + String.format("%03d", i)));
        }

        Result<List<User>> result = service.insertBatch(largeList);

        assertFalse(result.isSuccess());
        assertTrue(result.getMessage().contains("不能超过100条"));
    }

    @Test
    @DisplayName("密码加密验证")
    void testPasswordEncryption() {
        when(userMapper.exists(any())).thenReturn(false);
        when(userMapper.insert(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            ReflectionTestUtils.setField(user, "id", 1L);
            return 1;
        });

        UserBatchInsertDTO dto = createValidUserDTO("secure_user", "2026001999");
        dto.setPassword("MySecurePassword123!");

        service.insertSingle(dto);

        verify(passwordEncoder).encode("MySecurePassword123!");
    }

    @Test
    @DisplayName("默认值设置验证")
    void testDefaultValues() {
        when(userMapper.exists(any())).thenReturn(false);
        when(userMapper.insert(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            ReflectionTestUtils.setField(user, "id", 1L);
            return 1;
        });

        UserBatchInsertDTO dto = new UserBatchInsertDTO();
        dto.setUsername("default_test");
        dto.setPassword("pass123");
        dto.setStudentNo("2026001001");
        dto.setNickname("默认用户");

        Result<User> result = service.insertSingle(dto);

        assertTrue(result.isSuccess());
        assertEquals(Integer.valueOf(0), result.getData().getStatus());
    }

    private UserBatchInsertDTO createValidUserDTO(String username, String studentNo) {
        UserBatchInsertDTO dto = new UserBatchInsertDTO();
        dto.setUsername(username);
        dto.setPassword("TestPassword123");
        dto.setStudentNo(studentNo);
        dto.setNickname(username + "_nickname");
        dto.setPhone("138" + String.format("%08d", Math.abs(username.hashCode() % 100000000)));
        dto.setSex(1);
        dto.setEmail(username + "@test.com");
        dto.setStatus(0);
        dto.setBalance(BigDecimal.ZERO);
        dto.setScore(0);
        dto.setCollege("计算机学院");
        dto.setMajor("软件工程");
        dto.setGrade("2026");
        return dto;
    }
}
