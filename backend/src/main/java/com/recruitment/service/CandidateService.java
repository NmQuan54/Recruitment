package com.recruitment.service;

import com.recruitment.entity.CandidateProfile;
import com.recruitment.entity.User;
import com.recruitment.repository.CandidateProfileRepository;
import com.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidateService {

    @Autowired
    private CandidateProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    public CandidateProfile getProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));
    }

    public List<CandidateProfile> getAllProfiles() {
        return profileRepository.findAll();
    }

    public List<CandidateProfile> searchCandidates(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return profileRepository.findAll();
        }
        String lower = keyword.toLowerCase();
        return profileRepository.findAll().stream()
                .filter(p -> (p.getTitle() != null && p.getTitle().toLowerCase().contains(lower)) ||
                        (p.getSkills() != null && p.getSkills().toLowerCase().contains(lower)) ||
                        (p.getSummary() != null && p.getSummary().toLowerCase().contains(lower)))
                .collect(Collectors.toList());
    }

    @Transactional
    public CandidateProfile updateProfile(String userEmail, CandidateProfile updatedProfile) {
        CandidateProfile existing = getProfile(userEmail);

        if (updatedProfile.getTitle() != null)
            existing.setTitle(updatedProfile.getTitle());
        if (updatedProfile.getSummary() != null)
            existing.setSummary(updatedProfile.getSummary());
        if (updatedProfile.getPhoneNumber() != null)
            existing.setPhoneNumber(updatedProfile.getPhoneNumber());
        if (updatedProfile.getAddress() != null)
            existing.setAddress(updatedProfile.getAddress());
        if (updatedProfile.getResumeUrl() != null)
            existing.setResumeUrl(updatedProfile.getResumeUrl());
        if (updatedProfile.getExperience() != null)
            existing.setExperience(updatedProfile.getExperience());
        if (updatedProfile.getEducation() != null)
            existing.setEducation(updatedProfile.getEducation());

        // Xử lý Experience và Education
        // Legacy list handling (optional, keep for compatibility if needed, but simple
        // string is primary now)
        if (updatedProfile.getExperiences() != null && !updatedProfile.getExperiences().isEmpty()) {
            existing.getExperiences().clear();
            updatedProfile.getExperiences().forEach(exp -> {
                exp.setProfile(existing);
                existing.getExperiences().add(exp);
            });
        }
        if (updatedProfile.getEducations() != null && !updatedProfile.getEducations().isEmpty()) {
            existing.getEducations().clear();
            updatedProfile.getEducations().forEach(edu -> {
                edu.setProfile(existing);
                existing.getEducations().add(edu);
            });
        }

        return profileRepository.save(existing);
    }
}
