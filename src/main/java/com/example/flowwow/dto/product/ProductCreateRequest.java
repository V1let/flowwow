package com.example.flowwow.dto.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductCreateRequest {

    @NotBlank(message = "Название обязательно")
    private String name;

    @NotNull(message = "ID категории обязателен")
    private Long categoryId;

    @NotBlank(message = "Состав обязателен")
    private String composition;

    @NotNull(message = "Цена обязательна")
    @DecimalMin(value = "0.01", message = "Цена должна быть больше 0")
    private BigDecimal price;

    private BigDecimal oldPrice;

    private String description;

    private Boolean isHit = false;

    private Boolean isNew = false;
}