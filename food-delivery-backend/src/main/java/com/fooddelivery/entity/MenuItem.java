package com.fooddelivery.entity;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="menu_items")
public class MenuItem {
   
    @Id
    private String id = UUID.randomUUID().toString();
    
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    
    private Boolean isAvailable = true;
    private Boolean isVegetarian = false;
    
    private Integer prepTime;
    private String imageUrl;
    
    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;
    
    
}
