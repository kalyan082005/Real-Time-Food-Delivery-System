// Create: food-delivery-backend/src/main/java/com/fooddelivery/dto/OrderItemRequest.java
package com.fooddelivery.dto;

public class OrderItemRequest {
    private String menuItemId;
    private Integer quantity;
    
    public String getMenuItemId() { return menuItemId; }
    public void setMenuItemId(String menuItemId) { this.menuItemId = menuItemId; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
