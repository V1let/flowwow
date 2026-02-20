package com.example.flowwow.repository;

import com.example.flowwow.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);
    boolean existsBySlug(String slug);
    long countBySlugNotLike(String slugPattern);

    List<Product> findByCategoryId(Long categoryId);
    List<Product> findBySlugStartingWith(String slugPrefix);

    List<Product> findByIsHitTrue();

    List<Product> findByIsNewTrue();

    long countByCategoryId(Long categoryId);

    @Query("SELECT p FROM Product p WHERE "
            + "p.slug NOT LIKE 'deleted-%' AND "
            + "(:categoryId IS NULL OR p.category.id = :categoryId) AND "
            + "(:minPrice IS NULL OR p.price >= :minPrice) AND "
            + "(:maxPrice IS NULL OR p.price <= :maxPrice) AND "
            + "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) "
            + "OR LOWER(p.composition) LIKE LOWER(CONCAT('%', :search, '%')) "
            + "OR :search IS NULL)")
    Page<Product> searchProducts(@Param("categoryId") Long categoryId,
                                 @Param("minPrice") BigDecimal minPrice,
                                 @Param("maxPrice") BigDecimal maxPrice,
                                 @Param("search") String search,
                                 Pageable pageable);
}
