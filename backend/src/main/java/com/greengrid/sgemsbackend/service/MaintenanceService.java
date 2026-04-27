package com.greengrid.sgemsbackend.service;

import com.greengrid.sgemsbackend.entity.MaintenanceRequest;
import com.greengrid.sgemsbackend.entity.User;
import com.greengrid.sgemsbackend.repository.MaintenanceRepository;
import com.greengrid.sgemsbackend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final UserRepository userRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository, UserRepository userRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.userRepository = userRepository;
    }

    public List<MaintenanceRequest> getAllForUser(Long userId) {
        return maintenanceRepository.findByUserId(userId);
    }

    public MaintenanceRequest getById(Long id, Long userId) {
        MaintenanceRequest request = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!request.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return request;
    }

    public MaintenanceRequest create(MaintenanceRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        request.setUser(user);
        request.setCreatedAt(LocalDateTime.now());
        if (request.getStatus() == null) request.setStatus("PENDING");
        return maintenanceRepository.save(request);
    }

    public MaintenanceRequest update(Long id, MaintenanceRequest updated, Long userId) {
        MaintenanceRequest existing = getById(id, userId);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());
        if ("COMPLETED".equals(updated.getStatus()) && existing.getResolvedAt() == null) {
            existing.setResolvedAt(LocalDateTime.now());
        }
        return maintenanceRepository.save(existing);
    }

    public void delete(Long id, Long userId) {
        MaintenanceRequest existing = getById(id, userId);
        maintenanceRepository.delete(existing);
    }
}