package com.greengrid.sgemsbackend.repository;

import com.greengrid.sgemsbackend.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByUserId(Long userId);
}