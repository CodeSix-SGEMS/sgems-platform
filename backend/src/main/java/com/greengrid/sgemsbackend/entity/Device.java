package com.greengrid.sgemsbackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;         // e.g., "Roof Solar Panel" (user-defined friendly name)
    private String type;         // copied from InventoryItem.name at registration time
    private String serialNumber; // must match an InventoryItem serial
    private String status;       // "ONLINE", "OFFLINE"

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    // ✅ Link back to the inventory item this device was registered from
    @ManyToOne
    @JoinColumn(name = "inventory_item_id", nullable = true)
    private InventoryItem inventoryItem;

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public InventoryItem getInventoryItem() { return inventoryItem; }
    public void setInventoryItem(InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; }
}