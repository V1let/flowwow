package com.example.flowwow.service;

import com.example.flowwow.entity.Favorite;
import com.example.flowwow.entity.Product;
import com.example.flowwow.entity.User;
import com.example.flowwow.repository.FavoriteRepository;
import com.example.flowwow.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public List<Favorite> getUserFavorites(String userEmail) {
        User user = userService.findByEmail(userEmail);
        return favoriteRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional
    public void addToFavorites(String userEmail, Long productId) {
        User user = userService.findByEmail(userEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));

        if (!favoriteRepository.existsByUserAndProduct(user, product)) {
            Favorite favorite = new Favorite();
            favorite.setUser(user);
            favorite.setProduct(product);
            favoriteRepository.save(favorite);
        }
    }

    @Transactional
    public void removeFromFavorites(String userEmail, Long productId) {
        User user = userService.findByEmail(userEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));

        favoriteRepository.deleteByUserAndProduct(user, product);
    }

    public boolean isFavorite(String userEmail, Long productId) {
        User user = userService.findByEmail(userEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));

        return favoriteRepository.existsByUserAndProduct(user, product);
    }
}