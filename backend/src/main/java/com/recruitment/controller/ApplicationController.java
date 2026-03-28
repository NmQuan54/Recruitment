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

    @Autowired
    private com.recruitment.service.InterviewService interviewService;

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
    @GetMapping("/employer/analytics")
    public ResponseEntity<Map<String, Object>> getEmployerAnalytics(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getEmployerAnalytics(authentication.getName()));
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

    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @PostMapping("/employer/applications/{applicationId}/slots")
    public ResponseEntity<?> setInterviewSlots(
            @PathVariable Long applicationId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        
        try {
            System.out.println("DEBUG: setInterviewSlots payload=" + payload);
            @SuppressWarnings("unchecked")
            List<Map<String, String>> slotsData = (List<Map<String, String>>) payload.get("slots");
            String notes = (String) payload.get("notes");
            
            if (slotsData == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Danh sách khung giờ không được trống"));
            }

            List<com.recruitment.entity.InterviewSlot> slots = slotsData.stream().map(s -> {
                com.recruitment.entity.InterviewSlot slot = new com.recruitment.entity.InterviewSlot();
                String startStr = s.get("startTime");
                String endStr = s.get("endTime");
                
                if (startStr == null || endStr == null) {
                    throw new RuntimeException("Thời gian bắt đầu/kết thúc không được trống");
                }
                
                // Flexible parsing
                String sStr = startStr.length() == 16 ? startStr + ":00" : startStr;
                String eStr = endStr.length() == 16 ? endStr + ":00" : endStr;
                
                slot.setStartTime(LocalDateTime.parse(sStr));
                slot.setEndTime(LocalDateTime.parse(eStr));
                return slot;
            }).collect(java.util.stream.Collectors.toCollection(java.util.ArrayList::new));

            return ResponseEntity.ok(interviewService.setInterviewSlots(authentication.getName(), applicationId, slots, notes));
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR in setInterviewSlots: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "message", "Lỗi server: " + e.getMessage(),
                "details", e.toString(),
                "timestamp", LocalDateTime.now().toString()
            ));
        }
    }

    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @GetMapping("/employer/applications/{applicationId}/slots")
    public ResponseEntity<?> getInterviewSlotsEmployer(
            @PathVariable Long applicationId) {
        // Recycle the same service method or similar
        return ResponseEntity.ok(interviewService.getAvailableSlots(applicationId));
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/candidate/applications/{applicationId}/slots")
    public ResponseEntity<?> getAvailableSlots(
            @PathVariable Long applicationId) {
        return ResponseEntity.ok(interviewService.getAvailableSlots(applicationId));
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("/candidate/slots/{slotId}/book")
    public ResponseEntity<?> bookSlot(
            @PathVariable Long slotId,
            Authentication authentication) {
        return ResponseEntity.ok(interviewService.bookSlot(authentication.getName(), slotId));
    }
}
