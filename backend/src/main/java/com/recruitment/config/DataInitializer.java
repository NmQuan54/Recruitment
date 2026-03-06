package com.recruitment.config;

import com.recruitment.entity.Role;
import com.recruitment.entity.User;
import com.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra xem tài khoản admin đã tồn tại chưa
        String adminEmail = "admin@gmail.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .email(adminEmail)
                    .fullName("System Administrator")
                    .password(passwordEncoder.encode("0905622341luan"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();

            userRepository.save(admin);
            System.out.println(">>> Đã tạo tài khoản Admin mặc định: " + adminEmail);
        } else {
            System.out.println(">>> Tài khoản Admin đã tồn tại.");
        }
    }
}
