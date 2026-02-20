package com.example.flowwow.controller;

import com.example.flowwow.dto.product.ProductCreateRequest;
import com.example.flowwow.entity.Product;
import com.example.flowwow.entity.ProductImage;
import com.example.flowwow.service.ProductService;
import com.example.flowwow.testutil.JacksonTestSupport;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController controller;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = JacksonTestSupport.objectMapperWithPageSupport();
        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter(objectMapper);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
                .setMessageConverters(jsonConverter)
                .build();
    }

    @Test
    void getAllProducts_returnsOk() throws Exception {
        when(productService.filterProducts(any(), any(), any(), any(), any()))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(List.of(new Product())));

        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk());
    }

    @Test
    void getHits_returnsOk() throws Exception {
        when(productService.getHits()).thenReturn(List.of(new Product()));

        mockMvc.perform(get("/api/products/hits"))
                .andExpect(status().isOk());
    }

    @Test
    void getNewProducts_returnsOk() throws Exception {
        when(productService.getNewProducts()).thenReturn(List.of(new Product()));

        mockMvc.perform(get("/api/products/new"))
                .andExpect(status().isOk());
    }

    @Test
    void getProductById_returnsOk() throws Exception {
        when(productService.getProductById(1L)).thenReturn(new Product());

        mockMvc.perform(get("/api/products/id/1"))
                .andExpect(status().isOk());
    }

    @Test
    void getProductBySlug_returnsOk() throws Exception {
        when(productService.getProductBySlug("rose"))
                .thenReturn(new Product());

        mockMvc.perform(get("/api/products/rose"))
                .andExpect(status().isOk());
    }

    @Test
    void createProduct_returnsOk() throws Exception {
        ProductCreateRequest request = buildProductCreateRequest();
        when(productService.createProduct(any(ProductCreateRequest.class))).thenReturn(new Product());

        mockMvc.perform(post("/api/products")
                        .with(user("admin@example.com").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void updateProduct_returnsOk() throws Exception {
        ProductCreateRequest request = buildProductCreateRequest();
        when(productService.updateProduct(any(Long.class), any(ProductCreateRequest.class))).thenReturn(new Product());

        mockMvc.perform(put("/api/products/1")
                        .with(user("admin@example.com").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void uploadProductImage_returnsOk() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "image.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                new byte[] {1, 2, 3}
        );
        when(productService.addImageToProductUpload(any(Long.class), any(), any(), any()))
                .thenReturn(new ProductImage());

        mockMvc.perform(multipart("/api/products/1/images/upload")
                        .file(file)
                        .param("isMain", "true")
                        .param("sortOrder", "0")
                        .with(user("admin@example.com").roles("ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    void deleteProduct_returnsOk() throws Exception {
        doNothing().when(productService).deleteProduct(1L);

        mockMvc.perform(delete("/api/products/1")
                        .with(user("admin@example.com").roles("ADMIN")))
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
