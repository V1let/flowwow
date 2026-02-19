package com.example.flowwow.controller;

import com.example.flowwow.dto.cart.AddToCartRequest;
import com.example.flowwow.dto.cart.CartDto;
import com.example.flowwow.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    // Явный конструктор
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private String getSessionId(HttpServletRequest request) {
        String sessionId = request.getHeader("X-Session-ID");
        if (sessionId == null) {
            sessionId = request.getSession().getId();
        }
        return sessionId;
    }

    @GetMapping
    public ResponseEntity<CartDto> getCart(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        String sessionId = getSessionId(request);
        return ResponseEntity.ok(cartService.getCart(userEmail, sessionId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request,
            @Valid @RequestBody AddToCartRequest cartRequest) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        String sessionId = getSessionId(request);
        return ResponseEntity.ok(cartService.addToCart(userEmail, sessionId, cartRequest));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDto> updateCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        String sessionId = getSessionId(request);
        return ResponseEntity.ok(cartService.updateCartItem(userEmail, sessionId, itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDto> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request,
            @PathVariable Long itemId) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        String sessionId = getSessionId(request);
        return ResponseEntity.ok(cartService.removeFromCart(userEmail, sessionId, itemId));
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest request) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        String sessionId = getSessionId(request);
        cartService.clearCart(userEmail, sessionId);
        return ResponseEntity.ok().build();
    }
}