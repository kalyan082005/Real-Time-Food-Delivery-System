package com.fooddelivery.dto;

import java.math.BigDecimal;

public class LocationUpdateRequest {
    private String orderId;
    private String deliveryPartnerId;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getDeliveryPartnerId() { return deliveryPartnerId; }
    public void setDeliveryPartnerId(String deliveryPartnerId) { this.deliveryPartnerId = deliveryPartnerId; }
    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
}
