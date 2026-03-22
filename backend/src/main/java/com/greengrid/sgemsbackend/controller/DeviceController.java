package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.entity.Device;
import com.greengrid.sgemsbackend.entity.InventoryItem;
import com.greengrid.sgemsbackend.entity.User;
import com.greengrid.sgemsbackend.repository.DeviceRepository;
import com.greengrid.sgemsbackend.repository.EnergyReadingRepository;
import com.greengrid.sgemsbackend.repository.InventoryRepository;
import com.greengrid.sgemsbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private EnergyReadingRepository energyReadingRepository;

    // 1. Get My Devices (for a specific user)
    @GetMapping("/my-devices/{userId}")
    public ResponseEntity<List<Device>> getMyDevices(@PathVariable Long userId) {
        List<Device> devices = deviceRepository.findByOwnerId(userId);
        return ResponseEntity.ok(devices);
    }

    // ✅ 2. Get ALL devices — admin view
    @GetMapping("/all")
    public ResponseEntity<List<Device>> getAllDevices() {
        return ResponseEntity.ok(deviceRepository.findAll());
    }

    // 3. Add Device — validates serial number against inventory
    @PostMapping("/add")
    public ResponseEntity<?> addDevice(@RequestBody Map<String, String> payload,
                                       @RequestParam Long userId) {
        Optional<User> owner = userRepository.findById(userId);
        if (owner.isEmpty()) return ResponseEntity.badRequest().body("User not found.");

        String serialNumber = payload.get("serialNumber");
        if (serialNumber == null || serialNumber.trim().isEmpty())
            return ResponseEntity.badRequest().body("Serial number is required.");

        Optional<InventoryItem> inventoryItemOpt =
                inventoryRepository.findBySerialNumber(serialNumber.trim());

        if (inventoryItemOpt.isEmpty())
            return ResponseEntity.badRequest().body(
                    "Serial number '" + serialNumber + "' is not recognized. " +
                            "Please check your device serial and try again."
            );

        InventoryItem inventoryItem = inventoryItemOpt.get();

        if ("In Use".equals(inventoryItem.getStatus()))
            return ResponseEntity.badRequest().body(
                    "Serial number '" + serialNumber + "' is already registered to another device. " +
                            "Please contact your administrator if you believe this is an error."
            );

        if ("Retired".equals(inventoryItem.getStatus()))
            return ResponseEntity.badRequest().body(
                    "Serial number '" + serialNumber + "' belongs to a retired device and cannot be registered."
            );

        if ("Under Maintenance".equals(inventoryItem.getStatus()))
            return ResponseEntity.badRequest().body(
                    "Serial number '" + serialNumber + "' is currently under maintenance and cannot be registered."
            );

        inventoryItem.setStatus("In Use");
        inventoryRepository.save(inventoryItem);

        Device device = new Device();
        device.setName(payload.get("name"));
        device.setType(inventoryItem.getName());
        device.setSerialNumber(serialNumber.trim());
        device.setStatus("ONLINE");
        device.setOwner(owner.get());
        device.setInventoryItem(inventoryItem);

        return ResponseEntity.ok(deviceRepository.save(device));
    }

    // 4. Toggle Status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return deviceRepository.findById(id).map(device -> {
            device.setStatus(status);
            deviceRepository.save(device);
            return ResponseEntity.ok("Status updated");
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Delete Device (by user from My Sites)
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDevice(@PathVariable Long id) {
        Optional<Device> deviceOpt = deviceRepository.findById(id);
        if (deviceOpt.isEmpty()) return ResponseEntity.notFound().build();

        Device device = deviceOpt.get();

        // Delete energy readings first to avoid FK constraint
        energyReadingRepository.deleteByDeviceId(id);

        // Restore inventory
        InventoryItem inventoryItem = device.getInventoryItem();
        if (inventoryItem != null) {
            inventoryItem.setStatus("Available");
            inventoryRepository.save(inventoryItem);
        }

        deviceRepository.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }

    // ✅ 6. Admin unbind — force-remove any device regardless of owner
    @Transactional
    @DeleteMapping("/admin/unbind/{id}")
    public ResponseEntity<?> adminUnbindDevice(@PathVariable Long id) {
        Optional<Device> deviceOpt = deviceRepository.findById(id);
        if (deviceOpt.isEmpty()) return ResponseEntity.notFound().build();

        Device device = deviceOpt.get();

        // Delete energy readings first
        energyReadingRepository.deleteByDeviceId(id);

        // Restore inventory item to Available
        InventoryItem inventoryItem = device.getInventoryItem();
        if (inventoryItem != null) {
            inventoryItem.setStatus("Available");
            inventoryRepository.save(inventoryItem);
        }

        deviceRepository.deleteById(id);
        return ResponseEntity.ok(
                "Device '" + device.getName() + "' (S/N: " + device.getSerialNumber() +
                        ") has been unbound from " + device.getOwner().getFullName() + "."
        );
    }
}