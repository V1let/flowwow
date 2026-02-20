package com.example.flowwow.controller;

import com.example.flowwow.entity.Review;
import com.example.flowwow.service.ReviewService;
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

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AdminReviewControllerTest {

    @Mock
    private ReviewService reviewService;

    @InjectMocks
    private AdminReviewController controller;

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
    void getPendingReviews_returnsOk() throws Exception {
        when(reviewService.getPendingReviews(PageRequest.of(0, 20)))
                .thenReturn(new PageImpl<>(List.of(new Review()), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/admin/reviews/pending")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk());
    }

    @Test
    void approveReview_returnsOk() throws Exception {
        doNothing().when(reviewService).approveReview(1L);

        mockMvc.perform(post("/api/admin/reviews/1/approve"))
                .andExpect(status().isOk());
    }

    @Test
    void rejectReview_returnsOk() throws Exception {
        doNothing().when(reviewService).rejectReview(1L);

        mockMvc.perform(post("/api/admin/reviews/1/reject"))
                .andExpect(status().isOk());
    }
}
