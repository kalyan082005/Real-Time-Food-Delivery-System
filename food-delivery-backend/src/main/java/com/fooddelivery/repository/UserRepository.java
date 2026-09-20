package com.fooddelivery.repository;
import com.fooddelivery.entity.User;
import com.fooddelivery.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;


@Repository

public interface UserRepository extends JpaRepository<User,String>{
    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.role = :role" )
    List<User> findActiveUsersByRole(@Param("role") UserRole role);

    @Query(value="SELECT * FROM users WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'",nativeQuery = true)
    List<User> findUserCreatedInLast30Days();

    @Query(value = "SELECT * FROM users WHERE to_tsvector('english', name || ' ' || email) @@ plainto_tsquery('english', :searchTerm)",
        nativeQuery = true)
    List<User> SearchUsers(@Param("searchTerm")String searchTerm);



}
