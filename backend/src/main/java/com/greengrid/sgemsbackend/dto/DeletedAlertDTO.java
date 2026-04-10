// DeletedAlertDTO.java
package com.greengrid.sgemsbackend.dto;

import java.time.LocalDateTime;

public class DeletedAlertDTO {
    private Long id;
    private String systemId;
    private String issue;
    private String severity;
    private String status;
    private String voltage;
    private String battery;
    private LocalDateTime deletedAt;
    private Long userId;

    // Constructor with userId (9 parameters)
    public DeletedAlertDTO(Long id, String systemId, String issue, String severity,
                           String status, String voltage, String battery,
                           LocalDateTime deletedAt, Long userId) {
        this.id = id;
        this.systemId = systemId;
        this.issue = issue;
        this.severity = severity;
        this.status = status;
        this.voltage = voltage;
        this.battery = battery;
        this.deletedAt = deletedAt;
        this.userId = userId;
    }

    // Getters
    public Long getId() { return id; }
    public String getSystemId() { return systemId; }
    public String getIssue() { return issue; }
    public String getSeverity() { return severity; }
    public String getStatus() { return status; }
    public String getVoltage() { return voltage; }
    public String getBattery() { return battery; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public Long getUserId() { return userId; }
}