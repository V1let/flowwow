package com.example.flowwow.repository;

import com.example.flowwow.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
    boolean existsByProductId(Long productId);

    @Query("SELECT DISTINCT oi.order.status FROM OrderItem oi WHERE oi.product.id = :productId")
    List<String> findDistinctOrderStatusesByProductId(@Param("productId") Long productId);
}
