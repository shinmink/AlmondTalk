package com.sparta.almondtalk.domain.user.service;

import com.sparta.almondtalk.domain.user.model.User;
import com.sparta.almondtalk.domain.user.repository.UserRepository;
import com.sparta.almondtalk.domain.user.request.ChangePasswordRequest;
import com.sparta.almondtalk.domain.user.request.UpdateUserRequest;
import com.sparta.almondtalk.global.config.TokenProvider;
import com.sparta.almondtalk.global.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository; // 사용자 저장소 의존성 주입

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenProvider tokenProvider; // 토큰 제공자 의존성 주입

    @Override
    public User findUserById(Integer id) throws UserException {
        // 사용자 ID로 사용자를 찾음. 존재하지 않으면 예외 발생.
        return this.userRepository.findById(id).orElseThrow(() -> new UserException("The requested user is not found"));
    }

    @Override
    public User findUserProfile(String jwt) throws UserException {
        // JWT에서 이메일을 추출함.
        String email = this.tokenProvider.getEmailFromToken(jwt);

        // 이메일이 없으면 잘못된 자격 증명 예외 발생.
        if (email == null) {
            throw new BadCredentialsException("Received invalid token...");
        }

        // 이메일로 사용자 찾기.
        User user = this.userRepository.findByEmail(email);

        // 사용자가 없으면 사용자 예외 발생.
        if (user == null) {
            throw new UserException("User not found with the provided email");
        }
        return user;
    }

    @Override
    public User updateUser(Integer userId, UpdateUserRequest req) throws UserException {
        // 사용자 ID로 사용자 찾기.
        User user = this.findUserById(userId);

        // 요청된 이름이 있으면 사용자 이름 업데이트.
        if (req.getName() != null) {
            user.setName(req.getName());
        }
        // 요청된 프로필이 있으면 사용자 프로필 업데이트.
        if (req.getProfile() != null) {
            user.setProfile(req.getProfile());
        }
        // 업데이트된 사용자 저장.
        return this.userRepository.save(user);
    }

    // 비밀번호 변경 로직
    @Override
    public void changePassword(Integer userId, ChangePasswordRequest request) throws UserException {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UserException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public List<User> searchUser(String query) {
        // 쿼리로 사용자 검색.
        List<User> users = this.userRepository.searchUser(query);
        return users;
    }

    //  근처 사용자 검색 메서드 추가
    @Override
    public List<User> findNearbyUsers(double latitude, double longitude, double radius) {
        return userRepository.findNearbyUsers(latitude, longitude, radius);
    }
}
