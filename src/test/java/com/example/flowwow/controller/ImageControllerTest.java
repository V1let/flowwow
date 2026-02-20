package com.example.flowwow.controller;

import com.example.flowwow.entity.ProductImage;
import com.example.flowwow.repository.ProductImageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ImageControllerTest {

    @Mock
    private ProductImageRepository productImageRepository;

    @InjectMocks
    private ImageController controller;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setMessageConverters(
                        new ByteArrayHttpMessageConverter(),
                        new MappingJackson2HttpMessageConverter()
                )
                .build();
    }

    @Test
    void getImage_returnsOk() throws Exception {
        ProductImage image = new ProductImage();
        image.setImageData(new byte[] {1, 2, 3});
        image.setContentType(MediaType.IMAGE_JPEG_VALUE);
        when(productImageRepository.findById(1L)).thenReturn(Optional.of(image));

        mockMvc.perform(get("/api/images/1"))
                .andExpect(status().isOk());
    }
}
