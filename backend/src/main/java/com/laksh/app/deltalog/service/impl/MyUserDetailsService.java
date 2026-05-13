package com.laksh.app.deltalog.service.impl;

import com.laksh.app.deltalog.entity.User;
import com.laksh.app.deltalog.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // find user in DB
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User with email "+email+" not found"));

        if(user == null) {
            throw new UsernameNotFoundException("User with email "+email+" not found");
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
//                .authorities("USER") // Default role
                .authorities("ROLE_USER")
                .build();
    }
}
