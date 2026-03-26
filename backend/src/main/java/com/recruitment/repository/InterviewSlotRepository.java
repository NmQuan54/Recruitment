package com.recruitment.repository;

import com.recruitment.entity.InterviewSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewSlotRepository extends JpaRepository<InterviewSlot, Long> {
    List<InterviewSlot> findByApplicationId(Long applicationId);

    void deleteByApplicationId(Long applicationId);

    List<InterviewSlot> findByApplicationIdAndIsBooked(Long applicationId, boolean isBooked);
}
