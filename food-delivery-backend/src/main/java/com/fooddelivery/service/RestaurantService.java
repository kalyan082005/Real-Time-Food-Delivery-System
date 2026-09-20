package com.fooddelivery.service;

import java.time.LocalDateTime;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;

@Service
public class RestaurantService {
    @Autowired 
    private RestaurantRepository restaurantRepository;
    @Autowired
    private UserRepository userRepository;
    
    public List<Restaurant> getAllRestaurants(){
        return restaurantRepository.findAll();
    }

    public Restaurant getRestaurant(String id){
        return restaurantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }
     
    public List<Restaurant> searchByCuisine(String cuisineType){
        return restaurantRepository.findByCuisineType(cuisineType);
    }

    public Restaurant createRestaurant(String name,String address,String cuisineType,String ownerId){
        Restaurant restaurant = new Restaurant();
        restaurant.setName(name);
        restaurant.setAddress(address);
        restaurant.setCuisineType(cuisineType);
        restaurant.setOwner(userRepository.findById(ownerId)
            .orElseThrow(() -> new RuntimeException("User with ID " + ownerId + " not found")));
        restaurant.setCreatedAt(LocalDateTime.now());
        
        return restaurantRepository.save(restaurant);
    }

    
}
