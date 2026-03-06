package com.recruitment.service;

import com.recruitment.entity.*;
import com.recruitment.repository.JobRepository;
import com.recruitment.repository.SavedJobRepository;
import com.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedJobService {

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    /**
     * Lấy danh sách công việc đã lưu của ứng viên
     */
    public List<Job> getSavedJobs(String email) {
        User user = findUser(email);
        return savedJobRepository.findByUserIdOrderBySavedAtDesc(user.getId())
                .stream()
                .map(SavedJob::getJob)
                .collect(Collectors.toList());
    }

    /**
     * Lưu công việc yêu thích
     */
    @Transactional
    public void saveJob(String email, Long jobId) {
        User user = findUser(email);
        if (savedJobRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
            return; // Already saved, silently ignore
        }
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc"));
        SavedJob savedJob = SavedJob.builder()
                .user(user)
                .job(job)
                .build();
        savedJobRepository.save(savedJob);
    }

    /**
     * Bỏ lưu công việc
     */
    @Transactional
    public void unsaveJob(String email, Long jobId) {
        User user = findUser(email);
        savedJobRepository.deleteByUserIdAndJobId(user.getId(), jobId);
    }

    /**
     * Kiểm tra xem ứng viên đã lưu công việc này chưa
     */
    public boolean isSaved(String email, Long jobId) {
        User user = findUser(email);
        return savedJobRepository.existsByUserIdAndJobId(user.getId(), jobId);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + email));
    }
}
