package com.greengrid.sgemsbackend.repository;

import com.greengrid.sgemsbackend.entity.Invoice;
import com.greengrid.sgemsbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    // All invoices for a specific user
    List<Invoice> findByUser(User user);

    // User's invoices filtered by date range
    List<Invoice> findByUserAndInvoiceDateBetween(User user, LocalDate startDate, LocalDate endDate);

    // All invoices within a date range (admin use)
    List<Invoice> findByInvoiceDateBetween(LocalDate startDate, LocalDate endDate);
}