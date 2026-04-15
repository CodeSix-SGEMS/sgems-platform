package com.greengrid.sgemsbackend.controller;

import com.greengrid.sgemsbackend.entity.Invoice;
import com.greengrid.sgemsbackend.service.InvoiceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // ADMIN — get all invoices (optionally filtered by date range)
    // GET /api/invoices?start=2024-01-01&end=2024-12-31
    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        if (start != null && end != null) {
            return ResponseEntity.ok(invoiceService.getInvoicesByDateRange(start, end));
        }
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    // USER — get own invoices (optionally filtered by date range)
    // GET /api/invoices/user/5?start=2024-01-01&end=2024-12-31
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Invoice>> getInvoicesForUser(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        if (start != null && end != null) {
            return ResponseEntity.ok(invoiceService.getInvoicesForUserByDateRange(userId, start, end));
        }
        return ResponseEntity.ok(invoiceService.getInvoicesForUser(userId));
    }

    // ADMIN — create invoice for a user
    // POST /api/invoices
    // Body: { "userId": 5, "unitsConsumed": 120.5 }
    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Double units = Double.valueOf(body.get("unitsConsumed").toString());
        return ResponseEntity.ok(invoiceService.createInvoice(userId, units));
    }

    // ADMIN — update invoice (only PENDING invoices)
    // PUT /api/invoices/3
    // Body: { "userId": 5, "unitsConsumed": 150.0 }
    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {

        Long userId = body.get("userId") != null
                ? Long.valueOf(body.get("userId").toString()) : null;
        Double units = body.get("unitsConsumed") != null
                ? Double.valueOf(body.get("unitsConsumed").toString()) : null;

        return ResponseEntity.ok(invoiceService.updateInvoice(id, userId, units));
    }

    // ADMIN — mark invoice as paid
    // PUT /api/invoices/pay/3
    // Body: { "method": "CARD" }
    @PutMapping("/pay/{id}")
    public ResponseEntity<Invoice> payInvoice(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {

        String method = (body != null) ? body.get("method") : "CARD";
        return ResponseEntity.ok(invoiceService.payInvoice(id, method));
    }

    // ADMIN — delete invoice
    // DELETE /api/invoices/3
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reports/invoices")
    public ResponseEntity<?> getInvoiceReport(@RequestParam(required = false) String startDate,
                                              @RequestParam(required = false) String endDate) {
        // Only admin can access
        LocalDate start = (startDate != null) ? LocalDate.parse(startDate) : LocalDate.now().minusDays(30);
        LocalDate end   = (endDate != null)   ? LocalDate.parse(endDate)   : LocalDate.now();

        List<Invoice> invoices = invoiceService.getInvoicesByDateRange(start, end);
        double totalRevenue = invoices.stream().mapToDouble(Invoice::getTotalAmount).sum();
        long paidCount = invoices.stream().filter(i -> "PAID".equals(i.getStatus())).count();
        long pendingCount = invoices.size() - paidCount;

        Map<String, Object> report = Map.of(
                "invoices", invoices,
                "totalRevenue", totalRevenue,
                "paidCount", paidCount,
                "pendingCount", pendingCount,
                "dateRange", start + " to " + end
        );
        return ResponseEntity.ok(report);
    }

}