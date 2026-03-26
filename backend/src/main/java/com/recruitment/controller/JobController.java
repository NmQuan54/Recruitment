package com.recruitment.controller;

import com.recruitment.entity.Job;
import com.recruitment.entity.JobStatus;
import com.recruitment.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class JobController {

    @Autowired
    private JobService jobService;

    

    
    @GetMapping("/jobs")
    public ResponseEntity<Page<Job>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) BigDecimal salaryMin,
            @RequestParam(required = false) BigDecimal salaryMax,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                jobService.searchJobs(keyword, location, jobType, salaryMin, salaryMax, categoryId, companyId,
                        PageRequest.of(page, size)));
    }

    @GetMapping("/jobs/promoted")
    public ResponseEntity<Page<Job>> getPromotedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.getPromotedJobs(PageRequest.of(page, size)));
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    

    @PreAuthorize("hasRole('EMPLOYER')")
    @PostMapping("/employer/jobs")
    public ResponseEntity<Job> createJob(@RequestBody com.recruitment.dto.JobRequest request,
            Authentication authentication) {
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setDeadline(request.getDeadline());

        return ResponseEntity.ok(jobService.createJob(authentication.getName(), job, request.getCategoryIds()));
    }

    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @GetMapping("/employer/jobs")
    public ResponseEntity<List<Job>> getEmployerJobs(Authentication authentication) {
        return ResponseEntity.ok(jobService.getJobsByEmployer(authentication.getName()));
    }

    
    @PreAuthorize("hasRole('EMPLOYER')")
    @PutMapping("/employer/jobs/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @RequestBody com.recruitment.dto.JobRequest request,
            Authentication authentication) {
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setDeadline(request.getDeadline());

        return ResponseEntity.ok(jobService.updateJob(authentication.getName(), id, job, request.getCategoryIds()));
    }

    @PreAuthorize("hasRole('EMPLOYER')")
    @PutMapping("/employer/jobs/{id}/status")
    public ResponseEntity<Job> updateJobStatus(
            @PathVariable Long id,
            @RequestParam JobStatus status,
            Authentication authentication) {
        return ResponseEntity.ok(jobService.updateJobStatus(authentication.getName(), id, status));
    }



    @PreAuthorize("hasRole('EMPLOYER')")
    @DeleteMapping("/employer/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id, Authentication authentication) {
        jobService.deleteJob(authentication.getName(), id);
        return ResponseEntity.ok().build();
    }

    

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/candidate/jobs/recommendations")
    public ResponseEntity<List<Job>> getRecommendations(Authentication authentication) {
        return ResponseEntity.ok(jobService.getRecommendedJobs(authentication.getName()));
    }
}
