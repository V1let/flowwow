package com.example.flowwow.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "blog_posts")
@Getter
@Setter
public class BlogPost extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(unique = true, nullable = false, length = 200)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "image_path")
    private String imagePath;

    private String category;

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;
}