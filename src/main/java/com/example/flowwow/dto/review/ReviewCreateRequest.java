package com.example.flowwow.dto.review;

public class ReviewCreateRequest {
    private Long productId;
    private String authorName;
    private Integer rating;
    private String text;

    // Конструкторы
    public ReviewCreateRequest() {
    }

    public ReviewCreateRequest(Long productId, String authorName, Integer rating, String text) {
        this.productId = productId;
        this.authorName = authorName;
        this.rating = rating;
        this.text = text;
    }

    // Геттеры и сеттеры
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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
}