package com.sparta.almondtalk.domain.auth.service;

import com.sparta.almondtalk.domain.auth.request.LoginRequest;
import com.sparta.almondtalk.domain.auth.response.AuthResponse;
import com.sparta.almondtalk.domain.user.model.User;
import com.sparta.almondtalk.domain.user.repository.UserRepository;
import com.sparta.almondtalk.domain.user.service.UserService;
import com.sparta.almondtalk.global.config.CustomUserService;
import com.sparta.almondtalk.global.config.TokenProvider;
import com.sparta.almondtalk.global.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService  {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private CustomUserService customUserService;

    @Override
    public AuthResponse signUp(User user) throws UserException {
        String email = user.getEmail();
        String name = user.getName();
        String password = user.getPassword();

        User isUser = this.userRepository.findByEmail(email);
        if (isUser != null) {
            throw new UserException("Email is used with another account");
        }


        User createdUser = new User();

        createdUser.setEmail(email);
        createdUser.setName(name);
        createdUser.setLatitude(user.getLatitude());
        createdUser.setLongitude(user.getLongitude());
        createdUser.setPassword(this.passwordEncoder.encode(password));

        userRepository.save(createdUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = this.tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, true);
    }


    @Override
    public AuthResponse signIn(LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        Double latitude = request.getLatitude();  // 위도 값
        Double longitude = request.getLongitude(); // 경도 값

        Authentication authentication = this.authenticate(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new BadCredentialsException("Invalid username or password");
        }

        // 로그인할 때마다 위치 정보를 갱신합니다.
        if (latitude != null && longitude != null) { // 위치 정보가 존재하는 경우에만 갱신
            user.setLatitude(latitude); // 사용자 객체에 위도 설정
            user.setLongitude(longitude); // 사용자 객체에 경도 설정
        }

        userRepository.save(user);

        String jwt = this.tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, true);
    }

    @Override
    public Authentication authenticate(String username, String password) {
        UserDetails userDetails = this.customUserService.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password or username");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
