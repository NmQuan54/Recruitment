package com.recruitment.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private Job job;

    @Column(name = "package_id")
    private Long packageId;

    @Column(nullable = false)
    private long amount;

    private int days;

    @Column(name = "vnp_txn_ref", nullable = false)
    private String vnpTxnRef;

    @Column(name = "vnp_transaction_no")
    private String vnpTransactionNo;

    @Column(nullable = false)
    private String status; // PENDING, SUCCESS, FAILED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
