package com.fooddelivery.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fooddelivery.entity.Address;
import com.fooddelivery.entity.User;
import com.fooddelivery.repository.AddressRepository;
import com.fooddelivery.repository.UserRepository;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Address> getUserAddresses(String userId) {
        return addressRepository.findByUserId(userId);
    }
    
    public Address getAddress(String addressId) {
        return addressRepository.findById(addressId)
            .orElseThrow(() -> new RuntimeException("Address not found"));
    }
    
    @Transactional
    public Address createAddress(String userId, String addressLine, String city, 
                                 String state, String zipCode, Boolean isDefault) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // If this is set as default, unset other default addresses
        if (isDefault != null && isDefault) {
            List<Address> userAddresses = addressRepository.findByUserId(userId);
            for (Address addr : userAddresses) {
                if (addr.getIsDefault()) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            }
        }
        
        Address address = new Address();
        address.setUser(user);
        address.setAddressLine(addressLine);
        address.setCity(city);
        address.setState(state);
        address.setZipCode(zipCode);
        address.setIsDefault(isDefault != null ? isDefault : false);
        address.setCreatedAt(LocalDateTime.now());
        
        return addressRepository.save(address);
    }
    
    @Transactional
    public Address updateAddress(String addressId, String addressLine, String city, 
                                 String state, String zipCode, Boolean isDefault) {
        Address address = addressRepository.findById(addressId)
            .orElseThrow(() -> new RuntimeException("Address not found"));
        
        // If this is set as default, unset other default addresses
        if (isDefault != null && isDefault && !address.getIsDefault()) {
            List<Address> userAddresses = addressRepository.findByUserId(address.getUser().getId());
            for (Address addr : userAddresses) {
                if (addr.getIsDefault() && !addr.getId().equals(addressId)) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            }
        }
        
        if (addressLine != null) address.setAddressLine(addressLine);
        if (city != null) address.setCity(city);
        if (state != null) address.setState(state);
        if (zipCode != null) address.setZipCode(zipCode);
        if (isDefault != null) address.setIsDefault(isDefault);
        
        return addressRepository.save(address);
    }
    
    @Transactional
    public Address setDefaultAddress(String userId, String addressId) {
        Address address = addressRepository.findById(addressId)
            .orElseThrow(() -> new RuntimeException("Address not found"));
        
        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Address does not belong to user");
        }
        
        // Unset other default addresses
        List<Address> userAddresses = addressRepository.findByUserId(userId);
        for (Address addr : userAddresses) {
            if (addr.getIsDefault()) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        }
        
        address.setIsDefault(true);
        return addressRepository.save(address);
    }
    
    public void deleteAddress(String addressId) {
        if (!addressRepository.existsById(addressId)) {
            throw new RuntimeException("Address not found");
        }
        addressRepository.deleteById(addressId);
    }
}
