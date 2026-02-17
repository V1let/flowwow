package com.example.flowwow.security;

import com.example.flowwow.config.JwtConfig;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.logging.Logger;

@Component
public class JwtUtils {

    private static final Logger logger = Logger.getLogger(JwtUtils.class.getName());

    private final JwtConfig jwtConfig;

    // Явный конструктор
    public JwtUtils(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    private Key key() {
        return Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes());
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtConfig.getExpiration()))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.severe("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.severe("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.severe("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.severe("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }
}