package com.example.flowwow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // NOT NULL в БД
    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(nullable = false)
    private Integer quantity;

    // NOT NULL в БД
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    // GENERATED COLUMN в БД -> запрещаем insert/update со стороны Hibernate
    @Column(name = "total", insertable = false, updatable = false, precision = 10, scale = 2)
    private BigDecimal total;

    public OrderItem() {
    }

    public OrderItem(Order order, Product product, Integer quantity, BigDecimal price) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }

    @PrePersist
    @PreUpdate
    private void fillRequiredSnapshotFields() {
        // product_name NOT NULL
        if (productName == null && product != null) {
            productName = product.getName();
        }

        // price NOT NULL
        if (price == null && product != null) {
            price = product.getPrice();
        }

        // total НЕ трогаем: оно GENERATED в БД
    }

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;

        // удобно сразу заполнить snapshot-поля (но total не трогаем)
        if (this.product != null) {
            if (this.productName == null) this.productName = this.product.getName();
            if (this.price == null) this.price = this.product.getPrice();
        }
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    // будет приходить из БД после сохранения/загрузки
    public BigDecimal getTotal() {
        return total;
    }
}
