package com.greengrid.sgemsbackend.service;

import com.greengrid.sgemsbackend.dto.AlertRequestDTO;
import com.greengrid.sgemsbackend.dto.AlertResponseDTO;
import com.greengrid.sgemsbackend.dto.DeletedAlertDTO;
import com.greengrid.sgemsbackend.entity.Alert;
import com.greengrid.sgemsbackend.entity.DeletedAlert;
import com.greengrid.sgemsbackend.entity.User;
import com.greengrid.sgemsbackend.repository.AlertRepository;
import com.greengrid.sgemsbackend.repository.DeletedAlertRepository;
import com.greengrid.sgemsbackend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final DeletedAlertRepository deletedAlertRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public AlertService(AlertRepository alertRepository,
                        DeletedAlertRepository deletedAlertRepository,
                        UserRepository userRepository,
                        EmailService emailService) {
        this.alertRepository = alertRepository;
        this.deletedAlertRepository = deletedAlertRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // Get all alerts (admin sees all, user sees only own)
    public List<AlertResponseDTO> getAllAlerts(Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "User not found"));
        List<Alert> alerts;
        if ("ADMIN".equals(currentUser.getRole())) {
            alerts = alertRepository.findAll();
        } else {
            alerts = alertRepository.findByUserId(currentUserId);
        }
        return alerts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Get single alert (with ownership check)
    public AlertResponseDTO getAlert(Long id, Long currentUserId) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));
        if (!"ADMIN".equals(currentUser.getRole()) && !alert.getUser().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your alert");
        }
        return convertToDTO(alert);
    }

    // Create alert – assign to user
    public AlertResponseDTO createAlert(AlertRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user"));
        Alert alert = new Alert();
        updateEntityFromDTO(alert, dto);
        alert.setUser(user);
        Alert saved = alertRepository.save(alert);

        // Send email notification asynchronously
        emailService.sendAlertEmail(saved, user);

        // Send to all admin users
        List<User> admins = userRepository.findByRole("ADMIN");
        for (User admin : admins) {
            if (!admin.getId().equals(user.getId())) {
                emailService.sendAlertEmail(saved, admin);
            }
        }

        return convertToDTO(saved);
    }


    // Update – ensure user owns the alert or is admin
    public AlertResponseDTO updateAlert(Long id, AlertRequestDTO dto, Long currentUserId) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));
        if (!"ADMIN".equals(currentUser.getRole()) && !alert.getUser().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your alert");
        }
        updateEntityFromDTO(alert, dto);
        // Optional: admin can reassign user
        if ("ADMIN".equals(currentUser.getRole()) && dto.getUserId() != null && !dto.getUserId().equals(alert.getUser().getId())) {
            User newUser = userRepository.findById(dto.getUserId()).orElse(null);
            if (newUser != null) alert.setUser(newUser);
        }
        Alert updated = alertRepository.save(alert);
        return convertToDTO(updated);
    }

    // Delete – move to history and remove
    @Transactional
    public void deleteAlert(Long id, Long currentUserId) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));
        if (!"ADMIN".equals(currentUser.getRole()) && !alert.getUser().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your alert");
        }
        // Move to history
        DeletedAlert deleted = new DeletedAlert();
        deleted.setSystemId(alert.getSystemId());
        deleted.setIssue(alert.getIssue());
        deleted.setSeverity(alert.getSeverity());
        deleted.setStatus(alert.getStatus());
        deleted.setVoltage(alert.getVoltage());
        deleted.setBattery(alert.getBattery());
        deleted.setDeletedAt(LocalDateTime.now());
        deleted.setUserId(alert.getUser().getId());
        deletedAlertRepository.save(deleted);
        // Remove from active
        alertRepository.delete(alert);
    }

    // Get deleted history (filtered by role)
    public List<DeletedAlertDTO> getDeletedHistory(Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));
        List<DeletedAlert> history;
        if ("ADMIN".equals(currentUser.getRole())) {
            history = deletedAlertRepository.findAll();
        } else {
            history = deletedAlertRepository.findByUserId(currentUserId);
        }
        return history.stream().map(this::convertToDeletedDTO).collect(Collectors.toList());
    }

    // Clear history (admin clears all, user clears own)
    @Transactional
    public void clearHistory(Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));
        if ("ADMIN".equals(currentUser.getRole())) {
            deletedAlertRepository.deleteAll();
        } else {
            deletedAlertRepository.deleteByUserId(currentUserId);
        }
    }

    // ---------- Helper methods ----------
    private AlertResponseDTO convertToDTO(Alert alert) {
        return new AlertResponseDTO(
                alert.getId(),
                alert.getSystemId(),
                alert.getIssue(),
                alert.getSeverity(),
                alert.getStatus(),
                alert.getVoltage(),
                alert.getBattery(),
                alert.getCreatedAt(),
                alert.getUpdatedAt(),
                alert.getUser().getId()
        );
    }

    private void updateEntityFromDTO(Alert alert, AlertRequestDTO dto) {
        alert.setSystemId(dto.getSystemId());
        alert.setIssue(dto.getIssue());
        if (dto.getSeverity() != null) alert.setSeverity(dto.getSeverity());
        if (dto.getStatus() != null) alert.setStatus(dto.getStatus());
        alert.setVoltage(dto.getVoltage());
        alert.setBattery(dto.getBattery());
    }

    private DeletedAlertDTO convertToDeletedDTO(DeletedAlert da) {
        return new DeletedAlertDTO(
                da.getId(),
                da.getSystemId(),
                da.getIssue(),
                da.getSeverity(),
                da.getStatus(),
                da.getVoltage(),
                da.getBattery(),
                da.getDeletedAt(),
                da.getUserId()
        );
    }
}