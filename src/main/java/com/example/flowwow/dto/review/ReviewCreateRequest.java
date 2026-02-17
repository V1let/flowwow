package com.example.flowwow.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewCreateRequest {

    @NotNull(message = "ID товара обязателен")
    private Long productId;

    @NotBlank(message = "Имя автора обязательно")
    private String authorName;

    @NotNull(message = "Оценка обязательна")
    @Min(value = 1, message = "Оценка должна быть от 1 до 5")
    @Max(value = 5, message = "Оценка должна быть от 1 до 5")
    private Integer rating;

    @NotBlank(message = "Текст отзыва обязателен")
    private String text;
}