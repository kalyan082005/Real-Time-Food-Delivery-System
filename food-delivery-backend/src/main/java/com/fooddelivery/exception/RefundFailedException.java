package com.fooddelivery.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_GATEWAY)  // Returns 502 (Stripe-side failure)
public class RefundFailedException extends RuntimeException {
    public RefundFailedException(String message) {
        super(message);
    }
}