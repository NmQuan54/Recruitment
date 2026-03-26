package com.recruitment.controller;

import com.recruitment.entity.Job;
import com.recruitment.entity.PaymentTransaction;
import com.recruitment.entity.User;
import com.recruitment.repository.JobRepository;
import com.recruitment.repository.PaymentTransactionRepository;
import com.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class PaymentController {

    @Autowired
    private com.recruitment.service.VnPaySimulationService vnPayService;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private com.recruitment.repository.PromotionPackageRepository promotionPackageRepository;

    @org.springframework.transaction.annotation.Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    @PostMapping("/employer/jobs/{jobId}/promote")
    public ResponseEntity<?> createPromotionPayment(
            @PathVariable Long jobId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {

        try {
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy công việc"));

            if (!job.getCompany().getUser().getEmail().equals(authentication.getName())) {
                throw new RuntimeException("Bạn không có quyền quảng cáo công việc này");
            }

            long amount = 0;
            int days = 0;

            if (payload.containsKey("packageId") && payload.get("packageId") != null) {
                long packageId = ((Number) payload.get("packageId")).longValue();
                com.recruitment.entity.PromotionPackage p = promotionPackageRepository.findById(packageId)
                        .orElseThrow(() -> new RuntimeException("Gói không tồn tại"));
                amount = p.getAmount();
                days = p.getDays();
            } else if (payload.containsKey("amount") && payload.get("amount") != null) {
                // Keep existing logic for old clients/fallback
                amount = ((Number) payload.get("amount")).longValue();
                days = payload.containsKey("days") && payload.get("days") != null
                        ? ((Number) payload.get("days")).intValue()
                        : 7;
            }

            if (amount <= 0) {
                throw new RuntimeException("Số tiền không hợp lệ hoặc thiếu thông tin gói dịch vụ");
            }

            String vnpTxnRef = String.valueOf(System.currentTimeMillis());
            String orderInfo = "Promote job " + jobId + " for " + days + " days";

            // Using the simulation service that redirects to internal frontend mock page
            String paymentUrl = vnPayService.createMockPaymentUrl(amount, orderInfo, vnpTxnRef);

            User user = userRepository.findByEmail(authentication.getName()).get();
            com.recruitment.entity.PaymentTransaction.PaymentTransactionBuilder builder = com.recruitment.entity.PaymentTransaction
                    .builder()
                    .user(user)
                    .job(job)
                    .amount(amount)
                    .days(days)
                    .vnpTxnRef(vnpTxnRef)
                    .status("PENDING");

            if (payload.containsKey("packageId") && payload.get("packageId") != null) {
                builder.packageId(((Number) payload.get("packageId")).longValue());
            }

            paymentTransactionRepository.save(builder.build());

            Map<String, String> response = new HashMap<>();
            response.put("paymentUrl", paymentUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @org.springframework.transaction.annotation.Transactional
    @GetMapping("/public/vnpay/callback")
    public ResponseEntity<?> vnpayCallback(@RequestParam Map<String, String> params) {
        String vnpTxnRef = params.get("vnp_TxnRef");
        String vnpResponseCode = params.get("vnp_ResponseCode");
        
        System.out.println("VNPAY Callback received: txnRef=" + vnpTxnRef + ", code=" + vnpResponseCode);

        PaymentTransaction transaction = paymentTransactionRepository.findByVnpTxnRef(vnpTxnRef)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch"));

        if ("00".equals(vnpResponseCode)) {
            transaction.setStatus("SUCCESS");
            
            // Activate promotion logic
            Job job = transaction.getJob();
            job.setPromoted(true);
            int days = transaction.getDays() > 0 ? transaction.getDays() : 7;
            LocalDateTime now = LocalDateTime.now();
            
            // Set promotion expiry from today + days (as requested by user)
            job.setPromotionExpiry(now.plusDays(days));
            
            // Set promotion package name for display
            if (transaction.getPackageId() != null) {
                promotionPackageRepository.findById(transaction.getPackageId()).ifPresent(p -> {
                    job.setPromotionPackageName(p.getName());
                });
            } else {
                job.setPromotionPackageName("Gói tùy chỉnh");
            }
            
            jobRepository.save(job);
            paymentTransactionRepository.save(transaction);
            
            return ResponseEntity.status(org.springframework.http.HttpStatus.FOUND)
                    .location(java.net.URI.create("http://localhost:5173/payment-result?status=success&jobId=" + job.getId())).build();
        } else {
            transaction.setStatus("FAILED");
            paymentTransactionRepository.save(transaction);
            return ResponseEntity.status(org.springframework.http.HttpStatus.FOUND)
                    .location(java.net.URI.create("http://localhost:5173/payment-result?status=failed")).build();
        }
    }
}
