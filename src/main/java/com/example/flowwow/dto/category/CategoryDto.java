package com.example.flowwow.dto.category;

import lombok.Data;

@Data
public class CategoryDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imagePath;
    private Integer productCount;
}