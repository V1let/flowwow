package com.example.flowwow.dto.category;

public class CategoryDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imagePath;
    private Integer productCount;

    // Конструкторы
    public CategoryDto() {
    }

    public CategoryDto(Long id, String name, String slug, String description,
                       String imagePath, Integer productCount) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.imagePath = imagePath;
        this.productCount = productCount;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public Integer getProductCount() {
        return productCount;
    }

    public void setProductCount(Integer productCount) {
        this.productCount = productCount;
    }
}