package com.sparta.almondtalk.domain.auth.controller;

import com.sparta.almondtalk.domain.auth.request.LoginRequest;
import com.sparta.almondtalk.domain.auth.response.AuthResponse;
import com.sparta.almondtalk.domain.auth.service.AuthService;
import com.sparta.almondtalk.domain.user.model.User;
import com.sparta.almondtalk.domain.user.repository.UserRepository;
import com.sparta.almondtalk.global.config.CustomUserService;
import com.sparta.almondtalk.global.config.TokenProvider;
import com.sparta.almondtalk.global.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// 인증 관련 요청을 처리하는 컨트롤러 클래스
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService; // AuthService 빈 주입

    // 회원가입을 처리하는 핸들러
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws UserException {
        AuthResponse response = authService.signUp(user);
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }


    // 로그인 처리를 하는 핸들러
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest request) {
        AuthResponse response = authService.signIn(request);
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }
}
