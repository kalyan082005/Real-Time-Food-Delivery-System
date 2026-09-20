package com.fooddelivery.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.entity.Order;
import com.fooddelivery.entity.OrderStatus;

public interface  OrderRepository  extends JpaRepository<Order,String>{
    List<Order> findByCustomer_Id(String customerId);
    List<Order> findByRestaurantId(String restaurantId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByStatusAndCreatedAtBefore(OrderStatus pending, LocalDateTime thirtyMinutesAgo);
    
}
