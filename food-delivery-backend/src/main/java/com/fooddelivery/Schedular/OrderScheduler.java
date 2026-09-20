package com.fooddelivery.Schedular;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fooddelivery.entity.Order;
import com.fooddelivery.entity.OrderStatus;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.service.NotificationService;

@Component
@EnableScheduling
public class OrderScheduler {
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    // Run every 5 minutes
    @Scheduled(fixedRate = 300000)  // 5 minutes = 300000 milliseconds
    public void cancelExpiredOrders() {
        LocalDateTime thirtyMinutesAgo = LocalDateTime.now().minusMinutes(30);
        
        // Find old pending orders
        List<Order> expiredOrders = orderRepository
            .findByStatusAndCreatedAtBefore(OrderStatus.PENDING, thirtyMinutesAgo);
        
        for (Order order : expiredOrders) {
            // Cancel order
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
            
            // Notify customer
            notificationService.sendNotification(
                order.getCustomer().getId(),
                "Order Cancelled",
                "Your order #" + order.getId() + " was cancelled due to no confirmation",
                "ORDER_UPDATE"
            );
        }
    }
}