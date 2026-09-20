package com.fooddelivery.controller;
import java.util.*;
import com.fooddelivery.dto.RestaurantRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.service.RestaurantService;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {
    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    public List<Restaurant> getAllRestaurants(){
        return restaurantService.getAllRestaurants();
    }
    @GetMapping("/{id}")
    public Restaurant getRestaurant(@PathVariable String id){
            return restaurantService.getRestaurant(id);
    }
    @GetMapping("/search")
    public List<Restaurant> search(@RequestParam String cuisine){
        return restaurantService.searchByCuisine(cuisine);

    }

    @PostMapping
    public Restaurant create(@RequestBody RestaurantRequest request ){
        return restaurantService.createRestaurant(
            request.getName(),
            request.getAddress(),
            request.getCuisineType(),
            request.getOwnerId()
        );
    }

    
        
    

}
