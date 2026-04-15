package com.greengrid.sgemsbackend.repository;

import com.greengrid.sgemsbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Boot automatically writes the SQL for this:
    // "SELECT * FROM users WHERE email = ?"
    Optional<User> findByEmail(String email);
    List<User> findByRole(String role);
}