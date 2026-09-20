package com.fooddelivery.controller;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.Executors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fooddelivery.entity.Order;
import com.fooddelivery.repository.OrderRepository;

@RestController
@RequestMapping("/api/sse")
public class SSEController {

    @Autowired
    private OrderRepository orderRepository;

    // GET /api/sse/orders/{userId}
    // Streams the user's orders every 5 seconds via Server-Sent Events
    @GetMapping(value = "/orders/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamOrders(@PathVariable String userId) {
        SseEmitter emitter = new SseEmitter(60_000L); // 60 second timeout

        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                for (int i = 0; i < 12; i++) { // stream for up to 60 seconds (12 x 5s)
                    List<Order> orders = orderRepository.findByCustomer_Id(userId);
                    emitter.send(SseEmitter.event()
                        .name("orders")
                        .data(orders, MediaType.APPLICATION_JSON));
                    Thread.sleep(5000);
                }
                emitter.complete();
            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }
}
