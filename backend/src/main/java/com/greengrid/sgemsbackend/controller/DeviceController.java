package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.entity.Device;
import com.greengrid.sgemsbackend.entity.User;
import com.greengrid.sgemsbackend.repository.DeviceRepository;
import com.greengrid.sgemsbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/devices")
//@CrossOrigin(origins = "http://localhost:3000")
public class DeviceController {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Get My Devices
    @GetMapping("/my-devices/{userId}")
    public ResponseEntity<List<Device>> getMyDevices(@PathVariable Long userId) {
        List<Device> devices = deviceRepository.findByOwnerId(userId);
        return ResponseEntity.ok(devices); // Returns [] if empty, never null
    }

    // 2. Add Device
    @PostMapping("/add")
    public ResponseEntity<?> addDevice(@RequestBody Map<String, String> payload, @RequestParam Long userId) {
        Optional<User> owner = userRepository.findById(userId);
        if (owner.isEmpty()) return ResponseEntity.badRequest().body("User not found");

        Device device = new Device();
        device.setName(payload.get("name"));
        device.setType(payload.get("type"));
        device.setSerialNumber(payload.get("serialNumber"));
        device.setStatus("ONLINE");
        device.setOwner(owner.get());

        Device saved = deviceRepository.save(device);
        return ResponseEntity.ok(saved);
    }

    // 3. Toggle Status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return deviceRepository.findById(id).map(device -> {
            device.setStatus(status);
            deviceRepository.save(device);
            return ResponseEntity.ok("Status updated");
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. Delete Device
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDevice(@PathVariable Long id) {
        deviceRepository.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }
}