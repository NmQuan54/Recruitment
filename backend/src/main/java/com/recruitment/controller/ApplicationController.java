package com.recruitment.controller;

import com.recruitment.entity.Application;
import com.recruitment.entity.ApplicationStatus;
import com.recruitment.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // Candidate applies for a job
    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("/candidate/jobs/{jobId}/apply")
    public ResponseEntity<Application> applyForJob(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {

        String coverLetter = payload.get("coverLetter");
        String resumeUrl = payload.get("resumeUrl");

        return ResponseEntity
                .ok(applicationService.applyForJob(authentication.getName(), jobId, coverLetter, resumeUrl));
    }

    // Candidate views their applications
    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/candidate/applications")
    public ResponseEntity<List<Application>> getCandidateApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getCandidateApplications(authentication.getName()));
    }

    // Employer views applications for a job
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @GetMapping("/employer/jobs/{jobId}/applications")
    public ResponseEntity<List<Application>> getJobApplications(
            @PathVariable Long jobId,
            Authentication authentication) {
        return ResponseEntity.ok(applicationService.getJobApplications(authentication.getName(), jobId));
    }

    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @GetMapping("/employer/applications")
    public ResponseEntity<List<Application>> getAllEmployerApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getAllEmployerApplications(authentication.getName()));
    }

    // Employer updates application status
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @PutMapping("/employer/applications/{applicationId}/status")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            @RequestParam(required = false) String feedback,
            Authentication authentication) {
        return ResponseEntity
                .ok(applicationService.updateApplicationStatus(authentication.getName(), applicationId, status,
                        feedback));
    }

    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @PutMapping("/employer/applications/{applicationId}/schedule")
    public ResponseEntity<Application> scheduleInterview(
            @PathVariable Long applicationId,
            @RequestParam LocalDateTime interviewDate,
            @RequestParam(required = false) String notes,
            Authentication authentication) {
        return ResponseEntity
                .ok(applicationService.scheduleInterview(authentication.getName(), applicationId, interviewDate,
                        notes));
    }
}
