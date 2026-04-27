package com.greengrid.sgemsbackend.repository;

import com.greengrid.sgemsbackend.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaintenanceRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByUserId(Long userId);
}