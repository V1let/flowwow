package com.example.flowwow.service;

import com.example.flowwow.dto.admin.DashboardDto;
import com.example.flowwow.repository.OrderRepository;
import com.example.flowwow.repository.ProductRepository;
import com.example.flowwow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // Явный конструктор
    public AdminService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public DashboardDto getDashboardStats() {
        Long totalOrders = orderRepository.count();
        Long totalUsers = userRepository.count();
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        Long totalProducts = productRepository.count();

        // Статистика по статусам заказов
        List<DashboardDto.OrderStatusCount> ordersByStatus = List.of(
                new DashboardDto.OrderStatusCount("NEW", orderRepository.countByStatus("NEW")),
                new DashboardDto.OrderStatusCount("PROCESSING", orderRepository.countByStatus("PROCESSING")),
                new DashboardDto.OrderStatusCount("DELIVERED", orderRepository.countByStatus("DELIVERED")),
                new DashboardDto.OrderStatusCount("CANCELLED", orderRepository.countByStatus("CANCELLED"))
        );

        // Популярные товары
        List<DashboardDto.PopularProduct> popularProducts = orderRepository.findPopularProducts()
                .stream()
                .map(result -> new DashboardDto.PopularProduct(
                        (Long) result[0],
                        (String) result[1],
                        (Long) result[2]
                ))
                .limit(5)
                .collect(Collectors.toList());

        return new DashboardDto(
                totalOrders,
                totalUsers,
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                totalProducts,
                ordersByStatus,
                popularProducts
        );
    }
}