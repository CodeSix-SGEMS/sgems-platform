package com.greengrid.sgemsbackend.service;

import com.greengrid.sgemsbackend.dto.ChartDataPoint;
import com.greengrid.sgemsbackend.repository.DeviceRepository;
import com.greengrid.sgemsbackend.repository.EnergyReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import com.greengrid.sgemsbackend.entity.EnergyReading;
import com.greengrid.sgemsbackend.entity.Device;
import com.greengrid.sgemsbackend.repository.EnergyReadingRepository;
import com.greengrid.sgemsbackend.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;

@Service
public class SolarmanService {

    @Value("${solarman.app-id}")
    private String appId;

    @Value("${solarman.app-secret}")
    private String appSecret;

    @Value("${solarman.email}")
    private String email;

    @Value("${solarman.password}")
    private String password;

    @Value("${solarman.api-url}")
    private String apiUrl;

    @Autowired
    private EnergyReadingRepository energyReadingRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    private String accessToken = null;
    private Long stationId = null;

    // --- HELPER: SHA-256 Encryption ---
    private String sha256(String base) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(base.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    // 1. Get Access Token
    public String getAccessToken() {
        if (accessToken != null) return accessToken;

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = apiUrl + "/account/v1.0/token?appId=" + appId + "&language=en";

            Map<String, String> body = new HashMap<>();
            body.put("appSecret", appSecret);
            body.put("email", email);
            body.put("password", sha256(password));
            body.put("appId", appId); // Added appId to body too, just in case

            Map response = restTemplate.postForObject(url, body, Map.class);

            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                accessToken = (String) response.get("access_token");
                return accessToken;
            }
        } catch (Exception e) {
            System.err.println("❌ Auth Error: " + e.getMessage());
        }
        return null;
    }

    // 2. Get Station ID
    @Cacheable(value = "stationId", unless = "#result == null")
    public Long getStationId() {
        if (stationId != null) return stationId;
        String token = getAccessToken();
        if (token == null) return null;

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = apiUrl + "/station/v1.0/list?language=en";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            Map response = restTemplate.postForObject(url, entity, Map.class);

            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                List<Map> stationList = (List<Map>) response.get("stationList");
                if (!stationList.isEmpty()) {
                    stationId = Long.valueOf(stationList.get(0).get("id").toString());
                    return stationId;
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Get Station Failed: " + e.getMessage());
        }
        return null;
    }

    // 3. Get Real Data (PYTHON LOGIC ADAPTATION)

    public List<ChartDataPoint> getRealData() {
        Long myStationId = getStationId();
        if (myStationId == null) return new ArrayList<>();

        List<ChartDataPoint> chartData = new ArrayList<>();

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = apiUrl + "/station/v1.0/history?language=en";

            LocalDate today = LocalDate.now();
            LocalDate weekAgo = today.minusDays(6);

            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String startDateStr = weekAgo.format(fmt);
            String endDateStr = today.format(fmt);

            Map<String, Object> body = new HashMap<>();
            body.put("stationId", myStationId);
            body.put("startTime", startDateStr);
            body.put("endTime", endDateStr);
            body.put("timeType", 2);

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            System.out.println("📤 Requesting: " + startDateStr + " to " + endDateStr);

            Map response = restTemplate.postForObject(url, entity, Map.class);

            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                List<Map> dataList = (List<Map>) response.get("stationDataItems");

                if (dataList != null) {
                    // ✅ Get the first solar device - match your actual device types
                    Device device = deviceRepository.findAll().stream()
                            .filter(d -> d.getType() != null && (
                                    d.getType().toUpperCase().contains("SOLAR") ||
                                            d.getType().toUpperCase().contains("PANEL") ||
                                            d.getType().toUpperCase().contains("INVERTER")
                            ))
                            .findFirst()
                            .orElse(null);

                    if (device == null) {
                        System.err.println("⚠️ No solar device found in database. Skipping save.");
                    }

                    for (Map item : dataList) {
                        double val = 0.0;
                        if (item.get("generationValue") != null) {
                            val = Double.parseDouble(item.get("generationValue").toString());
                        } else if (item.get("value") != null) {
                            val = Double.parseDouble(item.get("value").toString());
                        }

                        String dayLabel = "Unk";
                        LocalDateTime timestamp = LocalDateTime.now();

                        if (item.containsKey("day") && item.containsKey("month")) {
                            int d = Integer.parseInt(item.get("day").toString());
                            int m = Integer.parseInt(item.get("month").toString());
                            int y = Integer.parseInt(item.get("year").toString());
                            LocalDate date = LocalDate.of(y, m, d);
                            timestamp = date.atStartOfDay();
                            dayLabel = date.format(DateTimeFormatter.ofPattern("MMM dd"));
                        }

                        // --- CHANGED LOGIC START ---
                        double consumed = 0.0;

                        // 1. Check if we ALREADY have this data in the database
                        if (device != null) {
                            LocalDateTime dayStart = timestamp;
                            LocalDateTime dayEnd = timestamp.plusDays(1);

                            List<EnergyReading> existingReadings = energyReadingRepository
                                    .findByDeviceAndDateRange(device.getId(), dayStart, dayEnd);

                            if (!existingReadings.isEmpty()) {
                                // EXISTING DATA: Use the saved value so the graph doesn't change
                                consumed = existingReadings.get(0).getConsumedKwh();
                                System.out.println("✅ Using existing DB value for " + dayLabel + ": " + consumed);
                            } else {
                                // NEW DATA: Calculate random ONCE and save it
                                consumed = val * (0.6 + Math.random() * 0.4);

                                EnergyReading reading = new EnergyReading(device, val, consumed, timestamp);
                                energyReadingRepository.save(reading);
                                System.out.println("💾 Saved NEW reading: " + dayLabel + " -> " + consumed);
                            }
                        }
                        // --- CHANGED LOGIC END ---

                        chartData.add(new ChartDataPoint(dayLabel, val, consumed));
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Fetch Failed: " + e.getMessage());
            e.printStackTrace();
        }

        return chartData;
    }

    // 4. Get Live Real-Time Data for the Flow Chart
    public Map<String, Object> getLiveSystemStats() {
        Map<String, Object> liveStats = new HashMap<>();

        // Default safe values
        liveStats.put("currentSolar", 0.0);
        liveStats.put("currentConsumption", 0.0);
        liveStats.put("batteryLevel", 0);
        liveStats.put("gridPower", 0.0);

        Long myStationId = getStationId();
        String token = getAccessToken();

        if (myStationId == null || token == null) {
            return liveStats;
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = apiUrl + "/station/v1.0/realTime?language=en";

            Map<String, Object> body = new HashMap<>();
            body.put("stationId", myStationId);

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            Map response = restTemplate.postForObject(url, entity, Map.class);

            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                System.out.println("Live API Response: " + response);

                // NULL-SAFE CHECKS
                if (response.get("generationPower") != null) {
                    liveStats.put("currentSolar", Double.parseDouble(response.get("generationPower").toString()) / 1000.0);
                }
                if (response.get("usePower") != null) {
                    liveStats.put("currentConsumption", Double.parseDouble(response.get("usePower").toString()) / 1000.0);
                }
                if (response.get("gridPower") != null) {
                    liveStats.put("gridPower", Double.parseDouble(response.get("gridPower").toString()) / 1000.0);
                }
                if (response.get("batterySoc") != null) {
                    liveStats.put("batteryLevel", Integer.parseInt(response.get("batterySoc").toString()));
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Live Fetch Failed: " + e.getMessage());
        }

        return liveStats;
    }

    // ✅ NEW: Get data from database instead of API
    @Cacheable(value = "energyData", key = "#userId + '-' + #daysBack", unless = "#result.isEmpty()")
    public List<ChartDataPoint> getDataFromDatabase(Long userId, int daysBack) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(daysBack);

        List<EnergyReading> readings = energyReadingRepository.findByUserAndDateRange(
                userId, startDate, endDate
        );

        if (readings.isEmpty()) {
            System.out.println("⚠️ No readings found in database, fetching from API...");
            return getRealData(); // Fallback to API if DB is empty
        }

        System.out.println("✅ Returning " + readings.size() + " readings from database");

        return readings.stream()
                .map(r -> new ChartDataPoint(
                        r.getTimestamp().format(DateTimeFormatter.ofPattern("MMM dd")),
                        r.getGeneratedKwh(),
                        r.getConsumedKwh()
                ))
                .collect(Collectors.toList());
    }
}