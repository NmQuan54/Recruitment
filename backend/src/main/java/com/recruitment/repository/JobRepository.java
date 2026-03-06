package com.recruitment.repository;

import com.recruitment.entity.Job;
import com.recruitment.entity.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

        Page<Job> findByStatus(JobStatus status, Pageable pageable);

        List<Job> findByCompanyId(Long companyId);

        
        @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' " +
                        "AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
                        "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
                        "ORDER BY j.isPromoted DESC, j.createdAt DESC")
        Page<Job> searchJobs(@Param("keyword") String keyword,
                        @Param("location") String location,
                        Pageable pageable);

        
        @Query("SELECT j FROM Job j LEFT JOIN j.categories c WHERE j.status = 'ACTIVE' " +
                        "AND (:keyword IS NULL OR :keyword = '' OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) "
                        +
                        "   OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
                        "AND (:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) "
                        +
                        "AND (:jobType IS NULL OR :jobType = '' OR CAST(j.jobType AS string) = :jobType) " +
                        "AND (:salaryMin IS NULL OR j.salaryMax >= :salaryMin) " +
                        "AND (:salaryMax IS NULL OR j.salaryMin <= :salaryMax) " +
                        "AND (:categoryId IS NULL OR c.id = :categoryId) " +
                        "AND (:companyId IS NULL OR j.company.id = :companyId) " +
                        "ORDER BY j.isPromoted DESC, j.createdAt DESC")
        Page<Job> searchJobsAdvanced(
                        @Param("keyword") String keyword,
                        @Param("location") String location,
                        @Param("jobType") String jobType,
                        @Param("salaryMin") BigDecimal salaryMin,
                        @Param("salaryMax") BigDecimal salaryMax,
                        @Param("categoryId") Long categoryId,
                        @Param("companyId") Long companyId,
                        Pageable pageable);

        @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' " +
                        "AND (LOWER(j.title) LIKE LOWER(CONCAT('%', :skill, '%')) " +
                        "OR LOWER(j.description) LIKE LOWER(CONCAT('%', :skill, '%')) " +
                        "OR LOWER(j.requirements) LIKE LOWER(CONCAT('%', :skill, '%'))) " +
                        "ORDER BY j.isPromoted DESC, j.createdAt DESC")
        List<Job> findRecommendations(@Param("skill") String skill);
}
