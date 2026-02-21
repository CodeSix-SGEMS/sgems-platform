package com.greengrid.sgemsbackend.dto;

public class DeviceStatsDto {
    private String name;
    private Double value;

    public DeviceStatsDto(String name, Double value) {
        this.name = name;
        this.value = value;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }
}