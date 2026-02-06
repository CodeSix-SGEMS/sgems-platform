package com.greengrid.sgemsbackend.service;

import com.greengrid.sgemsbackend.dto.ChartDataPoint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

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

            // PYTHON LOGIC: "start_date = now.strftime('%Y-%m-01')"
            // We want last 7 days, so we adapt slightly, but keep the STRING format.
            LocalDate today = LocalDate.now();
            LocalDate weekAgo = today.minusDays(6); // Last 7 days including today

            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String startDateStr = weekAgo.format(fmt);
            String endDateStr = today.format(fmt);

            // Build Request Body (Matching Python)
            Map<String, Object> body = new HashMap<>();
            body.put("stationId", myStationId);
            body.put("startTime", startDateStr); // Sending STRING "2026-02-01"
            body.put("endTime", endDateStr);     // Sending STRING "2026-02-07"
            body.put("timeType", 2);             // 2 = Daily Stats

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            System.out.println("📤 Requesting: " + startDateStr + " to " + endDateStr);

            Map response = restTemplate.postForObject(url, entity, Map.class);
            // System.out.println("📥 Response: " + response); // Uncomment to debug

            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                List<Map> dataList = (List<Map>) response.get("stationDataItems");

                if (dataList != null) {
                    for (Map item : dataList) {
                        // Extract Value
                        double val = 0.0;
                        if (item.get("generationValue") != null) {
                            val = Double.parseDouble(item.get("generationValue").toString());
                        } else if (item.get("value") != null) {
                            val = Double.parseDouble(item.get("value").toString());
                        }

                        // Extract Date from integers (Python: year/month/day)
                        String dayLabel = "Unk";
                        if (item.containsKey("day") && item.containsKey("month")) {
                            int d = Integer.parseInt(item.get("day").toString());
                            int m = Integer.parseInt(item.get("month").toString());
                            int y = Integer.parseInt(item.get("year").toString());
                            LocalDate date = LocalDate.of(y, m, d);
                            dayLabel = date.getDayOfWeek().name().substring(0, 3); // "MON"
                        }

                        chartData.add(new ChartDataPoint(dayLabel, val, val * 0.4));
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Fetch Failed: " + e.getMessage());
        }
        return chartData;
    }
}