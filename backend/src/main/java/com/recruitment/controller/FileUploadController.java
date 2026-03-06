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

    /**
     * Upload CV của ứng viên (PDF/DOC, tối đa 5MB)
     * Returns: { "url": "/uploads/filename.pdf" }
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/resume")
    public ResponseEntity<Map<String, String>> uploadResume(
            @RequestParam("file") MultipartFile file) throws IOException {

        // Validate file type
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

        // Validate file size (5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "File không được vượt quá 5MB"));
        }

        // Save file with UUID name to avoid conflicts
        String newFilename = UUID.randomUUID() + "." + extension;
        Path uploadPath = Paths.get(uploadDir, "resumes");
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath);

        String fileUrl = "/uploads/resumes/" + newFilename;
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }

    /**
     * Upload logo công ty (PNG/JPG, tối đa 2MB)
     * Returns: { "url": "/uploads/logos/filename.png" }
     */
    @PreAuthorize("hasRole('EMPLOYER')")
    @PostMapping("/logo")
    public ResponseEntity<Map<String, String>> uploadLogo(
            @RequestParam("file") MultipartFile file) throws IOException {

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
        Path uploadPath = Paths.get(uploadDir, "logos");
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath);

        String fileUrl = "/uploads/logos/" + newFilename;
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}
