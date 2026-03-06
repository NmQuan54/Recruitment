package com.recruitment.service;

import com.recruitment.entity.*;
import com.recruitment.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private NotificationService notificationService;

    
    @Transactional
    public ChatRoom getOrCreateRoom(Long employerId, Long candidateId, Long jobId) {
        return chatRoomRepository.findByEmployerIdAndCandidateIdAndJobId(employerId, candidateId, jobId)
                .orElseGet(() -> {
                    User employer = userRepository.findById(employerId).orElseThrow();
                    User candidate = userRepository.findById(candidateId).orElseThrow();
                    Job job = jobRepository.findById(jobId).orElseThrow();
                    return chatRoomRepository.save(ChatRoom.builder()
                            .employer(employer)
                            .candidate(candidate)
                            .job(job)
                            .lastContentAt(LocalDateTime.now())
                            .build());
                });
    }

    
    @Transactional
    public ChatMessage sendMessage(Long roomId, Long senderId, String content) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow();
        User sender = userRepository.findById(senderId).orElseThrow();

        ChatMessage message = chatMessageRepository.save(ChatMessage.builder()
                .room(room)
                .sender(sender)
                .content(content)
                .build());

        room.setLastMessage(content);
        room.setLastContentAt(LocalDateTime.now());
        chatRoomRepository.save(room);

        
        User recipient = room.getEmployer().getId().equals(senderId) ? room.getCandidate() : room.getEmployer();
        notificationService.createNotification(
                recipient,
                "CHAT_MESSAGE",
                "Tin nhắn mới từ " + sender.getFullName(),
                content.length() > 50 ? content.substring(0, 47) + "..." : content,
                roomId);

        return message;
    }

    public List<ChatRoom> getUserRooms(Long userId) {
        return chatRoomRepository.findByEmployerIdOrCandidateIdOrderByLastContentAtDesc(userId, userId);
    }

    public List<ChatMessage> getRoomMessages(Long roomId) {
        return chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId);
    }

    public java.util.Map<Long, Long> getUnreadCountsPerRoom(User user) {
        List<ChatRoom> rooms = getUserRooms(user.getId());
        java.util.Map<Long, Long> counts = new java.util.HashMap<>();
        for (ChatRoom room : rooms) {
            long count = chatMessageRepository.countByRoomIdAndIsReadFalseAndSenderIdNot(room.getId(), user.getId());
            counts.put(room.getId(), count);
        }
        return counts;
    }

    @Transactional
    public void markRoomAsRead(Long roomId, Long userId) {
        chatMessageRepository.markAllAsRead(roomId, userId);
    }
}
