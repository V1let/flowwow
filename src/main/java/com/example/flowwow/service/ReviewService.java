package com.example.flowwow.service;

import com.example.flowwow.dto.review.ReviewCreateRequest;
import com.example.flowwow.entity.Product;
import com.example.flowwow.entity.Review;
import com.example.flowwow.entity.User;
import com.example.flowwow.repository.ProductRepository;
import com.example.flowwow.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    // Явный конструктор (вместо @RequiredArgsConstructor)
    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserService userService) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    @Transactional
    public Review createReview(ReviewCreateRequest request, String userEmail) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Товар не найден"));

        Review review = new Review();
        review.setProduct(product);
        review.setAuthorName(request.getAuthorName());
        review.setRating(request.getRating());
        review.setText(request.getText());
        review.setIsModerated(false);
        review.setIsActive(false);

        if (userEmail != null) {
            try {
                User user = userService.findByEmail(userEmail);
                review.setUser(user);
            } catch (Exception e) {
                // Пользователь не авторизован
            }
        }

        return reviewRepository.save(review);
    }

    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdAndIsActiveTrueOrderByCreatedAtDesc(productId);
    }

    public List<Review> getRecentReviews(int limit) {
        int size = Math.max(1, Math.min(limit, 10));
        return reviewRepository.findByIsActiveTrueOrderByCreatedAtDesc(PageRequest.of(0, size));
    }

    public Page<Review> getPendingReviews(Pageable pageable) {
        return reviewRepository.findByIsModeratedFalse(pageable);
    }

    @Transactional
    public void approveReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Отзыв не найден"));

        review.setIsModerated(true);
        review.setIsActive(true);
        review.setModeratedAt(LocalDateTime.now());
        reviewRepository.save(review);

        // Обновляем рейтинг и количество отзывов у товара
        Long productId = review.getProduct().getId();
        BigDecimal avg = reviewRepository.getAverageRatingForProduct(productId);
        long count = reviewRepository.countByProductIdAndIsActiveTrue(productId);

        Product product = review.getProduct();
        product.setRatingAverage(avg != null ? avg : BigDecimal.ZERO);
        product.setReviewsCount((int) count);
        productRepository.save(product);
    }

    @Transactional
    public void rejectReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Отзыв не найден"));
        review.setIsModerated(true);
        review.setIsActive(false);
        reviewRepository.save(review);
    }
}
