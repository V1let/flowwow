package com.example.flowwow.dto.order;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class OrderCreateRequest {

    @NotBlank(message = "Имя обязательно")
    private String customerName;

    @NotBlank(message = "Телефон обязателен")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Некорректный формат телефона")
    private String customerPhone;

    @NotBlank(message = "Email обязателен")
    @Email(message = "Некорректный email")
    private String customerEmail;

    @NotBlank(message = "Адрес доставки обязателен")
    private String deliveryAddress;

    @NotNull(message = "Дата доставки обязательна")
    private LocalDate deliveryDate;

    @NotBlank(message = "Время доставки обязательно")
    private String deliveryTime;

    private String comment;

    @NotNull(message = "Состав заказа обязателен")
    private List<OrderItemRequest> items;
}