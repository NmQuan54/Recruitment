package com.recruitment.controller;

import com.recruitment.entity.User;
import com.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (payload.containsKey("fullName"))
            user.setFullName(payload.get("fullName"));
        if (payload.containsKey("phone"))
            user.setPhone(payload.get("phone"));
        if (payload.containsKey("avatarUrl"))
            user.setAvatarUrl(payload.get("avatarUrl"));

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<User> getMe(Authentication authentication) {
        return ResponseEntity.ok(userRepository.findByEmail(authentication.getName()).orElseThrow());
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody Map<String, String> payload,
            Authentication authentication) {

        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        if (currentPassword == null || newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Mật khẩu mới phải có ít nhất 6 ký tự"));
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Mật khẩu hiện tại không đúng"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công!"));
    }
}
