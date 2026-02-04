package com.greengrid.sgemsbackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users") // This tells H2 to create a table named 'users'
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String fullName;
    private String role; // e.g., "ADMIN", "USER"

    // --- Getters and Setters (IntelliJ can generate these, but here they are) ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}