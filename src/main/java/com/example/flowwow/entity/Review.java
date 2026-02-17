package com.example.flowwow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "author_name", nullable = false, length = 100)
    private String authorName;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    @Column(name = "is_moderated")
    private Boolean isModerated = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "moderated_at")
    private LocalDateTime moderatedAt;

    // Конструкторы
    public Review() {
    }

    public Review(Product product, User user, String authorName, Integer rating, String text,
                  Boolean isModerated, Boolean isActive, LocalDateTime moderatedAt) {
        this.product = product;
        this.user = user;
        this.authorName = authorName;
        this.rating = rating;
        this.text = text;
        this.isModerated = isModerated;
        this.isActive = isActive;
        this.moderatedAt = moderatedAt;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean getIsModerated() {
        return isModerated;
    }

    public void setIsModerated(Boolean isModerated) {
        this.isModerated = isModerated;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getModeratedAt() {
        return moderatedAt;
    }

    public void setModeratedAt(LocalDateTime moderatedAt) {
        this.moderatedAt = moderatedAt;
    }
}