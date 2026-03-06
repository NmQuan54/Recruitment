package com.recruitment.repository;

import com.recruitment.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByEmployerIdOrCandidateIdOrderByLastContentAtDesc(Long employerId, Long candidateId);

    Optional<ChatRoom> findByEmployerIdAndCandidateIdAndJobId(Long employerId, Long candidateId, Long jobId);

    @Modifying
    @Transactional
    void deleteByJobId(Long jobId);
}
