package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.dto.ChartDataPoint;
import com.greengrid.sgemsbackend.repository.DeviceRepository;
import com.greengrid.sgemsbackend.repository.EnergyReadingRepository;
import com.greengrid.sgemsbackend.repository.UserRepository;
import com.greengrid.sgemsbackend.service.SolarmanService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/stats")
//@CrossOrigin(origins = "http://localhost:3000")
public class StatsController {

    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final SolarmanService solarmanService;
    private final EnergyReadingRepository energyReadingRepository; // 1. New Field

    // 2. Updated Constructor
    public StatsController(UserRepository userRepository,
                           DeviceRepository deviceRepository,
                           SolarmanService solarmanService,
                           EnergyReadingRepository energyReadingRepository) {
        this.userRepository = userRepository;
        this.deviceRepository = deviceRepository;
        this.solarmanService = solarmanService;
        this.energyReadingRepository = energyReadingRepository;
    }

    @GetMapping
    public Map<String, Object> getSystemStats() {
        long activeUsers = userRepository.count();
        long connectedDevices = deviceRepository.count();

        // 3. REAL CALCULATION (Sum of DB data)
        Double totalGen = energyReadingRepository.getTotalEnergyGenerated();
        double energySaved = (totalGen != null) ? totalGen : 0.0;

        Map<String, Object> response = new HashMap<>();
        response.put("systemStatus", "Online");
        response.put("activeUsers", activeUsers);
        response.put("connectedDevices", connectedDevices);
        // Format to 1 decimal place (e.g., "150.5 kWh")
        response.put("energySaved", String.format("%.1f kWh", energySaved));

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

    // 3. CHART ENDPOINT (Fixes the 404 error)
    @GetMapping("/chart")
    public List<ChartDataPoint> getChartData(@RequestParam String role, @RequestParam(defaultValue = "7") int days) {
        // Map the "ADMIN" role to your main Solarman service data
        if ("ADMIN".equalsIgnoreCase(role)) {
            // Using getRealData() because it fetches the main station data defined in properties
            return solarmanService.getRealData();
        }

        // Optional: specific user logic (if needed later)
        // return solarmanService.getDataFromDatabase(userId, days);

        return new ArrayList<>();
    }

    @GetMapping("/chart/devices")
    public List<Map<String, Object>> getDevicePieChart() {
        List<Object[]> results = energyReadingRepository.getConsumptionByDevice();
        List<Map<String, Object>> chartData = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", row[0]);     // Device Name
            item.put("value", row[1]);    // Total Consumed kWh
            chartData.add(item);
        }
        return chartData;
    }
}