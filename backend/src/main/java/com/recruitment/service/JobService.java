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
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Autowired
    private com.recruitment.repository.InterviewSlotRepository interviewSlotRepository;

    @Autowired
    private com.recruitment.repository.PaymentTransactionRepository paymentTransactionRepository;

    public Page<Job> searchJobs(String keyword, String location, String jobType,
            BigDecimal salaryMin, BigDecimal salaryMax, Long categoryId, Long companyId, Pageable pageable) {
        return jobRepository.searchJobsAdvanced(keyword, location, jobType, salaryMin, salaryMax, categoryId, companyId,
                pageable);
    }

    public Page<Job> getPromotedJobs(Pageable pageable) {
        return jobRepository.findPromotedJobs(pageable);
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

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        long jobsToday = jobRepository.countByCompanyUserIdAndCreatedAtAfter(user.getId(), startOfToday);
        if (jobsToday >= 2) {
            throw new RuntimeException(
                    "Mỗi tài khoản tuyển dụng chỉ được đăng tối đa 2 tin một ngày. Vui lòng quay lại vào ngày mai!");
        }

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
                .map(company -> jobRepository.findByCompanyIdOrderByCreatedAtDesc(company.getId()))
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

        Set<Job> recommendations = new java.util.LinkedHashSet<>();

        // 1. Match by Categories from historical interest (Applied/Saved jobs)
        Set<Long> interestedCategoryIds = new java.util.HashSet<>();

        applicationRepository.findByCandidateIdOrderByAppliedAtDesc(profile.getId()).forEach(app -> {
            if (app.getJob() != null && app.getJob().getCategories() != null) {
                app.getJob().getCategories().forEach(cat -> interestedCategoryIds.add(cat.getId()));
            }
        });

        savedJobRepository.findByUserIdOrderBySavedAtDesc(user.getId()).forEach(saved -> {
            if (saved.getJob() != null && saved.getJob().getCategories() != null) {
                saved.getJob().getCategories().forEach(cat -> interestedCategoryIds.add(cat.getId()));
            }
        });

        if (!interestedCategoryIds.isEmpty()) {
            recommendations.addAll(jobRepository.findByCategories(interestedCategoryIds));
        }

        // 2. Match by Title (High priority)
        if (profile.getTitle() != null && !profile.getTitle().isBlank()) {
            recommendations.addAll(jobRepository.findRecommendations(profile.getTitle().trim()));
        }

        // 3. Match by Skills
        if (profile.getSkills() != null && !profile.getSkills().isBlank()) {
            String[] skills = profile.getSkills().split(",");
            for (String skill : skills) {
                if (!skill.trim().isEmpty()) {
                    recommendations.addAll(jobRepository.findRecommendations(skill.trim()));
                }
            }
        }

        // 4. Priority: Match by Past/Current Experience Positions
        if (profile.getExperiences() != null) {
            profile.getExperiences().forEach(exp -> {
                if (exp.getPosition() != null && !exp.getPosition().isBlank()) {
                    recommendations.addAll(jobRepository.findRecommendations(exp.getPosition().trim()));
                }
            });
        }

        // 5. Priority: Match by Education Majors
        if (profile.getEducations() != null) {
            profile.getEducations().forEach(edu -> {
                if (edu.getMajor() != null && !edu.getMajor().isBlank()) {
                    recommendations.addAll(jobRepository.findRecommendations(edu.getMajor().trim()));
                }
            });
        }

        // Fallback or padding if not enough recommendations
        if (recommendations.size() < 10) {
            List<Job> trending = jobRepository.findAll().stream()
                    .filter(j -> j.getStatus() == JobStatus.ACTIVE)
                    .sorted((j1, j2) -> {
                        int pComp = Boolean.compare(j2.isPromoted(), j1.isPromoted());
                        if (pComp != 0)
                            return pComp;
                        return j2.getCreatedAt().compareTo(j1.getCreatedAt());
                    })
                    .limit(10)
                    .collect(Collectors.toList());
            recommendations.addAll(trending);
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

        // 0. Trước hết gỡ bỏ mối quan hệ ManyToMany với Category
        job.getCategories().clear();
        jobRepository.saveAndFlush(job);

        // 1. Dọn dẹp tin nhắn và phòng chat
        chatMessageRepository.deleteByRoomJobId(jobId);
        chatRoomRepository.deleteByJobId(jobId);

        // 2. Dọn dẹp lịch phỏng vấn của tất cả hồ sơ thuộc tin này
        interviewSlotRepository.deleteByJobId(jobId);

        // 3. Xóa hồ sơ ứng tuyển và các lần lưu tin
        applicationRepository.deleteByJobId(jobId);
        savedJobRepository.deleteByJobId(jobId);

        // 4. Gỡ liên kết công việc trong các giao dịch thanh toán
        paymentTransactionRepository.nullifyJobInTransactions(jobId);

        // 5. Cuối cùng mới xóa tin tuyển dụng
        jobRepository.delete(job);
    }
}
