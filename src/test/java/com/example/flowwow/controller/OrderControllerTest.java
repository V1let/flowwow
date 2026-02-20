package com.example.flowwow.controller;

import com.example.flowwow.dto.order.OrderCreateRequest;
import com.example.flowwow.dto.order.OrderItemRequest;
import com.example.flowwow.entity.Order;
import com.example.flowwow.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController controller;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter(objectMapper);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .setMessageConverters(jsonConverter)
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createOrder_returnsOk() throws Exception {
        OrderCreateRequest request = buildOrderCreateRequest();
        when(orderService.createOrder(any(OrderCreateRequest.class), any())).thenReturn(new Order());

        mockMvc.perform(post("/api/orders")
                        .with(auth("user@example.com", "ROLE_USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void getUserOrders_returnsOk() throws Exception {
        when(orderService.getUserOrders("user@example.com")).thenReturn(List.of(new Order()));

        mockMvc.perform(get("/api/orders/my")
                        .with(auth("user@example.com", "ROLE_USER")))
                .andExpect(status().isOk());
    }

    @Test
    void getOrderById_returnsOk() throws Exception {
        when(orderService.getOrderById(1L)).thenReturn(new Order());

        mockMvc.perform(get("/api/orders/1")
                        .with(auth("admin@example.com", "ROLE_ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    void updateOrderStatus_returnsOk() throws Exception {
        when(orderService.updateOrderStatus(1L, "PAID")).thenReturn(new Order());

        mockMvc.perform(put("/api/orders/1/status")
                        .with(auth("admin@example.com", "ROLE_ADMIN"))
                        .param("status", "PAID"))
                .andExpect(status().isOk());
    }

    private OrderCreateRequest buildOrderCreateRequest() {
        return new OrderCreateRequest(
                "Ivan",
                "+70000000000",
                "ivan@example.com",
                "Some street 1",
                LocalDate.now().plusDays(1),
                "10:00-12:00",
                "",
                List.of(new OrderItemRequest(1L, 2))
        );
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
