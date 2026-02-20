package com.example.flowwow.controller;

import com.example.flowwow.entity.BlogPost;
import com.example.flowwow.entity.TeamMember;
import com.example.flowwow.entity.Testimonial;
import com.example.flowwow.service.ContentService;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ContentControllerTest {

    @Mock
    private ContentService contentService;

    @InjectMocks
    private ContentController controller;

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
    void getTestimonials_returnsOk() throws Exception {
        when(contentService.getActiveTestimonials()).thenReturn(List.of(new Testimonial()));

        mockMvc.perform(get("/api/content/testimonials"))
                .andExpect(status().isOk());
    }

    @Test
    void getTeamMembers_returnsOk() throws Exception {
        when(contentService.getActiveTeamMembers()).thenReturn(List.of(new TeamMember()));

        mockMvc.perform(get("/api/content/team"))
                .andExpect(status().isOk());
    }

    @Test
    void getBlogPosts_returnsOk() throws Exception {
        when(contentService.getActiveBlogPosts(PageRequest.of(0, 20)))
                .thenReturn(new PageImpl<>(List.of(new BlogPost()), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/content/blog")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk());
    }

    @Test
    void getBlogPost_returnsOk() throws Exception {
        when(contentService.getBlogPostBySlug("hello"))
                .thenReturn(new BlogPost());

        mockMvc.perform(get("/api/content/blog/hello"))
                .andExpect(status().isOk());
    }

    @Test
    void getBlogPostsByCategory_returnsOk() throws Exception {
        when(contentService.getBlogPostsByCategory("news", PageRequest.of(0, 20)))
                .thenReturn(new PageImpl<>(List.of(new BlogPost()), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/content/blog/category/news")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk());
    }
}
