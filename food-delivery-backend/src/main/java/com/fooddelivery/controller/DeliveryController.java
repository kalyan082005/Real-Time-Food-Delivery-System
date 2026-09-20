package com.fooddelivery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.dto.LocationUpdateRequest;
import com.fooddelivery.service.LocationService;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    @Autowired
    private LocationService locationService;

    // POST /api/delivery/location  - delivery partner sends their location
    @PostMapping("/location")
    public ResponseEntity<?> updateLocation(@RequestBody LocationUpdateRequest request) {
        var saved = locationService.updateLocation(
            request.getOrderId(),
            request.getDeliveryPartnerId(),
            request.getLatitude(),
            request.getLongitude()
        );
        return ResponseEntity.ok(saved);
    }

    // GET /api/delivery/location/{orderId}  - customer polls latest location
    @GetMapping("/location/{orderId}")
    public ResponseEntity<?> getLatestLocation(@PathVariable String orderId) {
        return locationService.getLatestLocation(orderId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
