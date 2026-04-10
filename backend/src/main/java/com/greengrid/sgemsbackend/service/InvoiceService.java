package com.greengrid.sgemsbackend.service;

import com.greengrid.sgemsbackend.entity.Invoice;
import com.greengrid.sgemsbackend.entity.Payment;
import com.greengrid.sgemsbackend.entity.User;
import com.greengrid.sgemsbackend.repository.InvoiceRepository;
import com.greengrid.sgemsbackend.repository.PaymentRepository;
import com.greengrid.sgemsbackend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class InvoiceService {

    // LKR per unit (kWh) — change this value to update the rate system-wide
    private static final double RATE_PER_UNIT = 25.0;

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          PaymentRepository paymentRepository,
                          UserRepository userRepository) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    // --- ADMIN: Get all invoices ---
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // --- ADMIN: Get invoices filtered by date range ---
    public List<Invoice> getInvoicesByDateRange(LocalDate start, LocalDate end) {
        return invoiceRepository.findByInvoiceDateBetween(start, end);
    }

    // --- USER: Get own invoices ---
    public List<Invoice> getInvoicesForUser(Long userId) {
        User user = findUserById(userId);
        return invoiceRepository.findByUser(user);
    }

    // --- USER: Get own invoices filtered by date range ---
    public List<Invoice> getInvoicesForUserByDateRange(Long userId, LocalDate start, LocalDate end) {
        User user = findUserById(userId);
        return invoiceRepository.findByUserAndInvoiceDateBetween(user, start, end);
    }

    // --- ADMIN: Create invoice for a specific user ---
    public Invoice createInvoice(Long userId, Double unitsConsumed) {
        User user = findUserById(userId);

        Invoice invoice = new Invoice();
        invoice.setUser(user);
        invoice.setUnitsConsumed(unitsConsumed);
        invoice.setTotalAmount(unitsConsumed * RATE_PER_UNIT);
        invoice.setStatus("PENDING");
        invoice.setInvoiceDate(LocalDate.now());

        return invoiceRepository.save(invoice);
    }

    // --- ADMIN: Update invoice (only if PENDING) ---
    public Invoice updateInvoice(Long invoiceId, Long userId, Double unitsConsumed) {
        Invoice invoice = findInvoiceById(invoiceId);

        if ("PAID".equals(invoice.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot edit a PAID invoice.");
        }

        // Allow reassigning to a different user if needed
        if (userId != null && !userId.equals(invoice.getUser().getId())) {
            User newUser = findUserById(userId);
            invoice.setUser(newUser);
        }

        if (unitsConsumed != null) {
            invoice.setUnitsConsumed(unitsConsumed);
            invoice.setTotalAmount(unitsConsumed * RATE_PER_UNIT);
        }

        return invoiceRepository.save(invoice);
    }

    // --- ADMIN: Mark invoice as PAID and record payment ---
    public Invoice payInvoice(Long invoiceId, String method) {
        Invoice invoice = findInvoiceById(invoiceId);

        if ("PAID".equals(invoice.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invoice is already paid.");
        }

        invoice.setStatus("PAID");
        invoiceRepository.save(invoice);

        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setAmount(invoice.getTotalAmount());
        payment.setMethod(method != null ? method : "CARD");
        payment.setPaymentDate(LocalDate.now());
        paymentRepository.save(payment);

        return invoice;
    }

    // --- ADMIN: Delete invoice ---
    public void deleteInvoice(Long invoiceId) {
        Invoice invoice = findInvoiceById(invoiceId);

        // Delete associated payment first (if exists)
        paymentRepository.findByInvoice(invoice)
                .ifPresent(paymentRepository::delete);

        invoiceRepository.delete(invoice);
    }

    // --- Get all payments (admin) ---
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // --- Get payments for a specific user ---
    public List<Payment> getPaymentsForUser(Long userId) {
        return paymentRepository.findByInvoice_User_Id(userId);
    }

    // --- Helpers ---
    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User not found with id: " + userId));
    }

    private Invoice findInvoiceById(Long invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Invoice not found with id: " + invoiceId));
    }
}