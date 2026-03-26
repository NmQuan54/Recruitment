package com.recruitment.repository;

import com.recruitment.entity.PromotionPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionPackageRepository extends JpaRepository<PromotionPackage, Long> {
    List<PromotionPackage> findByActiveTrue();
}
