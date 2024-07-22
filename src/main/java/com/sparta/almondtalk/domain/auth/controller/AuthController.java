package com.sparta.almondtalk.domain.auth.controller;

import com.sparta.almondtalk.domain.auth.request.LoginRequest;
import com.sparta.almondtalk.domain.auth.response.AuthResponse;
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
    private UserRepository userRepository; // UserRepository 빈을 주입받음

    @Autowired
    private PasswordEncoder passwordEncoder; // PasswordEncoder 빈을 주입받음

    @Autowired
    private TokenProvider tokenProvider; // TokenProvider 빈을 주입받음

    @Autowired
    private CustomUserService customUserService; // CustomUserService 빈을 주입받음

    // 회원가입을 처리하는 핸들러
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws UserException {
        String email = user.getEmail();
        String name = user.getName();
        String password = user.getPassword();

        User isUser = this.userRepository.findByEmail(email);
        if (isUser != null) {
            throw new UserException("Email is used with another account"); // 이메일이 이미 사용 중인 경우 예외 발생
        }
        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setName(name);
        // createdUser.setPassword(this.passwordEncoder.encode(password));
        createdUser.setPassword(password); // 비밀번호 암호화 생략

        userRepository.save(createdUser); // 사용자 정보 저장

        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication); // 인증 설정

        String jwt = this.tokenProvider.generateToken(authentication); // JWT 토큰 생성

        AuthResponse response = new AuthResponse(jwt, true); // 응답 생성

        return new ResponseEntity<AuthResponse>(response, HttpStatus.ACCEPTED); // 응답 반환
    }

    // 로그인 처리를 하는 핸들러
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest request) {

        String email = request.getEmail();
        String password = request.getPassword();
        System.out.println(email);
        System.out.println(password);

        Authentication authentication = this.authenticate(email, password); // 인증 처리
        SecurityContextHolder.getContext().setAuthentication(authentication); // 인증 설정

        String jwt = this.tokenProvider.generateToken(authentication); // JWT 토큰 생성

        AuthResponse response = new AuthResponse(jwt, true); // 응답 생성

        return new ResponseEntity<AuthResponse>(response, HttpStatus.ACCEPTED); // 응답 반환
    }

    // 사용자 인증을 처리하는 메서드
    public Authentication authenticate(String username, String password) {
        UserDetails userDetails = this.customUserService.loadUserByUsername(username); // 사용자 정보 로드

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username"); // 사용자 정보가 없을 경우 예외 발생
        }

        System.out.println(password);
        System.out.println(userDetails.getPassword());
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password or username"); // 비밀번호가 일치하지 않을 경우 예외 발생
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()); // 인증 토큰 생성
    }
}
