package com.example.flowwow.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public class OrderCreateRequest {
    @NotBlank(message = "Имя клиента обязательно")
    @Size(min = 2, max = 100, message = "Имя клиента должно быть от 2 до 100 символов")
    private String customerName;

    @NotBlank(message = "Телефон обязателен")
    @Size(min = 7, max = 20, message = "Телефон должен быть от 7 до 20 символов")
    private String customerPhone;

    @Email(message = "Некорректный email")
    private String customerEmail;

    @NotBlank(message = "Адрес доставки обязателен")
    @Size(min = 5, max = 500, message = "Адрес доставки должен быть от 5 до 500 символов")
    private String deliveryAddress;

    @NotNull(message = "Дата доставки обязательна")
    private LocalDate deliveryDate;

    @NotBlank(message = "Время доставки обязательно")
    @Size(max = 20, message = "Время доставки не должно превышать 20 символов")
    private String deliveryTime;

    @Size(max = 1000, message = "Комментарий не должен превышать 1000 символов")
    private String comment;

    @NotNull(message = "Список товаров обязателен")
    @Valid
    private List<OrderItemRequest> items;

    // Конструкторы
    public OrderCreateRequest() {
    }

    public OrderCreateRequest(String customerName, String customerPhone, String customerEmail,
                              String deliveryAddress, LocalDate deliveryDate, String deliveryTime,
                              String comment, List<OrderItemRequest> items) {
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerEmail = customerEmail;
        this.deliveryAddress = deliveryAddress;
        this.deliveryDate = deliveryDate;
        this.deliveryTime = deliveryTime;
        this.comment = comment;
        this.items = items;
    }

    // Геттеры и сеттеры
    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public String getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(String deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}
