package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.entity.MaintenanceRequest;
import com.greengrid.sgemsbackend.service.MaintenanceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "http://localhost:3000")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public List<MaintenanceRequest> getAll(@RequestParam Long userId) {
        return maintenanceService.getAllForUser(userId);
    }

    @GetMapping("/{id}")
    public MaintenanceRequest getOne(@PathVariable Long id, @RequestParam Long userId) {
        return maintenanceService.getById(id, userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MaintenanceRequest create(@RequestBody MaintenanceRequest request, @RequestParam Long userId) {
        return maintenanceService.create(request, userId);
    }

    @PutMapping("/{id}")
    public MaintenanceRequest update(@PathVariable Long id, @RequestBody MaintenanceRequest request, @RequestParam Long userId) {
        return maintenanceService.update(id, request, userId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @RequestParam Long userId) {
        maintenanceService.delete(id, userId);
    }
}