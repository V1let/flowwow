package com.example.flowwow.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "testimonials")
@Getter
@Setter
public class Testimonial extends BaseEntity {

    @Column(name = "author_name", nullable = false, length = 100)
    private String authorName;

    @Column(name = "author_city", length = 100)
    private String authorCity;

    @Column(name = "author_photo")
    private String authorPhoto;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    private Integer rating;

    @Column(name = "is_active")
    private Boolean isActive = true;
}