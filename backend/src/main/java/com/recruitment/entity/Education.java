package com.recruitment.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Entity
@Table(name = "educations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "profile_id")
    private CandidateProfile profile;

    private String institution;
    private String degree;
    private String major;
    private String startDate;
    private String endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double gpa;
}
