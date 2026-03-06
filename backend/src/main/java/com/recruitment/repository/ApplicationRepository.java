package com.recruitment.repository;

import com.recruitment.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobId(Long jobId);

    List<Application> findByCandidateId(Long candidateId);

    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);

    @Query("SELECT a FROM Application a WHERE a.job.company.user.email = :email")
    List<Application> findAllByEmployerEmail(@Param("email") String email);
}
