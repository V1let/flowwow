package com.example.flowwow.controller;

import com.example.flowwow.entity.Role;
import com.example.flowwow.entity.User;
import com.example.flowwow.service.UserService;
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

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AdminUserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private AdminUserController controller;

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
    void getAllUsers_returnsOk() throws Exception {
        when(userService.getAllUsers(PageRequest.of(0, 20)))
                .thenReturn(new PageImpl<>(List.of(buildUser()), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/admin/users")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk());
    }

    @Test
    void getUserById_returnsOk() throws Exception {
        when(userService.getById(1L)).thenReturn(buildUser());

        mockMvc.perform(get("/api/admin/users/1"))
                .andExpect(status().isOk());
    }

    @Test
    void updateUserStatus_returnsOk() throws Exception {
        when(userService.updateUserStatus(1L, true)).thenReturn(buildUser());

        mockMvc.perform(put("/api/admin/users/1/status")
                        .param("isActive", "true"))
                .andExpect(status().isOk());
    }

    @Test
    void deleteUser_returnsOk() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/api/admin/users/1"))
                .andExpect(status().isOk());
    }

    private User buildUser() {
        Role role = new Role();
        role.setName("ADMIN");
        User user = new User();
        user.setName("Ivan");
        user.setEmail("ivan@example.com");
        user.setPhone("+70000000000");
        user.setRole(role);
        user.setIsActive(true);
        user.setLastLogin(LocalDateTime.now());
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }
}
