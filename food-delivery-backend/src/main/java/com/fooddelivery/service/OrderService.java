package com.fooddelivery.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.dto.OrderItemRequest;
import com.fooddelivery.entity.Address;
import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.entity.Order;
import com.fooddelivery.entity.OrderItem;
import com.fooddelivery.entity.OrderStatus;
import com.fooddelivery.controller.OrderWebSocketController;
import com.fooddelivery.repository.AddressRepository;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderWebSocketController orderWebSocketController;
    
    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private AddressRepository addressRepository;
    
    @Autowired
    private NotificationService notificationService;

    public Order CreateOrder(String customerId, String restaurantId, List<OrderItemRequest> items, String addressId, String specialInstructions){
        Order order = new Order();
        order.setCustomer(userRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found")));
        order.setRestaurant(restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found")));
        
        // Fetch address and format it
        Address address = addressRepository.findById(addressId)
            .orElseThrow(() -> new RuntimeException("Address not found"));
        String fullAddress = String.format("%s, %s, %s %s", 
            address.getAddressLine(), address.getCity(), address.getState(), address.getZipCode());
        order.setDeliveryAddress(fullAddress);
        order.setSpecialInstructions(specialInstructions);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

          BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemReq : items) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId()).get();
            BigDecimal itemTotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setUnitPrice(menuItem.getPrice());
            orderItem.setTotalPrice(itemTotal);
            order.getItems().add(orderItem);
        }
        
        // 3. Set totals
        order.setSubtotal(subtotal);
        
        // Handle null deliveryFee - default to 0 if not set
        BigDecimal deliveryFee = order.getRestaurant().getDeliveryFee();
        if (deliveryFee == null) {
            deliveryFee = BigDecimal.ZERO;
        }
        order.setDeliveryFee(deliveryFee);
        
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.08));  // 8% tax
        order.setTax(tax);
        order.setTotalAmount(subtotal.add(deliveryFee).add(tax));
        
        // 4. Save
        Order savedOrder = orderRepository.save(order);

        
        // 5. Send notification to customer
        notificationService.sendNotification(
            customerId,
            "Order Placed!",
            "Your order #" + savedOrder.getId() + " has been placed successfully",
            "ORDER_UPDATE"
        );

        return savedOrder;
    }

    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByCustomer_Id(userId);
    }

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
    }
    
    // Update status
    public Order updateOrderStatus(String orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId).get();
        order.setStatus(newStatus);
        
        orderRepository.save(order);
        
        // Notify customer via notification + WebSocket
        notificationService.sendNotification(
            order.getCustomer().getId(),
            "Order Update",
            "Your order is now " + newStatus.toString().toLowerCase().replace("_", " "),
            "ORDER_UPDATE"
        );
        orderWebSocketController.notifyOrderUpdate(orderId, newStatus.toString());
        
        return order;
    }
}  

