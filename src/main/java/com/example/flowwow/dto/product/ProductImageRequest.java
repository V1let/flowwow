package com.example.flowwow.dto.product;

public class ProductImageRequest {
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
