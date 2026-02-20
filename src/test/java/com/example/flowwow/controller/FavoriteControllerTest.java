package com.example.flowwow.controller;

import com.example.flowwow.entity.Favorite;
import com.example.flowwow.service.FavoriteService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class FavoriteControllerTest {

    @Mock
    private FavoriteService favoriteService;

    @InjectMocks
    private FavoriteController controller;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
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
    void getUserFavorites_returnsOk() throws Exception {
        when(favoriteService.getUserFavorites(any())).thenReturn(List.of(new Favorite()));

        mockMvc.perform(get("/api/favorites")
                        .with(auth("user@example.com", "ROLE_USER")))
                .andExpect(status().isOk());
    }

    @Test
    void addToFavorites_returnsOk() throws Exception {
        doNothing().when(favoriteService).addToFavorites("user@example.com", 1L);

        mockMvc.perform(post("/api/favorites/1")
                        .with(auth("user@example.com", "ROLE_USER")))
                .andExpect(status().isOk());
    }

    @Test
    void removeFromFavorites_returnsOk() throws Exception {
        doNothing().when(favoriteService).removeFromFavorites("user@example.com", 1L);

        mockMvc.perform(delete("/api/favorites/1")
                        .with(auth("user@example.com", "ROLE_USER")))
                .andExpect(status().isOk());
    }

    @Test
    void isFavorite_returnsOk() throws Exception {
        when(favoriteService.isFavorite("user@example.com", 1L)).thenReturn(true);

        mockMvc.perform(get("/api/favorites/check/1")
                        .with(auth("user@example.com", "ROLE_USER")))
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
