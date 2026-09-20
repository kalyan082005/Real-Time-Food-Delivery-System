package com.fooddelivery.entity;

import java.math.BigDecimal;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "order_items")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class OrderItem {
     @Id
    private String id = UUID.randomUUID().toString();
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnoreProperties({"items", "customer", "restaurant"})
    private Order order;
    
    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    @JsonIgnoreProperties({"restaurant"})
    private MenuItem menuItem;
    
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;

    
}
