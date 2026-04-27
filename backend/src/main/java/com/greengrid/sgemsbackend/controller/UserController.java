package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.entity.User;
import com.greengrid.sgemsbackend.repository.UserRepository;
import com.greengrid.sgemsbackend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // Constructor injection (remove @Autowired from fields)
    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // 1. Get All Users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. Add User (sends welcome email)
    @PostMapping("/add")
    public ResponseEntity<?> addUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Set default role if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        // Default email notifications to true
        if (user.getEmailNotifications() == null) {
            user.setEmailNotifications(true);
        }
        User savedUser = userRepository.save(user);   // capture saved user
        emailService.sendWelcomeEmail(savedUser);     // send welcome email
        return ResponseEntity.ok("User created successfully");
    }

    // 3. Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Cannot delete user. They have associated invoices, alerts, or maintenance requests. Delete those first."
            ));
        }
    }

    // 4. Change Role
    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeRole(@PathVariable Long id, @RequestParam String role) {
        return userRepository.findById(id).map(user -> {
            user.setRole(role);
            userRepository.save(user);
            return ResponseEntity.ok("Role updated");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newPassword = body.get("password");
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters.");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully.");
    }

    @PutMapping("/{id}/email-notifications")
    public ResponseEntity<?> updateEmailNotifications(@PathVariable Long id, @RequestParam Boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        user.setEmailNotifications(enabled);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("emailNotifications", enabled));
    }

    @PutMapping("/{id}/email")
    public ResponseEntity<?> updateEmail(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newEmail = request.get("email");
        if (newEmail == null || newEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email cannot be empty"));
        }

        Optional<User> existingUser = userRepository.findByEmail(newEmail);
        if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already in use"));
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        user.setEmail(newEmail);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Email updated successfully"));
    }

    @PutMapping("/{id}/name")
    public ResponseEntity<?> updateName(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newName = request.get("name");
        if (newName == null || newName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name cannot be empty"));
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        user.setFullName(newName);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Name updated successfully"));
    }
}