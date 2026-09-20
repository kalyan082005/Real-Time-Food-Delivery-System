package com.fooddelivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.dto.CreateOrderRequest;
import com.fooddelivery.dto.UpdateStatusRequest;
import com.fooddelivery.entity.Order;
import com.fooddelivery.entity.OrderStatus;
import com.fooddelivery.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public Order createOrder(@RequestBody CreateOrderRequest request, Authentication authentication){
        String customerId = authentication.getName(); // Get user ID from JWT token
        return orderService.CreateOrder(
            customerId,
            request.getRestaurantId(),
            request.getItems(),
            request.getDeliveryAddressId(),
            request.getSpecialInstructions()
        );
    }

    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable String userId){
        return orderService.getUserOrders(userId);
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable String id){
        return orderService.getOrderById(id);
    }

    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable String id, 
                             @RequestBody UpdateStatusRequest request) {
        return orderService.updateOrderStatus(id, OrderStatus.valueOf(request.getStatus()));
    }
}
