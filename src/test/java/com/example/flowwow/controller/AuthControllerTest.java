package com.example.flowwow.controller;

import com.example.flowwow.dto.auth.AuthRequest;
import com.example.flowwow.dto.auth.AuthResponse;
import com.example.flowwow.dto.auth.ForgotPasswordRequest;
import com.example.flowwow.dto.auth.RegisterRequest;
import com.example.flowwow.dto.auth.ResetPasswordRequest;
import com.example.flowwow.service.AuthService;
import com.example.flowwow.service.UserService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController controller;

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
    void login_returnsOk() throws Exception {
        AuthRequest request = new AuthRequest("user@example.com", "password");
        when(authService.authenticateUser(any(AuthRequest.class))).thenReturn(new AuthResponse());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void register_returnsOk() throws Exception {
        RegisterRequest request = new RegisterRequest("User", "user@example.com", "+70000000000", "password");
        when(authService.registerUser(any(RegisterRequest.class))).thenReturn(new AuthResponse());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void forgotPassword_returnsOk() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest("user@example.com");
        doNothing().when(userService).createPasswordResetToken("user@example.com");

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void resetPassword_returnsOk() throws Exception {
        ResetPasswordRequest request = new ResetPasswordRequest("token", "newpass123");
        doNothing().when(userService).resetPassword("token", "newpass123");

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}
