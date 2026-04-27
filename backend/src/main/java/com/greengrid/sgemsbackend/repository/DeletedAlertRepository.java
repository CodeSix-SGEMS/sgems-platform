package com.greengrid.sgemsbackend.repository;

import com.greengrid.sgemsbackend.entity.DeletedAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface DeletedAlertRepository extends JpaRepository<DeletedAlert, Long> {
    List<DeletedAlert> findByUserId(Long userId);
    void deleteByUserId(Long userId);
    List<DeletedAlert> findByDeletedAtBetween(LocalDateTime start, LocalDateTime end);
    List<DeletedAlert> findByUserIdAndDeletedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
}