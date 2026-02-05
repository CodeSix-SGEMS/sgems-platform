package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.entity.Device;
import com.greengrid.sgemsbackend.entity.User;
import com.greengrid.sgemsbackend.repository.DeviceRepository;
import com.greengrid.sgemsbackend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    public DeviceController(DeviceRepository deviceRepository, UserRepository userRepository) {
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
    }

    // 1. Get MY Devices (We pass the user ID in the query for now, e.g. ?userId=1)
    @GetMapping
    public List<Device> getMyDevices(@RequestParam Long userId) {
        return deviceRepository.findByOwnerId(userId);
    }

    // 2. Add New Device
    @PostMapping
    public ResponseEntity<?> addDevice(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String name = (String) payload.get("name");
        String type = (String) payload.get("type");
        String serial = (String) payload.get("serialNumber");

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Device device = new Device();
        device.setName(name);
        device.setType(type);
        device.setSerialNumber(serial);
        device.setStatus("ONLINE"); // Default status
        device.setOwner(userOpt.get());

        deviceRepository.save(device);
        return ResponseEntity.ok(Map.of("message", "Device added successfully"));
    }

    // 3. Delete Device
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDevice(@PathVariable Long id) {
        if (deviceRepository.existsById(id)) {
            deviceRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Device deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    // 4. Update Device (Rename or Change Status)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDevice(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return deviceRepository.findById(id).map(device -> {
            if (payload.containsKey("name")) device.setName((String) payload.get("name"));
            if (payload.containsKey("status")) device.setStatus((String) payload.get("status"));

            deviceRepository.save(device);
            return ResponseEntity.ok(Map.of("message", "Device updated successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}