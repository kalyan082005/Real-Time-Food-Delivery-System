package com.fooddelivery.service;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.fooddelivery.entity.DeliveryLocation;
import com.fooddelivery.repository.DeliveryLocationRepository;

@Service
public class LocationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private DeliveryLocationRepository locationRepository;

    public DeliveryLocation updateLocation(String orderId, String deliveryPartnerId, BigDecimal lat, BigDecimal lng) {
        DeliveryLocation location = new DeliveryLocation();
        location.setOrderId(orderId);
        location.setDeliveryPartnerId(deliveryPartnerId);
        location.setLatitude(lat);
        location.setLongitude(lng);

        DeliveryLocation saved = locationRepository.save(location);

        messagingTemplate.convertAndSend("/topic/delivery/" + orderId, saved);
        return saved;
    }

    public Optional<DeliveryLocation> getLatestLocation(String orderId) {
        return locationRepository.findTopByOrderIdOrderByTimestampDesc(orderId);
    }
}
