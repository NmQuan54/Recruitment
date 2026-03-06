package com.recruitment.repository;

import com.recruitment.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    List<SavedJob> findByUserIdOrderBySavedAtDesc(Long userId);

    Optional<SavedJob> findByUserIdAndJobId(Long userId, Long jobId);

    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    @Modifying
    @Transactional
    void deleteByUserIdAndJobId(Long userId, Long jobId);

    @Modifying
    @Transactional
    void deleteByJobId(Long jobId);
}
