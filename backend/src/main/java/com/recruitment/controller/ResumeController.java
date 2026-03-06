package com.recruitment.controller;

import com.recruitment.entity.Resume;
import com.recruitment.entity.User;
import com.recruitment.repository.ResumeRepository;
import com.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping
    public ResponseEntity<List<Resume>> getMyResumes(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(resumeRepository.findByUserId(user.getId()));
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping
    public ResponseEntity<Resume> addResume(@RequestBody Resume resume, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        resume.setUser(user);
        return ResponseEntity.ok(resumeRepository.save(resume));
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Resume resume = resumeRepository.findById(id).orElseThrow();

        if (!resume.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Bạn không có quyền xóa CV này");
        }

        resumeRepository.delete(resume);
        return ResponseEntity.ok().build();
    }
}
