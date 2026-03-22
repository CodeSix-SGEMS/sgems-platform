package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.entity.InventoryItem;
import com.greengrid.sgemsbackend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    // GET all inventory items (admin view)
    @GetMapping
    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    // POST — admin adds a new inventory item with a unique serial number
    @PostMapping
    public ResponseEntity<?> addItem(@RequestBody InventoryItem item) {
        // ✅ Serial number is required
        if (item.getSerialNumber() == null || item.getSerialNumber().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Serial number is required.");
        }

        // ✅ Serial must be unique in inventory
        if (inventoryRepository.findBySerialNumber(item.getSerialNumber().trim()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Serial number '" + item.getSerialNumber() + "' already exists in inventory.");
        }

        if (item.getStatus() == null || item.getStatus().isEmpty()) {
            item.setStatus("Available");
        }
        item.setSerialNumber(item.getSerialNumber().trim());

        return ResponseEntity.ok(inventoryRepository.save(item));
    }

    // PUT — update an existing inventory item
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id,
                                        @RequestBody InventoryItem updated) {
        Optional<InventoryItem> existing = inventoryRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();

        InventoryItem item = existing.get();

        // ✅ If serial is being changed, ensure new serial is not already taken
        if (!item.getSerialNumber().equals(updated.getSerialNumber())) {
            if (inventoryRepository.findBySerialNumber(updated.getSerialNumber().trim()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body("Serial number '" + updated.getSerialNumber() + "' is already in use.");
            }
            // ✅ Cannot change serial while device is actively registered
            if ("In Use".equals(item.getStatus())) {
                return ResponseEntity.badRequest()
                        .body("Cannot change serial number while this item is registered as an active device.");
            }
            item.setSerialNumber(updated.getSerialNumber().trim());
        }

        item.setName(updated.getName());
        item.setCategory(updated.getCategory());
        item.setLocation(updated.getLocation());
        item.setStatus(updated.getStatus());

        return ResponseEntity.ok(inventoryRepository.save(item));
    }

    // DELETE — cannot delete items that are currently registered as active devices
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        Optional<InventoryItem> existing = inventoryRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();

        InventoryItem item = existing.get();

        // ✅ Block deletion if device is actively registered
        if ("In Use".equals(item.getStatus())) {
            return ResponseEntity.badRequest().body(
                    "Cannot delete '" + item.getName() + "' (S/N: " + item.getSerialNumber() + ") " +
                            "— it is currently registered as an active device. " +
                            "The user must remove the device first."
            );
        }

        inventoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}