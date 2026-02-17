package com.example.flowwow.dto.content;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BlogPostDto {
    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String imagePath;
    private String category;
    private Integer viewsCount;
    private LocalDateTime createdAt;
}