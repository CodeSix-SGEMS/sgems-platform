package com.greengrid.sgemsbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deleted_alerts")
public class DeletedAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String systemId;
    private String issue;
    private String severity;
    private String status;
    private String voltage;
    private String battery;
    private LocalDateTime deletedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSystemId() { return systemId; }
    public void setSystemId(String systemId) { this.systemId = systemId; }

    public String getIssue() { return issue; }
    public void setIssue(String issue) { this.issue = issue; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getVoltage() { return voltage; }
    public void setVoltage(String voltage) { this.voltage = voltage; }

    public String getBattery() { return battery; }
    public void setBattery(String battery) { this.battery = battery; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}