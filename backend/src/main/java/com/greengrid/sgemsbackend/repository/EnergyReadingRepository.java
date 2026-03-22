package com.greengrid.sgemsbackend.repository;

import com.greengrid.sgemsbackend.entity.EnergyReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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

    // Total energy generated across all devices
    @Query("SELECT SUM(e.generatedKwh) FROM EnergyReading e")
    Double getTotalEnergyGenerated();

    // GROUP BY Query: Returns [DeviceName, TotalConsumed]
    @Query("SELECT d.name, SUM(e.consumedKwh) " +
            "FROM EnergyReading e JOIN e.device d " +
            "GROUP BY d.name")
    List<Object[]> getConsumptionByDevice();

    // ✅ Delete all energy readings for a device before deleting the device
    // @Modifying + @Transactional required for DELETE queries in Spring Data JPA
    @Modifying
    @Transactional
    @Query("DELETE FROM EnergyReading e WHERE e.device.id = ?1")
    void deleteByDeviceId(Long deviceId);
}