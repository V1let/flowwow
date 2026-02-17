package com.example.flowwow.dto.product;

import com.example.flowwow.dto.category.CategoryDto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String slug;
    private String composition;
    private BigDecimal price;
    private BigDecimal oldPrice;
    private String description;
    private Boolean isHit;
    private Boolean isNew;
    private BigDecimal ratingAverage;
    private Integer reviewsCount;
    private CategoryDto category;
    private List<String> images;
}