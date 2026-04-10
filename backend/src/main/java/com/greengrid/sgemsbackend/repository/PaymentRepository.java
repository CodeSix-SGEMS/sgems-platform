package com.greengrid.sgemsbackend.repository;

import com.greengrid.sgemsbackend.entity.Payment;
import com.greengrid.sgemsbackend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // All payments for a specific invoice
    Optional<Payment> findByInvoice(Invoice invoice);

    // All payments for invoices belonging to a user (via invoice)
    List<Payment> findByInvoice_User_Id(Long userId);
}