package com.greengrid.sgemsbackend.dto;

public class ChartDataPoint {
    private String day;
    private double generated;
    private double consumed;

    public ChartDataPoint(String day, double generated, double consumed) {
        this.day = day;
        this.generated = generated;
        this.consumed = consumed;
    }

    // Getters
    public String getDay() { return day; }
    public double getGenerated() { return generated; }
    public double getConsumed() { return consumed; }
}