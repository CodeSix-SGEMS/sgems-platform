package com.greengrid.sgemsbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "energy_readings")
public class EnergyReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(nullable = false)
    private Double generatedKwh;

    @Column(nullable = false)
    private Double consumedKwh;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    // Constructors
    public EnergyReading() {}

    public EnergyReading(Device device, Double generatedKwh, Double consumedKwh, LocalDateTime timestamp) {
        this.device = device;
        this.generatedKwh = generatedKwh;
        this.consumedKwh = consumedKwh;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Device getDevice() { return device; }
    public void setDevice(Device device) { this.device = device; }

    public Double getGeneratedKwh() { return generatedKwh; }
    public void setGeneratedKwh(Double generatedKwh) { this.generatedKwh = generatedKwh; }

    public Double getConsumedKwh() { return consumedKwh; }
    public void setConsumedKwh(Double consumedKwh) { this.consumedKwh = consumedKwh; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}