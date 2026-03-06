package com.recruitment.service;

import com.recruitment.entity.*;
import com.recruitment.repository.ApplicationRepository;
import com.recruitment.repository.JobRepository;
import com.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Application applyForJob(String candidateEmail, Long jobId, String coverLetter, String resumeUrl) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ứng viên"));

        if (candidate.getRole() != Role.CANDIDATE) {
            throw new RuntimeException("Chỉ ứng viên mới có thể nộp đơn");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc"));

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new RuntimeException("Không thể ứng tuyển vào công việc không còn hoạt động");
        }

        if (applicationRepository.existsByJobIdAndCandidateId(jobId, candidate.getId())) {
            throw new RuntimeException("Bạn đã nộp đơn cho công việc này rồi");
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .coverLetter(coverLetter)
                .resumeUrl(resumeUrl)
                .status(ApplicationStatus.PENDING)
                .build();

        Application saved = applicationRepository.save(application);

        // 🔔 Thông báo cho ứng viên xác nhận đã nộp đơn thành công
        notificationService.createNotification(
                candidate,
                "JOB_APPLIED",
                "Nộp đơn thành công",
                "Bạn đã nộp đơn thành công cho vị trí \"" + job.getTitle()
                        + "\" tại " + job.getCompany().getName() + ".",
                jobId);

        return saved;
    }

    public List<Application> getCandidateApplications(String candidateEmail) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ứng viên"));
        return applicationRepository.findByCandidateId(candidate.getId());
    }

    public List<Application> getAllEmployerApplications(String employerEmail) {
        return applicationRepository.findAllByEmployerEmail(employerEmail);
    }

    public List<Application> getJobApplications(String employerEmail, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc"));

        if (!job.getCompany().getUser().getEmail().equals(employerEmail)) {
            throw new RuntimeException("Bạn không có quyền xem hồ sơ của công việc này");
        }

        return applicationRepository.findByJobId(jobId);
    }

    @Transactional
    public Application updateApplicationStatus(String employerEmail, Long applicationId, ApplicationStatus status,
            String feedback) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ ứng tuyển"));

        if (!application.getJob().getCompany().getUser().getEmail().equals(employerEmail)) {
            throw new RuntimeException("Bạn không có quyền cập nhật hồ sơ này");
        }

        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(status);
        if (feedback != null) {
            application.setFeedback(feedback);
        }
        Application saved = applicationRepository.save(application);

        // 🔔 Thông báo cho ứng viên khi trạng thái thay đổi
        if (!oldStatus.equals(status)) {
            String msg = buildStatusChangeMessage(status, application.getJob());
            notificationService.createNotification(
                    application.getCandidate(),
                    "APPLICATION_STATUS",
                    "Cập nhật hồ sơ ứng tuyển",
                    msg,
                    applicationId);
        }

        return saved;
    }

    @Transactional
    public Application scheduleInterview(String employerEmail, Long applicationId,
            LocalDateTime interviewDate, String notes) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ ứng tuyển"));

        if (!application.getJob().getCompany().getUser().getEmail().equals(employerEmail)) {
            throw new RuntimeException("Bạn không có quyền cập nhật hồ sơ này");
        }

        application.setStatus(ApplicationStatus.INTERVIEW);
        application.setInterviewDate(interviewDate);
        application.setInterviewNotes(notes);
        Application saved = applicationRepository.save(application);

        // 🔔 Thông báo phỏng vấn cho ứng viên
        notificationService.createNotification(
                application.getCandidate(),
                "INTERVIEW_SCHEDULED",
                "Lịch phỏng vấn đã được đặt",
                "Bạn có lịch phỏng vấn cho vị trí \"" + application.getJob().getTitle()
                        + "\" vào " + interviewDate.toLocalDate().toString()
                        + (notes != null ? ". Ghi chú: " + notes : ""),
                applicationId);

        return saved;
    }

    private String buildStatusChangeMessage(ApplicationStatus status, Job job) {
        String title = job.getTitle();
        String company = job.getCompany().getName();
        return switch (status) {
            case REVIEWING -> "Hồ sơ của bạn cho vị trí \"" + title + "\" tại " + company + " đang được xem xét.";
            case ACCEPTED ->
                "🎉 Chúc mừng! Hồ sơ của bạn cho vị trí \"" + title + "\" tại " + company + " đã được chấp nhận!";
            case REJECTED -> "Hồ sơ của bạn cho vị trí \"" + title + "\" tại " + company
                    + " chưa phù hợp lần này. Hãy tiếp tục cố gắng!";
            case INTERVIEW -> "Bạn được mời phỏng vấn cho vị trí \"" + title + "\" tại " + company + ".";
            default -> "Hồ sơ của bạn cho vị trí \"" + title + "\" đã được cập nhật.";
        };
    }
}