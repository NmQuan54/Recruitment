package com.recruitment.service;

import com.recruitment.entity.PromotionPackage;
import com.recruitment.repository.PromotionPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromotionPackageService {

    @Autowired
    private PromotionPackageRepository repository;

    public List<PromotionPackage> getAllPackages() {
        return repository.findAll();
    }

    public List<PromotionPackage> getActivePackages() {
        return repository.findByActiveTrue();
    }

    public PromotionPackage savePackage(PromotionPackage p) {
        return repository.save(p);
    }

    public void deletePackage(Long id) {
        repository.deleteById(id);
    }

    public PromotionPackage getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Gói không tồn tại"));
    }
}
