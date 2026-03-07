package com.recruitment.repository;

import com.recruitment.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);

    @Modifying
    @Transactional
    void deleteByJobId(Long jobId);

    List<Application> findByCandidateIdOrderByAppliedAtDesc(Long candidateId);

    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);

    long countByJobIdAndCandidateIdAndAppliedAtAfter(Long jobId, Long candidateId, LocalDateTime since);

    @Query("SELECT a FROM Application a WHERE a.job.company.user.email = :email ORDER BY a.appliedAt DESC")
    List<Application> findAllByEmployerEmail(@Param("email") String email);
}
