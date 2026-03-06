package com.recruitment.controller;

import com.recruitment.entity.Company;
import com.recruitment.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/employer/company")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    
    @PreAuthorize("hasRole('EMPLOYER')")
    @GetMapping
    public ResponseEntity<Company> getMyCompany(Authentication authentication) {
        return ResponseEntity.ok(companyService.getCompanyByEmail(authentication.getName()));
    }

    
    @PreAuthorize("hasRole('EMPLOYER')")
    @PutMapping
    public ResponseEntity<Company> updateCompany(
            @RequestBody Company updatedInfo,
            Authentication authentication) {
        return ResponseEntity.ok(companyService.updateCompany(authentication.getName(), updatedInfo));
    }

    
    @GetMapping("/{companyId}/public")
    public ResponseEntity<Company> getPublicCompany(@PathVariable Long companyId) {
        
        return ResponseEntity.ok(companyService.getCompanyById(companyId));
    }
}
