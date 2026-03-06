package com.recruitment.dto;

import com.recruitment.entity.JobStatus;
import com.recruitment.entity.JobType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class JobRequest {
    private String title;
    private String description;
    private String requirements;
    private String location;
    private JobType jobType;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private java.time.LocalDate deadline;
    private List<Long> categoryIds;
}
