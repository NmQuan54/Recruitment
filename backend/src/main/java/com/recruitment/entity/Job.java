package com.recruitment.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Formula;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnoreProperties({ "user", "hibernateLazyInitializer", "handler" })
    private Company company;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type")
    private JobType jobType;

    @Column(name = "salary_min")
    private BigDecimal salaryMin;

    @Column(name = "salary_max")
    private BigDecimal salaryMax;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status = JobStatus.ACTIVE;

    @Builder.Default
    @Column(name = "is_promoted")
    private boolean isPromoted = false;

    @Column(name = "promotion_expiry")
    private LocalDateTime promotionExpiry;

    @Column(name = "promotion_package_name")
    private String promotionPackageName;

    private LocalDate deadline;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Formula("(SELECT COUNT(*) FROM applications a WHERE a.job_id = id)")
    private Integer applicantCount;

    @Formula("(SELECT COUNT(*) FROM applications a WHERE a.job_id = id AND a.status = 'PENDING')")
    private Integer pendingCount;

    @ManyToMany
    @JoinTable(name = "job_categories", joinColumns = @JoinColumn(name = "job_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null)
            status = JobStatus.ACTIVE;
    }
}
