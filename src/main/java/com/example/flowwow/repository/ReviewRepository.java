package com.example.flowwow.repository;

import com.example.flowwow.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdAndIsActiveTrueOrderByCreatedAtDesc(Long productId);
    Page<Review> findByIsModeratedFalse(Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId AND r.isActive = true")
    BigDecimal getAverageRatingForProduct(@Param("productId") Long productId);

    @Modifying
    @Query("UPDATE Review r SET r.isModerated = true, r.isActive = true, r.moderatedAt = CURRENT_TIMESTAMP WHERE r.id = :id")
    void approveReview(@Param("id") Long id);
}