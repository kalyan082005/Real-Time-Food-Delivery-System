package com.fooddelivery.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyOrderUpdate(String orderId, String status) {
        OrderUpdate update = new OrderUpdate(orderId, status, LocalDateTime.now());
        messagingTemplate.convertAndSend("/topic/orders/" + orderId, update);
    }

    public static class OrderUpdate {
        private String orderId;
        private String status;
        private LocalDateTime timestamp;

        public OrderUpdate(String orderId, String status, LocalDateTime timestamp) {
            this.orderId = orderId;
            this.status = status;
            this.timestamp = timestamp;
        }

        public String getOrderId() { return orderId; }
        public String getStatus() { return status; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
}
