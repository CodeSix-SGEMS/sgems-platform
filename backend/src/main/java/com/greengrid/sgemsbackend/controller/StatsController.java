package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.dto.ChartDataPoint;
import com.greengrid.sgemsbackend.repository.DeviceRepository;
import com.greengrid.sgemsbackend.repository.UserRepository;
import com.greengrid.sgemsbackend.service.SolarmanService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:3000")
public class StatsController {

    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final SolarmanService solarmanService;

    // Constructor Injection
    public StatsController(UserRepository userRepository, DeviceRepository deviceRepository, SolarmanService solarmanService) {
        this.userRepository = userRepository;
        this.deviceRepository = deviceRepository;
        this.solarmanService = solarmanService;
    }

    // 1. SYSTEM STATS (For Admin Dashboard Cards)
    // This was likely missing or broken!
    @GetMapping
    public Map<String, Object> getSystemStats() {
        long activeUsers = userRepository.count();
        long connectedDevices = deviceRepository.count();
        long energySaved = connectedDevices * 50; // Simple calculation logic

        Map<String, Object> response = new HashMap<>();
        response.put("systemStatus", "Online");
        response.put("activeUsers", activeUsers);
        response.put("connectedDevices", connectedDevices);
        response.put("energySaved", energySaved + " kWh");

        return response;
    }

    // 2. USER STATS (For Personal Dashboard Cards)
    @GetMapping("/user/{id}")
    public Map<String, Object> getUserStats(@PathVariable Long id) {
        long myDevices = deviceRepository.findByOwnerId(id).size();

        // Simulating personal energy logic
        long myGeneration = myDevices * 120;
        long myConsumption = 450;

        return Map.of(
                "myDevices", myDevices,
                "energyGenerated", myGeneration + " kWh",
                "energyConsumed", myConsumption + " kWh",
                "netSavings", "$" + (myGeneration * 0.15)
        );
    }

    // 3. CHART DATA (Solarman Integration)
    @GetMapping("/chart")
    public List<ChartDataPoint> getChartData(@RequestParam(defaultValue = "USER") String role) {

        // If Admin, try Real Solarman Data
        if (role.equals("ADMIN")) {
            List<ChartDataPoint> realData = solarmanService.getRealData();
            if (!realData.isEmpty()) {
                return realData;
            }
            System.out.println("⚠️ API Unreachable/Empty, using simulation.");
        }

        // Fallback / User Simulation
        List<ChartDataPoint> data = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        Random rand = new Random();
        double multiplier = role.equals("ADMIN") ? 1000.0 : 10.0;

        for (String day : days) {
            double generated = (rand.nextInt(50) + 10) * multiplier;
            double consumed = (rand.nextInt(40) + 10) * multiplier;
            data.add(new ChartDataPoint(day, generated, consumed));
        }
        return data;
    }
}