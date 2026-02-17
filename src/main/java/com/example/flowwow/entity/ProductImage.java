package com.example.flowwow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @Column(name = "is_main")
    private Boolean isMain = false;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    // Конструкторы
    public ProductImage() {
    }

    public ProductImage(Product product, String imagePath, Boolean isMain, Integer sortOrder) {
        this.product = product;
        this.imagePath = imagePath;
        this.isMain = isMain;
        this.sortOrder = sortOrder;
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
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