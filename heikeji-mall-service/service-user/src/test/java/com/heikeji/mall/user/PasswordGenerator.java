package com.heikeji.mall.user;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "admin123";
        String hashed = encoder.encode(password);
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hashed);

        // Verify
        boolean matches = encoder.matches(password, hashed);
        System.out.println("Verification: " + matches);
    }
}
