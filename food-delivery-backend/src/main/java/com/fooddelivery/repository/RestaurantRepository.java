package com.fooddelivery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.entity.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant,String> {
    List<Restaurant> findByCuisineType(String cuisineType);
    List<Restaurant> findByownerId(String ownerId);
    List<Restaurant> findByIsOpen(Boolean isOpen);
    
}
