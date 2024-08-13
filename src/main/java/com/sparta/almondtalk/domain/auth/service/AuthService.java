package com.sparta.almondtalk.domain.auth.service;

import com.sparta.almondtalk.domain.auth.request.LoginRequest;
import com.sparta.almondtalk.domain.auth.response.AuthResponse;
import com.sparta.almondtalk.domain.user.model.User;
import com.sparta.almondtalk.global.exception.UserException;
import org.springframework.security.core.Authentication;

public interface AuthService {

    public AuthResponse signUp(User user) throws UserException;

    public AuthResponse signIn(LoginRequest request);

    public Authentication authenticate(String username, String password);

}

