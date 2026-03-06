package com.recruitment.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "work_experiences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "profile_id")
    private CandidateProfile profile;

    private String companyName;
    private String position;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean isCurrent;

    @Column(columnDefinition = "TEXT")
    private String description;
}
