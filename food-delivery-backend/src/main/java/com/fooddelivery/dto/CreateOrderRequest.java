// Create: food-delivery-backend/src/main/java/com/fooddelivery/dto/CreateOrderRequest.java
package com.fooddelivery.dto;

import java.util.List;

public class CreateOrderRequest {
    private String restaurantId;
    private String deliveryAddressId;
    private List<OrderItemRequest> items;
    private String specialInstructions;
    
    // Getters and setters
    public String getRestaurantId() { return restaurantId; }
    public void setRestaurantId(String restaurantId) { this.restaurantId = restaurantId; }
    
    public String getDeliveryAddressId() { return deliveryAddressId; }
    public void setDeliveryAddressId(String deliveryAddressId) { this.deliveryAddressId = deliveryAddressId; }
    
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
}
