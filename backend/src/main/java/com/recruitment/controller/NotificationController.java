package com.recruitment.controller;

import com.recruitment.entity.Notification;
import com.recruitment.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getNotifications(authentication.getName()));
    }

    
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        long count = notificationService.countUnread(authentication.getName());
        return ResponseEntity.ok(Map.of("count", count));
    }

    
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markRead(
            @PathVariable Long id,
            Authentication authentication) {
        notificationService.markRead(authentication.getName(), id);
        return ResponseEntity.ok().build();
    }

    
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllRead(Authentication authentication) {
        notificationService.markAllRead(authentication.getName());
        return ResponseEntity.ok().build();
    }
}
