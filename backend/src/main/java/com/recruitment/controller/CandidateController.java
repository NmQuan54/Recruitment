package com.recruitment.controller;

import com.recruitment.entity.CandidateProfile;
import com.recruitment.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            CandidateProfile profile = candidateService.getProfile(authentication.getName());

            // Load collections carefully
            try {
                if (profile.getExperiences() != null)
                    profile.getExperiences().size();
            } catch (Exception e) {
                System.err.println(
                        "Error loading experiences for user " + authentication.getName() + ": " + e.getMessage());
                profile.setExperiences(new ArrayList<>());
            }

            try {
                if (profile.getEducations() != null)
                    profile.getEducations().size();
            } catch (Exception e) {
                System.err.println(
                        "Error loading educations for user " + authentication.getName() + ": " + e.getMessage());
                profile.setEducations(new ArrayList<>());
            }

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            e.printStackTrace();
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            return ResponseEntity.status(500)
                    .body("Error fetching profile: " + e.getMessage() + "\nDetails: " + sw.toString());
        }
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody CandidateProfile profile,
            Authentication authentication) {
        try {
            return ResponseEntity.ok(candidateService.updateProfile(authentication.getName(), profile));
        } catch (Exception e) {
            e.printStackTrace();
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            return ResponseEntity.status(500)
                    .body("Error updating profile: " + e.getMessage() + "\nDetails: " + sw.toString());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<CandidateProfile>> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAllProfiles());
    }

    @GetMapping("/search")
    public ResponseEntity<List<CandidateProfile>> searchCandidates(
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(candidateService.searchCandidates(keyword));
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getCandidateProfileById(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(candidateService.getProfileByUserId(userId));
        } catch (Exception e) {
            e.printStackTrace();
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            return ResponseEntity.status(500).body("Full Error: " + sw.toString());
        }
    }
}
