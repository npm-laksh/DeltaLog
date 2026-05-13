package com.laksh.app.deltalog.config;

import com.laksh.app.deltalog.service.impl.JwtService;
import com.laksh.app.deltalog.service.impl.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    ApplicationContext context;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("Path: " + request.getServletPath() + " | Auth Header: " + request.getHeader("Authorization"));

        String path = request.getServletPath();
        // if request is for login, ignore this filter and move on
        if (path.startsWith("/api/auth/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // 1. check if the header starts with "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
        }

        // 2. if we have a username and the user isn't already authenticated
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // load user details from the database
            UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(username);

            // validate the token
            if (jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // set the user in the Security Context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // continue with the filter chain
        filterChain.doFilter(request, response);
    }
}