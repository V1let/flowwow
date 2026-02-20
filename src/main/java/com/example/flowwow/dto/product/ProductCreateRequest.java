package com.example.flowwow.dto.product;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public class ProductCreateRequest {
    @NotBlank(message = "Название обязательно")
    @Size(min = 2, max = 200, message = "Название должно быть от 2 до 200 символов")
    private String name;

    @NotNull(message = "Категория обязательна")
    private Long categoryId;

    @NotBlank(message = "Состав обязателен")
    @Size(min = 2, max = 500, message = "Состав должен быть от 2 до 500 символов")
    private String composition;

    @NotNull(message = "Цена обязательна")
    @DecimalMin(value = "0.01", message = "Цена должна быть больше 0")
    private BigDecimal price;

    private BigDecimal oldPrice;

    @Size(max = 2000, message = "Описание не должно превышать 2000 символов")
    private String description;

    private Boolean isHit = false;
    private Boolean isNew = false;

    @Valid
    private List<ProductImageRequest> images;

    // Конструкторы
    public ProductCreateRequest() {
    }

    public ProductCreateRequest(String name, Long categoryId, String composition, BigDecimal price,
                                BigDecimal oldPrice, String description, Boolean isHit, Boolean isNew,
                                List<ProductImageRequest> images) {
        this.name = name;
        this.categoryId = categoryId;
        this.composition = composition;
        this.price = price;
        this.oldPrice = oldPrice;
        this.description = description;
        this.isHit = isHit;
        this.isNew = isNew;
        this.images = images;
    }

    // Геттеры и сеттеры
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
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

    public List<ProductImageRequest> getImages() {
        return images;
    }

    public void setImages(List<ProductImageRequest> images) {
        this.images = images;
    }
}
