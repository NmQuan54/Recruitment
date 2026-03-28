package com.recruitment.repository;

import com.recruitment.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByVnpTxnRef(String vnpTxnRef);

    @Modifying
    @Transactional
    @Query("UPDATE PaymentTransaction t SET t.job = null WHERE t.job.id = :jobId")
    void nullifyJobInTransactions(@Param("jobId") Long jobId);
}
