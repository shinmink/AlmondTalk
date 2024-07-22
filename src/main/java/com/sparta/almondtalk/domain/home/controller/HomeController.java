package com.sparta.almondtalk.domain.home.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// HomeController 클래스: 기본 경로에 대한 요청을 처리하는 컨트롤러
@RestController
public class HomeController {

    // 루트 경로("/")에 대한 GET 요청을 처리하는 메서드
    @GetMapping("/")
    public ResponseEntity<String> home() {
        // "Welcome" 메시지와 함께 HTTP 상태 코드 200(OK)을 반환
        return new ResponseEntity<String>("Welcome", HttpStatus.OK);
    }

}
