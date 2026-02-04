package com.greengrid.sgemsbackend;

import com.greengrid.sgemsbackend.entity.User;
import com.greengrid.sgemsbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder; // Import this

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) { // Inject Encoder
        return args -> {
            // Check if admin exists
            if (userRepository.findByEmail("admin@greengrid.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@greengrid.com");
                admin.setFullName("System Admin");
                admin.setRole("ADMIN");

                // ENCRYPT the password before saving!
                // "1234" becomes something like "$2a$10$w...XYZ"
                admin.setPassword(passwordEncoder.encode("1234"));

                userRepository.save(admin);
                System.out.println("✅ Secure Test User Created: admin@greengrid.com");
            }
        };
    }
}