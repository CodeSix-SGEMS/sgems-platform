package com.greengrid.sgemsbackend.repository;

import com.greengrid.sgemsbackend.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {

    // ✅ Look up an inventory item by its serial number
    Optional<InventoryItem> findBySerialNumber(String serialNumber);
}