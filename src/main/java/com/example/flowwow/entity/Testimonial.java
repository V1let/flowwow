package com.example.flowwow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "testimonials")
public class Testimonial extends BaseEntity {

    @Column(name = "author_name", nullable = false, length = 100)
    private String authorName;

    @Column(name = "author_city", length = 100)
    private String authorCity;

    @Column(name = "author_photo")
    private String authorPhoto;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    private Integer rating;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // Конструкторы
    public Testimonial() {
    }

    public Testimonial(String authorName, String authorCity, String authorPhoto,
                       String text, Integer rating, Boolean isActive) {
        this.authorName = authorName;
        this.authorCity = authorCity;
        this.authorPhoto = authorPhoto;
        this.text = text;
        this.rating = rating;
        this.isActive = isActive;
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorCity() {
        return authorCity;
    }

    public void setAuthorCity(String authorCity) {
        this.authorCity = authorCity;
    }

    public String getAuthorPhoto() {
        return authorPhoto;
    }

    public void setAuthorPhoto(String authorPhoto) {
        this.authorPhoto = authorPhoto;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}