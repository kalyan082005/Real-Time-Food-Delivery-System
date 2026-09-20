package com.fooddelivery.repository;
import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.entity.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem,String> {
    List<MenuItem> findByRestaurantId(String restaurantid);
    List<MenuItem> findByRestaurantIdAndIsAvailable(String restaurantId, Boolean isAvailable);
}
