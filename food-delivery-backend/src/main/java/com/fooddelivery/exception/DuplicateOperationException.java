package com.fooddelivery.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)  // Returns 409
public class DuplicateOperationException extends RuntimeException {
    public DuplicateOperationException(String message) {
        super(message);
    }
}