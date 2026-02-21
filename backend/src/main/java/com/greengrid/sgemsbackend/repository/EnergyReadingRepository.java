package com.greengrid.sgemsbackend.repository;

import com.greengrid.sgemsbackend.entity.EnergyReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EnergyReadingRepository extends JpaRepository<EnergyReading, Long> {

    // Get readings for a specific device within date range
    @Query("SELECT e FROM EnergyReading e WHERE e.device.id = ?1 AND e.timestamp BETWEEN ?2 AND ?3 ORDER BY e.timestamp")
    List<EnergyReading> findByDeviceAndDateRange(Long deviceId, LocalDateTime start, LocalDateTime end);

    // Get readings for all devices of a user
    @Query("SELECT e FROM EnergyReading e WHERE e.device.owner.id = ?1 AND e.timestamp BETWEEN ?2 AND ?3 ORDER BY e.timestamp")
    List<EnergyReading> findByUserAndDateRange(Long userId, LocalDateTime start, LocalDateTime end);

    // Get latest reading for a device
    @Query("SELECT e FROM EnergyReading e WHERE e.device.id = ?1 ORDER BY e.timestamp DESC LIMIT 1")
    EnergyReading findLatestByDevice(Long deviceId);

    // Add this new query method
    @Query("SELECT SUM(e.generatedKwh) FROM EnergyReading e")
    Double getTotalEnergyGenerated();

    // GROUP BY Query: Returns [DeviceName, TotalConsumed]
    // This allows us to see which device is using the most energy
    @Query("SELECT d.name, SUM(e.consumedKwh) " +
            "FROM EnergyReading e JOIN e.device d " +
            "GROUP BY d.name")
    List<Object[]> getConsumptionByDevice();
}