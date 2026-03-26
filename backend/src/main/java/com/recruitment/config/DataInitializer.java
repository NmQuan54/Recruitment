package com.recruitment.config;

import com.recruitment.entity.PromotionPackage;
import com.recruitment.repository.PromotionPackageRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initPromotionData(PromotionPackageRepository repo) {
        return args -> {
            try {
                if (repo.count() == 0) {
                    repo.save(PromotionPackage.builder()
                        .name("Gói Tuần")
                        .days(7)
                        .amount(50000L)
                        .description("Cơ bản")
                        .active(true)
                        .build());
                    repo.save(PromotionPackage.builder()
                        .name("Gói 15 Ngày")
                        .days(15)
                        .amount(100000L)
                        .description("Phổ biến")
                        .active(true)
                        .build());
                    repo.save(PromotionPackage.builder()
                        .name("Gói Tháng")
                        .days(30)
                        .amount(200000L)
                        .description("Tiết kiệm 20%")
                        .active(true)
                        .build());
                    System.out.println("Seeded initial promotion packages.");
                }
            } catch (Exception e) {
                System.err.println("Database seeding failed: " + e.getMessage());
            }
        };
    }
}
