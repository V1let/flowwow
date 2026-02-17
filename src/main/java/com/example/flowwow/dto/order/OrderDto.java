package com.example.flowwow.dto.order;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {
    private Long id;
    private String orderNumber;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String deliveryAddress;
    private LocalDate deliveryDate;
    private String deliveryTime;
    private String comment;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;
}