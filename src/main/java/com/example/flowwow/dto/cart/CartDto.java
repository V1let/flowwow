package com.example.flowwow.dto.cart;

import java.math.BigDecimal;
import java.util.List;

public class CartDto {
    private Long id;
    private List<CartItemDto> items;
    private Integer totalItems;
    private BigDecimal totalPrice;

    // Конструктор по умолчанию
    public CartDto() {
    }

    // Конструктор со всеми полями
    public CartDto(Long id, List<CartItemDto> items, Integer totalItems, BigDecimal totalPrice) {
        this.id = id;
        this.items = items;
        this.totalItems = totalItems;
        this.totalPrice = totalPrice;
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}