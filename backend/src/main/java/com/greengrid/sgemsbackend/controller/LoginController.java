package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.entity.User;
import com.greengrid.sgemsbackend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // Import this
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Add this

    // Inject PasswordEncoder in the constructor
    public LoginController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // SECURITY CHECK:
            // Use .matches(rawPassword, hashedPassword)
            // ... inside the if (passwordEncoder.matches(...)) block ...

            if (passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "id", user.getId(),            // <--- ADD THIS LINE
                        "role", user.getRole(),
                        "fullName", user.getFullName()
                ));
            }
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }
}