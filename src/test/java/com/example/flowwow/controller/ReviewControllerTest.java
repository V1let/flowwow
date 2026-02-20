package com.example.flowwow.controller;

import com.example.flowwow.dto.review.ReviewCreateRequest;
import com.example.flowwow.entity.Review;
import com.example.flowwow.service.ReviewService;
import com.example.flowwow.testutil.JacksonTestSupport;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ReviewControllerTest {

    @Mock
    private ReviewService reviewService;

    @InjectMocks
    private ReviewController controller;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = JacksonTestSupport.objectMapperWithPageSupport();
        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter(objectMapper);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(
                        new AuthenticationPrincipalArgumentResolver(),
                        new PageableHandlerMethodArgumentResolver()
                )
                .setMessageConverters(jsonConverter)
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createReview_returnsOk() throws Exception {
        ReviewCreateRequest request = new ReviewCreateRequest(1L, "Ivan", 5, "Great");
        when(reviewService.createReview(any(ReviewCreateRequest.class), any())).thenReturn(new Review());

        mockMvc.perform(post("/api/reviews")
                        .with(auth("user@example.com", "ROLE_USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void getProductReviews_returnsOk() throws Exception {
        when(reviewService.getProductReviews(1L)).thenReturn(List.of(new Review()));

        mockMvc.perform(get("/api/reviews/product/1"))
                .andExpect(status().isOk());
    }

    @Test
    void getRecentReviews_returnsOk() throws Exception {
        when(reviewService.getRecentReviews(3)).thenReturn(List.of(new Review()));

        mockMvc.perform(get("/api/reviews/recent")
                        .param("limit", "3"))
                .andExpect(status().isOk());
    }

    @Test
    void getPendingReviews_returnsOk() throws Exception {
        when(reviewService.getPendingReviews(PageRequest.of(0, 20)))
                .thenReturn(new PageImpl<>(List.of(new Review()), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/reviews/pending")
                        .param("page", "0")
                        .param("size", "20")
                        .with(auth("admin@example.com", "ROLE_ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    void approveReview_returnsOk() throws Exception {
        doNothing().when(reviewService).approveReview(1L);

        mockMvc.perform(post("/api/reviews/1/approve")
                        .with(auth("admin@example.com", "ROLE_ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    void rejectReview_returnsOk() throws Exception {
        doNothing().when(reviewService).rejectReview(1L);

        mockMvc.perform(post("/api/reviews/1/reject")
                        .with(auth("admin@example.com", "ROLE_ADMIN")))
                .andExpect(status().isOk());
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
