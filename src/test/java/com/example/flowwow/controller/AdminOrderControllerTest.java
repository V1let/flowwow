package com.example.flowwow.controller;

import com.example.flowwow.entity.Order;
import com.example.flowwow.service.OrderService;
import com.example.flowwow.testutil.JacksonTestSupport;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AdminOrderControllerTest {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private AdminOrderController controller;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        ObjectMapper mapper = JacksonTestSupport.objectMapperWithPageSupport();
        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter(mapper);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
                .setMessageConverters(jsonConverter)
                .build();
    }

    @Test
    void getAllOrders_returnsOk() throws Exception {
        when(orderService.getAllOrders(PageRequest.of(0, 20)))
                .thenReturn(new PageImpl<>(List.of(new Order()), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/admin/orders")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk());
    }

    @Test
    void getOrderById_returnsOk() throws Exception {
        when(orderService.getOrderById(1L)).thenReturn(new Order());

        mockMvc.perform(get("/api/admin/orders/1"))
                .andExpect(status().isOk());
    }

    @Test
    void updateOrderStatus_returnsOk() throws Exception {
        when(orderService.updateOrderStatus(1L, "PAID")).thenReturn(new Order());

        mockMvc.perform(put("/api/admin/orders/1/status")
                        .param("status", "PAID"))
                .andExpect(status().isOk());
    }
}
