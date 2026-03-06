package com.recruitment.service;

import com.recruitment.entity.Notification;
import com.recruitment.entity.User;
import com.recruitment.repository.NotificationRepository;
import com.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy tất cả thông báo của user đang đăng nhập
     */
    public List<Notification> getNotifications(String email) {
        User user = findUser(email);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    /**
     * Đếm số thông báo chưa đọc – dùng để hiển thị badge
     */
    public long countUnread(String email) {
        User user = findUser(email);
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    /**
     * Đánh dấu 1 thông báo đã đọc
     */
    @Transactional
    public void markRead(String email, Long notificationId) {
        User user = findUser(email);
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));
        if (!n.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Không có quyền");
        }
        n.setRead(true);
        notificationRepository.save(n);
    }

    /**
     * Đánh dấu toàn bộ thông báo là đã đọc
     */
    @Transactional
    public void markAllRead(String email) {
        User user = findUser(email);
        notificationRepository.markAllReadByUserId(user.getId());
    }

    /**
     * Tạo thông báo – được gọi từ các Service khác (VD: ApplicationService)
     */
    @Transactional
    public Notification createNotification(User recipient, String type, String title,
            String message, Long referenceId) {
        Notification n = Notification.builder()
                .user(recipient)
                .type(type)
                .title(title)
                .message(message)
                .referenceId(referenceId)
                .build();
        return notificationRepository.save(n);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + email));
    }
}
