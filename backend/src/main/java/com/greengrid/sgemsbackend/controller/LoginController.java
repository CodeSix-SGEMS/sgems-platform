package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.entity.User;
import com.greengrid.sgemsbackend.repository.UserRepository;
import com.greengrid.sgemsbackend.service.EmailService;  // add this import
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;   // add this import
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;      // add this field

    // update constructor
    public LoginController(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpServletRequest request) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (passwordEncoder.matches(password, user.getPassword())) {
                // send login alert email (async)
                String ip = request.getRemoteAddr();
                String userAgent = request.getHeader("User-Agent");
                emailService.sendLoginAlertEmail(user, ip, userAgent);

                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "id", user.getId(),
                        "role", user.getRole(),
                        "fullName", user.getFullName(),
                        "emailNotifications", user.getEmailNotifications() != null ? user.getEmailNotifications() : false
                ));
            }
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("message", "Email is already taken"));
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        if (newUser.getRole() == null || newUser.getRole().isEmpty()) {
            newUser.setRole("USER");
        }

        if (newUser.getEmailNotifications() == null) {
            newUser.setEmailNotifications(true);
        }

        User savedUser = userRepository.save(newUser);
        System.out.println("Saved user ID: " + savedUser.getId() + ", email: " + savedUser.getEmail());
        System.out.println("Calling sendWelcomeEmail...");
        emailService.sendWelcomeEmail(savedUser);
        System.out.println("sendWelcomeEmail called (async)");

        // send welcome email (async)
        emailService.sendWelcomeEmail(savedUser);

        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }
}