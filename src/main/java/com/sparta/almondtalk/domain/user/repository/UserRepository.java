package com.sparta.almondtalk.domain.user.repository;

import com.sparta.almondtalk.domain.user.model.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    public User findByEmail(String email);

    @Query("select u from User u where u.name like %:query% or u.email like %:query%")
    public List<User> searchUser(@Param("query") String query);


    @Query("SELECT u FROM User u WHERE " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(u.latitude)) * " +
            "cos(radians(u.longitude) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(u.latitude)))) < :radius")
    public List<User> findNearbyUsers(@Param("latitude") double latitude,
                               @Param("longitude") double longitude,
                               @Param("radius") double radius);
}