package com.fooddelivery.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name="payments")
public class Payment {
    @Id
    private String id = UUID.randomUUID().toString();
 
    private String orderId;      // Which order this payment is for
    private String userId;       // Who is paying

    private BigDecimal amount;   // How much (e.g., 48.15)
    private String currency = "USD";


    @Enumerated(EnumType.STRING)
    private PaymentStatus status;       // PENDING, SUCCEEDED, FAILED, REFUNDED

    private String paymentMethod = "CARD";

    private String stripePaymentIntentId;  // Stripe's ID: "pi_3abc..."
    private String stripeClientSecret;     // Sent to frontend to confirm

    private String failureReason;          // If payment failed, why

    private LocalDateTime createdAt;
    private LocalDateTime processedAt;

    @PrePersist
    public void perPersist(){
        if(id == null) id=UUID.randomUUID().toString();
        if(createdAt == null) createdAt = LocalDateTime.now(); 
        if(status == null)  status = PaymentStatus.PENDING;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public boolean isRefunded() {
        return PaymentStatus.REFUNDED.equals(this.status)
            || PaymentStatus.REFUND_PENDING.equals(this.status);
    }
    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStripePaymentIntentId() {
        return stripePaymentIntentId;
    }

    public void setStripePaymentIntentId(String stripePaymentIntentId) {
        this.stripePaymentIntentId = stripePaymentIntentId;
    }

    public String getStripeClientSecret() {
        return stripeClientSecret;
    }

    public void setStripeClientSecret(String stripeClientSecret) {
        this.stripeClientSecret = stripeClientSecret;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }

}
