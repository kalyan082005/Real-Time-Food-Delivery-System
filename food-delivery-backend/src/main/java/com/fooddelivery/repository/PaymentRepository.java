package com.fooddelivery.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fooddelivery.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, String> {

    // Returns the most recent payment for an order
    @Query("SELECT p FROM Payment p WHERE p.orderId = :orderId ORDER BY p.createdAt DESC LIMIT 1")
    Optional<Payment> findByOrderId(@Param("orderId") String orderId);

    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);
}
