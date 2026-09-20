package com.fooddelivery.Schedular;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.repository.RestaurantRepository;

@Component
public class RatingSchedular {

    @Autowired
    private RestaurantRepository restaurantRepository;

    // Run every day at 2 AM
    @Scheduled(cron = "0 0 2 * * *")
    public void updateRestaurantRatings() {
        List<Restaurant> restaurants = restaurantRepository.findAll();

        for (Restaurant restaurant : restaurants) {
            // Skip if no rating data available - keep existing rating
            if (restaurant.getRating() == null) {
                restaurant.setRating(BigDecimal.valueOf(0.0));
                restaurantRepository.save(restaurant);
            }
            // In a full implementation, you'd calculate avg from a reviews table here
        }
    }
}
