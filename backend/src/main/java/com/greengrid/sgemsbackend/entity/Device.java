package com.greengrid.sgemsbackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;         // e.g., "Roof Solar Panel"
    private String type;         // "SOLAR_INVERTER", "SMART_METER", "WIND_TURBINE"
    private String serialNumber; // Unique ID from the hardware
    private String status;       // "ONLINE", "OFFLINE", "MAINTENANCE"

    // Link this device to a specific user
    // Many devices can belong to One user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
}