package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.entity.User;
import com.greengrid.sgemsbackend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final UserRepository userRepository;

    public LoginController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        // 1. Find user by email
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // 2. Check password (Simple check for now)
            if (user.getPassword().equals(password)) {
                // SUCCESS! Return the user details (excluding password)
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "role", user.getRole(),
                        "fullName", user.getFullName()
                ));
            }
        }

        // FAILURE
        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }
}