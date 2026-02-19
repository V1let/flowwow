package com.example.flowwow.service;

import com.example.flowwow.dto.auth.AuthRequest;
import com.example.flowwow.dto.auth.AuthResponse;
import com.example.flowwow.dto.auth.RegisterRequest;
import com.example.flowwow.security.JwtUtils;
import com.example.flowwow.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;

    // Явный конструктор
    public AuthService(AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils,
                       UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
    }

    public AuthResponse authenticateUser(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        userService.updateLastLogin(userDetails.getEmail());

        return new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
        );
    }

    public AuthResponse registerUser(RegisterRequest request) {
        userService.register(request);

        AuthRequest authRequest = new AuthRequest(request.getEmail(), request.getPassword());
        return authenticateUser(authRequest);
    }
}