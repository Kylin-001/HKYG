import java.security.SecureRandom;

public class generate_bcrypt_password {
    public static void main(String[] args) {
        String password = "123456";
        String salt = generateSalt();
        String hashedPassword = bcrypt(password, salt);
        System.out.println("Password: " + password);
        System.out.println("Hashed password: " + hashedPassword);
    }

    // 生成盐值
    private static String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        StringBuilder sb = new StringBuilder();
        for (byte b : salt) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString().substring(0, 22); // BCrypt盐值长度为22位
    }

    // 简化版BCrypt实现（仅用于测试）
    private static String bcrypt(String password, String salt) {
        // 这里使用一个简单的实现，实际项目中应使用Spring Security的BCryptPasswordEncoder
        String combined = password + "$" + salt;
        return "$2a$10$" + salt + "$" + hash(combined);
    }

    // 简单的哈希函数（仅用于测试）
    private static String hash(String input) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString().substring(0, 31); // BCrypt哈希长度为31位
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}