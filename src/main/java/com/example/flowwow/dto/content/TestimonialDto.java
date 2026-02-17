package com.example.flowwow.dto.content;

import lombok.Data;

@Data
public class TestimonialDto {
    private Long id;
    private String authorName;
    private String authorCity;
    private String authorPhoto;
    private String text;
    private Integer rating;
}