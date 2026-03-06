package com.recruitment.service;

import com.recruitment.entity.*;
import com.recruitment.repository.CandidateProfileRepository;
import com.recruitment.repository.CompanyRepository;
import com.recruitment.repository.JobRepository;
import com.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private com.recruitment.repository.ApplicationRepository applicationRepository;

    @Autowired
    private com.recruitment.repository.SavedJobRepository savedJobRepository;

    @Autowired
    private com.recruitment.repository.ChatMessageRepository chatMessageRepository;

    @Autowired
    private com.recruitment.repository.ChatRoomRepository chatRoomRepository;

    public Page<Job> searchJobs(String keyword, String location, String jobType,
            BigDecimal salaryMin, BigDecimal salaryMax, Long categoryId, Long companyId, Pageable pageable) {
        return jobRepository.searchJobsAdvanced(keyword, location, jobType, salaryMin, salaryMax, categoryId, companyId,
                pageable);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc với id: " + id));
    }

    @Autowired
    private com.recruitment.repository.CategoryRepository categoryRepository;

    @Transactional
    public Job createJob(String userEmail, Job job, List<Long> categoryIds) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy thông tin công ty. Vui lòng tạo hồ sơ công ty trước."));

        if (categoryIds != null && !categoryIds.isEmpty()) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(categoryIds));
            job.setCategories(categories);
        }

        job.setCompany(company);
        job.setStatus(JobStatus.ACTIVE);
        return jobRepository.save(job);
    }

    @Transactional
    public Job updateJob(String userEmail, Long jobId, Job updatedJob, List<Long> categoryIds) {
        Job job = getJobById(jobId);
        verifyEmployerOwnership(userEmail, job);

        if (updatedJob.getTitle() != null)
            job.setTitle(updatedJob.getTitle());
        if (updatedJob.getDescription() != null)
            job.setDescription(updatedJob.getDescription());
        if (updatedJob.getRequirements() != null)
            job.setRequirements(updatedJob.getRequirements());
        if (updatedJob.getLocation() != null)
            job.setLocation(updatedJob.getLocation());
        if (updatedJob.getJobType() != null)
            job.setJobType(updatedJob.getJobType());
        if (updatedJob.getSalaryMin() != null)
            job.setSalaryMin(updatedJob.getSalaryMin());
        if (updatedJob.getSalaryMax() != null)
            job.setSalaryMax(updatedJob.getSalaryMax());
        if (updatedJob.getDeadline() != null)
            job.setDeadline(updatedJob.getDeadline());

        if (categoryIds != null) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(categoryIds));
            job.setCategories(categories);
        }

        return jobRepository.save(job);
    }

    @Transactional
    public Job updateJobStatus(String userEmail, Long jobId, JobStatus status) {
        Job job = getJobById(jobId);
        verifyEmployerOwnership(userEmail, job);
        job.setStatus(status);
        return jobRepository.save(job);
    }

    public List<Job> getJobsByEmployer(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + userEmail));

        return companyRepository.findByUserId(user.getId())
                .map(company -> jobRepository.findByCompanyId(company.getId()))
                .orElse(java.util.Collections.emptyList());
    }

    @Transactional
    public Job togglePromotion(String userEmail, Long jobId) {
        Job job = getJobById(jobId);
        verifyEmployerOwnership(userEmail, job);
        job.setPromoted(!job.isPromoted());
        return jobRepository.save(job);
    }

    public List<Job> getRecommendedJobs(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ ứng viên"));

        if (profile.getSkills() == null || profile.getSkills().isEmpty()) {
            return jobRepository.findAll().stream()
                    .filter(j -> j.getStatus() == JobStatus.ACTIVE)
                    .sorted((j1, j2) -> Boolean.compare(j2.isPromoted(), j1.isPromoted()))
                    .limit(5)
                    .collect(Collectors.toList());
        }

        String[] skills = profile.getSkills().split(",");
        Set<Job> recommendations = new HashSet<>();
        for (String skill : skills) {
            recommendations.addAll(jobRepository.findRecommendations(skill.trim()));
        }

        return recommendations.stream()
                .limit(10)
                .collect(Collectors.toList());
    }

    private void verifyEmployerOwnership(String userEmail, Job job) {
        if (!job.getCompany().getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa tin tuyển dụng này.");
        }
    }

    @Transactional
    public void deleteJob(String userEmail, Long jobId) {
        Job job = getJobById(jobId);
        verifyEmployerOwnership(userEmail, job);

        chatMessageRepository.deleteByRoomJobId(jobId);
        chatRoomRepository.deleteByJobId(jobId);
        applicationRepository.deleteByJobId(jobId);
        savedJobRepository.deleteByJobId(jobId);

        jobRepository.delete(job);
    }
}
