package com.example.flowwow.controller;

import com.example.flowwow.entity.Favorite;
import com.example.flowwow.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<Favorite>> getUserFavorites(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(userDetails.getUsername()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addToFavorites(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        favoriteService.addToFavorites(userDetails.getUsername(), productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromFavorites(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        favoriteService.removeFromFavorites(userDetails.getUsername(), productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Boolean> isFavorite(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        return ResponseEntity.ok(favoriteService.isFavorite(userDetails.getUsername(), productId));
    }
}