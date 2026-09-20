package com.fooddelivery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem,String> {
    List<OrderItem> findByOrderId(String orderId);
    
}
