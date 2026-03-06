package com.recruitment.controller;

import com.recruitment.entity.CandidateProfile;
import com.recruitment.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/profile")
    public ResponseEntity<CandidateProfile> getProfile(Authentication authentication) {
        return ResponseEntity.ok(candidateService.getProfile(authentication.getName()));
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @PutMapping("/profile")
    public ResponseEntity<CandidateProfile> updateProfile(@RequestBody CandidateProfile profile,
            Authentication authentication) {
        return ResponseEntity.ok(candidateService.updateProfile(authentication.getName(), profile));
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
}
