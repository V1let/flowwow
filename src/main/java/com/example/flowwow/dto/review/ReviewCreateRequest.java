package com.example.flowwow.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReviewCreateRequest {
    @NotNull(message = "ID товара обязателен")
    private Long productId;

    @NotBlank(message = "Имя автора обязательно")
    @Size(min = 2, max = 100, message = "Имя автора должно быть от 2 до 100 символов")
    private String authorName;

    @NotNull(message = "Оценка обязательна")
    @Min(value = 1, message = "Оценка должна быть от 1 до 5")
    @Max(value = 5, message = "Оценка должна быть от 1 до 5")
    private Integer rating;

    @NotBlank(message = "Текст отзыва обязателен")
    @Size(min = 3, max = 1000, message = "Текст отзыва должен быть от 3 до 1000 символов")
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
