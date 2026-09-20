package com.fooddelivery.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fooddelivery.entity.DeliveryLocation;

@Repository
public interface DeliveryLocationRepository extends JpaRepository<DeliveryLocation, String> {
    Optional<DeliveryLocation> findTopByOrderIdOrderByTimestampDesc(String orderId);
}
