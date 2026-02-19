package com.example.flowwow.dto.order;

import java.time.LocalDate;
import java.util.List;

public class OrderCreateRequest {
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String deliveryAddress;
    private LocalDate deliveryDate;
    private String deliveryTime;
    private String comment;
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