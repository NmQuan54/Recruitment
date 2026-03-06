package com.recruitment.controller;

import com.recruitment.entity.ChatMessage;
import com.recruitment.entity.ChatRoom;
import com.recruitment.entity.User;
import com.recruitment.repository.UserRepository;
import com.recruitment.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoom>> getRooms(Authentication authentication) {
        User user = findUser(authentication.getName());
        return ResponseEntity.ok(chatService.getUserRooms(user.getId()));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/rooms/unread-counts")
    public ResponseEntity<Map<Long, Long>> getUnreadCounts(Authentication authentication) {
        User user = findUser(authentication.getName());
        return ResponseEntity.ok(chatService.getUnreadCountsPerRoom(user));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/rooms/{roomId}/read")
    public ResponseEntity<?> markRoomAsRead(@PathVariable Long roomId, Authentication authentication) {
        User user = findUser(authentication.getName());
        chatService.markRoomAsRead(roomId, user.getId());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable Long roomId) {
        return ResponseEntity.ok(chatService.getRoomMessages(roomId));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoom> getOrCreateRoom(
            @RequestBody Map<String, Long> payload) {
        return ResponseEntity.ok(chatService.getOrCreateRoom(
                payload.get("employerId"),
                payload.get("candidateId"),
                payload.get("jobId")));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/rooms/{roomId}/messages")
    public ResponseEntity<ChatMessage> sendMessage(
            @PathVariable Long roomId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        User user = findUser(authentication.getName());
        return ResponseEntity.ok(chatService.sendMessage(roomId, user.getId(), payload.get("content")));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }
}
