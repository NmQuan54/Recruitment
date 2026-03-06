package com.recruitment.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/resume")
    public ResponseEntity<Map<String, String>> uploadResume(
            @RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File không được để trống"));
            }

            
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tên file không hợp lệ"));
            }

            String extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();
            if (!extension.equals("pdf") && !extension.equals("doc") && !extension.equals("docx") &&
                    !extension.equals("png") && !extension.equals("jpg") && !extension.equals("jpeg")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Chỉ chấp nhận file PDF, DOC, DOCX hoặc hình ảnh (PNG, JPG)"));
            }

            
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File không được vượt quá 5MB"));
            }

            
            String newFilename = UUID.randomUUID() + "." + extension;
            Path uploadPath = Paths.get(uploadDir, "resumes").toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(newFilename);

            System.out.println("Saving resume to: " + filePath);
            Files.copy(file.getInputStream(), filePath);

            String fileUrl = "/uploads/resumes/" + newFilename;
            return ResponseEntity.ok(Map.of("url", fileUrl));
        } catch (IOException e) {
            System.err.println("Resume upload IO error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi lưu file: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("Resume upload unexpected error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi server: " + e.getMessage()));
        }
    }

    
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logo")
    public ResponseEntity<Map<String, String>> uploadLogo(
            @RequestParam(value = "file", required = false) MultipartFile file) {
        System.out.println("uploadLogo reached. File is null? " + (file == null));
        if (file != null) {
            System.out.println("File Name: " + file.getOriginalFilename());
            System.out.println("File Size: " + file.getSize());
            System.out.println("Content Type: " + file.getContentType());
        }

        try {
            if (file == null || file.isEmpty()) {
                System.err.println("Upload failed: File is missing or empty");
                return ResponseEntity.badRequest().body(Map.of("error", "File không được để trống hoặc rỗng"));
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tên file không hợp lệ"));
            }

            String extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();
            if (!extension.equals("png") && !extension.equals("jpg") && !extension.equals("jpeg")
                    && !extension.equals("webp")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Chỉ chấp nhận file PNG, JPG, WEBP"));
            }

            if (file.getSize() > 2 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File không được vượt quá 2MB"));
            }

            String newFilename = UUID.randomUUID() + "." + extension;
            Path uploadPath = Paths.get(uploadDir, "logos").toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(newFilename);

            System.out.println("Saving file to: " + filePath);
            Files.copy(file.getInputStream(), filePath);

            String fileUrl = "/uploads/logos/" + newFilename;
            return ResponseEntity.ok(Map.of("url", fileUrl));
        } catch (IOException e) {
            System.err.println("Upload error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi IO: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi server: " + e.getMessage()));
        }
    }
}
