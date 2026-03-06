package com.recruitment.repository;

import com.recruitment.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByRoomIdOrderBySentAtAsc(Long roomId);

    long countByRoomIdAndIsReadFalseAndSenderIdNot(Long roomId, Long currentUserId);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.room.id = :roomId AND m.sender.id != :currentUserId AND m.isRead = false")
    void markAllAsRead(@Param("roomId") Long roomId, @Param("currentUserId") Long currentUserId);

    @Modifying
    @Query("DELETE FROM ChatMessage m WHERE m.room.job.id = :jobId")
    void deleteByRoomJobId(@Param("jobId") Long jobId);
}
