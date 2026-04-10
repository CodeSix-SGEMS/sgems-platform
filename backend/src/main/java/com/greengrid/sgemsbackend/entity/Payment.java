package com.greengrid.sgemsbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    private Double amount;
    private String method; // e.g. "CARD", "CASH", "BANK_TRANSFER"
    private LocalDate paymentDate;

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
}