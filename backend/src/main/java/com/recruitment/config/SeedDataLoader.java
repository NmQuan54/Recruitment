package com.recruitment.config;

import com.recruitment.entity.*;
import com.recruitment.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

@Configuration
public class SeedDataLoader {

        @Bean
        CommandLineRunner initDatabase(UserRepository userRepository,
                        CompanyRepository companyRepository,
                        CategoryRepository categoryRepository,
                        JobRepository jobRepository,
                        CandidateProfileRepository candidateProfileRepository,
                        ApplicationRepository applicationRepository,
                        PasswordEncoder passwordEncoder) {
                return args -> {
                        // Seed Admin
                        if (userRepository.findByEmail("admin").isEmpty()) {
                                User admin = User.builder()
                                                .email("admin")
                                                .password(passwordEncoder.encode("0905622341"))
                                                .fullName("Administrator")
                                                .role(Role.ADMIN)
                                                .active(true)
                                                .phone("0905622341")
                                                .build();
                                userRepository.save(admin);
                                System.out.println("Admin account created: admin / 0905622341");
                        }

                        // Seed Categories
                        if (categoryRepository.count() == 0) {
                                categoryRepository.save(Category.builder().name("IT - Phần mềm").build());
                                categoryRepository.save(Category.builder().name("Kinh doanh / Bán hàng").build());
                                categoryRepository.save(Category.builder().name("Marketing / Truyền thông").build());
                                categoryRepository.save(Category.builder().name("Kế toán / Kiểm toán").build());
                                categoryRepository.save(Category.builder().name("Thiết kế / Sáng tạo").build());
                                categoryRepository.save(Category.builder().name("Nhân sự").build());
                                categoryRepository.save(Category.builder().name("Giáo dục / Đào tạo").build());
                                categoryRepository.save(Category.builder().name("Y tế / Dược").build());
                        }

                        // Seed a sample Employer and Company
                        if (userRepository.findByEmail("employer@test.com").isEmpty()) {
                                User employerUser = User.builder()
                                                .email("employer@test.com")
                                                .password(passwordEncoder.encode("password123"))
                                                .fullName("Tập đoàn Công nghệ ABC")
                                                .role(Role.EMPLOYER)
                                                .active(true)
                                                .build();
                                userRepository.save(employerUser);

                                Company company = Company.builder()
                                                .user(employerUser)
                                                .name("Công ty TNHH Giải pháp Phần mềm ABC")
                                                .description(
                                                                "Công ty hàng đầu về AI và Big Data với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ thông tin.")
                                                .industry("Công nghệ cao")
                                                .address("Duy Tân, Cầu Giấy, Hà Nội")
                                                .website("https://abc-tech.com")
                                                .companySize(500)
                                                .build();
                                companyRepository.save(company);

                                // Seed some Jobs
                                List<Category> allCategories = categoryRepository.findAll();
                                Category itCategory = allCategories.get(0);

                                Job job1 = Job.builder()
                                                .company(company)
                                                .title("Java Backend Developer (Spring Boot)")
                                                .description(
                                                                "Chúng tôi đang tìm kiếm Java Developer có đam mê xây dựng các hệ thống backend quy mô lớn.")
                                                .requirements("- Java, Spring Boot\n- SQL, NoSQL\n- Microservices architecture")
                                                .location("Hà Nội")
                                                .jobType(JobType.FULL_TIME)
                                                .salaryMin(new BigDecimal("20000000"))
                                                .salaryMax(new BigDecimal("40000000"))
                                                .status(JobStatus.ACTIVE)
                                                .isPromoted(true)
                                                .deadline(LocalDate.now().plusMonths(1))
                                                .categories(new HashSet<>(Collections.singletonList(itCategory)))
                                                .build();
                                jobRepository.save(job1);

                                Job job2 = Job.builder()
                                                .company(company)
                                                .title("Frontend Developer (React.js)")
                                                .description("Xây dựng UI/UX cho các dự án web hiện đại.")
                                                .requirements("- React.js, Tailwind CSS\n- JavaScript/TypeScript\n- Git")
                                                .location("Hà Nội")
                                                .jobType(JobType.FULL_TIME)
                                                .salaryMin(new BigDecimal("15000000"))
                                                .salaryMax(new BigDecimal("30000000"))
                                                .status(JobStatus.ACTIVE)
                                                .deadline(LocalDate.now().plusMonths(1))
                                                .categories(new HashSet<>(Collections.singletonList(itCategory)))
                                                .build();
                                jobRepository.save(job2);
                        }

                        // Seed more Employers
                        if (userRepository.findByEmail("hr@vng.com.vn").isEmpty()) {
                                User hrVNG = User.builder()
                                                .email("hr@vng.com.vn")
                                                .password(passwordEncoder.encode("password123"))
                                                .fullName("Phòng Nhân sự VNG")
                                                .role(Role.EMPLOYER)
                                                .active(true)
                                                .build();
                                userRepository.save(hrVNG);

                                Company vng = Company.builder()
                                                .user(hrVNG)
                                                .name("VNG Corporation")
                                                .description("Công ty internet hàng đầu Việt Nam")
                                                .industry("Game & Internet")
                                                .address("ZaloPay Tower, Quận 7, TP. HCM")
                                                .website("https://vng.com.vn")
                                                .companySize(2000)
                                                .build();
                                companyRepository.save(vng);
                        }

                        // Seed a sample Candidate
                        if (userRepository.findByEmail("candidate@test.com").isEmpty()) {
                                User candidateUser = User.builder()
                                                .email("candidate@test.com")
                                                .password(passwordEncoder.encode("password123"))
                                                .fullName("Nguyễn Văn A")
                                                .role(Role.CANDIDATE)
                                                .active(true)
                                                .build();
                                userRepository.save(candidateUser);

                                CandidateProfile profile = CandidateProfile.builder()
                                                .user(candidateUser)
                                                .title("Software Engineer")
                                                .summary("Kỹ sư phần mềm mới tốt nghiệp với đam mê về Java backend.")
                                                .phoneNumber("0123456789")
                                                .address("Thanh Xuân, Hà Nội")
                                                .skills("Java, Spring Boot, MySQL, HTML/CSS")
                                                .build();
                                candidateProfileRepository.save(profile);

                                // Seed an Application
                                Job job = jobRepository.findAll().get(0);
                                Application application = Application.builder()
                                                .job(job)
                                                .candidate(candidateUser)
                                                .coverLetter(
                                                                "Tôi rất ấn tượng với sứ mệnh của công ty và muốn ứng tuyển vào vị trí Java Developer.")
                                                .status(ApplicationStatus.PENDING)
                                                .build();
                                applicationRepository.save(application);
                        }
                };
        }
}
