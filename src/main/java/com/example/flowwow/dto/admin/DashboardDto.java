package com.example.flowwow.dto.admin;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDto {
    private Long totalOrders;
    private Long totalUsers;
    private BigDecimal totalRevenue;
    private Long totalProducts;

    private List<OrderStatusCount> ordersByStatus;
    private List<PopularProduct> popularProducts;

    // Вложенный класс для статистики по статусам
    public static class OrderStatusCount {
        private String status;
        private Long count;

        public OrderStatusCount() {
        }

        public OrderStatusCount(String status, Long count) {
            this.status = status;
            this.count = count;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Long getCount() {
            return count;
        }

        public void setCount(Long count) {
            this.count = count;
        }
    }

    // Вложенный класс для популярных товаров
    public static class PopularProduct {
        private Long id;
        private String name;
        private Long orderCount;

        public PopularProduct() {
        }

        public PopularProduct(Long id, String name, Long orderCount) {
            this.id = id;
            this.name = name;
            this.orderCount = orderCount;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getOrderCount() {
            return orderCount;
        }

        public void setOrderCount(Long orderCount) {
            this.orderCount = orderCount;
        }
    }

    // Конструктор по умолчанию
    public DashboardDto() {
    }

    // Конструктор со всеми полями
    public DashboardDto(Long totalOrders, Long totalUsers, BigDecimal totalRevenue,
                        Long totalProducts, List<OrderStatusCount> ordersByStatus,
                        List<PopularProduct> popularProducts) {
        this.totalOrders = totalOrders;
        this.totalUsers = totalUsers;
        this.totalRevenue = totalRevenue;
        this.totalProducts = totalProducts;
        this.ordersByStatus = ordersByStatus;
        this.popularProducts = popularProducts;
    }

    // Геттеры и сеттеры
    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public List<OrderStatusCount> getOrdersByStatus() {
        return ordersByStatus;
    }

    public void setOrdersByStatus(List<OrderStatusCount> ordersByStatus) {
        this.ordersByStatus = ordersByStatus;
    }

    public List<PopularProduct> getPopularProducts() {
        return popularProducts;
    }

    public void setPopularProducts(List<PopularProduct> popularProducts) {
        this.popularProducts = popularProducts;
    }
}