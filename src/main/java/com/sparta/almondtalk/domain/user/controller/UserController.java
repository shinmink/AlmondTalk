package com.sparta.almondtalk.domain.user.controller;

import com.sparta.almondtalk.domain.home.response.ApiResponse;
import com.sparta.almondtalk.domain.user.model.User;
import com.sparta.almondtalk.domain.user.request.ChangePasswordRequest;
import com.sparta.almondtalk.domain.user.request.NearbyRequest;
import com.sparta.almondtalk.domain.user.request.UpdateUserRequest;
import com.sparta.almondtalk.domain.user.service.UserServiceImpl;
import com.sparta.almondtalk.global.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserServiceImpl userService; // UserServiceImpl 빈을 주입받음

    // 사용자 프로필을 가져오는 핸들러
    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfileHandler(@RequestHeader("Authorization") String token)
            throws UserException {

        User user = this.userService.findUserProfile(token); // 토큰을 사용하여 사용자 프로필을 찾음
        return new ResponseEntity<User>(user, HttpStatus.OK); // 사용자 프로필과 함께 OK 상태 반환
    }

    // 사용자를 검색하는 핸들러
    @GetMapping("/{query}")
    public ResponseEntity<List<User>> searchUserHandler(@PathVariable("query") String query) {

        List<User> users = this.userService.searchUser(query); // 쿼리를 사용하여 사용자 검색
        return new ResponseEntity<List<User>>(users, HttpStatus.OK); // 검색된 사용자 목록과 함께 OK 상태 반환
    }

    // 사용자 정보를 업데이트하는 핸들러
    @PutMapping("/update")
    public ResponseEntity<ApiResponse> updateUserHandler(@RequestBody UpdateUserRequest request,
                                                         @RequestHeader("Authorization") String token) throws UserException {

        User user = this.userService.findUserProfile(token); // 토큰을 사용하여 사용자 프로필을 찾음
        this.userService.updateUser(user.getId(), request); // 사용자 ID와 요청 데이터를 사용하여 사용자 정보 업데이트

        ApiResponse response = new ApiResponse();
        response.setMessage("User updated Successfully"); // 성공 메시지 설정
        response.setStatus(true); // 상태 설정

        return new ResponseEntity<ApiResponse>(response, HttpStatus.ACCEPTED); // 응답과 함께 ACCEPTED 상태 반환
    }

    // 비밀번호 변경 핸들러
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse> changePasswordHandler(
            @RequestBody ChangePasswordRequest request,
            @RequestHeader("Authorization") String token
    ) throws UserException {
        User user = this.userService.findUserProfile(token);
        this.userService.changePassword(user.getId(), request);
        ApiResponse response = new ApiResponse();

        response.setMessage("Password changed Successfully");
        response.setStatus(true);

        return new ResponseEntity<ApiResponse>(response, HttpStatus.ACCEPTED);
    }

    // 근처 사용자 검색 엔드포인트 추가
//    @PostMapping("/nearby")
//    public ResponseEntity<List<User>> getNearbyUsers(@RequestBody NearbyRequest nearbyRequest) {
//        double latitude = nearbyRequest.getLatitude();
//        double longitude = nearbyRequest.getLongitude();
//        double radius = nearbyRequest.getRadius();
//
//        // 로그 추가로 디버깅
//        System.out.println("Latitude: " + latitude);
//        System.out.println("Longitude: " + longitude);
//        System.out.println("Radius: " + radius);
//
//
//
//        List<User> users = userService.findNearbyUsers(latitude , longitude, radius);
//        return new ResponseEntity<>(users, HttpStatus.OK);
//    }

    @GetMapping("/nearby")
    public ResponseEntity<List<User>> getNearbyUsers(
            @RequestParam(name = "latitude") double latitude,
            @RequestParam(name = "longitude") double longitude,
            @RequestParam(name = "radius", required = false, defaultValue = "5000") double radius) {

        // 로그 추가
        System.out.println("Latitude: " + latitude);
        System.out.println("Longitude: " + longitude);
        System.out.println("Radius: " + radius);

        if (latitude == 0.0 && longitude == 0.0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 잘못된 요청 반환
        }

        List<User> users = userService.findNearbyUsers(latitude, longitude, radius);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

}
