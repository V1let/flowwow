package com.example.flowwow.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProductImageRequest {
    @NotBlank(message = "Путь к изображению обязателен")
    @Size(max = 500, message = "Путь к изображению не должен превышать 500 символов")
    private String imagePath;

    private Boolean isMain;
    private Integer sortOrder;

    public ProductImageRequest() {
    }

    public ProductImageRequest(String imagePath, Boolean isMain, Integer sortOrder) {
        this.imagePath = imagePath;
        this.isMain = isMain;
        this.sortOrder = sortOrder;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public Boolean getIsMain() {
        return isMain;
    }

    public void setIsMain(Boolean isMain) {
        this.isMain = isMain;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}
