package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.entity.Payment;
import com.greengrid.sgemsbackend.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final InvoiceService invoiceService;

    public PaymentController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // ADMIN — get all payments
    // GET /api/payments
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(invoiceService.getAllPayments());
    }

    // USER — get own payment history
    // GET /api/payments/user/5
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getPaymentsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(invoiceService.getPaymentsForUser(userId));
    }
}