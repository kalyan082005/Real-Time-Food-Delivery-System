package com.fooddelivery.service;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.dto.MenuItemRequest;
import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.RestaurantRepository;

@Service
public class MenuService {
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    public List<MenuItem> getRestaurantMenu(String restaurantId){
        return menuItemRepository.findByRestaurantIdAndIsAvailable(restaurantId, true);
    }

    public MenuItem addMenuItem(String restaurantId, String name,  BigDecimal price, String category){
        MenuItem item = new MenuItem();
        item.setRestaurant(restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId)));
            
        item.setName(name);
        item.setPrice(price);
        item.setCategory(category);
        return menuItemRepository.save(item);
    }
    
    public MenuItem addMenuItem(String restaurantId, MenuItemRequest request){
        MenuItem item = new MenuItem();
        item.setRestaurant(restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId)));
            
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory());
        item.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true);
        item.setIsVegetarian(request.getIsVegetarian() != null ? request.getIsVegetarian() : false);
        item.setPrepTime(request.getPrepTime());
        item.setImageUrl(request.getImageUrl());
        
        return menuItemRepository.save(item);
    }
                               
}
