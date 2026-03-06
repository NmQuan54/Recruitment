package com.recruitment.controller;

import com.recruitment.entity.Category;
import com.recruitment.entity.Company;
import com.recruitment.entity.Job;
import com.recruitment.entity.User;
import com.recruitment.repository.CategoryRepository;
import com.recruitment.repository.CompanyRepository;
import com.recruitment.repository.JobRepository;
import com.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    // Quản lý Doanh nghiệp
    @GetMapping("/companies")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Company>> getAllCompanies() {
        try {
            return ResponseEntity.ok(companyRepository.findAll());
        } catch (Exception e) {
            System.err.println("Error fetching companies: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/companies/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> updateCompanyStatus(@PathVariable Long id, @RequestParam boolean active) {
        try {
            Company company = companyRepository.findById(id).orElseThrow();
            company.getUser().setActive(active);
            userRepository.save(company.getUser());
            companyRepository.save(company);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Quản lý Danh mục
    @GetMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Quản lý Người dùng
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            return ResponseEntity.ok(userRepository.findAll());
        } catch (Exception e) {
            System.err.println("Error fetching users: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestParam boolean active) {
        try {
            User user = userRepository.findById(id).orElseThrow();
            user.setActive(active);
            userRepository.save(user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Quản lý Đăng tin
    @GetMapping("/jobs")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Job>> getAllJobs() {
        try {
            return ResponseEntity.ok(jobRepository.findAll());
        } catch (Exception e) {
            System.err.println("Error fetching jobs: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/jobs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        jobRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Stats cho Dashboard (Báo cáo)
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Long>> getSystemStats() {
        try {
            Map<String, Long> stats = new HashMap<>();
            stats.put("totalUsers", userRepository.count());
            stats.put("totalCompanies", companyRepository.count());
            stats.put("totalJobs", jobRepository.count());
            stats.put("totalCategories", categoryRepository.count());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
