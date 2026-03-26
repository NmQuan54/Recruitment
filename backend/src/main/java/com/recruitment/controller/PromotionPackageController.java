package com.recruitment.controller;

import com.recruitment.entity.PromotionPackage;
import com.recruitment.service.PromotionPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class PromotionPackageController {

    @Autowired
    private PromotionPackageService service;

    @GetMapping("/public/promotion-packages")
    public ResponseEntity<List<PromotionPackage>> getActivePackages() {
        return ResponseEntity.ok(service.getActivePackages());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/promotion-packages")
    public ResponseEntity<List<PromotionPackage>> getAllPackages() {
        return ResponseEntity.ok(service.getAllPackages());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/promotion-packages")
    public ResponseEntity<PromotionPackage> createPackage(@RequestBody PromotionPackage p) {
        return ResponseEntity.ok(service.savePackage(p));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/promotion-packages/{id}")
    public ResponseEntity<PromotionPackage> updatePackage(@PathVariable Long id, @RequestBody PromotionPackage p) {
        PromotionPackage existing = service.getById(id);
        existing.setName(p.getName());
        existing.setDays(p.getDays());
        existing.setAmount(p.getAmount());
        existing.setActive(p.isActive());
        existing.setDescription(p.getDescription());
        return ResponseEntity.ok(service.savePackage(existing));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/promotion-packages/{id}")
    public ResponseEntity<?> deletePackage(@PathVariable Long id) {
        service.deletePackage(id);
        return ResponseEntity.ok().build();
    }
}
