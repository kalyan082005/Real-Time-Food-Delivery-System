package com.fooddelivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.dto.AddressRequest;
import com.fooddelivery.entity.Address;
import com.fooddelivery.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {
    @Autowired
    private AddressService addressService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Address>> getUserAddresses(@PathVariable String userId) {
        return ResponseEntity.ok(addressService.getUserAddresses(userId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddress(@PathVariable String id) {
        return ResponseEntity.ok(addressService.getAddress(id));
    }
    
    @PostMapping("/user/{userId}")
    public ResponseEntity<Address> createAddress(
            @PathVariable String userId,
            @RequestBody AddressRequest request) {
        Address address = addressService.createAddress(
            userId,
            request.getAddressLine(),
            request.getCity(),
            request.getState(),
            request.getZipCode(),
            request.getIsDefault()
        );
        return ResponseEntity.ok(address);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(
            @PathVariable String id,
            @RequestBody AddressRequest request) {
        Address address = addressService.updateAddress(
            id,
            request.getAddressLine(),
            request.getCity(),
            request.getState(),
            request.getZipCode(),
            request.getIsDefault()
        );
        return ResponseEntity.ok(address);
    }
    
    @PutMapping("/{id}/default")
    public ResponseEntity<Address> setDefaultAddress(
            @PathVariable String id,
            @RequestBody SetDefaultRequest request) {
        Address address = addressService.setDefaultAddress(request.getUserId(), id);
        return ResponseEntity.ok(address);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable String id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok().build();
    }
    
    // Inner class for set default request
    public static class SetDefaultRequest {
        private String userId;
        
        public String getUserId() {
            return userId;
        }
        
        public void setUserId(String userId) {
            this.userId = userId;
        }
    }
}
