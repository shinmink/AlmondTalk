package com.sparta.almondtalk.domain.user.repository;

import com.sparta.almondtalk.domain.user.model.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {

    public User findByEmail(String email);

    @Query("select u from User u where u.name like %:query% or u.email like %:query%")
    public List<User> searchUser(@Param("query") String query);

}