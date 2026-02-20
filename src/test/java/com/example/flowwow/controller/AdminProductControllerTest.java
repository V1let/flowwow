package com.example.flowwow.controller;

import com.example.flowwow.dto.product.ProductCreateRequest;
import com.example.flowwow.dto.product.ProductUpdateRequest;
import com.example.flowwow.entity.Product;
import com.example.flowwow.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AdminProductControllerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private AdminProductController controller;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setMessageConverters(new MappingJackson2HttpMessageConverter())
                .build();
    }

    @Test
    void getAllProducts_returnsOk() throws Exception {
        when(productService.getAllProductsForAdmin()).thenReturn(List.of(new Product()));

        mockMvc.perform(get("/api/admin/products"))
                .andExpect(status().isOk());
    }

    @Test
    void getArchivedProducts_returnsOk() throws Exception {
        when(productService.getArchivedProductsForAdmin()).thenReturn(List.of(new Product()));

        mockMvc.perform(get("/api/admin/products/archive"))
                .andExpect(status().isOk());
    }

    @Test
    void createProduct_returnsOk() throws Exception {
        ProductCreateRequest request = buildProductCreateRequest();
        when(productService.createProduct(any(ProductCreateRequest.class))).thenReturn(new Product());

        mockMvc.perform(post("/api/admin/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void updateProduct_returnsOk() throws Exception {
        ProductCreateRequest request = buildProductCreateRequest();
        when(productService.updateProduct(any(Long.class), any(ProductCreateRequest.class))).thenReturn(new Product());

        mockMvc.perform(put("/api/admin/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void updateProductPartial_returnsOk() throws Exception {
        ProductUpdateRequest request = new ProductUpdateRequest();
        request.setName("Updated");
        request.setPrice(new BigDecimal("12.00"));
        when(productService.updateProductPartial(any(Long.class), any(ProductUpdateRequest.class)))
                .thenReturn(new Product());

        mockMvc.perform(patch("/api/admin/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteProduct_returnsOk() throws Exception {
        doNothing().when(productService).deleteProduct(1L);

        mockMvc.perform(delete("/api/admin/products/1"))
                .andExpect(status().isOk());
    }

    @Test
    void restoreProduct_returnsOk() throws Exception {
        when(productService.restoreProduct(1L)).thenReturn(new Product());

        mockMvc.perform(post("/api/admin/products/1/restore"))
                .andExpect(status().isOk());
    }

    private ProductCreateRequest buildProductCreateRequest() {
        return new ProductCreateRequest(
                "Bouquet",
                1L,
                "Roses",
                new BigDecimal("19.99"),
                null,
                "Nice bouquet",
                false,
                true,
                List.of()
        );
    }
}
