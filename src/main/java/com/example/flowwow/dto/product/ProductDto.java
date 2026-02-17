package com.example.flowwow.dto.product;

import com.example.flowwow.dto.category.CategoryDto;
import java.math.BigDecimal;
import java.util.List;

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

    // Конструкторы
    public ProductDto() {
    }

    public ProductDto(Long id, String name, String slug, String composition, BigDecimal price,
                      BigDecimal oldPrice, String description, Boolean isHit, Boolean isNew,
                      BigDecimal ratingAverage, Integer reviewsCount, CategoryDto category,
                      List<String> images) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.composition = composition;
        this.price = price;
        this.oldPrice = oldPrice;
        this.description = description;
        this.isHit = isHit;
        this.isNew = isNew;
        this.ratingAverage = ratingAverage;
        this.reviewsCount = reviewsCount;
        this.category = category;
        this.images = images;
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getComposition() {
        return composition;
    }

    public void setComposition(String composition) {
        this.composition = composition;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getOldPrice() {
        return oldPrice;
    }

    public void setOldPrice(BigDecimal oldPrice) {
        this.oldPrice = oldPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsHit() {
        return isHit;
    }

    public void setIsHit(Boolean isHit) {
        this.isHit = isHit;
    }

    public Boolean getIsNew() {
        return isNew;
    }

    public void setIsNew(Boolean isNew) {
        this.isNew = isNew;
    }

    public BigDecimal getRatingAverage() {
        return ratingAverage;
    }

    public void setRatingAverage(BigDecimal ratingAverage) {
        this.ratingAverage = ratingAverage;
    }

    public Integer getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(Integer reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public CategoryDto getCategory() {
        return category;
    }

    public void setCategory(CategoryDto category) {
        this.category = category;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }
}