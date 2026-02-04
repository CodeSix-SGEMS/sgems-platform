package com.greengrid.sgemsbackend;

import com.greengrid.sgemsbackend.entity.User;
import com.greengrid.sgemsbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            // Check if admin exists, if not, create one
            if (userRepository.findByEmail("admin@greengrid.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@greengrid.com");
                admin.setPassword("1234"); // In production, we encrypt this!
                admin.setFullName("System Admin");
                admin.setRole("ADMIN");

                userRepository.save(admin);
                System.out.println("✅ Test User Created: admin@greengrid.com / 1234");
            }
        };
    }
}