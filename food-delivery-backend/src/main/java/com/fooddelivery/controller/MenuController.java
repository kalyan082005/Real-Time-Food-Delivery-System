package com.fooddelivery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.fooddelivery.dto.MenuItemRequest;
import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.service.MenuService;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/menu")
public class MenuController{
    @Autowired
    private MenuService menuService;
    @GetMapping
    public List<MenuItem> getMenu(@PathVariable String restaurantId){
        return menuService.getRestaurantMenu(restaurantId);
    }

    @PostMapping
    public MenuItem addItem(@PathVariable String restaurantId,
                           @RequestBody MenuItemRequest request){
        return menuService.addMenuItem(restaurantId, request);
    }
}