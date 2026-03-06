package com.recruitment.service;

import com.recruitment.entity.Company;
import com.recruitment.entity.User;
import com.recruitment.repository.CompanyRepository;
import com.recruitment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company getCompanyByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        return companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin công ty"));
    }

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công ty với id: " + id));
    }

    @Transactional
    public Company updateCompany(String email, Company updatedInfo) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin công ty"));

        if (updatedInfo.getName() != null && !updatedInfo.getName().isBlank()) {
            company.setName(updatedInfo.getName());
        }
        if (updatedInfo.getDescription() != null) {
            company.setDescription(updatedInfo.getDescription());
        }
        if (updatedInfo.getLogoUrl() != null) {
            company.setLogoUrl(updatedInfo.getLogoUrl());
        }
        if (updatedInfo.getWebsite() != null) {
            company.setWebsite(updatedInfo.getWebsite());
        }
        if (updatedInfo.getAddress() != null) {
            company.setAddress(updatedInfo.getAddress());
        }
        if (updatedInfo.getIndustry() != null) {
            company.setIndustry(updatedInfo.getIndustry());
        }
        if (updatedInfo.getCompanySize() != null) {
            company.setCompanySize(updatedInfo.getCompanySize());
        }

        return companyRepository.save(company);
    }
}
