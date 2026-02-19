package com.example.flowwow.service;

import com.example.flowwow.dto.order.OrderCreateRequest;
import com.example.flowwow.dto.order.OrderItemRequest;
import com.example.flowwow.entity.*;
import com.example.flowwow.repository.OrderRepository;
import com.example.flowwow.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    // Явный конструктор
    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserService userService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    @Transactional
    public Order createOrder(OrderCreateRequest request, String userEmail) {
        Order order = new Order();

        if (userEmail != null) {
            try {
                User user = userService.findByEmail(userEmail);
                order.setUser(user);
            } catch (Exception e) {
                // Пользователь не найден, оставляем null
            }
        }

        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryDate(request.getDeliveryDate());
        order.setDeliveryTime(request.getDeliveryTime());
        order.setComment(request.getComment());
        order.setStatus("NEW");
        order.setOrderNumber(generateOrderNumber());

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Товар не найден: " + itemRequest.getProductId()));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setPrice(product.getPrice());
            item.setQuantity(itemRequest.getQuantity());

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            order.getItems().add(item);
            totalAmount = totalAmount.add(itemTotal);
        }

        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(String userEmail) {
        User user = userService.findByEmail(userEmail);
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Заказ не найден"));
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // ✅ НОВЫЙ МЕТОД: Получение всех заказов с пагинацией (для админа)
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    private String generateOrderNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = orderRepository.count() + 1;
        return "FLW-" + datePart + "-" + String.format("%04d", count);
    }
}