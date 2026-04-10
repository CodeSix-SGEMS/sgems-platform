package com.greengrid.sgemsbackend.dto;

import java.time.LocalDateTime;

public class AlertResponseDTO {
    private Long id;
    private String systemId;
    private String issue;
    private String severity;
    private String status;
    private String voltage;
    private String battery;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor
    public AlertResponseDTO(Long id, String systemId, String issue, String severity,
                            String status, String voltage, String battery,
                            LocalDateTime createdAt, LocalDateTime updatedAt,
                            Long userId) {
        this.id = id;
        this.systemId = systemId;
        this.issue = issue;
        this.severity = severity;
        this.status = status;
        this.voltage = voltage;
        this.battery = battery;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
    }

    // Getters only (or setters if needed)
    public Long getId() { return id; }
    public String getSystemId() { return systemId; }
    public String getIssue() { return issue; }
    public String getSeverity() { return severity; }
    public String getStatus() { return status; }
    public String getVoltage() { return voltage; }
    public String getBattery() { return battery; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    private Long userId;
    public Long getUserId() { return userId; }
}