package com.recruitment.controller;

import com.recruitment.entity.Job;
import com.recruitment.service.SavedJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/candidate/saved-jobs")
public class SavedJobController {

    @Autowired
    private SavedJobService savedJobService;

    
    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping
    public ResponseEntity<List<Job>> getSavedJobs(Authentication authentication) {
        return ResponseEntity.ok(savedJobService.getSavedJobs(authentication.getName()));
    }

    
    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("/{jobId}")
    public ResponseEntity<Map<String, String>> saveJob(
            @PathVariable Long jobId,
            Authentication authentication) {
        savedJobService.saveJob(authentication.getName(), jobId);
        return ResponseEntity.ok(Map.of("status", "saved"));
    }

    
    @PreAuthorize("hasRole('CANDIDATE')")
    @DeleteMapping("/{jobId}")
    public ResponseEntity<Map<String, String>> unsaveJob(
            @PathVariable Long jobId,
            Authentication authentication) {
        savedJobService.unsaveJob(authentication.getName(), jobId);
        return ResponseEntity.ok(Map.of("status", "unsaved"));
    }

    
    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/{jobId}/status")
    public ResponseEntity<Map<String, Boolean>> checkSaved(
            @PathVariable Long jobId,
            Authentication authentication) {
        boolean saved = savedJobService.isSaved(authentication.getName(), jobId);
        return ResponseEntity.ok(Map.of("saved", saved));
    }
}
