package com.fooddelivery.controller;

import com.fooddelivery.dto.ApiResponse;
import com.fooddelivery.dto.CreatePaymentIntentRequest;
import com.fooddelivery.entity.Payment;
import com.fooddelivery.entity.PaymentStatus;
import com.fooddelivery.service.PaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    // POST /api/payments/create-intent
    @PostMapping("/create-intent")
    public ResponseEntity<ApiResponse<Payment>> createPaymentIntent(
            @Valid @RequestBody CreatePaymentIntentRequest request,
            Authentication authentication) {

        String userId = authentication.getName();

        log.info("Creating payment intent for order={} user={} amount={}",
                request.getOrderId(), userId, request.getAmount());

        Payment payment = paymentService.createPaymentIntent(
                request.getOrderId(),
                userId,
                request.getAmount()
        );

        log.info("Payment intent created: paymentId={} stripeId={}",
                payment.getId(), payment.getStripePaymentIntentId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Payment intent created", payment));
    }

    // GET /api/payments/order/{orderId}
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentByOrder(
            @PathVariable String orderId,
            Authentication authentication) {

        String userId = authentication.getName();
        log.debug("Fetching payment for order={} by user={}", orderId, userId);

        Payment payment = paymentService.getPaymentByOrder(orderId);

        if (!payment.getUserId().equals(userId)) {
            log.warn("Unauthorized payment access attempt: user={} orderId={}", userId, orderId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(false, "Access denied", null));
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Payment found", payment));
    }

    // POST /api/payments/{id}/refund
    @PostMapping("/{id}/refund")
    public ResponseEntity<ApiResponse<Payment>> refundPayment(
            @PathVariable String id,
            Authentication authentication) {

        String userId = authentication.getName();
        log.info("Refund requested: paymentId={} by user={}", id, userId);

        Payment payment = paymentService.refundPayment(id);

        log.info("Refund processed: paymentId={} newStatus={}", id, payment.getStatus());

        return ResponseEntity.ok(new ApiResponse<>(true, "Payment refunded", payment));
    }

    // POST /api/payments/webhook — public, secured by Stripe-Signature header
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.warn("Invalid Stripe webhook signature: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        log.info("Stripe webhook received: type={} id={}", event.getType(), event.getId());

        switch (event.getType()) {
            case "payment_intent.succeeded": {
                PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer()
                        .getObject().orElseThrow();
                paymentService.updatePaymentStatus(intent.getId(), PaymentStatus.SUCCEEDED);
                log.info("Payment succeeded: stripeId={}", intent.getId());
                break;
            }
            case "payment_intent.payment_failed": {
                PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer()
                        .getObject().orElseThrow();
                paymentService.updatePaymentStatus(intent.getId(), PaymentStatus.FAILED);
                log.warn("Payment failed: stripeId={}", intent.getId());
                break;
            }
            default:
                log.debug("Unhandled Stripe event type: {}", event.getType());
        }

        return ResponseEntity.ok("Webhook processed");
    }
}
