package com.sparta.almondtalk.domain.user.service;

import com.sparta.almondtalk.domain.user.model.User;
import com.sparta.almondtalk.domain.user.request.ChangePasswordRequest;
import com.sparta.almondtalk.domain.user.request.UpdateUserRequest;
import com.sparta.almondtalk.global.exception.UserException;

import java.util.List;

public interface UserService {

    public User findUserById(Integer id) throws UserException;

    public User findUserProfile(String jwt) throws UserException;

    public User updateUser(Integer userId, UpdateUserRequest req) throws UserException;

    public void changePassword(Integer userId, ChangePasswordRequest request) throws UserException;

    public List<User> searchUser(String query);

    public List<User> findNearbyUsers(double latitude, double longitude, double radius);
    }