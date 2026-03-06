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
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    
    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("/candidate/jobs/{jobId}/apply")
    public ResponseEntity<?> applyForJob(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {

        try {
            System.out.println("DEBUG: applyForJob called for jobId=" + jobId + " by user=" + authentication.getName());
            System.out.println("DEBUG: payload=" + payload);
            String coverLetter = payload.get("coverLetter");
            String resumeUrl = payload.get("resumeUrl");

            Application app = applicationService.applyForJob(authentication.getName(), jobId, coverLetter, resumeUrl);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("id", app.getId());
            response.put("status", app.getStatus() != null ? app.getStatus().toString() : "PENDING");
            response.put("message", "Ứng tuyển thành công!");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            String msg = e.getMessage() != null ? e.getMessage() : "Lỗi logic không xác định";
            System.err.println("Runtime error in applyForJob: " + msg);
            return ResponseEntity.status(400).body(Map.of("message", msg));
        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            String stackTrace = sw.toString();

            String msg = e.getMessage() != null ? e.getMessage() : e.toString();
            System.err.println("Fatal error in applyForJob: " + msg);
            e.printStackTrace();

            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("message", "Lỗi server chi tiết: " + msg);
            errorDetails.put("stackTrace", stackTrace);

            return ResponseEntity.status(500).body(errorDetails);
        }
    }

    
    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/candidate/applications")
    public ResponseEntity<List<Application>> getCandidateApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getCandidateApplications(authentication.getName()));
    }

    
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
