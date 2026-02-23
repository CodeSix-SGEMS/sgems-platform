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
                        "id", user.getId(),
                        "role", user.getRole(),
                        "fullName", user.getFullName()
                ));
            }
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        // 1. Check if the email already exists in the database
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("message", "Email is already taken"));
        }

        // 2. Hash the password before saving it (CRITICAL for security)
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        // 3. Assign a default role for new signups
        if (newUser.getRole() == null || newUser.getRole().isEmpty()) {
            newUser.setRole("USER"); // or "CUSTOMER" depending on your system
        }

        // 4. Save the new user to the MySQL database
        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }
}