package com.recruitment.service;

import com.recruitment.entity.*;
import com.recruitment.repository.ApplicationRepository;
import com.recruitment.repository.InterviewSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InterviewService {

    @Autowired
    private InterviewSlotRepository interviewSlotRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public List<InterviewSlot> setInterviewSlots(String employerEmail, Long applicationId, List<InterviewSlot> slots, String notes) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển"));
        
        // Update notes if provided
        if (notes != null && !notes.isEmpty()) {
            application.setInterviewNotes(notes);
            applicationRepository.save(application);
        }

        if (!application.getJob().getCompany().getUser().getEmail().equals(employerEmail)) {
            throw new RuntimeException("Bạn không có quyền quản lý lịch phỏng vấn này");
        }

        // Remove old slots
        List<InterviewSlot> existingSlots = interviewSlotRepository.findByApplicationId(applicationId);
        interviewSlotRepository.deleteAll(existingSlots);

        // Save new slots
        for (InterviewSlot slot : slots) {
            slot.setApplication(application);
            slot.setBooked(false);
        }
        List<InterviewSlot> savedSlots = interviewSlotRepository.saveAll(slots);

        // Notify candidate
        notificationService.createNotification(
                application.getCandidate(),
                "INTERVIEW_OPTIONS",
                "Chọn thời gian phỏng vấn",
                "Nhà tuyển dụng đã đưa ra các khung giờ phỏng vấn cho vị trí \"" + application.getJob().getTitle() + "\". Vui lòng chọn khung giờ phù hợp với bạn.",
                applicationId
        );

        return savedSlots;
    }

    public List<InterviewSlot> getAvailableSlots(Long applicationId) {
        return interviewSlotRepository.findByApplicationIdAndIsBooked(applicationId, false);
    }

    @Transactional
    public InterviewSlot bookSlot(String candidateEmail, Long slotId) {
        InterviewSlot slot = interviewSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khung giờ này"));

        if (slot.isBooked()) {
            throw new RuntimeException("Khung giờ này đã được đặt bởi người khác hoặc trang đã cũ");
        }

        Application application = slot.getApplication();
        if (!application.getCandidate().getEmail().equals(candidateEmail)) {
            throw new RuntimeException("Bạn không có quyền đặt lịch cho đơn ứng tuyển này");
        }

        // Mark slot as booked
        slot.setBooked(true);
        interviewSlotRepository.save(slot);

        // Update application
        application.setInterviewDate(slot.getStartTime());
        application.setStatus(ApplicationStatus.INTERVIEW);
        applicationRepository.save(application);

        // Notify employer
        notificationService.createNotification(
                application.getJob().getCompany().getUser(),
                "INTERVIEW_BOOKED",
                "Ứng viên đã chọn lịch phỏng vấn",
                "Ứng viên " + application.getCandidate().getFullName() + " đã chọn khung giờ: " + slot.getStartTime().toString() + " cho vị trí \"" + application.getJob().getTitle() + "\".",
                application.getId()
        );

        return slot;
    }
}
