package com.greengrid.sgemsbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "alerts")
public class Alert {

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore  // prevents infinite recursion when serializing
    private User user;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String systemId;
    private String issue;
    private String severity;    // Low, Medium, High, Critical
    private String status;      // Active, Resolved, Maintenance
    private String voltage;
    private String battery;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}