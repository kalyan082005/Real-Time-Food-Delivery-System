package com.fooddelivery.service;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fooddelivery.entity.PaymentStatus;
import com.fooddelivery.exception.DuplicateOperationException;
import com.fooddelivery.exception.RefundFailedException;

import com.fooddelivery.entity.Payment;
import com.fooddelivery.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;

@Service
public class PaymentService {
    @Value("${stripe.secret-key}")    
    private String stripesecretkey;


    @Autowired
    private PaymentRepository paymentRepository;

    public Payment createPaymentIntent(String orderId,String userId,BigDecimal amount){
        Stripe.apiKey = stripesecretkey;
        try{
            long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();
            
            PaymentIntentCreateParams params = PaymentIntentCreateParams.
            builder()
                    
                .setAmount(amountInCents)
                .setCurrency("usd")
                .setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.
                    builder()
                        .setEnabled(true)
                        .build()

                )
                .putMetadata("orderId",orderId)
                .putMetadata("userId",userId)
                .build();

                PaymentIntent paymentIntent = PaymentIntent.create(params);
        
                Payment payment = new Payment();
                payment.setOrderId(orderId);
                payment.setUserId(userId);
                payment.setAmount(amount);
                payment.setStatus(PaymentStatus.PENDING);
                payment.setStripePaymentIntentId(paymentIntent.getId());
                payment.setStripeClientSecret(paymentIntent.getClientSecret());

                return paymentRepository.save(payment);
            }catch (StripeException e){
                throw new RuntimeException("Failed to create payment: "+e.getMessage()); 
            }
    
    }
    public Payment getPaymentByOrder(String orderId){
        return paymentRepository.findByOrderId(orderId)
        .orElseThrow(() ->  new RuntimeException("Payment not found for order: "+ orderId));
    }
    public Payment updatePaymentStatus(String stripePaymentIntentId,PaymentStatus status){
        Payment payment = paymentRepository.findByStripePaymentIntentId
        (stripePaymentIntentId)
            .orElseThrow(()-> new RuntimeException("Payment not found"));
        payment.setStatus(status);

        if(PaymentStatus.SUCCEEDED.equals(status)){
            payment.setProcessedAt(java.time.LocalDateTime.now());
        }
        return paymentRepository.save(payment);
 
    }
    public Payment refundPayment(String paymentId){
        Stripe.apiKey =stripesecretkey;
        Payment payment = paymentRepository.findById(paymentId)
        .orElseThrow(() -> new RuntimeException("Payment not found"));

    
    if(payment.getStatus() != PaymentStatus.SUCCEEDED){
        throw new RuntimeException("Can only refund succeeded payments");

    }
    if(payment.isRefunded()){
        throw new DuplicateOperationException("Already refunded");
    }
    try{
        RefundCreateParams params = RefundCreateParams.builder()
        .setPaymentIntent(payment.getStripePaymentIntentId())
        .build();

        Refund refund = Refund.create(params);
        switch(refund.getStatus()){
            case "succeeded":
                payment.setStatus(PaymentStatus.REFUNDED);
                payment.setProcessedAt(java.time.LocalDateTime.now());
                break;
            case "pending":
                payment.setStatus(PaymentStatus.REFUND_PENDING);
                break;
            default:
                throw new RefundFailedException("Refund failed with status: "+ refund.getStatus());
        }
        return paymentRepository.save(payment);

        
    }catch(StripeException e) {
        throw new RuntimeException("Refund failed: " + e.getMessage());
    }
}


    
        
}































































