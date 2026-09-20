package com.fooddelivery.dto;

import java.math.BigDecimal;


public class RestaurantRequest {
    private String name;
    private String description;
    private String address;
    private String phone;
    private String cuisineType;
    private BigDecimal deliveryFee;
    private BigDecimal minOrder;
    private Integer avgDeliveryTime;
    private String imageUrl;
    private String openingHours;
    private String ownerId;  // User ID of the restaurant owner
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getCuisineType() {
        return cuisineType;
    }
    
    public void setCuisineType(String cuisineType) {
        this.cuisineType = cuisineType;
    }
    
    public BigDecimal getDeliveryFee() {
        return deliveryFee;
    }
    
    public void setDeliveryFee(BigDecimal deliveryFee) {
        this.deliveryFee = deliveryFee;
    }
    
    public BigDecimal getMinOrder() {
        return minOrder;
    }
    
    public void setMinOrder(BigDecimal minOrder) {
        this.minOrder = minOrder;
    }
    
    public Integer getAvgDeliveryTime() {
        return avgDeliveryTime;
    }
    
    public void setAvgDeliveryTime(Integer avgDeliveryTime) {
        this.avgDeliveryTime = avgDeliveryTime;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getOpeningHours() {
        return openingHours;
    }
    
    public void setOpeningHours(String openingHours) {
        this.openingHours = openingHours;
    }
    
    public String getOwnerId() {
        return ownerId;
    }
    
    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }
}
