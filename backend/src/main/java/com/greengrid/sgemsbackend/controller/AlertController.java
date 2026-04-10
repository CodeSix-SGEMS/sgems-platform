package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.dto.AlertRequestDTO;
import com.greengrid.sgemsbackend.dto.AlertResponseDTO;
import com.greengrid.sgemsbackend.dto.DeletedAlertDTO;
import com.greengrid.sgemsbackend.service.AlertService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:3000")
public class AlertController {

    private final AlertService alertService;

    // Constructor injection (matches your InvoiceService style)
    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public List<AlertResponseDTO> getAllAlerts(@RequestParam Long userId) {
        return alertService.getAllAlerts(userId);
    }

    @GetMapping("/{id}")
    public AlertResponseDTO getAlert(@PathVariable Long id, @RequestParam Long userId) {
        return alertService.getAlert(id, userId);
    }

    @GetMapping("/history")
    public List<DeletedAlertDTO> getHistory(@RequestParam Long userId) {
        return alertService.getDeletedHistory(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AlertResponseDTO createAlert(@RequestBody AlertRequestDTO dto) {
        return alertService.createAlert(dto);
    }

    @PutMapping("/{id}")
    public AlertResponseDTO updateAlert(@PathVariable Long id,
                                        @RequestBody AlertRequestDTO dto,
                                        @RequestParam Long userId) {
        return alertService.updateAlert(id, dto, userId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAlert(@PathVariable Long id, @RequestParam Long userId) {
        alertService.deleteAlert(id, userId);
    }

    @DeleteMapping("/history")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearHistory(@RequestParam Long userId) {
        alertService.clearHistory(userId);
    }
}