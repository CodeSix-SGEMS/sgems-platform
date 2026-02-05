package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.repository.DeviceRepository;
import com.greengrid.sgemsbackend.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;

    public StatsController(UserRepository userRepository, DeviceRepository deviceRepository) {
        this.userRepository = userRepository;
        this.deviceRepository = deviceRepository;
    }

    @GetMapping
    public Map<String, Object> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalDevices = deviceRepository.count();

        // Simulating "Energy Saved" based on device count (e.g., 50 kWh per device)
        long energySaved = totalDevices * 50;

        return Map.of(
                "activeUsers", totalUsers,
                "connectedDevices", totalDevices,
                "energySaved", energySaved + " kWh",
                "systemStatus", "Online"
        );
    }
}