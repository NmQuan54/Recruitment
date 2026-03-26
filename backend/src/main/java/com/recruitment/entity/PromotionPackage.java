package com.recruitment.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "promotion_packages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromotionPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int days;

    @Column(nullable = false)
    private long amount;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    private String description;
}
