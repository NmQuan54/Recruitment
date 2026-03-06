package com.recruitment.service;

import com.recruitment.entity.CandidateProfile;
import com.recruitment.entity.User;
import com.recruitment.repository.CandidateProfileRepository;
import com.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CandidateService {

    @Autowired
    private CandidateProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    public CandidateProfile getProfile(String userEmail) {
        System.out.println("Fetching profile for: " + userEmail);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        Optional<CandidateProfile> profileOpt = profileRepository.findByUserId(user.getId());
        if (profileOpt.isPresent()) {
            return profileOpt.get();
        }

        System.out.println("No profile found, creating new one for user ID: " + user.getId());
        CandidateProfile newProfile = new CandidateProfile();
        newProfile.setUser(user);
        newProfile.setTitle("New Candidate");
        newProfile.setExperiences(new ArrayList<>());
        newProfile.setEducations(new ArrayList<>());
        return profileRepository.save(newProfile);
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
        if (updatedProfile.getSkills() != null)
            existing.setSkills(updatedProfile.getSkills());

        
        if (updatedProfile.getExperiences() != null) {
            existing.getExperiences().clear();
            updatedProfile.getExperiences().forEach(exp -> {
                exp.setProfile(existing);
                existing.getExperiences().add(exp);
            });
        }
        if (updatedProfile.getEducations() != null) {
            existing.getEducations().clear();
            updatedProfile.getEducations().forEach(edu -> {
                edu.setProfile(existing);
                existing.getEducations().add(edu);
            });
        }

        return profileRepository.save(existing);
    }
}
