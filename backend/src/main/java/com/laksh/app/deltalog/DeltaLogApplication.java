package com.laksh.app.deltalog;

import com.laksh.app.deltalog.entity.User;
import com.laksh.app.deltalog.repository.UserRepo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class DeltaLogApplication {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(DeltaLogApplication.class, args);
        System.out.println("Hello World");

//        UserRepo userRepo = context.getBean(UserRepo.class);
//        User u1 = new User();
//        u1.setUsername("Laksh");
//        u1.setId(101);
//        u1.setEmail("laksh@email.com");
//
//        userRepo.save(u1);
    }

}
