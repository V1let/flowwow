package com.example.flowwow.service;

import com.example.flowwow.dto.cart.AddToCartRequest;
import com.example.flowwow.dto.cart.CartDto;
import com.example.flowwow.dto.cart.CartItemDto;
import com.example.flowwow.entity.*;
import com.example.flowwow.repository.CartItemRepository;
import com.example.flowwow.repository.CartRepository;
import com.example.flowwow.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    // Явный конструктор
    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserService userService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    private Cart getOrCreateCart(String userEmail, String sessionId) {
        if (userEmail != null) {
            // Авторизованный пользователь
            User user = userService.findByEmail(userEmail);
            return cartRepository.findByUser(user)
                    .orElseGet(() -> {
                        Cart cart = new Cart();
                        cart.setUser(user);
                        return cartRepository.save(cart);
                    });
        } else {
            // Неавторизованный пользователь
            if (sessionId == null) {
                sessionId = UUID.randomUUID().toString();
            }
            String finalSessionId = sessionId;
            return cartRepository.findBySessionId(sessionId)
                    .orElseGet(() -> {
                        Cart cart = new Cart();
                        cart.setSessionId(finalSessionId);
                        return cartRepository.save(cart);
                    });
        }
    }

    @Transactional
    public CartDto addToCart(String userEmail, String sessionId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userEmail, sessionId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Товар не найден"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(new CartItem());

        if (cartItem.getId() == null) {
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        }

        cartItemRepository.save(cartItem);

        return getCart(userEmail, sessionId);
    }

    @Transactional
    public CartDto updateCartItem(String userEmail, String sessionId, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(userEmail, sessionId);
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Позиция не найдена"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Доступ запрещен");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        return getCart(userEmail, sessionId);
    }

    @Transactional
    public CartDto removeFromCart(String userEmail, String sessionId, Long itemId) {
        Cart cart = getOrCreateCart(userEmail, sessionId);
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Позиция не найдена"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Доступ запрещен");
        }

        cartItemRepository.delete(cartItem);
        return getCart(userEmail, sessionId);
    }

    public CartDto getCart(String userEmail, String sessionId) {
        Cart cart = getOrCreateCart(userEmail, sessionId);

        List<CartItemDto> items = cart.getItems().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Integer totalItems = items.stream()
                .mapToInt(CartItemDto::getQuantity)
                .sum();

        BigDecimal totalPrice = items.stream()
                .map(CartItemDto::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartDto(
                cart.getId(),
                items,
                totalItems,
                totalPrice
        );
    }

    @Transactional
    public void clearCart(String userEmail, String sessionId) {
        Cart cart = getOrCreateCart(userEmail, sessionId);
        cartItemRepository.deleteByCart(cart);
    }

    private CartItemDto convertToDto(CartItem item) {
        Product product = item.getProduct();
        String image = product.getImages().stream()
                .filter(ProductImage::getIsMain)
                .findFirst()
                .map(ProductImage::getImagePath)
                .orElse(null);

        return new CartItemDto(
                item.getId(),
                product.getId(),
                product.getName(),
                image,
                product.getPrice(),
                item.getQuantity(),
                item.getTotalPrice()
        );
    }
}