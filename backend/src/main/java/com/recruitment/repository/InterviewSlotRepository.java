package com.recruitment.repository;

import com.recruitment.entity.InterviewSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface InterviewSlotRepository extends JpaRepository<InterviewSlot, Long> {
    List<InterviewSlot> findByApplicationId(Long applicationId);

    @Modifying
    @Transactional
    void deleteByApplicationId(Long applicationId);

    @Modifying
    @Transactional
    @Query("DELETE FROM InterviewSlot m WHERE m.application.job.id = :jobId")
    void deleteByJobId(@Param("jobId") Long jobId);

    List<InterviewSlot> findByApplicationIdAndIsBooked(Long applicationId, boolean isBooked);
}
