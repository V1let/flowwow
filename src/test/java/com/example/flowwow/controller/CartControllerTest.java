package com.example.flowwow.controller;

import com.example.flowwow.dto.cart.AddToCartRequest;
import com.example.flowwow.dto.cart.CartDto;
import com.example.flowwow.service.CartService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CartControllerTest {

    @Mock
    private CartService cartService;

    @InjectMocks
    private CartController controller;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .setMessageConverters(new MappingJackson2HttpMessageConverter())
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getCart_returnsOk() throws Exception {
        when(cartService.getCart(any(), any())).thenReturn(buildCart());

        mockMvc.perform(get("/api/cart")
                        .header("X-Session-ID", "session-1")
                        .with(auth("user@example.com", "ROLE_USER")))
                .andExpect(status().isOk());
    }

    @Test
    void addToCart_returnsOk() throws Exception {
        AddToCartRequest request = new AddToCartRequest(1L, 2);
        when(cartService.addToCart(any(), any(), any(AddToCartRequest.class))).thenReturn(buildCart());

        mockMvc.perform(post("/api/cart/items")
                        .header("X-Session-ID", "session-1")
                        .with(auth("user@example.com", "ROLE_USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void updateCartItem_returnsOk() throws Exception {
        when(cartService.updateCartItem(any(), any(), any(Long.class), any(Integer.class)))
                .thenReturn(buildCart());

        mockMvc.perform(put("/api/cart/items/1")
                        .header("X-Session-ID", "session-1")
                        .with(auth("user@example.com", "ROLE_USER"))
                        .param("quantity", "3"))
                .andExpect(status().isOk());
    }

    @Test
    void removeFromCart_returnsOk() throws Exception {
        when(cartService.removeFromCart(any(), any(), any(Long.class))).thenReturn(buildCart());

        mockMvc.perform(delete("/api/cart/items/1")
                        .header("X-Session-ID", "session-1")
                        .with(auth("user@example.com", "ROLE_USER")))
                .andExpect(status().isOk());
    }

    @Test
    void clearCart_returnsOk() throws Exception {
        doNothing().when(cartService).clearCart(any(), any());

        mockMvc.perform(delete("/api/cart")
                        .header("X-Session-ID", "session-1")
                        .with(auth("user@example.com", "ROLE_USER")))
                .andExpect(status().isOk());
    }

    private CartDto buildCart() {
        return new CartDto(1L, List.of(), 0, BigDecimal.ZERO);
    }

    private RequestPostProcessor auth(String username, String role) {
        return request -> {
            User principal = new User(username, "password", List.of(new SimpleGrantedAuthority(role)));
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, "password", principal.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return request;
        };
    }
}
